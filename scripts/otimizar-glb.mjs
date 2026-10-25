// Otimiza os modelos 3D (.glb) para carregar rápido no celular.
// Lê modelos-fonte/*.glb e grava a versão comprimida (Draco) em docs/modelos/.
// Uso: npm install && npm run otimizar-glb [-- nome.glb]
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ORIGEM = 'modelos-fonte';
const DESTINO = join('docs', 'modelos');
const MB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

// Sem simplificar a malha: tubulações e eletrodutos finos ficam quebrados
// quando o meshoptimizer reduz vértices. Só Draco já reduz ~20x.
const OPCOES = [
  '--compress', 'draco',
  '--simplify', 'false',
  '--texture-compress', 'webp',
  '--texture-size', '2048',
];

const pedidos = process.argv.slice(2);
const arquivos = (pedidos.length ? pedidos : readdirSync(ORIGEM))
  .filter((nome) => nome.toLowerCase().endsWith('.glb'));

if (!arquivos.length) {
  console.log(`Nenhum .glb encontrado em ${ORIGEM}/`);
  process.exit(0);
}

mkdirSync(DESTINO, { recursive: true });

for (const nome of arquivos) {
  const entrada = join(ORIGEM, nome);
  const saida = join(DESTINO, nome);
  console.log(`\n▸ ${nome}`);
  execFileSync('npx', ['gltf-transform', 'optimize', entrada, saida, ...OPCOES], { stdio: 'inherit' });
  console.log(`  ${MB(statSync(entrada).size)} → ${MB(statSync(saida).size)}  (${saida})`);
}
