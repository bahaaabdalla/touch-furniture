import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { defaultLogoBuffer, processCatalogImage, processLogoImage } from "@/lib/images/pipeline";

describe("image pipeline", () => {
  it("normalizes photos to a metadata-free 1600x1200 WebP", async () => {
    const input = await sharp({ create: { width: 2100, height: 1300, channels: 3, background: "#baa58f" } }).jpeg().toBuffer();
    const output = await processCatalogImage(input, await defaultLogoBuffer());
    const metadata = await sharp(output).metadata();
    expect(metadata).toMatchObject({ width: 1600, height: 1200, format: "webp" });
    expect(metadata.exif).toBeUndefined();
  });

  it("normalizes replacement logos to a transparent PNG canvas", async () => {
    const input = await sharp({ create: { width: 400, height: 200, channels: 4, background: { r: 109, g: 76, b: 61, alpha: 1 } } }).png().toBuffer();
    const output = await processLogoImage(input);
    const metadata = await sharp(output).metadata();
    expect(metadata).toMatchObject({ width: 1024, height: 1024, format: "png", hasAlpha: true });
  });
});

