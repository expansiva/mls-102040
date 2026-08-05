// Orquestra uma rodada inteira, do zero ao `page.html`.
//
//   node harness/run.mjs --suite <style>/<template> --fixture <nome> [--layout <nome>] [opções]
//
//   ex.: node harness/run.mjs --suite salesforceStyle/inventoryControl \
//          --fixture cafeFlowInventoryControl --layout gridThenEdit
//
// Existe porque a rodada tem quatro passos que sempre acontecem na mesma ordem, com os mesmos
// argumentos derivados dos mesmos dois nomes — e errar a ordem é fácil (o `prepareRun` TEM de vir
// antes, senão a rodada procura um arquivo que ainda não existe).
//
//   1. prepareRun  monta o documento de design (estilo + página + layout) e o contrato das moléculas
//   2. geração     um agente de contexto limpo escreve o page.ts
//   3. build       stub → tsc → tailwind → CSS das moléculas → page.html autocontido
//   4. checks      conferência mecânica
//
// O passo 2 precisa de um modelo. Se o CLI `claude` estiver no PATH, este script o chama em modo
// headless com as ferramentas restritas a leitura e escrita — o que torna MECÂNICA a regra "escreva
// e pare, não verifique o próprio trabalho": sem Bash, a rodada não tem como rodar `tsc` nem
// fabricar um stub falso para compilar contra, que foi o que matou as duas rodadas mais lentas já
// medidas. Sem o CLI, o script escreve o prompt em disco, para a rodada e diz como seguir.
//
// Opções:
//   --layout <nome>   escolhe a arrumação (obrigatório quando a suíte tem layouts)
//   --id <nome>       força o id da rodada (padrão: <AAAAMMDDHHMMSS>[-<layout>]-<fixture>)
//   --no-generate     só prepara; útil para gerar o page.ts por outro caminho
//   --only-build      pula preparo e geração; refaz build + checks de uma rodada existente
//   --model <nome>    modelo do passo 2 (padrão: o do CLI)
//   --max-turns <n>   teto de voltas do passo 2 (padrão 20; rodada saudável usa ~6)

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST_ROOT = resolve(HERE, '..');
const REPO_ROOT = resolve(TEST_ROOT, '../..');

// ── argumentos ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const has = (name) => argv.includes(`--${name}`);

const suite = flag('suite');
const fixture = flag('fixture');
const layout = flag('layout');
const model = flag('model');
const maxTurns = flag('max-turns', '20');
let generationMs = null;

// ── descoberta ──────────────────────────────────────────────────────────────────
// Chamada sem argumentos não tem padrão nenhum — nem suíte, nem layout. Escolher um por conta
// seria pior que falhar: a rodada sairia testando algo que ninguém pediu. Em vez de uma linha de
// uso, lista o que existe: é a pergunta que se faz ao chegar no harness.
const TPL_ROOT = resolve(REPO_ROOT, 'mls-102040', 'l4', 'templates');

const layoutsOf = (s) => {
  const dir = resolve(TPL_ROOT, s, 'layouts');
  return existsSync(dir) ? readdirSync(dir).filter((d) => existsSync(resolve(dir, d, 'template.md'))) : [];
};

const discoverSuites = () => {
  const found = [];
  for (const style of readdirSync(TEST_ROOT, { withFileTypes: true })) {
    if (!style.isDirectory() || ['harness', 'skills'].includes(style.name)) continue;
    for (const tpl of readdirSync(resolve(TEST_ROOT, style.name), { withFileTypes: true })) {
      if (!tpl.isDirectory()) continue;
      const fixturesDir = resolve(TEST_ROOT, style.name, tpl.name, 'fixtures');
      if (!existsSync(fixturesDir)) continue;
      found.push({
        suite: `${style.name}/${tpl.name}`,
        layouts: layoutsOf(`${style.name}/${tpl.name}`),
        fixtures: readdirSync(fixturesDir)
          .filter((f) => f.endsWith('.defs.ts'))
          .map((f) => f.replace(/\.defs\.ts$/, '')),
      });
    }
  }
  return found;
};

if (!suite || !fixture) {
  console.log('uso: node test/harness/run.mjs --suite <style>/<template> --fixture <nome> [--layout <nome>]');
  console.log('     opções: --id <nome> · --no-generate · --only-build · --model <nome> · --max-turns <n>');
  console.log('\nNão há padrão: suíte, fixture e layout são sempre explícitos.\n');
  const suites = discoverSuites();
  if (suites.length === 0) {
    console.log('nenhuma suíte encontrada em test/');
  }
  for (const s of suites) {
    console.log(`${s.suite}`);
    console.log(`  layouts:  ${s.layouts.length ? s.layouts.join(' · ') : '(nenhum)'}`);
    console.log(`  fixtures: ${s.fixtures.join(' · ')}`);
    const l = s.layouts[0] ? ` --layout ${s.layouts[0]}` : '';
    console.log(`  ex.: npm run test:template -- --suite ${s.suite} --fixture ${s.fixtures[0]}${l}\n`);
  }
  process.exit(1);
}

