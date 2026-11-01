/* Visualizador do modelo .glb (comprimido com Draco), usado na página inicial e nas páginas de serviço.
   HORST3D.montar(palco, opções) liga um .viewer-stage e devolve { load(url) }.
   Opções:
     base      caminho até a raiz do site ('./' na inicial, '../' nas subpáginas)
     camadas   elemento onde ficam os botões de disciplina (opcional)
     foco      id da disciplina em destaque; as outras ficam translúcidas (opcional)
     focoBtn   botão que alterna entre destaque e modelo completo (opcional)
     deslocar  em telas largas, desloca o centro da vista para a direita (texto sobre a esquerda do palco)
     perto     rootMargin para começar a baixar antes de a seção aparecer
   O three.js é carregado aqui mesmo se a página ainda não o tiver. */
(function () {
  'use strict';
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const script = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });

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

  function montar(stage, o) {
    o = o || {};
    const base = o.base || './', VEN = base + 'assets/vendor/three-r128/';
    const loadBtn = stage.querySelector('.viewer-load');
    const status = stage.querySelector('.viewer-status'), progressBox = stage.querySelector('.viewer-progress'), progress = progressBox.querySelector('b'), poster = stage.querySelector('.viewer-poster');
    const tools = stage.querySelector('.viewer-tools');
    let ready = null, view = null, pending = null, current = null;

    const prepare = () => ready || (ready = (async () => {
      if (!window.THREE) await script(VEN + 'three.min.js');
      await Promise.all([script(VEN + 'OrbitControls.js'), script(VEN + 'GLTFLoader.js'), script(VEN + 'DRACOLoader.js')]);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute('aria-label', o.rotulo || 'Modelo 3D de projeto da Horst Engenharia, com estrutura, fundação e instalações. Arraste para girar e use a rolagem ou o gesto de pinça para aproximar.');
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
      draco.setDecoderPath(VEN + 'draco/');
      const loader = new THREE.GLTFLoader();
      loader.setDRACOLoader(draco);
      // Desenha só enquanto o modelo se move (giro, zoom, inércia, botões); parado, a placa de vídeo descansa.
      let visible = true, looping = false, dirty = true, quietos = 0;
      const render = () => {
        if (!visible) { looping = false; return; }
        const mexeu = controls.update();
        if (mexeu || dirty) { renderer.render(scene, camera); dirty = false; quietos = 0; }
        else if (++quietos > 20) { looping = false; return; }
        requestAnimationFrame(render);
      };
      const loop = () => { if (visible && !looping) { looping = true; quietos = 0; requestAnimationFrame(render); } };
      const redraw = () => { dirty = true; loop(); };
      const fit = () => { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; if (o.deslocar && w >= 860) camera.setViewOffset(w, h, -w * 0.12, 0, w, h); else camera.clearViewOffset(); camera.updateProjectionMatrix(); redraw(); };
      controls.addEventListener('start', redraw);
      controls.addEventListener('change', redraw);
      new ResizeObserver(fit).observe(stage);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible && toque) travar(true); redraw(); }).observe(stage);
      view = { renderer, scene, camera, controls, loader, fit, loop, redraw, travar: toque ? travar : null, model: null, home: null };
      tools.querySelector('[data-reset]').addEventListener('click', () => { if (view.home) { camera.position.copy(view.home); controls.target.set(0, 0, 0); redraw(); } });
      tools.querySelector('[data-full]').addEventListener('click', () => { if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {}); });
    })());

    function botoes(grupos) {
      const box = o.camadas;
      if (!box) return;
      const presentes = DISC.filter(d => grupos[d.id]);
      box.innerHTML = '';
      box.hidden = presentes.length < 2;
      presentes.forEach(d => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-pressed', 'true'); b.style.setProperty('--c', d.cor);
        b.innerHTML = `<i aria-hidden="true"></i>${d.nome}`;
        b.addEventListener('click', () => {
          const on = b.getAttribute('aria-pressed') !== 'true';
          b.setAttribute('aria-pressed', String(on));
          grupos[d.id].forEach(m => { m.visible = on; });
          if (view) view.redraw();
        });
        box.appendChild(b);
      });
    }

    // Destaque de uma disciplina: as outras recebem um material translúcido, como um desenho em segundo plano.
    function destacar(grupos) {
      if (!o.foco || !grupos[o.foco]) { if (o.focoBtn) o.focoBtn.hidden = true; return; }
      const fantasmas = new Map(), outras = [];
      Object.keys(grupos).forEach(id => { if (id !== o.foco) grupos[id].forEach(m => outras.push(m)); });
      const fantasma = mat => {
        if (!fantasmas.has(mat)) {
          const f = mat.clone();
          f.transparent = true; f.opacity = 0.1; f.depthWrite = false;
          fantasmas.set(mat, f);
        }
        return fantasmas.get(mat);
      };
      const original = new Map(outras.map(m => [m, m.material]));
      const aplicar = on => {
        outras.forEach(m => { m.material = on ? fantasma(original.get(m)) : original.get(m); m.renderOrder = on ? 1 : 0; });
        if (o.focoBtn) { o.focoBtn.setAttribute('aria-pressed', String(!on)); }
        if (view) view.redraw();
      };
      aplicar(true);
      if (o.focoBtn) {
        o.focoBtn.hidden = false;
        o.focoBtn.onclick = () => aplicar(o.focoBtn.getAttribute('aria-pressed') === 'true');
      }
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
        if (view.model) { scene.remove(view.model); view.model.traverse(m => { if (m.geometry) m.geometry.dispose(); }); }
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);
        try { const grupos = separar(model); botoes(grupos); destacar(grupos); } catch (e) { if (o.camadas) o.camadas.hidden = true; }
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
    // Começa a baixar quando o palco se aproxima da tela, sem gastar dados de quem não chega até ele.
    // Com economia de dados ligada, espera o clique no botão.
    const economia = navigator.connection && navigator.connection.saveData;
    const cedo = () => load(stage.dataset.modelo);
    if (!economia) {
      if ('IntersectionObserver' in window) {
        const perto = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { perto.disconnect(); cedo(); } }, { rootMargin: o.perto || '0px' });
        const agendar = () => perto.observe(stage);
        if (document.readyState === 'complete') agendar(); else window.addEventListener('load', agendar, { once: true });
      } else window.addEventListener('load', cedo, { once: true });
    }
    return { load };
  }

  window.HORST3D = { montar };
})();
