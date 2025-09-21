import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

// Types for our schemas
interface PatchResponse {
  action: 'create' | 'modify' | 'delete' | 'review';
  file_path: string;
  content?: string;
  diff?: string;
  confidence?: number;
  reasoning?: string;
  security_analysis: {
    safe: boolean;
    concerns?: string[];
    risk_level: 'low' | 'medium' | 'high' | 'critical';
  };
  metadata?: {
    timestamp?: string;
    model?: string;
    version?: string;
  };
}

interface ReviewFinding {
  type: 'security' | 'performance' | 'bug' | 'style' | 'documentation' | 'optimization';
  severity: 'info' | 'warning' | 'error' | 'critical';
  file_path: string;
  line_number?: number;
  message: string;
  suggestion?: string;
  code_snippet?: string;
  confidence?: number;
}

interface ReviewFindings {
  review_id: string;
  target_commit: string;
  findings: ReviewFinding[];
  summary: {
    total_issues: number;
    critical_count?: number;
    error_count?: number;
    warning_count?: number;
    overall_score?: number;
  };
  recommendations?: string[];
  metadata?: {
    review_timestamp?: string;
    reviewer_model?: string;
    analysis_duration?: number;
  };
}

class ChatGPTValidator {
  private ajv: Ajv;
  private patchValidator: ValidateFunction<PatchResponse> | null = null;
  private reviewValidator: ValidateFunction<ReviewFindings> | null = null;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);
    this.loadSchemas();
  }

  private loadSchemas(): void {
    try {
      // Load patch response schema
      const patchSchemaPath = path.join(__dirname, '../schemas/patch-response.schema.json');
      const patchSchema = JSON.parse(fs.readFileSync(patchSchemaPath, 'utf8'));
      this.patchValidator = this.ajv.compile<PatchResponse>(patchSchema);

      // Load review findings schema
      const reviewSchemaPath = path.join(__dirname, '../schemas/review-findings.schema.json');
      const reviewSchema = JSON.parse(fs.readFileSync(reviewSchemaPath, 'utf8'));
      this.reviewValidator = this.ajv.compile<ReviewFindings>(reviewSchema);

      console.log('✅ ChatGPT validation schemas loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load validation schemas:', error);
      throw new Error('Schema validation setup failed');
    }
  }

  /**
   * Validate a ChatGPT patch response
   */
  public validatePatchResponse(data: unknown): {
    valid: boolean;
    data?: PatchResponse;
    errors?: string[]
  } {
    if (!this.patchValidator) {
      return { valid: false, errors: ['Patch validator not initialized'] };
    }

    const isValid = this.patchValidator(data);

    if (isValid) {
      return {
        valid: true,
        data: data as PatchResponse
      };
    } else {
      const errors = this.patchValidator.errors?.map(error =>
        `${error.instancePath}: ${error.message}`
      ) || ['Unknown validation error'];

      return {
        valid: false,
        errors
      };
    }
  }

  /**
   * Validate ChatGPT review findings
   */
  public validateReviewFindings(data: unknown): {
    valid: boolean;
    data?: ReviewFindings;
    errors?: string[]
  } {
    if (!this.reviewValidator) {
      return { valid: false, errors: ['Review validator not initialized'] };
    }

    const isValid = this.reviewValidator(data);

    if (isValid) {
      return {
        valid: true,
        data: data as ReviewFindings
      };
    } else {
      const errors = this.reviewValidator.errors?.map(error =>
        `${error.instancePath}: ${error.message}`
      ) || ['Unknown validation error'];

      return {
        valid: false,
        errors
      };
    }
  }

  /**
   * Security-first validation for patch responses
   */
  public validateAndSecurePatch(data: unknown): {
    valid: boolean;
    safe: boolean;
    data?: PatchResponse;
    errors?: string[];
    securityWarnings?: string[];
  } {
    const validation = this.validatePatchResponse(data);

    if (!validation.valid) {
      return {
        valid: false,
        safe: false,
        errors: validation.errors
      };
    }

    const patch = validation.data!;
    const securityWarnings: string[] = [];

    // Security checks
    if (!patch.security_analysis.safe) {
      securityWarnings.push('Patch marked as unsafe by AI analysis');
    }

    if (patch.security_analysis.risk_level === 'high' || patch.security_analysis.risk_level === 'critical') {
      securityWarnings.push(`High risk level detected: ${patch.security_analysis.risk_level}`);
    }

    // Path traversal protection
    if (patch.file_path.includes('..') || patch.file_path.includes('~')) {
      securityWarnings.push('Potential path traversal detected in file_path');
    }

    // Sensitive file protection
    const sensitivePatterns = [
      /\.env/i,
      /config/i,
      /secret/i,
      /password/i,
      /key/i,
      /token/i
    ];

    if (sensitivePatterns.some(pattern => pattern.test(patch.file_path))) {
      securityWarnings.push('Attempting to modify sensitive file');
    }

    const isSafe = securityWarnings.length === 0;

    return {
      valid: true,
      safe: isSafe,
      data: patch,
      securityWarnings: securityWarnings.length > 0 ? securityWarnings : undefined
    };
  }

  /**
   * Batch validate multiple patches
   */
  public validatePatchBatch(patches: unknown[]): {
    totalPatches: number;
    validPatches: number;
    safePatches: number;
    results: ReturnType<typeof this.validateAndSecurePatch>[];
  } {
    const results = patches.map(patch => this.validateAndSecurePatch(patch));

    return {
      totalPatches: patches.length,
      validPatches: results.filter(r => r.valid).length,
      safePatches: results.filter(r => r.safe).length,
      results
    };
  }
}

// Export singleton instance
export const chatGPTValidator = new ChatGPTValidator();

// Export types
export type { PatchResponse, ReviewFindings, ReviewFinding };

// Export class for custom instances
export { ChatGPTValidator };