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
declare class ChatGPTValidator {
    private ajv;
    private patchValidator;
    private reviewValidator;
    constructor();
    private loadSchemas;
    /**
     * Validate a ChatGPT patch response
     */
    validatePatchResponse(data: unknown): {
        valid: boolean;
        data?: PatchResponse;
        errors?: string[];
    };
    /**
     * Validate ChatGPT review findings
     */
    validateReviewFindings(data: unknown): {
        valid: boolean;
        data?: ReviewFindings;
        errors?: string[];
    };
    /**
     * Security-first validation for patch responses
     */
    validateAndSecurePatch(data: unknown): {
        valid: boolean;
        safe: boolean;
        data?: PatchResponse;
        errors?: string[];
        securityWarnings?: string[];
    };
    /**
     * Batch validate multiple patches
     */
    validatePatchBatch(patches: unknown[]): {
        totalPatches: number;
        validPatches: number;
        safePatches: number;
        results: Array<ReturnType<ChatGPTValidator['validateAndSecurePatch']>>;
    };
}
export declare const chatGPTValidator: ChatGPTValidator;
export type { PatchResponse, ReviewFindings, ReviewFinding };
export { ChatGPTValidator };
//# sourceMappingURL=validate.d.ts.map