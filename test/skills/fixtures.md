# Skill: escrever uma fixture `.defs.ts` do harness de templates

Como criar `test/<style>/<template>/fixtures/<fixtureId>.defs.ts` — o arquivo que dá **domínio** a
uma rodada de teste de template.

Leia junto: `test/RUN.md` (o protocolo da rodada) e o `template.md` da suíte (o que a página tem de
fazer com estes dados).

## O que a fixture é, e o que ela não é

A fixture é o **contrato de dados** de uma página: o que a consulta devolve, que comandos existem,
como a classe base expõe isso, e dados estáticos para desenhar contra.

**Ela não decide nada de layout nem de aparência.** Nem coluna, nem largura, nem cor, nem ordem de
região. Isso é do `template.md`. Se você se pegar escrevendo "esta coluna fica à direita" numa
fixture, está no arquivo errado.

Também não é um mock de BFF: os handlers não chamam rede. Quem transforma a fixture em classe base
executável é o `harness/makeStub.mjs`, e quem troca de cenário é o harness.

## Onde ela mora e como se chama

```
test/<style>/<template>/fixtures/<fixtureId>.defs.ts
```

`fixtureId` em camelCase, começando pelo módulo/produto quando houver
(`cafeFlowInventoryControl`, `pizzeriaIngredients`, `pharmacyBatches`). O mesmo `fixtureId` vira o
nome do custom element da página, convertido para kebab-case
(`cafeFlowInventoryControl` → `test--cafe-flow-inventory-control-page`).

O arquivo exporta **uma** constante:

```ts
export const fixture = { /* ... */ } as const;
```

O `as const` importa: o `makeStub.mjs` importa o arquivo removendo exatamente esse sufixo para
tratá-lo como JS. Não use outra sintaxe de tipo no arquivo — ele precisa ser JS válido a menos do
`as const`.

## A forma, campo por campo

### Identidade e contexto

| Campo | Papel |
| --- | --- |
| `fixtureId` | igual ao nome do arquivo |
| `domain` | uma linha: setor — o que se controla |
| `moduleContext` | como o produto se apresenta na UI (`'CaféFlow · Estoque'`) |
| `language` | **idioma da UI gerada** (`'pt-BR'`) — a instrução pode estar em inglês, a tela sai neste idioma |
| `actor` | quem usa a página |
| `entity` | nome da entidade em PascalCase (`'StockItem'`) — dele sai `<Entity>Row` |
| `purpose` | uma frase do que o ator faz aqui |

### `query`

A consulta que alimenta a coleção. **Opcional**, e a forma da saída decide o que a página recebe:

| `output.kind` | A página recebe | Para |
| --- | --- | --- |
| `'paginated'` | `{ <array>: Row[]; <total>: number }`, fatiado por página | coleção que não cabe numa página |
| `'list'` | `Row[]`, inteira | coleção pequena, sem paginação |
| `'object'` | `Row \| null` — a primeira linha do seed | página de UM registro: é isso que dá a ela os valores salvos, e com eles o modo de edição, o esqueleto de carregamento e a falha de carga |
| campo ausente | nada: sem propriedade de dado, sem estado de consulta, sem cenário | página que é só formulário |

**Fixture sem `query` é legítima e comum.** Categoria de página que só escreve — `entityRecordManagement`,
`fieldDataCapture` — não tem consulta nenhuma: 2 dos 3 casos reais do 102045 declaram só comandos.
Nesse caso o stub sai só com os comandos, `applyScenario` não tem estado de coleção para aplicar, e a
barra do `page.html` mostra "nenhum — fixture sem consulta" em vez de botões. Não invente uma consulta
para o stub existir: consulta inventada é dado que a página não deveria ter, e o teste passa a medir
outra coisa.

O que **não** dispensa: pelo menos um comando amarrado em `binding.commands`. Sem consulta e sem
comando não há superfície nenhuma, e o `makeStub` recusa.

```ts
query: {
  id: 'listStockItems',
  inputs: [
    { name: 'nameFilter', type: 'string' },
    { name: 'lowStockOnly', type: 'boolean' },
    { name: 'page', type: 'number' },
    { name: 'pageSize', type: 'number' },
  ],
  output: {
    kind: 'paginated',              // ou 'list'
    arrayField: 'stockItems',
    totalField: 'total',
    item: [
      { name: 'stockItemId', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'currentBalance', type: 'number' },
      { name: 'updatedAt', type: 'datetime' },
      { name: 'isLowStock', type: 'boolean' },
    ],
  },
},
```

