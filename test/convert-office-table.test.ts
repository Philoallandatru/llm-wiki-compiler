/**
 * Conversion coverage for Office and tabular source formats.
 *
 * Fixtures are generated in-memory so the tests exercise real OOXML ZIP
 * containers and real SheetJS workbook parsing without checking binary files
 * into the repository.
 */

import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { describe, expect, it, vi } from "vitest";
import convertCommand from "../src/commands/convert.js";
import type { ConvertOptions, ConvertSummary } from "../src/convert/types.js";
import { useTempRoot } from "./fixtures/temp-root.js";

const root = useTempRoot();

interface ConvertedFixture {
  inputDir: string;
  outDir: string;
  summary: ConvertSummary;
  bodies: string[];
}

/** Seed an input folder, run convert, and read Markdown outputs. */
async function convertFixture(
  folderName: string,
  seed: (inputDir: string) => Promise<void> | void,
  options: Partial<ConvertOptions> = {},
): Promise<ConvertedFixture> {
  const inputDir = path.join(root.dir, `${folderName}-input`);
  const outDir = path.join(root.dir, `${folderName}-output`);
  await mkdir(inputDir, { recursive: true });
  await seed(inputDir);
  const summary = await convertCommand(inputDir, { ...options, out: outDir });
  return { inputDir, outDir, summary, bodies: await readBodies(outDir) };
}

/** Read Markdown output bodies from a conversion folder. */
async function readBodies(outDir: string): Promise<string[]> {
  const files = (await readdir(outDir)).filter((file) => file.endsWith(".md")).sort();
  return await Promise.all(files.map((file) => readFile(path.join(outDir, file), "utf-8")));
}

/** Write a minimal DOCX ZIP with document text. */
async function writeDocx(filePath: string, paragraphs: string[]): Promise<void> {
  const zip = new JSZip();
  zip.file("word/document.xml", documentXml(paragraphs));
  await writeFile(filePath, await zip.generateAsync({ type: "nodebuffer" }));
}

/** Write a minimal PPTX ZIP with slide text. */
async function writePptx(filePath: string, slides: string[][]): Promise<void> {
  const zip = new JSZip();
  for (const [index, paragraphs] of slides.entries()) {
    zip.file(`ppt/slides/slide${index + 1}.xml`, slideXml(paragraphs));
  }
  await writeFile(filePath, await zip.generateAsync({ type: "nodebuffer" }));
}

/** Render minimal DOCX document XML. */
function documentXml(paragraphs: string[]): string {
  return `<w:document><w:body>${paragraphs.map((text) => `<w:p><w:r><w:t>${text}</w:t></w:r></w:p>`).join("")}</w:body></w:document>`;
}

/** Render minimal PPTX slide XML. */
function slideXml(paragraphs: string[]): string {
  return `<p:sld><p:cSld><p:spTree>${paragraphs.map((text) => `<a:p><a:r><a:t>${text}</a:t></a:r></a:p>`).join("")}</p:spTree></p:cSld></p:sld>`;
}

describe("convert Office and tabular files", () => {
  it("converts DOCX files into Markdown", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { summary, bodies } = await convertFixture("docx", (inputDir) =>
      writeDocx(path.join(inputDir, "brief.docx"), ["Project Brief", "Readable body"]),
    );

    expect(summary.written).toBe(1);
    expect(bodies[0]).toContain("sourceType: document");
    expect(bodies[0]).toContain("Project Brief");
    expect(bodies[0]).toContain("Readable body");
  });

  it("converts PPTX files with slide boundaries", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { summary, bodies } = await convertFixture("pptx", (inputDir) =>
      writePptx(path.join(inputDir, "deck.pptx"), [["Title Slide"], ["Second Slide"]]),
    );

    expect(summary.written).toBe(1);
    expect(bodies[0]).toContain("sourceType: presentation");
    expect(bodies[0]).toContain("## Slide 1");
    expect(bodies[0]).toContain("## Slide 2");
  });

  it("reports unreadable Office documents as conversion failures", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "bad-office-input");
    const outDir = path.join(root.dir, "bad-office-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "broken.docx"), "not a zip");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /One or more files failed/,
    );
  });

  it("converts CSV and TSV files into Markdown tables", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { summary, bodies } = await convertFixture("delimited", async (inputDir) => {
      await writeFile(path.join(inputDir, "data.csv"), "name,count\nAlpha,2", "utf-8");
      await writeFile(path.join(inputDir, "data.tsv"), "name\tcount\nBeta\t3", "utf-8");
    });
    const joined = bodies.join("\n");

    expect(summary.written).toBe(2);
    expect(joined).toContain("| name | count |");
    expect(joined).toContain("| Alpha | 2 |");
    expect(joined).toContain("| Beta | 3 |");
  });

  it("preserves workbook sheet names in XLSX and XLS output", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { summary, bodies } = await convertFixture("workbook", (inputDir) => {
      writeWorkbook(path.join(inputDir, "book.xlsx"));
      writeWorkbook(path.join(inputDir, "legacy.xls"));
    });
    const joined = bodies.join("\n");

    expect(summary.written).toBe(2);
    expect(joined).toContain("## Sheet: Alpha");
    expect(joined).toContain("## Sheet: Beta");
    expect(joined).toContain("contexts:");
  });

  it("chunks large tables on row boundaries where possible", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { summary, bodies } = await convertFixture(
      "large-table",
      (inputDir) => writeFile(path.join(inputDir, "large.csv"), largeCsv(), "utf-8"),
      { chunkSize: 80 },
    );

    expect(summary.written).toBeGreaterThan(1);
    expect(bodies.every((body) => !body.includes("row-0000000000000000000000000000000\n"))).toBe(true);
    expect(bodies.join("\n")).toContain("| row-0000000000000000000000000000001 | value |");
  });
});

/** Write a two-sheet XLSX workbook. */
function writeWorkbook(filePath: string): void {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["name"], ["one"]]), "Alpha");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["name"], ["two"]]), "Beta");
  XLSX.writeFile(workbook, filePath);
}

/** Build a CSV whose Markdown rows are chunkable by line. */
function largeCsv(): string {
  const rows = ["name,value"];
  for (let index = 1; index <= 6; index += 1) {
    rows.push(`row-000000000000000000000000000000${index},value`);
  }
  return rows.join("\n");
}
