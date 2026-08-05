// Gera o stub da classe base a partir de uma fixture.
// O stub tem a MESMA superfície que o shared de produção daria à página (propriedades de dado e
// estado, setters, handlers, this.msg) — mas alimentado pelo seed, sem BFF e sem rede.
//
//   node harness/makeStub.mjs fixtures/<fixture>.defs.ts runs/<id>/stub.ts
//
// Quem troca de cenário é o harness, chamando applyScenario(nome) no elemento.
//
// A CONSULTA É OPCIONAL, e a forma da saída decide o que a página recebe:
//
//   sem `query`          só comandos — página de formulário sobre um registro
//                        (entityRecordManagement, fieldDataCapture: 2 dos 3 casos reais do 102045
//                        não declaram consulta nenhuma)
//   kind: 'paginated'    coleção fatiada por página: { <array>: Row[]; <total>: number }
//   kind: 'list'         coleção inteira, sem paginação: Row[]
//   kind: 'object'       UM registro: Row (a primeira linha do seed) — é o que dá à página de
//                        registro os valores salvos, e com eles o modo de edição, o esqueleto de
//                        carregamento e a falha de carga

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const [fixturePath, outPath] = process.argv.slice(2);
if (!fixturePath || !outPath) {
  console.error('uso: node makeStub.mjs <fixture.defs.ts> <out/stub.ts>');
  process.exit(1);
}

// A fixture é JS válido a menos do `as const` — tira e importa.
const raw = readFileSync(fixturePath, 'utf8');
const tmp = resolve(tmpdir(), `fixture-${Date.now()}.mjs`);
writeFileSync(tmp, raw.replace(/\s+as const;/g, ';'), 'utf8');
const { fixture: fx } = await import(pathToFileURL(tmp).href);

const j = (v) => JSON.stringify(v, null, 2).replace(/\n/g, '\n  ');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── consulta: opcional ─────────────────────────────────────────────────────────
// Página que é só formulário não tem consulta. Antes isto estourava aqui mesmo
// (`fx.query.output.item` de undefined), o que obrigava a inventar uma consulta só para o stub
// existir — e consulta inventada é dado que a página não deveria ter, então o teste passava a
// medir outra coisa. Sem consulta o stub sai só com os comandos, e a página não recebe nada para
// listar.
const q = fx.query ?? null;
const qb = q ? fx.binding?.queries?.[q.id] : null;
if (q && !qb) {
  console.error(`  ✗ a fixture declara a consulta "${q.id}" mas binding.queries não a amarra`);
  process.exit(1);
}
const cmdBindings = Object.keys(fx.binding?.commands ?? {}).length;
if (!q && cmdBindings === 0) {
  console.error('  ✗ fixture sem consulta E sem comando amarrado: não há superfície nenhuma para a página');
  process.exit(1);
}

// ── tipos ──────────────────────────────────────────────────────────────────────
const tsType = (t) => (t === 'number' ? 'number' : t === 'boolean' ? 'boolean' : 'string');
const itemType = q ? `${cap(fx.entity)}Row` : null;
const itemFields = q ? q.output.item.map((f) => `  ${f.name}: ${tsType(f.type)} | null;`).join('\n') : '';

const isPaginated = q?.output?.kind === 'paginated';
// UM registro, não uma coleção de um: a página lê `Row | null` e não tem lista para percorrer.
const isSingle = q?.output?.kind === 'object';

// ── paginação ──────────────────────────────────────────────────────────────────
// O seed traz uma amostra de linhas e o cenário declara um `total` maior — sem sintetizar o
// restante, toda página devolveria a mesma amostra e a paginação seria decorativa (era o caso:
// a reconsulta reaplicava o cenário e ignorava a página pedida).
//
// A escolha do campo de identidade vem SÓ dos metadados da fixture, nunca do template:
// `<entity>Id`, senão o primeiro string terminado em "id", senão o primeiro string. O sufixo por
// linha é funcional, não decorativo — a página resolve seleção por id (`rows.find(...)`), e id
// repetido entre páginas faria a linha 1 da página 2 casar com a seleção da página 1.
const pageState = qb?.inputs?.page?.state;
const pageSizeState = qb?.inputs?.pageSize?.state;
const canPaginate = isPaginated && !!pageState && !!pageSizeState;

const items = q?.output?.item ?? [];
const idField =
  items.find((f) => f.name.toLowerCase() === `${String(fx.entity).toLowerCase()}id`)?.name ??
  items.find((f) => /id$/i.test(f.name) && f.type === 'string')?.name ??
  items.find((f) => f.type === 'string')?.name;
// concatenação em vez de template literal: o stub inteiro já é gerado dentro de um template,
// e aninhar backticks aqui só produziria escape ilegível
const rowMarks = [
  idField && `${idField}: String(base.${idField} ?? 'row') + '-' + (i + 1)`,
].filter(Boolean);

