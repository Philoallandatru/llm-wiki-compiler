/**
 * Project resolution utilities for CLI commands.
 *
 * Provides helpers to resolve which project a command should operate on,
 * either from --project flag or the active default project.
 */

import {
  getProject,
  getActiveProject,
  resolveProjectPaths,
  type ProjectConfig,
  type ProjectPaths,
} from "./project-config.js";

/**
 * Resolve the project to use for a command.
 * If projectId is provided, use that project.
 * Otherwise, use the active default project.
 */
async function resolveProject(
  root: string,
  projectId?: string,
): Promise<{ project: ProjectConfig; paths: ProjectPaths }> {
  let project: ProjectConfig | null;

  if (projectId) {
    project = await getProject(root, projectId);
    if (!project) {
      throw new Error(
        `Project "${projectId}" does not exist. Use "llmwiki project list" to see available projects.`,
      );
    }
  } else {
    project = await getActiveProject(root);
  }

  const paths = resolveProjectPaths(root, project);

  return { project, paths };
}

/**
 * Context object passed to commands that support multi-project.
 * Contains the resolved project config and all relevant paths.
 */
export interface ProjectContext {
  root: string;
  project: ProjectConfig;
  paths: ProjectPaths;
}

/**
 * Create a project context for a command.
 * This is the main entry point for commands that need project-aware paths.
 */
export async function createProjectContext(
  root: string,
  projectId?: string,
): Promise<ProjectContext> {
  const { project, paths } = await resolveProject(root, projectId);
  return { root, project, paths };
}
