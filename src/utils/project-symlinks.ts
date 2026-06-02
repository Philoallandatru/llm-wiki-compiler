/**
 * Project symlink management for compile command.
 *
 * Creates temporary symlinks to make the active project's directories
 * appear as the default sources/ and wiki/ directories, allowing the
 * existing compile pipeline to work without modification.
 */

import { symlink, unlink, rename } from "fs/promises";
import { existsSync, lstatSync } from "fs";
import path from "path";
import {
  getActiveProject,
  getProjectById,
  type ProjectConfig,
  resolveProjectPaths,
} from "./project-config.js";

/** Filesystem paths used while a project is temporarily linked at root. */
interface ProjectSymlinkLayout {
  sourcesLink: string;
  wikiLink: string;
  sourcesBackup: string;
  wikiBackup: string;
  sourcesTarget: string;
  wikiTarget: string;
}

/**
 * Setup symlinks for the active or requested project.
 * Creates sources -> projects/{id}/sources and wiki -> projects/{id}/wiki
 *
 * @param root - Project root directory
 * @param projectId - Optional explicit project ID to link instead of the active project.
 * @returns Cleanup function to remove symlinks and restore originals
 */
export async function setupProjectSymlinks(
  root: string,
  projectId?: string,
): Promise<() => Promise<void>> {
  const project = await getSymlinkProject(root, projectId);

  // Skip symlinks for default project (already uses sources/ and wiki/)
  if (project.id === "default") {
    return async () => {}; // No-op cleanup
  }

  const layout = createSymlinkLayout(root, project);
  const needsSourcesRestore = await backupIfExists(
    layout.sourcesLink,
    layout.sourcesBackup,
  );
  const needsWikiRestore = await backupIfExists(layout.wikiLink, layout.wikiBackup);

  await createProjectLinks(layout, needsSourcesRestore, needsWikiRestore);

  return async () => cleanupProjectLinks(layout, needsSourcesRestore, needsWikiRestore);
}

/** Resolve the project that should be exposed through temporary symlinks. */
async function getSymlinkProject(
  root: string,
  projectId?: string,
): Promise<ProjectConfig> {
  return projectId ? getProjectById(root, projectId) : getActiveProject(root);
}

/** Build the root link, backup, and target paths for a non-default project. */
function createSymlinkLayout(root: string, project: ProjectConfig): ProjectSymlinkLayout {
  const paths = resolveProjectPaths(root, project);

  return {
    sourcesLink: path.join(root, "sources"),
    wikiLink: path.join(root, "wiki"),
    sourcesBackup: path.join(root, ".sources.backup"),
    wikiBackup: path.join(root, ".wiki.backup"),
    sourcesTarget: path.relative(root, paths.sourcesDir),
    wikiTarget: path.relative(root, paths.wikiDir),
  };
}

/** Create temporary links and restore backups if either link cannot be created. */
async function createProjectLinks(
  layout: ProjectSymlinkLayout,
  needsSourcesRestore: boolean,
  needsWikiRestore: boolean,
): Promise<void> {
  await removeIfSymlink(layout.sourcesLink);
  await removeIfSymlink(layout.wikiLink);

  try {
    await symlink(layout.sourcesTarget, layout.sourcesLink, "junction");
    await symlink(layout.wikiTarget, layout.wikiLink, "junction");
  } catch (err) {
    await restoreBackup(layout.sourcesBackup, layout.sourcesLink, needsSourcesRestore);
    await restoreBackup(layout.wikiBackup, layout.wikiLink, needsWikiRestore);
    throw err;
  }
}

/** Remove temporary links and put any original root directories back. */
async function cleanupProjectLinks(
  layout: ProjectSymlinkLayout,
  needsSourcesRestore: boolean,
  needsWikiRestore: boolean,
): Promise<void> {
  await removeIfSymlink(layout.sourcesLink);
  await removeIfSymlink(layout.wikiLink);
  await restoreBackup(layout.sourcesBackup, layout.sourcesLink, needsSourcesRestore);
  await restoreBackup(layout.wikiBackup, layout.wikiLink, needsWikiRestore);
}

/** Restore a backed-up path when one was created earlier. */
async function restoreBackup(
  backupPath: string,
  originalPath: string,
  shouldRestore: boolean,
): Promise<void> {
  if (shouldRestore && existsSync(backupPath)) {
    await rename(backupPath, originalPath);
  }
}

/**
 * Backup a path if it exists and is not a symlink.
 * If the path is already a symlink, it's preserved (not removed).
 * @returns true if backup was created
 */
async function backupIfExists(originalPath: string, backupPath: string): Promise<boolean> {
  if (!existsSync(originalPath)) return false;

  try {
    const stats = lstatSync(originalPath);
    // If it's already a symlink, leave it alone - the caller will handle it
    if (stats.isSymbolicLink()) {
      return false;
    }

    // Backup the directory
    await rename(originalPath, backupPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a path if it's a symlink.
 */
async function removeIfSymlink(linkPath: string): Promise<void> {
  if (!existsSync(linkPath)) return;

  try {
    const stats = lstatSync(linkPath);
    if (stats.isSymbolicLink()) {
      await unlink(linkPath);
    }
  } catch {
    // Ignore errors
  }
}
