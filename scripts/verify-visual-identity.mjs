import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const [og, svg, faviconSvg, ico, apple, pwa192, pwa512, layout, manifest] = await Promise.all([
  readFile("public/og-pdf-monogram.png"),
  readFile("app/icon.svg", "utf8"),
  readFile("public/favicon.svg", "utf8"),
  readFile("app/favicon.ico"),
  readFile("app/apple-icon.png"),
  readFile("public/icon-192.png"),
  readFile("public/icon-512.png"),
  readFile("app/layout.tsx", "utf8"),
  readFile("app/manifest.ts", "utf8"),
]);

for (const artwork of [svg, faviconSvg]) {
  assert.ok(artwork.includes('fill="#edebe6"'), "PDF background was changed");
  assert.ok(artwork.includes('M.8328552 0H.6000061'), "Original M vector is missing");
  assert.ok(artwork.includes('M.2128601 .7142792'), "Original apostrophe vector is missing");
  assert.ok(!artwork.includes("MARS ATOLBA"), "Do not add text to logo");
}
assert.equal(svg, faviconSvg, "The two SVG favicon routes must use identical original artwork");
assert.match(layout, /\/og-pdf-monogram\.png/);
assert.match(manifest, /\/icon-192\.png/);
assert.match(manifest, /\/icon-512\.png/);

for (const [label, buf, w, h] of [
  ["social image", og, 1200, 630],
  ["Apple icon", apple, 180, 180],
  ["PWA icon 192", pwa192, 192, 192],
  ["PWA icon 512", pwa512, 512, 512],
]) {
  const info = await sharp(buf).metadata();
  assert.equal(info.format, "png", `${label} must be PNG`);
  assert.equal(info.width, w, `${label} width`);
  assert.equal(info.height, h, `${label} height`);
  const bg = await sharp(buf).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  assert.deepEqual([...bg], [237, 235, 230], `${label} must use the original PDF background`);
}
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 4);
for (let i = 0; i < 4; i++) {
  const entry = 6 + i * 16;
  const length = ico.readUInt32LE(entry + 8);
  const offset = ico.readUInt32LE(entry + 12);
  const item = ico.subarray(offset, offset + length);
  assert.deepEqual([...item.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal((await sharp(item).metadata()).width, [16, 32, 48, 256][i]);
}
console.log("Approved PDF M’ monogram verified on social thumbnail, ICO, SVG, Apple and PWA icons.");
