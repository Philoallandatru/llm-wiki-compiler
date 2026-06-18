/**
 * Shared Anthropic vision helper for image-based workflows.
 *
 * Image ingest and image-to-Markdown conversion both need the same provider
 * guard, MIME detection, base64 encoding, and Anthropic message shape. This
 * module centralizes that plumbing while callers provide task-specific prompts.
 */

import { readFile } from "fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import { buildAnthropicClientOptions } from "../providers/anthropic.js";
import { resolveAnthropicAuthFromEnv, resolveAnthropicBaseURLFromEnv, resolveAnthropicModelFromEnv } from "../utils/claude-settings.js";
import { IMAGE_DESCRIBE_MAX_TOKENS, PROVIDER_MODELS } from "../utils/constants.js";
import { imageMimeTypeForPath, type VisionImageMediaType } from "./image-data.js";

/** Send a local image and prompt to Anthropic vision. */
export async function runAnthropicImagePrompt(
  filePath: string,
  prompt: string,
  featureLabel = "Image ingest",
): Promise<string> {
  assertAnthropicVisionProvider(featureLabel);
  const imageData = (await readFile(filePath)).toString("base64");
  const response = await buildClient().messages.create({
    model: resolveAnthropicModelFromEnv() ?? PROVIDER_MODELS.anthropic,
    max_tokens: IMAGE_DESCRIBE_MAX_TOKENS,
    messages: [imageMessage(imageData, imageMimeTypeForPath(filePath), prompt)],
  });
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

/** Build an Anthropic SDK client from current environment config. */
function buildClient(): Anthropic {
  const baseURL = resolveAnthropicBaseURLFromEnv();
  const auth = resolveAnthropicAuthFromEnv();
  return new Anthropic(buildAnthropicClientOptions({ baseURL, ...auth }));
}

/** Fail clearly when the active provider cannot handle image content. */
function assertAnthropicVisionProvider(featureLabel: string): void {
  const providerName = process.env.LLMWIKI_PROVIDER ?? "anthropic";
  if (providerName === "anthropic") return;
  throw new Error(
    `${featureLabel} requires the Anthropic provider (vision). ` +
      `Current provider: "${providerName}". ` +
      `Set LLMWIKI_PROVIDER=anthropic and ANTHROPIC_API_KEY to use ${featureLabel.toLowerCase()}.`,
  );
}

/** Build one Anthropic user message containing an image and task prompt. */
function imageMessage(
  imageData: string,
  mimeType: VisionImageMediaType,
  prompt: string,
): Anthropic.MessageCreateParams["messages"][number] {
  return {
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: mimeType, data: imageData } },
      { type: "text", text: prompt },
    ],
  };
}
