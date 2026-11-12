import manifest from "../image-hd-manifest.json";

/** Preserve originals and serve lossless, edge-enhanced 2× copies where source resolution is small. */
const hdAssets: Record<string, string> = Object.fromEntries(
  manifest.assets.map(({ source, display }) => [source, display]),
);

export function getSharpImageSrc(original: string): string {
  return hdAssets[original] ?? original;
}

/** The full original is always available for exact-pixel inspection. */
export function getOriginalImageSrc(original: string): string {
  return original;
}
