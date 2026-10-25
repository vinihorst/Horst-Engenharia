# Modelos 3D (.glb)

O site carrega os modelos de `docs/modelos/`, que são versões comprimidas (Draco) dos arquivos originais em `modelos-fonte/`.

| Modelo | Original | Otimizado |
| --- | --- | --- |
| `modelo_3d.glb` | 25,5 MB | 1,2 MB |

## Adicionar ou atualizar um modelo

1. Exporte o `.glb` (Revit, SketchUp, Sketchfab etc.) e coloque em `modelos-fonte/`.
2. Na pasta do repositório, rode uma vez `npm install` e depois:

   ```bash
   npm run otimizar-glb              # todos os modelos
   npm run otimizar-glb -- casa.glb  # só um
   ```

3. O resultado vai para `docs/modelos/casa.glb`. É esse caminho que o site deve usar.

## O que o script faz

- Junta as peças que usam a mesma cor, para o celular desenhar o modelo de uma vez só (o modelo atual caiu de 96 peças para 2).
- Comprime a geometria com Draco, sem simplificar a malha (simplificar quebrava eletrodutos e tubulações finas).
- Converte texturas para WebP com no máximo 2048 px.

## Para quem programa o visualizador

- O `GLTFLoader` precisa do `DRACOLoader` (ver `visualizador3d.js`). Decoder: `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/` (ou o da versão do three.js em uso).
- Carregue o modelo só quando a seção 3D estiver perto da tela (`IntersectionObserver`), nunca no carregamento da página.
