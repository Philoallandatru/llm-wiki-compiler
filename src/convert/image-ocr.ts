/**
 * Image OCR conversion path.
 *
 * The convert command uses Anthropic vision for OCR-only image conversion.
 * Unlike image ingest, this path asks for visible text only and treats a
 * no-text response as a conversion failure.
 */

import { titleFromPath } from "./path-utils.js";
import type { ConvertedFile } from "./types.js";
import { runAnthropicImagePrompt } from "../vision/anthropic-image.js";

const NO_TEXT_MARKER = "NO_TEXT";

const IMAGE_OCR_PROMPT =
  `Transcribe all visible text in this image as Markdown. ` +
  `Do not describe non-text visual content. If there is no visible text, return exactly ${NO_TEXT_MARKER}.`;

/** Convert a supported image file by running Anthropic vision OCR. */
export async function convertImageFile(filePath: string): Promise<ConvertedFile> {
  const body = normalizeOcrText(
    await runAnthropicImagePrompt(filePath, IMAGE_OCR_PROMPT, "Image OCR convert"),
  );
  assertHasOcrText(body);
  return {
    title: titleFromPath(filePath),
    body,
    sourceType: "image",
    contexts: ["OCR"],
  };
}

/** Normalize model output before no-text detection. */
function normalizeOcrText(body: string): string {
  return body.trim();
}

/** Fail clearly when OCR finds no text. */
function assertHasOcrText(body: string): void {
  if (body.length > 0 && body.toUpperCase() !== NO_TEXT_MARKER) return;
  throw new Error("Image OCR found no visible text.");
}
