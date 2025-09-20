// Fragmento para integrar validación en tu webhook handler.
// Inserta esto donde recibes/parses el payload JSON devuelto por la IA (aiPayload).
import { validatePatchResponse } from "./validate";

export async function handleAiPayload(aiPayload: any, { octokit, repoOwner, repoName, prNumber, res }: any) {
  const validation = validatePatchResponse(aiPayload);
  if (!validation.valid) {
    console.error("AI patch payload invalid:", validation.errors);
    // Comentar en el PR original para notificar al autor y abortar
    await octokit.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: prNumber,
      body: `⚠️ La respuesta automatizada de IA no cumplió el esquema requerido y no se aplicó.\n\nErrores de validación:\n\n${JSON.stringify(validation.errors, null, 2)}\n\nPor favor, revisa la salida de la IA o ajusta el prompt.`
    });
    return { applied: false, reason: "validation_failed", errors: validation.errors };
  }

  // Si pasa, continúa con el flujo existente de applyPatchAndOpenPR(...)
  return { applied: true };
}