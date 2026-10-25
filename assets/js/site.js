/* Interações da página (serviços e números ficam direto no index.html, por SEO): menu, etapas da história, títulos, números, obras e visualizador do modelo .glb. */

(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const seg = (p, a, b) => clamp01((p - a) / (b - a));
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const { OBRAS = [], TIPOS = [] } = window.HORST || {};

  // ---------- Obras: grade com fotos (até 8) ----------
  const SIMBOLO = '<svg viewBox="0 0 3 3" aria-hidden="true"><rect width="1" height="1"/><polygon points="1,1 2,0 3,0 3,1"/><polygon points="0,2 1,1 1,3 0,3"/><rect x="2" y="2" width="1" height="1"/></svg>';
  const grid = document.querySelector('[data-obras]');
  const reais = OBRAS.length > 0;
  if (grid) grid.innerHTML = (reais ? OBRAS.slice(0, 8) : TIPOS).map(o => reais ? `
    <li class="obra">
      <div class="pic">${o.foto ? `<img src="${o.foto}" alt="${o.alt || `${o.categoria} em ${o.cidade}: ${o.nome}, projeto da Horst Engenharia`}" loading="lazy">` : `<div class="ph">${SIMBOLO}</div>`}</div>
      <div class="body"><span class="cat">${[o.categoria, o.cidade].filter(Boolean).join(' · ')}</span><h3>${o.nome}</h3>${o.texto ? `<p>${o.texto}</p>` : ''}${o.area || o.ano ? `<div class="meta"><span>${o.area || ''}</span><span>${o.ano || ''}</span></div>` : ''}</div>
    </li>` : `
    <li class="obra">
      <div class="pic"><div class="ph">${SIMBOLO}</div></div>
      <div class="body"><span class="cat">Tipo de obra</span><h3>${o.nome}</h3><p>${o.texto}</p></div>
    </li>`).join('');

  // ---------- Serviços: no celular, resumo com "Ler mais" ----------
  document.querySelectorAll('.svc-mais').forEach(btn => btn.addEventListener('click', () => {
    const open = btn.closest('.svc').classList.toggle('aberto');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Ler menos' : 'Ler mais';
  }));

  // ---------- Números contam do zero ----------
  const counts = document.querySelectorAll('.count[data-alvo]');
  const fmtInt = n => Math.round(n).toLocaleString('pt-BR');
  if (!reduce && 'IntersectionObserver' in window) {
    counts.forEach(el => { el.textContent = '0'; });
    const countIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target, alvo = +el.dataset.alvo, t0 = performance.now(), dur = 2000;
      const tick = now => {
        const t = clamp01((now - t0) / dur);
        el.textContent = fmtInt(alvo * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    counts.forEach(el => countIO.observe(el));
  }

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
  const heads = document.querySelectorAll('.sec-head h2, .contact h2, .viewer-info h2, .about-title');
  heads.forEach(splitWords);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('w-on'); io.unobserve(e.target); }
  }), { threshold: 0.3 });
  heads.forEach(h => io.observe(h));

  // ---------- Menu ----------
  const menu = document.getElementById('menu'), menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn) menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Fechar' : 'Menu';
    document.body.classList.toggle('menu-aberto', open);
  });
  if (menu && menuBtn) menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); document.body.classList.remove('menu-aberto'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu'; }));
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
      if (hudStep) hudStep.textContent = NOMES[c];
      stepBtns.forEach((btn, i) => btn.classList.toggle('cur', i === c - 1));
      last = c;
    }
    stepBtns.forEach((btn, i) => { const bar = btn.querySelector('b'); if (bar) bar.style.transform = `scaleX(${seg(p, b[i + 1], b[i + 2])})`; });
    if (hudPct) hudPct.textContent = Math.round(seg(p, b[1], 1) * 100) + '%';
    if (cue) cue.style.opacity = p < 0.04 ? 1 : 0;
  }
  document.addEventListener('horst:progresso', e => etapa(e.detail.p));
  if (story && (!window.THREE || reduce)) {
    const read = () => { const r = story.getBoundingClientRect(); etapa(clamp01(-r.top / Math.max(1, story.offsetHeight - innerHeight))); };
    window.addEventListener('scroll', read, { passive: true }); read();
  }
  if (story) stepBtns.forEach((btn, i) => btn.addEventListener('click', () => {
    const total = story.offsetHeight - window.innerHeight, top = story.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * (B()[i + 2] - 0.012), behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ---------- Revelações sutis ----------
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.svc, .stat, .obra, .about .photo, .about > div, .viewer').forEach(el => {
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
