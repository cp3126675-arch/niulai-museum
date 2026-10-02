'use strict';
const works = [
  { id: 'mona', title: '蒙牛丽莎', en: 'Mona Niulisa', era: '文艺复兴 / RENAISSANCE', original: '《蒙娜丽莎》', artist: '列奥纳多·达·芬奇', year: '约 1503–1519', note: '先看交叠的双手，再看嘴角，最后看远处的山水。熟悉的三角构图与朦胧远景仍然在场，牛来却把神秘的微笑，变成了一种认真发呆的神情。', quote: '她好像知道什么。牛来好像什么也不知道。' },
  { id: 'pearl', title: '戴珍珠耳环的牛来', en: 'Niulai with a Pearl Earring', era: '巴洛克 / BAROQUE', original: '《戴珍珠耳环的少女》', artist: '约翰内斯·维米尔', year: '约 1665', note: '深色背景让目光停在脸部、蓝金色头巾和耳环上。原作回眸的一瞬被保留下来；珍珠依然闪亮，只是这次回头的牛来，似乎忘了自己为什么回头。', quote: '珍珠是真的亮。眼神是真的空。' },
  { id: 'scream', title: '牛来的呐喊', en: 'The Scream of Niulai', era: '表现主义先声 / A PRELUDE TO EXPRESSIONISM', original: '《呐喊》', artist: '爱德华·蒙克', year: '1893', note: '沿着桥栏看向远处，再让目光跟随天空扭动的曲线。倾斜的空间与灼热的色彩围住牛来，双手捂脸的姿态保留了原作的不安，也让这个熟悉的角色终于有了强烈表情。', quote: '当牛来发现，下一幅名画里还是自己。' }
];
const $ = (selector) => document.querySelector(selector);
const themeButton = $('#theme');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '切换为日间展厅' : '切换为夜间展厅');
  $('.theme-label').textContent = dark ? '日间展厅' : '夜间展厅';
  try { localStorage.setItem('niulai-theme', dark ? 'dark' : 'light'); } catch (_) {}
}
try { setTheme(localStorage.getItem('niulai-theme') === 'dark'); } catch (_) { setTheme(false); }
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  document.querySelectorAll('.work').forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.era !== button.dataset.filter; if (!item.hidden) count++; });
  $('#count').textContent = `展出 ${count} 件`;
}));
const dialog = $('#art-dialog');
let current = 0;
function updateWork(index) {
  current = (index + works.length) % works.length;
  const work = works[current];
  const number = String(current + 1).padStart(3, '0');
  $('#detail-index').textContent = `馆藏 / ${number}`;
  $('#detail-image').src = `assets/${work.id}.png`;
  $('#detail-image').alt = `${work.title}，牛来形象演绎的名作戏仿`;
  ['title','en','era','original','artist','year','note','quote'].forEach(key => { $(`#detail-${key}`).textContent = work[key]; });
  $('#detail-position').textContent = `0${current + 1} / 03`;
  dialog.scrollTop = 0;
}
document.querySelectorAll('[data-work]').forEach(button => button.addEventListener('click', () => {
  updateWork(works.findIndex(work => work.id === button.dataset.work));
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
$('#previous').addEventListener('click', () => updateWork(current - 1));
$('#next').addEventListener('click', () => updateWork(current + 1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); updateWork(current - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); updateWork(current + 1); } });
