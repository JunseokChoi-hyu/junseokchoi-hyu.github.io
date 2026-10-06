// 홈 히어로 배경: 자연어 요청 → NACA 0012 단면 → 로프트 → 기체 조립 → 형상 완성 과정을 반복 재생한다.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js';

const stage = document.querySelector('.hero-stage');
const canvas = stage?.querySelector('.hero-cad-canvas');
const promptEl = stage?.querySelector('[data-cad-prompt]');
const stepEls = stage ? [...stage.querySelectorAll('[data-cad-step]')] : [];
const PROMPT = promptEl?.dataset.cadPrompt || '';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MODEL_SIZE = 10.6; // 날개 전폭 기준 기체 최대 치수
const CYCLE = 16;
const T = {
  prompt: [0, 2.6],
  airfoil: [2.6, 4.6],
  loft: [4.6, 7.2],
  fuselage: [7.2, 8.8],
  tails: [8.6, 9.9],
  solid: [9.9, 11.2],
  fadeOut: [15, 16]
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => v * v * (3 - 2 * v);
const phase = (t, [a, b]) => ease(clamp01((t - a) / (b - a)));

// ---------- 형상 정의 ----------
const FOIL_N = 34;
function nacaThickness(x, t = 0.12) {
  return 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x ** 2 + 0.2843 * x ** 3 - 0.1036 * x ** 4);
}
// 뒷전 → 윗면 → 앞전 → 아랫면 순서의 닫힌 단면 (코사인 간격)
const NACA0012 = (() => {
  const pts = [];
  for (let i = FOIL_N; i >= 0; i--) {
    const x = (1 - Math.cos((Math.PI * i) / FOIL_N)) / 2;
    pts.push([x, nacaThickness(x)]);
  }
  for (let i = 1; i < FOIL_N; i++) {
    const x = (1 - Math.cos((Math.PI * i) / FOIL_N)) / 2;
    pts.push([x, -nacaThickness(x)]);
  }
  return pts;
})();

// 양력면 단면: span 위치마다 원점(앞전), 시위 방향, 두께 방향을 주고 NACA 0012를 배치한다.
function liftingSections({ stations, rootLE, spanDir, chordRoot, chordTip, sweep, rise, thickDir }) {
  const sections = [];
  for (let k = 0; k <= stations; k++) {
    const s = k / stations;
    const chord = chordRoot + (chordTip - chordRoot) * s;
    const origin = rootLE.clone()
      .addScaledVector(spanDir, s)
      .add(new THREE.Vector3(sweep * s, rise * s, 0));
    sections.push(NACA0012.map(([px, py]) => origin.clone()
      .add(new THREE.Vector3(px * chord, 0, 0))
      .addScaledVector(thickDir, py * chord)));
  }
  return sections;
}

