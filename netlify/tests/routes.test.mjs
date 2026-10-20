import test from 'node:test';
import assert from 'node:assert/strict';

test('route guard rejects duplicate filenames and encoded duplicate output routes', async () => {
  const { invalidPaths } = await import('../../tools/check-routes.mjs');
  assert.deepEqual(invalidPaths(['src/pages/privacy 2.astro', 'dist/books/title%202/index.html', 'src/pages/about.astro']), ['src/pages/privacy 2.astro', 'dist/books/title%202/index.html']);
});
