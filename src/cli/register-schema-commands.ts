/**
 * Commander registration for schema inspection commands.
 *
 * Schema commands are local project utilities and do not require provider
 * credentials. They keep schema initialization and display concerns grouped.
 */

import type { Command } from "commander";
import { schemaInitCommand, schemaShowCommand } from "../commands/schema.js";
import { runCliAction } from "./action-utils.js";

/** Register the `schema` command group. */
export function registerSchemaCommands(program: Command): void {
  const schemaCommand = program
    .command("schema")
    .description("Inspect or initialize the project's wiki schema config");
  registerSchemaInitCommand(schemaCommand);
  registerSchemaShowCommand(schemaCommand);
}

/** Register `schema init`. */
function registerSchemaInitCommand(schemaCommand: Command): void {
  schemaCommand
    .command("init")
    .description("Write a starter schema file to .llmwiki/schema.json")
    .action(() => runCliAction(() => schemaInitCommand()));
}

/** Register `schema show`. */
function registerSchemaShowCommand(schemaCommand: Command): void {
  schemaCommand
    .command("show")
    .description("Print the resolved schema for this project")
    .action(() => runCliAction(() => schemaShowCommand()));
}