// Uma fixture com dois totais é armadilha: um deles vira o que a página anuncia e o outro fica
// como comentário mentiroso. Resolver em silêncio esconde a divergência, então avisa.
if (canPaginate) {
  const seedTotal = fx.seed?.total ?? fx.seed?.rows?.length ?? 0;
  const rowCount = fx.seed?.rows?.length ?? 0;
  const conflicting = Object.entries(fx.seed?.scenarios ?? {})
    .filter(([, s]) => s.useSeedRows && s.total != null && Number(s.total) !== Number(seedTotal))
    .map(([name, s]) => `${name} declara total ${s.total}`);
  if (conflicting.length) {
    console.warn(
      `  ⚠️  totais divergentes no seed: seed.total = ${seedTotal}, mas ${conflicting.join('; ')}.\n` +
        `      Vale seed.total (${seedTotal}); o total do cenário só distingue vazio de populado.\n` +
        `      Remova o campo dos cenários com useSeedRows, ou alinhe com seed.total.`
    );
  }
  // Ciclar a amostra é rede de segurança, não o caminho desejado: linhas repetidas com o mesmo
  // conteúdo tornam a troca de página indistinguível a olho. Fixture correta traz rows.length
  // igual a seed.total.
  if (rowCount > 0 && seedTotal > rowCount) {
    console.warn(
      `  ⚠️  seed incompleto: total ${seedTotal} mas só ${rowCount} linhas — o stub cicla a amostra\n` +
        `      para preencher, e páginas diferentes exibem conteúdo repetido. Complete rows até ${seedTotal}.`
    );
  }
}

const paginationMembers = canPaginate
  ? `
  /**
   * Dataset completo do cenário: o seed ciclado até \`total\`.
   *
   * O sufixo no campo de identidade mantém a chave única entre páginas; o restante da linha é o
   * dado do seed, sem marca visível. Como as páginas repetem a amostra, distinga "trocou de
   * página" pela contagem de linhas da última página e pelo estado da paginação, não pelo texto.
   */
  private __dataset(): ${itemType}[] {
    const seed = (SEED.rows ?? []) as unknown as ${itemType}[];
    if (seed.length === 0) return [];
    // SEED.total é a ÚNICA autoridade de tamanho da coleção. O \`total\` do cenário descreve
    // apenas o estado (0 = sem linhas) e não dimensiona nada: quando os dois discordavam, a
    // página anunciava um número e o seed continha outro.
    const total = Number(SEED.total ?? seed.length) || seed.length;
    if (total <= seed.length) return seed.slice(0, total);
    const out: ${itemType}[] = [];
    for (let i = 0; i < total; i += 1) {
      const base = seed[i % seed.length];
      out.push({ ...base${rowMarks.length ? `, ${rowMarks.join(', ')}` : ''} });
    }
    return out;
  }

  /**
   * Fatia a página corrente, como um BFF faria.
   *
   * Sem clamp de propósito: página fora de faixa devolve vazio, igual a um backend de verdade.
   * Clampar esconderia o bug de a página não voltar para 1 ao trocar filtro.
   */
  private __pageSlice(rows: ${itemType}[]): ${itemType}[] {
    const size = Number(this.${pageSizeState}) || 0;
    if (size <= 0) return rows;
    const page = Math.max(1, Number(this.${pageState}) || 1);
    return rows.slice((page - 1) * size, page * size);
  }
`
  : '';
const dataType = !q
  ? null
  : isPaginated
    ? `{ ${q.output.arrayField}: ${itemType}[]; ${q.output.totalField}: number }`
    : isSingle
      ? `${itemType}`
      : `${itemType}[]`;

// ── propriedades ───────────────────────────────────────────────────────────────
const lines = [];
const decl = (name, type, init) => lines.push(`  @property({ attribute: false }) ${name}: ${type} = ${init};`);

if (qb) {
  lines.push('  // consulta');
  decl(qb.data, `${dataType} | null`, 'null');
  decl(qb.state, `'' | 'loading' | 'success' | 'error'`, `''`);
  decl(qb.error, 'string', `''`);
  for (const [input, b] of Object.entries(qb.inputs)) {
    const t = tsType(q.inputs.find((i) => i.name === input)?.type ?? 'string');
    decl(b.state, t, t === 'number' ? '0' : t === 'boolean' ? 'false' : `''`);
  }
}

const cmdEntries = Object.entries(fx.binding.commands ?? {});
if (cmdEntries.length) lines.push('', '  // comandos');
for (const [cmdId, cb] of cmdEntries) {
  const spec = fx.commands.find((c) => c.id === cmdId);
  decl(cb.state, `'' | 'loading' | 'success' | 'error'`, `''`);
  decl(cb.error, 'string', `''`);
  decl(cb.output, 'Record<string, unknown> | null', 'null');
  for (const [input, b] of Object.entries(cb.inputs)) {
    const t = tsType(spec?.inputs.find((i) => i.name === input)?.type ?? 'string');
    decl(b.state, t, t === 'number' ? '0' : t === 'boolean' ? 'false' : `''`);
  }
}

// ── setters ────────────────────────────────────────────────────────────────────
const setters = [];
const mkSetter = (b, type) =>
  setters.push(`  ${b.setter}(value: ${type}): void { this.${b.state} = value; }`);