function fuselageSections() {
  const L = 8.2, R = 0.56, stations = 30, ring = 32;
  const sections = [];
  for (let k = 0; k <= stations; k++) {
    const u = k / stations;
    let r;
    if (u < 0.24) r = R * Math.sqrt(1 - (1 - u / 0.24) ** 2);
    else if (u < 0.58) r = R;
    else r = R * (1 - 0.72 * ease((u - 0.58) / 0.42));
    const yc = u > 0.55 ? 0.32 * ease((u - 0.55) / 0.45) : 0;
    const pts = [];
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2;
      pts.push(new THREE.Vector3(u * L, yc + Math.cos(a) * r * 0.96, Math.sin(a) * r));
    }
    sections.push(pts);
  }
  return sections;
}

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8e9daa, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(6, 10, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfeef5, 1.1);
  rim.position.set(-8, 3, -6);
  scene.add(rim);

  const aircraft = new THREE.Group();
  scene.add(aircraft);

  const grid = new THREE.GridHelper(44, 44, 0xc9ced6, 0xe1e4e9);
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  grid.position.y = -2.3;
  scene.add(grid);

  const solidMat = () => new THREE.MeshStandardMaterial({
    color: 0xbfc8d1, roughness: 0.78, metalness: 0.04,
    transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: true
  });
  const wireMat = () => new THREE.LineBasicMaterial({ color: 0x0e4a84, transparent: true, opacity: 0 });

  // 부품: { sections, mesh, lines[], window(성장 구간) }
  const parts = [];
  function addPart(sections, grow, { lineEvery = 1, stringers = [] } = {}) {
    const mesh = new THREE.Mesh(loftGeometry(sections), solidMat());
    mesh.geometry.setDrawRange(0, 0);
    aircraft.add(mesh);
    const lines = [];
    sections.forEach((pts, k) => {
      if (k % lineEvery && k !== sections.length - 1) return;
      const line = outline(pts, wireMat());
      line.userData.at = k / (sections.length - 1);
      aircraft.add(line);
      lines.push(line);
    });
    stringers.forEach((i) => {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(sections.map((s) => s[i])), wireMat());
      line.userData.at = 1;
      line.userData.stringer = true;
      aircraft.add(line);
      lines.push(line);
    });
    const part = { sections, mesh, lines, grow };
    parts.push(part);
    return part;
  }

  const TE = 0, LE = FOIL_N; // 단면 인덱스 0 = 뒷전, FOIL_N = 앞전
  const wingCommon = { stations: 10, chordRoot: 1.75, chordTip: 0.72, sweep: 0.95, thickDir: new THREE.Vector3(0, 1, 0) };
  const dihedral = Math.tan((4 * Math.PI) / 180) * 5.3;
  const wingR = addPart(liftingSections({ ...wingCommon, rootLE: new THREE.Vector3(2.55, -0.18, 0), spanDir: new THREE.Vector3(0, 0, 5.3), rise: dihedral }), T.loft, { stringers: [LE, TE] });
  const wingL = addPart(liftingSections({ ...wingCommon, rootLE: new THREE.Vector3(2.55, -0.18, 0), spanDir: new THREE.Vector3(0, 0, -5.3), rise: dihedral }), T.loft, { stringers: [LE, TE] });
  addPart(fuselageSections(), T.fuselage, { lineEvery: 2, stringers: [0, 8, 16, 24] });
  const tailCommon = { stations: 6, chordRoot: 0.95, chordTip: 0.5, sweep: 0.38, thickDir: new THREE.Vector3(0, 1, 0), rise: 0 };
  addPart(liftingSections({ ...tailCommon, rootLE: new THREE.Vector3(6.85, 0.3, 0), spanDir: new THREE.Vector3(0, 0, 1.95) }), T.tails, { stringers: [LE, TE] });
  addPart(liftingSections({ ...tailCommon, rootLE: new THREE.Vector3(6.85, 0.3, 0), spanDir: new THREE.Vector3(0, 0, -1.95) }), T.tails, { stringers: [LE, TE] });
  addPart(liftingSections({ stations: 6, chordRoot: 1.3, chordTip: 0.58, sweep: 0.8, rise: 0, thickDir: new THREE.Vector3(0, 0, 1), rootLE: new THREE.Vector3(6.45, 0.45, 0), spanDir: new THREE.Vector3(0, 1.55, 0) }), T.tails, { stringers: [LE, TE] });

  // 첫 단계에서 강조해 그리는 날개 뿌리 단면
  const rootFoil = outline(wingR.sections[0], new THREE.LineBasicMaterial({ color: 0x1fb9c7, transparent: true, opacity: 0 }));
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
    const nameEl = stage.querySelector('.hero h1');
    const cardEl = stage.querySelector('.profile-card');
    const cardRect = cardEl?.getBoundingClientRect();
    if (w > 980 && nameEl && cardRect) {
      // 넓은 화면: 이름 글자 끝과 프로필 카드 사이 빈 곳에, 그 간격에 맞는 크기로 기체를 둔다.
      const range = document.createRange();
      range.selectNodeContents(nameEl);
      const nameRect = range.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const cx = (nameRect.right + cardRect.left) / 2 - stageRect.left;
      const cy = nameRect.top + nameRect.height / 2 - stageRect.top;
      const targetPx = THREE.MathUtils.clamp((cardRect.left - nameRect.right) * 1.35, 360, 560);
      const viewWidthPerDist = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      camera.userData.dist = THREE.MathUtils.clamp((MODEL_SIZE * w) / (targetPx * viewWidthPerDist), 10, 40);
      camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    } else {
      // 좁은 화면: 가운데 정렬, 가로가 좁을수록 멀리서 잡아 기체가 잘리지 않게 한다.
      camera.userData.dist = THREE.MathUtils.clamp(14.5 / Math.min(1, camera.aspect / 1.6), 14.5, 28);
      camera.clearViewOffset();
    }
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
    promptEl.textContent = PROMPT.slice(0, n);
    promptEl.classList.toggle('is-typing', t < T.prompt[1] + 0.4);
  }
  function setStep(t) {
    const edges = [T.prompt[0], T.airfoil[0], T.loft[0], T.fuselage[0], T.solid[0]];
    let active = 0;
    edges.forEach((e, i) => { if (t >= e) active = i; });
    stepEls.forEach((el, i) => {
      el.classList.toggle('is-active', i === active);
      el.classList.toggle('is-done', i < active);
    });
  }

  function update(t) {
    const fade = 1 - phase(t, T.fadeOut);
    const airfoil = phase(t, T.airfoil);
    const solid = phase(t, T.solid);

    rootFoil.geometry.setDrawRange(0, Math.ceil((NACA0012.length + 1) * clamp01(airfoil * 1.6)));
    rootFoil.material.opacity = clamp01(airfoil * 4) * (1 - solid) * fade;

    parts.forEach((part) => {
      const isWing = part === wingR || part === wingL;
      const grow = phase(t, part.grow);
      // 날개 단면은 airfoil 단계에서 먼저 배치되고, 나머지 부품은 성장하면서 단면이 나타난다.
      const sectionReveal = isWing ? clamp01((airfoil - 0.35) / 0.65) : grow;
      part.lines.forEach((line) => {
        const shown = line.userData.stringer ? grow : sectionReveal >= line.userData.at - 1e-6 ? 1 : 0;
        line.material.opacity = 0.55 * shown * (1 - solid * 0.92) * fade;
      });
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
