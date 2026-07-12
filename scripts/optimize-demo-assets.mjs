import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const directory = path.join(process.cwd(), "public", "demo");
const files = (await readdir(directory)).filter((file) => file.endsWith(".webp"));

for (const file of files) {
  const source = path.join(directory, file);
  const output = await sharp(await readFile(source))
    .webp({ quality: 68, effort: 6 })
    .toBuffer();
  await writeFile(source, output);
}

console.log(`Optimized ${files.length} demo assets for the self-contained deployment.`);