// ── caminhos ────────────────────────────────────────────────────────────────────
const SUITE_ROOT = resolve(TEST_ROOT, suite);
const fixturePath = resolve(SUITE_ROOT, 'fixtures', `${fixture}.defs.ts`);
if (!existsSync(fixturePath)) {
  console.error(`fixture não encontrada: ${relative(TEST_ROOT, fixturePath).replace(/\\/g, '/')}`);
  process.exit(1);
}

// Layout omitido numa suíte que tem layouts é quase sempre esquecimento, e o resultado — uma
// página sem arrumação nenhuma — parece rodada válida. O `prepareRun` só avisa; aqui, que é a porta
// de entrada normal, recusa.
const available = layoutsOf(suite);
if (available.length > 0 && !layout) {
  console.error(`esta suíte tem layout(s) e nenhum foi escolhido: ${available.join(' · ')}`);
  console.error(`acrescente --layout <nome>`);
  process.exit(1);
}
if (layout && !available.includes(layout)) {
  console.error(`layout "${layout}" não existe em ${suite}`);
  console.error(`disponíveis: ${available.length ? available.join(' · ') : '(nenhum)'}`);
  process.exit(1);
}

// Timestamp completo (hora local) no id: a pasta diz QUANDO a rodada foi feita, ao segundo. Só a
// data não bastava — refazer a mesma combinação no mesmo dia caía na mesma pasta e sobrescrevia o
// artefato anterior, que é justamente o que se quer comparar quando se mexe num documento.
const stamp = (() => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
})();
const runId = flag('id') ?? resolveRunId();

/**
 * O id de uma rodada NOVA é `<AAAAMMDDHHMMSS>[-<layout>]-<fixture>`.
 *
 * Com `--only-build` é diferente: não há rodada nova, e um timestamp novo apontaria para uma pasta
 * que não existe. Então retoma a MAIS RECENTE da mesma combinação — que é o que "refaz o build
 * daquela rodada" quer dizer. A ordem alfabética serve de cronológica porque o timestamp é
 * zero-padded (e ids do formato antigo, `AAAA-MM-DD-…`, ordenam antes de qualquer timestamp novo).
 */
function resolveRunId() {
  const suffix = [layout, fixture].filter(Boolean).join('-');
  if (!has('only-build')) return [stamp, suffix].join('-');

  const runsDir = resolve(SUITE_ROOT, 'runs');
  const found = existsSync(runsDir)
    ? readdirSync(runsDir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name.endsWith(`-${suffix}`))
        .map((e) => e.name)
        .sort()
        .reverse()
    : [];
  if (found.length === 0) {
    console.error(`--only-build sem --id: nenhuma rodada de "${suffix}" em ${suite}/runs`);
    console.error('rode sem --only-build para criar uma, ou aponte a pasta com --id <nome>');
    process.exit(1);
  }
  if (found.length > 1) console.log(`--only-build: retomando a mais recente de ${found.length} rodadas de ${suffix}`);
  return found[0];
}
const runRel = `runs/${runId}`;
const runDir = resolve(SUITE_ROOT, runRel);

const rel = (p) => relative(TEST_ROOT, p).replace(/\\/g, '/');
const step = (n, label) => console.log(`\n${'─'.repeat(72)}\n[${n}/4] ${label}\n${'─'.repeat(72)}`);

const node = (script, args) => {
  const r = spawnSync(process.execPath, [resolve(HERE, script), ...args], {
    cwd: TEST_ROOT,
    stdio: 'inherit',
  });
  return r.status ?? 1;
};

// ── 1. preparo ──────────────────────────────────────────────────────────────────
if (!has('only-build')) {
  step(1, `preparo — ${suite}${layout ? ` · ${layout}` : ''} · ${fixture}`);
  const args = [suite, runRel, ...(layout ? ['--layout', layout] : [])];
  if (node('prepareRun.mjs', args) !== 0) {
    console.error('\npreparo falhou — nada a fazer depois dele');
    process.exit(1);
  }
} else {
  step(1, 'preparo — pulado (--only-build)');
  if (!existsSync(runDir)) {
    console.error(`rodada não existe: ${rel(runDir)}`);
    process.exit(1);
  }
}

// ── 2. geração ──────────────────────────────────────────────────────────────────
const pageOut = join(runDir, 'page.ts');
const kebab = fixture.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const usagePath = join(runDir, 'molecules-usage.md');
const hasUsage = existsSync(usagePath);
const inputPath = join(runDir, 'generation-input.md');

