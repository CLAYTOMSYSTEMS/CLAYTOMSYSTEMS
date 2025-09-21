import express, { Request, Response, NextFunction } from 'express';
import { chatGPTValidator, PatchResponse, ReviewFindings } from './validate';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface ChatGPTWebhookPayload {
  action: string;
  repository: {
    name: string;
    full_name: string;
  };
  pull_request?: {
    number: number;
    head: {
      sha: string;
    };
  };
  patches?: unknown[];
  review_data?: unknown;
}

interface ChatGPTAPIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class ChatGPTValidationServer {
  private app: express.Application;
  private config: ChatGPTAPIConfig;
  private webhookSecret: string;

  constructor() {
    this.app = express();
    this.webhookSecret = process.env.CHATGPT_WEBHOOK_SECRET || 'default-secret';
    this.config = {
      apiKey: process.env.CHATGPT_API_KEY || '',
      baseURL: process.env.CHATGPT_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.CHATGPT_MODEL || 'gpt-4-turbo',
      maxTokens: parseInt(process.env.CHATGPT_MAX_TOKENS || '4096'),
      temperature: parseFloat(process.env.CHATGPT_TEMPERATURE || '0.3')
    };

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // CORS
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Hub-Signature-256');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        validator: 'ready'
      });
    });

    // Webhook endpoint for ChatGPT patches
    this.app.post('/webhook/chatgpt', this.verifyWebhookSignature.bind(this), this.handleChatGPTWebhook.bind(this));

    // Direct validation endpoints
    this.app.post('/validate/patch', this.validatePatchEndpoint.bind(this));
    this.app.post('/validate/review', this.validateReviewEndpoint.bind(this));
    this.app.post('/validate/batch', this.validateBatchEndpoint.bind(this));

    // ChatGPT integration endpoints
    this.app.post('/chatgpt/analyze', this.analyzeChatGPT.bind(this));
    this.app.post('/chatgpt/review', this.reviewWithChatGPT.bind(this));
    this.app.post('/chatgpt/patch', this.generatePatchWithChatGPT.bind(this));

    // Error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('❌ Server error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  private verifyWebhookSignature(req: Request, res: Response, next: NextFunction): void {
    const signature = req.headers['x-hub-signature-256'] as string;

    if (!signature) {
      res.status(401).json({ error: 'Missing webhook signature' });
      return;
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      res.status(401).json({ error: 'Invalid webhook signature' });
      return;
    }

    next();
  }

  private async handleChatGPTWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload: ChatGPTWebhookPayload = req.body;
      console.log(`🔄 Processing ChatGPT webhook: ${payload.action}`);

      switch (payload.action) {
        case 'patch_generated':
          await this.processPatchWebhook(payload);
          break;
        case 'review_completed':
          await this.processReviewWebhook(payload);
          break;
        default:
          console.log(`ℹ️ Unhandled webhook action: ${payload.action}`);
      }

      res.json({ status: 'processed', timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  private async processPatchWebhook(payload: ChatGPTWebhookPayload): Promise<void> {
    if (!payload.patches || !Array.isArray(payload.patches)) {
      throw new Error('Invalid patches in webhook payload');
    }

    const batchResult = chatGPTValidator.validatePatchBatch(payload.patches);

    console.log(`📊 Patch validation results:`);
    console.log(`  Total patches: ${batchResult.totalPatches}`);
    console.log(`  Valid patches: ${batchResult.validPatches}`);
    console.log(`  Safe patches: ${batchResult.safePatches}`);

    // Apply safe patches automatically
    for (const result of batchResult.results) {
      if (result.valid && result.safe && result.data) {
        await this.applyPatch(result.data);
      } else {
        console.warn(`⚠️ Skipping unsafe patch: ${result.securityWarnings?.join(', ')}`);
      }
    }
  }

  private async processReviewWebhook(payload: ChatGPTWebhookPayload): Promise<void> {
    if (!payload.review_data) {
      throw new Error('Invalid review data in webhook payload');
    }

    const validation = chatGPTValidator.validateReviewFindings(payload.review_data);

    if (!validation.valid) {
      throw new Error(`Review validation failed: ${validation.errors?.join(', ')}`);
    }

    console.log(`📋 Review findings processed for commit: ${validation.data?.target_commit}`);
    console.log(`  Total issues: ${validation.data?.summary.total_issues}`);

    // Store review results
    await this.storeReviewResults(validation.data!);
  }

  private async validatePatchEndpoint(req: Request, res: Response): Promise<void> {
    try {
      const result = chatGPTValidator.validateAndSecurePatch(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error });
    }
  }

  private async validateReviewEndpoint(req: Request, res: Response): Promise<void> {
    try {
      const result = chatGPTValidator.validateReviewFindings(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error });
    }
  }

  private async validateBatchEndpoint(req: Request, res: Response): Promise<void> {
    try {
      const { patches } = req.body;
      if (!Array.isArray(patches)) {
        res.status(400).json({ error: 'Expected patches array' });
        return;
      }

      const result = chatGPTValidator.validatePatchBatch(patches);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Batch validation failed', details: error });
    }
  }

  private async analyzeChatGPT(req: Request, res: Response): Promise<void> {
    try {
      const { code, prompt, options = {} } = req.body;

      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a code analysis expert. Analyze the provided code and return findings in the specified JSON schema format.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nCode to analyze:\n\`\`\`\n${code}\n\`\`\``
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          ...options
        })
      });

      const data = await response.json();
      res.json({
        analysis: data.choices[0]?.message?.content || 'No analysis generated',
        usage: data.usage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'ChatGPT analysis failed', details: error });
    }
  }

  private async reviewWithChatGPT(req: Request, res: Response): Promise<void> {
    try {
      const { code, commit_sha, options = {} } = req.body;

      const prompt = `Review this code for security issues, bugs, performance problems, and style violations. Return results in the review-findings JSON schema format with review_id, target_commit, findings array, and summary.`;

      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a senior code reviewer. Provide detailed code review findings in the specified JSON schema format.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nCommit SHA: ${commit_sha}\n\nCode:\n\`\`\`\n${code}\n\`\`\``
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          ...options
        })
      });

      const data = await response.json();
      const reviewText = data.choices[0]?.message?.content;

      try {
        const reviewData = JSON.parse(reviewText);
        const validation = chatGPTValidator.validateReviewFindings(reviewData);

        res.json({
          valid: validation.valid,
          review: validation.data,
          errors: validation.errors,
          usage: data.usage,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        res.json({
          valid: false,
          raw_review: reviewText,
          parse_error: parseError,
          usage: data.usage,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'ChatGPT review failed', details: error });
    }
  }

  private async generatePatchWithChatGPT(req: Request, res: Response): Promise<void> {
    try {
      const { code, issue_description, file_path, options = {} } = req.body;

      const prompt = `Generate a patch to fix this issue: ${issue_description}\n\nReturn the result in the patch-response JSON schema format with action, file_path, content/diff, confidence, reasoning, and security_analysis.`;

      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert software engineer. Generate secure, well-tested patches in the specified JSON schema format.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nFile: ${file_path}\n\nCode:\n\`\`\`\n${code}\n\`\`\``
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          ...options
        })
      });

      const data = await response.json();
      const patchText = data.choices[0]?.message?.content;

      try {
        const patchData = JSON.parse(patchText);
        const validation = chatGPTValidator.validateAndSecurePatch(patchData);

        res.json({
          valid: validation.valid,
          safe: validation.safe,
          patch: validation.data,
          errors: validation.errors,
          security_warnings: validation.securityWarnings,
          usage: data.usage,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        res.json({
          valid: false,
          raw_patch: patchText,
          parse_error: parseError,
          usage: data.usage,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'ChatGPT patch generation failed', details: error });
    }
  }

  private async applyPatch(patch: PatchResponse): Promise<void> {
    console.log(`🔧 Applying patch to: ${patch.file_path}`);

    try {
      const fullPath = path.resolve(patch.file_path);

      // Security check - ensure path is within project
      const projectRoot = process.cwd();
      if (!fullPath.startsWith(projectRoot)) {
        throw new Error('Path traversal attempt blocked');
      }

      switch (patch.action) {
        case 'create':
          if (patch.content) {
            await fs.promises.writeFile(fullPath, patch.content, 'utf8');
            console.log(`✅ Created file: ${patch.file_path}`);
          }
          break;
        case 'modify':
          if (patch.content) {
            await fs.promises.writeFile(fullPath, patch.content, 'utf8');
            console.log(`✅ Modified file: ${patch.file_path}`);
          }
          break;
        case 'delete':
          await fs.promises.unlink(fullPath);
          console.log(`✅ Deleted file: ${patch.file_path}`);
          break;
        default:
          console.log(`ℹ️ No action taken for: ${patch.action}`);
      }
    } catch (error) {
      console.error(`❌ Failed to apply patch to ${patch.file_path}:`, error);
      throw error;
    }
  }

  private async storeReviewResults(review: ReviewFindings): Promise<void> {
    const resultsDir = path.join(process.cwd(), 'reviews');
    await fs.promises.mkdir(resultsDir, { recursive: true });

    const filename = `review-${review.review_id}-${Date.now()}.json`;
    const filepath = path.join(resultsDir, filename);

    await fs.promises.writeFile(filepath, JSON.stringify(review, null, 2), 'utf8');
    console.log(`💾 Stored review results: ${filename}`);
  }

  public start(port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`🚀 ChatGPT Validation Server running on port ${port}`);
      console.log(`📋 Endpoints:`);
      console.log(`  GET  /health`);
      console.log(`  POST /webhook/chatgpt`);
      console.log(`  POST /validate/patch`);
      console.log(`  POST /validate/review`);
      console.log(`  POST /validate/batch`);
      console.log(`  POST /chatgpt/analyze`);
      console.log(`  POST /chatgpt/review`);
      console.log(`  POST /chatgpt/patch`);
    });
  }
}

// Export for use
export { ChatGPTValidationServer };

// Auto-start if run directly
if (require.main === module) {
  const server = new ChatGPTValidationServer();
  const port = parseInt(process.env.PORT || '3000');
  server.start(port);
}