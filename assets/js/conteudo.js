/* Conteúdo editável do site. Tudo o que aparece em Números, Serviços e Obras sai daqui.

   NÚMEROS: só fatos confirmados. Quando houver contagens reais (área projetada, projetos entregues,
   cidades atendidas), troque ou acrescente itens no mesmo formato:  { valor: '150', sufixo: '+', rotulo: 'Projetos entregues' }

   OBRAS: começa vazia de propósito, para o site nunca mostrar obra inventada. Enquanto estiver vazia,
   a seção mostra os TIPOS de obra que o escritório projeta. Para publicar uma obra real, adicione um bloco:
     { nome: 'Residência ...', cidade: 'Carlos Barbosa, RS', area: '320 m²', ano: 2025,
       categoria: 'Residencial', desenho: 'casa', pavimentos: 2,
       foto: 'assets/img/obras/nome-da-foto.jpg',   (opcional; substitui o desenho)
       texto: 'Duas ou três frases sobre o desafio técnico e a solução.' }   (opcional)
   desenho pode ser "casa", "predio", "comercial" ou "pavilhao". */

window.HORST = {
  NUMEROS: [
    { valor: '2022', rotulo: 'Ano de fundação, em Carlos Barbosa' },
    { valor: '4', rotulo: 'Disciplinas de projeto no mesmo escritório' },
    { valor: '3D', rotulo: 'Todo projeto modelado antes da obra' },
    { valor: 'ART', rotulo: 'Responsabilidade técnica registrada em cada projeto' }
  ],

  SERVICOS: [
    {
      icone: 'est',
      nome: 'Projeto estrutural',
      texto: 'Dimensionamos a estrutura de concreto armado de casas, sobrados, prédios residenciais e edificações comerciais. O projeto define pilares, vigas, lajes e escadas com o menor consumo de concreto e aço que a segurança permite. Entregamos plantas de forma, detalhamento de armaduras e quantitativos de material, o que ajuda o construtor a orçar a obra com precisão.'
    },
    {
      icone: 'fun',
      nome: 'Projeto de fundação',
      texto: 'A fundação é escolhida a partir do solo do terreno, não do hábito. Interpretamos o laudo de sondagem do terreno e definimos a solução mais adequada: sapatas, estacas ou radier. No relevo acidentado da Serra Gaúcha isso inclui terrenos em declive, cortes e muros de arrimo. Quando ainda não há sondagem, orientamos quantos furos fazer e onde.'
    },
    {
      icone: 'ele',
      nome: 'Projeto elétrico',
      texto: 'Planejamos a instalação elétrica a partir de como a edificação vai ser usada: chuveiros, ar-condicionado, cozinha, oficina ou máquinas. Com isso dimensionamos circuitos, cabos e proteções e deixamos o quadro com espaço para o que vier depois, como carregador de carro elétrico ou placas solares. O projeto inclui a entrada de energia aprovada na concessionária, iluminação, tomadas e a infraestrutura de internet, rede e câmeras. Como é desenhado sobre o mesmo modelo da estrutura, cada eletroduto já tem passagem prevista em lajes e vigas.'
    },
    {
      icone: 'hid',
      nome: 'Projeto hidrossanitário',
      texto: 'Projetamos água fria e quente, esgoto e água da chuva como um sistema só. Reservatórios e tubulações são dimensionados para garantir pressão no último chuveiro e água quente sem espera, seja com aquecedor a gás, elétrico ou solar. No esgoto, ventilação e caixas de inspeção bem posicionadas evitam mau cheiro e facilitam a manutenção. Quando o cliente quiser, incluímos reaproveitamento da água da chuva para rega e descargas. Furos e rebaixos em vigas e lajes ficam definidos no projeto, não improvisados no canteiro.'
    },
    {
      icone: 'reg',
      nome: 'Regularização de obras',
      texto: 'Regularizamos imóveis construídos sem projeto aprovado ou com ampliações não averbadas. Fazemos o levantamento do que existe, os desenhos técnicos, a ART e o encaminhamento na prefeitura de Carlos Barbosa ou da cidade do imóvel até o habite-se e a averbação no registro de imóveis. Um imóvel regular pode ser financiado, vendido e segurado sem pendências.'
    },
    {
      icone: 'ass',
      nome: 'Assessoria técnica',
      texto: 'Atendemos quem precisa de uma avaliação de engenharia fora de um projeto completo: vistorias, análise de viabilidade de reforma ou ampliação e acompanhamento de obra. Também revisamos projetos de terceiros a pedido de construtoras e compradores.'
    }
  ],

  OBRAS: [],

  // Mostrados enquanto OBRAS estiver vazia.
  TIPOS: [
    { nome: 'Residências e sobrados', texto: 'Casas térreas e de dois pavimentos, inclusive em terrenos com declive.', desenho: 'casa', pavimentos: 2 },
    { nome: 'Prédios residenciais', texto: 'Edifícios multifamiliares com estrutura, fundação e instalações compatibilizadas.', desenho: 'predio', pavimentos: 7 },
    { nome: 'Salas e prédios comerciais', texto: 'Lojas, escritórios e uso misto, com instalações pensadas para a operação.', desenho: 'comercial', pavimentos: 3 },
    { nome: 'Pavilhões e galpões', texto: 'Galpões industriais e de armazenagem, com fundação adequada ao solo do terreno.', desenho: 'pavilhao' }
  ]
};
