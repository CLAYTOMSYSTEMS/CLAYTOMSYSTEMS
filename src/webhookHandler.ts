import { Request, Response } from "express";
import crypto from "crypto";
import { askModel } from "./openaiClient";
import { getInstallationOctokit } from "./githubApp";

function verifySignature(req: Request) {
  const secret = process.env.WEBHOOK_SECRET!;
  const signature = req.get("x-hub-signature-256") || "";
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expected = "sha256=" + hmac.digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); } catch { return false; }
}

export default async function webhookHandler(req: Request, res: Response) {
  try {
    if (!verifySignature(req)) { return res.status(401).send("Signature mismatch"); }

    const event = req.get("x-github-event") || "";
    if (event === "issues" && req.body.action === "opened") {
      const issue = req.body.issue;
      const prompt = `Genera un comentario inicial breve, amable y profesional para el issue titulado: "${issue.title}" y con este cuerpo: "${issue.body}"`;
      const reply = await askModel(prompt);

      const octokit = await getInstallationOctokit();
      await octokit.issues.createComment({ owner: req.body.repository.owner.login, repo: req.body.repository.name, issue_number: issue.number, body: reply });
    }

    res.status(200).send("OK");
  } catch (err: any) { console.error(err); res.status(500).send("Error interno"); }
}