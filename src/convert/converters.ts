/**
 * File-type converters used by the convert command.
 *
 * Markdown is preserved, text is passed through, HTML is extracted with
 * Readability/Turndown, and PDFs are delegated to the configured PDF engine.
 */

import { readFile } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { titleFromPath } from "./path-utils.js";
import type { ConvertedFile, PdfEngine } from "./types.js";
import { extractPdfWithPyMuPDF } from "./pdf.js";
import { assertTextLikeContent, classifyTextLikePath, fencedText } from "./text-like.js";
import { convertDocxFile, convertPptxFile } from "./office.js";
import { convertTableFile } from "./tables.js";
import { convertImageFile } from "./image-ocr.js";

/** Convert a supported source file to a Markdown body and title. */
export async function convertFileToMarkdown(
  filePath: string,
  pdfEngine: PdfEngine,
): Promise<ConvertedFile> {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".md") return convertMarkdownFile(filePath);
  if (extension === ".txt") return convertTextFile(filePath);
  if (extension === ".html" || extension === ".htm") return convertHtmlFile(filePath);
  if (extension === ".pdf") return convertPdfFile(filePath, pdfEngine);
  if (extension === ".docx") return convertDocxFile(filePath);
  if (extension === ".pptx") return convertPptxFile(filePath);
  if (isTableExtension(extension)) return convertTableFile(filePath);
  if (isImageExtension(extension)) return convertImageFile(filePath);
  const textLike = classifyTextLikePath(filePath);
  if (textLike) return convertTextLikeFile(filePath, textLike);
  throw new Error(`Unsupported extension: ${extension || "(none)"}`);
}

/** Preserve existing Markdown content. */
async function convertMarkdownFile(filePath: string): Promise<ConvertedFile> {
  return {
    title: titleFromPath(filePath),
    body: await readUtf8Text(filePath),
    sourceType: "markdown",
  };
}

/** Convert plain text by treating it as Markdown-safe text. */
async function convertTextFile(filePath: string): Promise<ConvertedFile> {
  await assertTextLikeContent(filePath);
  return {
    title: titleFromPath(filePath),
    body: await readUtf8Text(filePath),
    sourceType: "text",
  };
}

/** Convert code/config/log files while preserving Markdown-sensitive content. */
async function convertTextLikeFile(
  filePath: string,
  textLike: NonNullable<ReturnType<typeof classifyTextLikePath>>,
): Promise<ConvertedFile> {
  await assertTextLikeContent(filePath);
  const body = await readUtf8Text(filePath);
  return {
    title: titleFromPath(filePath),
    body: textLike.shouldFence ? fencedText(body, textLike.language) : body,
    sourceType: textLike.sourceType,
  };
}

/** Extract readable local HTML and convert it to Markdown. */
async function convertHtmlFile(filePath: string): Promise<ConvertedFile> {
  const html = await readUtf8Text(filePath);
  const dom = new JSDOM(html, { url: pathToFileURL(filePath).toString() });
  const article = new Readability(dom.window.document).parse();
  const htmlContent = article?.content ?? dom.window.document.body?.innerHTML ?? html;
  const title = article?.title || dom.window.document.title || titleFromPath(filePath);
  const body = new TurndownService({ headingStyle: "atx" }).turndown(htmlContent);
  assertReadableHtml(body);
  return { title, body, sourceType: "html" };
}

/** Reject HTML that parses but yields no Markdown text. */
function assertReadableHtml(body: string): void {
  if (body.trim().length > 0) return;
  throw new Error("No readable HTML content found.");
}

/** Read UTF-8 text, removing an optional leading byte-order mark. */
async function readUtf8Text(filePath: string): Promise<string> {
  const content = await readFile(filePath, "utf-8");
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

/** Convert a PDF with the configured engine. */
async function convertPdfFile(filePath: string, pdfEngine: PdfEngine): Promise<ConvertedFile> {
  if (pdfEngine !== "pymupdf") throw new Error(`Unsupported PDF engine: ${pdfEngine}`);
  return {
    title: titleFromPath(filePath),
    body: await extractPdfWithPyMuPDF(filePath),
    sourceType: "pdf",
  };
}

/** Return true for tabular extensions parsed as Markdown tables. */
function isTableExtension(extension: string): boolean {
  return [".csv", ".tsv", ".xlsx", ".xls"].includes(extension);
}

/** Return true for image extensions supported by Anthropic vision OCR. */
function isImageExtension(extension: string): boolean {
  return [".jpg", ".jpeg", ".png", ".webp"].includes(extension);
}
