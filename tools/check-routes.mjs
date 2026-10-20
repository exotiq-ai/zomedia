import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function invalidPaths(paths) {
  return paths.filter((p) => {
    let decoded;
    try { decoded = decodeURIComponent(p); } catch { return true; }
    return /(?:^|\/)\S[^/]* \d+(?:\.[^/]+)?(?:\/|$)/.test(decoded);
  });
}
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] || 'src/pages';
  const invalid = invalidPaths(walk(root));
  if (invalid.length) { console.error('Unintended duplicate routes:\n' + invalid.join('\n')); process.exitCode = 1; }
  else console.log(`Route hygiene passed: ${root}`);
}