Coisas que decidem comportamento e por isso precisam de atenção:

- **`page` e `pageSize` nos `inputs` são o que liga a paginação.** Sem os dois, o stub gerado não
  fatia nada e a paginação não existe para ser testada.
- **Não declarar entrada de ordenação tem consequência visível**: sem ela não há ordenação remota, e
  uma coleção que não cabe numa página fica **sem ordenação nenhuma** (ordenar só as linhas em mãos
  mentiria sobre a coleção). Se a suíte precisa exercitar ordenação com várias páginas, declare
  `sortBy`/`sortDirection` — de propósito, não por acaso.
- **O primeiro campo do `item` é tratado como identidade** pelo gerador de stub (preferindo
  `<entity>Id`). Coloque o id primeiro.
- `type` aceita `string`, `number`, `boolean`, `datetime`. Tudo que não é número nem booleano chega
  na página como `string`.

### `commands`

Um por operação que a página dispara.

```ts
commands: [
  {
    id: 'addStockItem',
    inputs: [
      { name: 'name', type: 'string', required: true },
      { name: 'description', type: 'string' },
    ],
    output: [{ name: 'stockItemId', type: 'string' }],
  },
],
```

`required` é o que permite ao template exigir validação de campo. Um comando que recebe só `id`
(mais justificativa opcional) é lido como remoção pelo template — é assim que a zona de perigo
aparece.

### `businessRules`

Frases em prosa, no idioma do domínio, sobre o que é verdade no negócio — não sobre a tela. É daqui
que a página tira, por exemplo, que "estoque baixo" é `currentBalance <= minimumLevel`. Sem essa
regra escrita, a coluna de situação não tem como existir.

### `declaredOptionSets`

Conjuntos de valores **declarados** pelo domínio. **Nunca invente um a partir de texto livre.**

Se a operação diz em prosa "kg, litro, porção ou unidade" mas não declara um enum, o conjunto
**não** vem para cá — fica `[]`, e o campo vira texto livre na página. Essa disciplina é o que faz o
template poder exigir "vocabulário declarado vira seleção; sem vocabulário, é texto livre" sem
produzir select com opções inventadas.

### `binding`

A superfície que a classe base expõe. É o que permite a página compilar em `strict` **sem ler o
stub**.

```ts
binding: {
  baseClass: 'CafeFlowStockManagementBase',
  contract: { /* tipos — ver abaixo */ },
  queries: {
    listStockItems: {
      data: 'listStockItemsData',
      state: 'listStockItemsState',
      error: 'listStockItemsError',
      handler: 'handleListStockItemsClick',
      inputs: {
        nameFilter: { state: 'listStockItemsNameFilter', setter: 'setListStockItemsNameFilter' },
      },
    },
  },
  commands: { /* mesma forma, com `output` */ },
  i18n: { 'stockManagement.title': 'Controlar estoque' },
},
```

O `contract` é a parte que se esquece e faz a rodada travar. Ele descreve **tipos**, não valores:
`itemTypeName`, `itemFields` (todo campo do item é `T | null`), `queryData`, `queryState`,
`queryError`, `commandState`, `commandError`, `commandOutput`, `inputState`, `setter`, `handler`,
`msg`. Copie da fixture de referência e ajuste só o que muda de forma.

O `i18n` alimenta `this.msg(chave)`. Só o que é texto de produto; rótulo de coluna e frase de estado
vazio a página escreve.

### `seed`

Os dados estáticos. Aqui moram os erros mais caros, todos já cometidos:

```ts
seed: {
  total: 61,     // ÚNICA autoridade de tamanho — tem de bater com rows.length
  rows: [ /* 61 objetos */ ],
  scenarios: {
    populated:     { queryState: 'success', useSeedRows: true,  filtersApplied: false },
    emptyNoFilter: { queryState: 'success', useSeedRows: false, total: 0, filtersApplied: false },
    emptyByFilter: { queryState: 'success', useSeedRows: false, total: 0, filtersApplied: true },
    loading:       { queryState: 'loading', useSeedRows: false, total: 0, filtersApplied: false },
    queryError:    { queryState: 'error',   useSeedRows: false, total: 0, filtersApplied: false,
                     message: 'Não foi possível carregar os insumos.' },
  },
},
```

