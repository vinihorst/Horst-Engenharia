# Gera as páginas de serviço (projeto-estrutural/, projeto-de-fundacoes/, projeto-eletrico/, projeto-hidrossanitario/).
# Uso: python3 scripts/gerar-paginas-servicos.py .   (a partir da raiz do repositório)

import json, os, sys, html

ROOT = sys.argv[1]
BASE = "https://horst.eng.br/"
WA = "https://wa.me/5554991563456?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Horst%20Engenharia."
SYM = '<svg width="{s}" height="{s}" viewBox="0 0 3 3" aria-hidden="true"><rect width="1" height="1" fill="#04B15B"/><polygon points="1,1 2,0 3,0 3,1" fill="#0CE273"/><polygon points="0,2 1,1 1,3 0,3" fill="#04B15B"/><rect x="2" y="2" width="1" height="1" fill="#0CE273"/></svg>'

PAGES = [
  {
    "slug": "projeto-estrutural",
    "id": "servico-estrutural",
    "nome": "Projeto estrutural",
    "title": "Projeto estrutural em concreto armado | Horst Engenharia",
    "desc": "Projeto estrutural e cálculo estrutural em concreto armado para residências, edifícios e obras comerciais, desenvolvido em BIM por engenheiro civil. Escritório em Carlos Barbosa (RS).",
    "serviceType": "Projeto estrutural em concreto armado",
    "h1": "Projeto estrutural",
    "lead": "Cálculo e detalhamento da estrutura em concreto armado para residências, edifícios e edificações comerciais, concebidos junto com a arquitetura e as instalações.",
    "secoes": [
      ("O que é o projeto estrutural", [
        "O projeto estrutural define como a edificação se sustenta: a posição e as dimensões de pilares, vigas, lajes, escadas e fundações, e as armaduras de cada peça. É ele que garante que a obra seja segura, que use concreto e aço na medida certa e que possa ser executada sem improvisos no canteiro.",
        "Na Horst Engenharia, o cálculo estrutural é feito por engenheiro civil sobre um modelo BIM, o mesmo modelo onde são desenvolvidos os projetos elétrico e hidrossanitário. Assim, a estrutura já nasce compatibilizada com as instalações.",
      ]),
    ],
    "escopo_titulo": "O que o serviço inclui",
    "escopo": [
      ("Concepção estrutural", "Definição do sistema e da posição dos elementos a partir do projeto arquitetônico."),
      ("Lançamento e análise", "Modelagem da estrutura e verificação do seu comportamento sob as cargas previstas."),
      ("Dimensionamento", "Pilares, vigas, lajes e escadas dimensionados para o uso da edificação."),
      ("Fundações", "Solução de fundação integrada às cargas calculadas no mesmo modelo."),
      ("Detalhamento executivo", "Plantas de forma e de armaduras organizadas para a leitura na obra."),
      ("Quantitativos", "Concreto e aço extraídos do modelo, para orçamento e compras."),
    ],
    "faq": [
      ("Quando contratar o projeto estrutural?", "O ideal é desde o estudo preliminar da arquitetura. Nessa fase ainda é possível ajustar vãos e posições de pilares sem custo, e a estrutura pode ser pensada junto com o projeto arquitetônico em vez de adaptada depois."),
      ("Que tipo de obra vocês projetam?", "Residências térreas e sobrados, prédios residenciais, salas e edificações comerciais, em concreto armado."),
      ("O projeto estrutural inclui a fundação?", "A fundação é dimensionada a partir das cargas calculadas no mesmo modelo da estrutura e do laudo de sondagem do terreno. Veja também o <a href=\"../projeto-de-fundacoes/\">projeto de fundações</a>."),
      ("Vocês atendem obras fora de Carlos Barbosa?", "Sim. O escritório fica em Carlos Barbosa (RS), e fazemos projetos para obras em várias cidades."),
    ],
  },
  {
    "slug": "projeto-de-fundacoes",
    "id": "servico-fundacoes",
    "nome": "Projeto de fundações",
    "title": "Projeto de fundações: sapatas, estacas e radier | Horst Engenharia",
    "desc": "Projeto de fundações definido pela sondagem do terreno e pelas cargas da estrutura: sapatas, estacas ou radier, inclusive em terrenos em declive. Engenheiro civil em Carlos Barbosa (RS).",
    "serviceType": "Projeto de fundações",
    "h1": "Projeto de fundações",
    "lead": "A solução de fundação definida pelo solo do terreno e pelas cargas reais da estrutura, calculadas no mesmo modelo.",
    "secoes": [
      ("Fundação escolhida pelo solo, não pelo hábito", [
        "A fundação é a parte da obra que leva as cargas da edificação até o solo. Escolher o tipo certo depende de conhecer o terreno: por isso o projeto parte do laudo de sondagem e das cargas que chegam de cada pilar, calculadas no modelo estrutural.",
        "Avaliamos sapatas, estacas ou radier e indicamos a solução mais adequada ao solo e à obra, inclusive em terrenos em declive, com cortes ou muros de arrimo. Quando ainda não há sondagem, orientamos a quantidade e a posição dos furos.",
      ]),
    ],
    "escopo_titulo": "O que o serviço inclui",
    "escopo": [
      ("Análise da sondagem", "Interpretação do laudo e das características do solo do terreno."),
      ("Escolha da solução", "Comparação entre sapatas, estacas e radier para o solo e a obra."),
      ("Dimensionamento", "Elementos de fundação dimensionados a partir das cargas do modelo estrutural."),
      ("Detalhamento", "Plantas de locação, formas e armaduras para a execução."),
    ],
    "faq": [
      ("Preciso de sondagem para o projeto de fundações?", "Sim, a sondagem é o que mostra como o solo se comporta. Se ainda não houver, orientamos quantos furos fazer e onde."),
      ("Vocês fazem fundação em terreno com declive?", "Sim, inclusive com cortes, aterros e muros de arrimo."),
      ("A fundação é feita junto com o projeto estrutural?", "Sim. As cargas vêm do mesmo modelo do <a href=\"../projeto-estrutural/\">projeto estrutural</a>, o que mantém os dois projetos coerentes."),
    ],
  },
  {
    "slug": "projeto-eletrico",
    "id": "servico-eletrico",
    "nome": "Projeto elétrico",
    "title": "Projeto elétrico residencial e comercial | Horst Engenharia",
    "desc": "Projeto elétrico e de instalações elétricas para residências, prédios e obras comerciais: entrada de energia, quadros, circuitos, iluminação, tomadas e rede. Engenheiro civil em Carlos Barbosa (RS).",
    "serviceType": "Projeto de instalações elétricas",
    "h1": "Projeto elétrico",
    "lead": "Circuitos, quadros e entrada de energia dimensionados para o uso real da edificação, com espaço para crescer.",
    "secoes": [
      ("Instalação elétrica pensada a partir do uso", [
        "Planejamos a instalação elétrica a partir de como a edificação vai ser usada: chuveiros, ar-condicionado, cozinha, oficina ou máquinas. Com isso dimensionamos circuitos, condutores e proteções e deixamos o quadro preparado para ampliações, como carregador de carro elétrico ou placas solares.",
        "O projeto elétrico é modelado em BIM junto com a estrutura. O trajeto de eletrodutos e a posição de quadros são verificados em relação a lajes, vigas e pilares, o que evita quebra-quebra e furos improvisados na obra.",
      ]),
    ],
    "escopo_titulo": "O que o serviço inclui",
    "escopo": [
      ("Entrada de energia", "Projeto da entrada de energia para aprovação na concessionária."),
      ("Quadros e circuitos", "Divisão de circuitos, condutores e proteções dimensionados para as cargas."),
      ("Iluminação e tomadas", "Pontos distribuídos conforme o uso de cada ambiente."),
      ("Rede e câmeras", "Infraestrutura de internet, rede de dados e câmeras."),
      ("Previsão de ampliações", "Quadro preparado para carregador de carro elétrico ou energia solar."),
      ("Compatibilização", "Eletrodutos e quadros verificados com a estrutura no mesmo modelo."),
    ],
    "faq": [
      ("O projeto elétrico é necessário para ligar a energia?", "Para a ligação nova, a concessionária pede o projeto da entrada de energia. O projeto completo também orienta o eletricista e evita circuitos sobrecarregados."),
      ("Dá para prever carregador de carro elétrico e placas solares?", "Sim. Deixamos o quadro e a infraestrutura preparados, mesmo que a instalação seja feita depois."),
      ("Vocês fazem o projeto elétrico junto com os outros projetos?", "Sim. Estrutural, elétrico e <a href=\"../projeto-hidrossanitario/\">hidrossanitário</a> são desenvolvidos sobre o mesmo modelo, já compatibilizados."),
    ],
  },
  {
    "slug": "projeto-hidrossanitario",
    "id": "servico-hidrossanitario",
    "nome": "Projeto hidrossanitário",
    "title": "Projeto hidrossanitário: hidráulico e sanitário | Horst Engenharia",
    "desc": "Projeto hidrossanitário (projeto hidráulico e sanitário): água fria e quente, esgoto e águas pluviais, compatibilizados com a estrutura em BIM. Engenheiro civil em Carlos Barbosa (RS).",
    "serviceType": "Projeto de instalações hidrossanitárias",
    "h1": "Projeto hidrossanitário",
    "lead": "Projeto hidráulico e sanitário da edificação: água fria e quente, esgoto e águas pluviais como um sistema único, coordenado com a estrutura.",
    "secoes": [
      ("Hidráulica e esgoto como um sistema só", [
        "O projeto hidrossanitário reúne o projeto hidráulico (água fria e quente) e o projeto sanitário (esgoto e ventilação), além das águas pluviais. Reservatórios e tubulações são dimensionados para garantir pressão no último ponto de consumo e água quente com pouca espera, seja com aquecedor a gás, elétrico ou solar.",
        "No esgoto, ventilação e caixas de inspeção bem posicionadas evitam mau cheiro e facilitam a manutenção. Quando o cliente quiser, incluímos o aproveitamento da água da chuva. Prumadas, shafts, rebaixos e furos em vigas e lajes são definidos no modelo BIM, não improvisados no canteiro.",
      ]),
    ],
    "escopo_titulo": "O que o serviço inclui",
    "escopo": [
      ("Água fria", "Reservatórios, alimentação e distribuição com pressão adequada em todos os pontos."),
      ("Água quente", "Sistema a gás, elétrico ou solar, com tubulação pensada para pouca espera."),
      ("Esgoto sanitário", "Tubulações, ventilação e caixas de inspeção."),
      ("Águas pluviais", "Captação e condução da água da chuva, com opção de aproveitamento."),
      ("Prumadas e shafts", "Passagens verticais e horizontais definidas junto com a estrutura."),
      ("Compatibilização", "Furos e rebaixos em vigas e lajes resolvidos no modelo."),
    ],
    "faq": [
      ("Qual a diferença entre projeto hidráulico, sanitário e hidrossanitário?", "O hidráulico trata da água fria e quente; o sanitário trata do esgoto. O hidrossanitário reúne os dois, e normalmente também as águas pluviais."),
      ("Vocês projetam aproveitamento da água da chuva?", "Sim, quando o cliente quiser, para usos como rega e descargas."),
      ("O projeto hidrossanitário é compatibilizado com a estrutura?", "Sim. É modelado junto com o <a href=\"../projeto-estrutural/\">projeto estrutural</a>, então as passagens de tubulação em vigas e lajes já ficam previstas."),
    ],
  },
]

