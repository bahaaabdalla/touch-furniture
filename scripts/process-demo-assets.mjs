import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.join(process.cwd(), "tmp", "imagegen");
const outputDir = path.join(process.cwd(), "public", "demo");
const logo = await readFile(path.join(process.cwd(), "public", "brand", "touch-mark.svg"));
const mark = await sharp(logo, { density: 180 }).resize({ width: 190, height: 130, fit: "inside" }).ensureAlpha().linear([1, 1, 1, 0.3], [0, 0, 0, 0]).png().toBuffer();
const watermark = await sharp({ create: { width: 250, height: 190, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: mark, gravity: "center" }]).png().toBuffer();

for (const file of await readdir(sourceDir)) {
  if (!file.endsWith(".png")) continue;
  const outputName = `${path.parse(file).name}.webp`;
  await sharp(path.join(sourceDir, file), { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize(1600, 1200, { fit: "cover", position: sharp.strategy.attention })
    .composite([{ input: watermark, gravity: "southeast" }])
    .webp({ quality: 82, effort: 4 })
    .toFile(path.join(outputDir, outputName));
  await rm(path.join(sourceDir, file));
  console.log(`processed ${outputName}`);
}
