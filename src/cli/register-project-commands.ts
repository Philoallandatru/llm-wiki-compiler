/**
 * Commander registration for multi-project management.
 *
 * Project commands mutate only llmwiki project configuration; removing a
 * project from the config intentionally does not delete its files.
 */

import type { Command } from "commander";
import {
  projectAddCommand,
  projectListCommand,
  projectRemoveCommand,
  projectShowCommand,
  projectSwitchCommand,
} from "../commands/project.js";
import { runCliAction } from "./action-utils.js";

/** Register the `project` command group. */
export function registerProjectCommands(program: Command): void {
  const projectCommand = program.command("project").description("Manage multiple wiki projects");
  registerProjectAddCommand(projectCommand);
  registerProjectListCommand(projectCommand);
  registerProjectSwitchCommand(projectCommand);
  registerProjectRemoveCommand(projectCommand);
  registerProjectShowCommand(projectCommand);
}

/** Register `project add <id> <name>`. */
function registerProjectAddCommand(projectCommand: Command): void {
  projectCommand
    .command("add <id> <name>")
    .description("Create a new wiki project")
    .option("-d, --description <text>", "Project description")
    .action((id: string, name: string, options: { description?: string }) =>
      runCliAction(() => projectAddCommand(process.cwd(), id, name, options.description)),
    );
}

/** Register `project list`. */
function registerProjectListCommand(projectCommand: Command): void {
  projectCommand
    .command("list")
    .description("List all wiki projects")
    .action(() => runCliAction(() => projectListCommand(process.cwd())));
}

/** Register `project switch <id>`. */
function registerProjectSwitchCommand(projectCommand: Command): void {
  projectCommand
    .command("switch <id>")
    .description("Switch the active project")
    .action((id: string) => runCliAction(() => projectSwitchCommand(process.cwd(), id)));
}

/** Register `project remove <id>`. */
function registerProjectRemoveCommand(projectCommand: Command): void {
  projectCommand
    .command("remove <id>")
    .description("Remove a project from configuration (does not delete files)")
    .action((id: string) => runCliAction(() => projectRemoveCommand(process.cwd(), id)));
}

/** Register `project show <id>`. */
function registerProjectShowCommand(projectCommand: Command): void {
  projectCommand
    .command("show <id>")
    .description("Show detailed information about a project")
    .action((id: string) => runCliAction(() => projectShowCommand(process.cwd(), id)));
}