if (qb) {
  for (const [input, b] of Object.entries(qb.inputs)) {
    mkSetter(b, tsType(q.inputs.find((i) => i.name === input)?.type ?? 'string'));
  }
}
for (const [cmdId, cb] of cmdEntries) {
  const spec = fx.commands.find((c) => c.id === cmdId);
  for (const [input, b] of Object.entries(cb.inputs)) {
    mkSetter(b, tsType(spec?.inputs.find((i) => i.name === input)?.type ?? 'string'));
  }
}

// ── handlers ───────────────────────────────────────────────────────────────────
const handlers = [];
if (qb) {
  handlers.push(`  ${qb.handler}(): void {
    // reconsulta: reaplica o cenário corrente${canPaginate ? ' — refatia pela página pedida' : ''}
    this.applyScenario(this.__scenario);
  }`);
}
for (const [cmdId, cb] of cmdEntries) {
  const spec = fx.commands.find((c) => c.id === cmdId);
  const canned = Object.fromEntries((spec?.output ?? []).map((f) => [f.name, f.type === 'number' ? 1 : f.type === 'boolean' ? true : `${f.name}-stub`]));
  handlers.push(`  ${cb.handler}(): void {
    this.${cb.state} = 'loading';
    this.${cb.error} = '';
    window.setTimeout(() => {
      this.${cb.state} = 'success';
      this.${cb.output} = ${JSON.stringify(canned)};
    }, 300);
  }`);
}

// ── cenários ───────────────────────────────────────────────────────────────────
const filterInputs = Object.entries(qb?.inputs ?? {}).filter(([n]) => !['page', 'pageSize'].includes(n));
const applyFilters = filterInputs
  .map(([input, b]) => {
    const t = tsType(q.inputs.find((i) => i.name === input)?.type ?? 'string');
    const on = t === 'boolean' ? 'true' : t === 'number' ? '1' : `'filtro'`;
    const off = t === 'boolean' ? 'false' : t === 'number' ? '0' : `''`;
    return `      this.${b.state} = filtered ? ${on} : ${off};`;
  })
  .join('\n');

// `all.length` e não `s.total`: o total tem de descrever o dataset que o stub realmente serve,
// senão a molécula desenha 3 páginas para uma amostra de 1 (era exatamente o sintoma).
// Com `kind: 'object'` a página recebe UM registro, e o cenário vazio o deixa nulo — é o que
// permite distinguir "registro carregado" de "registro que não existe".
const dataExpr = isPaginated
  ? `{ ${q.output.arrayField}: rows, ${q.output.totalField}: all.length }`
  : isSingle
    ? `(rows[0] ?? null)`
    : `rows`;

const rowsExpr = canPaginate
  ? `    const all = s.useSeedRows ? this.__dataset() : [];
      const rows = this.__pageSlice(all);`
  : `    const all = (s.useSeedRows ? SEED.rows : []) as unknown as ${itemType}[];
      const rows = ${isSingle ? 'all.slice(0, 1)' : 'all'};`;

// Sem consulta não há estado de coleção para aplicar. O cenário continua registrado, para o
// harness poder trocá-lo sem quebrar, mas nada na página observa isso: o que ela tem para mostrar
// vem dos comandos e do que o leitor digita.
const scenarioBody = qb
  ? `    const s = (SEED.scenarios as Record<string, any>)[name];
    if (!s) return;
    const filtered = Boolean(s.filtersApplied);
${applyFilters}
    this.${qb.state} = s.queryState;
    this.${qb.error} = s.queryState === 'error' ? String(s.message ?? '') : '';
    if (s.queryState === 'success') {
  ${rowsExpr}
      this.${qb.data} = ${dataExpr};
    } else {
      this.${qb.data} = null;
    }
    this.requestUpdate();`
  : `    // fixture sem consulta: não há dado de coleção para aplicar
    this.requestUpdate();`;

const stub = `// STUB gerado por harness/makeStub.mjs a partir de ${fixturePath.replace(/\\/g, '/')}
// NÃO editar à mão. Mesma superfície do shared de produção, alimentada pelo seed.

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

${q ? `export interface ${itemType} {\n${itemFields}\n}\n` : '// sem consulta declarada: a página não recebe linha nenhuma, então não há tipo de linha\n'}
const SEED = ${j(fx.seed ?? {})} as const;

const I18N: Record<string, string> = ${j(fx.binding.i18n ?? {})};

export class ${fx.binding.baseClass} extends LitElement {
  // o render da página é montado sem shadow DOM (igual à produção)
  protected createRenderRoot(): HTMLElement | DocumentFragment { return this; }

${lines.join('\n')}

  private __scenario: string = 'populated';

${setters.join('\n')}

${handlers.join('\n\n')}

  msg(key: string): string { return I18N[key] ?? key; }
${paginationMembers}
  applyScenario(name: string): void {
    this.__scenario = name;
${scenarioBody}
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.applyScenario(this.__scenario);
  }
}
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, stub, 'utf8');
console.log(`${outPath}: ${fx.binding.baseClass} · ${lines.filter((l) => l.includes('@property')).length} propriedades · ${setters.length} setters · ${handlers.length} handlers`);
