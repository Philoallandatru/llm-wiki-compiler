# 012 - Add PyMuPDF Automated Regression Tests

Status: Open
Type: AFK
Labels: feature/convert, area/pdf, area/tests

## What to build

Add automated regression coverage for the PyMuPDF PDF conversion path. The test
should create or use a small PDF fixture, run conversion, and verify extracted
Markdown and PDF metadata. If PyMuPDF is unavailable, the test should skip with
a clear reason rather than fail unrelated environments.

## Acceptance criteria

- [ ] Test detects whether Python with PyMuPDF is available.
- [ ] Available PyMuPDF runs a successful PDF conversion test.
- [ ] Output Markdown includes extracted PDF text.
- [ ] Output metadata includes `sourceType: pdf` and `pdfEngine: pymupdf`.
- [ ] Missing PyMuPDF is covered by a clear error or skip path.
- [ ] The test is stable in local and pre-push runs.

## Blocked by

None - can start immediately.
