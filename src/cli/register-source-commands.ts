/**
 * Commander registration for source-preparation commands.
 *
 * These commands prepare local project material before LLM-backed compilation:
 * direct source ingest, coding-session ingest, and folder-to-Markdown convert.
 */

import type { Command } from "commander";
import convertCommand from "../commands/convert.js";
import ingestCommand from "../commands/ingest.js";
import ingestSessionCommand from "../commands/ingest-session.js";
import { runCliAction } from "./action-utils.js";

interface ConvertCliOptions {
  out: string;
  pdfEngine?: string;
  chunkSize?: number;
  include?: string;
  exclude?: string;
}

/** Register ingest, ingest-session, and convert commands. */
export function registerSourceCommands(program: Command): void {
  registerIngestCommand(program);
  registerIngestSessionCommand(program);
  registerConvertCommand(program);
}

/** Register `ingest <source>`. */
function registerIngestCommand(program: Command): void {
  program
    .command("ingest <source>")
    .description("Ingest a URL or local file into sources/")
    .option("-p, --project <id>", "Target project (uses active project if not specified)")
    .action((source: string, options: { project?: string }) =>
      runCliAction(async () => {
        const { createProjectContext } = await import("../utils/project-resolver.js");
        const { paths } = await createProjectContext(process.cwd(), options.project);
        await ingestCommand(source, paths.sourcesDir);
      }),
    );
}

/** Register `ingest-session <path>`. */
function registerIngestSessionCommand(program: Command): void {
  program
    .command("ingest-session <path>")
    .description("Ingest a coding-agent session export (Claude, Codex, Cursor) into sources/")
    .action((targetPath: string) => runCliAction(() => ingestSessionCommand(targetPath)));
}

/** Register `convert <folder>`. */
function registerConvertCommand(program: Command): void {
  program
    .command("convert <folder>")
    .description("Recursively convert supported files in a folder to flattened Markdown")
    .requiredOption("--out <folder>", "New output folder for converted Markdown files")
    .option("--pdf-engine <name>", "PDF parser to use (currently: pymupdf)", "pymupdf")
    .option("--chunk-size <chars>", "Maximum body characters per Markdown output file (default: 100000)", parseInteger)
    .option("--include <extensions>", "Comma-separated extensions to include, e.g. .txt,.pdf")
    .option("--exclude <patterns>", "Comma-separated path substrings to skip")
    .action((folder: string, options: ConvertCliOptions) =>
      runCliAction(async () => {
        await convertCommand(folder, options);
      }),
    );
}

/** Parse a Commander integer option. */
function parseInteger(value: string): number {
  return parseInt(value, 10);
}
