// Suporte a moléculas no harness — compartilhado por qualquer suíte.
//
// O que este módulo resolve, e por que cada parte existe:
//
// 1. RESOLUÇÃO DE PATH. Moléculas importam por caminho absoluto de projeto
//    (`/_102040_/l2/molecules/…`, `/_102033_/l2/moleculeBase.js`). Nem o tsc nem o esbuild
//    conhecem essa convenção, então damos `paths` ao tsc (via tsconfig gerado) e um plugin
//    de resolve ao esbuild. O fecho transitivo é pequeno — moleculeBase, cn, collabDecorators,
//    collabLitElement, collabState, stateLitElement — e compila em `strict` sem ajuste.
//
// 2. CSS. Cada molécula tem `.less` escopado pela própria tag
//    (`groupviewtable--ml-data-table-minimal { … }`). Em produção o CSS é compilado e injetado
//    dentro do JS (`this.loadStyle(css)`), mas aqui isso é desnecessário: os `.less` NÃO usam
//    variável LESS, só custom properties, e as moléculas não têm Shadow DOM. Então
//    `less.render()` puro + um `<style>` global produz exatamente o mesmo resultado, sem o
//    JSON de tokens do design system e sem o staging do mls-ci.
//    Consequência: se a molécula não tiver CSS embutido, ela renderiza SEM ESTILO NENHUM —
//    nem os fallbacks Material, que moram no `.less`. O CSS não é opcional.
//
// 3. MAPA `--ml-*`. Os `.less` consomem um vocabulário próprio (`--ml-surface`, `--ml-primary`…)
//    com fallback Material hardcoded. **Ninguém define esses tokens** — nem a biblioteca de
//    moléculas, nem o design system. Sem o mapa, a página compila, roda, e sai cinza-Material
//    sem erro nenhum. O mapa traduz o vocabulário por papel do DS para o `--ml-*`, e como o
//    `var()` resolve no momento do uso, ele **herda o modo noite de graça**: quando `.dark`
//    troca `--surface-bg`, o `--ml-surface` acompanha sem bloco duplicado.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

/**
 * Todo `mls-<id>` com `l2/` no repo. **Descoberto, não listado**: o esbuild resolve
 * `/_<id>_/` por regex e aceita qualquer projeto, mas o tsc precisa de uma entrada de `paths`
 * por projeto — uma lista fixa aqui faria o tsc falhar (e o esbuild passar) na primeira
 * molécula que importasse de um projeto novo. Descobrir é barato e não envelhece.
 */
export function discoverMlsProjects(repoRoot) {
  return readdirSync(repoRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^mls-\d+$/.test(e.name))
    .map((e) => e.name.slice(4))
    .filter((id) => existsSync(join(repoRoot, `mls-${id}`, 'l2')))
    .sort();
}

/**
 * Mapa PADRÃO do vocabulário por papel do design system para o `--ml-*` das moléculas.
 *
 * **Neutro de propósito.** Este arquivo é compartilhado por toda suíte, então aqui só entram
 * duas coisas: token do design system (com fallback, para o mapa não quebrar se o token sair do
 * DS) e literal de métrica interna de peça, que não é decisão de marca nem de template.
 *
 * Invariante de um template específico — "esta página fixa raio de 4px", "esta página usa
 * transição de 150ms" — **não entra aqui**: vai em `mlTokens` do manifesto daquela suíte, que
 * sobrescreve este padrão. Um valor de template no mapa compartilhado estaria errado para toda
 * suíte que decidisse diferente, e silenciosamente.
 */
