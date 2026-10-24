# SEO – Horst Engenharia

Regras para manter o SEO do site ao editar ou redesenhar páginas.

## O que já está no site

- `<head>` do `index.html`: título, descrição, canonical, Open Graph (prévia no WhatsApp/Instagram/LinkedIn) e dados estruturados JSON-LD (`ProfessionalService` + `Person` + `WebSite`).
- `robots.txt` e `sitemap.xml` na raiz.
- `CNAME` com `www.horst.eng.br` (domínio próprio no GitHub Pages).
- `docs/og-image.jpg` (1200×630): imagem que aparece quando o link é compartilhado.

**No redesign, copie o bloco `<head>` inteiro** (do `<title>` até o fim do `<script type="application/ld+json">`). Se mudar endereço, telefone ou serviços, atualize também o JSON-LD.

## Palavras-chave alvo

Foco em busca local (Serra Gaúcha), porque é assim que clientes e arquitetos procuram:

| Principal | Variações |
| --- | --- |
| projeto estrutural Carlos Barbosa | engenheiro estrutural Serra Gaúcha, cálculo estrutural RS |
| projeto de fundação | fundações, sondagem e fundação |
| projeto elétrico / hidrossanitário | projetos complementares, PPCI (se oferecido) |
| regularização de obra Carlos Barbosa | regularização de imóvel, habite-se |
| engenheiro civil Carlos Barbosa | escritório de engenharia Garibaldi, Bento Gonçalves, Farroupilha |

## Regras para as páginas

1. Um único `<h1>` por página, contendo o que a empresa faz e onde (ex.: "Projetos estruturais e complementares na Serra Gaúcha"). Slogans podem ficar num `<p>` ou `<span>` acima.
2. Cada serviço com um parágrafo de texto real (3–5 frases), citando o tipo de obra atendida.
3. Cada projeto do portfólio com nome, cidade, tipo (residencial, comercial, industrial), área em m² e serviços feitos. Quando houver páginas por projeto, use URLs como `/projetos/residencia-morada-dos-lagos/` e adicione cada uma ao `sitemap.xml`.
4. Toda imagem com `alt` descritivo em português; imagens só decorativas com `alt=""`.
5. Fotos próprias (não banco de imagens), em `.webp` ou `.jpg` comprimido, com `loading="lazy"` abaixo da dobra.
6. Desempenho conta para o Google: o `modelo_3d.glb` tem 25 MB e só deve carregar quando o visitante abrir o visualizador; o Tailwind via CDN deve virar CSS compilado antes do lançamento.

## Fora do código

- **Google Perfil da Empresa** (business.google.com): o item que mais pesa em busca local. Mesmo nome, endereço e telefone do site, link para `https://www.horst.eng.br/`, fotos de obras.
- **Google Search Console**: adicionar o domínio `horst.eng.br`, verificar pelo DNS e enviar `https://www.horst.eng.br/sitemap.xml`.
- Pedir para arquitetos e construtoras parceiras linkarem o site; colocar o link na bio do Instagram.
