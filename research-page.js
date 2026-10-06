// Research 페이지: archive-data.js의 연구 목록을 단계(Phase)별로 묶어 "연구 진행 과정"을 그린다.
(() => {
  const data = window.ARCHIVE;
  const root = document.querySelector('[data-journey]');
  if (!data || !root) return;

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const steps = [...data.research].sort((a, b) => a.step - b.step);
  const latest = steps[steps.length - 1];

  // 단계 구분. 새 STEP은 마지막 Phase에 자동으로 붙는다.
  const phases = (data.phases || []).map((ph) => ({ ...ph, items: steps.filter((s) => s.step >= ph.from && s.step <= ph.to) }))
   .filter((ph) => ph.items.length);
  const phaseOf = (step) => phases.findIndex((ph) => step >= ph.from && step <= ph.to);
  const wj = (t) => t.replace(/⁠/g, '');

  // 위: STEP 1~N 타임라인 (번호 동그라미 + 아래 Phase 이름)
  const track = `<div class="rx-track reveal" style="--n:${steps.length}" role="img" aria-label="STEP 1부터 ${latest.step}까지 진행, 현재 ${esc(phases[phases.length - 1].title)} 단계">
    ${steps.map((s, k) => `<a class="rx-dot p${phaseOf(s.step) + 1}${s === latest ? ' is-latest' : ''}" style="grid-column:${k + 1}" href="${encodeURI(s.file)}" target="_blank" rel="noreferrer" title="STEP ${pad(s.step)} · ${esc(wj(s.title))}">${pad(s.step)}</a>`).join('')}
    ${phases.map((ph, k) => {
      const start = steps.indexOf(ph.items[0]) + 1;
      return `<div class="rx-phase-tag p${k + 1}" style="grid-column:${start} / span ${ph.items.length}"><i>${ph.label}</i><b>${esc(ph.title)}</b></div>`;
    }).join('')}
  </div>`;

  // 아래: Phase 카드 (대표 그림 + 제목 + 한 줄 요약 + STEP 번호)
  const cards = phases.map((ph, k) => {
    const isCurrent = ph.items.includes(latest);
    return `<article class="rx-phase p${k + 1}${isCurrent ? ' is-current' : ''} reveal${k ? ` delay-${k}` : ''}">
      <figure><img src="${ph.img}" alt="${esc(ph.imgAlt)}" loading="lazy">${isCurrent ? '<em>진행 중</em>' : ''}</figure>
      <div class="rx-phase-body">
        <p class="rx-phase-label">${ph.label}</p>
        <h3>${esc(ph.title)}</h3>
        <p class="rx-phase-summary">${esc(ph.summary)}</p>
        <div class="rx-phase-steps">${ph.items.map((s) => `<a href="${encodeURI(s.file)}" target="_blank" rel="noreferrer" title="${esc(wj(s.title))}"${s === latest ? ' class="is-latest"' : ''}>STEP ${pad(s.step)}</a>`).join('')}</div>
      </div>
    </article>`;
  }).join('');

  root.innerHTML = track + `<div class="rx-phases">${cards}</div>`;

  const stepEl = document.querySelector('[data-latest-step]');
  if (stepEl && latest) stepEl.textContent = `STEP ${pad(latest.step)}`;
})();

// 실행 영상: 작은 쪽을 누르면 자리는 그대로 두고 두 칸의 폭을 바꾼 뒤 재생한다.
(() => {
  const grid = document.querySelector('.rx-demo-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.rx-video')];
  cards.forEach((card) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rx-video-swap';
    btn.innerHTML = '<span>▶ 크게 보기</span>';
    btn.setAttribute('aria-label', `${card.querySelector('strong')?.textContent || '영상'} 크게 보기`);
    btn.addEventListener('click', () => promote(card));
    card.appendChild(btn);
  });

  // 폭을 애니메이션하면 영상이 버벅이므로, 잠깐 흐려졌다가 바뀐 배치로 다시 나타나게 한다.
  function promote(card) {
    if (card.classList.contains('rx-video-main')) return;
    const swap = () => {
      cards.forEach((c) => {
        const isMain = c === card;
        c.classList.toggle('rx-video-main', isMain);
        if (!isMain) c.querySelector('video')?.pause();
      });
      grid.classList.toggle('is-swapped', cards.indexOf(card) !== 0);
      card.querySelector('video')?.play().catch(() => {});
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { swap(); return; }
    grid.classList.add('is-fading');
    setTimeout(() => {
      swap();
      requestAnimationFrame(() => grid.classList.remove('is-fading'));
    }, 180);
  }
})();
