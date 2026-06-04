/**
 * Commander registration for viewing and compiling wiki projects.
 *
 * This module owns the commands that mutate or inspect generated wiki output:
 * local viewer startup, single compile, and batch compile.
 */

import type { Command } from "commander";
import batchCompileCommand, { DEFAULT_BATCH_SIZE } from "../commands/batch-compile.js";
import compileCommand from "../commands/compile.js";
import viewCommand from "../commands/view.js";
import { applyLanguageOption, runCliAction } from "./action-utils.js";
import { requireProvider } from "./provider-guard.js";

interface CompileCliOptions {
  review?: boolean;
  lang?: string;
  project?: string;
  extractionCache?: boolean;
  refreshExtractionCache?: boolean;
  embeddings?: boolean;
}

interface BatchCompileCliOptions {
  batch?: number;
  project?: string;
  extractionCache?: boolean;
  refreshExtractionCache?: boolean;
  embeddings?: boolean;
}

/** Register view, compile, and batch-compile commands. */
export function registerCompileCommands(program: Command): void {
  registerViewCommand(program);
  registerCompileCommand(program);
  registerBatchCompileCommand(program);
}

/** Register `view`. */
function registerViewCommand(program: Command): void {
  program
    .command("view")
    .description("Start a local read-only web viewer for wiki projects")
    .option("--port <port>", "Port to bind (default 0 - OS-assigned)")
    .option("--host <host>", "Host to bind (requires --allow-lan; default 127.0.0.1)")
    .option("--allow-lan", "Bind beyond loopback (requires --host); off by default for privacy")
    .option("--open", "Open the viewer in the default browser after startup")
    .option("-p, --project <id>", "View a specific project (default: active project)")
    .option("--all", "View all projects with project switcher")
    .action((options) => runCliAction(() => viewCommand(options)));
}

/** Register `compile`. */
function registerCompileCommand(program: Command): void {
  program
    .command("compile")
    .description("Compile sources/ into an interlinked wiki")
    .option("--review", "Write generated pages as review candidates under .llmwiki/candidates/ instead of mutating wiki/. Orphan-marking for deleted sources is deferred until the next non-review compile.")
    .option("--lang <code>", "Target language for generated wiki content (e.g. \"Chinese\", \"ja\", \"zh-CN\"). Equivalent to setting LLMWIKI_OUTPUT_LANG.")
    .option("--no-extraction-cache", "Disable reading and writing cached concept extractions")
    .option("--refresh-extraction-cache", "Ignore existing extraction cache and overwrite it")
    .option("--no-embeddings", "Skip non-critical embedding refresh after wiki pages are written")
    .option("-p, --project <id>", "Target project (uses active project if not specified)")
    .action((options: CompileCliOptions) => runCliAction(() => runCompile(options)));
}

/** Register `batch-compile <folder>`. */
function registerBatchCompileCommand(program: Command): void {
  program
    .command("batch-compile <folder>")
    .description("Ingest files from a folder in batches, compiling after each batch")
    .option(
      "-b, --batch <number>",
      `Number of files to ingest per batch (default: ${DEFAULT_BATCH_SIZE})`,
      parseInteger,
      DEFAULT_BATCH_SIZE,
    )
    .option("--no-extraction-cache", "Disable reading and writing cached concept extractions")
    .option("--refresh-extraction-cache", "Ignore existing extraction cache and overwrite it")
    .option("--no-embeddings", "Skip non-critical embedding refresh after each compile step")
    .option("-p, --project <id>", "Target project (uses active project if not specified)")
    .action((folder: string, options: BatchCompileCliOptions) =>
      runCliAction(() => runBatchCompile(folder, options)),
    );
}

/** Run compile after applying shared CLI concerns. */
async function runCompile(options: CompileCliOptions): Promise<void> {
  applyLanguageOption(options.lang);
  requireProvider();
  await compileCommand({
    review: options.review,
    noExtractionCache: options.extractionCache === false,
    refreshExtractionCache: options.refreshExtractionCache,
    noEmbeddings: options.embeddings === false,
  }, options.project);
}

/** Run batch-compile after applying shared CLI concerns. */
async function runBatchCompile(folder: string, options: BatchCompileCliOptions): Promise<void> {
  requireProvider();
  await batchCompileCommand(folder, {
    batch: options.batch,
    project: options.project,
    noExtractionCache: options.extractionCache === false,
    refreshExtractionCache: options.refreshExtractionCache,
    noEmbeddings: options.embeddings === false,
  });
}

/** Parse a Commander integer option. */
function parseInteger(value: string): number {
  return parseInt(value, 10);
}
