/**
 * OpenAI-compatible vision helper for image-based workflows.
 *
 * Custom OpenAI-compatible gateways commonly expose chat completions with
 * `image_url` content blocks. This helper mirrors the Anthropic image helper
 * while using OPENAI_BASE_URL and OPENAI_API_KEY so `llmwiki convert` can run
 * image OCR against local or proxied vision-capable models.
 */

import { readFile } from "fs/promises";
import OpenAI from "openai";
import { OPENAI_DEFAULT_TIMEOUT_MS, PROVIDER_MODELS } from "../utils/constants.js";
import { readTimeoutEnv } from "../providers/openai.js";
import { imageDataUrl, imageMimeTypeForPath, type VisionImageMediaType } from "./image-data.js";

/** Mime types accepted by OpenAI-compatible image_url data URLs. */
const OPENAI_IMAGE_MIME_TYPES: readonly VisionImageMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/** Send a local image and prompt to an OpenAI-compatible vision model. */
export async function runOpenAICompatibleImagePrompt(
  filePath: string,
  prompt: string,
): Promise<string> {
  const imageData = (await readFile(filePath)).toString("base64");
  const response = await buildClient().chat.completions.create({
    model: process.env.LLMWIKI_MODEL ?? PROVIDER_MODELS.openai,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: openAIImageDataUrl(filePath, imageData) } },
        ],
      },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

/** Build an OpenAI SDK client from the current compatible endpoint env. */
function buildClient(): OpenAI {
  return new OpenAI({
    apiKey: requiredOpenAIKey(),
    baseURL: optionalEnv("OPENAI_BASE_URL"),
    timeout: readTimeoutEnv("LLMWIKI_REQUEST_TIMEOUT_MS") ?? OPENAI_DEFAULT_TIMEOUT_MS,
  });
}

/** Keep missing keys clear; local gateways can set any non-empty dummy key. */
function requiredOpenAIKey(): string {
  const apiKey = optionalEnv("OPENAI_API_KEY");
  if (apiKey) return apiKey;
  throw new Error("OpenAI-compatible image OCR requires OPENAI_API_KEY.");
}

/** Return a trimmed environment value when present. */
function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Build a data URL for MIME types accepted by OpenAI-compatible endpoints. */
function openAIImageDataUrl(filePath: string, imageData: string): string {
  return imageDataUrl(imageData, imageMimeTypeForPath(filePath, OPENAI_IMAGE_MIME_TYPES));
}
