/* Conteúdo editável do site: estudos de caso (OBRAS) e números (NUMEROS).
   Serviços, método e demais textos ficam direto no index.html, para o Google ler sem depender de JavaScript.

   OBRAS: cada item vira um card na seção Projetos e um estudo de caso completo, que abre ao clicar
   (e tem link próprio: horst.eng.br/#projeto-<slug>). Enquanto a lista estiver vazia, a seção mostra os TIPOS.
   Só o nome e o slug são obrigatórios; campos vazios simplesmente não aparecem. Use apenas dados reais.

     {
       slug: 'residencia-exemplo',                 // sem acentos nem espaços; vira o link do estudo de caso
       nome: 'Residência ...',                     // nome ou tipo da obra
       tipo: 'Residencial',                        // Residencial, Multifamiliar, Comercial, Industrial...
       cidade: 'Carlos Barbosa, RS',
       ano: 2025,
       area: '320 m²',
       disciplinas: ['Estrutural', 'Fundações', 'Elétrico', 'Hidrossanitário'],
       sistemaEstrutural: 'Concreto armado moldado no local, lajes ...',
       resumo: 'Uma ou duas frases para o card.',
       desafios: ['Terreno em declive com ...', '...'],
       solucoes: ['Fundação em ...', '...'],
       resultados: ['Característica ou resultado relevante (só se for verificável).'],
       fotos: [{ src: 'assets/img/obras/residencia-exemplo-1.jpg', alt: 'Descrição da foto' }],   // a 1ª é a capa
       antesDepois: { antes: { src: '...', alt: '...' }, depois: { src: '...', alt: '...' } },     // opcional
       modelo: 'docs/modelos/residencia-exemplo.glb', modeloTamanho: '1,4 MB'                      // opcional (ver MODELOS-3D.md)
     }

   Fotos: assets/img/obras/, de preferência 1600 px de largura, proporção 4:3, em .webp ou .jpg comprimido.
   A grade mostra até 8 obras; a ordem da lista é a ordem no site.

   NUMEROS: substituem a faixa de fatos abaixo do topo quando preenchidos. Coloque apenas números conferidos.
     { valor: 45000, sufixo: 'm²', rotulo: 'Área projetada' }     // valor numérico conta do zero ao aparecer */

window.HORST = {
  OBRAS: [],

  NUMEROS: [],

  // Mostrados enquanto OBRAS estiver vazia.
  TIPOS: [
    { nome: 'Residências e sobrados', texto: 'Casas térreas e de dois pavimentos, inclusive em terrenos com declive.' },
    { nome: 'Edifícios residenciais', texto: 'Edifícios multifamiliares com estrutura, fundações e instalações compatibilizadas.' },
    { nome: 'Salas e prédios comerciais', texto: 'Lojas, escritórios e uso misto, com instalações pensadas para a operação.' },
    { nome: 'Pavilhões e galpões', texto: 'Galpões industriais e de armazenagem, com fundação adequada ao solo do terreno.' }
  ]
};
