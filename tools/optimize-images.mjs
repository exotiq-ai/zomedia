// Re-encodes oversized public JPEGs in place (max width 1800px, progressive mozjpeg q72).
// Skips files that would not get smaller. Usage: node tools/optimize-images.mjs [file …]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const PUB = path.resolve(import.meta.dirname, '../public');
const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/assets/images/support-cellblock.jpg', '/assets/images/zo-media/zo-tower.001.jpeg'];

for (const t of targets) {
  const file = path.join(PUB, t);
  const before = fs.statSync(file).size;
  const out = await sharp(file).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true, progressive: true }).toBuffer();
  if (out.length < before * 0.9) {
    fs.writeFileSync(file, out);
    console.log(`✓ ${t}: ${(before / 1024) | 0} KB → ${(out.length / 1024) | 0} KB`);
  } else {
    console.log(`– ${t}: already small (${(before / 1024) | 0} KB)`);
  }
}
