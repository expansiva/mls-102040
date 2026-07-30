// Camada mecânica de verificação de uma rodada — regras genéricas de higiene de token/cor que dão
// para checar por texto. O que não dá para checar sem interpretar sai como INFO, não como falha.
// Diagnóstico de apoio, não critério de aprovação — quem decide é a leitura de page.html contra o
// passe final do template daquela suíte.
//
//   node harness/checks.mjs <style>/<template> runs/<id> fixtures/<fixture>.defs.ts

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
// test/ — raiz compartilhada: harness/ e designSystem.css moram aqui, comuns a todo style.
const TEST_ROOT = resolve(HERE, '..');

const [suiteArg, runArg, fixtureArg] = process.argv.slice(2);
if (!suiteArg || !runArg || !fixtureArg) {
  console.error('uso: node harness/checks.mjs <style>/<template> runs/<id> fixtures/<fixture>.defs.ts');
  process.exit(1);
}
const SUITE_ROOT = resolve(TEST_ROOT, suiteArg);
const runDir = resolve(SUITE_ROOT, runArg);
const pagePath = join(runDir, 'page.ts');
const dsPath = join(TEST_ROOT, 'designSystem.css');

if (!existsSync(pagePath)) {
  console.log(`sem page.ts em ${runArg} — nada a checar (rodada de recusa?)`);
  process.exit(0);
}

const page = readFileSync(pagePath, 'utf8');
const ds = readFileSync(dsPath, 'utf8');
const fx = readFileSync(resolve(SUITE_ROOT, fixtureArg), 'utf8');

const results = [];
const ok = (name, detail = '') => results.push({ level: 'OK', name, detail });
const bad = (name, detail) => results.push({ level: 'FALHA', name, detail });
const info = (name, detail) => results.push({ level: 'INFO', name, detail });

// ── 1. cor: hex solto (fora do fallback de var()) ───────────────────────────────
const withoutVarFallbacks = page.replace(/var\(\s*--[\w-]+\s*,\s*[^)]*\)/g, 'var()');
const looseHex = [...withoutVarFallbacks.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
looseHex.length ? bad('hex solto', [...new Set(looseHex)].join(' ')) : ok('nenhum hex fora de var()');

// ── 2. tokens existem no design system ─────────────────────────────────────────
const dsTokens = new Set([...ds.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]));
const used = [...new Set([...page.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]))];
const unknown = used.filter((t) => !dsTokens.has(t));
unknown.length
  ? bad('token inexistente no design system', unknown.join(' '))
  : ok(`${used.length} tokens usados, todos existem`);

// ── 3. sem fallback dentro do var() ────────────────────────────────────────────
const noFallback = [...page.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]);
noFallback.length
  ? bad('var() sem fallback', [...new Set(noFallback)].join(' '))
  : ok('todo var() tem fallback');

