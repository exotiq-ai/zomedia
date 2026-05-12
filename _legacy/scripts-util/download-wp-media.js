const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const WP_URL = 'https://zomediaproductions.com';
const USERNAME = process.env.WP_USER || '';
const PASSWORD = process.env.WP_PASS || '';
const DOWNLOAD_DIR = path.join(__dirname, '..', 'assets', 'images', 'wp-imports');

async function main() {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening WordPress login page — please log in manually...');
  await page.goto(`${WP_URL}/wp-login.php`, { waitUntil: 'networkidle' });

  console.log('Waiting for you to log in (you have 5 minutes)...');
  const deadline = Date.now() + 300000;
  while (Date.now() < deadline) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (!url.includes('wp-login.php')) {
      console.log(`Redirected to: ${url}`);
      break;
    }
  }
  if (page.url().includes('wp-login.php')) {
    console.error('Timed out waiting for login.');
    await browser.close();
    process.exit(1);
  }

  // Navigate to wp-admin to confirm we're authenticated
  await page.goto(`${WP_URL}/wp-admin/`, { waitUntil: 'networkidle', timeout: 30000 });
  if (page.url().includes('wp-login.php')) {
    console.error('Login failed — redirected back to login page.');
    process.exit(1);
  }
  console.log('Logged in to wp-admin!');

  let mediaItems = [];
  let pageNum = 1;
  let hasMore = true;

  console.log('Fetching media library via REST API...');
  while (hasMore) {
    const result = await page.evaluate(async (pn) => {
      const resp = await fetch(`/wp-json/wp/v2/media?per_page=100&page=${pn}`);
      if (!resp.ok) return { items: [], hasMore: false };
      const items = await resp.json();
      const totalPages = parseInt(resp.headers.get('X-WP-TotalPages') || '1');
      return {
        items: items.map(item => ({
          id: item.id,
          source_url: item.source_url,
          mime_type: item.mime_type,
          filename: item.source_url ? item.source_url.split('/').pop() : null
        })),
        hasMore: pn < totalPages
      };
    }, pageNum);

    mediaItems = mediaItems.concat(result.items);
    hasMore = result.hasMore;
    pageNum++;
  }

  const images = mediaItems.filter(i => i.mime_type && i.mime_type.startsWith('image/') && i.source_url);
  console.log(`Found ${images.length} images (${mediaItems.length} total media items)`);

  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const filepath = path.join(DOWNLOAD_DIR, img.filename);

    if (fs.existsSync(filepath)) {
      console.log(`  [skip] ${img.filename} (already exists)`);
      downloaded++;
      continue;
    }

    try {
      const response = await context.request.get(img.source_url);
      if (response.ok()) {
        fs.writeFileSync(filepath, await response.body());
        downloaded++;
        console.log(`  [${downloaded}/${images.length}] ${img.filename}`);
      } else {
        console.log(`  [FAIL] ${img.filename} — HTTP ${response.status()}`);
        failed++;
      }
    } catch (err) {
      console.log(`  [FAIL] ${img.filename} — ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\nDone. ${downloaded} downloaded, ${failed} failed.`);
  console.log(`Files in: ${DOWNLOAD_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
