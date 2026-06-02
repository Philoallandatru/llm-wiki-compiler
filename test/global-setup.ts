/**
 * Vitest globalSetup: build dist/ once before any test file loads.
 *
 * Several test files spawn `node dist/cli.js` to exercise the CLI surface.
 * Without a shared setup, each file's own beforeAll would call `npx tsup`,
 * and vitest's parallel-by-default test workers would race on dist/cli.js
 * (tsup's `clean: true` wipes the file mid-write). Building once globally
 * eliminates the race and saves ~1s per integration test file.
 */

import { exec as execCommand } from "child_process";
import { promisify } from "util";
import path from "path";

const exec = promisify(execCommand);

export async function setup(): Promise<void> {
  await exec(resolveTsupCommand(), { cwd: path.resolve(".") });
}

/** Resolve the local tsup command in a way Windows shells can execute. */
function resolveTsupCommand(): string {
  if (process.platform === "win32") return String.raw`node_modules\.bin\tsup.cmd`;
  return "node_modules/.bin/tsup";
}
