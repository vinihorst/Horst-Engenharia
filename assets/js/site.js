/* Interações da página (textos ficam direto no index.html, por SEO): projetos e estudos de caso, números, menu, etapas da história, títulos e visualizador do modelo .glb. */

(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const seg = (p, a, b) => clamp01((p - a) / (b - a));
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const { OBRAS = [], TIPOS = [] } = window.HORST || {};

  // ---------- Projetos: cards e estudos de caso (dados em conteudo.js) ----------
  const SIMBOLO = '<svg viewBox="0 0 3 3" aria-hidden="true"><rect width="1" height="1"/><polygon points="1,1 2,0 3,0 3,1"/><polygon points="0,2 1,1 1,3 0,3"/><rect x="2" y="2" width="1" height="1"/></svg>';
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lista = arr => (arr || []).filter(Boolean);
  const grid = document.querySelector('[data-obras]');
  const obras = OBRAS.filter(o => o && o.nome).slice(0, 8).map((o, i) => Object.assign({ slug: 'obra-' + (i + 1) }, o));
  const reais = obras.length > 0;
  const capa = o => (lista(o.fotos)[0]) || (o.foto ? { src: o.foto, alt: o.alt } : null);
  const altPadrao = o => [o.tipo || o.categoria, o.nome, o.cidade].filter(Boolean).join(', ') + ', projeto da Horst Engenharia';
  if (grid) grid.innerHTML = (reais ? obras : TIPOS).map(o => {
    if (!reais) return `
    <li class="obra">
      <div class="pic"><div class="ph">${SIMBOLO}</div></div>
      <div class="body"><span class="cat">Tipo de edificação</span><h3>${esc(o.nome)}</h3><p>${esc(o.texto)}</p></div>
    </li>`;
    const f = capa(o), discs = lista(o.disciplinas);
    return `
    <li class="obra obra-real">
      <div class="pic">${f ? `<img src="${esc(f.src)}" alt="${esc(f.alt || altPadrao(o))}" loading="lazy" decoding="async">` : `<div class="ph">${SIMBOLO}</div>`}</div>
      <div class="body"><span class="cat">${esc([o.tipo || o.categoria, o.cidade].filter(Boolean).join(' · '))}</span>
        <h3><a href="#projeto-${esc(o.slug)}" data-caso-abrir="${esc(o.slug)}">${esc(o.nome)}</a></h3>
        ${o.resumo || o.texto ? `<p>${esc(o.resumo || o.texto)}</p>` : ''}
        ${discs.length ? `<ul class="chips" role="list">${discs.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
        ${o.area || o.ano ? `<div class="meta"><span>${esc(o.area)}</span><span>${esc(o.ano)}</span></div>` : ''}
        <span class="obra-mais" aria-hidden="true">Ver estudo de caso →</span>
      </div>
    </li>`;
  }).join('');
  if (reais) {
    const intro = document.querySelector('[data-obras-intro]');
    if (intro) intro.textContent = 'Estudos de caso com as disciplinas envolvidas, o sistema estrutural adotado e os principais desafios de engenharia de cada obra.';
  }

  const dlg = document.getElementById('caso'), casoBox = dlg && dlg.querySelector('[data-caso]');
  const bloco = (titulo, itens) => itens.length ? `<section><h3>${titulo}</h3><ul role="list">${itens.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : '';
  function abrirCaso(slug, push) {
    const o = obras.find(x => x.slug === slug);
    if (!o || !dlg || typeof dlg.showModal !== 'function') return false;
    const fotos = lista(o.fotos).length ? lista(o.fotos) : (capa(o) ? [capa(o)] : []);
    const fichas = [['Tipo', o.tipo || o.categoria], ['Local', o.cidade], ['Área', o.area], ['Ano', o.ano], ['Sistema estrutural', o.sistemaEstrutural], ['Disciplinas', lista(o.disciplinas).join(', ')]].filter(([, v]) => v);
    const ad = o.antesDepois && o.antesDepois.antes && o.antesDepois.depois ? o.antesDepois : null;
    casoBox.innerHTML = `
      <span class="eyebrow">Estudo de caso</span>
      <h2 id="caso-titulo">${esc(o.nome)}</h2>
      ${o.resumo ? `<p class="caso-resumo">${esc(o.resumo)}</p>` : ''}
      ${fichas.length ? `<dl class="caso-ficha">${fichas.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${bloco('Principais desafios', lista(o.desafios))}
      ${bloco('Soluções adotadas', lista(o.solucoes))}
      ${bloco('Características e resultados', lista(o.resultados))}
      ${fotos.length ? `<div class="caso-fotos">${fotos.map(f => `<figure><img src="${esc(f.src)}" alt="${esc(f.alt || altPadrao(o))}" loading="lazy" decoding="async">${f.legenda ? `<figcaption>${esc(f.legenda)}</figcaption>` : ''}</figure>`).join('')}</div>` : ''}
      ${ad ? `<div class="caso-ad"><figure><img src="${esc(ad.antes.src)}" alt="${esc(ad.antes.alt || 'Antes')}" loading="lazy"><figcaption>Antes</figcaption></figure><figure><img src="${esc(ad.depois.src)}" alt="${esc(ad.depois.alt || 'Depois')}" loading="lazy"><figcaption>Depois</figcaption></figure></div>` : ''}
      ${o.modelo ? `<button class="btn" type="button" data-caso-modelo>Abrir o modelo 3D desta obra</button>` : ''}`;
    const mb = casoBox.querySelector('[data-caso-modelo]');
    if (mb) mb.addEventListener('click', () => { fecharCaso(); if (window.HORST_abrirModelo) window.HORST_abrirModelo(o.modelo, o.modeloTamanho, o.nome); });
    dlg.showModal();
    dlg.scrollTop = 0;
    if (push) history.replaceState(null, '', '#projeto-' + o.slug);
    return true;
  }
  function fecharCaso() { if (dlg && dlg.open) dlg.close(); }
  if (dlg) {
    dlg.querySelector('[data-fechar]').addEventListener('click', fecharCaso);
    dlg.addEventListener('click', e => { if (e.target === dlg) fecharCaso(); });
    dlg.addEventListener('close', () => { if (location.hash.startsWith('#projeto-')) history.replaceState(null, '', '#obras'); });
  }
  if (grid) grid.addEventListener('click', e => {
    const card = e.target.closest('.obra-real');
    if (!card) return;
    const a = card.querySelector('[data-caso-abrir]');
    if (a && abrirCaso(a.dataset.casoAbrir, true)) e.preventDefault();
  });
  const casoDoHash = () => { const m = location.hash.match(/^#projeto-(.+)$/); if (m) abrirCaso(decodeURIComponent(m[1]), false); };
  window.addEventListener('hashchange', casoDoHash);
  casoDoHash();

  // ---------- Números reais (NUMEROS em conteudo.js) substituem a faixa de fatos ----------
  const numBox = document.querySelector('[data-numeros]');
  const nums = (window.HORST && window.HORST.NUMEROS || []).filter(n => n && n.rotulo && n.valor != null);
  if (numBox && nums.length) {
    numBox.innerHTML = nums.slice(0, 4).map(n => typeof n.valor === 'number'
      ? `<li class="stat"><strong><span class="count" data-alvo="${n.valor}">${n.valor.toLocaleString('pt-BR')}</span>${n.sufixo ? `<sup>${esc(n.sufixo)}</sup>` : ''}</strong><span>${esc(n.rotulo)}</span></li>`
      : `<li class="stat"><strong>${esc(n.valor)}</strong><span>${esc(n.rotulo)}</span></li>`).join('');
    numBox.classList.toggle('stats-4', nums.length >= 4);
  }

  // ---------- Serviços: resumo com "Ler mais" e link para a página do serviço ----------
  document.querySelectorAll('.svc-mais').forEach(btn => btn.addEventListener('click', () => {
    const open = btn.closest('.svc').classList.toggle('aberto');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Ler menos' : 'Ler mais';
  }));

  // ---------- Números contam do zero ----------
  const counts = document.querySelectorAll('.count[data-alvo]');
  const fmtInt = n => Math.round(n).toLocaleString('pt-BR');
  // Contam do zero uma vez, quando a faixa entra na tela.
  if (!reduce && 'IntersectionObserver' in window) {
    // largura fixa do número final, para o conjunto centralizado não balançar durante a contagem
    const medir = () => counts.forEach(el => {
      const txt = el.textContent; el.textContent = fmtInt(+el.dataset.alvo); el.style.minWidth = '';
      el.style.minWidth = el.getBoundingClientRect().width / parseFloat(getComputedStyle(el).fontSize) + 'em';
      el.textContent = txt;
    });
    medir();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
    counts.forEach(el => { el.textContent = '0'; });
    const countIO = new IntersectionObserver(es => es.forEach(e => {
      const el = e.target;
      if (!e.isIntersecting || el._run || e.intersectionRatio < 0.5) return;
      countIO.unobserve(el);
      const alvo = +el.dataset.alvo, t0 = performance.now(), dur = 2000, run = el._run = t0;
      const tick = now => {
        if (el._run !== run) return;
        const t = clamp01((now - t0) / dur);
        el.textContent = fmtInt(alvo * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: [0, 0.5] });
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && menu.classList.contains('open')) { menuBtn.click(); menuBtn.focus(); } });
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
  if (story && (!window.THREE || window.HORST_SEM3D || reduce)) {
    const read = () => { const r = story.getBoundingClientRect(); etapa(clamp01(-r.top / Math.max(1, story.offsetHeight - innerHeight) / (window.HORST_END || 1))); };
    window.addEventListener('scroll', read, { passive: true }); read();
  }
  if (story) stepBtns.forEach((btn, i) => btn.addEventListener('click', () => {
    const total = story.offsetHeight - window.innerHeight, top = story.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * (B()[i + 2] - 0.012) * (window.HORST_END || 1), behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ---------- Revelações sutis (sem biblioteca: IntersectionObserver + transição CSS) ----------
  if (!reduce && 'IntersectionObserver' in window) {
    const alvos = document.querySelectorAll('.svc, .stat, .obra, .about .photo, .about > div, .viewer, .etapas > li, .publicos > article');
    const revIO = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('rev-on'); revIO.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    alvos.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('rev'); revIO.observe(el);
    });
  }

  // ---------- Visualizador do modelo .glb (comprimido com Draco; carrega quando a seção se aproxima) ----------
  // Outro modelo (ex.: de um estudo de caso) abre com window.HORST_abrirModelo(url, tamanho, nome).
  const stage = document.querySelector('.viewer-stage');
  const loadBtn = document.querySelector('.viewer-load');
  if (stage && loadBtn) {
    const status = stage.querySelector('.viewer-status'), progressBox = stage.querySelector('.viewer-progress'), progress = progressBox.querySelector('b'), poster = stage.querySelector('.viewer-poster');
    const tools = stage.querySelector('.viewer-tools');
    const script = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
    // three.js r128 e complementos servidos pelo próprio site (sem depender de CDN).
    const JSM = './assets/vendor/three-r128/';
    let ready = null, view = null, pending = null, current = null;

    const prepare = () => ready || (ready = (async () => {
      if (!window.THREE) throw new Error('three');
      await Promise.all([script(JSM + 'OrbitControls.js'), script(JSM + 'GLTFLoader.js'), script(JSM + 'DRACOLoader.js')]);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute('aria-label', 'Modelo 3D de projeto da Horst Engenharia, com estrutura, fundação e instalações. Arraste para girar e use a rolagem ou o gesto de pinça para aproximar.');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 5000);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x0D3931, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(-1, 2, 1.5); scene.add(key);
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      // No celular, um dedo sobre o modelo continua rolando a página; o giro só liga depois de um toque no botão.
      const toque = window.matchMedia('(pointer: coarse)').matches, touchBtn = stage.querySelector('.viewer-touch');
      const travar = on => { controls.enabled = !on; renderer.domElement.style.touchAction = on ? 'pan-y' : 'none'; if (touchBtn) touchBtn.hidden = !on || !view || !view.model; };
      if (toque) travar(true);
      if (touchBtn) touchBtn.addEventListener('click', () => travar(false));
      const draco = new THREE.DRACOLoader();
      draco.setDecoderPath(JSM + 'draco/');
      const loader = new THREE.GLTFLoader();
      loader.setDRACOLoader(draco);
      // Desenha só enquanto o modelo se move (giro, zoom, inércia, botões); parado, a placa de vídeo descansa.
      let visible = true, looping = false, dirty = true, quietos = 0;
      // Em telas largas o texto fica sobre a esquerda do palco, então o centro da vista vai um pouco para a direita.
      const render = () => {
        if (!visible) { looping = false; return; }
        const mexeu = controls.update();
        if (mexeu || dirty) { renderer.render(scene, camera); dirty = false; quietos = 0; }
        else if (++quietos > 20) { looping = false; return; }
        requestAnimationFrame(render);
      };
      const loop = () => { if (visible && !looping) { looping = true; quietos = 0; requestAnimationFrame(render); } };
      const redraw = () => { dirty = true; loop(); };
      const fit = () => { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; if (w >= 860) camera.setViewOffset(w, h, -w * 0.12, 0, w, h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); redraw(); };
      controls.addEventListener('start', redraw);
      controls.addEventListener('change', redraw);
      new ResizeObserver(fit).observe(stage);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible && toque) travar(true); redraw(); }).observe(stage);
      view = { renderer, scene, camera, controls, loader, fit, loop, redraw, travar: toque ? travar : null, model: null, home: null };
      tools.querySelector('[data-reset]').addEventListener('click', () => { if (view.home) { camera.position.copy(view.home); controls.target.set(0, 0, 0); redraw(); } });
      tools.querySelector('[data-full]').addEventListener('click', () => { if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {}); });
    })());

    // Disciplinas: o modelo otimizado junta as peças por cor numa paleta; cada triângulo é separado pela cor da paleta que usa.
    const DISC = [
      { id: 'estrutura', nome: 'Estrutura', cor: '#8e7640', cores: ['646464', '8e7640', '5a5a5a'] },
      { id: 'fundacao', nome: 'Fundação', cor: '#d45c1b', cores: ['d45c1b'] },
      { id: 'eletrica', nome: 'Elétrica', cor: '#e48b2d', cores: ['e48b2d'] },
      { id: 'hidro', nome: 'Hidrossanitário', cor: '#3f76be', cores: ['ca1c1c', '3f76be', 'e42828', '8dc9d7', '6d1c88', '1f169e'] }
    ];
    const PALETA = [];
    DISC.forEach(d => d.cores.forEach(h => PALETA.push([parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4), 16), d.id])));
    PALETA.push([255, 255, 255, null]);
    const camadasBox = document.querySelector('.viewer-camadas');
    function separar(model) {
      const grupos = {}, malhas = [];
      model.traverse(o => { if (o.isMesh) malhas.push(o); });
      malhas.forEach(mesh => {
        const geo = mesh.geometry, uv = geo.attributes.uv, img = mesh.material.map && mesh.material.map.image;
        if (!uv || !img) return;
        const w = img.width, h = img.height, cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0);
        let px; try { px = ctx.getImageData(0, 0, w, h).data; } catch (e) { return; }
        const flip = mesh.material.map.flipY;
        const idx = geo.index ? geo.index.array : null, nTri = (idx ? idx.length : geo.attributes.position.count) / 3;
        const cache = new Map(), baldes = {};
        for (let t = 0; t < nTri; t++) {
          const v = idx ? idx[t * 3] : t * 3;
          const x = Math.min(w - 1, Math.max(0, Math.floor(uv.getX(v) * w)));
          const yy = flip ? 1 - uv.getY(v) : uv.getY(v);
          const y = Math.min(h - 1, Math.max(0, Math.floor(yy * h)));
          const k = y * w + x;
          let id = cache.get(k);
          if (id === undefined) {
            const r = px[k * 4], g = px[k * 4 + 1], b = px[k * 4 + 2];
            let best = Infinity; id = null;
            PALETA.forEach(c => { const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2; if (d < best) { best = d; id = c[3]; } });
            cache.set(k, id);
          }
          if (!id) continue;
          const arr = baldes[id] || (baldes[id] = []);
          if (idx) arr.push(idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]); else arr.push(t * 3, t * 3 + 1, t * 3 + 2);
        }
        Object.keys(baldes).forEach(id => {
          const g = new THREE.BufferGeometry();
          Object.keys(geo.attributes).forEach(n => g.setAttribute(n, geo.attributes[n]));
          g.setIndex(baldes[id]);
          const parte = new THREE.Mesh(g, mesh.material);
          parte.position.copy(mesh.position); parte.quaternion.copy(mesh.quaternion); parte.scale.copy(mesh.scale);
          mesh.parent.add(parte);
          (grupos[id] || (grupos[id] = [])).push(parte);
        });
        if (Object.keys(baldes).length) mesh.visible = false;
      });
      return grupos;
    }
    function botoes(grupos) {
      if (!camadasBox) return;
      const presentes = DISC.filter(d => grupos[d.id]);
      camadasBox.innerHTML = '';
      camadasBox.hidden = presentes.length < 2;
      presentes.forEach(d => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.style.setProperty('--c', d.cor);
        b.innerHTML = `<i aria-hidden="true"></i>${d.nome}`;
        b.addEventListener('click', () => {
          const on = b.getAttribute('aria-pressed') !== 'true';
          b.setAttribute('aria-pressed', String(on));
          grupos[d.id].forEach(m => { m.visible = on; });
          if (view) view.redraw();
          if (view) view.loop();
        });
        camadasBox.appendChild(b);
      });
    }

    const falhou = msg => { status.textContent = msg; loadBtn.disabled = false; poster.hidden = false; progressBox.hidden = true; pending = null; };
    async function load(url) {
      if (!url || url === current || url === pending) return;
      pending = url;
      loadBtn.disabled = true;
      poster.hidden = false; progressBox.hidden = false; progress.style.transform = 'scaleX(0)';
      status.textContent = 'Preparando o visualizador…';
      try { await prepare(); } catch (e) { ready = null; return falhou('Não foi possível carregar o visualizador. Verifique a conexão e tente de novo.'); }
      view.loader.load(url, gltf => {
        if (pending !== url) return;
        const { scene, camera, controls, renderer } = view;
        if (view.model) { scene.remove(view.model); view.model.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);
        try { botoes(separar(model)); } catch (e) { if (camadasBox) camadasBox.hidden = true; }
        const radius = size.length() / 2;
        // Em palco estreito (celular) a câmera recua para o modelo caber na largura.
        view.fit();
        view.home = new THREE.Vector3(-37.5, 22.7, -43.4).normalize().multiplyScalar(radius * 2.1 * Math.max(1, 1.15 / camera.aspect));
        camera.near = radius / 100; camera.far = radius * 20; camera.updateProjectionMatrix();
        camera.position.copy(view.home); controls.target.set(0, 0, 0); controls.update();
        controls.minDistance = radius * 0.3; controls.maxDistance = radius * 5;
        if (!renderer.domElement.parentNode) stage.prepend(renderer.domElement);
        view.model = model; current = url; pending = null;
        poster.hidden = true; tools.hidden = false; status.textContent = '';
        if (view.travar) view.travar(!view.controls.enabled);
        view.fit(); controls.update(); renderer.render(scene, camera); view.loop();
      }, xhr => {
        if (xhr.total) { progress.style.transform = `scaleX(${xhr.loaded / xhr.total})`; status.textContent = `Carregando modelo… ${fmt(xhr.loaded / 1048576, 1)} de ${fmt(xhr.total / 1048576, 1)} MB`; }
        else status.textContent = `Carregando modelo… ${fmt(xhr.loaded / 1048576, 1)} MB`;
      }, () => falhou('Não foi possível abrir o modelo agora. Use o botão acima para tentar de novo.'));
    }

    loadBtn.addEventListener('click', () => load(stage.dataset.modelo));
    // Começa a baixar quando a seção está a cerca de três telas de distância (por volta de Serviços),
    // para o modelo já estar pronto ao chegar, sem gastar dados de quem lê só o topo e sai.
    const cedo = () => load(stage.dataset.modelo);
    if ('IntersectionObserver' in window) {
      const perto = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { perto.disconnect(); cedo(); } }, { rootMargin: '0px 0px 300% 0px' });
      const agendar = () => perto.observe(stage);
      if (document.readyState === 'complete') agendar(); else window.addEventListener('load', agendar, { once: true });
    } else window.addEventListener('load', cedo, { once: true });
    const texto = document.querySelector('[data-modelo-texto]');
    window.HORST_abrirModelo = (url, tamanho, nome) => {
      stage.dataset.modelo = url;
      const small = loadBtn.querySelector('small'); if (small) small.textContent = tamanho || '';
      if (texto && nome) texto.textContent = `Modelo de projeto: ${nome}. Gire e aproxime para ver como estrutura e instalações se encaixam.`;
      document.getElementById('modelo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      load(url);
    };
  }
})();
