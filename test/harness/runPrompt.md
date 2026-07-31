Você vai gerar uma página web a partir de um documento de design de página. Trabalho de implementação, com contexto limpo: não procure nada além do que está listado aqui.

## 1. Leia estes arquivos, nesta ordem, e nada mais

Todos os caminhos são absolutos.

1. `{{TEMPLATE_PATH}}` — a instrução. Leia inteiro. Chega em partes: regra do estilo, depois o que a página é, depois como ela é arrumada. Cada parte **estreita** a anterior e nunca a contradiz — se encontrar contradição, siga a parte mais específica e relate no fim.
2. `{{FIXTURE_PATH}}` — o domínio. **Pule quase todo o `seed`**: leia apenas o `total` e **3 linhas** de `rows`. Essas 3 linhas não são decoração — é onde moram os casos-limite plantados de propósito (texto longo que obriga truncamento, valor zero, campo nulo que vira travessão); escolha 3 que carreguem esses casos. O `total` importa: é ele que diz se a coleção é maior que uma página. O resto do `seed` é dado de execução, consumido por outro script, e a página nunca o referencia — ela lê `<consulta>Data` da classe base.
3. `{{DS_PATH}}` — os tokens (nomes e valores). **Pule o bloco `.dark` inteiro** (~40% do arquivo): a página nunca cita valor de modo noturno, o `.dark` troca os valores sozinho, e o fallback dentro do `var()` é sempre o valor claro do `:root`. O `:root` é superconjunto — tem cor, espaço, raio e tipografia.
4. `{{ICONS_PATH}}` — o conjunto de ícones, fechado.
{{USAGE_ITEM}}
Não leia mais nada. Não procure outras páginas geradas, outras rodadas, nem documento de task.
{{USAGE_SECTION}}
## 2. Idioma

A instrução está em inglês. A **UI sai no idioma que a fixture declara**.

## 3. Ordem de autoridade

- **documento de design** = estrutura, aparência, comportamento
- **fixture** = dados, comandos, amarração, idioma
- **design system** = cor
- **`icons.ts`** = única fonte de ícone

## 4. O que produzir

`{{OUT_PATH}}`

E, opcionalmente, `page.less` na mesma pasta — só para `@keyframes` e o que utilitário não faz.

## 5. Regras do `page.ts`

