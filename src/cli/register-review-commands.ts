/**
 * Commander registration for compile review workflows.
 *
 * Review commands operate on pending candidates produced by `compile --review`
 * and keep the regular wiki pages untouched until a candidate is approved.
 */

import type { Command } from "commander";
import reviewApproveCommand from "../commands/review-approve.js";
import reviewListCommand from "../commands/review-list.js";
import reviewRejectCommand from "../commands/review-reject.js";
import reviewShowCommand from "../commands/review-show.js";
import { runCliAction } from "./action-utils.js";

/** Register the `review` command group. */
export function registerReviewCommands(program: Command): void {
  const reviewCommand = program
    .command("review")
    .description("Inspect and act on pending compile review candidates");
  registerReviewListCommand(reviewCommand);
  registerReviewShowCommand(reviewCommand);
  registerReviewApproveCommand(reviewCommand);
  registerReviewRejectCommand(reviewCommand);
}

/** Register `review list`. */
function registerReviewListCommand(reviewCommand: Command): void {
  reviewCommand
    .command("list")
    .description("List pending review candidates")
    .action(() => runCliAction(() => reviewListCommand()));
}

/** Register `review show <id>`. */
function registerReviewShowCommand(reviewCommand: Command): void {
  reviewCommand
    .command("show <id>")
    .description("Print a single candidate's metadata and body")
    .action((id: string) => runCliAction(() => reviewShowCommand(id)));
}

/** Register `review approve <id>`. */
function registerReviewApproveCommand(reviewCommand: Command): void {
  reviewCommand
    .command("approve <id>")
    .description("Approve a candidate and promote it into wiki/concepts/")
    .action((id: string) => runCliAction(() => reviewApproveCommand(id)));
}

/** Register `review reject <id>`. */
function registerReviewRejectCommand(reviewCommand: Command): void {
  reviewCommand
    .command("reject <id>")
    .description("Reject a candidate and archive it without touching wiki/")
    .action((id: string) => runCliAction(() => reviewRejectCommand(id)));
}
