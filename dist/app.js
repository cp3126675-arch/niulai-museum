'use strict';
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
  document.querySelectorAll('.work').forEach(item => { item.hidden = button.dataset.filter === 'new' ? item.dataset.new !== 'true' : button.dataset.filter !== 'all' && item.dataset.era !== button.dataset.filter; if (!item.hidden) count++; });
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
  $('#detail-position').textContent = `${String(current + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`;
  const source = $('#detail-source');
  source.hidden = !work.source;
  if (work.source) source.href = work.source; else source.removeAttribute('href');
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
