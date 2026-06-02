/**
 * PyMuPDF-backed PDF extraction for the convert command.
 *
 * PyMuPDF is optional at runtime because the Node package cannot install it.
 * Users get a clear error explaining how to enable PDF conversion when Python
 * or the `fitz` package is unavailable.
 */

import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const MAX_PDF_STDOUT_BYTES = 50 * 1024 * 1024;

interface PythonCandidate {
  command: string;
  argsPrefix: string[];
}

const PYMUPDF_SCRIPT = `
import sys

try:
    import fitz
except Exception as exc:
    raise RuntimeError("PyMuPDF is not installed. Install it with: python -m pip install pymupdf") from exc

doc = fitz.open(sys.argv[1])
parts = []
for page in doc:
    try:
        parts.append(page.get_text("markdown"))
    except Exception:
        parts.append(page.get_text("text"))
sys.stdout.write("\\n\\n".join(part.strip() for part in parts if part.strip()))
`;

/** Extract Markdown text from a PDF file by spawning Python with PyMuPDF. */
export async function extractPdfWithPyMuPDF(filePath: string): Promise<string> {
  const errors: string[] = [];
  for (const candidate of pythonCandidates()) {
    try {
      const { stdout } = await execFileAsync(
        candidate.command,
        [...candidate.argsPrefix, "-c", PYMUPDF_SCRIPT, filePath],
        { maxBuffer: MAX_PDF_STDOUT_BYTES },
      );
      return stdout;
    } catch (error) {
      errors.push(formatPythonError(candidate.command, error));
    }
  }
  throw new Error(`PyMuPDF PDF conversion failed. ${errors.join(" ")}`);
}

/** Return Python command candidates for the current platform. */
function pythonCandidates(): PythonCandidate[] {
  if (process.env.PYMUPDF_PYTHON) {
    return [{ command: process.env.PYMUPDF_PYTHON, argsPrefix: [] }];
  }
  if (process.platform === "win32") {
    return [
      { command: "python", argsPrefix: [] },
      { command: "py", argsPrefix: ["-3"] },
    ];
  }
  return [
    { command: "python3", argsPrefix: [] },
    { command: "python", argsPrefix: [] },
  ];
}

/** Make child process failures concise enough for CLI summaries. */
function formatPythonError(command: string, error: unknown): string {
  if (!(error instanceof Error)) return `${command}: ${String(error)}`;
  const processError = error as Error & { stderr?: string };
  const stderr = processError.stderr?.trim();
  return stderr ? `${command}: ${stderr}` : `${command}: ${error.message}`;
}
