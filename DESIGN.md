---
name: Horst Engenharia
description: Site institucional de um escritório de engenharia civil. Projetos estruturais e complementares em BIM, de Carlos Barbosa, RS.
colors:
  deep-green: "#0D3931"
  deep-green-2: "#12463D"
  deep-green-3: "#1A574B"
  deep-foot: "#0A2E28"
  horst-green: "#04B15B"
  light-green: "#0CE273"
  green-dark: "#037443"
  green-head: "#03934C"
  green-tint: "#E1F3E9"
  paper: "#EEF1F0"
  paper-edge: "#E4EAE8"
  white: "#FFFFFF"
  ink-soft: "#24443D"
  muted: "#4E6660"
  line: "#D2DCD9"
  line-strong: "#B9C7C3"
  on-deep-muted: "#A9C2BB"
  on-deep-soft: "#C9DAD5"
  water-blue: "#2A78D2"
  power-amber: "#E0A100"
  sewer-brown: "#7A6553"
typography:
  display:
    fontFamily: "Neue Montreal, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "clamp(2.625rem, 5vw, 4.625rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Neue Montreal, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.625rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Neue Montreal, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 2.6vw, 2.125rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Neue Montreal, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  body-long:
    fontFamily: "Neue Montreal, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  gutter: "20px"
  container: "1280px"
  nav-height: "68px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.light-green}"
    textColor: "{colors.deep-green}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep-green}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-green}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-line-on-deep:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  nav:
    backgroundColor: "{colors.deep-green}"
    textColor: "{colors.white}"
    height: "68px"
  card-obra:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.none}"
  label-eyebrow:
    textColor: "{colors.green-dark}"
    typography: "{typography.label}"
---

# Design System: Horst Engenharia

## Overview

**Creative North Star: "A prancha coordenada"**

O site se comporta como uma prancha de engenharia bem resolvida: fundo claro de papel, traço fino, eixos e cotas, e um único verde que marca o que importa. A peça central é o prédio que se constrói com a rolagem (fundação, estrutura, instalações, entrega), seguido do modelo BIM real em 3D. Tudo o mais é calmo e técnico para que esses dois momentos sejam a prova do trabalho.

A densidade é baixa: blocos largos, muito respiro, linhas de 1px em vez de caixas e sombras. O tom é de escritório técnico sério, não de startup: nada de gradientes chamativos, ícones genéricos ou cards arredondados flutuando. O verde profundo da marca ancora a navegação, a faixa de números, o 3D, o contato e o rodapé; o papel claro carrega o texto.