- **Lit**: `import { html } from 'lit'` · `import { customElement, state } from 'lit/decorators.js'` · `@customElement('{{TAG}}')` — o `fixtureId` em **kebab-case**; nome de custom element não pode ter letra maiúscula, `customElements.define()` recusa e a página não sobe. Uma classe que estende a classe base da fixture.
- **A classe base vem do stub local**: `import { <baseClass> } from './stub.js';` — o `<baseClass>` está declarado na `binding` da fixture.
- **Ícone só do conjunto compartilhado**: `import { icons } from './icons.js';`. É um conjunto **fechado**. Faltando um emprego que o documento pede, isso é **achado sobre o conjunto** e vai na resposta final — não desenhe SVG à mão nem use glifo de texto (`▲` `▼` `‹` `›` `✕`) no lugar de ícone.
- **Molécula, quando o documento atribui**: registre cada uma com **um import de efeito colateral** — `import '/_102040_/l2/molecules/<grupo>/<ml-nome>.js';`, sem import nomeado. A molécula registra o próprio custom element; **escrever a tag sem importar o módulo dá elemento desconhecido que não renderiza nada, e sem erro** — e o harness usa exatamente esse import para descobrir qual `.less` compilar, então sem ele a molécula também sai sem estilo. Use a TagName exata que o documento atribui, e só props/eventos/slots que o contrato dela declara.
- **O `<grupo>` do caminho é minúsculo**, igual ao prefixo da TagName (`groupviewtable`), mesmo quando o documento fala do grupo em camelCase (`groupViewTable`). Caixa errada resolve em Windows/macOS e **quebra em Linux/CI**.
- **Estado de vista é da página**: o que não tem significado de negócio (registro selecionado, modo/cena, diálogo aberto, ordenação, rascunho da busca) é declarado como `@state()` na própria página, com os métodos privados que ela precisar. O que tem significado de negócio vem **só** da amarração. É proibido esconder estado de vista dentro de campo de comando.
- **Tipar pelo `contract`**: a fixture declara em `binding.contract` a forma de `<consulta>Data`, o vocabulário dos estados, os tipos de erro/saída e a assinatura de setters, handlers e `msg()`. É o suficiente para compilar em `strict` — **não vá ler o stub**.
- **Layout e espaçamento em Tailwind** (utility classes). Sem CSS semântico sem folha de estilo, sem `style=` a não ser para valor dinâmico.
- **Cor só por token** do design system, no idioma Tailwind de valor arbitrário e **sempre com fallback dentro do `var()`**: `bg-[var(--surface-bg,#ffffff)]`, `text-[var(--text-muted,#5d6b7e)]`, `border-[var(--border-default,#cfd8e3)]`. Proibido `#hex` solto e proibido token que não exista no CSS.
- **Modo noite é trabalho dos tokens** (o `.dark` troca os valores) — **não** usar `dark:` em cor tokenizada.
- **Sem cenários dentro da página.** A página implementa os estados que o documento exige lendo o estado real do stub. Quem troca de cenário é o harness.
- Tem de compilar com as flags da plataforma: `target es2020`, `module ES2020`, `experimentalDecorators: true`, `moduleResolution bundler`, `strict`.
- **Em `updated`/`willUpdate`, tipe `changed` como `PropertyValues<NomeConcretoDaClasse>`, nunca `PropertyValues<this>`.** `this` como argumento genérico (fora da posição especial de tipo de retorno) não é o tipo concreto da classe para o TypeScript — `changed.has('campo' as keyof this)` falha em `strict` com `keyof this` não atribuível a `keyof <Classe>`. Com o tipo concreto, `changed.has('campo')` funciona direto, sem `as`.
- **E o campo de estado que você consultar em `changed.has(...)` não pode ser `private`.** `PropertyValues<Classe>` é indexado por `keyof Classe`, e `keyof` **não alcança membro privado** — `changed.has('_meuEstado')` não compila. Declare o `@state()` que precisa ser observado ali sem `private` (os **métodos** continuam privados à vontade). Alternativa: tipar o parâmetro como `Map<PropertyKey, unknown>`, que sempre compila ao custo de perder a checagem do nome da chave.
- **Escreva os arquivos e pare — não verifique o próprio trabalho.** Não rode `tsc`, `node`, nem comando nenhum. Não releia o que acabou de escrever. **Não procure o `stub.ts`: ele não existe ainda** — o harness o gera depois que você termina, e é o harness que compila. Onde não houver como saber se algo compila, siga o `binding.contract` da fixture e siga adiante.

## 6. Recusa

Se o documento descrever quando a página **não se aplica** (domínio que não se encaixa, condição de exclusão, o que ele chamar de recusa) e esta fixture cair nisso, **não escreva `page.ts` nenhum** e explique a recusa e o motivo na resposta final.

## 7. Ambiguidade

Onde o documento for ambíguo, **decida, siga, e relate no fim — não pergunte nada**.

## 8. O que relatar na resposta final

Sua resposta final é o relatório (não escreva arquivo de registro). Nesta ordem:

1. **o modelo resolvido** em forma compacta: consulta, comandos, campos-chave, filtros;
2. **o que não resolveu** e o que a página perdeu com isso;
3. **as variações disparadas** (a matriz do documento) e a consequência de cada uma;
4. **as colunas por largura**, e quais ordenam;
5. **os valores fixados** que o documento manda calcular ou escolher (tamanho de página, breakpoint calculado com a conta, altura de linha, proporção das regiões);
6. **rolagem e contenção**: quem rola em cada patamar e como a paginação é alcançável;
7. **recusa**, se houver, com o motivo;
8. **as ambiguidades do documento** — onde ele não decidiu e o que você escolheu, e em **qual nível** (estilo, página ou layout) a decisão deveria morar. **É o item mais valioso**: é por ele que o documento aprende;
9. **empregos de ícone que faltaram** no conjunto.
