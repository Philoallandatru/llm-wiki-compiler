# 007 - Document The Convert-To-Compile Workflow

Status: Done
Type: AFK
Labels: feature/convert, area/docs

## What to build

Document the new `llmwiki convert` workflow for users who want to preprocess a
folder of mixed file types into Markdown before compiling. The docs should make
clear that `convert` writes only to a separate output folder and that users can
then run `batch-compile` or manual ingest/compile steps against the converted
Markdown.

## Acceptance criteria

- [ ] CLI reference documents `llmwiki convert <folder> --out <folder>`.
- [ ] User manual includes examples for Markdown, text, PDF with PyMuPDF, HTML, and chunking.
- [ ] Docs explain that output is flattened into the top level of the output folder.
- [ ] Docs explain that MinerU is not currently part of this feature.
- [ ] Docs show the recommended next command after conversion.
- [ ] Test report lists the convert command test coverage.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through
- 002 - Convert Plain Text Files To Markdown
- 003 - Convert PDFs With PyMuPDF
- 004 - Chunk Long Converted Markdown Files
- 005 - Add Convert File Filtering And Plan Summary
- 006 - Convert Local HTML Files To Markdown

## Implementation notes

Added `docs/CONVERT_COMMAND.md` and a README quick-start entry for the
convert-to-batch-compile workflow.