// ── 4. dark: em cor tokenizada ─────────────────────────────────────────────────
const darkVariant = [...page.matchAll(/dark:[\w-]*\[var\(/g)].map((m) => m[0]);
darkVariant.length ? bad('dark: em cor tokenizada', darkVariant.join(' ')) : ok('nenhum dark: tokenizado');

// ── 5. zebra ───────────────────────────────────────────────────────────────────
const zebra = [...page.matchAll(/\b(odd:|even:|nth-child)/g)].map((m) => m[0]);
zebra.length ? bad('zebra na grade', [...new Set(zebra)].join(' ')) : ok('sem zebra');

// ── 6. dígitos tabulares ───────────────────────────────────────────────────────
page.includes('tabular-nums')
  ? ok('tabular-nums presente')
  : bad('tabular-nums ausente', 'coluna numérica sem dígitos tabulares');

// ── 7. transições ≤ 200ms ──────────────────────────────────────────────────────
const durations = [
  ...[...page.matchAll(/duration-\[(\d+)ms\]/g)].map((m) => Number(m[1])),
  ...[...page.matchAll(/duration-(\d{2,4})\b/g)].map((m) => Number(m[1])),
];
const slow = durations.filter((d) => d > 200);
slow.length
  ? bad('transição acima de 200ms', slow.join('ms, ') + 'ms')
  : ok(durations.length ? `transições: ${[...new Set(durations)].join('ms, ')}ms` : 'nenhuma duração explícita');

// ── 8. anel de foco ────────────────────────────────────────────────────────────
// Só se aplica ao que a PÁGINA desenha. Quando todo controle é molécula, o foco é responsabilidade
// dela (e ela o desenha com os próprios tokens) — exigir da página seria falso positivo.
const ownControls = (page.match(/<(button|input|select|textarea)\b/g) || []).length;
if (/focus(-visible)?:(ring|outline)/.test(page)) {
  ok('anel de foco presente');
} else if (ownControls === 0) {
  ok('anel de foco', 'não se aplica — a página não desenha controle próprio (todos são molécula)');
} else {
  bad('anel de foco ausente', `${ownControls} controle(s) próprio(s) sem focus:ring / focus-visible:outline`);
}

// ── 9. colunas ─────────────────────────────────────────────────────────────────
// Contar <th> não serve como veredito: o cabeçalho pode ser gerado em laço. Fica como indício —
// a contagem que vale é a que a rodada relatou e a que se vê no screenshot.
const th = (page.match(/<th\b/g) || []).length;
info('colunas', `${th} <th> literais no fonte — indício só (cabeçalho pode ser gerado em laço)`);

// ── 10. sombra (permitida só em sobreposição) ──────────────────────────────────
const shadows = [...page.matchAll(/\bshadow-[\w[\]/.-]+/g)].map((m) => m[0]);
shadows.length ? info('sombras encontradas', [...new Set(shadows)].join(' ') + ' — conferir se só em diálogo/notificação')
  : ok('nenhuma sombra');

// ── 11. nome técnico em texto visível ──────────────────────────────────────────
const forbidden = new Set(['page', 'pageSize']);
for (const m of fx.matchAll(/^\s*id: '(\w+)'/gm)) forbidden.add(m[1]);
for (const m of fx.matchAll(/\{ name: '(\w+)'/g)) forbidden.add(m[1]);
// Só texto que de fato vai para a tela: tira as expressões ${...} (com aninhamento),
// pega o que está entre tags, e descarta o que tem cara de código.
const stripExpr = (src) => {
  let out = '';
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '$' && src[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') depth--;
        i++;
      }
      i--;
      out += '';
    } else out += src[i];
  }
  return out;
};
const CODEISH = /[;={}[\]()`]|=>|\bRecord\b|\bstring\b|\bnumber\b|\bboolean\b|\bconst\b|\breturn\b/;
const textNodes = [...stripExpr(page).matchAll(/>([^<>\n]{2,})</g)]
  .map((m) => m[1].trim())
  .filter((t) => t && !CODEISH.test(t));
const leaks = [];
for (const t of textNodes) {
  for (const w of forbidden) {
    if (new RegExp(`\\b${w}\\b`).test(t)) leaks.push(`"${t}" (${w})`);
  }
}
leaks.length ? bad('nome técnico visível', leaks.slice(0, 6).join(' · ')) : ok('nenhum nome técnico em texto visível');

// ── 12. dois vazios distintos (heurística) ─────────────────────────────────────
// Só se aplica quando a fixture TEM filtro: sem nenhum filtro na consulta, o estado
// "vazio após filtrar" é inalcançável e exigi-lo seria falso positivo.
const filterStates = [...fx.matchAll(/state: '(\w*(?:Filter|Only|SearchTerm|SearchName)\w*)'/g)].map((m) => m[1]);
const sentences = [...new Set(textNodes.filter((t) => t.split(/\s+/).length >= 3))];
if (filterStates.length === 0) {
  ok('vazio por filtro', 'não se aplica — a consulta desta fixture não tem filtro');
} else if (filterStates.some((s) => page.includes(s))) {
  info('vazio por filtro', `a página lê estado de filtro; ${sentences.length} frases literais — conferir se os dois vazios têm textos diferentes`);
} else {
  bad('vazio por filtro', 'a fixture tem filtro, mas a página não lê nenhum para distinguir os dois vazios');
}

// ── saída ──────────────────────────────────────────────────────────────────────
const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
console.log(`\n${runArg}\n${'─'.repeat(78)}`);
for (const r of results) {
  console.log(`${pad(r.level, 6)} ${pad(r.name, 34)} ${r.detail}`);
}
const fails = results.filter((r) => r.level === 'FALHA').length;
console.log('─'.repeat(78));
console.log(`${fails} falha(s), ${results.filter((r) => r.level === 'INFO').length} info\n`);
process.exit(fails ? 1 : 0);
