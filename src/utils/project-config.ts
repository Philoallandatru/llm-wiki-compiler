/**
 * Multi-project configuration management for llmwiki.
 *
 * Enables managing multiple independent wiki projects within a single root
 * directory. Each project has its own sources/, wiki/, and .llmwiki/ state.
 * The default project uses the root-level sources/ and wiki/ for backward
 * compatibility.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { LLMWIKI_DIR } from "./constants.js";

/** Project configuration stored in .llmwiki/projects.json */
export interface ProjectConfig {
  /** Project identifier (slug) */
  id: string;
  /** Display name */
  name: string;
  /** Optional description */
  description?: string;
  /** Relative path to sources directory */
  sourcesDir: string;
  /** Relative path to wiki output directory */
  wikiDir: string;
  /** ISO timestamp of project creation */
  createdAt: string;
}

/** Root configuration file structure */
export interface ProjectsConfig {
  version: 1;
  /** Currently active project ID */
  defaultProject: string;
  /** Map of project ID to project config */
  projects: Record<string, ProjectConfig>;
}

const PROJECTS_CONFIG_FILE = ".llmwiki/projects.json";

/** Default project config for backward compatibility */
const DEFAULT_PROJECT: ProjectConfig = {
  id: "default",
  name: "Default",
  description: "Main wiki project",
  sourcesDir: "sources",
  wikiDir: "wiki",
  createdAt: new Date().toISOString(),
};

/** Create an empty projects config with just the default project */
function emptyProjectsConfig(): ProjectsConfig {
  return {
    version: 1,
    defaultProject: "default",
    projects: {
      default: DEFAULT_PROJECT,
    },
  };
}

/**
 * Read projects configuration from .llmwiki/projects.json.
 * Creates default config if file doesn't exist.
 */
export async function readProjectsConfig(root: string): Promise<ProjectsConfig> {
  const configPath = path.join(root, PROJECTS_CONFIG_FILE);

  if (!existsSync(configPath)) {
    return emptyProjectsConfig();
  }

  try {
    const raw = await readFile(configPath, "utf-8");
    return JSON.parse(raw) as ProjectsConfig;
  } catch (err) {
    console.warn(`⚠ Failed to read projects config: ${err}. Using defaults.`);
    return emptyProjectsConfig();
  }
}

/** Write projects configuration to .llmwiki/projects.json */
async function writeProjectsConfig(
  root: string,
  config: ProjectsConfig,
): Promise<void> {
  const dir = path.join(root, LLMWIKI_DIR);
  await mkdir(dir, { recursive: true });

  const configPath = path.join(root, PROJECTS_CONFIG_FILE);
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Get a specific project config by ID.
 * Returns null if project doesn't exist.
 */
export async function getProject(
  root: string,
  projectId: string,
): Promise<ProjectConfig | null> {
  const config = await readProjectsConfig(root);
  return config.projects[projectId] || null;
}

/**
 * Get the currently active project config.
 * Falls back to default project if not set.
 */
export async function getActiveProject(root: string): Promise<ProjectConfig> {
  const config = await readProjectsConfig(root);
  const projectId = config.defaultProject || "default";
  return config.projects[projectId] || DEFAULT_PROJECT;
}

/**
 * Add a new project to the configuration.
 * Creates the project directories if they don't exist.
 */
export async function addProject(
  root: string,
  projectId: string,
  name: string,
  description?: string,
): Promise<void> {
  const config = await readProjectsConfig(root);

  if (config.projects[projectId]) {
    throw new Error(`Project "${projectId}" already exists`);
  }

  const newProject: ProjectConfig = {
    id: projectId,
    name,
    description,
    sourcesDir: `projects/${projectId}/sources`,
    wikiDir: `projects/${projectId}/wiki`,
    createdAt: new Date().toISOString(),
  };

  config.projects[projectId] = newProject;
  await writeProjectsConfig(root, config);

  // Create project directories
  await mkdir(path.join(root, newProject.sourcesDir), { recursive: true });
  await mkdir(path.join(root, newProject.wikiDir, "concepts"), { recursive: true });
  await mkdir(path.join(root, newProject.wikiDir, "queries"), { recursive: true });
  await mkdir(path.join(root, LLMWIKI_DIR, "projects", projectId), { recursive: true });
}

/**
 * Remove a project from the configuration.
 * Does NOT delete the project directories (safety measure).
 */
export async function removeProject(root: string, projectId: string): Promise<void> {
  if (projectId === "default") {
    throw new Error("Cannot remove the default project");
  }

  const config = await readProjectsConfig(root);

  if (!config.projects[projectId]) {
    throw new Error(`Project "${projectId}" does not exist`);
  }

  delete config.projects[projectId];

  // If removing the active project, switch to default
  if (config.defaultProject === projectId) {
    config.defaultProject = "default";
  }

  await writeProjectsConfig(root, config);
}

/**
 * Set the default (active) project.
 */
export async function setDefaultProject(root: string, projectId: string): Promise<void> {
  const config = await readProjectsConfig(root);

  if (!config.projects[projectId]) {
    throw new Error(`Project "${projectId}" does not exist`);
  }

  config.defaultProject = projectId;
  await writeProjectsConfig(root, config);
}

/**
 * List all projects.
 */
export async function listProjects(root: string): Promise<ProjectConfig[]> {
  const config = await readProjectsConfig(root);
  return Object.values(config.projects);
}

/**
 * Resolve project-specific paths for a given project.
 * Returns absolute paths for sources, wiki, concepts, queries, and state.
 */
export interface ProjectPaths {
  sourcesDir: string;
  wikiDir: string;
  conceptsDir: string;
  queriesDir: string;
  stateFile: string;
  embeddingsFile: string;
  indexFile: string;
  mocFile: string;
  candidatesDir: string;
  candidatesArchiveDir: string;
  lastLintFile: string;
}

export function resolveProjectPaths(root: string, project: ProjectConfig): ProjectPaths {
  const projectStateDir =
    project.id === "default"
      ? path.join(root, LLMWIKI_DIR)
      : path.join(root, LLMWIKI_DIR, "projects", project.id);

  return {
    sourcesDir: path.join(root, project.sourcesDir),
    wikiDir: path.join(root, project.wikiDir),
    conceptsDir: path.join(root, project.wikiDir, "concepts"),
    queriesDir: path.join(root, project.wikiDir, "queries"),
    stateFile: path.join(projectStateDir, "state.json"),
    embeddingsFile: path.join(projectStateDir, "embeddings.json"),
    indexFile: path.join(root, project.wikiDir, "index.md"),
    mocFile: path.join(root, project.wikiDir, "MOC.md"),
    candidatesDir: path.join(projectStateDir, "candidates"),
    candidatesArchiveDir: path.join(projectStateDir, "candidates", "archive"),
    lastLintFile: path.join(projectStateDir, "last-lint.json"),
  };
}

/**
 * Get project paths by project ID.
 * Convenience wrapper that fetches the project config and resolves paths.
 * @throws Error if project doesn't exist
 */
export async function getProjectPaths(
  root: string,
  projectId: string,
): Promise<ProjectPaths> {
  const project = await getProject(root, projectId);
  if (!project) {
    throw new Error(`Project "${projectId}" does not exist`);
  }
  return resolveProjectPaths(root, project);
}
