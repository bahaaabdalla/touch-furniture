import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const CATALOG_WIDTH = 1600;
const CATALOG_HEIGHT = 1200;

// The brand watermark is authored at exactly 1600×1200 with its own baked-in
// opacity, so it overlays the whole product image (not a small corner mark).
export async function processCatalogImage(input: Buffer) {
  if (input.byteLength > MAX_IMAGE_BYTES) throw new Error("حجم الصورة أكبر من 15MB.");

  const watermarkSvg = await readFile(path.join(process.cwd(), "public", "brand", "touch-watermark.svg"));
  const watermark = await sharp(watermarkSvg, { density: 144 })
    .resize(CATALOG_WIDTH, CATALOG_HEIGHT, { fit: "fill" })
    .png()
    .toBuffer();

  return sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize(CATALOG_WIDTH, CATALOG_HEIGHT, { fit: "cover", position: sharp.strategy.attention })
    .composite([{ input: watermark, gravity: "center" }])
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
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
