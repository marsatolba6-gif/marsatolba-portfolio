/**
 * Generate the static Open Graph thumbnail from a single vector source.
 * The PNG is built before dev/production builds; no site UI is modified.
 * Both paths use the same pixels. A new name busts old social-platform caches.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const source = await readFile(join(root, "public/social-monogram.svg"));

const png = await sharp(source, { limitInputPixels: 12_000_000 })
  .png({ compressionLevel: 9, palette: false, effort: 8 })
  .toBuffer();
const meta = await sharp(png).metadata();
if (meta.format !== "png" || meta.width !== 1200 || meta.height !== 630) {
  throw new Error("Social thumbnail must be a 1200x630 PNG.");
}

await Promise.all([
  writeFile(join(root, "public/og-monogram.png"), png),
  writeFile(join(root, "public/og.png"), png),
]);
console.log(`Generated minimal Option 03 social preview (1200x630, ${Math.round(png.byteLength / 1024)} KiB)`);