def e(s): return html.escape(s, quote=True)

def page(p):
    url = BASE + p["slug"] + "/"
    others = [q for q in PAGES if q is not p]
    ld = {
      "@context": "https://schema.org",
      "@graph": [
        {"@type": "Service", "@id": BASE + "#" + p["id"], "name": p["nome"], "serviceType": p["serviceType"],
         "url": url, "description": p["desc"], "provider": {"@id": BASE + "#empresa"}},
        {"@type": "WebPage", "@id": url + "#pagina", "url": url, "name": p["title"], "inLanguage": "pt-BR",
         "isPartOf": {"@id": BASE + "#site"}, "about": {"@id": BASE + "#" + p["id"]},
         "breadcrumb": {"@id": url + "#trilha"}},
        {"@type": "BreadcrumbList", "@id": url + "#trilha", "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Horst Engenharia", "item": BASE},
          {"@type": "ListItem", "position": 2, "name": "Serviços", "item": BASE + "#servicos"},
          {"@type": "ListItem", "position": 3, "name": p["nome"], "item": url}]},
      ]}
    secoes = "".join(
        f'<h2>{e(t)}</h2>' + "".join(f"<p>{e(x)}</p>" for x in ps) for t, ps in p["secoes"])
    escopo = "".join(f"<li><strong>{e(a)}</strong>{e(b)}</li>" for a, b in p["escopo"])
    faq = "".join(f"<details><summary>{e(q)}</summary><p>{a}</p></details>" for q, a in p["faq"])
    outros = "".join(f'<li><a href="../{q["slug"]}/">{e(q["nome"])}</a></li>' for q in others)
    return f'''<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{e(p["title"])}</title>
  <meta name="description" content="{e(p["desc"])}">
  <link rel="canonical" href="{url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0D3931">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Horst Engenharia">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{e(p["title"])}">
  <meta property="og:description" content="{e(p["lead"])}">
  <meta property="og:image" content="{BASE}docs/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Página gerada para SEO a partir do serviço "{p["nome"]}" da página inicial. Ao mudar o texto lá, atualize aqui também (ver SEO.md). -->
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>

  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="icon" type="image/png" href="../docs/icon.png">
  <link rel="apple-touch-icon" href="../docs/icon.png">
  <link rel="preload" href="../assets/fonts/PPNeueMontreal-Book.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../assets/css/site.css">
  <link rel="stylesheet" href="../assets/css/servico.css">
</head>

<body class="pagina-servico">
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>

  <header class="nav gutter">
    <div class="wrap nav-in">
      <a class="brand" href="../" aria-label="Horst Engenharia, página inicial">
        {SYM.format(s=30)}
        Horst Engenharia
      </a>
      <nav class="nav-links" aria-label="Principal"><a href="../#sobre">Sobre</a><a href="../#servicos">Serviços</a><a href="../#metodo">Método</a><a href="../#modelo">Modelo 3D</a><a href="../#obras">Projetos</a></nav>
      <a class="nav-cta" href="#contato">Fale conosco</a>
    </div>
  </header>

  <main id="conteudo" class="gutter">
    <div class="wrap servico">
      <nav class="trilha" aria-label="Você está em"><a href="../">Início</a><span aria-hidden="true">/</span><a href="../#servicos">Serviços</a><span aria-hidden="true">/</span><span aria-current="page">{e(p["nome"])}</span></nav>

      <span class="eyebrow">Serviço · Projetos em BIM</span>
      <h1>{e(p["h1"])}</h1>
      <p class="servico-lead">{e(p["lead"])}</p>

      <div class="servico-corpo">
        <article class="servico-texto">
          {secoes}
          <h2>{e(p["escopo_titulo"])}</h2>
          <ul class="escopo" role="list">{escopo}</ul>
          <h2>Perguntas frequentes</h2>
          <div class="faq">{faq}</div>
        </article>

        <aside class="servico-lado">
          <div class="servico-cartao" id="contato">
            <h2>Fale com o engenheiro</h2>
            <p>Vinícius Andrei Horst, engenheiro civil. Escritório em Carlos Barbosa (RS), com projetos para obras em várias cidades.</p>
            <a class="btn" href="{WA}" target="_blank" rel="noopener">Conversar no WhatsApp</a>
            <p class="servico-contato"><a href="tel:+5554991563456">(54) 9 9156-3456</a><br><a href="mailto:horstengenharia@outlook.com">horstengenharia@outlook.com</a></p>
          </div>
          <div class="servico-outros">
            <h2>Outros projetos</h2>
            <ul role="list">{outros}<li><a href="../#servicos">Todos os serviços</a></li></ul>
          </div>
        </aside>
      </div>
    </div>
  </main>

  <footer class="site-foot gutter">
    <div class="wrap site-foot-in">
      <a class="brand" href="../" aria-label="Horst Engenharia, página inicial">
        {SYM.format(s=34)}
        <span>Horst Engenharia<small>Soluções de engenharia, priorizando a boa execução.</small></span>
      </a>
      <nav class="foot-links" aria-label="Rodapé"><a href="../#servicos">Serviços</a><a href="../#metodo">Método BIM</a><a href="../#modelo">Modelo 3D</a><a href="../#obras">Projetos</a><a href="../#contato">Contato</a><a href="https://www.instagram.com/horst.eng" target="_blank" rel="noopener">Instagram</a></nav>
      <p class="foot-copy">© 2026 Horst Engenharia · Eng. civil Vinícius Andrei Horst · Rua Elisa Tramontina, 338, Sala 302 – Centro, Carlos Barbosa – RS, 95185-000</p>
    </div>
  </footer>
</body>

</html>
'''

for p in PAGES:
    d = os.path.join(ROOT, p["slug"])
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(page(p))
    print("ok", p["slug"])
