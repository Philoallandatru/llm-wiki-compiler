/**
 * Shared image payload helpers for vision providers.
 *
 * Anthropic and OpenAI-compatible APIs use different message shapes, but both
 * need the same local-extension MIME lookup. Keeping it here prevents provider
 * helpers from drifting on supported image types and error wording.
 */

import path from "path";

export type VisionImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const EXTENSION_TO_MIME: Record<string, VisionImageMediaType> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

/** Return the MIME type for a supported local image path. */
export function imageMimeTypeForPath(
  filePath: string,
  allowedMimeTypes: readonly VisionImageMediaType[] = Object.values(EXTENSION_TO_MIME),
): VisionImageMediaType {
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = EXTENSION_TO_MIME[extension];
  if (mimeType && allowedMimeTypes.includes(mimeType)) return mimeType;
  throw new Error(`Unsupported image extension "${extension}". Supported: ${supportedExtensions(allowedMimeTypes)}`);
}

/** Build a data URL accepted by OpenAI-compatible vision endpoints. */
export function imageDataUrl(imageData: string, mimeType: VisionImageMediaType): string {
  return `data:${mimeType};base64,${imageData}`;
}

/** Render extensions for user-facing validation errors. */
function supportedExtensions(allowedMimeTypes: readonly VisionImageMediaType[]): string {
  return Object.entries(EXTENSION_TO_MIME)
    .filter(([, mimeType]) => allowedMimeTypes.includes(mimeType))
    .map(([extension]) => extension)
    .join(", ");
}
