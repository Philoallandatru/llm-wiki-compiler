/**
 * Text-like file classification for folder conversion.
 *
 * This module keeps extension support, Markdown fence language choices, and
 * binary-looking safeguards together so scanning and conversion agree on what
 * can be safely treated as local text.
 */

import { readFile } from "fs/promises";
import path from "path";
import type { ConvertSourceType } from "./types.js";

const TEXT_SAMPLE_BYTES = 4096;
const CONTROL_CHARACTER_THRESHOLD = 0.3;

const codeLanguages = new Map<string, string>([
  [".c", "c"],
  [".cpp", "cpp"],
  [".cs", "csharp"],
  [".css", "css"],
  [".go", "go"],
  [".java", "java"],
  [".js", "javascript"],
  [".jsx", "jsx"],
  [".kt", "kotlin"],
  [".mjs", "javascript"],
  [".php", "php"],
  [".py", "python"],
  [".rb", "ruby"],
  [".rs", "rust"],
  [".sh", "bash"],
  [".sql", "sql"],
  [".swift", "swift"],
  [".tsx", "tsx"],
  [".ts", "typescript"],
]);

const configLanguages = new Map<string, string>([
  [".css", "css"],
  [".csv", "csv"],
  [".env", "dotenv"],
  [".ini", "ini"],
  [".json", "json"],
  [".jsonl", "jsonl"],
  [".toml", "toml"],
  [".tsv", "tsv"],
  [".xml", "xml"],
  [".yaml", "yaml"],
  [".yml", "yaml"],
]);

const logExtensions = new Set([".log", ".out", ".err"]);

export interface TextLikeClassification {
  sourceType: ConvertSourceType;
  language: string | null;
  shouldFence: boolean;
}

/** Return all extension-based text-like file types supported by convert. */
export function textLikeExtensions(): string[] {
  return [...new Set([...codeLanguages.keys(), ...configLanguages.keys(), ...logExtensions])];
}

/** Classify a supported text-like path for conversion. */
export function classifyTextLikePath(filePath: string): TextLikeClassification | null {
  const extension = path.extname(filePath).toLowerCase();
  if (codeLanguages.has(extension)) return codeClassification(extension);
  if (configLanguages.has(extension)) return configClassification(extension);
  if (logExtensions.has(extension)) {
    return { sourceType: "log", language: null, shouldFence: true };
  }
  if (extension === "") return extensionlessClassification(filePath);
  return null;
}

/** Read a small prefix and decide whether it is safe to treat as text. */
export async function fileLooksLikeText(filePath: string): Promise<boolean> {
  const sample = (await readFile(filePath)).subarray(0, TEXT_SAMPLE_BYTES);
  if (sample.includes(0)) return false;
  if (sample.length === 0) return true;
  return controlCharacterRatio(sample) <= CONTROL_CHARACTER_THRESHOLD;
}

/** Throw when a candidate decodes like a binary payload rather than text. */
export async function assertTextLikeContent(filePath: string): Promise<void> {
  if (await fileLooksLikeText(filePath)) return;
  throw new Error("File appears to be binary, not text.");
}

/** Wrap code-like content in a Markdown fence, escaping embedded fence starts. */
export function fencedText(body: string, language: string | null): string {
  const escapedBody = body.replaceAll("```", "\\`\\`\\`");
  const fenceInfo = language ?? "";
  return `\`\`\`${fenceInfo}\n${escapedBody.trimEnd()}\n\`\`\``;
}

/** Return the code classification for a known code extension. */
function codeClassification(extension: string): TextLikeClassification {
  return {
    sourceType: "code",
    language: codeLanguages.get(extension) ?? null,
    shouldFence: true,
  };
}

/** Return the config classification for a known config extension. */
function configClassification(extension: string): TextLikeClassification {
  return {
    sourceType: "config",
    language: configLanguages.get(extension) ?? null,
    shouldFence: true,
  };
}

/** Classify recognized extensionless text names. */
function extensionlessClassification(filePath: string): TextLikeClassification {
  const name = path.basename(filePath).toLowerCase();
  if (name === "dockerfile") {
    return { sourceType: "code", language: "dockerfile", shouldFence: true };
  }
  if (name === "makefile") {
    return { sourceType: "code", language: "makefile", shouldFence: true };
  }
  return { sourceType: "text", language: null, shouldFence: false };
}

/** Measure bytes that are unusual in plain text, allowing whitespace controls. */
function controlCharacterRatio(sample: Buffer): number {
  let suspicious = 0;
  for (const byte of sample) {
    if (isSuspiciousControlByte(byte)) suspicious += 1;
  }
  return suspicious / sample.length;
}

/** Return true for control bytes that usually indicate binary content. */
function isSuspiciousControlByte(byte: number): boolean {
  return byte < 32 && byte !== 9 && byte !== 10 && byte !== 13;
}
