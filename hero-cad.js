// 홈 히어로 배경: 자연어 요청 → 동체 → 날개(단면·로프트) → 엔진·꼬리 → 형상 완성으로 NASA CRM 기체를 만드는 과정을 반복 재생한다.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js';

const stage = document.querySelector('.hero-stage');
const canvas = stage?.querySelector('.hero-cad-canvas');
const promptEl = stage?.querySelector('[data-cad-prompt]');
const stepEls = stage ? [...stage.querySelectorAll('[data-cad-step]')] : [];
const PROMPT = promptEl?.dataset.cadPrompt || '';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MODEL_SIZE = 10.5; // 동체 길이 기준 기체 최대 치수 (62.8 m ÷ 6)
const CYCLE = 16;
const T = {
  prompt: [0, 2.4],
  fuselage: [2.4, 4.4],
  airfoil: [4.2, 5.4],
  wing: [5.2, 7.4],
  nacelle: [7.2, 8.4],
  tails: [8.2, 9.6],
  solid: [9.6, 11],
  fadeOut: [15, 16]
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => v * v * (3 - 2 * v);
const phase = (t, [a, b]) => ease(clamp01((t - a) / (b - a)));

// ---------- 형상 정의 (NASA CRM 치수, 단위 m → 장면에서 1/6 축소) ----------
const FOIL_N = 34;
const FOIL_PTS = FOIL_N * 2;
// NACA 4자리 계열 단면: 두께비 t, 캠버 m. 뒷전 → 윗면 → 앞전 → 아랫면 순서의 닫힌 단면 (코사인 간격)
function foil(t, m = 0) {
  const p = 0.6;
  const yt = (x) => 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x ** 2 + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const yc = (x) => (x < p ? (m / p ** 2) * (2 * p * x - x * x) : (m / (1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x * x));
  const xs = (i) => (1 - Math.cos((Math.PI * i) / FOIL_N)) / 2;
  const pts = [];
  for (let i = FOIL_N; i >= 0; i--) pts.push([xs(i), yc(xs(i)) + yt(xs(i))]);
  for (let i = 1; i < FOIL_N; i++) pts.push([xs(i), yc(xs(i)) - yt(xs(i))]);
  return pts;
}

// 양력면: 제어 단면 [{le:[x,y,z], c(시위), t(두께비)}] 사이를 sub 칸씩 보간해 단면을 쌓는다.
function surface(ctrl, sub, thickDir, camber = 0) {
  const sections = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const a = ctrl[i], b = ctrl[i + 1];
    for (let k = i ? 1 : 0; k <= sub; k++) {
      const s = k / sub;
      const le = new THREE.Vector3(...a.le).lerp(new THREE.Vector3(...b.le), s);
      const c = a.c + (b.c - a.c) * s;
      const t = a.t + (b.t - a.t) * s;
      sections.push(foil(t, camber).map(([px, py]) => le.clone().add(new THREE.Vector3(px * c, 0, 0)).addScaledVector(thickDir, py * c)));
    }
  }
  return sections;
}

// x축을 따라 늘어선 원·타원 단면: profile(u) → {r, y, z, ry}
function body(x0, x1, stations, ring, profile) {
  const sections = [];
  for (let k = 0; k <= stations; k++) {
    const u = k / stations;
    const { r, y = 0, z = 0, ry = 1 } = profile(u);
    const x = x0 + (x1 - x0) * u;
    const pts = [];
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2;
      pts.push(new THREE.Vector3(x, y + Math.cos(a) * r * ry, z + Math.sin(a) * r));
    }
    sections.push(pts);
  }
  return sections;
}

// 동체: 길이 62.8 m, 둥근 기수 → 원통 → 위로 올라가며 좁아지는 꼬리
const FUSE_L = 62.8, FUSE_R = 3.05;
const fuselageSections = () => body(0, FUSE_L, 40, 36, (u) => {
  const x = u * FUSE_L;
  if (x < 11) { const v = 1 - x / 11; return { r: FUSE_R * Math.sqrt(1 - v * v), y: -0.5 * v * v }; }
  if (x < 41) return { r: FUSE_R };
  const v = ease((x - 41) / (FUSE_L - 41));
  return { r: FUSE_R * (1 - 0.82 * v), y: 1.9 * v };
});
// 날개-동체 페어링
const fairingSections = () => body(17, 43, 16, 28, (u) => ({ r: 3.3 * Math.sin(Math.PI * u) ** 0.55, y: -2.2, ry: 0.42 }));