export const ML_TOKEN_MAP = {
  // ── tipografia ───────────────────────────────────────────────────────────────
  '--ml-font-family': 'var(--font-family-primary, system-ui, sans-serif)',
  // o DS tem normal(400) e bold(700), sem 500/600. O padrão neutro é o próprio fallback que a
  // molécula declara; suíte que precise de outro peso sobrescreve em mlTokens.
  '--ml-font-weight-medium': '500',

  // ── superfícies e texto ──────────────────────────────────────────────────────
  '--ml-surface': 'var(--surface-bg, #ffffff)',
  '--ml-surface-dim': 'var(--surface-alt-bg, #f5f7fa)',
  '--ml-on-surface': 'var(--text-default, #2f3a48)',
  '--ml-on-surface-muted': 'var(--text-muted, #5d6b7e)',
  // o DS não tem nível "faint"; o mais claro da família muted é o disabled
  '--ml-on-surface-faint': 'var(--text-muted-disabled, #adb5bf)',

  // ── ação primária ────────────────────────────────────────────────────────────
  '--ml-primary': 'var(--button-primary-bg, #1273d4)',
  '--ml-on-primary': 'var(--button-primary-text, #ffffff)',

  // ── contorno e foco ──────────────────────────────────────────────────────────
  '--ml-outline-variant': 'var(--border-default, #cfd8e3)',
  '--ml-outline-focus': 'var(--focus-ring, #7ab8f5)',
  '--ml-outline-error': 'var(--status-error-text, #ab2328)',
  '--ml-focus-ring-color': 'var(--focus-ring, #7ab8f5)',

  // ── estados semânticos ───────────────────────────────────────────────────────
  '--ml-error': 'var(--status-error-text, #ab2328)',
  '--ml-on-error': 'var(--button-danger-text, #ffffff)',
  '--ml-success': 'var(--status-success-text, #25640e)',
  '--ml-success-dim': 'var(--status-success-bg, #e2f5db)',
  '--ml-warning': 'var(--status-warning-text, #775700)',
  '--ml-warning-dim': 'var(--status-warning-bg, #fcf2d7)',
  // o DS tem -bg e -text por status, mas não token de borda: a borda usa a cor do texto
  '--ml-success-border': 'var(--status-success-text, #25640e)',
  '--ml-warning-border': 'var(--status-warning-text, #775700)',
  '--ml-info-border': 'var(--status-info-text, #0b5497)',
  '--ml-error-dim': 'var(--status-error-bg, #fde8e9)',
  '--ml-error-border': 'var(--status-error-text, #ab2328)',
  '--ml-info': 'var(--status-info-text, #0b5497)',
  '--ml-info-dim': 'var(--status-info-bg, #e2effc)',

  // ── forma ────────────────────────────────────────────────────────────────────
  // padrão = o raio do DS. Template com invariante de raio próprio sobrescreve em mlTokens.
  '--ml-radius-sm': 'var(--radius-small, 6px)',
  '--ml-radius-md': 'var(--radius-medium, 10px)',
  '--ml-border-width': '1px',
  '--ml-border-style': 'solid',
  '--ml-focus-ring-width': '2px',

  // ── elevação ─────────────────────────────────────────────────────────────────
  '--ml-shadow-0': 'none',
  '--ml-shadow-1': 'var(--shadow-small, 0 1px 2px rgba(15,23,42,.06))',
  '--ml-shadow-2': 'var(--shadow-medium, 0 4px 12px rgba(15,23,42,.10))',

  // ── movimento ────────────────────────────────────────────────────────────────
  // atenção: os nomes de transição do DS são invertidos (slow=0.2s, fast=0.5s) — fato do DS,
  // não deste mapa. Template com teto de movimento próprio sobrescreve em mlTokens.
  '--ml-transition': 'var(--transition-slow, 0.2s)',

  // ── diversos com literal correto ─────────────────────────────────────────────
  '--ml-disabled-opacity': '0.5',

  // ══ tokens usados por moléculas que este template não atribui ════════════════
  // Mapeados desde já para que uma suíte nova não comece com a tela cinza.

  // superfícies e contêineres extra do vocabulário Material
  '--ml-surface-variant': 'var(--surface-alt-bg, #f5f7fa)',
  '--ml-surface-overlay': 'var(--overlay-backdrop-bg, rgba(9,14,20,.55))',
  '--ml-primary-container': 'var(--selected-bg, #e3f1ff)',
  '--ml-on-primary-container': 'var(--selected-text, #0d5296)',
  '--ml-focus-ring-error-color': 'var(--status-error-text, #ab2328)',
  '--ml-radius-full': 'var(--radius-pill, 999px)',

  // séries de gráfico: o DS declara 6 e manda usar SEMPRE nesta ordem (daltonismo).
  // A biblioteca pede 7 gradientes; o 7º repete a 1ª série — melhor que cor inventada.
  '--ml-gradient-1': 'var(--chart-series-1, #2a78d6)',
  '--ml-gradient-2': 'var(--chart-series-2, #1baf7a)',
  '--ml-gradient-3': 'var(--chart-series-3, #eda100)',
  '--ml-gradient-4': 'var(--chart-series-4, #008300)',
  '--ml-gradient-5': 'var(--chart-series-5, #4a3aa7)',
  '--ml-gradient-6': 'var(--chart-series-6, #e34948)',
  '--ml-gradient-7': 'var(--chart-series-1, #2a78d6)',
  '--ml-on-gradient-1': 'var(--button-primary-text, #ffffff)',
  '--ml-on-gradient-5': 'var(--button-primary-text, #ffffff)',
  '--ml-on-gradient-6': 'var(--button-primary-text, #ffffff)',
  '--ml-on-gradient-7': 'var(--button-primary-text, #ffffff)',

  // ── métricas internas de molécula: literais de propósito ─────────────────────
  // Não têm (nem devem ter) contraparte de papel no design system — são dimensões de peça,
  // não decisão de marca. Ficam aqui só para o aviso de "token sem mapa" não disparar à toa.
  '--ml-spinner-size': '16px',
  '--ml-spinner-border-width': '2px',
  '--ml-spinner-duration': '800ms',
  '--ml-skeleton-duration': '1.2s',
  '--ml-nrs-track-height': '4px',
  '--ml-nrs-handle-size': '16px',
  '--ml-nrs-knob-size': '16px',
  '--ml-nrs-knob-border-width': '2px',
  '--ml-nrs-knob-active-scale': '1.1',
  '--ml-nrs-tooltip-font-size': '12px',
  '--ml-nrs-tooltip-line-height': '1.3',
  '--ml-nrs-tooltip-offset': '8px',
  '--ml-nrs-tooltip-padding': '4px 8px',
};

