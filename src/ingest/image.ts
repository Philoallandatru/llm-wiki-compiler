/**
 * Image ingestion module using LLM vision capabilities.
 *
 * Reads a local image file, encodes it as base64, and sends it to the
 * configured LLM provider's vision endpoint for OCR-plus-description
 * extraction. Requires the active provider to support image content blocks
 * (currently: Anthropic).
 *
 * Throws a clear error when the provider does not support vision, rather
 * than falling back silently.
 */

import { runAnthropicImagePrompt } from "../vision/anthropic-image.js";
import { titleFromFilename, type IngestedSource } from "./shared.js";

const IMAGE_INGEST_PROMPT =
  "Extract and transcribe all text visible in this image. Then provide a detailed description of any non-text visual content. Format your response as markdown.";

/**
 * Ingest a local image file using LLM vision for OCR and description.
 *
 * Only Anthropic is supported for vision. The active provider must be
 * Anthropic; if not, a clear error is thrown rather than degrading silently.
 *
 * @param filePath - Absolute or relative path to an image file.
 * @returns An object with a title derived from the filename and the extracted content.
 * @throws When the provider does not support vision or on read/API failure.
 */
export default async function ingestImage(filePath: string): Promise<IngestedSource> {
  const content = await runAnthropicImagePrompt(filePath, IMAGE_INGEST_PROMPT);
  const title = titleFromFilename(filePath);

  return { title, content };
}
