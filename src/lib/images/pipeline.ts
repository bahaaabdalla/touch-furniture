import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const CATALOG_WIDTH = 1600;
const CATALOG_HEIGHT = 1200;
// Card/paper tone so "contain" letterboxing blends into the catalog cards.
const CANVAS_BACKGROUND = { r: 255, g: 253, b: 248 };

// The brand watermark is a pre-rendered 1600×1200 transparent PNG (all text
// already baked in), so it composites reliably without needing server fonts.
// "contain" keeps the whole product visible (no zoom/crop) at a uniform size.
export async function processCatalogImage(input: Buffer, applyWatermark = true) {
  if (input.byteLength > MAX_IMAGE_BYTES) throw new Error("حجم الصورة أكبر من 15MB.");

  const pipeline = sharp(input, { failOn: "none", limitInputPixels: 40_000_000 })
    .rotate()
    .resize(CATALOG_WIDTH, CATALOG_HEIGHT, { fit: "contain", background: CANVAS_BACKGROUND })
    .flatten({ background: CANVAS_BACKGROUND });

  if (applyWatermark) {
    const watermark = await readFile(path.join(process.cwd(), "public", "brand", "touch-watermark.png"));
    pipeline.composite([{ input: watermark, gravity: "center" }]);
  }

  return pipeline.webp({ quality: 82, effort: 4 }).toBuffer();
}

export async function processLogoImage(input: Buffer) {
  if (input.byteLength > MAX_IMAGE_BYTES) throw new Error("حجم الشعار أكبر من 15MB.");
  return sharp(input, { failOn: "warning", limitInputPixels: 20_000_000 })
    .rotate()
    .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function defaultLogoBuffer() {
  return readFile(path.join(process.cwd(), "public", "brand", "touch-mark.svg"));
}
