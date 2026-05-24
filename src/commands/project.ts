/**
 * Project management commands for multi-wiki support.
 *
 * Enables users to create, list, switch, and remove wiki projects.
 * Each project has isolated sources/, wiki/, and state.
 */

import {
  addProject,
  listProjects,
  removeProject,
  setDefaultProject,
  readProjectsConfig,
  resolveProjectPaths,
} from "../utils/project-config.js";

/**
 * Add a new wiki project.
 */
export async function projectAddCommand(
  root: string,
  projectId: string,
  name: string,
  description?: string,
): Promise<void> {
  try {
    await addProject(root, projectId, name, description);
    console.log(`✓ Created project "${name}" (${projectId})`);
    console.log(`  Sources: projects/${projectId}/sources/`);
    console.log(`  Wiki:    projects/${projectId}/wiki/`);
  } catch (err) {
    throw new Error(`Failed to add project: ${err instanceof Error ? err.message : err}`);
  }
}

/**
 * List all wiki projects.
 */
export async function projectListCommand(root: string): Promise<void> {
  const config = await readProjectsConfig(root);
  const projects = await listProjects(root);

  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }

  console.log("\nWiki Projects:\n");

  for (const project of projects) {
    const isActive = project.id === config.defaultProject;
    const marker = isActive ? "→" : " ";
    const paths = resolveProjectPaths(root, project);

    console.log(`${marker} ${project.name} (${project.id})`);
    if (project.description) {
      console.log(`  ${project.description}`);
    }
    console.log(`  Sources: ${project.sourcesDir}`);
    console.log(`  Wiki:    ${project.wikiDir}`);
    if (isActive) {
      console.log(`  [ACTIVE]`);
    }
    console.log();
  }
}

/**
 * Switch the active (default) project.
 */
export async function projectSwitchCommand(root: string, projectId: string): Promise<void> {
  try {
    await setDefaultProject(root, projectId);
    console.log(`✓ Switched to project "${projectId}"`);
    console.log(`  All commands will now use this project by default.`);
  } catch (err) {
    throw new Error(
      `Failed to switch project: ${err instanceof Error ? err.message : err}`,
    );
  }
}

/**
 * Remove a wiki project from configuration.
 * Does NOT delete the project directories (safety measure).
 */
export async function projectRemoveCommand(root: string, projectId: string): Promise<void> {
  try {
    await removeProject(root, projectId);
    console.log(`✓ Removed project "${projectId}" from configuration`);
    console.log(`  Note: Project directories were NOT deleted.`);
    console.log(`  To delete files, manually remove: projects/${projectId}/`);
  } catch (err) {
    throw new Error(
      `Failed to remove project: ${err instanceof Error ? err.message : err}`,
    );
  }
}

/**
 * Show detailed information about a specific project.
 */
export async function projectShowCommand(root: string, projectId: string): Promise<void> {
  const config = await readProjectsConfig(root);
  const project = config.projects[projectId];

  if (!project) {
    throw new Error(`Project "${projectId}" does not exist`);
  }

  const isActive = project.id === config.defaultProject;
  const paths = resolveProjectPaths(root, project);

  console.log(`\nProject: ${project.name} (${project.id})`);
  if (project.description) {
    console.log(`Description: ${project.description}`);
  }
  console.log(`Status: ${isActive ? "ACTIVE" : "Inactive"}`);
  console.log(`Created: ${project.createdAt}`);
  console.log(`\nPaths:`);
  console.log(`  Sources:    ${paths.sourcesDir}`);
  console.log(`  Wiki:       ${paths.wikiDir}`);
  console.log(`  Concepts:   ${paths.conceptsDir}`);
  console.log(`  Queries:    ${paths.queriesDir}`);
  console.log(`  State:      ${paths.stateFile}`);
  console.log(`  Embeddings: ${paths.embeddingsFile}`);
  console.log();
}
