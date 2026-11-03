// 홈 "최근 연구 기록": archive-data.js에서 최신 STEP 3개를 한 줄씩 그린다.
(() => {
  const data = window.ARCHIVE;
  const list = document.querySelector('[data-latest-updates]');
  if (!data || !list) return;

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const encodeURI = (p) => window.encodeURI(p.startsWith('/') || /^https?:/.test(p) ? p : '/' + p);
  const latest = [...data.research].sort((a, b) => b.step - a.step).slice(0, 3);

  // 한 줄씩: STEP 번호 · 제목 · 한 줄 요약 · PDF
  list.innerHTML = latest.map((r, i) => `<li class="reveal${i ? ` delay-${i}` : ''}">
    <a href="${encodeURI(r.file)}" target="_blank" rel="noreferrer">
      <b>STEP ${pad(r.step)}</b><strong>${esc(r.name || r.title)}</strong><small>${esc(r.short || r.summary)}</small><em>PDF ↗</em>
    </a>
  </li>`).join('');
  const progress = document.querySelector('[data-progress]');
  if (progress && latest[0]) progress.textContent = `STEP ${pad(latest[0].step)}`;

  const studyCount = document.querySelector('[data-study-count]');
  if (studyCount) studyCount.textContent = `${data.study.length}건`;

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

// 연구 영상: 화면에 보일 때만 재생해 페이지를 가볍게 한다.
(() => {
  const video = document.querySelector('[data-autoplay-visible]');
  if (!video || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.35 }).observe(video);
})();
