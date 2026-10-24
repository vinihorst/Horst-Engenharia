# Horst Engenharia

Site institucional da Horst Engenharia, escritório de projetos estruturais e complementares em Carlos Barbosa, RS. Publicado pelo GitHub Pages em [www.horst.eng.br](https://www.horst.eng.br/).

O site é um portfólio: a abertura conta, com uma obra em 3D que se constrói conforme a página rola, as etapas de um projeto (fundação, estrutura, instalações e entrega). Depois vêm os serviços, as obras, um modelo 3D real para explorar, o escritório e o contato.

## Estrutura

```
index.html              página única (o <head> segue o SEO.md)
assets/css/site.css     todo o visual: cores, tipografia, layout e responsivo
assets/js/conteudo.js   textos editáveis: números, serviços e obras
assets/js/predio.js     a obra 3D da abertura (three.js)
assets/js/site.js       menu, etapas, obras, animações e visualizador do .glb
assets/fonts/           PP Neue Montreal (fonte da marca)
assets/img/             foto do fundador e símbolo
docs/modelos/           modelos .glb comprimidos usados pelo visualizador (ver MODELOS-3D.md)
docs/identidade-visual/ manual da marca, logos e fontes originais
```

Não há etapa de build: é HTML, CSS e JavaScript puros. As bibliotecas (three.js r128 e GSAP 3.12.5) vêm de CDN com versão fixa.

## Como editar o conteúdo

Quase tudo o que muda com o tempo fica em `assets/js/conteudo.js`, com instruções no topo do arquivo.

- **Números:** só fatos confirmados. Quando houver contagens reais (área projetada, projetos entregues, cidades atendidas), troque os itens.
- **Obras:** a lista começa vazia de propósito, para o site nunca mostrar uma obra que não existe. Enquanto estiver vazia, a seção mostra os tipos de obra que o escritório projeta. Ao adicionar a primeira obra real, a seção passa a mostrar o portfólio. Fotos vão em `assets/img/obras/`.
- **Serviços:** nome e texto de cada serviço.

Textos fixos (abertura, sobre, contato) estão direto no `index.html`. Ao mudar títulos, mantenha um único `h1` e siga o `SEO.md`.

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
- O modelo do visualizador só é baixado quando a seção 3D se aproxima da tela.
