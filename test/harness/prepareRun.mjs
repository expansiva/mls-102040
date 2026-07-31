// Prepara a pasta de uma rodada ANTES de a rodada começar.
//
//   node harness/prepareRun.mjs <style>/<template> runs/<id> [--layout <nome>]
//
// Existe por uma questão de ordem: o `build.mjs` só roda DEPOIS que a rodada escreveu o `page.ts`
// (ele exige o arquivo para começar), então tudo que a rodada precisa **ler** tem de ser criado
// antes — senão o arquivo não existe na hora em que ela vai lê-lo.
//
// Hoje isso é o `molecules-usage.md`: o contrato dos grupos de molécula que o template daquela
// suíte atribui, juntado num arquivo só a partir do manifesto (`molecules.json` → `groups`).
// Um arquivo, e não um por grupo, porque cada leitura extra é tool use — e tool use é o que faz a
// rodada demorar.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildUsageBundle, collectUsageSkills, crossCheckManifest } from './molecules.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST_ROOT = resolve(HERE, '..');
const REPO_ROOT = resolve(TEST_ROOT, '../..');

const argv = process.argv.slice(2);
const layoutFlag = argv.indexOf('--layout');
const layoutArg = layoutFlag >= 0 ? argv[layoutFlag + 1] : null;
// `layoutFlag < 0` precisa de guarda: sem a flag, `layoutFlag + 1` vale 0 e o filtro comeria o
// primeiro argumento posicional
const [suiteArg, runArg] =
  layoutFlag >= 0 ? argv.filter((_, i) => i !== layoutFlag && i !== layoutFlag + 1) : argv;
if (!suiteArg || !runArg || (layoutFlag >= 0 && !layoutArg)) {
  console.error('uso: node harness/prepareRun.mjs <style>/<template> runs/<id> [--layout <nome>]');
  process.exit(1);
}

const SUITE_ROOT = resolve(TEST_ROOT, suiteArg);
const runDir = resolve(SUITE_ROOT, runArg);
mkdirSync(runDir, { recursive: true });

// ── documento de design: estilo + página (+ layout), montados num arquivo só ─────
// A especificação é escrita em níveis: o estilo vale para toda página, a página diz o que ela É, e o
// layout diz como ela é ARRUMADA — a mesma página tem mais de uma arrumação, e cada uma é seu próprio
// documento. Montar aqui, em vez de mandar N arquivos, tem três motivos: a rodada segue UMA
// especificação (reconciliar documentos é exatamente onde ela erra), o orçamento de tool use não
// cresce, e a montagem é o único momento em que dá para conferir mecanicamente se os níveis se
// contradizem.
//
// Fixture e manifesto NÃO entram nessa divisão: pertencem ao domínio, não à arrumação, e continuam em
// `test/<style>/<template>/` compartilhados por todos os layouts. É o que permite comparar duas
// arrumações da mesma página contra os mesmos dados.
const [styleDir] = suiteArg.split('/');
const TPL_ROOT = resolve(REPO_ROOT, 'mls-102040', 'l4', 'templates');
const pagePath = resolve(TPL_ROOT, suiteArg, 'template.md');

if (!existsSync(pagePath)) {
  console.error(`template da página não encontrado: ${pagePath}`);
  process.exit(1);
}

const layoutPath = layoutArg
  ? resolve(TPL_ROOT, suiteArg, 'layouts', layoutArg, 'template.md')
  : null;
if (layoutPath && !existsSync(layoutPath)) {
  console.error(`layout não encontrado: ${relative(REPO_ROOT, layoutPath).replace(/\\/g, '/')}`);
  const layoutsDir = resolve(TPL_ROOT, suiteArg, 'layouts');
  if (existsSync(layoutsDir)) {
    console.error(`layouts disponíveis: ${readdirSync(layoutsDir).join(' ')}`);
  }
  process.exit(1);
}

const levels = [
  { label: `Style rules (${styleDir})`, path: resolve(TPL_ROOT, styleDir, 'template.md'), name: 'estilo' },
  { label: `Page document (${suiteArg})`, path: pagePath, name: 'página' },
  layoutPath && { label: `Layout (${layoutArg})`, path: layoutPath, name: 'layout' },
]
  .filter(Boolean)
  .filter((l) => existsSync(l.path))
  .map((l) => ({ ...l, doc: readFileSync(l.path, 'utf8').trim() }));

