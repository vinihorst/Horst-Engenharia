/* Obras do portfólio. Serviços, números e demais textos ficam direto no index.html (melhor para o Google).

   OBRAS começa vazia de propósito, para o site nunca mostrar obra inventada. Enquanto estiver vazia,
   a seção mostra os TIPOS de obra que o escritório projeta. Para publicar uma obra real, adicione um bloco:
     { nome: 'Residência ...', cidade: 'Carlos Barbosa, RS', area: '320 m²', ano: 2025,
       categoria: 'Residencial', desenho: 'casa', pavimentos: 2,
       foto: 'assets/img/obras/nome-da-foto.jpg',   (opcional; substitui o desenho)
       texto: 'Duas ou três frases sobre o desafio técnico e a solução.' }   (opcional)
   desenho pode ser "casa", "predio", "comercial" ou "pavilhao". */

window.HORST = {
  OBRAS: [],

  // Mostrados enquanto OBRAS estiver vazia.
  TIPOS: [
    { nome: 'Residências e sobrados', texto: 'Casas térreas e de dois pavimentos, inclusive em terrenos com declive.', desenho: 'casa', pavimentos: 2 },
    { nome: 'Prédios residenciais', texto: 'Edifícios multifamiliares com estrutura, fundação e instalações compatibilizadas.', desenho: 'predio', pavimentos: 7 },
    { nome: 'Salas e prédios comerciais', texto: 'Lojas, escritórios e uso misto, com instalações pensadas para a operação.', desenho: 'comercial', pavimentos: 3 },
    { nome: 'Pavilhões e galpões', texto: 'Galpões industriais e de armazenagem, com fundação adequada ao solo do terreno.', desenho: 'pavilhao' }
  ]
};
