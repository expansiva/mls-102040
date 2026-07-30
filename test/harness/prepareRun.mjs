// Prepara a pasta de uma rodada ANTES de a rodada começar.
//
//   node harness/prepareRun.mjs <style>/<template> runs/<id>
//
// Existe por uma questão de ordem: o `build.mjs` só roda DEPOIS que a rodada escreveu o `page.ts`
// (ele exige o arquivo para começar), então tudo que a rodada precisa **ler** tem de ser criado
// antes — senão o arquivo não existe na hora em que ela vai lê-lo.
//
// Hoje isso é o `molecules-usage.md`: o contrato dos grupos de molécula que o template daquela
// suíte atribui, juntado num arquivo só a partir do manifesto (`molecules.json` → `groups`).
// Um arquivo, e não um por grupo, porque cada leitura extra é tool use — e tool use é o que faz a
// rodada demorar.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildUsageBundle, collectUsageSkills, crossCheckManifest } from './molecules.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST_ROOT = resolve(HERE, '..');
const REPO_ROOT = resolve(TEST_ROOT, '../..');

const [suiteArg, runArg] = process.argv.slice(2);
if (!suiteArg || !runArg) {
  console.error('uso: node harness/prepareRun.mjs <style>/<template> runs/<id>');
  process.exit(1);
}

const SUITE_ROOT = resolve(TEST_ROOT, suiteArg);
const runDir = resolve(SUITE_ROOT, runArg);
mkdirSync(runDir, { recursive: true });

const manifestPath = join(SUITE_ROOT, 'molecules.json');
const usage = collectUsageSkills(manifestPath, REPO_ROOT);

if (usage.found.length === 0) {
  console.log(`pasta criada: ${relative(TEST_ROOT, runDir).replace(/\\/g, '/')}`);
  console.log('sem moléculas (nenhum manifesto, ou `groups` vazio) — a rodada recebe 4 arquivos');
  process.exit(0);
}

const bundle = buildUsageBundle(usage.found);
const outPath = join(runDir, 'molecules-usage.md');
writeFileSync(outPath, bundle, 'utf8');

console.log(`pasta criada: ${relative(TEST_ROOT, runDir).replace(/\\/g, '/')}`);
console.log(`usage: ${usage.found.length} grupo(s), ${Math.round(bundle.length / 1024)} KB`);
console.log(`  ${usage.found.map((s) => s.dir).join(' ')}`);
console.log(`\n5º arquivo de entrada da rodada:`);
console.log(`  ${relative(TEST_ROOT, outPath).replace(/\\/g, '/')}`);

if (usage.missing.length > 0) {
  console.log(`\n  ⚠️  sem usage.ts: ${usage.missing.join(' ')}`);
}

// o manifesto duplica a decisão do template; avisar quando divergem é o que impede a rodada de
// receber a TagName sem receber o contrato dela
const templatePath = resolve(REPO_ROOT, 'mls-102040', 'l4', 'templates', suiteArg, 'template.md');
const drift = crossCheckManifest(usage.groups, templatePath);
if (drift.notInManifest.length > 0) {
  console.log(`\n  ⚠️  o template atribui grupo(s) FORA do manifesto — a rodada ficaria sem o contrato:`);
  console.log(`      ${drift.notInManifest.join(' ')}`);
  console.log(`      acrescente em ${relative(TEST_ROOT, manifestPath).replace(/\\/g, '/')} → groups`);
}
