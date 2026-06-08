/**
 * Progress tracking utilities for folder conversion.
 *
 * Provides simple, terminal-friendly progress updates during batch conversions
 * without requiring external dependencies. Updates in-place using ANSI escapes
 * when supported, falls back to line-by-line output otherwise.
 */

interface ProgressTracker {
  start(total: number): void;
  update(current: number, filePath: string): void;
  finish(): void;
}

const SUPPORTS_ANSI = process.stdout.isTTY ?? false;
const MAX_PATH_LENGTH = 60;

/**
 * Create a progress tracker for conversion operations.
 *
 * The tracker displays the current file being processed, progress counter,
 * and elapsed time. It uses in-place updates when the terminal supports
 * ANSI escape codes, otherwise prints line-by-line.
 */
export function createProgressTracker(): ProgressTracker {
  let total = 0;
  let startTime = 0;
  let lastUpdate = 0;

  return {
    start(totalFiles: number): void {
      total = totalFiles;
      startTime = Date.now();
      lastUpdate = 0;
    },

    update(current: number, filePath: string): void {
      const now = Date.now();
      if (now - lastUpdate < 100 && current < total) return;
      lastUpdate = now;

      const elapsed = formatElapsed(now - startTime);
      const shortPath = truncatePath(filePath);
      const progress = `[${current}/${total}]`;
      const message = `Converting ${progress} ${shortPath} (${elapsed})`;

      if (SUPPORTS_ANSI) {
        process.stdout.write(`\r${message}\x1b[K`);
      } else {
        console.log(message);
      }
    },

    finish(): void {
      if (SUPPORTS_ANSI) {
        process.stdout.write("\r\x1b[K");
      }
    },
  };
}

/** Format elapsed time in a human-readable way. */
function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/** Truncate long paths to fit within terminal width. */
function truncatePath(filePath: string): string {
  if (filePath.length <= MAX_PATH_LENGTH) return filePath;
  const excess = filePath.length - MAX_PATH_LENGTH + 3;
  const start = Math.floor(excess / 2);
  return filePath.slice(0, filePath.length - start - excess) + "..." + filePath.slice(-start);
}
