/**
 * Build the browser, Apple, and PWA icons from the same PDF-derived M’ SVG.
 *
 * Preserve the site's social-sharing thumbnail and all layout/animations.
 * This only rewrites icon asset files at build/dev startup. PNGs are lossless.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const vector = await readFile(join(root, "app/icon.svg"));
const renderPng = (size) => sharp(vector, { density: 288 })
  .resize(size, size, { fit: "fill", kernel: "lanczos3" })
  .png({ palette: false, compressionLevel: 9 })
  .toBuffer();

// ICO supports PNG-encoded images. Assemble multiple crisp sizes in one file.
const faviconSizes = [16, 32, 48, 256];
const pngs = await Promise.all(faviconSizes.map(renderPng));
const icoHead = Buffer.alloc(6);
icoHead.writeUInt16LE(0, 0);
icoHead.writeUInt16LE(1, 2);
icoHead.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const icoEntries = pngs.map((png, index) => {
  const size = faviconSizes[index];
  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

await Promise.all([
  writeFile(join(root, "app/favicon.ico"), Buffer.concat([icoHead, ...icoEntries, ...pngs])),
  writeFile(join(root, "app/apple-icon.png"), await renderPng(180)),
  writeFile(join(root, "public/icon-192.png"), await renderPng(192)),
  writeFile(join(root, "public/icon-512.png"), await renderPng(512)),
]);

for (const [path, expected] of [
  ["app/apple-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
]) {
  const metadata = await sharp(join(root, path)).metadata();
  if (metadata.format !== "png" || metadata.width !== expected || metadata.height !== expected) {
    throw new Error(`Icon size or format mismatch: ${path}`);
  }
}
console.log("Original PDF M’ logo icons prepared: SVG, ICO (16/32/48/256), Apple 180, PWA 192/512.");
