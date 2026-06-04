# `llmwiki convert` User Guide

`llmwiki convert` prepares a mixed folder of local files as Markdown before you
run `batch-compile` or manual ingest/compile steps.

It writes only to the output folder you choose. It does not write to `sources/`
and does not mutate any existing llmwiki project.

## Basic Usage

```bash
llmwiki convert ./documents --out ./converted-markdown
```

The command recursively scans `./documents`, converts supported files, and
writes all Markdown files into the top level of `./converted-markdown`.
The output path must be separate from the input folder; it cannot be the input
folder itself or one of its parent folders.

Recommended next step:

```bash
llmwiki batch-compile ./converted-markdown --batch 2
```

## Supported File Types

| Input type | Behavior |
| --- | --- |
| `.md` | Passed through as Markdown. Long Markdown files can still be chunked. |
| `.txt` | Written as Markdown with source metadata frontmatter. |
| `.pdf` | Extracted with PyMuPDF and written as Markdown with source metadata. |
| `.html`, `.htm` | Extracted with Readability and converted with Turndown. Malformed-but-readable HTML is accepted; empty or no-readable-content HTML fails. |
| `.docx` | Extracted from Office Open XML paragraphs and written as Markdown with source metadata. Empty or unreadable documents fail. |
| `.pptx` | Extracted from slide XML, preserving slide boundaries as Markdown headings. Empty or unreadable decks fail. |
| `.csv`, `.tsv` | Parsed as tabular data and rendered as Markdown tables. |
| `.xlsx`, `.xls` | Parsed as workbooks and rendered as Markdown tables. Multi-sheet workbooks include sheet headings and `contexts` metadata. |
| `.png`, `.jpg`, `.jpeg`, `.webp` | OCR is performed with Anthropic vision and written as Markdown text. Images with no visible text fail. |
| Source code | Common code files such as `.ts`, `.js`, `.py`, `.go`, `.rs`, `.java`, `.css`, and `.sql` are fenced as Markdown code blocks. |
| Config/data text | `.json`, `.jsonl`, `.yaml`, `.yml`, `.toml`, `.ini`, `.env`, and `.xml` are fenced with source metadata. |
| Logs | `.log`, `.out`, and `.err` are fenced as Markdown-safe text. |
| Extensionless text | Text-looking files such as `LICENSE`, `README`, `Dockerfile`, `Makefile`, or other extensionless text files are converted. Binary-looking extensionless files are skipped. |

MinerU is not part of the current implementation. The only PDF engine currently
accepted is `pymupdf`.

## Options

```bash
llmwiki convert <folder> --out <folder> [options]
```

| Option | Description |
| --- | --- |
| `--out <folder>` | Required. New output folder for converted Markdown files. |
| `--pdf-engine <name>` | PDF parser. Currently only `pymupdf` is supported. |
| `--chunk-size <chars>` | Maximum body characters per output Markdown file. Default: `100000`. |
| `--include <extensions>` | Comma-separated extension allow-list, for example `.txt,.pdf`. |
| `--exclude <patterns>` | Comma-separated path substrings to skip. |

The scanner skips `.git`, `node_modules`, `dist`, and the output folder by
default.

`llmwiki convert` writes to a temporary output folder first. If every supported
file converts successfully, the final `--out` folder is published. If any
supported file fails, the command finishes the scan, prints the failures, exits
non-zero, and does not publish the final output folder. This avoids accidentally
running `batch-compile` against partial converted output.

## Examples

Convert everything supported:

```bash
llmwiki convert ./research --out ./research-md
```

Convert only PDFs and text files:

```bash
llmwiki convert ./research --out ./research-md --include .pdf,.txt
```

Convert local source and config files:

```bash
llmwiki convert ./repo-notes --out ./repo-markdown --include .ts,.json,.yaml
```

Skip archive folders:

```bash
llmwiki convert ./research --out ./research-md --exclude archive,temp
```

Use smaller chunks for long files:

```bash
llmwiki convert ./research --out ./research-md --chunk-size 50000
```

Chunking prefers readable Markdown boundaries. The converter first keeps
heading sections together when they fit, then falls back to paragraph
boundaries, then line boundaries for tables and code-like output, and finally
uses hard character splits only for a single oversized block with no better
boundary. Existing Markdown frontmatter is stripped before chunk metadata is
added, so copied metadata is not duplicated.

Convert PDFs with PyMuPDF:

```bash
python -m pip install pymupdf
llmwiki convert ./papers --out ./papers-md --pdf-engine pymupdf
```

If Python is not on your `PATH`, set `PYMUPDF_PYTHON` to the Python executable:

```bash
PYMUPDF_PYTHON=/path/to/python llmwiki convert ./papers --out ./papers-md
```

If PyMuPDF is not installed or the selected Python cannot import `fitz`, PDF
conversion fails with a clear error and the final output folder is not created.

Convert images with Anthropic vision OCR:

```bash
LLMWIKI_PROVIDER=anthropic ANTHROPIC_API_KEY=... llmwiki convert ./screenshots --out ./screenshots-md
```

Image OCR currently uses Anthropic vision rather than local OCR. It transcribes
visible text only; images with no visible text are reported as failures. If the
active provider is not Anthropic or credentials are missing, image conversion
fails clearly and the final output folder is not created.

## Output Shape

All files are flattened into the output folder top level. A nested input like
this:

```text
documents/
  notes/intro.md
  papers/report.pdf
```

produces output like this:

```text
converted-markdown/
  intro-a1b2c3d4.md
  report-e5f6a7b8.md
```

Long files are split into numbered parts:

```text
converted-markdown/
  report-e5f6a7b8.part-001.md
  report-e5f6a7b8.part-002.md
```

The hash suffix is deterministic and prevents collisions when different input
folders contain files with the same name.
