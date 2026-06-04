/**
 * Tabular file conversion helpers.
 *
 * CSV, TSV, XLSX, and XLS files are parsed through SheetJS and rendered as
 * Markdown tables. Workbook sheet names are preserved as headings so later
 * compile and query workflows retain table context.
 */

import * as XLSX from "xlsx";
import { titleFromPath } from "./path-utils.js";
import type { ConvertedFile } from "./types.js";

type CellValue = string | number | boolean | Date | null | undefined;
type Row = CellValue[];

/** Convert a CSV, TSV, XLSX, or XLS file to Markdown tables. */
export function convertTableFile(filePath: string): ConvertedFile {
  const workbook = XLSX.readFile(filePath, { cellDates: true, raw: false });
  const sections = workbook.SheetNames.map((sheetName) => sheetSection(workbook, sheetName)).filter(
    (section) => section.body.length > 0,
  );
  if (sections.length === 0) throw new Error("Table file contains no readable rows.");
  return {
    title: titleFromPath(filePath),
    body: sections.map((section) => section.body).join("\n\n"),
    sourceType: "table",
    contexts: sections.map((section) => section.name),
  };
}

/** Render one workbook sheet as a Markdown section. */
function sheetSection(workbook: XLSX.WorkBook, sheetName: string): { name: string; body: string } {
  const sheet = workbook.Sheets[sheetName];
  const rows = trimRows(XLSX.utils.sheet_to_json<Row>(sheet, { header: 1, defval: "", raw: false }));
  if (rows.length === 0) return { name: sheetName, body: "" };
  return { name: sheetName, body: renderSheetMarkdown(sheetName, rows, workbook.SheetNames.length) };
}

/** Remove rows and trailing cells that carry no visible data. */
function trimRows(rows: Row[]): string[][] {
  return rows
    .map((row) => row.map(formatCell).map((cell) => cell.trimEnd()))
    .map(trimTrailingEmptyCells)
    .filter((row) => row.some((cell) => cell.trim().length > 0));
}

/** Render a sheet heading and Markdown table. */
function renderSheetMarkdown(sheetName: string, rows: string[][], sheetCount: number): string {
  const table = markdownTable(rows);
  if (sheetCount === 1) return table;
  return [`## Sheet: ${sheetName}`, "", table].join("\n");
}

/** Convert rows to a Markdown table, creating fallback headers when needed. */
function markdownTable(rows: string[][]): string {
  const width = Math.max(...rows.map((row) => row.length), 1);
  const header = normalizedHeader(rows[0], width);
  const bodyRows = rows.length > 1 ? rows.slice(1) : [[""]];
  return [renderRow(header), renderRow(Array.from({ length: width }, () => "---")), ...bodyRows.map((row) => renderRow(padRow(row, width)))].join("\n");
}

/** Convert the first row into useful table headers. */
function normalizedHeader(row: string[], width: number): string[] {
  return padRow(row, width).map((cell, index) => {
    const trimmed = cell.trim();
    return trimmed.length > 0 ? trimmed : `Column ${index + 1}`;
  });
}

/** Render a Markdown table row with escaped cell text. */
function renderRow(row: string[]): string {
  return `| ${row.map(escapeTableCell).join(" | ")} |`;
}

/** Pad a row to the table width. */
function padRow(row: string[], width: number): string[] {
  return Array.from({ length: width }, (_, index) => row[index] ?? "");
}

/** Remove empty cells from the end of a row. */
function trimTrailingEmptyCells(row: string[]): string[] {
  let end = row.length;
  while (end > 0 && row[end - 1].trim().length === 0) end -= 1;
  return row.slice(0, end);
}

/** Format a SheetJS cell into readable Markdown text. */
function formatCell(value: CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value).replace(/\r?\n/g, " ");
}

/** Escape Markdown table separators. */
function escapeTableCell(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}
