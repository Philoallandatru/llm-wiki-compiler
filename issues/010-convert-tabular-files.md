# 010 - Convert Tabular Files To Markdown

Status: Open
Type: AFK
Labels: feature/convert, area/file-types

## What to build

Add a complete `llmwiki convert` path for tabular local files such as `.csv`,
`.tsv`, `.xlsx`, and `.xls`. Tables should become readable Markdown tables or
structured Markdown sections that are useful for later compile/query workflows.

## Acceptance criteria

- [ ] `.csv` and `.tsv` files are discovered and converted.
- [ ] `.xlsx` and `.xls` files are discovered and converted.
- [ ] Multi-sheet workbooks preserve sheet names in the Markdown output.
- [ ] Very large tables are chunked without breaking rows where possible.
- [ ] Source metadata records the original file and table/sheet context.
- [ ] Tests cover CSV, TSV, multi-sheet workbook, and large-table chunking.

## Blocked by

- 008 - Add Text-Like File Coverage To `llmwiki convert`
