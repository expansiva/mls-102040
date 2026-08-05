// Relatório determinístico de uma rodada. A geração só acrescenta decisões que não podem ser
// inferidas, em generation-meta.json; o restante é medido pelo harness.

import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEST_ROOT = resolve(HERE, '..');
const argv = process.argv.slice(2);
const [suiteArg, runArg, fixtureArg] = argv;
const value = (name, fallback = '') => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

if (!suiteArg || !runArg || !fixtureArg) {
  console.error('uso: node harness/report.mjs <style>/<template> runs/<id> fixtures/<fixture>.defs.ts [opções]');
  process.exit(1);
}

const runDir = resolve(TEST_ROOT, suiteArg, runArg);
const rel = (path) => relative(TEST_ROOT, path).replace(/\\/g, '/');
const file = (name) => {
  const path = join(runDir, name);
  return existsSync(path) ? { name, bytes: statSync(path).size } : null;
};
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const files = ['prompt.md', 'generation-input.md', 'template.md', 'molecules-usage.md', 'page.ts', 'page.less', 'page.html', 'bundle.js']
  .map(file)
  .filter(Boolean);

const pagePath = join(runDir, 'page.ts');
const imports = existsSync(pagePath)
  ? [...readFileSync(pagePath, 'utf8').matchAll(/['"]\/_\d+_\/l2\/molecules\/([a-z0-9]+)\/(ml-[a-z0-9-]+)\.js['"]/g)]
      .map((m) => `${m[1]}--${m[2]}`)
  : [];

const metaPath = join(runDir, 'generation-meta.json');
let meta = null;
let metaError = null;
if (existsSync(metaPath)) {
  try {
    meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  } catch (error) {
    metaError = error instanceof Error ? error.message : String(error);
  }
}

const renderEntries = (entries) => {
  if (!Array.isArray(entries) || entries.length === 0) return [];
  return entries.map((entry) => {
    if (typeof entry === 'string') return `- ${entry}`;
    const fields = ['owner', 'kind', 'subject', 'decision', 'impact']
      .filter((key) => entry?.[key])
      .map((key) => `${key}: ${entry[key]}`);
    return `- ${fields.join(' · ') || JSON.stringify(entry)}`;
  });
};

const lines = [
  '# Template run report',
  '',
  `- Suite: \`${suiteArg}\``,
  `- Fixture: \`${fixtureArg}\``,
  `- Layout: ${value('layout') ? `\`${value('layout')}\`` : '(none)'}`,
  `- Build: ${value('build-status') === '0' ? 'passed' : `failed (status ${value('build-status')})`}`,
  `- Checks: ${value('checks-status') === '0' ? 'passed' : `failed (status ${value('checks-status')})`}`,
  value('generation-ms') ? `- Generation: ${value('generation-ms')} ms` : '- Generation: not measured (only-build or external generation)',
  '',
  '## Artifacts',
  '',
  ...files.map((entry) => `- \`${entry.name}\`: ${entry.bytes.toLocaleString('en-US')} bytes (${kb(entry.bytes)})`),
  '',
  '## Molecules imported by page.ts',
  '',
  ...(imports.length ? imports.map((entry) => `- \`${entry}\``) : ['- None found']),
];

if (metaError) {
  lines.push('', '## Generation metadata', '', `- Invalid \`generation-meta.json\`: ${metaError}`);
} else if (meta) {
  lines.push('', '## Generation metadata', '');
  if (meta.refusal?.reason) lines.push(`- Refusal: ${meta.refusal.reason}`);
  if (meta.fixedValues && typeof meta.fixedValues === 'object') {
    lines.push('- Fixed values:');
    for (const [key, val] of Object.entries(meta.fixedValues)) lines.push(`  - \`${key}\`: ${JSON.stringify(val)}`);
  }
  const ambiguities = renderEntries(meta.ambiguities);
  if (ambiguities.length) lines.push('', '### Ambiguities', '', ...ambiguities);
  const gaps = renderEntries(meta.contractGaps);
  if (gaps.length) lines.push('', '### Contract gaps', '', ...gaps);
}

const reportPath = join(runDir, 'report.md');
writeFileSync(reportPath, `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`, 'utf8');
console.log(`relatório do harness: ${rel(reportPath)}`);
