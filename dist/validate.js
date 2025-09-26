"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTValidator = exports.chatGPTValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ChatGPTValidator {
    constructor() {
        this.patchValidator = null;
        this.reviewValidator = null;
        this.ajv = new ajv_1.default({
            allErrors: true,
            verbose: true,
            strict: false
        });
        (0, ajv_formats_1.default)(this.ajv);
        this.loadSchemas();
    }
    loadSchemas() {
        try {
            // Load patch response schema
            const patchSchemaPath = path_1.default.join(__dirname, '../schemas/patch-response.schema.json');
            const patchSchema = JSON.parse(fs_1.default.readFileSync(patchSchemaPath, 'utf8'));
            this.patchValidator = this.ajv.compile(patchSchema);
            // Load review findings schema
            const reviewSchemaPath = path_1.default.join(__dirname, '../schemas/review-findings.schema.json');
            const reviewSchema = JSON.parse(fs_1.default.readFileSync(reviewSchemaPath, 'utf8'));
            this.reviewValidator = this.ajv.compile(reviewSchema);
            console.log('✅ ChatGPT validation schemas loaded successfully');
        }
        catch (error) {
            console.error('❌ Failed to load validation schemas:', error);
            throw new Error('Schema validation setup failed');
        }
    }
    /**
     * Validate a ChatGPT patch response
     */
    validatePatchResponse(data) {
        if (!this.patchValidator) {
            return { valid: false, errors: ['Patch validator not initialized'] };
        }
        const isValid = this.patchValidator(data);
        if (isValid) {
            return {
                valid: true,
                data: data
            };
        }
        else {
            const errors = this.patchValidator.errors?.map(error => `${error.instancePath}: ${error.message}`) || ['Unknown validation error'];
            return {
                valid: false,
                errors
            };
        }
    }
    /**
     * Validate ChatGPT review findings
     */
    validateReviewFindings(data) {
        if (!this.reviewValidator) {
            return { valid: false, errors: ['Review validator not initialized'] };
        }
        const isValid = this.reviewValidator(data);
        if (isValid) {
            return {
                valid: true,
                data: data
            };
        }
        else {
            const errors = this.reviewValidator.errors?.map(error => `${error.instancePath}: ${error.message}`) || ['Unknown validation error'];
            return {
                valid: false,
                errors
            };
        }
    }
    /**
     * Security-first validation for patch responses
     */
    validateAndSecurePatch(data) {
        const validation = this.validatePatchResponse(data);
        if (!validation.valid) {
            return {
                valid: false,
                safe: false,
                errors: validation.errors
            };
        }
        const patch = validation.data;
        const securityWarnings = [];
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
    validatePatchBatch(patches) {
        const results = patches.map(patch => this.validateAndSecurePatch(patch));
        return {
            totalPatches: patches.length,
            validPatches: results.filter(r => r.valid).length,
            safePatches: results.filter(r => r.safe).length,
            results
        };
    }
}
exports.ChatGPTValidator = ChatGPTValidator;
// Export singleton instance
exports.chatGPTValidator = new ChatGPTValidator();
//# sourceMappingURL=validate.js.map