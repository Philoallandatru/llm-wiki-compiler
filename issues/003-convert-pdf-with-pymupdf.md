# 003 - Convert PDFs With PyMuPDF

Status: Done
Type: AFK
Labels: feature/convert, area/pdf

## What to build

Add PDF conversion to `llmwiki convert` using a PyMuPDF-backed engine. The
command should support `--pdf-engine pymupdf` and convert local `.pdf` files to
Markdown files in the flattened output folder. MinerU is intentionally out of
scope for this slice.

## Acceptance criteria

- [ ] `--pdf-engine pymupdf` is accepted by `llmwiki convert`.
- [ ] `.pdf` files are discovered recursively and converted into `.md` output files.
- [ ] PDF output includes source metadata for the original path and selected engine.
- [ ] PDFs with no extractable text fail with a clear message in the report.
- [ ] PDF failures do not stop conversion of unrelated files.
- [ ] Tests cover successful PDF conversion and no-text/unparseable PDF failure.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through

## Implementation notes

`--pdf-engine pymupdf` is implemented by spawning Python with PyMuPDF. The
manual smoke test generated a PDF with PyMuPDF and converted it successfully.
