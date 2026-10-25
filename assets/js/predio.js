/* Prédio da abertura: um edifício de 4 pavimentos em concreto armado que é construído conforme a rolagem.
   Etapas (progresso 0 → 1 da seção .story):
     0.00 projeto      só o traço verde, como no projeto
     0.10 fundação     sapatas e arranques nascem do terreno (corte do solo visível)
     0.30 estrutura    pilares, núcleo, vigas e lajes, pavimento por pavimento
     0.62 instalações  estrutura fica translúcida; água fria, esgoto e elétrica se desenham
     0.82 entrega      volta o concreto, entra a fachada de vidro e as luzes acendem
   Depende de three.js r128 (global THREE). */

(function () {
  'use strict';
  if (!window.THREE) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const seg = (p, a, b) => clamp01((p - a) / (b - a));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const back = t => { const c = 1.4; return t <= 0 ? 0 : 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const bump = (p, a, b, c, d) => seg(p, a, b) * (1 - seg(p, c, d));

  const story = document.querySelector('.story');
  const sticky = story && story.querySelector('.sticky');
  if (!sticky) return;

  const BOUNDS = [0, 0.1, 0.3, 0.62, 0.82, 1];
  window.HORST_BOUNDS = BOUNDS;

  // ---------- Cena ----------
  const mobile = window.matchMedia('(max-width: 860px)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Modelo 3D de um edifício em concreto armado sendo construído conforme a rolagem: fundação, estrutura, instalações elétricas e hidráulicas e entrega.');
  sticky.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
  const root = new THREE.Group();
  root.position.set(-6.75, 0, -5);
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xC9D6CF, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(-16, 30, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 90 });
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.ShadowMaterial({ opacity: 0.1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(6.75, 0, 5);
  ground.receiveShadow = true;
  root.add(ground);
  const grid = new THREE.GridHelper(90, 90, 0xC2D1CC, 0xDAE3E0);
  grid.position.set(6.75, 0.005, 5);
  root.add(grid);

  // corte do terreno, só na etapa de fundação
  const soilMat = new THREE.MeshStandardMaterial({ color: 0xA88763, roughness: 1, transparent: true, opacity: 0, depthWrite: false });
  const soil = new THREE.Mesh(new THREE.BoxGeometry(19, 2.2, 15), soilMat);
  soil.position.set(6.75, -1.1, 5);
  root.add(soil);
  const soilLines = new THREE.LineBasicMaterial({ color: 0x7A5C3E, transparent: true, opacity: 0 });
  const soilEdge = new THREE.LineSegments(new THREE.EdgesGeometry(soil.geometry), soilLines);
  soilEdge.position.copy(soil.position);
  root.add(soilEdge);
  // terreno acabado: cobre fundações e redes enterradas na entrega
  const gradeMat = new THREE.MeshStandardMaterial({ color: 0xDDE5E2, roughness: 1, transparent: true, opacity: 0, depthWrite: false });
  const grade = new THREE.Mesh(new THREE.BoxGeometry(19, 0.06, 15), gradeMat);
  grade.position.set(6.75, -0.04, 5);
  grade.receiveShadow = true;
  root.add(grade);

  // ---------- Estrutura ----------
  const xs = [0, 4.5, 9, 13.5], zs = [0, 5, 10], FL = 4, H = 3;
  const floorY = k => k * H + (k > 0 ? 0.12 : 0);
  const concrete = new THREE.MeshStandardMaterial({ color: 0xE6EAE8, roughness: 0.88, transparent: true });
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xD5DCD8, roughness: 0.9, transparent: true });
  const footMat = new THREE.MeshStandardMaterial({ color: 0x04B15B, roughness: 0.7 });
  const ghostMat = new THREE.LineBasicMaterial({ color: 0x04B15B, transparent: true, opacity: 0.5 });
  const xray = [concrete, coreMat];
  const els = [];

  function piece(w, h, d, x, y, z, kind, t0, t1, mat, axis) {
    const geo = new THREE.BoxGeometry(w, h, d);
    if (axis === 'y') geo.translate(0, h / 2, 0);
    const m = new THREE.Mesh(geo, mat || concrete);
    m.castShadow = m.receiveShadow = true;
    m.position.set(x, axis === 'y' ? y - h / 2 : y, z);
    root.add(m);
    const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(geo), ghostMat);
    ghost.position.copy(m.position);
    root.add(ghost);
    const e = { m, kind, t0, t1, axis, baseY: m.position.y };
    els.push(e);
    return e;
  }
  const slabMat = () => { const m = new THREE.MeshStandardMaterial({ color: 0xF7F9F8, roughness: 0.92, transparent: true, opacity: 0 }); xray.push(m); return m; };

  // fundação: sapatas e arranques
  xs.forEach((x, i) => zs.forEach((z, k) => {
    const o = (i * 3 + k) / 12;
    piece(1.4, 0.5, 1.4, x, -0.75, z, 'found', 0.1 + o * 0.12, 0.14 + o * 0.12, footMat, 'y');
    piece(0.25, 0.5, 0.35, x, -0.25, z, 'found', 0.2 + o * 0.08, 0.24 + o * 0.08, footMat, 'y');
  }));

  // estrutura: pilares, núcleo de escada e elevador, vigas, laje e sacada de cada pavimento
  for (let f = 0; f < FL; f++) {
    const a = 0.3 + f * 0.08;
    xs.forEach((x, i) => zs.forEach((z, k) => piece(0.25, H, 0.35, x, f * H + H / 2, z, 'col', a + (i + k) * 0.003, a + 0.03 + (i + k) * 0.003, null, 'y')));
    [[10.2, 3.2, 2.2, 0.2], [10.2, 6.8, 2.2, 0.2], [9.2, 5, 0.2, 3.6], [11.2, 5, 0.2, 3.6]].forEach(([cx, cz, w, d]) =>
      piece(w, H, d, cx, f * H + H / 2, cz, 'col', a + 0.012, a + 0.045, coreMat, 'y'));
    const yb = (f + 1) * H - 0.25;
    zs.forEach(z => xs.slice(0, -1).forEach((x, i) => piece(xs[i + 1] - x, 0.5, 0.2, (x + xs[i + 1]) / 2, yb, z, 'beam', a + 0.03, a + 0.055, null, 'x')));
    xs.forEach(x => zs.slice(0, -1).forEach((z, i) => piece(0.2, 0.5, zs[i + 1] - z, x, yb, (z + zs[i + 1]) / 2, 'beam', a + 0.035, a + 0.06, null, 'z')));
    const slab = piece(14.1, 0.12, 10.6, 6.75, (f + 1) * H + 0.06, 5, 'slab', a + 0.05, a + 0.08, slabMat(), null);
    slab.main = true;
    if (f < FL - 1) piece(9, 0.12, 1.3, 4.5, (f + 1) * H + 0.06, 10.95, 'slab', a + 0.065, a + 0.09, slabMat(), null);
  }
  // platibanda
  [[6.75, -0.22, 14.1, 0.15], [6.75, 10.22, 14.1, 0.15], [-0.3, 5, 0.15, 10.6], [13.8, 5, 0.15, 10.6]].forEach(([cx, cz, w, d]) =>
    piece(w, 0.9, d, cx, FL * H + 0.12 + 0.45, cz, 'col', 0.6, 0.62, coreMat, 'y'));

  // ---------- Instalações ----------
  const pipes = [], pops = [], lights = [];
  function pipe(points, color, r, t0, t1) {
    const path = new THREE.CurvePath();
    for (let i = 0; i < points.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...points[i + 1])));
    const geo = new THREE.TubeGeometry(path, Math.max(16, points.length * 24), r, 8, false);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1, emissive: color, emissiveIntensity: 0.18 }));
    geo.setDrawRange(0, 0);
    m.visible = false;
    root.add(m);
    pipes.push({ m, count: geo.index.count, t0, t1 });
  }
  function equip(w, h, d, x, y, z, color, t0, t1) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.scale.setScalar(0.0001);
    root.add(m);
    pops.push({ m, t0, t1 });
    return m;
  }

  // brilho suave das luminárias
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,214,130,.95)'); grd.addColorStop(0.3, 'rgba(255,190,90,.35)'); grd.addColorStop(1, 'rgba(255,185,80,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  function lamp(x, y, z, t) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xFFF4DD, emissive: 0xFFC768, emissiveIntensity: 0 });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 20), mat);
    m.position.set(x, y, z);
    root.add(m);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.NormalBlending }));
    sp.position.set(x, y - 0.3, z);
    sp.scale.set(1.8, 1.8, 1);
    root.add(sp);
    lights.push({ m, sp, mat, t });
  }

  const I0 = 0.62;
  // água fria: caixa d'água sobre o núcleo, prumada descendo pelo shaft e ramais até os banheiros
  equip(2.2, 1.3, 2.0, 10.2, FL * H + 0.42, 5, 0x8FC2E6, I0, I0 + 0.025);
  equip(2.4, 0.3, 2.2, 10.2, FL * H + 0.12, 5, 0xB9C4C0, I0, I0 + 0.02);
  pipe([[9.1, FL * H + 0.9, 5], [8.7, FL * H + 0.9, 5], [8.7, FL * H + 0.9, 7.2], [8.7, 0.55, 7.2]], 0x2A78D2, 0.08, I0 + 0.02, I0 + 0.07);
  // esgoto: prumada até a caixa de inspeção e a rede pública
  equip(0.7, 0.5, 0.7, 8.95, -0.6, 12.6, 0x9AA39F, I0 + 0.02, I0 + 0.04);
  pipe([[8.95, (FL - 1) * H - 0.15, 7.7], [8.95, -0.45, 7.7], [8.95, -0.45, 12.4], [8.95, -0.45, 16]], 0x7A6553, 0.1, I0 + 0.04, I0 + 0.1);
  // elétrica: padrão de entrada na calçada, ramal enterrado até o quadro geral e prumada
  equip(0.2, 5.2, 0.2, -2.2, 0, 12.4, 0x9AA5A1, I0, I0 + 0.03);
  equip(0.6, 0.8, 0.3, -2.2, 1.0, 12.15, 0xE7E2D6, I0 + 0.01, I0 + 0.035);
  pipe([[-2.2, 1.0, 12.0], [-2.2, -0.35, 12.0], [0.9, -0.35, 12.0], [0.9, -0.35, 9.7], [0.9, 1.0, 9.7]], 0xE0A100, 0.07, I0 + 0.025, I0 + 0.06);
  pipe([[0.9, 1.0, 9.7], [0.9, floorY(FL - 1) + 1.4, 9.7]], 0xE0A100, 0.07, I0 + 0.055, I0 + 0.09);

  for (let k = 0; k < FL; k++) {
    const fy = floorY(k), b = I0 + 0.07 + k * 0.022;
    // banheiro: lavatório, bacia e chuveiro
    equip(0.55, 0.85, 0.4, 5.2, fy, 9.15, 0xF4F6F5, b + 0.02, b + 0.04);
    equip(0.4, 0.42, 0.62, 3.8, fy, 9.2, 0xF4F6F5, b + 0.02, b + 0.04);
    const yw = fy + 0.55;
    pipe([[8.7, yw, 7.2], [5.2, yw, 7.2], [5.2, yw, 8.8], [2.6, yw, 8.8], [2.6, fy + 2.1, 8.8]], 0x2A78D2, 0.05, b, b + 0.05);
    const ys = k === 0 ? -0.3 : fy - 0.2;
    pipe([[3.8, fy + 0.05, 9.2], [3.8, ys, 9.2], [3.8, ys, 7.7], [8.95, ys, 7.7]], 0x7A6553, 0.065, b + 0.015, b + 0.06);
    // quadro de distribuição e circuitos no forro, até as luminárias
    const qy = fy + 1.4, yc = (k + 1) * H - 0.12;
    equip(0.5, 0.7, 0.12, 0.9, qy - 0.35, 9.78, 0xE7E2D6, I0 + 0.06 + k * 0.008, I0 + 0.075 + k * 0.008);
    pipe([[0.9, qy, 9.7], [0.9, yc, 9.7], [0.9, yc, 7.5], [11.25, yc, 7.5]], 0xE0A100, 0.04, b + 0.01, b + 0.05);
    pipe([[2.25, yc, 7.5], [2.25, yc, 2.5], [11.25, yc, 2.5]], 0xE0A100, 0.04, b + 0.03, b + 0.07);
    [[2.25, 7.5], [6.75, 7.5], [11.25, 7.5], [2.25, 2.5], [6.75, 2.5], [11.25, 2.5]].forEach(([x, z], i) =>
      lamp(x, yc - 0.06, z, b + 0.03 + i * 0.006));
  }

  // ---------- Entrega: fachada de vidro, caixilhos e guarda-corpo ----------
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xBFE6D1, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  for (let f = 0; f < FL; f++) {
    const y = f * H + H / 2 - 0.12;
    [[6.75, -0.05, 13.5, 0], [6.75, 10.05, 13.5, 0], [-0.05, 5, 10, 1], [13.55, 5, 10, 1]].forEach(([x, z, len, rot]) => {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(len, H - 0.55), glassMat);
      g.position.set(x, y, z);
      if (rot) g.rotation.y = Math.PI / 2;
      root.add(g);
    });
  }
  const railMat = new THREE.MeshStandardMaterial({ color: 0xCFEBDD, roughness: 0.1, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  for (let f = 1; f < FL; f++) {
    const g = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.0), railMat);
    g.position.set(4.5, f * H + 0.62, 11.58);
    root.add(g);
  }
  const mullMat = new THREE.MeshStandardMaterial({ color: 0x3A4A42, roughness: 0.5, transparent: true, opacity: 0 });
  for (let f = 0; f < FL; f++) {
    for (let k = 0; k <= 9; k++) {
      [-0.06, 10.06].forEach(z => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, H - 0.55, 0.05), mullMat);
        m.position.set(k * 1.5, f * H + H / 2 - 0.12, z);
        root.add(m);
      });
    }
  }

  // ---------- Câmera: quadros-chave (progresso, azimute, elevação, distância, alvo y) ----------
  const KEYS = [
    [0.00, 0.95, 0.42, 48, 4.5],
    [0.10, 0.70, 0.62, 30, 0.0],
    [0.30, 0.80, 0.48, 36, 3.0],
    [0.62, 0.45, 0.30, 38, 5.5],
    [0.82, 0.15, 0.16, 31, 6.0],
    [1.00, -0.70, 0.26, 50, 5.0],
  ];
  function camAt(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], t = ease(seg(p, a[0], b[0]));
    const L = k => a[k] + (b[k] - a[k]) * t;
    return { az: L(1), el: L(2), d: L(3), ty: L(4) };
  }

  // ---------- Aplicar o progresso ----------
  function apply(p, intro) {
    let floors = 0;
    els.forEach(e => {
      const t = ease(seg(p, e.t0, e.t1));
      if (e.kind === 'slab') {
        e.m.userData.t = t;
        e.m.visible = t > 0.001;
        e.m.position.y = e.baseY + (1 - t) * 3;
        if (t > 0.999 && e.main) floors++;
      } else {
        const raw = seg(p, e.t0, e.t1);
        const s = Math.max(0.0001, (e.kind === 'found' || e.kind === 'col') ? back(raw) : ease(raw));
        if (e.axis === 'y') e.m.scale.y = s; else if (e.axis === 'x') e.m.scale.x = s; else e.m.scale.z = s;
        e.m.visible = raw > 0.001;
      }
    });

    // raio-x: estrutura translúcida enquanto as instalações aparecem
    const x = bump(p, 0.6, 0.66, 0.82, 0.88);
    const op = 1 - 0.74 * x;
    concrete.opacity = op; coreMat.opacity = op;
    concrete.depthWrite = coreMat.depthWrite = op > 0.99;
    els.forEach(e => { if (e.kind === 'slab') { e.m.material.opacity = e.m.userData.t * (1 - 0.8 * x); e.m.material.depthWrite = x < 0.01; } });

    ghostMat.opacity = (0.55 * (1 - seg(p, 0.1, 0.62)) + 0.1 * (1 - seg(p, 0.85, 1))) * intro;
    const so = bump(p, 0.06, 0.12, 0.28, 0.34);
    soilMat.opacity = 0.32 * so; soilLines.opacity = 0.7 * so; soil.visible = soilEdge.visible = so > 0.001;

    pipes.forEach(o => {
      const t = seg(p, o.t0, o.t1);
      o.m.visible = t > 0;
      o.m.geometry.setDrawRange(0, Math.floor(o.count * t / 3) * 3);
    });
    pops.forEach(o => o.m.scale.setScalar(Math.max(0.0001, back(seg(p, o.t0, o.t1)))));
    const night = seg(p, 0.86, 0.98);
    lights.forEach(l => {
      const on = seg(p, l.t, l.t + 0.01);
      l.mat.emissiveIntensity = on * (0.5 + 0.9 * night);
      l.sp.material.opacity = on * (0.25 + 0.5 * night);
    });
    const g = seg(p, 0.86, 0.96);
    gradeMat.opacity = g; gradeMat.depthWrite = g > 0.99; grade.visible = g > 0.001;
    glassMat.opacity = 0.3 * seg(p, 0.85, 0.98);
    railMat.opacity = 0.45 * seg(p, 0.88, 0.99);
    mullMat.opacity = seg(p, 0.86, 0.97);
    return { floors };
  }

  // ---------- Progresso da rolagem ----------
  let target = reduce ? 1 : 0, prog = target;
  function readProgress() {
    const r = story.getBoundingClientRect(), total = story.offsetHeight - window.innerHeight;
    target = reduce ? 1 : clamp01(-r.top / Math.max(1, total));
  }
  window.addEventListener('scroll', readProgress, { passive: true });

  function resize() {
    const w = sticky.clientWidth, h = sticky.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (w / h > 1.15) { camera.zoom = Math.min(1, (w / h) / 1.1); camera.setViewOffset(w, h, -w * 0.17, -h * 0.03, w, h); }
    else { camera.zoom = 0.5; camera.setViewOffset(w, h, 0, h * 0.2, w, h); }
    camera.updateProjectionMatrix();
    readProgress();
  }
  new ResizeObserver(resize).observe(sticky);
  resize();

  let mouseX = 0, mouseY = 0, mx = 0, my = 0;
  window.addEventListener('pointermove', e => { mouseX = e.clientX / window.innerWidth - 0.5; mouseY = e.clientY / window.innerHeight - 0.5; }, { passive: true });

  const t0 = performance.now();
  let running = true, frame = 0;
  new IntersectionObserver(es => {
    running = es[0].isIntersecting;
    if (running) { cancelAnimationFrame(frame); loop(); }
  }).observe(sticky);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && running) { cancelAnimationFrame(frame); loop(); } });

  function loop() {
    if (!running || document.hidden) return;
    prog += (target - prog) * (reduce ? 1 : 0.08);
    if (Math.abs(target - prog) < 0.0003) prog = target;
    mx += (mouseX - mx) * 0.05; my += (mouseY - my) * 0.05;
    const intro = reduce ? 1 : ease(clamp01((performance.now() - t0) / 2200));
    const c = camAt(prog);
    const d = c.d + (1 - intro) * 22, az = c.az - (1 - intro) * 0.5 + (reduce ? 0 : mx * 0.18), el = Math.max(0.05, c.el - (reduce ? 0 : my * 0.08));
    camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d + c.ty, Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(0, c.ty, 0);
    const info = apply(prog, intro);
    renderer.render(scene, camera);
    document.dispatchEvent(new CustomEvent('horst:progresso', { detail: { p: prog, floors: info.floors } }));
    frame = requestAnimationFrame(loop);
  }
  loop();
})();
