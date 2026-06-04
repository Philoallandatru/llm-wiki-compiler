/**
 * Provider credential guard for CLI commands that call an LLM.
 *
 * The guard preserves the existing provider-specific error messages while
 * moving credential policy out of the CLI entrypoint. Read-only commands and
 * MCP tools keep their own narrower checks.
 */

import { DEFAULT_PROVIDER } from "../utils/constants.js";
import { resolveAnthropicAuthFromEnv } from "../utils/claude-settings.js";

/** API key env var required per provider. Null means no key needed. */
const PROVIDER_KEY_VARS: Record<string, string | null> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  ollama: null,
  minimax: "MINIMAX_API_KEY",
  copilot: "GITHUB_TOKEN",
};

/** Exit with a helpful message if the selected provider's API key is missing. */
export function requireProvider(): void {
  const provider = process.env.LLMWIKI_PROVIDER ?? DEFAULT_PROVIDER;
  if (provider === "anthropic") {
    assertAnthropicCredentials();
    return;
  }
  const keyVar = PROVIDER_KEY_VARS[provider];
  assertKnownProvider(provider, keyVar);
  assertProviderApiKey(provider, keyVar);
}

/** Fail with a credential-help message when neither Anthropic env var is set. */
function assertAnthropicCredentials(): void {
  const auth = resolveAnthropicAuthFromEnv();
  if (auth.apiKey || auth.authToken) return;
  console.error(
    `\x1b[31mError:\x1b[0m Anthropic credentials are required for the "anthropic" provider.\n` +
      `  Set one of: export ANTHROPIC_API_KEY=<your-key> OR export ANTHROPIC_AUTH_TOKEN=<your-token>`,
  );
  process.exit(1);
}

/** Fail when `provider` is not in `PROVIDER_KEY_VARS`. */
function assertKnownProvider(provider: string, keyVar: string | null | undefined): void {
  if (keyVar !== undefined) return;
  console.error(
    `\x1b[31mError:\x1b[0m Unknown provider "${provider}".\n` +
      `  Supported: ${Object.keys(PROVIDER_KEY_VARS).join(", ")}`,
  );
  process.exit(1);
}

/** Fail when the provider requires an API key env var and that var is unset. */
function assertProviderApiKey(provider: string, keyVar: string | null | undefined): void {
  if (!keyVar) return;
  if (process.env[keyVar]) return;
  console.error(
    `\x1b[31mError:\x1b[0m ${keyVar} environment variable is required for the "${provider}" provider.\n` +
      `  Set it with: export ${keyVar}=<your-key>`,
  );
  process.exit(1);
}
