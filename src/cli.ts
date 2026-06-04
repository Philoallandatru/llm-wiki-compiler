/**
 * CLI entry point for llmwiki, the knowledge compiler.
 *
 * This file intentionally stays small: it creates the Commander program,
 * attaches version metadata, and delegates command registration to focused
 * registrar modules under `src/cli/`.
 */

import "dotenv/config";
import { createRequire } from "module";
import { Command } from "commander";
import { registerCompileCommands } from "./cli/register-compile-commands.js";
import { registerExportCommands } from "./cli/register-export-commands.js";
import { registerProjectCommands } from "./cli/register-project-commands.js";
import { registerQueryCommands } from "./cli/register-query-commands.js";
import { registerReviewCommands } from "./cli/register-review-commands.js";
import { registerSchemaCommands } from "./cli/register-schema-commands.js";
import { registerSourceCommands } from "./cli/register-source-commands.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const program = new Command();

program
  .name("llmwiki")
  .description("The knowledge compiler - raw sources in, interlinked wiki out")
  .version(version);

registerSourceCommands(program);
registerCompileCommands(program);
registerReviewCommands(program);
registerQueryCommands(program);
registerSchemaCommands(program);
registerExportCommands(program, version);
registerProjectCommands(program);

program.parse();
