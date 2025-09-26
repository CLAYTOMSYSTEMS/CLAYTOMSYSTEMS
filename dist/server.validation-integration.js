"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTValidationServer = void 0;
const express_1 = __importDefault(require("express"));
const validate_1 = require("./validate");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ChatGPTValidationServer {
    constructor() {
        this.app = (0, express_1.default)();
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
    setupMiddleware() {
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
        // CORS
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Hub-Signature-256');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
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
        this.app.use((error, req, res, next) => {
            console.error('❌ Server error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
    }
    verifyWebhookSignature(req, res, next) {
        const signature = req.headers['x-hub-signature-256'];
        if (!signature) {
            res.status(401).json({ error: 'Missing webhook signature' });
            return;
        }
        const payload = JSON.stringify(req.body);
        const expectedSignature = 'sha256=' + crypto_1.default
            .createHmac('sha256', this.webhookSecret)
            .update(payload)
            .digest('hex');
        if (signature !== expectedSignature) {
            res.status(401).json({ error: 'Invalid webhook signature' });
            return;
        }
        next();
    }
    async handleChatGPTWebhook(req, res) {
        try {
            const payload = req.body;
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
        }
        catch (error) {
            console.error('❌ Webhook processing error:', error);
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }
    async processPatchWebhook(payload) {
        if (!payload.patches || !Array.isArray(payload.patches)) {
            throw new Error('Invalid patches in webhook payload');
        }
        const batchResult = validate_1.chatGPTValidator.validatePatchBatch(payload.patches);
        console.log(`📊 Patch validation results:`);
        console.log(`  Total patches: ${batchResult.totalPatches}`);
        console.log(`  Valid patches: ${batchResult.validPatches}`);
        console.log(`  Safe patches: ${batchResult.safePatches}`);
        // Apply safe patches automatically
        for (const result of batchResult.results) {
            if (result.valid && result.safe && result.data) {
                await this.applyPatch(result.data);
            }
            else {
                console.warn(`⚠️ Skipping unsafe patch: ${result.securityWarnings?.join(', ')}`);
            }
        }
    }
    async processReviewWebhook(payload) {
        if (!payload.review_data) {
            throw new Error('Invalid review data in webhook payload');
        }
        const validation = validate_1.chatGPTValidator.validateReviewFindings(payload.review_data);
        if (!validation.valid) {
            throw new Error(`Review validation failed: ${validation.errors?.join(', ')}`);
        }
        console.log(`📋 Review findings processed for commit: ${validation.data?.target_commit}`);
        console.log(`  Total issues: ${validation.data?.summary.total_issues}`);
        // Store review results
        await this.storeReviewResults(validation.data);
    }
    async validatePatchEndpoint(req, res) {
        try {
            const result = validate_1.chatGPTValidator.validateAndSecurePatch(req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: 'Validation failed', details: error });
        }
    }
    async validateReviewEndpoint(req, res) {
        try {
            const result = validate_1.chatGPTValidator.validateReviewFindings(req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: 'Validation failed', details: error });
        }
    }
    async validateBatchEndpoint(req, res) {
        try {
            const { patches } = req.body;
            if (!Array.isArray(patches)) {
                res.status(400).json({ error: 'Expected patches array' });
                return;
            }
            const result = validate_1.chatGPTValidator.validatePatchBatch(patches);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: 'Batch validation failed', details: error });
        }
    }
    async analyzeChatGPT(req, res) {
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
                analysis: data.choices?.[0]?.message?.content || 'No analysis generated',
                usage: data.usage,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            res.status(500).json({ error: 'ChatGPT analysis failed', details: error });
        }
    }
    async reviewWithChatGPT(req, res) {
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
                const validation = validate_1.chatGPTValidator.validateReviewFindings(reviewData);
                res.json({
                    valid: validation.valid,
                    review: validation.data,
                    errors: validation.errors,
                    usage: data.usage,
                    timestamp: new Date().toISOString()
                });
            }
            catch (parseError) {
                res.json({
                    valid: false,
                    raw_review: reviewText,
                    parse_error: parseError,
                    usage: data.usage,
                    timestamp: new Date().toISOString()
                });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'ChatGPT review failed', details: error });
        }
    }
    async generatePatchWithChatGPT(req, res) {
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
                const validation = validate_1.chatGPTValidator.validateAndSecurePatch(patchData);
                res.json({
                    valid: validation.valid,
                    safe: validation.safe,
                    patch: validation.data,
                    errors: validation.errors,
                    security_warnings: validation.securityWarnings,
                    usage: data.usage,
                    timestamp: new Date().toISOString()
                });
            }
            catch (parseError) {
                res.json({
                    valid: false,
                    raw_patch: patchText,
                    parse_error: parseError,
                    usage: data.usage,
                    timestamp: new Date().toISOString()
                });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'ChatGPT patch generation failed', details: error });
        }
    }
    async applyPatch(patch) {
        console.log(`🔧 Applying patch to: ${patch.file_path}`);
        try {
            const fullPath = path_1.default.resolve(patch.file_path);
            // Security check - ensure path is within project
            const projectRoot = process.cwd();
            if (!fullPath.startsWith(projectRoot)) {
                throw new Error('Path traversal attempt blocked');
            }
            switch (patch.action) {
                case 'create':
                    if (patch.content) {
                        await fs_1.default.promises.writeFile(fullPath, patch.content, 'utf8');
                        console.log(`✅ Created file: ${patch.file_path}`);
                    }
                    break;
                case 'modify':
                    if (patch.content) {
                        await fs_1.default.promises.writeFile(fullPath, patch.content, 'utf8');
                        console.log(`✅ Modified file: ${patch.file_path}`);
                    }
                    break;
                case 'delete':
                    await fs_1.default.promises.unlink(fullPath);
                    console.log(`✅ Deleted file: ${patch.file_path}`);
                    break;
                default:
                    console.log(`ℹ️ No action taken for: ${patch.action}`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to apply patch to ${patch.file_path}:`, error);
            throw error;
        }
    }
    async storeReviewResults(review) {
        const resultsDir = path_1.default.join(process.cwd(), 'reviews');
        await fs_1.default.promises.mkdir(resultsDir, { recursive: true });
        const filename = `review-${review.review_id}-${Date.now()}.json`;
        const filepath = path_1.default.join(resultsDir, filename);
        await fs_1.default.promises.writeFile(filepath, JSON.stringify(review, null, 2), 'utf8');
        console.log(`💾 Stored review results: ${filename}`);
    }
    start(port = 3000) {
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
exports.ChatGPTValidationServer = ChatGPTValidationServer;
// Auto-start if run directly
if (require.main === module) {
    const server = new ChatGPTValidationServer();
    const port = parseInt(process.env.PORT || '3000');
    server.start(port);
}
//# sourceMappingURL=server.validation-integration.js.map