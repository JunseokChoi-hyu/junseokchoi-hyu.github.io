// Research 페이지: archive-data.js의 연구 목록을 단계(Phase)별로 묶어 "연구 진행 과정"을 그린다.
(() => {
  const data = window.ARCHIVE;
  const root = document.querySelector('[data-journey]');
  if (!data || !root) return;

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const encodeURI = (p) => window.encodeURI(p.startsWith('/') || /^https?:/.test(p) ? p : '/' + p);
  const steps = [...data.research].sort((a, b) => a.step - b.step);
  const latest = steps[steps.length - 1];

  // 단계 구분. 새 STEP은 마지막 Phase에 자동으로 붙는다.
  const phases = (data.phases || []).map((ph) => ({ ...ph, items: steps.filter((s) => s.step >= ph.from && s.step <= ph.to) }))
   .filter((ph) => ph.items.length);
  const wj = (t) => t.replace(/⁠/g, '');

  // 진행 막대: STEP 1~N을 한 줄 점으로, Phase마다 구간을 나눠 아래에 이름·요약
  root.innerHTML = `<div class="rv-bar">${phases.map((ph, k) => {
    const isCurrent = ph.items.includes(latest);
    return `<div class="rv-seg p${k + 1}${isCurrent ? ' is-current' : ''} reveal${k ? ` delay-${k}` : ''}" style="flex:${ph.items.length}">
      <div class="rv-dots">${ph.items.map((s) => `<a href="${encodeURI(s.file)}" target="_blank" rel="noreferrer" title="STEP ${pad(s.step)} · ${esc(wj(s.title))}"${s === latest ? ' class="is-latest"' : ''}><span>${pad(s.step)}</span></a>`).join('')}</div>
      <p>${ph.label}${isCurrent ? '<em>진행 중</em>' : ''}</p>
      <h3>${esc(ph.title)}</h3>
      <small>${esc(ph.summary)}</small>
    </div>`;
  }).join('')}</div>`;

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

// 시연 영상 탭: 한 화면에서 영상을 바꿔 본다.
(() => {
  const tabs = [...document.querySelectorAll('.rv-tabs [data-tab]')];
  const panes = [...document.querySelectorAll('.rv-player [data-pane]')];
  const caption = document.querySelector('[data-caption]');
  const captions = ['자연어 입력부터 항공기 형상이 만들어지기까지의 실행 과정', '초기 FreeCAD 기반 파이프라인으로 만든 베어링 지지대'];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const i = Number(tab.dataset.tab);
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    panes.forEach((v) => {
      const on = Number(v.dataset.pane) === i;
      v.hidden = !on;
      if (on) v.play().catch(() => {}); else v.pause();
    });
    if (caption) caption.textContent = captions[i];
  }));
})();

// 흐름도 되돌이 화살표: 05 카드 중심 → 사용자 요청 카드 중심 사이에 맞춘다.
(() => {
  const flow = document.querySelector('[data-flow]');
  if (!flow) return;
  const from = flow.querySelector('[data-loop-start]');
  const to = flow.querySelector('[data-loop-end]');
  const place = () => {
    const box = flow.getBoundingClientRect();
    const a = to.getBoundingClientRect(), b = from.getBoundingClientRect();
    flow.style.setProperty('--loop-l', `${a.left + a.width / 2 - box.left}px`);
    flow.style.setProperty('--loop-r', `${box.right - (b.left + b.width / 2)}px`);
  };
  new ResizeObserver(place).observe(flow);
  place();
})();
