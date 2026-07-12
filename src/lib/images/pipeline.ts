import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function processCatalogImage(input: Buffer, logo: Buffer) {
  if (input.byteLength > MAX_IMAGE_BYTES) throw new Error("حجم الصورة أكبر من 15MB.");

  const mark = await sharp(logo, { density: 180 })
    .resize({ width: 190, height: 130, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .linear([1, 1, 1, 0.3], [0, 0, 0, 0])
    .png()
    .toBuffer();

  const watermark = await sharp({
    create: { width: 250, height: 190, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: mark, gravity: "center" }]).png().toBuffer();

  return sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize(1600, 1200, { fit: "cover", position: sharp.strategy.attention })
    .composite([{ input: watermark, gravity: "southeast" }])
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
