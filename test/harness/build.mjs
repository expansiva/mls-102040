// Monta uma rodada para ser vista no navegador. Tudo local: nada de CDN.
// Harness compartilhado por qualquer style/template de teste em test/<style>/<template>/.
//
//   node harness/build.mjs <style>/<template> runs/<id> fixtures/<fixture>.defs.ts
//   ex.: node harness/build.mjs <style>/<template> runs/2026-01-31-<fixture> fixtures/<fixture>.defs.ts
//
// Faz, em ordem:
//   1. gera o stub a partir da fixture (makeStub.mjs)
//   2. compila page.ts + stub.ts com as flags da plataforma  ← 1ª camada de verificação
//   3. build do Tailwind só das classes que a página usou
//   4. page.html — AUTOCONTIDA (JS empacotado + CSS embutidos): abre com duplo clique, sem
//      servidor e sem rede. Existe porque o navegador bloqueia `import` de módulo em file://,
//      então nada pode ser importado ali: tudo vai embutido.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildMlTokenSheet,
  esbuildMlsPlugin,
  findUsedMolecules,
  readSuiteMlTokens,
  tsconfigPaths,
} from './molecules.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
// test/ — raiz compartilhada: harness/ e designSystem.css moram aqui, comuns a todo style.
const TEST_ROOT = resolve(HERE, '..');
const REPO_ROOT = resolve(TEST_ROOT, '../..');

const [suiteArg, runArg, fixtureArg] = process.argv.slice(2);
if (!suiteArg || !runArg || !fixtureArg) {
  console.error('uso: node harness/build.mjs <style>/<template> runs/<id> fixtures/<fixture>.defs.ts');
  process.exit(1);
}
// <style>/<template> — o diretório da suíte. Fixtures e runs são por suíte;
// harness e designSystem.css são compartilhados (TEST_ROOT).
const SUITE_ROOT = resolve(TEST_ROOT, suiteArg);
const runDir = resolve(SUITE_ROOT, runArg);
const fixturePath = resolve(SUITE_ROOT, fixtureArg);
const pageTs = join(runDir, 'page.ts');
if (!existsSync(pageTs)) {
  console.error(`sem page.ts em ${runArg} — rodada recusou a fixture? então não há o que montar.`);
  process.exit(1);
}

const node = process.execPath;
const run = (file, args, cwd = REPO_ROOT) =>
  execFileSync(file, args, { cwd, stdio: 'inherit', encoding: 'utf8' });

// ── 1. stub + ícones ───────────────────────────────────────────────────────────
// O conjunto de ícones é compartilhado (test/icons.ts) e vai copiado para a pasta da rodada, para
// que a página o importe como `./icons.js` — mesma convenção local do `./stub.js`.
console.log('[1/4] stub + ícones');
run(node, [join(HERE, 'makeStub.mjs'), fixturePath, join(runDir, 'stub.ts')]);
const iconsTs = join(runDir, 'icons.ts');
copyFileSync(join(TEST_ROOT, 'icons.ts'), iconsTs);

const manifestPath = join(SUITE_ROOT, 'molecules.json');