**Um total só.** `seed.total` manda. **Não** ponha `total` num cenário com `useSeedRows: true`: dois
totais divergentes fazem a tela anunciar um número que o seed não tem, e o gerador avisa quando
detecta. Nos cenários vazios o `total: 0` é inofensivo.

**`rows.length` tem de ser igual a `seed.total`.** Se for menor, o stub cicla a amostra para
preencher e **avisa** — páginas diferentes passam a exibir conteúdo repetido, o que torna a troca de
página indistinguível a olho. Rede de segurança, não caminho desejado.

**`total` maior que o tamanho de página** (25, ou 10 quando a linha é alta) ou não há paginação para
testar: com uma página só a molécula de grade esconde a paginação inteira.

**As `rows` carregam casos-limite plantados de propósito.** A rodada lê apenas 3 delas, então as
três primeiras têm de valer: texto longo que obriga truncamento, valor zero, campo nulo que vira
travessão, valor que dispara o estado de alerta. Distribua os casos ao longo do conjunto também —
se todo `isLowStock: true` estiver na primeira página, o filtro parece quebrado na segunda.

Cenário fora de `success` usa `useSeedRows: false`: é o que dá as telas de vazio, carregando e erro.

## O que o harness faz com isso

1. `makeStub.mjs` lê a fixture e escreve `stub.ts` — `@property` de dados e estado, setters,
   handlers, `msg()` e `applyScenario()`. Também sintetiza o dataset e **fatia por página**.
2. `tsc` compila a página contra esse stub, com as flags da plataforma.
3. Tailwind, moléculas e `page.html` autocontido.

Limitação assumida hoje: **o stub não filtra**. Os inputs de filtro existem e são setados, mas a
reconsulta não aplica busca nem booleano — os estados de vazio se alcançam trocando de cenário. Não
escreva fixture contando com filtro funcional.

## Conjunto de fixtures de uma suíte nova

Nesta ordem, porque barateia a depuração — se a referência falhar, o defeito é da fixture ou do
harness, não do template ainda:

1. **Referência** — o caso mais comum e completo; calibra o harness.
2. **Recusa** — um domínio que o template *deveria* recusar. A mais barata, e pega template que não
   sabe parar.
3. **Caso difícil** — o domínio mais carregado que a suíte precisa suportar.
4. **Armadilhas semânticas** — parece encaixar num padrão conhecido mas tem nuance que quebra a
   generalização (uma operação que parece bidirecional e não é).
5. **Mínimo** — o menor domínio que ainda faz a página existir; revela o que o template pressupõe
   sem declarar.

## Conferência antes de rodar

- [ ] `export const fixture = { … } as const;` e nada mais de sintaxe de tipo no arquivo.
- [ ] `fixtureId` = nome do arquivo; `language` é o idioma da **UI**.
- [ ] Id da entidade é o **primeiro** campo do `item`.
- [ ] `page` e `pageSize` declarados se a suíte testa paginação.
- [ ] `seed.total` == `rows.length`, e maior que o tamanho de página.
- [ ] Nenhum cenário com `useSeedRows: true` declara `total`.
- [ ] Sem `query`: nenhum `seed` de linha nem cenário inventado, e ao menos um comando amarrado.
- [ ] `kind: 'object'`: uma linha no seed, e um cenário sem linhas para o registro inexistente.
- [ ] As 3 primeiras `rows` carregam os casos-limite; alertas espalhados por todas as páginas.
- [ ] `declaredOptionSets` só com conjunto realmente declarado — prosa não conta.
- [ ] `binding.contract` completo.
- [ ] Zero decisão de layout, cor ou coluna no arquivo.
- [ ] `node harness/makeStub.mjs` (via `build.mjs`) roda **sem avisos**.

## Erros já cometidos, para não repetir

| Sintoma | Causa |
| --- | --- |
| tela anuncia 61 itens, seed tem 25 | dois totais: `seed.total` e `scenarios.populated.total` divergindo |
| paginação não aparece | `seed.total` ≤ tamanho de página |
| páginas diferentes com conteúdo idêntico | `rows.length` < `seed.total`, stub ciclando a amostra |
| coluna com select de opções inventadas | conjunto extraído de prosa em vez de `declaredOptionSets` |
| grade sem ordenação nenhuma | consulta paginada sem entrada de ordenação declarada |
| rodada não compila por falta de tipo | `binding.contract` incompleto |
