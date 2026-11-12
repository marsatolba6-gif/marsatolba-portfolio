/**
 * Non-generative, non-destructive 2x workflow image preparation.
 *
 * Original screenshots remain untouched. Lanczos3 interpolation with modest
 * edge sharpening creates lossless PNG copies better suited to high-DPI screens.
 * This cannot recover information absent from the original capture.
 */
import { readFile, mkdir, stat } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(join(root, "image-hd-manifest.json"), "utf8"));

for (const { source, display } of manifest.assets) {
  if (!/^\/assets\/[a-z0-9_.-]+\.(png|svg)$/.test(source)) {
    throw new Error(`Unexpected source image path: ${source}`);
  }
  if (!/^\/assets\/hd\/[a-z0-9_.@-]+\.png$/.test(display)) {
    throw new Error(`Unexpected display image path: ${display}`);
  }

  const inputPath = join(root, "public", source);
  const outputPath = join(root, "public", display);
  const info = await sharp(inputPath).metadata();
  if (!info.width || !info.height) {
    throw new Error(`Cannot determine source image resolution: ${source}`);
  }
  if (info.width > 1800 || info.height > 1800) {
    throw new Error(`Source is already large; remove from HD manifest: ${source}`);
  }

  await mkdir(dirname(outputPath), { recursive: true });
  const width = info.width * 2;
  const height = info.height * 2;
  await sharp(inputPath, { limitInputPixels: 45_000_000 })
    .resize({ width, height, fit: "fill", kernel: "lanczos3" })
    .sharpen({ sigma: 0.75 })
    .png({ compressionLevel: 9, palette: false, effort: 8 })
    .toFile(outputPath);

  const outInfo = await sharp(outputPath).metadata();
  if (outInfo.width !== width || outInfo.height !== height || outInfo.format !== "png") {
    throw new Error(`HD image validation failed: ${display}`);
  }
  const { size } = await stat(outputPath);
  console.log(`Image prepared: ${source} ${info.width}x${info.height} → ${width}x${height} (${Math.round(size / 1024)} KiB)`);
}
