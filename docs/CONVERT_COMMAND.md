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

Recommended next step:

```bash
llmwiki batch-compile ./converted-markdown --batch 5
```

## Supported File Types

| Input type | Behavior |
| --- | --- |
| `.md` | Passed through as Markdown. Long Markdown files can still be chunked. |
| `.txt` | Written as Markdown with source metadata frontmatter. |
| `.pdf` | Extracted with PyMuPDF and written as Markdown with source metadata. |
| `.html`, `.htm` | Extracted with Readability and converted with Turndown. |

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

## Examples

Convert everything supported:

```bash
llmwiki convert ./research --out ./research-md
```

Convert only PDFs and text files:

```bash
llmwiki convert ./research --out ./research-md --include .pdf,.txt
```

Skip archive folders:

```bash
llmwiki convert ./research --out ./research-md --exclude archive,temp
```

Use smaller chunks for long files:

```bash
llmwiki convert ./research --out ./research-md --chunk-size 50000
```

Convert PDFs with PyMuPDF:

```bash
python -m pip install pymupdf
llmwiki convert ./papers --out ./papers-md --pdf-engine pymupdf
```

If Python is not on your `PATH`, set `PYMUPDF_PYTHON` to the Python executable:

```bash
PYMUPDF_PYTHON=/path/to/python llmwiki convert ./papers --out ./papers-md
```

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
