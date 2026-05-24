/**
 * Commander action for `llmwiki compile`.
 * Checks that sources exist, then delegates to the compilation orchestrator
 * to process all new and changed source files into wiki pages.
 */

import { existsSync } from "fs";
import { compile } from "../compiler/index.js";
import * as output from "../utils/output.js";
import { SOURCES_DIR } from "../utils/constants.js";
import type { CompileOptions } from "../utils/types.js";

/**
 * Run the compile command from the current working directory.
 * Exits early if no sources directory exists yet.
 * @param options - Optional behaviour overrides forwarded from the CLI flag set.
 * @param projectId - Optional project ID (for multi-project support).
 */
export default async function compileCommand(
  options: CompileOptions = {},
  projectId?: string,
): Promise<void> {
  const root = process.cwd();

  // Merge projectId into options to avoid conflicts
  const mergedOptions: CompileOptions = {
    ...options,
    projectId: projectId ?? options.projectId,
  };

  // Setup project symlinks if using a non-default project
  const { setupProjectSymlinks } = await import("../utils/project-symlinks.js");
  const cleanup = await setupProjectSymlinks(root);

  try {
    // Determine the sources directory to check
    let sourcesDir = SOURCES_DIR;
    if (mergedOptions.projectId) {
      const { getProjectPaths } = await import("../utils/project-config.js");
      const paths = await getProjectPaths(root, mergedOptions.projectId);
      sourcesDir = paths.sourcesDir;
    }

    if (!existsSync(sourcesDir)) {
      output.status(
        "!",
        output.warn('No sources found. Run `llmwiki ingest <url>` first.'),
      );
      return;
    }

    await compile(root, mergedOptions);
  } finally {
    // Clean up symlinks
    await cleanup();
  }
}
