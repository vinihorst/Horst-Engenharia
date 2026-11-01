/* Páginas de serviço: modelo 3D com a disciplina da página em destaque (assets/js/modelo3d.js). */
(function () {
  'use strict';
  const stage = document.querySelector('.servico-3d .viewer-stage');
  if (!stage || !window.HORST3D) return;
  const nome = stage.querySelector('.viewer-load').textContent.replace(/^Ver\s+/, '').replace(/\s+no modelo 3D.*$/, '');
  window.HORST3D.montar(stage, {
    base: '../',
    foco: stage.dataset.foco,
    focoBtn: stage.querySelector('[data-foco]'),
    perto: '0px 0px 50% 0px',
    rotulo: `Modelo 3D de projeto da Horst Engenharia com ${nome} em destaque e as outras disciplinas translúcidas. Arraste para girar e use a rolagem ou o gesto de pinça para aproximar.`
  });
})();
