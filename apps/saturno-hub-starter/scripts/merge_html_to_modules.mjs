import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const inDir = process.argv[2] || 'legacy';
const outDir = path.join('public', 'legacy');
fs.mkdirSync(outDir, { recursive: true });

const manifest = [];

for (const file of fs.readdirSync(inDir)) {
  if (!file.endsWith('.html')) continue;
  const html = fs.readFileSync(path.join(inDir, file), 'utf8');
  const $ = cheerio.load(html);

  const title = $('title').first().text() || file;
  const styles = [];
  $('style').each((i, el) => styles.push($(el).html() || ''));
  const scripts = [];
  $('script').each((i, el) => scripts.push($(el).html() || ''));

  const body = $('body').html() || '';
  const head = $('head').html() || '';

  const base = path.parse(file).name;
  const item = {
    id: base,
    file,
    title,
    headPath: `legacy/${base}.head.html`,
    bodyPath: `legacy/${base}.body.html`,
    stylesPath: `legacy/${base}.styles.js`,
    scriptsPath: `legacy/${base}.scripts.js`
  };
  fs.writeFileSync(path.join(outDir, `${base}.head.html`), head);
  fs.writeFileSync(path.join(outDir, `${base}.body.html`), body);
  fs.writeFileSync(path.join(outDir, `${base}.styles.js`), `export default ${JSON.stringify(styles)};`);
  fs.writeFileSync(path.join(outDir, `${base}.scripts.js`), `export default ${JSON.stringify(scripts)};`);
  manifest.push(item);
}

fs.writeFileSync(path.join(outDir, `manifest.json`), JSON.stringify(manifest, null, 2));
console.log(`Merged ${manifest.length} HTML file(s). Output: public/legacy/manifest.json`);
