// 홈 "최근 연구 기록": archive-data.js에서 최신 STEP 3개를 그린다.
(() => {
  const data = window.ARCHIVE;
  const list = document.querySelector('[data-latest-updates]');
  if (!data || !list) return;

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const encodeURI = (p) => window.encodeURI(p.startsWith('/') || /^https?:/.test(p) ? p : '/' + p);
  const latest = [...data.research].sort((a, b) => b.step - a.step).slice(0, 3);

  list.innerHTML = latest.map((r, i) => `<li class="reveal${i ? ` delay-${i}` : ''}${i === 0 ? ' is-latest' : ''}">
    <a href="${encodeURI(r.file)}" target="_blank" rel="noreferrer">
      <figure><img src="${encodeURI(r.thumb)}" alt="${esc(r.alt)}" loading="lazy"><span>STEP ${pad(r.step)}</span>${i === 0 ? '<em>NEW</em>' : ''}</figure>
      <div class="hx-card-body">
        <strong>${esc(r.name || r.title)}</strong>
        <small>${esc(r.short || r.summary)}</small>
        <b>PDF 보기 ↗</b>
      </div>
    </a>
  </li>`).join('');

  const studyList = document.querySelector('[data-study-list]');
  if (studyList) {
    studyList.innerHTML = data.study.map((s, i) => `<li class="reveal${i % 3 ? ` delay-${i % 3}` : ''}">
      <a href="${encodeURI(s.file)}" target="_blank" rel="noreferrer">
        <figure${s.note ? ' class="is-note"' : ''}><img src="${encodeURI(s.thumb)}" alt="${esc(s.alt)}" loading="lazy"></figure>
        <span>${esc(s.label)}</span>
        <strong>${esc(s.title)}</strong>
      </a>
    </li>`).join('');
  }
})();