// 주날개: 앞전 후퇴각 35°, 꺾임(Yehudi) 10.9 m, 반스팬 29.4 m, 상반각 5°
const TAN35 = Math.tan((35 * Math.PI) / 180), DIH = Math.tan((5 * Math.PI) / 180);
const wingCtrl = (side) => [[2.6, 12.1, 0.15], [10.9, 7.3, 0.12], [29.4, 2.7, 0.1]]
  .map(([z, c, t]) => ({ le: [23 + z * TAN35, -1.9 + (z - 2.6) * DIH, side * z], c, t }));
// 엔진 나셀(반스팬 9.6 m) + 파일런
const nacelleSections = (side) => body(24, 31.5, 12, 32, (u) => ({
  r: u < 0.25 ? 1.55 + 0.15 * Math.sin(((u / 0.25) * Math.PI) / 2) : 1.7 - 0.55 * ease((u - 0.25) / 0.75),
  y: -3.95, z: side * 9.6
}));
const pylonCtrl = (side) => [{ le: [25.6, -2.5, side * 9.6], c: 5.6, t: 0.14 }, { le: [27.4, -1.45, side * 9.6], c: 5.4, t: 0.14 }];
// 수평꼬리: 후퇴각 37°, 반스팬 10.7 m / 수직꼬리: 후퇴각 42°, 높이 9.5 m
const htailCtrl = (side) => [{ le: [53.5, 0.9, side * 1.5], c: 5.9, t: 0.1 }, { le: [60.4, 1.85, side * 10.7], c: 1.8, t: 0.09 }];
const vtailCtrl = [{ le: [50, 2.3, 0], c: 8.6, t: 0.11 }, { le: [58.6, 11.8, 0], c: 3.2, t: 0.1 }];

// 단면 목록 → 인덱스가 단면 순서로 정렬된 표면 (drawRange로 "자라나는" 효과)
function loftGeometry(sections) {
  const M = sections[0].length;
  const positions = [];
  sections.flat().forEach((p) => positions.push(p.x, p.y, p.z));
  const index = [];
  for (let j = 0; j < sections.length - 1; j++) {
    for (let i = 0; i < M; i++) {
      const a = j * M + i, b = j * M + ((i + 1) % M);
      const c = a + M, d = b + M;
      index.push(a, c, b, b, c, d);
    }
  }
  // 끝단 캡
  const tip = sections[sections.length - 1];
  const center = tip.reduce((acc, p) => acc.add(p), new THREE.Vector3()).divideScalar(M);
  const ci = positions.length / 3;
  positions.push(center.x, center.y, center.z);
  const base = (sections.length - 1) * M;
  for (let i = 0; i < M; i++) index.push(base + i, base + ((i + 1) % M), ci);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  geo.userData.bodyCount = (sections.length - 1) * M * 6;
  return geo;
}

function outline(points, material) {
  const geo = new THREE.BufferGeometry().setFromPoints([...points, points[0]]);
  return new THREE.Line(geo, material);
}

