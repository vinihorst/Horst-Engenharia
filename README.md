# Horst Engenharia

Site institucional da Horst Engenharia, escritório de projetos estruturais e complementares em Carlos Barbosa, RS. Publicado pelo GitHub Pages em [horst.eng.br](https://horst.eng.br/).

O site é a apresentação institucional do escritório: a abertura conta, com uma obra em 3D que se constrói conforme a página rola, as etapas de um projeto (fundação, estrutura, instalações e entrega). Depois vêm o escritório, os serviços, o método de trabalho em BIM, um modelo 3D real para explorar, a seção para arquitetos, construtoras e proprietários, os projetos (estudos de caso) e o contato.

## Estrutura

```
index.html              página única (o <head> segue o SEO.md)
assets/css/site.css     todo o visual: cores, tipografia, layout e responsivo
assets/js/conteudo.js   estudos de caso e números (editável)
assets/js/predio.js     a obra 3D da abertura (three.js)
assets/js/site.js       menu, etapas, obras, animações e visualizador do .glb
assets/fonts/           PP Neue Montreal (fonte da marca) e IBM Plex Mono (rótulos; licença OFL)
assets/img/             foto do fundador e símbolo
docs/modelos/           modelos .glb comprimidos usados pelo visualizador (ver MODELOS-3D.md)
docs/identidade-visual/ manual da marca, logos e fontes originais
```

Não há etapa de build: é HTML, CSS e JavaScript puros. A única biblioteca é o three.js r128, de CDN com versão fixa. Ao mudar CSS ou JS, troque o `?v=` dos três arquivos no `index.html` para o navegador não misturar versões antigas em cache.

## Como editar o conteúdo

- **Textos e serviços** ficam direto no `index.html`, para o Google ler sem depender de JavaScript. Ao mudar títulos, mantenha um único `h1` e siga o `SEO.md`. Cada serviço tem um resumo (`.curto`, mostrado no celular) e o texto completo (`.completo`).
- **Obras (estudos de caso)** ficam em `OBRAS`, em `assets/js/conteudo.js`, com o modelo completo no topo: tipo, local, área, disciplinas, sistema estrutural, desafios, soluções, resultados, fotos, antes/depois e modelo 3D. Cada obra vira um card e um estudo de caso que abre na própria página (com link `#projeto-<slug>`); campos vazios não aparecem. Enquanto a lista estiver vazia, a seção mostra os tipos de edificação. Fotos vão em `assets/img/obras/` (de preferência 1600 px de largura, proporção 4:3).
- **Números** da faixa verde ficam no `index.html`: cada um conta do zero até o valor de `data-alvo`; para mudar, troque o `data-alvo` e o texto dentro do `span.count`.

## Ver no computador

Os modelos 3D precisam ser servidos por HTTP, então abra por um servidor local em vez de clicar duas vezes no arquivo:

```bash
python3 -m http.server 8000
# e abra http://localhost:8000
```

## Marca

Cores, fontes e uso do símbolo estão em [docs/identidade-visual](docs/identidade-visual/README.md). Verde-escuro `#0D3931`, verde Horst `#04B15B` e verde-claro `#0CE273`.

A PP Neue Montreal é uma fonte comercial da Pangram Pangram. Antes de manter o site no ar com ela, confirme que a licença cobre uso web (webfont); se não cobrir, troque as quatro `@font-face` do `site.css` por uma fonte livre parecida, como a Inter.

## Acessibilidade e desempenho

- A animação 3D respeita "reduzir movimento" do sistema e pausa quando sai da tela ou a aba fica em segundo plano.
- Sem JavaScript, a página mostra todos os textos em sequência.
- O modelo do visualizador começa a baixar logo depois que a página termina de carregar (navegador ocioso), sem atrasar a abertura.
- No computador, o fim da abertura segura o prédio pronto na tela por um trecho de rolagem (`END` em `predio.js`).
- As fontes são servidas pelo próprio site (sem Google Fonts), e as revelações ao rolar usam só CSS e `IntersectionObserver`.
