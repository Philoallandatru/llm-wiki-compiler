/**
 * Commander registration for querying and maintenance commands.
 *
 * These commands either ask the compiled wiki a question or maintain generated
 * content quality through watch and lint workflows.
 */

import type { Command } from "commander";
import lintCommand from "../commands/lint.js";
import queryCommand from "../commands/query.js";
import watchCommand from "../commands/watch.js";
import { applyLanguageOption, runCliAction } from "./action-utils.js";
import { requireProvider } from "./provider-guard.js";

interface QueryCliOptions {
  save?: boolean;
  debug?: boolean;
  lang?: string;
}

/** Register query, watch, and lint commands. */
export function registerQueryCommands(program: Command): void {
  registerQueryCommand(program);
  registerWatchCommand(program);
  registerLintCommand(program);
}

/** Register `query <question>`. */
function registerQueryCommand(program: Command): void {
  program
    .command("query <question>")
    .description("Ask a question against the wiki")
    .option("--save", "Save the answer as a wiki page")
    .option("--debug", "Print which pages and chunks were selected and their scores")
    .option("--lang <code>", "Target language for the answer (e.g. \"Chinese\", \"ja\", \"zh-CN\"). Equivalent to setting LLMWIKI_OUTPUT_LANG.")
    .action((question: string, options: QueryCliOptions) =>
      runCliAction(() => runQuery(question, options)),
    );
}

/** Register `watch`. */
function registerWatchCommand(program: Command): void {
  program
    .command("watch")
    .description("Watch sources/ and auto-recompile on changes")
    .action(() => runCliAction(() => runWatch()));
}

/** Register `lint`. */
function registerLintCommand(program: Command): void {
  program
    .command("lint")
    .description("Run rule-based quality checks against the wiki")
    .action(() => runCliAction(() => lintCommand()));
}

/** Run the query command after applying shared language and credential policy. */
async function runQuery(question: string, options: QueryCliOptions): Promise<void> {
  applyLanguageOption(options.lang);
  requireProvider();
  await queryCommand(process.cwd(), question, options);
}

/** Run watch after checking provider credentials. */
async function runWatch(): Promise<void> {
  requireProvider();
  await watchCommand();
}
