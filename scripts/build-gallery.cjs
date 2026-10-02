const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'content/works.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories = [['all','全部典藏'],['new','新入藏'],['renaissance','文艺复兴'],['baroque','巴洛克'],['eighteenth','18世纪'],['nineteenth','19世纪'],['twentieth','20世纪']];
if (new Set(works.map(w => w.id)).size !== works.length) throw new Error('Duplicate artwork ID');
const cards = works.map((w, index) => {
  const number = String(index + 1).padStart(3, '0');
  return `<article class="work" data-era="${escape(w.category)}" data-new="${w.isNew}"><button class="art-button" type="button" data-work="${escape(w.id)}" aria-label="查看${escape(w.title)}详情"><span class="art-number">${number}</span>${w.isNew ? '<span class="new-badge">新入藏</span>' : ''}<div class="picture"><img src="assets/${escape(w.id)}.png" alt="${escape(w.alt)}" loading="lazy" decoding="async"></div><span class="art-open">观看作品 ＋</span></button><div class="work-meta"><span>${escape(w.era.split(' / ')[0])} / ${escape(w.year)}</span><span>NO. ${number}</span></div><h3><button data-work="${escape(w.id)}" type="button">${escape(w.title)}</button></h3><p>${escape(w.en)}</p><div class="work-original">灵感原作：${escape(w.artist)}${escape(w.original)}</div></article>`;
}).join('\n      ');
const filters = categories.map(([id, label], index) => {
  const count = works.filter(w => id === 'all' || (id === 'new' ? w.isNew : w.category === id)).length;
  return `<button type="button"${index === 0 ? ' class="active"' : ''} aria-pressed="${index === 0}" data-filter="${id}">${label} <sup>${String(count).padStart(2,'0')}</sup></button>`;
}).join('');
const htmlPath = path.join(root, 'dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/<!-- FILTERS:START -->[\s\S]*?<!-- FILTERS:END -->/, `<!-- FILTERS:START -->${filters}<!-- FILTERS:END -->`);
html = html.replace(/<!-- GALLERY:START -->[\s\S]*?<!-- GALLERY:END -->/, `<!-- GALLERY:START -->\n      ${cards}\n    <!-- GALLERY:END -->`);
html = html.replace(/(<span[^>]*id="hero-count"[^>]*>)[\s\S]*?(<\/span>)/, `$1${works.length} 件展品$2`);
html = html.replace(/(<span[^>]*id="count"[^>]*>)[\s\S]*?(<\/span>)/, `$1展出 ${works.length} 件$2`);
html = html.replace(/(<span id="detail-position">)[\s\S]*?(<\/span>)/, (_, start, end) => `${start}01 / ${String(works.length).padStart(2,'0')}${end}`);
fs.writeFileSync(htmlPath, html);
fs.writeFileSync(path.join(root,'dist/works.js'), `'use strict';\nconst works = ${JSON.stringify(works,null,2)};\n`);
console.log(`Built ${works.length} gallery entries (${works.filter(w=>w.isNew).length} new).`);
