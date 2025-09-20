import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export async function getInstallationOctokit() {
  const auth = createAppAuth({ appId: process.env.GITHUB_APP_ID!, privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n"), installationId: Number(process.env.GITHUB_INSTALLATION_ID!) });

  const installationAuthentication = await auth({ type: "installation" });
  const octokit = new Octokit({ auth: installationAuthentication.token });
  return octokit;
}