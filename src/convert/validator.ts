/**
 * Quality validation for converted Markdown files.
 *
 * Detects common issues in converted content: empty files, malformed Markdown,
 * encoding problems, and excessively long lines that indicate parsing failures.
 */

import type { ValidationIssue } from "./types.js";

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const MIN_CONTENT_LENGTH = 50;
const MAX_LINE_LENGTH = 10_000;
const MAX_CONTROL_CHAR_RATIO = 0.05;

/**
 * Validate converted Markdown content for common quality issues.
 *
 * Returns a result with `valid: false` when critical issues are detected,
 * along with a list of all issues found (errors, warnings, and info).
 */
export function validateMarkdown(content: string, filePath: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  checkEmptyContent(content, filePath, issues);
  checkMalformedFences(content, filePath, issues);
  checkExcessiveLineLength(content, filePath, issues);
  checkEncodingIssues(content, filePath, issues);

  const hasErrors = issues.some((issue) => issue.severity === "error");
  return { valid: !hasErrors, issues };
}

/**
 * Detect files with no useful content after conversion.
 * Files under 50 chars are likely failed conversions.
 */
function checkEmptyContent(content: string, filePath: string, issues: ValidationIssue[]): void {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    issues.push({
      severity: "error",
      type: "empty-content",
      message: "File has no content after conversion",
      file: filePath,
    });
  } else if (trimmed.length < MIN_CONTENT_LENGTH) {
    issues.push({
      severity: "warning",
      type: "minimal-content",
      message: `File has very little content (${trimmed.length} chars)`,
      file: filePath,
      details: { length: trimmed.length },
    });
  }
}

/**
 * Detect unclosed or malformed code fences in Markdown.
 * Unbalanced fences break rendering in most Markdown viewers.
 */
function checkMalformedFences(content: string, filePath: string, issues: ValidationIssue[]): void {
  const lines = content.split(/\r?\n/);
  let fenceDepth = 0;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      fenceDepth = fenceDepth === 0 ? 1 : 0;
    }
  }

  if (fenceDepth !== 0) {
    issues.push({
      severity: "error",
      type: "unclosed-fence",
      message: "Code fence is not closed",
      file: filePath,
    });
  }
}

/**
 * Detect suspiciously long lines that might indicate failed parsing.
 * Lines over 10k chars often mean the converter didn't break content properly.
 */
function checkExcessiveLineLength(
  content: string,
  filePath: string,
  issues: ValidationIssue[],
): void {
  const lines = content.split(/\r?\n/);
  const longLines = lines.filter((line) => line.length > MAX_LINE_LENGTH);

  if (longLines.length > 0) {
    issues.push({
      severity: "warning",
      type: "excessive-line-length",
      message: `Found ${longLines.length} line(s) over ${MAX_LINE_LENGTH} chars`,
      file: filePath,
      details: {
        count: longLines.length,
        maxLength: Math.max(...longLines.map((l) => l.length)),
      },
    });
  }
}

/**
 * Detect encoding issues by checking for high ratio of control characters.
 * Binary data or corrupted text often has many control bytes.
 */
function checkEncodingIssues(content: string, filePath: string, issues: ValidationIssue[]): void {
  if (content.length === 0) return;

  let controlChars = 0;
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      controlChars++;
    }
  }

  const ratio = controlChars / content.length;
  if (ratio > MAX_CONTROL_CHAR_RATIO) {
    issues.push({
      severity: "warning",
      type: "encoding-issue",
      message: `High ratio of control characters (${(ratio * 100).toFixed(1)}%)`,
      file: filePath,
      details: { ratio, controlChars, totalChars: content.length },
    });
  }
}

/**
 * Generate a validation summary from all validated outputs.
 * Groups issues by severity and provides aggregate statistics.
 */
export interface ValidationSummary {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  issuesBySeverity: {
    error: number;
    warning: number;
    info: number;
  };
  allIssues: ValidationIssue[];
}

export function generateValidationSummary(
  validations: Map<string, ValidationResult>,
): ValidationSummary {
  const allIssues: ValidationIssue[] = [];
  let validFiles = 0;
  let invalidFiles = 0;

  for (const result of validations.values()) {
    if (result.valid) {
      validFiles++;
    } else {
      invalidFiles++;
    }
    allIssues.push(...result.issues);
  }

  const issuesBySeverity = {
    error: allIssues.filter((i) => i.severity === "error").length,
    warning: allIssues.filter((i) => i.severity === "warning").length,
    info: allIssues.filter((i) => i.severity === "info").length,
  };

  return {
    totalFiles: validations.size,
    validFiles,
    invalidFiles,
    issuesBySeverity,
    allIssues,
  };
}