**Key Characteristics:**
- Papel claro (#EEF1F0) com texto em verde profundo (#0D3931), nunca preto puro.
- Um acento: verde claro (#0CE273) nos botões sobre fundo escuro e verde Horst (#04B15B) nos traços.
- Linhas finas (1px) separam conteúdo; cartões quase não existem.
- Rótulos em IBM Plex Mono maiúsculo, como anotações de prancha.
- Cores de disciplina (água, elétrica, esgoto) só aparecem no prédio e no 3D.

## Colors

Uma família de verdes da marca sobre um papel cinza-esverdeado, com três cores funcionais reservadas às disciplinas.

### Primary
- **Verde profundo Horst** (#0D3931): cor dominante da marca. Texto principal sobre papel e fundo das faixas escuras (navegação, números, 3D, contato).
- **Verde Horst** (#04B15B): traço de marca. Fios dos rótulos, sublinhados, foco do teclado, bordas em hover.
- **Verde claro** (#0CE273): o único preenchimento chamativo. Botões e destaques sobre o verde profundo.

### Secondary
- **Verde de leitura** (#037443): texto verde sobre papel (rótulos, links), onde o verde Horst não passaria no contraste.
- **Verde de título** (#03934C): palavra em destaque dentro dos títulos grandes.
- **Verde névoa** (#E1F3E9): fundo de hover das linhas de serviço.

### Tertiary (disciplinas, só no prédio e no 3D)
- **Azul água fria** (#2A78D2), **Âmbar elétrica** (#E0A100), **Marrom esgoto** (#7A6553).

### Neutral
- **Papel** (#EEF1F0): fundo da página.
- **Borda do papel** (#E4EAE8): fim do gradiente do topo.
- **Branco** (#FFFFFF): cartões, HUD, centro do gradiente do topo.
- **Tinta suave** (#24443D): parágrafos longos do Sobre.
- **Cinza-verde** (#4E6660): texto secundário sobre papel.
- **Linha** (#D2DCD9) e **Linha forte** (#B9C7C3): divisórias e bordas de botão fantasma.
- **Verde profundo 2 e 3** (#12463D, #1A574B): gradiente do palco 3D.
- **Rodapé** (#0A2E28): um tom abaixo do verde profundo, separa o rodapé do contato.
- **Sobre escuro** (#A9C2BB, #C9DAD5): texto secundário sobre verde profundo.

### Named Rules
**The One Accent Rule.** Só o verde claro preenche botões. Nenhuma outra cor ganha área grande fora das faixas de verde profundo.

**The Discipline Color Rule.** Azul, âmbar e marrom pertencem às instalações do prédio e do modelo 3D. Não usar como cor de interface.

**The Token Rule.** Toda cor sólida nova entra como variável em `:root` (assets/css/site.css). Transparências de branco ou verde profundo (rgba) são permitidas para sobreposições.

## Typography

**Display Font:** Neue Montreal (com Helvetica Neue, Arial)
**Body Font:** Neue Montreal
**Label/Mono Font:** IBM Plex Mono 500

**Character:** grotesca neutra e precisa, usada grande e em peso médio, nunca em negrito pesado; o mono faz o papel das anotações e cotas de uma prancha.

### Hierarchy
- **Display** (500, clamp(2.625rem, 5vw, 4.625rem), 1): frases das etapas do topo.
- **Headline** (500, clamp(2.5rem, 5vw, 4.625rem), 0.98): título de cada seção.
- **Title** (500, clamp(1.625rem, 2.6vw, 2.125rem), 1.1): subtítulos das páginas de serviço.
- **Body** (400, 1.0625rem, 1.5): texto corrido. Parágrafos longos em 1.125rem/1.7, até 54ch.
- **Label** (IBM Plex Mono 500, 0.75rem, 0.14em, maiúsculas): rótulos, HUD, legendas, status.

### Named Rules
**The Rem Rule.** Tamanhos de fonte sempre em rem, para respeitar a letra maior que o visitante escolhe no navegador.

**The Medium Weight Rule.** Títulos em 500. O negrito (700) existe na fonte, mas não é usado em títulos.

## Layout

Container de 1280px com margem lateral mínima de 20px (respeitando a área segura do celular). Seções separadas por grandes respiros (até 128px) e por linhas de 1px, não por fundos alternados. O topo é uma seção de 720vh no computador e 440vh no celular, com o prédio fixo enquanto a rolagem avança; com movimento reduzido ou sem WebGL ele vira uma única tela estática com os textos em sequência. O modelo 3D ocupa a largura total. Pontos de quebra: 960px (grades de 4 viram 2) e 860px (menu vira gaveta, layouts viram uma coluna).

## Elevation & Depth

Plano por padrão. A profundidade vem de tons (papel, branco, verde profundo) e de linhas finas, não de sombras. A única sombra é a resposta ao hover dos cards de obra. O HUD usa branco translúcido com desfoque para ficar legível sobre o prédio.

### Shadow Vocabulary
- **Hover de obra** (`box-shadow: 0 18px 40px -24px rgba(13,57,49,.35)`): só no hover de `.obra`, junto com subida de 4px.

### Named Rules
**The Flat-By-Default Rule.** Superfícies não têm sombra em repouso. Se algo precisa se destacar, use borda verde ou o fundo verde profundo.

## Shapes

Duas formas, sem meio-termo: retângulos de canto vivo (0px) para conteúdo (cards, HUD, cartões das subpáginas, palco 3D) e pílulas (999px) para tudo que se clica (botões, botões do 3D, chips de disciplina, menu). O símbolo da marca (grade 3x3) é a única forma decorativa.

## Components

### Buttons
- **Shape:** pílula (999px).
- **Primary:** verde claro (#0CE273) com texto verde profundo, 14px 22px, peso 500.
- **Hover / Focus:** sobe 2px e fica branco; foco com contorno verde Horst de 2px e 3px de afastamento.
- **Ghost (sobre papel):** transparente, borda de 1.5px na linha forte; hover fica branco com borda verde.
- **Line (sobre verde profundo):** transparente, texto branco, borda branca a 50%; hover com borda verde claro.

### Chips (disciplinas do 3D)
- **Style:** pílula sobre o palco escuro, com uma bolinha da cor da disciplina.
- **State:** `aria-pressed` liga e desliga a disciplina; desligado fica sem fundo, com borda tracejada e bolinha apagada.

### Cards / Containers
- **Corner Style:** canto vivo (0px).
- **Background:** branco sobre papel, ou verde profundo nas faixas escuras.
- **Shadow Strategy:** nenhuma em repouso (ver Elevation).
- **Border:** 1px na cor linha; verde no hover.

### Navigation
- Barra fixa de 68px em verde profundo, links brancos 0.9375rem com sublinhado verde claro que cresce no hover, botão "Fale conosco" em pílula verde claro. Abaixo de 860px vira gaveta de tela cheia.

### Rótulo (eyebrow)
- IBM Plex Mono em maiúsculas, 0.75rem, verde de leitura, precedido por um fio verde de 28px. Usado com parcimônia, só onde ajuda a orientar.

### Prédio da abertura (assinatura)
- Cena three.js que se constrói com a rolagem em quatro etapas, com HUD de etapa e porcentagem. Desenha só quando algo muda. Não alterar sem pedido do dono.

### Visualizador 3D (assinatura)
- Palco em largura total com gradiente de verde profundo, modelo .glb com Draco, botões "Reiniciar vista" e "Tela cheia", chips de disciplina. Começa a carregar quando a seção se aproxima. No celular, o giro só liga depois de um toque. Código em assets/js/modelo3d.js. Nas páginas de serviço aparece com a disciplina da página em destaque e as outras translúcidas (opacidade 0.1), com o botão "Modelo completo".

## Do's and Don'ts

### Do:
- **Do** usar verde profundo (#0D3931) para texto e faixas escuras, e papel (#EEF1F0) como fundo.
- **Do** separar conteúdo com linhas de 1px (#D2DCD9) e espaço, não com sombras.
- **Do** manter botões em pílula e conteúdo em canto vivo.
- **Do** declarar toda cor nova como variável em `:root` e todo tamanho de fonte em rem.
- **Do** manter área de toque de pelo menos 44px nos links (padding com margem negativa, se o visual não puder mudar).

### Don't:
- **Don't** citar normas técnicas (NBR), número do CREA, "Serra Gaúcha" ou responsável técnico (RT) em nenhum texto.
- **Don't** criar formulários de orçamento ou contadores de volume de concreto: o site é portfólio, não captação.
- **Don't** inventar obras ou números; só mostrar dados reais confirmados.
- **Don't** usar azul, âmbar ou marrom fora do prédio e do 3D.
- **Don't** usar títulos em negrito pesado, cantos arredondados em cards ou sombras em repouso.
