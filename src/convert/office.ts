/**
 * Office Open XML document conversion helpers.
 *
 * DOCX and PPTX files are ZIP containers with XML payloads. This module reads
 * those containers directly, extracts textual paragraph runs with an XML
 * parser, and renders them as Markdown sections suitable for later compile.
 */

import { readFile } from "fs/promises";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { titleFromPath } from "./path-utils.js";
import type { ConvertedFile } from "./types.js";

type XmlTree = Array<Record<string, unknown>>;

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  textNodeName: "#text",
});

/** Convert a DOCX file to Markdown paragraphs. */
export async function convertDocxFile(filePath: string): Promise<ConvertedFile> {
  const zip = await openZip(filePath);
  const xml = await readZipText(zip, "word/document.xml");
  const paragraphs = extractXmlBlocks(xml, "w:p", "w:t");
  assertHasBlocks(paragraphs, "DOCX");
  return {
    title: titleFromPath(filePath),
    body: paragraphs.join("\n\n"),
    sourceType: "document",
  };
}

/** Convert a PPTX file to Markdown slide sections. */
export async function convertPptxFile(filePath: string): Promise<ConvertedFile> {
  const zip = await openZip(filePath);
  const slidePaths = sortedSlidePaths(Object.keys(zip.files));
  const sections = await Promise.all(slidePaths.map((slidePath, index) => slideSection(zip, slidePath, index + 1)));
  const body = sections.filter((section) => section.trim().length > 0).join("\n\n");
  if (body.trim().length === 0) throw new Error("PPTX contains no readable slide text.");
  return {
    title: titleFromPath(filePath),
    body,
    sourceType: "presentation",
    contexts: slidePaths.map((_, index) => `Slide ${index + 1}`),
  };
}

/** Load a local OOXML container. */
async function openZip(filePath: string): Promise<JSZip> {
  return await JSZip.loadAsync(await readFile(filePath));
}

/** Read one required text payload from a ZIP container. */
async function readZipText(zip: JSZip, innerPath: string): Promise<string> {
  const file = zip.file(innerPath);
  if (!file) throw new Error(`Office file is missing ${innerPath}.`);
  return await file.async("text");
}

/** Return slide XML paths in presentation order. */
function sortedSlidePaths(paths: string[]): string[] {
  return paths
    .filter((filePath) => /^ppt\/slides\/slide\d+\.xml$/.test(filePath))
    .sort((left, right) => slideNumber(left) - slideNumber(right));
}

/** Extract the numeric slide suffix from an OOXML slide path. */
function slideNumber(filePath: string): number {
  return Number(filePath.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
}

/** Convert one slide XML file into a Markdown section. */
async function slideSection(zip: JSZip, slidePath: string, slideIndex: number): Promise<string> {
  const paragraphs = extractXmlBlocks(await readZipText(zip, slidePath), "a:p", "a:t");
  if (paragraphs.length === 0) return "";
  return [`## Slide ${slideIndex}`, "", paragraphs.join("\n\n")].join("\n");
}

/** Extract text blocks from XML by container tag and text tag. */
function extractXmlBlocks(xml: string, blockTag: string, textTag: string): string[] {
  const tree = parser.parse(xml) as XmlTree;
  return findBlocks(tree, blockTag, textTag)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

/** Recursively find block nodes and collect their text descendants. */
function findBlocks(value: unknown, blockTag: string, textTag: string): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => findBlocks(item, blockTag, textTag));
  if (!isXmlObject(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === blockTag) return [collectText(child, textTag).join("")];
    return findBlocks(child, blockTag, textTag);
  });
}

/** Recursively collect text nodes below a known OOXML text tag. */
function collectText(value: unknown, textTag: string): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => collectText(item, textTag));
  if (typeof value === "string") return [value];
  if (!isXmlObject(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === ":@") return [];
    if (key === textTag || key === "#text") return collectText(child, textTag);
    return collectText(child, textTag);
  });
}

/** Narrow unknown parser output to an XML object. */
function isXmlObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Throw a clear unreadable-document error. */
function assertHasBlocks(blocks: string[], label: string): void {
  if (blocks.length > 0) return;
  throw new Error(`${label} contains no readable text.`);
}
