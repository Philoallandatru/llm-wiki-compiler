/**
 * Commander registration for export and MCP serving commands.
 *
 * These commands expose compiled wiki content: either as portable export
 * artifacts or as an MCP stdio server for tool/resource access.
 */

import type { Command } from "commander";
import exportCommand from "../commands/export.js";
import { startMCPServer } from "../mcp/server.js";
import { runCliAction } from "./action-utils.js";

interface ExportCliOptions {
  target?: string;
  source?: string;
}

interface ServeCliOptions {
  root: string;
  project?: string;
}

/** Register export and serve commands. */
export function registerExportCommands(program: Command, version: string): void {
  registerExportCommand(program);
  registerServeCommand(program, version);
}

/** Register `export`. */
function registerExportCommand(program: Command): void {
  program
    .command("export")
    .description("Export wiki content to portable formats (llms.txt, JSON, GraphML, Marp, ...)")
    .option("--target <name>", "Limit export to a single target format")
    .option("--source <kind>", "For marp target: which pages to include - concepts, queries, or all (default: all)")
    .action((options: ExportCliOptions) => runCliAction(() => exportCommand(process.cwd(), options)));
}

/** Register `serve`. */
function registerServeCommand(program: Command, version: string): void {
  program
    .command("serve")
    .description("Start an MCP server exposing wiki tools and resources over stdio")
    .option("--root <dir>", "Project root directory", process.cwd())
    .option("--project <id>", "Bind server to a specific project (default: active project)")
    .action((options: ServeCliOptions) => runCliAction(() => runServe(options, version)));
}

/** Start the MCP server. Per-tool credential checks happen inside MCP tools. */
async function runServe(options: ServeCliOptions, version: string): Promise<void> {
  await startMCPServer({ root: options.root, version, projectId: options.project });
}