// Uma única leitura dá ao agente o mesmo material que antes vinha em cinco arquivos. Os separadores
// preservam a autoridade de cada fonte e tornam explícito o que é contrato versus dado de execução.
const buildGenerationInput = () => {
  const sources = [
    ['DOCUMENTO DE DESIGN', join(runDir, 'template.md')],
    ['FIXTURE — DOMÍNIO E CONTRATO', fixturePath],
    ['DESIGN SYSTEM — TOKENS', join(TEST_ROOT, 'designSystem.css')],
    ['ÍCONE — CONJUNTO FECHADO', join(TEST_ROOT, 'icons.ts')],
    ...(hasUsage ? [['MOLÉCULAS — CONTRATOS DE USAGE', usagePath]] : []),
  ];
  return [
    '# Generation input',
    '',
    'Este arquivo é a única entrada de implementação. As seções mantêm a mesma ordem de autoridade:',
    'design document > fixture > design system > icons > molecule contracts.',
    'Na fixture, use o contrato inteiro; quando ela tiver seed, dele extraia somente total e três rows representativas.',
    'No design system, ignore o bloco `.dark`; no usage, extraia API e ignore sintaxe de exemplos.',
    '',
    ...sources.flatMap(([label, path]) => [`---`, '', `## ${label}`, '', readFileSync(path, 'utf8').trim(), '']),
  ].join('\n');
};

if (!has('only-build')) {
  const input = buildGenerationInput();
  writeFileSync(inputPath, input, 'utf8');
  console.log(`entrada de geração: ${rel(inputPath)} (${Math.round(input.length / 1024)} KB)`);
}

const buildPrompt = () => {
  const tpl = readFileSync(resolve(HERE, 'runPrompt.md'), 'utf8');
  return tpl
    .replace('{{INPUT_PATH}}', inputPath)
    .replace('{{OUT_PATH}}', pageOut)
    .replace('{{META_PATH}}', join(runDir, 'generation-meta.json'))
    .replace('{{TAG}}', `test--${kebab}-page`);
};

// Procura o CLI em três lugares, nesta ordem. O terceiro existe porque a extensão do VSCode **já
// traz** o binário — quem usa o Claude Code por lá não precisa instalar nada, só não tem o PATH
// configurado. Descobrir isso sozinho evita mandar o usuário instalar uma segunda cópia.
const cliFound = () => {
  const env = process.env.CLAUDE_CLI;
  if (env && existsSync(env)) return env;

  for (const bin of ['claude', 'claude.cmd']) {
    const r = spawnSync(bin, ['--version'], { stdio: 'ignore', shell: process.platform === 'win32' });
    if (r.status === 0) return bin;
  }

  const extRoot = join(process.env.USERPROFILE ?? process.env.HOME ?? '', '.vscode', 'extensions');
  if (!existsSync(extRoot)) return null;
  const exe = process.platform === 'win32' ? 'claude.exe' : 'claude';
  const candidates = readdirSync(extRoot)
    .filter((d) => d.startsWith('anthropic.claude-code'))
    .sort()
    .reverse() // versão mais nova primeiro
    .map((d) => join(extRoot, d, 'resources', 'native-binary', exe))
    .filter((p) => existsSync(p));
  return candidates[0] ?? null;
};

