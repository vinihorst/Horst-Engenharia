# SEO – Horst Engenharia

Regras para manter o SEO do site ao editar ou redesenhar páginas.

## O que já está no site

- `<head>` do `index.html`: título, descrição, canonical, Open Graph (prévia no WhatsApp/Instagram/LinkedIn), cartão do X/Twitter e dados estruturados JSON-LD.
- JSON-LD (`@graph`): `ProfessionalService` (tipo de `LocalBusiness`) com endereço, telefone, e-mail, mapa e Instagram; um `Service` para cada serviço; `Person` (Vinícius, CREA-RS); `WebSite` e `WebPage`. Não usamos `BreadcrumbList` porque o site tem uma página só.
- `robots.txt` e `sitemap.xml` na raiz. `CNAME` com `horst.eng.br` (o `www` redireciona).
- `docs/og-image.jpg` (1200×630): imagem que aparece quando o link é compartilhado.

## Estrutura de títulos

Um único `<h1>` (na abertura). Cada seção tem um `<h2>` com o assunto dela e `<h3>` para os itens:

| Seção (`id`) | h2 | Busca que atende |
| --- | --- | --- |
| `sobre` | Engenharia feita de perto | escritório de engenharia, engenheiro civil |
| `servicos` | Projetos de engenharia integrados | projeto estrutural, de fundações, elétrico, hidrossanitário |
| `metodo` | BIM como forma de projetar | projetos em BIM |
| `compatibilizacao` | Conflitos resolvidos no projeto, não na obra | compatibilização de projetos |
| `parceiros` | Engenharia que trabalha junto | engenharia para arquitetos e construtoras |
| `obras` | Projetos | portfólio / estudos de caso |
| `modelo` | Explore um modelo coordenado | modelo 3D / BIM |

Os quatro títulos da animação de abertura também são `<h2>` (etapas da obra).

## Palavras-chave

Escreva para pessoas; os termos abaixo devem aparecer onde fazem sentido, sem repetição forçada:
projeto estrutural (residencial, de edifícios), projeto de fundações, projeto elétrico, projeto hidrossanitário, projetos complementares, compatibilização de projetos, BIM, escritório de engenharia, engenharia civil.

**Região:** não escrever "Serra Gaúcha" nem limitar a área de atendimento em títulos (o escritório atende várias regiões). A cidade aparece como endereço do escritório (Carlos Barbosa, RS). Não espalhar nomes de cidades para tentar ranquear; quando houver obras reais, a cidade de cada obra entra no estudo de caso, onde é informação verdadeira.

## Regras para as páginas

1. Um único `<h1>` por página. Slogans podem ficar num `<p>` ou `<span>` acima.
2. Não citar normas técnicas (NBR/ABNT) nem números não confirmados.
3. Toda imagem com `alt` descritivo em português; imagens só decorativas com `alt=""`.
4. Fotos próprias (não banco de imagens), em `.webp` ou `.jpg` comprimido, com `loading="lazy"` abaixo da dobra.
5. Modelos `.glb` comprimidos (ver MODELOS-3D.md) e carregados só perto da seção 3D.

## Quando houver dados reais

- **Obras:** preencha `OBRAS` em `assets/js/conteudo.js` (estrutura completa no topo do arquivo). Cada obra ganha um estudo de caso com link próprio (`#projeto-<slug>`).
  Quando houver de 4 a 6 obras com bom material, o próximo passo de SEO é dar a cada estudo de caso uma página própria (`/projetos/<slug>/index.html`), com `<title>` e descrição próprios, e adicioná-las ao `sitemap.xml`. Aí sim faz sentido usar `BreadcrumbList`.
- **Números:** preencha `NUMEROS` em `assets/js/conteudo.js` só com valores conferidos.
- **Horário de atendimento:** adicione ao `ProfessionalService` no JSON-LD:
  `"openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "18:00" }]` (com o horário real).
- **Coordenadas:** com a localização exata do escritório (do Google Perfil da Empresa), adicione `"geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... }`.
- **Área de atendimento:** quando as cidades/regiões estiverem definidas, troque `areaServed` pela lista real (`City` ou `AdministrativeArea`).
- **Redes:** novos perfis (LinkedIn etc.) entram em `sameAs`.
- Mantenha nome, endereço e telefone idênticos no site, no JSON-LD e no Google Perfil da Empresa.

## Fora do código

- **Google Perfil da Empresa** (business.google.com): o item que mais pesa em busca local. Mesmo nome, endereço e telefone do site, link para `https://horst.eng.br/`, fotos de obras, categoria "Engenheiro civil" ou "Empresa de engenharia".
- **Google Search Console**: adicionar o domínio `horst.eng.br`, verificar pelo DNS e enviar `https://horst.eng.br/sitemap.xml`.
- Pedir para arquitetos e construtoras parceiras linkarem o site; colocar o link na bio do Instagram.
