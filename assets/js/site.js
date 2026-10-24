/* Interações da página: menu, etapas da história, títulos, obras na horizontal e visualizador do modelo .glb. */

(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const seg = (p, a, b) => clamp01((p - a) / (b - a));
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const { NUMEROS = [], SERVICOS, OBRAS = [], TIPOS = [] } = window.HORST;

  // ---------- Números ----------
  const stats = document.querySelector('[data-numeros]');
  if (NUMEROS.length) stats.innerHTML = NUMEROS.map(n =>
    `<li class="stat"><strong>${n.valor}${n.sufixo ? `<sup>${n.sufixo}</sup>` : ''}</strong><span>${n.rotulo}</span></li>`).join('');
  else stats.closest('.stats-band').remove();

  // ---------- Serviços ----------
  const ICONES = {
    est: '<path d="M8 38V10M22 38V10M36 38V10M4 10h36M4 24h36M4 38h36M8 24l14-14M22 24l14-14"/>',
    fun: '<path d="M4 18h36M19 6v20M25 6v20M12 26h20v6H12zM16 32v8M28 32v8"/><path d="M4 18l4 4M10 18l4 4M30 18l4 4M36 18l4 4" stroke-dasharray="2 2"/>',
    ele: '<circle cx="22" cy="22" r="16"/><path d="M24 8l-8 16h8l-4 12 10-17h-8l4-11z"/>',
    hid: '<path d="M4 14h20a6 6 0 0 1 6 6v6M4 20h18a2 2 0 0 1 2 2v4M27 30c0 3 1.5 6 3 6s3-3 3-6-3-6-3-6-3 3-3 6z"/>',
    reg: '<path d="M10 4h18l8 8v28H10zM28 4v8h8M15 20h16M15 26h16M15 32h9M27 34l3 3 6-7"/>',
    ass: '<path d="M8 26a14 14 0 0 1 28 0M5 26h34v4H5zM20 12h4v4M14 36h16"/>'
  };
  document.querySelector('[data-servicos]').innerHTML = SERVICOS.map(s =>
    `<article class="svc"><svg class="ico" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${ICONES[s.icone]}</svg><h3>${s.nome}</h3><p>${s.texto}</p></article>`).join('');

  // ---------- Obras: fachada desenhada em traço ----------
  function fachada(o) {
    const W = 240, H = 160, g = 136, L = [];
    const line = (x1, y1, x2, y2, e) => L.push(`<line pathLength="1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${e || ''}/>`);
    const rect = (x, y, w, h, e) => L.push(`<rect pathLength="1" x="${x}" y="${y}" width="${w}" height="${h}" ${e || ''}/>`);
    const n = o.pavimentos || 1;
    let top = g, right = 0;
    if (o.desenho === 'casa') {
      const w = 110 * (o.largura || 1), x = (W - w) / 2 - 10, fh = 26, h = fh * n;
      rect(x, g - h, w, h);
      for (let i = 1; i < n; i++) line(x, g - fh * i, x + w, g - fh * i, 'stroke-dasharray="3 2"');
      L.push(`<polyline pathLength="1" points="${x - 8},${g - h} ${x + w * 0.55},${g - h - 30} ${x + w + 8},${g - h}"/>`);
      for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) rect(x + 12 + k * (w - 24) / 3, g - fh * (i + 1) + 7, (w - 24) / 3 - 10, 12, 'stroke-width=".8"');
      top = g - h - 30; right = x + w + 8;
    } else if (o.desenho === 'predio') {
      const w = 92, x = (W - w) / 2 - 10, fh = Math.min(13, 112 / n), h = fh * n;
      rect(x, g - h, w, h);
      for (let i = 1; i < n; i++) line(x, g - fh * i, x + w, g - fh * i);
      for (let i = 0; i < n; i++) for (let k = 0; k < 4; k++) rect(x + w * k / 4 + 4, g - fh * (i + 1) + 3, w / 4 - 8, fh - 6, 'stroke-width=".6"');
      rect(x + w * 0.62, g - h - 9, w * 0.25, 9, 'stroke-width=".8"');
      top = g - h - 9; right = x + w;
    } else if (o.desenho === 'comercial') {
      const w = 150, x = (W - w) / 2 - 10, fh = 18, h = fh * n;
      rect(x, g - h, w, h);
      for (let i = 1; i < n; i++) line(x, g - fh * i, x + w, g - fh * i);
      for (let i = 0; i < n; i++) rect(x + 6, g - fh * (i + 1) + 4, w - 12, fh - 8, 'stroke-width=".7"');
      for (let k = 1; k < 6; k++) line(x + w * k / 6, g - h, x + w * k / 6, g, 'stroke-width=".5"');
      top = g - h; right = x + w;
    } else {
      const w = 180, x = (W - w) / 2 - 10, h = 46;
      L.push(`<polyline pathLength="1" points="${x},${g - h} ${x + w / 2},${g - h - 18} ${x + w},${g - h}"/>`);
      line(x, g - h, x, g); line(x + w, g - h, x + w, g);
      for (let k = 1; k < 8; k++) line(x + w * k / 8, g - h, x + w * k / 8, g, 'stroke-width=".6"');
      rect(x + w * 0.4, g - 30, w * 0.2, 30, 'stroke-width=".9"');
      top = g - h - 18; right = x + w;
    }
    const metros = { casa: n * 3 + 2.5, predio: n * 3 + 1.5, comercial: n * 4, pavilhao: 9 }[o.desenho];
    const dx = Math.min(W - 10, right + 14);
    line(dx, top, dx, g, 'stroke-width=".7"'); line(dx - 3, top, dx + 3, top, 'stroke-width=".7"'); line(dx - 3, g, dx + 3, g, 'stroke-width=".7"');
    L.push(`<text x="${dx - 4}" y="${(top + g) / 2}" transform="rotate(-90 ${dx - 4} ${(top + g) / 2})" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">${fmt(metros, 1)} m</text>`);
    line(8, g, W - 8, g, 'stroke-width="1.4"');
    for (let x = 12; x < W - 8; x += 8) line(x, g + 1, x - 5, g + 7, 'stroke-width=".5"');
    return `<svg class="elev" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true">${L.join('')}</svg>`;
  }
  const track = document.querySelector('[data-obras]');
  const reais = OBRAS.length > 0, itens = reais ? OBRAS : TIPOS;
  const num = i => `${String(i + 1).padStart(2, '0')} / ${String(itens.length).padStart(2, '0')}`;
  track.innerHTML = itens.map((o, i) => reais ? `
    <li class="work">
      <div class="pic">${o.foto ? `<img src="${o.foto}" alt="${o.nome}, ${o.cidade}" loading="lazy">` : fachada(o)}<span class="idx">${num(i)}</span></div>
      <div class="body"><span class="cat">${o.categoria} · ${o.ano}</span><h3>${o.nome}</h3>${o.texto ? `<p>${o.texto}</p>` : ''}<div class="meta"><span>${o.cidade}</span><span>${o.area}</span></div></div>
    </li>` : `
    <li class="work">
      <div class="pic">${fachada(o)}<span class="idx">${num(i)}</span></div>
      <div class="body"><span class="cat">Tipo de obra</span><h3>${o.nome}</h3><p>${o.texto}</p></div>
    </li>`).join('') + `
    <li><a class="work more" href="https://www.instagram.com/horst.eng" target="_blank" rel="noopener">
      <div><h3>${reais ? 'Acompanhe as obras em andamento' : 'Veja as obras no Instagram'}</h3><p>Projetos, obras em andamento e bastidores do escritório.</p></div>
      <span>@horst.eng ↗</span></a></li>`;
  if (!reais) track.closest('.works').classList.add('grade');
  const total = document.querySelector('[data-obras-total]');
  total.innerHTML = reais
    ? `<strong>${OBRAS.length} ${OBRAS.length === 1 ? 'obra' : 'obras'}</strong><br>publicadas no portfólio`
    : '<strong>Do sobrado ao pavilhão</strong><br>estrutura, fundação, elétrica e hidráulica';

  document.querySelectorAll('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ---------- Títulos entram palavra por palavra ----------
  function splitWords(el) {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  }
  document.querySelectorAll('.chap h1, .chap h2').forEach(splitWords);
  const heads = document.querySelectorAll('.sec-head h2, .works-head h2, .contact h2, .viewer-info h2, .about-title');
  heads.forEach(splitWords);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('w-on'); io.unobserve(e.target); }
  }), { threshold: 0.3 });
  heads.forEach(h => io.observe(h));

  // ---------- Menu ----------
  const nav = document.querySelector('.nav'), menu = document.getElementById('menu'), menuBtn = document.querySelector('.menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Fechar' : 'Menu';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu'; }));
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('hide', y > lastY + 4 && y > 400 && !menu.classList.contains('open'));
    if (y < lastY - 4) nav.classList.remove('hide');
    lastY = y;
  }, { passive: true });
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-links a')];
  const sectionObserver = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  // ---------- Etapas da história ----------
  const story = document.querySelector('.story');
  const chaps = [...document.querySelectorAll('.chap')];
  const stepBtns = [...document.querySelectorAll('[data-etapa]')];
  const NOMES = ['Projeto', 'Fundação', 'Estrutura', 'Instalações', 'Entrega'];
  const hudStep = document.getElementById('hud-etapa'), hudPct = document.getElementById('hud-pct'), cue = document.getElementById('cue');
  const B = () => window.HORST_BOUNDS || [0, 0.1, 0.3, 0.62, 0.82, 1];
  let last = -1;
  function etapa(p) {
    const b = B();
    let c = 0;
    for (let i = 0; i < 5; i++) if (p >= b[i]) c = i;
    if (c !== last) {
      chaps.forEach((el, i) => el.classList.toggle('on', i === c));
      hudStep.textContent = NOMES[c];
      stepBtns.forEach((btn, i) => btn.classList.toggle('cur', i === c - 1));
      last = c;
    }
    stepBtns.forEach((btn, i) => { btn.querySelector('b').style.transform = `scaleX(${seg(p, b[i + 1], b[i + 2])})`; });
    hudPct.textContent = Math.round(seg(p, b[1], 1) * 100) + '%';
    cue.style.opacity = p < 0.04 ? 1 : 0;
  }
  document.addEventListener('horst:progresso', e => etapa(e.detail.p));
  if (!window.THREE || reduce) {
    const read = () => { const r = story.getBoundingClientRect(); etapa(clamp01(-r.top / Math.max(1, story.offsetHeight - innerHeight))); };
    window.addEventListener('scroll', read, { passive: true }); read();
  }
  stepBtns.forEach((btn, i) => btn.addEventListener('click', () => {
    const total = story.offsetHeight - window.innerHeight, top = story.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * (B()[i + 2] - 0.012), behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ---------- Obras na horizontal ----------
  const works = document.querySelector('.works'), bar = document.getElementById('obras-barra');
  function sizeWorks() {
    if (isMobile() || reduce || works.classList.contains('grade')) { works.style.height = ''; track.style.transform = ''; return; }
    const dist = Math.max(0, track.scrollWidth - window.innerWidth);
    works.style.height = (window.innerHeight + dist) + 'px';
    works.dataset.dist = dist;
  }
  function moveWorks() {
    if (isMobile() || reduce) return;
    const r = works.getBoundingClientRect(), dist = +works.dataset.dist || 0;
    const t = clamp01(-r.top / Math.max(1, works.offsetHeight - window.innerHeight));
    track.style.transform = `translate3d(${-dist * t}px,0,0)`;
    bar.style.transform = `scaleX(${t})`;
  }
  sizeWorks(); moveWorks();
  window.addEventListener('resize', () => { sizeWorks(); moveWorks(); });
  window.addEventListener('scroll', moveWorks, { passive: true });
  if (isMobile()) track.addEventListener('scroll', () => { bar.style.transform = `scaleX(${clamp01(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth))})`; }, { passive: true });

  // ---------- Revelações sutis ----------
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.svc, .stat, .about .photo, .about > div, .viewer').forEach(el => {
      gsap.from(el, { opacity: 0, y: 14, duration: 0.45, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' } });
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // ---------- Visualizador do modelo .glb (comprimido com Draco; carrega quando a seção se aproxima da tela) ----------
  const stage = document.querySelector('.viewer-stage');
  const loadBtn = document.querySelector('.viewer-load');
  if (stage && loadBtn) {
    const status = stage.querySelector('.viewer-status'), progress = stage.querySelector('.viewer-progress b'), poster = stage.querySelector('.viewer-poster');
    const tools = stage.querySelector('.viewer-tools');
    const script = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
    const JSM = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
    let started = false;
    const start = async () => {
      if (started) return;
      started = true;
      loadBtn.disabled = true;
      stage.querySelector('.viewer-progress').hidden = false;
      status.textContent = 'Preparando o visualizador…';
      try {
        if (!window.THREE) throw new Error('three');
        await Promise.all([script(JSM + 'controls/OrbitControls.js'), script(JSM + 'loaders/GLTFLoader.js'), script(JSM + 'loaders/DRACOLoader.js')]);
      } catch (e) { status.textContent = 'Não foi possível carregar o visualizador. Verifique a conexão e tente de novo.'; loadBtn.disabled = false; started = false; return; }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute('aria-label', 'Modelo 3D de projeto da Horst Engenharia. Arraste para girar e use a rolagem ou o gesto de pinça para aproximar.');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 5000);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x0D3931, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(-1, 2, 1.5); scene.add(key);
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      let home = null, visible = true, looping = false;

      const draco = new THREE.DRACOLoader();
      draco.setDecoderPath(JSM + 'libs/draco/');
      const loader = new THREE.GLTFLoader();
      loader.setDRACOLoader(draco);
      loader.load(stage.dataset.modelo, gltf => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);
        const radius = size.length() / 2;
        const dir = new THREE.Vector3(-37.5, 22.7, -43.4).normalize();
        home = dir.multiplyScalar(radius * 2.1);
        camera.near = radius / 100; camera.far = radius * 20; camera.updateProjectionMatrix();
        camera.position.copy(home); controls.target.set(0, 0, 0); controls.update();
        controls.minDistance = radius * 0.3; controls.maxDistance = radius * 5;
        stage.prepend(renderer.domElement);
        poster.hidden = true; tools.hidden = false;
        fit(); loop();
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); }).observe(stage);
      }, xhr => {
        if (xhr.total) { progress.style.transform = `scaleX(${xhr.loaded / xhr.total})`; status.textContent = `Carregando modelo… ${fmt(xhr.loaded / 1048576, 1)} de ${fmt(xhr.total / 1048576, 1)} MB`; }
        else status.textContent = `Carregando modelo… ${fmt(xhr.loaded / 1048576, 1)} MB`;
      }, () => { status.textContent = 'Não foi possível abrir o modelo agora. Tente novamente mais tarde.'; loadBtn.disabled = false; started = false; });

      function fit() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
      new ResizeObserver(fit).observe(stage);
      function loop() { if (visible && !looping) { looping = true; requestAnimationFrame(render); } }
      function render() {
        if (!visible) { looping = false; return; }
        controls.update(); renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      tools.querySelector('[data-reset]').addEventListener('click', () => { if (home) { camera.position.copy(home); controls.target.set(0, 0, 0); } });
      tools.querySelector('[data-full]').addEventListener('click', () => { if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {}); });
    };
    loadBtn.addEventListener('click', start);
    if ('IntersectionObserver' in window) {
      const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); start(); } }, { rootMargin: '300px 0px' });
      near.observe(stage);
    }
  }
})();