if (has('no-generate')) {
  step(2, 'geração — pulada (--no-generate)');
  const promptPath = join(runDir, 'prompt.md');
  writeFileSync(promptPath, buildPrompt(), 'utf8');
  console.log(`prompt escrito: ${rel(promptPath)}`);
  console.log('escreva o page.ts por outro caminho e depois rode com --only-build');
  process.exit(0);
} else if (has('only-build')) {
  step(2, 'geração — pulada (--only-build)');
} else {
  step(2, 'geração — subagente de contexto limpo');
  const generationStartedAt = Date.now();
  const prompt = buildPrompt();
  const promptPath = join(runDir, 'prompt.md');
  mkdirSync(runDir, { recursive: true });
  writeFileSync(promptPath, prompt, 'utf8');

  const bin = cliFound();
  if (!bin) {
    console.log('CLI `claude` não encontrado — nem no PATH, nem na extensão do VSCode.');
    console.log(`\nprompt pronto em: ${rel(promptPath)}`);
    console.log('\ntrês saídas:');
    console.log('  a) instale o CLI (`npm i -g @anthropic-ai/claude-code`) e rode de novo');
    console.log('  b) aponte para um binário existente: CLAUDE_CLI=<caminho> antes do comando');
    console.log('  c) gere o page.ts por outro caminho e depois: … --only-build');
    console.log('\nO preparo já está feito, então (c) não repete trabalho.');
    process.exit(2);
  }
  console.log(`CLI: ${bin}`);

  // `shell` SÓ quando o binário é um nome solto que precisa do PATH (ou do `.cmd`). Com caminho
  // absoluto, passar pelo shell é o que estourava: o `cmd.exe` limita a linha de comando a 8191
  // caracteres e o prompt passa de 9 mil. Sem shell, o Windows cria o processo direto e o teto sobe
  // para 32767.
  const bare = !bin.includes('\\') && !bin.includes('/');
  const useShell = bare && process.platform === 'win32';

  // Margem para o dia em que o documento de design crescer: acima do teto do CreateProcess, manda
  // ler o prompt do arquivo em vez de passá-lo inteiro na linha de comando.
  const CMD_CEILING = 30000;
  const inlinePrompt = prompt.length <= CMD_CEILING;
  const promptArg = inlinePrompt
    ? prompt
    : `Leia o arquivo \`${promptPath}\` e execute exatamente as instruções que ele contém. ` +
      `Ele é o seu prompt: siga-o inteiro, incluindo a única entrada a ler e os artefatos a escrever.`;

  // Ferramentas restritas a Read e Write de propósito: é o que transforma "escreva e pare, não
  // verifique o próprio trabalho" de regra escrita em impossibilidade. Sem Bash a rodada não roda
  // tsc nem fabrica stub falso; sem Glob/Grep não sai procurando página já gerada.
  // `acceptEdits` porque em modo headless não há ninguém para aprovar a escrita do page.ts, e sem
  // isso a rodada terminaria sem produzir arquivo. É o modo mais estreito que serve: NÃO se usa
  // `--dangerously-skip-permissions`, que libera tudo. A contenção real vem de `--allowedTools`
  // logo abaixo — com só Read e Write, aceitar edições é aceitar exatamente o que a rodada existe
  // para fazer.
  //
  // O aviso "Ignoring N permissions.allow entries … not been trusted" é ruído aqui: as permissões
  // vêm da linha de comando, não do settings.json do workspace.
  const args = [
    '-p',
    promptArg,
    '--permission-mode',
    'acceptEdits',
    '--allowedTools',
    'Read',
    'Write',
    '--max-turns',
    maxTurns,
    ...(model ? ['--model', model] : []),
  ];
  console.log(
    `chamando (ferramentas: Read, Write · max-turns ${maxTurns} · prompt ${
      inlinePrompt ? 'inline' : 'por arquivo'
    }, ${prompt.length} chars)…\n`
  );
  const r = spawnSync(bin, args, {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
    shell: useShell,
    windowsVerbatimArguments: false,
    maxBuffer: 64 * 1024 * 1024,
  });

  // O stdout não é mais relatório: a geração produz só os artefatos. `report.mjs`, depois de
  // build/checks, junta fatos mecânicos e o generation-meta.json opcional em um report.md.
  const stdout = (r.stdout ?? '').trim();
  if (stdout) console.log(stdout);
  generationMs = Date.now() - generationStartedAt;
  if (r.status !== 0) {
    console.error(`\ngeração falhou (status ${r.status}) — o preparo está feito, dá para retomar`);
    if (!existsSync(pageOut)) process.exit(1);
    console.error('mas o page.ts existe: seguindo para o build para não perder a camada visual');
  }
}

if (!existsSync(pageOut)) {
  console.error(`\nsem page.ts em ${rel(runDir)} — recusa da rodada, ou geração incompleta`);
  process.exit(1);
}

// ── 3. build ────────────────────────────────────────────────────────────────────
step(3, 'build');
const buildStatus = node('build.mjs', [suite, runRel, `fixtures/${fixture}.defs.ts`]);

// ── 4. checks ───────────────────────────────────────────────────────────────────
step(4, 'checks');
const checksStatus = node('checks.mjs', [suite, runRel, `fixtures/${fixture}.defs.ts`]);

// O relatório é do harness: dados de arquivos, build, checks e imports são observáveis; somente
// decisões/gaps que não dá para inferir chegam no generation-meta.json opcional.
node('report.mjs', [
  suite,
  runRel,
  `fixtures/${fixture}.defs.ts`,
  '--layout',
  layout ?? '',
  '--build-status',
  String(buildStatus),
  '--checks-status',
  String(checksStatus),
  '--generation-ms',
  generationMs === null ? '' : String(generationMs),
]);

console.log(`\n${'═'.repeat(72)}`);
console.log(`rodada: ${rel(runDir)}`);
console.log(`página: ${rel(join(runDir, 'page.html'))}  (duplo clique)`);
if (buildStatus !== 0) {
  console.log('\n⚠️  o build reportou falha de tipo: a rodada não passa a camada mecânica.');
  console.log('    Use a página para julgar o visual; para artefato válido, refaça a rodada.');
}
process.exit(buildStatus === 0 ? 0 : 1);