/**
 * A caixa REAL do nome de um diretório, lida da listagem do pai.
 *
 * Necessário porque em sistema de arquivos case-insensitive (Windows, macOS por padrão) um caminho
 * com a caixa errada existe e resolve — então comparar strings de caminho nunca revelaria a
 * divergência, e o import quebraria só num sistema case-sensitive, longe de onde foi escrito.
 */
function realDirName(dirPath) {
  const parent = dirname(dirPath);
  const wanted = basename(dirPath);
  if (!existsSync(parent)) return wanted;
  const hit = readdirSync(parent).find((e) => e.toLowerCase() === wanted.toLowerCase());
  return hit ?? wanted;
}

/** `/_102040_/l2/x/y.js` → caminho real no repo, tentando `.js`→`.ts`, `+.ts` e `/index.ts`. */
export function resolveMlsPath(specifier, repoRoot) {
  const m = /^\/_(\d+)_\/(.*)$/.exec(specifier);
  if (!m) return null;
  const base = join(repoRoot, `mls-${m[1]}`, m[2]);
  const candidates = [base, base.replace(/\.js$/, '.ts'), `${base}.ts`, join(base, 'index.ts')];
  return candidates.find((c) => existsSync(c)) ?? null;
}

/** Plugin de resolve para o esbuild. */
export function esbuildMlsPlugin(repoRoot) {
  return {
    name: 'mls-paths',
    setup(build) {
      build.onResolve({ filter: /^\/_\d+_\// }, (args) => {
        const path = resolveMlsPath(args.path, repoRoot);
        return path ? { path } : { errors: [{ text: `não resolveu ${args.path}` }] };
      });
    },
  };
}