// ---------- 장면 ----------
function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    stage.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8e959e, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(6, 10, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xeef0f3, 1.1);
  rim.position.set(-8, 3, -6);
  scene.add(rim);

  const aircraft = new THREE.Group();
  aircraft.scale.setScalar(1 / 6);
  scene.add(aircraft);

  const grid = new THREE.GridHelper(44, 44, 0xd2d5da, 0xe6e8eb);
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  grid.position.y = -2.3;
  scene.add(grid);

  const solidMat = () => new THREE.MeshStandardMaterial({
    color: 0xc4c8ce, roughness: 0.72, metalness: 0.05,
    transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: true
  });
  const wireMat = () => new THREE.LineBasicMaterial({ color: 0x0e4a84, transparent: true, opacity: 0 });

  // 부품: 표면 1개 + 단면 선 묶음 1개 + 길이 방향 선 묶음 1개 (그리기 호출을 줄여 가볍게)
  const parts = [];
  const segPairs = (pts, closed) => {
    const out = [];
    const n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) out.push(pts[i], pts[(i + 1) % pts.length]);
    return out;
  };
  function addPart(sections, grow, { lineEvery = 1, stringers = [], wing = false } = {}) {
    const mesh = new THREE.Mesh(loftGeometry(sections), solidMat());
    mesh.geometry.setDrawRange(0, 0);
    aircraft.add(mesh);
    // 단면 선: 순서대로 이어 붙이고, 각 단면이 끝나는 꼭짓점 수를 기록 → drawRange로 차례로 드러냄
    const secPts = [], marks = [];
    sections.forEach((pts, k) => {
      if (k % lineEvery && k !== sections.length - 1) return;
      secPts.push(...segPairs(pts, true));
      marks.push({ at: k / (sections.length - 1), count: secPts.length });
    });
    const secLines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(secPts), wireMat());
    secLines.geometry.setDrawRange(0, 0);
    aircraft.add(secLines);
    let strLines = null;
    if (stringers.length) {
      const strPts = stringers.flatMap((i) => segPairs(sections.map((sec) => sec[i]), false));
      strLines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(strPts), wireMat());
      aircraft.add(strLines);
    }
    const part = { sections, mesh, secLines, marks, strLines, grow, wing };
    parts.push(part);
    return part;
  }

  const TE = 0, LE = FOIL_N; // 단면 인덱스 0 = 뒷전, FOIL_N = 앞전
  const UP = new THREE.Vector3(0, 1, 0), SIDE = new THREE.Vector3(0, 0, 1);
  addPart(fuselageSections(), T.fuselage, { lineEvery: 2, stringers: [0, 9, 18, 27] });
  addPart(fairingSections(), T.fuselage, { lineEvery: 4 });
  const wingR = addPart(surface(wingCtrl(1), 6, UP, 0.02), T.wing, { stringers: [LE, TE], wing: true });
  addPart(surface(wingCtrl(-1), 6, UP, 0.02), T.wing, { stringers: [LE, TE], wing: true });
  [1, -1].forEach((side) => {
    addPart(nacelleSections(side), T.nacelle, { lineEvery: 2, stringers: [0, 8, 16, 24] });
    addPart(surface(pylonCtrl(side), 2, SIDE), T.nacelle, { stringers: [LE] });
    addPart(surface(htailCtrl(side), 5, UP), T.tails, { stringers: [LE, TE] });
  });
  addPart(surface(vtailCtrl, 5, SIDE), T.tails, { stringers: [LE, TE] });

  // 날개 단계에서 먼저 강조해 그리는 날개 뿌리 단면
  const rootFoil = outline(wingR.sections[0], new THREE.LineBasicMaterial({ color: 0x0e4a84, transparent: true, opacity: 0 }));
  rootFoil.geometry.setDrawRange(0, 0);
  aircraft.add(rootFoil);

  // 기체 중심을 원점으로
  const box = new THREE.Box3().setFromObject(aircraft);
  const center = box.getCenter(new THREE.Vector3());
  aircraft.position.sub(center);

  // ---------- 화면 크기 ----------
  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // 넓은 화면: 오른쪽 빈 곳 / 좁은 화면: 가운데 (앞의 흰 그라데이션이 글을 받쳐 준다)
    const wide = w > 900;
    const cx = wide ? w * 0.72 : w / 2, cy = h * (wide ? 0.46 : 0.58);
    const targetPx = wide ? THREE.MathUtils.clamp(Math.min(w * 0.42, h * 1.25), 340, 640) : Math.min(w * 0.95, 460);
    const viewWidthPerDist = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    camera.userData.dist = THREE.MathUtils.clamp((MODEL_SIZE * w) / (targetPx * viewWidthPerDist), 9, 40);
    camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  // 웹폰트 로딩·등장 애니메이션 뒤에 글자 위치가 바뀌므로 한 번 더 맞춘다.
  document.fonts?.ready.then(resize);
  setTimeout(resize, 900);
  resize();

  // ---------- 상태 갱신 ----------
  function setPrompt(t) {
    if (!promptEl) return;
    const n = Math.round(PROMPT.length * phase(t, T.prompt));
    if (n !== setPrompt.n) { promptEl.textContent = PROMPT.slice(0, n); setPrompt.n = n; }
    const typing = t < T.prompt[1] + 0.4;
    if (typing !== setPrompt.typing) { promptEl.classList.toggle('is-typing', typing); setPrompt.typing = typing; }
  }
  function setStep(t) {
    const edges = [T.prompt[0], T.fuselage[0], T.airfoil[0], T.nacelle[0], T.solid[0]];
    let active = 0;
    edges.forEach((e, i) => { if (t >= e) active = i; });
    if (active === setStep.active) return;
    setStep.active = active;
    stepEls.forEach((el, i) => {
      el.classList.toggle('is-active', i === active);
      el.classList.toggle('is-done', i < active);
    });
  }

  function update(t) {
    const fade = 1 - phase(t, T.fadeOut);
    const airfoil = phase(t, T.airfoil);
    const solid = phase(t, T.solid);

    rootFoil.geometry.setDrawRange(0, Math.ceil((FOIL_PTS + 1) * clamp01(airfoil * 1.6)));
    rootFoil.material.opacity = clamp01(airfoil * 4) * (1 - phase(t, T.wing)) * fade;
    rootFoil.visible = rootFoil.material.opacity > 0.002;

    parts.forEach((part) => {
      const grow = phase(t, part.grow);
      // 날개 단면은 airfoil 단계에서 먼저 배치되고, 나머지 부품은 성장하면서 단면이 나타난다.
      const sectionReveal = part.wing ? clamp01((airfoil - 0.35) / 0.65) : grow;
      const wire = 0.55 * (1 - solid) * fade;
      let shownCount = 0;
      for (const m of part.marks) { if (sectionReveal >= m.at - 1e-6) shownCount = m.count; else break; }
      part.secLines.geometry.setDrawRange(0, shownCount);
      part.secLines.material.opacity = wire;
      part.secLines.visible = wire > 0.002 && shownCount > 0; // 투명해진 선이 깊이값으로 표면을 가리지 않게
      if (part.strLines) {
        part.strLines.material.opacity = wire * grow;
        part.strLines.visible = part.strLines.material.opacity > 0.002;
      }
      const count = part.mesh.geometry.userData.bodyCount;
      const indexCount = part.mesh.geometry.index.count;
      part.mesh.geometry.setDrawRange(0, grow >= 1 ? indexCount : Math.floor((count * grow) / 6) * 6);
      part.mesh.material.opacity = (0.22 + 0.78 * solid) * (grow > 0 ? 1 : 0) * fade;
      part.mesh.material.depthWrite = solid > 0.5;
    });
    grid.material.opacity = 0.5 * (0.6 + 0.4 * fade);
    setPrompt(t);
    setStep(t);
  }

  function placeCamera(elapsed) {
    const a = -0.95 + elapsed * 0.11;
    const d = camera.userData.dist;
    camera.position.set(Math.cos(a) * d, d * 0.38, Math.sin(a) * d);
    camera.lookAt(0, -0.35, 0);
  }

  if (reducedMotion) {
    update(T.fadeOut[0] - 0.01);
    if (promptEl) promptEl.textContent = PROMPT;
    placeCamera(3.5);
    renderer.render(scene, camera);
    new ResizeObserver(() => renderer.render(scene, camera)).observe(stage);
    return;
  }

  // 화면 밖이거나 탭이 숨겨지면 멈춘다.
  let visible = true, running = false, last = 0, elapsed = 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(stage);
  document.addEventListener('visibilitychange', kick);

  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    if (now - last < 32) { requestAnimationFrame(frame); return; } // 약 30fps로 제한
    const dt = Math.min(0.25, (now - last) / 1000 || 0);
    last = now;
    elapsed += dt;
    update(elapsed % CYCLE);
    placeCamera(elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function kick() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  stage.classList.add('is-ready');
  kick();
}

if (stage && canvas) init();
