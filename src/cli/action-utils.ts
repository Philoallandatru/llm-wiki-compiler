/**
 * Shared helpers for Commander action callbacks.
 *
 * CLI registrars use these small utilities to keep error formatting and
 * language-option handling consistent while each registrar owns only the
 * command shape for its own feature area.
 */

/** Run a CLI action and exit with the standard formatted error on failure. */
export async function runCliAction(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (err) {
    console.error(`\x1b[31mError:\x1b[0m ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

/**
 * Apply the --lang CLI option by setting LLMWIKI_OUTPUT_LANG so prompt
 * builders pick it up. Explicit flags win over inherited environment values.
 */
export function applyLanguageOption(lang: string | undefined): void {
  if (!lang || lang.trim().length === 0) return;
  process.env.LLMWIKI_OUTPUT_LANG = lang.trim();
}
