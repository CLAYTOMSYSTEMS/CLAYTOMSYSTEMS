import Ajv, { ValidateFunction } from "ajv";
// Si usas TypeScript, activa "resolveJsonModule" en tsconfig para importar JSON directamente.
// import patchSchema from "../schemas/patch-response.schema.json";
// import reviewSchema from "../schemas/review-findings.schema.json";

// Alternativa en runtime:
const patchSchema = require("../schemas/patch-response.schema.json");
const reviewSchema = require("../schemas/review-findings.schema.json");

const ajv = new Ajv({ allErrors: true, removeAdditional: false });

const validatePatch: ValidateFunction = ajv.compile(patchSchema);
const validateReview: ValidateFunction = ajv.compile(reviewSchema);

export function validatePatchResponse(payload: unknown) {
  const valid = validatePatch(payload);
  return {
    valid: Boolean(valid),
    errors: valid ? null : validatePatch.errors
  };
}

export function validateReviewResponse(payload: unknown) {
  const valid = validateReview(payload);
  return {
    valid: Boolean(valid),
    errors: valid ? null : validateReview.errors
  };
}

// Uso:
// const result = validatePatchResponse(theObjectFromAI);
// if (!result.valid) console.error(result.errors);