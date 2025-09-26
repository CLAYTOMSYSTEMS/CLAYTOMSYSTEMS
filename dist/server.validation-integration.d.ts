declare class ChatGPTValidationServer {
    private app;
    private config;
    private webhookSecret;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private verifyWebhookSignature;
    private handleChatGPTWebhook;
    private processPatchWebhook;
    private processReviewWebhook;
    private validatePatchEndpoint;
    private validateReviewEndpoint;
    private validateBatchEndpoint;
    private analyzeChatGPT;
    private reviewWithChatGPT;
    private generatePatchWithChatGPT;
    private applyPatch;
    private storeReviewResults;
    start(port?: number): void;
}
export { ChatGPTValidationServer };
//# sourceMappingURL=server.validation-integration.d.ts.map