const total = levels.length;
const designDoc =
  total === 1
    ? levels[0].doc
    : [
        `<!-- Montado por harness/prepareRun.mjs: ${levels
          .map((l) => relative(TPL_ROOT, l.path).replace(/\\/g, '/'))
          .join(' + ')} -->`,
        '',
        '> This specification arrives in parts. Each part narrows the ones before it and never',
        '> contradicts them; a contradiction is a finding to report, not an override to make.',
        '',
        ...levels.flatMap((l, i) => [
          '---',
          '',
          `# PART ${i + 1} of ${total} — ${l.label}`,
          '',
          l.doc,
          '',
        ]),
      ].join('\n');

const designPath = join(runDir, 'template.md');
writeFileSync(designPath, designDoc, 'utf8');

// Contradição entre níveis não dá para provar por texto, mas o sintoma mais comum dá: um nível
// repetindo um título de outro. Cópia é divergência futura — as duas versões derivam e nada avisa.
const headings = (doc) =>
  new Set(
    doc
      .split('\n')
      .filter((l) => /^#{2,3}\s/.test(l))
      .map((l) =>
        l
          .replace(/^#{2,3}\s+/, '')
          .replace(/^(L?\d+\.)\s*/, '')
          .trim()
          .toLowerCase()
      )
  );
const repeated = [];
for (let i = 0; i < levels.length; i += 1) {
  for (let j = i + 1; j < levels.length; j += 1) {
    const shared = [...headings(levels[j].doc)].filter((h) => headings(levels[i].doc).has(h));
    if (shared.length > 0) {
      repeated.push(`${levels[j].name} repete de ${levels[i].name}: ${shared.join(' · ')}`);
    }
  }
}

// ── contrato das moléculas ───────────────────────────────────────────────────────
const manifestPath = join(SUITE_ROOT, 'molecules.json');
const usage = collectUsageSkills(manifestPath, REPO_ROOT);

const reportDesign = () => {
  const parts = levels
    .map((l) => `${l.name} ${Math.round(l.doc.length / 1024)} KB`)
    .join(' + ');
  console.log(
    `documento de design: ${total} parte(s), ${Math.round(designDoc.length / 1024)} KB — ${parts}`
  );
  console.log(`  ${relative(TEST_ROOT, designPath).replace(/\\/g, '/')}`);
  if (!levels.some((l) => l.name === 'estilo')) {
    console.log(`  (sem ${styleDir}/template.md — nenhuma regra global de estilo)`);
  }
  if (layoutArg === null) {
    const layoutsDir = resolve(TPL_ROOT, suiteArg, 'layouts');
    if (existsSync(layoutsDir)) {
      const available = readdirSync(layoutsDir);
      console.log(
        `\n  ⚠️  esta suíte tem layout(s) e nenhum foi escolhido: ${available.join(' ')}`
      );
      console.log(`      sem --layout a rodada recebe a página sem arrumação nenhuma`);
    }
  }
  if (repeated.length > 0) {
    console.log(`\n  ⚠️  título(s) repetido(s) entre níveis — sinal de regra duplicada:`);
    repeated.forEach((r) => console.log(`      ${r}`));
    console.log(`      regra de nível acima se referencia, não se copia: cópia é divergência futura`);
  }
};

console.log(`pasta criada: ${relative(TEST_ROOT, runDir).replace(/\\/g, '/')}`);
reportDesign();

if (usage.found.length === 0) {
  console.log('\nsem moléculas (nenhum manifesto, ou `groups` vazio) — a rodada recebe 4 arquivos');
  process.exit(0);
}

const bundle = buildUsageBundle(usage.found);
const outPath = join(runDir, 'molecules-usage.md');
writeFileSync(outPath, bundle, 'utf8');

console.log(`\nusage: ${usage.found.length} grupo(s), ${Math.round(bundle.length / 1024)} KB`);
console.log(`  ${usage.found.map((s) => s.dir).join(' ')}`);
console.log(`  ${relative(TEST_ROOT, outPath).replace(/\\/g, '/')}`);

if (usage.missing.length > 0) {
  console.log(`\n  ⚠️  sem usage.ts: ${usage.missing.join(' ')}`);
}

// o manifesto duplica a decisão do template; avisar quando divergem é o que impede a rodada de
// receber a TagName sem receber o contrato dela. Confere contra o documento MONTADO: o estilo
// atribui as moléculas de campo, a página as estruturais — só a soma tem a lista completa.
const drift = crossCheckManifest(usage.groups, designPath);
if (drift.notInManifest.length > 0) {
  console.log(`\n  ⚠️  o template atribui grupo(s) FORA do manifesto — a rodada ficaria sem o contrato:`);
  console.log(`      ${drift.notInManifest.join(' ')}`);
  console.log(`      acrescente em ${relative(TEST_ROOT, manifestPath).replace(/\\/g, '/')} → groups`);
}