/** Entradas de `paths` para o tsconfig da rodada, relativas a `runDir`. */
export function tsconfigPaths(runDirToRepoRoot, repoRoot) {
  const paths = {};
  for (const id of discoverMlsProjects(repoRoot)) {
    paths[`/_${id}_/l2/*`] = [`${runDirToRepoRoot}/mls-${id}/l2/*`];
  }
  return paths;
}

/**
 * Descobre as moléculas que a página importa, na ordem em que aparecem.
 * Devolve `{ specifier, group, name, lessPath }`.
 */
export function findUsedMolecules(pageSource, repoRoot) {
  const out = [];
  const seen = new Set();
  // O segmento de grupo casa em QUALQUER caixa de propósito. A pasta real é minúscula, mas em
  // sistema de arquivos case-insensitive (Windows/macOS) um import em camelCase resolve e compila
  // — e se a descoberta aqui exigisse minúscula, o harness não acharia a molécula, não geraria o
  // CSS dela, e a página sairia com a molécula SEM ESTILO e sem aviso nenhum. Casar em qualquer
  // caixa e resolver pelo caminho real é o que impede esse silêncio.
  const re = /['"](\/_\d+_\/l2\/molecules\/([A-Za-z0-9]+)\/(ml-[a-z0-9-]+)\.js)['"]/g;
  for (const m of pageSource.matchAll(re)) {
    const [, specifier, group, name] = m;
    if (seen.has(specifier)) continue;
    seen.add(specifier);
    const ts = resolveMlsPath(specifier, repoRoot);
    const lessPath = ts ? ts.replace(/\.ts$/, '.less') : null;
    out.push({
      specifier,
      group,
      name,
      // A caixa do import pode não ser a real. Em sistema case-insensitive, `existsSync` do caminho
      // errado dá true e `basename` só devolveria o que já veio escrito — então o nome canônico tem
      // de sair da LISTAGEM do diretório, que é a única fonte da caixa de verdade.
      canonicalGroup: ts ? realDirName(dirname(ts)) : group,
      lessPath: lessPath && existsSync(lessPath) ? lessPath : null,
    });
  }
  return out;
}

/** Todo `--ml-*` que os `.less` das moléculas usadas consomem. */
export function collectMlTokens(molecules) {
  const used = new Set();
  for (const { lessPath } of molecules) {
    if (!lessPath) continue;
    const src = readFileSync(lessPath, 'utf8');
    // só dentro de var(--ml-…): o nome da tag também casa com /--ml-[a-z-]+/
    for (const m of src.matchAll(/var\(\s*(--ml-[a-z0-9-]+)/g)) used.add(m[1]);
  }
  return [...used].sort();
}

/**
 * As skills de `usage` que a rodada recebe, declaradas no **manifesto da suíte**
 * (`test/<style>/<template>/molecules.json`, campo `groups`).
 *
 * Manifesto explícito em vez de dedução a partir do texto do template: dá para saber o que a
 * rodada recebe sem interpretar prosa, e permite mandar o contrato de um grupo antes de o
 * template atribuí-lo. O preço é duplicação — por isso existe `crossCheckManifest` abaixo.
 *
 * O `usage` é escrito **por grupo**, não por variante ("All implementations share the same slot
 * tag contract"), então a lista é de grupos, e é bem menor que a de moléculas.
 */
export function collectUsageSkills(manifestPath, repoRoot) {
  if (!existsSync(manifestPath)) return { found: [], missing: [], groups: [] };
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const groups = Array.isArray(manifest.groups) ? manifest.groups : [];

  const skillsRoot = join(repoRoot, 'mls-102020', 'l2', 'aura', 'molecules', 'skills');
  const byLower = new Map();
  if (existsSync(skillsRoot)) {
    for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
      if (entry.isDirectory()) byLower.set(entry.name.toLowerCase(), entry.name);
    }
  }

  const found = [];
  const missing = [];
  for (const group of groups) {
    const dir = byLower.get(group.toLowerCase());
    const file = dir ? join(skillsRoot, dir, 'usage.ts') : null;
    if (!file || !existsSync(file)) {
      missing.push(group);
      continue;
    }
    // o usage.ts é `export const skill = \`…\`` — o que interessa é o conteúdo do literal
    const src = readFileSync(file, 'utf8');
    const m = /export const skill\s*=\s*`([\s\S]*)`\s*;?\s*$/.exec(src.trim());
    found.push({ group, dir, file, body: (m ? m[1] : src).trim() });
  }
  return { found, missing, groups };
}

/**
 * Compara o manifesto com as moléculas que o template de fato atribui.
 *
 * Existe porque manifesto explícito duplica a decisão do template: acrescentar molécula lá sem
 * acrescentar o grupo aqui deixaria a rodada **sem o contrato** da molécula que ela é obrigada a
 * usar — e o sintoma seria a rodada inventando props, não um erro.
 *
 * `notInManifest` é o caso grave. `notInTemplate` é só folga deliberada.
 */
export function crossCheckManifest(manifestGroups, templatePath) {
  if (!existsSync(templatePath)) return { notInManifest: [], notInTemplate: [] };
  const template = readFileSync(templatePath, 'utf8');
  const inTemplate = new Set(
    [...template.matchAll(/(group[a-z]+)--ml-[a-z0-9-]+/g)].map((m) => m[1].toLowerCase()),
  );
  const inManifest = new Set(manifestGroups.map((g) => g.toLowerCase()));
  return {
    notInManifest: [...inTemplate].filter((g) => !inManifest.has(g)).sort(),
    notInTemplate: [...inManifest].filter((g) => !inTemplate.has(g)).sort(),
  };
}

/** Junta as skills num documento só, para a rodada ler um arquivo em vez de treze. */
export function buildUsageBundle(skills) {
  const head =
    `# Molecule usage — contracts for the groups this template assigns\n\n` +
    `> Generated per run by the harness from the template's molecule assignment. One section per\n` +
    `> GROUP: every variant of a group shares the same slot/prop/event contract.\n` +
    `>\n` +
    `> **Read these as CONTRACT only.** They were written for the declarative template engine, so\n` +
    `> examples may show moustache bindings (\`value="{{…}}"\`) and legacy tag spellings. Take the\n` +
    `> property names, event names and detail shapes, the slot tags and the token list — never the\n` +
    `> syntax. The TagName always comes from the template's assignment, and binding is always Lit\n` +
    `> property/event.\n\n---\n\n`;
  return head + skills.map((s) => s.body).join('\n\n---\n\n') + '\n';
}

/** Os `mlTokens` que a suíte declara para sobrescrever o mapa padrão. */
export function readSuiteMlTokens(manifestPath) {
  if (!existsSync(manifestPath)) return {};
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return manifest.mlTokens && typeof manifest.mlTokens === 'object' ? manifest.mlTokens : {};
}

/**
 * Monta a folha do mapa `--ml-*` para as moléculas usadas.
 *
 * `overrides` vem do `mlTokens` do manifesto da suíte e é onde mora o invariante do template
 * daquela suíte — o mapa padrão fica neutro.
 *
 * Devolve `{ css, used, missing }` — `missing` são tokens consumidos e não mapeados, que cairiam
 * silenciosamente no fallback Material. Quem chama decide se isso é falha.
 */
export function buildMlTokenSheet(molecules, overrides = {}) {
  const map = { ...ML_TOKEN_MAP, ...overrides };
  const used = collectMlTokens(molecules);
  const missing = used.filter((t) => !(t in map));
  const lines = used
    .filter((t) => t in map)
    .map((t) => `  ${t}: ${map[t]};`);
  const css = lines.length
    ? `/* mapa --ml-* → tokens do design system (gerado por harness/molecules.mjs).\n` +
      `   Herda o modo noite de graça: o var() resolve no uso, então .dark trocando\n` +
      `   --surface-bg leva --ml-surface junto, sem bloco duplicado. */\n` +
      `:root {\n${lines.join('\n')}\n}\n`
    : '';
  return { css, used, missing };
}
