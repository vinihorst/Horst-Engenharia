/* Obras do portfólio (até 8, em grade). Serviços, números e demais textos ficam direto no index.html.

   Enquanto OBRAS estiver vazia, a seção mostra os TIPOS de obra que o escritório projeta.
   Para publicar uma obra, coloque a foto em assets/img/obras/ (de preferência 1600 px de largura,
   proporção 4:3, em .jpg ou .webp) e adicione um bloco:
     { nome: 'Residência ...', cidade: 'Carlos Barbosa, RS', categoria: 'Residencial',
       foto: 'assets/img/obras/residencia-exemplo.jpg',
       area: '320 m²', ano: 2025,                       (opcionais)
       texto: 'Uma ou duas frases sobre o projeto.' }    (opcional)
   A ordem da lista é a ordem no site. */

window.HORST = {
  OBRAS: [],

  // Mostrados enquanto OBRAS estiver vazia.
  TIPOS: [
    { nome: 'Residências e sobrados', texto: 'Casas térreas e de dois pavimentos, inclusive em terrenos com declive.' },
    { nome: 'Prédios residenciais', texto: 'Edifícios multifamiliares com estrutura, fundação e instalações compatibilizadas.' },
    { nome: 'Salas e prédios comerciais', texto: 'Lojas, escritórios e uso misto, com instalações pensadas para a operação.' },
    { nome: 'Pavilhões e galpões', texto: 'Galpões industriais e de armazenagem, com fundação adequada ao solo do terreno.' }
  ]
};
