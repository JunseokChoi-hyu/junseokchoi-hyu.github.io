// 아카이브 페이지: archive-data.js 목록으로 Research(Phase별 카드) / Study(카드) 탭을 그리고, 검색·PDF 미리보기를 붙인다.
(() => {
  const data = window.ARCHIVE;
  if (!data) return;

  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = (p) => encodeURI(p);
  const pad = (n) => String(n).padStart(2, '0');
  const latestStep = Math.max(...data.research.map((r) => r.step));
  const phases = data.phases || [{ label: 'RESEARCH', title: 'Text2CAD', from: 1, to: 9999 }];

  const items = [
    ...data.research.map((r) => ({ ...r, kind: 'research', label: `STEP ${pad(r.step)}` })),
    ...data.study.map((s) => ({ ...s, kind: 'study' }))
  ];
  items.forEach((it) => {
    it.search = [it.title, it.summary, it.label, it.tags.join(' '), it.file].join(' ').replace(/⁠/g, '').toLowerCase();
  });

  // ---------- 통계 ----------
  $('[data-stat="research"]').textContent = pad(data.research.length);
  $('[data-stat="study"]').textContent = pad(data.study.length);
  $('[data-stat="files"]').textContent = pad(items.length);

  // 상단 오른쪽: 최신 연구 자료 3장을 겹쳐 놓은 그림
  const stack = $('[data-hero-stack]');
  if (stack) {
    stack.innerHTML = [...data.research].sort((x, y) => y.step - x.step).slice(0, 3)
      .map((r, i) => `<figure class="s${i}"><img src="${url(r.thumb)}" alt="" loading="eager"><figcaption>STEP ${pad(r.step)}</figcaption></figure>`).join('');
  }

  // ---------- 카드 ----------
  const isLatest = (it) => it.kind === 'research' && it.step === latestStep;
  // 카드 전체를 누르면 미리보기, 오른쪽 위 작은 링크로 PDF 새 탭
  const card = (it) => `<li class="ax-card${isLatest(it) ? ' is-latest' : ''}">
      <button class="ax-thumb${it.note ? ' is-note' : ''}" type="button" data-preview="${esc(it.file)}" data-title="${esc(it.title)}" aria-label="${esc(it.title)} 미리보기">
        <img src="${url(it.thumb)}" alt="${esc(it.alt)}" loading="lazy">
        <span class="ax-badge">${esc(it.label)}</span>${isLatest(it) ? '<em>LATEST</em>' : ''}
      </button>
      <button class="ax-body" type="button" data-preview="${esc(it.file)}" data-title="${esc(it.title)}">
        <strong>${esc(it.name || it.title)}</strong>
        <span>${esc(it.short || it.summary)}</span>
      </button>
      <a class="ax-pdf" href="${url(it.file)}" target="_blank" rel="noreferrer" aria-label="${esc(it.title)} PDF 새 탭에서 열기">PDF ↗</a>
    </li>`;

  // ---------- 상태 ----------
  const state = { kind: location.hash === '#study-materials' ? 'study' : 'research', q: '', newestFirst: true };
  const matchesText = (it) => !state.q || state.q.split(/\s+/).every((w) => it.search.includes(w));
  const panels = { research: $('#research-materials'), study: $('#study-materials') };
  const emptyEl = $('[data-empty]');

  function render() {
    const research = items.filter((it) => it.kind === 'research' && matchesText(it));
    const study = items.filter((it) => it.kind === 'study' && matchesText(it));

    // Research: Phase 묶음마다 카드 그리드
    const order = state.newestFirst ? [...phases].reverse() : phases;
    $('#research-phases').innerHTML = order.map((ph) => {
      const list = research.filter((r) => r.step >= ph.from && r.step <= ph.to)
        .sort((a, b) => (state.newestFirst ? b.step - a.step : a.step - b.step));
      if (!list.length) return '';
      const all = data.research.filter((r) => r.step >= ph.from && r.step <= ph.to).map((r) => r.step);
      const current = all.includes(latestStep);
      return `<section class="ax-phase${current ? ' is-current' : ''}">
        <header><span>${ph.label}</span><h3>${esc(ph.title)}</h3><small>STEP ${pad(Math.min(...all))}–${pad(Math.max(...all))}</small>${current ? '<em>진행 중</em>' : ''}</header>
        <ul class="ax-grid">${list.map(card).join('')}</ul>
      </section>`;
    }).join('');
    $('#study-list').innerHTML = study.map(card).join('');

    const shown = state.kind === 'research' ? research : study;
    Object.entries(panels).forEach(([kind, el]) => { el.hidden = kind !== state.kind || shown.length === 0; });
    emptyEl.hidden = shown.length > 0;

    document.querySelectorAll('[data-kind]').forEach((b) => {
      b.setAttribute('aria-selected', String(b.dataset.kind === state.kind));
      b.querySelector('small').textContent = b.dataset.kind === 'research' ? research.length : study.length;
    });
    $('[data-sort]').textContent = state.newestFirst ? '최신 단계부터' : '1단계부터';
  }

  document.addEventListener('click', (e) => {
    const kindBtn = e.target.closest('[data-kind]');
    if (kindBtn) {
      state.kind = kindBtn.dataset.kind;
      history.replaceState(null, '', state.kind === 'study' ? '#study-materials' : '#research-materials');
      render();
      return;
    }
    if (e.target.closest('[data-sort]')) { state.newestFirst = !state.newestFirst; render(); return; }
    if (e.target.closest('[data-reset]')) {
      state.q = '';
      $('#archive-search').value = '';
      render();
    }
  });
  $('#archive-search').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
  window.addEventListener('hashchange', () => {
    const kind = location.hash === '#study-materials' ? 'study' : location.hash === '#research-materials' ? 'research' : null;
    if (kind && kind !== state.kind) { state.kind = kind; render(); }
  });

  // ---------- PDF 미리보기 ----------
  const dialog = $('#pdf-viewer');
  const frame = $('#pdf-frame');
  const canInlinePdf = navigator.pdfViewerEnabled !== false && !window.matchMedia('(max-width: 760px)').matches;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-preview]');
    if (!trigger) return;
    const file = url(trigger.dataset.preview);
    if (!canInlinePdf || typeof dialog.showModal !== 'function') { window.open(file, '_blank', 'noopener'); return; }
    $('#pdf-title').textContent = trigger.dataset.title.replace(/⁠/g, '');
    $('#pdf-open').href = file;
    frame.src = `${file}#view=FitH`;
    dialog.showModal();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => { frame.src = 'about:blank'; });

  render();
  if (location.hash) $('.archive-toolbar')?.scrollIntoView();
})();
