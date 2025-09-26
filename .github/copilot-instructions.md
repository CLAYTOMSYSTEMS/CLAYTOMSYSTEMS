# GitHub Copilot Instructions for CLAYTOMSYSTEMS Repository

## Repository Overview

This is the **SANDRA IA 7.0** repository - an advanced AI middleware system with ChatGPT integration developed by ClayTom Systems. The repository contains:

- **Core AI Middleware**: TypeScript/Node.js application with Express server
- **Validation Engine**: AJV-based JSON schema validation for AI responses  
- **Website Projects**: Multiple web applications including guestsvalencia.es
- **Automation Workflows**: GitHub Actions for AI-powered code extraction
- **Enterprise Architecture**: Comprehensive business logic and API designs

## Technology Stack

### Primary Technologies
- **Language**: TypeScript (ES2020 target)
- **Runtime**: Node.js ≥18.0.0
- **Framework**: Express.js for API server
- **Validation**: AJV with JSON Schema
- **Security**: Helmet, CORS, JWT rotation
- **Build Tool**: TypeScript compiler (tsc)
- **Package Manager**: npm ≥8.0.0

### Key Dependencies
- `ajv` + `ajv-formats` - JSON schema validation
- `express` - Web framework
- `cors`, `helmet` - Security middleware
- `dotenv` - Environment configuration
- `node-fetch` - HTTP client

## Development Guidelines

### Code Style & Standards

1. **TypeScript Best Practices**
   - Use strict mode configuration
   - Prefer explicit types over `any`
   - Use interfaces for object structures
   - Enable all strict compiler options

2. **API Design**
   - RESTful endpoints with consistent naming
   - Use proper HTTP status codes
   - Implement comprehensive error handling
   - Add request/response validation with AJV schemas

3. **Security Requirements**
   - Never commit secrets or API keys
   - Use environment variables for configuration
   - Implement rate limiting and CORS policies
   - Validate all external inputs
   - Use secure headers (Helmet.js)

### Project Structure

```
src/
├── server.validation-integration.ts  # Main Express server
├── validate.ts                      # AJV validation logic
schemas/                             # JSON schemas for validation
websites/                            # Web application projects
.github/
├── workflows/                       # GitHub Actions
└── copilot-instructions.md         # This file
```

### Environment Configuration

Required environment variables:
```bash
# Core API Configuration
CHATGPT_API_KEY=sk-proj-your-key-here
CHATGPT_WEBHOOK_SECRET=secure-random-string
GITHUB_TOKEN=ghp_your-access-token

# Repository Settings
GITHUB_REPO_OWNER=CLAYTOMSYSTEMS
GITHUB_REPO_NAME=CLAYTOMSYSTEMS

# Optional: ElevenLabs (for voice features)
ELEVENLABS_API_KEY=sk-...
ELEVENLABS_VOICE_ID=voice-id-here
```

## AI Integration Guidelines

### ChatGPT Integration
- Use the `/webhook/chatgpt` endpoint for receiving AI responses
- Validate all AI-generated content using AJV schemas
- Implement security checks for path traversal and sensitive files
- Apply patches automatically only for low-risk changes

### Validation Patterns  
```typescript
// Example validation pattern
const result = chatGPTValidator.validatePatchResponse(response);
if (!result.valid) {
  console.error('Validation failed:', result.errors);
  return; // Don't apply invalid patches
}
```

### Security Considerations
- Block high-risk file modifications automatically
- Log all AI interactions for audit purposes  
- Implement rate limiting on AI endpoints
- Use webhook secrets for authentication

## Development Workflow

### Setup Instructions
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Development mode
npm run dev

# Build for production
npm run build
npm start
```

### Testing & Quality
```bash
# Run type checking
npm run build

# Run linting (configure ESLint first)
npm run lint

# Run tests (add tests as needed)
npm test
```

### Docker Support
```bash
# Build Docker image
npm run docker:build

# Run containerized application
npm run docker:run
```

## Business Context

### Core Mission
SANDRA IA 7.0 is designed to be an enterprise-grade AI middleware that:
- Validates and secures AI-generated code patches
- Provides automated code review capabilities
- Integrates with multiple AI providers (ChatGPT, ElevenLabs)
- Supports real-time voice interactions
- Manages 400+ autonomous development chatbots

### Architecture Principles
- **Security First**: All AI interactions must be validated and secured
- **Scalability**: Support for multiple tenants and high traffic
- **Reliability**: 99.9% uptime with comprehensive error handling  
- **Modularity**: Clean separation between validation, integration, and business logic

## File Modification Guidelines

### High-Risk Files (Require Manual Review)
- `package.json` - Dependency changes
- `.env*` - Environment configuration
- Security-related configurations
- Database schemas or migration files

### Medium-Risk Files (Automatic with Validation)
- TypeScript source files in `src/`
- JSON schemas in `schemas/`
- Documentation files (`.md`)

### Low-Risk Files (Automatic Application)
- Test files (`*.test.ts`, `*.spec.ts`)
- Documentation updates
- Non-executable configuration files

## API Endpoints Reference

### Core Endpoints
- `POST /webhook/chatgpt` - Receive ChatGPT webhooks
- `GET /health` - System health check
- `POST /validate/patch` - Validate individual patch
- `POST /validate/batch` - Batch validation

### Integration Endpoints  
- `POST /chatgpt/analyze` - Code analysis
- `POST /chatgpt/review` - Automated review
- `POST /chatgpt/patch` - Generate patches

## Troubleshooting Common Issues

### Build Issues
- Ensure Node.js ≥18.0.0 is installed
- Run `npm install` to install dependencies
- Check TypeScript configuration in `tsconfig.json`

### Validation Errors
- Verify JSON schemas in `schemas/` directory
- Check AJV configuration in `validate.ts`
- Review error logs for specific validation failures

### API Integration Issues
- Verify environment variables are set correctly
- Check network connectivity to external APIs
- Review webhook authentication settings

## Contributing Guidelines

1. **Before Making Changes**
   - Understand the business context and security implications
   - Review existing code patterns and architecture
   - Test changes thoroughly in development environment

2. **Code Changes**
   - Follow existing TypeScript patterns
   - Add appropriate error handling and validation
   - Update documentation if needed
   - Ensure backward compatibility

3. **Security Reviews**
   - Never bypass validation for AI-generated content
   - Review all external API integrations
   - Test error handling and edge cases
   - Verify environment variable usage

## Additional Resources

- Repository README.md for detailed setup instructions
- `schemas/` directory for validation examples
- `.github/workflows/` for CI/CD pipeline configuration
- Business documentation in various `.md` files throughout the repository

---

**Note**: This repository handles sensitive AI integrations and business logic. Always prioritize security and validation in any modifications. When in doubt, prefer manual review over automatic application of changes.