// ── 2. compilar (as flags que a plataforma usa) ─────────────────────────────────
// Falha de tipo é falha da rodada e fica registrada — mas NÃO aborta o build. Erro de tipo quase
// sempre é inócuo em execução (o esbuild só apaga os tipos), e abortar aqui custaria a camada
// visual: sem page.html não há como julgar a página contra o passe final do template. Erro de
// sintaxe de verdade derruba o esbuild adiante, que é onde ele deve derrubar.
// As moléculas importam por caminho absoluto de projeto (`/_102040_/l2/molecules/…`), que o tsc
// só resolve via `paths` — e `paths` exige tsconfig, não dá por flag de linha de comando.
console.log('[2/4] tsc');
const tsc = join(REPO_ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
const toRepoRoot = relative(runDir, REPO_ROOT).replace(/\\/g, '/');
const tsconfigPath = join(runDir, 'tsconfig.json');
writeFileSync(
  tsconfigPath,
  `${JSON.stringify(
    {
      compilerOptions: {
        target: 'es2020',
        module: 'ES2020',
        moduleResolution: 'bundler',
        experimentalDecorators: true,
        strict: true,
        skipLibCheck: true,
        outDir: 'dist',
        baseUrl: '.',
        paths: tsconfigPaths(toRepoRoot, REPO_ROOT),
      },
      files: ['stub.ts', 'icons.ts', 'page.ts'],
    },
    null,
    2,
  )}\n`,
  'utf8',
);
let tscFailed = false;
try {
  run(node, [tsc, '-p', tsconfigPath]);
} catch {
  tscFailed = true;
  console.log('\n  ⚠️  TSC FALHOU — falha da rodada. O build segue para gerar o page.html,');
  console.log('      porque erro de tipo não impede a página de rodar e a camada visual precisa ser vista.\n');
}

// ── 3. Tailwind só das classes usadas ──────────────────────────────────────────
console.log('[3/4] tailwind');
const twIn = join(runDir, 'tailwind.in.css');
writeFileSync(twIn, `@import "tailwindcss";\n@source "./page.ts";\n@source "./icons.ts";\n`, 'utf8');
const twCli = join(REPO_ROOT, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
run(node, [twCli, '-i', twIn, '-o', join(runDir, 'tailwind.css')], runDir);

// ── 3b. page.less (opcional) ───────────────────────────────────────────────────
const lessPath = join(runDir, 'page.less');
let pageCss = '';
const less = (await import('less')).default;
if (existsSync(lessPath)) {
  console.log('[3b/4] page.less');
  // o header /// <mls .../> é comentário de linha em LESS; o compilador o descarta
  const out = await less.render(readFileSync(lessPath, 'utf8'), { filename: lessPath });
  pageCss = out.css;
  writeFileSync(join(runDir, 'page.css'), pageCss, 'utf8');
}

// ── 3c. moléculas: CSS + mapa --ml-* ───────────────────────────────────────────
// O `.less` de cada molécula é escopado pela própria tag e não usa variável LESS — só custom
// properties. Então `less.render()` puro basta: o resultado vira um <style> global, que é
// exatamente o que o `loadStyle` da produção faria (append de <style> no head), e as moléculas
// não têm Shadow DOM. Sem isso a molécula renderiza SEM ESTILO — nem os fallbacks, que moram
// no .less.
const pageSrcForMolecules = readFileSync(pageTs, 'utf8');
const molecules = findUsedMolecules(pageSrcForMolecules, REPO_ROOT);
let moleculesCss = '';
if (molecules.length > 0) {
  console.log(`[3c/4] moléculas (${molecules.length})`);
  // o bundle de contrato é INPUT da rodada, gerado pelo prepareRun antes dela; aqui só se verifica.
  // Regenerar seria pior: se o manifesto mudou no meio, o registro passaria a mentir sobre o que a
  // rodada de fato leu.
  if (!existsSync(join(runDir, 'molecules-usage.md'))) {
    console.log('\n  ⚠️  a página usa molécula mas NÃO existe molecules-usage.md nesta rodada —');
    console.log('      ela foi gerada sem o contrato das moléculas. Rode o prepareRun antes da próxima.\n');
  }
  // caixa errada no caminho do import compila aqui (Windows/macOS ignoram caixa) e quebra em
  // qualquer sistema case-sensitive — avisar agora é mais barato que descobrir no CI
  const wrongCase = molecules.filter((m) => m.canonicalGroup && m.group !== m.canonicalGroup);
  if (wrongCase.length > 0) {
    console.log(`\n  ⚠️  ${wrongCase.length} import(s) com a CAIXA errada no nome do grupo:`);
    for (const m of wrongCase) console.log(`      ${m.group}  →  deveria ser  ${m.canonicalGroup}`);
    console.log('      compila neste sistema por ele ignorar caixa; quebra em Linux/CI.\n');
  }

  const parts = [];
  for (const m of molecules) {
    if (!m.lessPath) {
      console.log(`  ${m.group}--${m.name}: sem .less`);
      continue;
    }
    const out = await less.render(readFileSync(m.lessPath, 'utf8'), { filename: m.lessPath });
    parts.push(`/* ${m.group}--${m.name} */\n${out.css}`);
  }
  // o invariante de raio/movimento/peso é do template DESTA suíte, não do harness
  const sheet = buildMlTokenSheet(molecules, readSuiteMlTokens(manifestPath));
  moleculesCss = [sheet.css, ...parts].filter(Boolean).join('\n');
  writeFileSync(join(runDir, 'molecules.css'), moleculesCss, 'utf8');
  console.log(`  ${molecules.map((m) => m.name).join(', ')}`);
  console.log(`  ${sheet.used.length} tokens --ml-* usados, ${sheet.used.length - sheet.missing.length} mapeados`);
  if (sheet.missing.length > 0) {
    // silencioso seria pior: o token cai no fallback Material e a tela sai cinza sem erro
    console.log(`\n  ⚠️  ${sheet.missing.length} token(s) --ml-* SEM MAPA — cairão no fallback Material:`);
    console.log(`      ${sheet.missing.join(' ')}`);
    console.log(`      acrescente em harness/molecules.mjs → ML_TOKEN_MAP\n`);
  }
}

// ── 4. page.html autocontido (abre em file://) ──────────────────────────────────
console.log('[4/4] page.html (autocontido)');

// o nome da tag sai do @customElement da própria página
const pageSrc = readFileSync(pageTs, 'utf8');
const tag = (pageSrc.match(/@customElement\(\s*['"]([^'"]+)['"]/) || [])[1];
if (!tag) {
  console.error('não achei @customElement na página');
  process.exit(1);
}

// os cenários saem da fixture
const fxSrc = readFileSync(fixturePath, 'utf8');
const scenarios = [...fxSrc.matchAll(/^\s{6}(\w+): \{ queryState:/gm)].map((m) => m[1]);

const title = relative(TEST_ROOT, runDir).replace(/\\/g, '/');

// chrome DO HARNESS — não faz parte da página sob teste
const chromeCss = `
  /* altura da barra, num lugar só: a barra a IMPÕE e o quadro a desconta. Antes o desconto era um
     número solto, que passava a mentir assim que a barra mudasse de padding ou de fonte. */
  :root { --bar-h: 38px; }
  /* height nos dois é obrigatório: sem altura definida no ancestral, o calc() do #frame resolve
     percentual contra caixa 'auto' e vira altura de conteúdo — a página cresceria em vez de caber */
  /* overflow: hidden no documento é o que torna a contenção VERIFICÁVEL: sem ele, região que
     estoura ganha uma barra de rolagem no documento e o defeito passa por comportamento normal.
     Com ele, quem estoura é cortado — e corte se vê. A rolagem legítima mora DENTRO da página,
     na região que o layout mandar rolar, nunca aqui. */
  html { overflow: hidden; }
  html, body { height: 100%; margin: 0; background: #6b7280; font-family: system-ui, sans-serif; }
  #bar { position: fixed; inset: 0 0 auto 0; z-index: 9999; display: flex; gap: 6px;
         align-items: center; height: var(--bar-h); box-sizing: border-box;
         padding: 6px 10px; background: #111827; color: #e5e7eb; font-size: 12px; }
  #bar button { font: inherit; padding: 3px 8px; border: 1px solid #374151; border-radius: 4px;
                background: #1f2937; color: #e5e7eb; cursor: pointer; }
  #bar button[aria-pressed="true"] { background: #2563eb; border-color: #2563eb; color: #fff; }
  #bar .sep { margin-left: auto; opacity: .7; }
  /* O quadro é a viewport da página: tela inteira menos a barra. A barra é 'fixed', então não
     ocupa espaço — o margin-top é o que a compensa.
     'overflow: hidden' fica: é ele que faz valer a contenção que o template exige (a página não
     rola como um documento; quem rola são as regiões dela). */
  #frame { width: 100%; margin-top: var(--bar-h); height: calc(100% - var(--bar-h));
           overflow: hidden; }
  #frame > * { display: block; width: 100%; height: 100%; }`;

const barHtml = `<div id="bar">
  <strong>cenário</strong>
  ${scenarios.map((s, i) => `<button data-s="${s}" aria-pressed="${i === 0}">${s}</button>`).join('\n  ')}
  <span class="sep">tema</span>
  <button id="theme">claro</button>
</div>
<div id="frame"><${tag}></${tag}></div>`;

const switcherJs = `
  const el = document.querySelector('${tag}');

  // ── detector de loop de atualização (chrome do harness) ────────────────────
  // Página que escreve estado durante o render entra em loop e trava a aba. Aqui o loop é
  // interrompido e a propriedade culpada é nomeada — em vez de a aba morrer sem diagnóstico.
  (function loopGuard(node) {
    const LIMIT = 400, WINDOW = 3000;
    const counts = new Map();
    let total = 0, t0 = performance.now(), tripped = false;
    const orig = node.requestUpdate.bind(node);
    node.requestUpdate = function (name, oldValue, options) {
      if (tripped) return;
      const now = performance.now();
      if (now - t0 > WINDOW) { t0 = now; total = 0; counts.clear(); }
      total++;
      const key = name === undefined ? '(sem nome)' : String(name);
      counts.set(key, (counts.get(key) || 0) + 1);
      if (total > LIMIT) {
        tripped = true;
        const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
        const detail = top.map(([k, v]) => k + ' \\u00d7' + v).join(' \\u00b7 ');
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#7f1d1d;' +
          'color:#fff;font:12px/1.5 system-ui;padding:8px 12px';
        div.textContent = 'LOOP DE ATUALIZAÇÃO — ' + total + ' pedidos em ' +
          Math.round(now - t0) + 'ms. Atualização interrompida. Propriedades: ' + detail;
        document.body.appendChild(div);
        console.error('[harness] loop de atualização', top);
        return;
      }
      return orig(name, oldValue, options);
    };
  })(el);

  const bar = document.getElementById('bar');
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-s]');
    if (!b) return;
    bar.querySelectorAll('button[data-s]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    el.applyScenario(b.dataset.s);
  });
  const t = document.getElementById('theme');
  t.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    t.textContent = dark ? 'noite' : 'claro';
  });`;

const esbuild = await import('esbuild');
const bundleOut = join(runDir, 'bundle.js');
await esbuild.build({
  entryPoints: [pageTs],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  outfile: bundleOut,
  // Lit + decorators legados do TS exigem useDefineForClassFields desligado,
  // senão o campo de classe sobrescreve o accessor gerado pelo @property
  tsconfigRaw: { compilerOptions: { experimentalDecorators: true, useDefineForClassFields: false } },
  // resolve os imports `/_<id>_/l2/…` das moléculas e do fecho delas
  plugins: [esbuildMlsPlugin(REPO_ROOT)],
  logLevel: 'warning',
});

const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
const dsCss = readFileSync(join(TEST_ROOT, 'designSystem.css'), 'utf8');
const twCss = readFileSync(join(runDir, 'tailwind.css'), 'utf8');
const bundleJs = readFileSync(bundleOut, 'utf8');

writeFileSync(
  join(runDir, 'page.html'),
  `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${title}</title>
<!-- AUTOCONTIDO: nada é carregado de fora. Abre com duplo clique (file://). -->
<style>/* design system */
${dsCss}
</style>
${moleculesCss ? `<style>/* moléculas: mapa --ml-* + css de cada uma */\n${moleculesCss}\n</style>` : '<!-- sem moléculas -->'}
<style>/* tailwind (só as classes que a página usou) */
${twCss}
</style>
${pageCss ? `<style>/* page.less da própria página */\n${pageCss}\n</style>` : '<!-- sem page.less -->'}
<style>/* chrome do harness */${chromeCss}
</style>
</head>
<body>
${barHtml}
<script>${safe(bundleJs)}</script>
<script>${switcherJs}
</script>
</body>
</html>
`,
  'utf8',
);

const kb = (p) => Math.round(readFileSync(p).length / 1024);
console.log(`\n${tscFailed ? 'RODADA COM FALHA DE TIPO' : 'ok'} — tag <${tag}>, cenários: ${scenarios.join(', ')}`);
console.log(`autocontido (duplo clique): ${join(runDir, 'page.html')}  (${kb(join(runDir, 'page.html'))} KB)`);
if (tscFailed) {
  console.log('\n⚠️  o page.html acima foi gerado, mas o tsc FALHOU: a rodada não passa a camada');
  console.log('    mecânica. Use a página para julgar o visual; para artefato válido, refaça a rodada.');
  process.exitCode = 1;
}
