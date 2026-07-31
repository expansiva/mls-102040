# RUN — protocolo de teste isolado de template

Protocolo de uma rodada, para qualquer suíte `<style>/<template>` (`salesforceStyle/inventoryControl`,
`salesforceStyle/productCatalog`, `oracleStyle/...`, o que vier depois). Teste **independente**: não
usa o grupo `agentTemplatesRender`, nem `templateRef`, nem `l5/config.json`, nem publish, nem VM. Só o
template, uma fixture e o design system.

**Cada pasta `test/<style>/<template>/` fica fora das pastas de nível (`l1`..`l7`) de propósito** — o
staging do `buildCI` só copia níveis, então nada dali entra no build nem no `source.zip`. É o que
permite a rodada gerar `.ts` de verdade sem risco de quebrar o projeto.

**Harness compartilhado**: `test/harness/` (scripts), `test/designSystem.css` (tokens),
`test/icons.ts` (conjunto de ícones), `test/skills/` (como escrever as entradas) e este `RUN.md`
moram na raiz de `test/`, comuns a qualquer suíte. Cada `test/<style>/<template>/` só tem
`fixtures/`, `runs/` e o `molecules.json` — nada de protocolo duplicado por suíte.

**Antes de escrever uma entrada nova, leia a skill dela** — as duas juntam o que as rodadas já
ensinaram, incluindo os erros que custaram rodada:

| Skill | Para |
| --- | --- |
| `test/skills/fixtures.md` | escrever `fixtures/<fixtureId>.defs.ts` |
| `test/skills/templates.md` | escrever os documentos de design: estilo, página e layout |

E `test/RUN-VIA-CHAT.md` para **pedir uma rodada em conversa** em vez de pela linha de comando — os
dois caminhos usam o mesmo prompt, então testam a mesma coisa.

Nenhuma das duas vai para o subagente da rodada — são para quem **conduz**. A rodada continua
recebendo só os cinco arquivos da tabela abaixo.

---

## O que o teste responde

Uma pergunta: a página gerada passa a conferência final que o `template.md` desta suíte descrever? É
aqui que se olha imagem — a fixture e o design system só existem para dar à rodada dados e cor reais
para desenhar contra.

---

## O que a rodada recebe

Quatro arquivos, nada mais — **cinco quando o template usa moléculas**:

| Arquivo | Papel |
| --- | --- |
| `runs/<id>/template.md` | a instrução — **estilo + página + layout montados** |
| `test/<style>/<template>/fixtures/<fixture>.defs.ts` | o domínio |
| `test/designSystem.css` | os tokens (nomes e valores) — compartilhado |
| `test/icons.ts` | o conjunto de ícones, fechado — compartilhado |
| `runs/<id>/molecules-usage.md` | *(só com moléculas)* o contrato dos grupos que o template atribui |

**O documento de design tem até três níveis, e o harness os monta num arquivo só.**

| Onde | O que carrega |
| --- | --- |
| `l4/templates/<style>/template.md` | regra **global do estilo**: uso de molécula, contenção, estados de região de coleção, convenções de formulário/ação, sobreposições, invariantes visuais |
| `l4/templates/<style>/<template>/template.md` | o que a página **é**: o modelo que resolve, o significado de colunas e comandos, as moléculas estruturais |
| `l4/templates/<style>/<template>/layouts/<layout>/template.md` | como ela é **arrumada**: patamares, quem rola, como se alcança um registro, onde vive o formulário dele |

Precedência, escrita nos três: cada nível **estreita** o anterior e nunca o contradiz. Contradição é
achado, não override.

O layout entra por **argumento**, não por suíte:

```
node harness/prepareRun.mjs <style>/<template> runs/<id> --layout <layout>
```

**`fixtures/` e `molecules.json` NÃO se dividem por layout** — pertencem ao domínio, não à arrumação,
e continuam em `test/<style>/<template>/`, compartilhados. É isso que permite comparar duas
arrumações da mesma página contra os **mesmos dados**; fixture duplicada por layout tornaria a
comparação sem valor. Ponha o layout no **id da rodada**
(`2026-07-30-gridThenEdit-cafeFlowInventoryControl`), que é o que separa os artefatos.

Sem `--layout` numa suíte que tem layouts, o `prepareRun` monta só estilo + página e **avisa** — a
rodada receberia a página sem arrumação nenhuma.

Montar em vez de mandar N arquivos tem três motivos: a rodada segue **uma** especificação
(reconciliar documentos é onde ela erra), o orçamento de tool use não cresce, e a montagem é o único
momento em que dá para conferir mecanicamente se os níveis se contradizem — hoje o `prepareRun` avisa
quando um nível **repete um título** de outro, sinal de regra copiada. Cópia é divergência futura: as
duas versões derivam e nada avisa.

O `molecules-usage.md` também é **gerado pelo harness na pasta da rodada** antes de ela começar, a
partir do manifesto da suíte (`molecules.json` → `groups`). Um arquivo, não um por grupo: cada
leitura extra é tool use, e tool use é o que faz a rodada demorar. A verificação cruzada
template ↔ manifesto roda contra o documento **montado**, porque o estilo atribui as moléculas de
campo e a página as estruturais — só a soma tem a lista completa.

**Não recebe**: `research.md` · o arquivo da task · outras rodadas · o histórico da conversa ·
qualquer página já gerada. Se o gerador precisar de algo além desses quatro arquivos, isso é **um
achado sobre o template**, e vai na resposta final da rodada.

A rodada é um **subagente com contexto limpo**.

### O que ler de cada arquivo — e o que pular

Quase metade da entrada é material que as próprias regras **proíbem** a página de usar. Ler por
completo não deixa a página melhor: só custa token e dá ao modelo dado de execução para tirar
conclusão errada. O prompt manda pular explicitamente:

| Arquivo | Pular | Por quê |
| --- | --- | --- |
| `designSystem.css` | o bloco **`.dark`** inteiro (~40% do arquivo) | a página nunca cita valor de modo noturno — o `.dark` troca os valores sozinho, e o fallback dentro do `var()` é sempre o valor claro do `:root`. O `:root` é superconjunto: tem cor **e** espaço, raio e tipografia |
| fixture `.defs.ts` | quase todo o **`seed`** (~45% do arquivo): ler só `total` e **3 linhas** de `rows` | `seed` é dado de execução: quem o lê é o `makeStub.mjs`, que o assa dentro do `stub.ts`. A página nunca referencia `seed` — lê `<consulta>Data` da classe base |

As 3 linhas de `rows` não são decoração: é onde moram os casos-limite plantados de propósito (texto
longo que obriga truncamento, valor zero, campo nulo que vira travessão). Escolha 3 que carreguem
esses casos. E o `total` importa de verdade — é ele que diz se a coleção é maior que uma página.

**O `molecules-usage.md` se lê inteiro, mas com um filtro na cabeça.** Ele é o maior arquivo da entrada
(pode passar de metade dela), e o motivo de não podar é que a rodada não sabe de antemão qual prop vai
precisar. O filtro é de **o que extrair**, não de o que ler:

- tire dele **nomes de prop, nomes de evento, forma do `detail`, slot tags e a lista de tokens** — é o
  contrato, e é a única coisa que vale;
- **ignore a sintaxe dos exemplos.** Esses documentos foram escritos para um motor declarativo, então
  mostram binding em moustache (`value="{{…}}"`) e grafias de tag legadas. Copiar a sintaxe produz uma
  página que não funciona;
- a **TagName** nunca vem daí: vem da atribuição do template.

---

## O que a rodada produz

Em `test/<style>/<template>/runs/<AAAA-MM-DD>[-<layout>]-<fixture>/`:

| Arquivo | Conteúdo |
| --- | --- |
| `page.ts` | a página, em Lit + Tailwind + tokens do design system |
| `page.less` | *(opcional)* a folha de estilo da página — só `@keyframes` e o que utilitário não faz |

O harness acrescenta depois: `stub.ts`, `icons.ts`, `dist/`, `tailwind.css` e **`page.html`** —
autocontido, que abre com duplo clique.

**A rodada não escreve arquivo de registro.** O que ela aprendeu — modelo resolvido, variações
disparadas, ambiguidades do template, empregos de ícone que faltaram — sai na **resposta final** dela,
não em arquivo. *Motivo: o registro custava alguns milhares de tokens de saída por rodada e quase todo
o seu valor é consumido na hora, ao decidir o que muda no template.*

**Quem guarda é o harness, não a rodada**: o `run.mjs` salva o `stdout` da geração em
`runs/<id>/report.md`. A distinção não é sutil — o antigo `resolution.md` era um arquivo que a rodada
*escrevia*, gastando tokens de saída; o `report.md` é o texto que ela já produziu, apenas não
descartado. Foi criado depois de uma rodada morrer por limite de gasto **depois** de escrever o
`page.ts`: o relatório se perdeu, e era o item mais valioso dela.

Guardado não é transcrito. Achado que deva virar regra continua tendo de ser levado à mão para o
documento do **nível certo** (estilo, página ou layout) — o `report.md` é matéria-prima, não destino.

Fixture que deve ser **recusada**: se o `template.md` desta suíte descrever quando a página não se
aplica (domínio não se encaixa, condição de exclusão, o que o template chamar de recusa), a rodada
**não escreve `page.ts` nenhum** e explica a recusa e o motivo na resposta final.

### Regras do `page.ts`

Estas regras são as mesmas para qualquer suíte — não dependem do `template.md` específico:

- **Lit**: `import { html } from 'lit'` · `import { customElement, state } from 'lit/decorators.js'` ·
  `@customElement('test--<fixtureId>-page')`, com o `fixtureId` convertido para **kebab-case**
  (`cafeFlowInventoryControl` → `cafe-flow-inventory-control`, logo
  `test--cafe-flow-inventory-control-page`) — nome de custom element não pode ter letra maiúscula;
  `customElements.define()` recusa e a página não sobe. Uma classe que estende a classe base da
  fixture.
- **A classe base vem do stub local**: `import { <baseClass> } from './stub.js';`
  (em produção viria de `/_<projeto>_/l2/<módulo>/web/shared/<página>.js`; no teste é local, e é a única
  diferença permitida).
- **Ícone só do conjunto compartilhado**: `import { icons } from './icons.js';` — o harness copia
  `test/icons.ts` para a pasta da rodada. É um conjunto **fechado**: um ícone por emprego que o
  template autoriza. Faltando um emprego que o template pede, isso é **achado sobre o conjunto** e vai
  na resposta final — não desenhe SVG à mão nem use glifo de texto (`▲` `▼` `‹` `›` `✕`) no lugar
  de ícone.
- **Molécula, quando o template atribui**: registre cada uma com **um import de efeito colateral** —
  `import '/_<projeto>_/l2/molecules/<grupo>/<ml-nome>.js';`, sem import nomeado. A molécula registra o
  próprio custom element; **escrever a tag sem importar o módulo dá elemento desconhecido que não
  renderiza nada, e sem erro** — e o harness usa exatamente esse import para descobrir qual `.less`
  compilar, então sem ele a molécula também sai sem estilo. Use a TagName exata que o template atribui,
  e só props/eventos/slots que o contrato dela declara.
- **O `<grupo>` do caminho é minúsculo**, igual ao prefixo da TagName (`groupviewtable`), mesmo quando o
  template fala do grupo em camelCase (`groupViewTable`). Caixa errada resolve em Windows/macOS — compila
  e roda aqui, **quebra em Linux/CI**. O `build.mjs` avisa quando detecta.
- **Estado de vista é da página**: o que não tem significado de negócio (registro selecionado, modo do
  painel, diálogo aberto, ordenação, rascunho da busca) é declarado como `@state()` na própria página,
  com os métodos privados que ela precisar. O que tem significado de negócio vem **só** da amarração.
  É proibido esconder estado de vista dentro de campo de comando.
- **A página pode ter uma folha de estilo própria**: `page.less`, ao lado do `page.ts`. É lá que moram
  os `@keyframes` (pulso do esqueleto, fade de diálogo/notificação/troca de registro) — o que der para
  fazer com utilitário de transição continua em Tailwind.
- **Tipar pelo `contract`**: a fixture declara em `binding.contract` a forma de `<consulta>Data`, o
  vocabulário dos estados, os tipos de erro/saída e a assinatura de setters, handlers e `msg()`. É o
  suficiente para compilar em `strict` — **não vá ler o stub**.
- **Layout e espaçamento em Tailwind** (utility classes). Sem CSS semântico sem folha de estilo, sem
  `style=` a não ser para valor dinâmico.
- **Cor só por token** do `designSystem.css`, no idioma Tailwind de valor arbitrário e **sempre com
  fallback dentro do `var()`**: `bg-[var(--surface-bg,#ffffff)]`,
  `text-[var(--text-muted,#5d6b7e)]`, `border-[var(--border-default,#cfd8e3)]`.
  Proibido `#hex` solto e proibido token que não exista no CSS.
- **Modo noite é trabalho dos tokens** (o `.dark` troca os valores) — **não** usar `dark:` em cor
  tokenizada.
- **Sem cenários dentro da página.** A página implementa os estados que o template exige (carregando,
  vazio, vazio-por-filtro, erro, preenchido) lendo o estado real do stub. Quem troca de cenário é o
  harness.
- Tem de compilar com as flags da plataforma: `target es2020`, `module ES2020`,
  `experimentalDecorators: true`, `moduleResolution bundler`, `strict`.
- **Em `updated`/`willUpdate`, tipe `changed` como `PropertyValues<NomeConcretoDaClasse>`, nunca
  `PropertyValues<this>`.** `this` como argumento genérico (fora da posição especial de tipo de
  retorno) não é o tipo concreto da classe para o TypeScript — `changed.has('campo' as keyof this)`
  falha em `strict` com `keyof this` não atribuível a `keyof <Classe>`. Com o tipo concreto,
  `changed.has('campo')` funciona direto, sem `as`.
- **E o campo de estado que você consultar em `changed.has(...)` não pode ser `private`.**
  `PropertyValues<Classe>` é indexado por `keyof Classe`, e `keyof` **não alcança membro privado** — 
  `changed.has('_meuEstado')` não compila. Declare o `@state()` que precisa ser observado ali sem
  `private` (os **métodos** continuam privados à vontade). Alternativa, se preferir manter tudo
  privado: tipar o parâmetro como `Map<PropertyKey, unknown>`, que sempre compila ao custo de perder a
  checagem do nome da chave.
- **Escreva os arquivos e pare — não verifique o próprio trabalho.** Não rode `tsc`, `node`, nem
  comando nenhum. Não releia o que acabou de escrever. **Não procure o `stub.ts`: ele não existe
  ainda** — o harness o gera depois que você termina, e é o harness que compila. Onde não houver como
  saber se algo compila, siga o `binding.contract` da fixture e siga adiante.

### Por que a rodada não valida a si mesma

Custou as duas rodadas mais lentas já medidas (29,8 min e 33,5 min, ambas mortas por limite de gasto
**durante essa fase, depois de os arquivos já estarem escritos**), e o motivo de ser proibido não é
só custo:

1. **É impossível de fazer certo.** O `stub.ts` não existe durante a geração — o harness o cria no
   passo `[1/4]`, depois. Uma rodada tentou e desistiu; outra **fabricou um stub falso** num diretório
   temporário para compilar contra ele.
2. **É redundante.** O harness roda `tsc` com exatamente as flags da plataforma no passo `[2/4]`.
3. **Apaga o sinal que o teste quer.** "Não compilar é falha da rodada" existe para revelar que o
   template induziu um erro — foi assim que a regra do `PropertyValues<this>` apareceu. Rodada que se
   conserta sozinha destrói a evidência.
4. **Pode piorar a página.** Quem compila contra um stub inventado tende a ajustar a página para casar
   com o stub **imaginado** em vez do real. Não é verificação: é introduzir erro com confiança.

### O que a rodada relata na resposta final

Não é arquivo — é a resposta que a rodada devolve ao terminar. Peça sempre, e nesta ordem, porque é
daqui que sai a decisão sobre o que muda no template:

1. **o modelo resolvido** em forma compacta: consulta, comandos, campos-chave, filtros;
2. **o que não resolveu** e o que a página perdeu com isso;
3. **as variações disparadas** (a matriz do template) e a consequência de cada uma;
4. **as colunas por largura**, e quais ordenam;
5. **os valores fixados** que o template manda calcular ou escolher (tamanho de página, breakpoint
   calculado com a conta, altura de linha, proporção do painel);
6. **rolagem e contenção**: quem rola em cada patamar e como a paginação é alcançável;
7. **recusa**, se houver, com o motivo;
8. **as ambiguidades do template** — onde ele não decidiu e o que a rodada escolheu. **É o item mais
   valioso**: é por ele que o template aprende, e foi ele que revelou a contradição da direção do
   movimento, o `PropertyValues<this>` e os empregos de ícone que faltavam;
9. **empregos de ícone que faltaram** no conjunto do projeto.

Adapte o vocabulário ao template da suíte — se ele não estrutura a página como lista+painel, troque
"colunas por largura" pelo que fizer sentido. A forma importa menos que a cobertura.

A última seção é a mais valiosa: é por ali que o template aprende.

---

## O prompt da rodada

**O runner NÃO recebe este arquivo.** As "Regras do `page.ts`" e a lista do que relatar vão
**copiados inline** no prompt. Motivo: se o runner ler o RUN.md, ele vê os critérios de avaliação e
passa a jogar para o teste em vez de seguir o template.

O prompt vive em `harness/runPrompt.md`, com marcadores que o `run.mjs` substitui (caminhos, a tag em
kebab-case, e a seção de moléculas, que sai inteira quando a suíte não usa nenhuma). **Mudou uma
regra do `page.ts` aqui? Mude lá também** — são duas cópias do mesmo contrato, e a que a rodada
obedece é a de lá.

O prompt é, na ordem: (1) leia os quatro arquivos, nesta ordem, e nada mais — **com o que pular em
cada um** (o `.dark` do CSS; o `seed` da fixture além de `total` e 3 linhas); (2) o idioma (a instrução
está no idioma dela, a **UI sai no idioma que a fixture declara**); (3) a ordem de autoridade
(template = estrutura/aparência/comportamento · fixture = dados/comandos/amarração/idioma · design
system = cor · `icons.ts` = única fonte de ícone); (4) o arquivo a produzir, com caminho exato; (5) as
Regras do `page.ts` **copiadas**, inclusive a de escrever e parar; (6) a regra de recusa; (7) "onde o
template for ambíguo, decida, siga, e relate no fim — não pergunte nada"; (8) a lista do que relatar
na resposta final.

**Orçamento de uma rodada saudável.** Serve para reconhecer rodada que descarrilhou: ~6 tool uses
(ler 4 arquivos, escrever 1 ou 2) e 10–15 min. Rodada passando de ~12 tool uses quase sempre é uma que
começou a se auto-verificar — e vale interromper em vez de esperar, porque nada de útil sai daí.

---

## Como o harness monta a página

Tudo local, sem CDN — `lit` 3.3.3, `tailwindcss` 4.3.0 e `typescript` já estão em `node_modules/`.
Os scripts moram em `test/harness/` (raiz de `test/`, compartilhado); os comandos abaixo rodam com o
cwd em `test/`, com a suíte (`<style>/<template>`) como primeiro argumento:

**O caminho normal é um comando só.** O `harness/run.mjs` faz os quatro passos na ordem, derivando
todos os argumentos de dois nomes:

```
npm run test:template -- --suite salesforceStyle/inventoryControl \
                         --fixture cafeFlowInventoryControl --layout gridThenEdit
```

ou, com o cwd em `test/`:

```
node harness/run.mjs --suite <style>/<template> --fixture <nome> [--layout <nome>]
```

O id da rodada sai de `<AAAA-MM-DD>[-<layout>]-<fixture>`; `--id` força outro.

| Opção | Para |
| --- | --- |
| `--no-generate` | só prepara e escreve o `prompt.md`; a geração vem por outro caminho |
| `--only-build` | refaz build + checks de uma rodada que já existe |
| `--model` · `--max-turns` | passam ao passo de geração (padrão 20; rodada saudável usa ~6) |

**A geração é o único passo que precisa de modelo.** O script chama o CLI `claude` em modo headless
**com as ferramentas restritas a `Read` e `Write`** — e isso transforma a regra "escreva e pare, não
verifique o próprio trabalho" de texto em impossibilidade: sem `Bash` a rodada não roda `tsc` nem
fabrica um stub falso para compilar contra, que foi exatamente o que matou as duas rodadas mais
lentas já medidas. Sem o CLI no PATH, o script para no passo 2, deixa o `prompt.md` pronto e diz como
seguir — o preparo não se perde.

O `stdout` da geração é salvo em `report.md` na pasta da rodada. Isso **não** é o antigo
`resolution.md`: aquele era um arquivo que a rodada *escrevia*, gastando tokens de saída; este é o
relatório que ela já produziu, apenas não jogado fora. Uma rodada morreu por limite de gasto depois
de escrever o `page.ts` e o relatório se perdeu — era o item mais valioso dela.

Os passos avulsos continuam existindo, para depurar um deles em isolamento:

```
node harness/prepareRun.mjs <style>/<template> runs/<id> [--layout <layout>]     # ANTES da rodada
node harness/build.mjs     <style>/<template> runs/<id> fixtures/<fixture>.defs.ts   # depois
node harness/checks.mjs    <style>/<template> runs/<id> fixtures/<fixture>.defs.ts
```

Depois, abrir `<style>/<template>/runs/<id>/page.html` com duplo clique — autocontido, sem servidor e
sem rede.

**A ordem importa, e é fácil de errar.** O `prepareRun` cria a pasta e escreve o que a rodada vai
**ler** (hoje, o `molecules-usage.md`); o `build` monta o que a rodada **escreveu**. Como o `build` só
roda depois do `page.ts` existir, tudo que é entrada tem de vir antes — gerar no `build` chegaria tarde,
com o arquivo aparecendo só depois de a rodada já ter precisado dele.

Suíte sem moléculas não precisa do `prepareRun` (ele avisa e não faz nada). Com moléculas, se ele for
esquecido, o `build` avisa que a página usou molécula sem ter recebido o contrato — e o `build` **não**
gera o bundle nesse caso, de propósito: regenerá-lo faria o registro mentir sobre o que a rodada leu.

O `build.mjs` faz, em ordem:

1. **`makeStub.mjs`** — lê a fixture e gera `stub.ts`: a classe base com os `@property` de dados e
   estado, os setters e os handlers da `binding`, alimentados pelo `seed`, mais `msg()` e
   `applyScenario()`. Um script serve todas as fixtures de qualquer suíte; os handlers não chamam BFF.
   Em seguida copia `test/icons.ts` para a pasta da rodada, para a página importá-lo como
   `./icons.js`.
2. **`tsc`** com as flags da plataforma (`target es2020`, `module ES2020`, `experimentalDecorators`,
   `moduleResolution bundler`, `strict`) → `dist/`. **Não compilar já é falha da rodada.**
3. **Tailwind** — `@tailwindcss/cli` sobre `@import "tailwindcss"; @source "./page.ts";`, gerando o CSS
   só das classes que a página usou.
4. **`page.html`** — `esbuild` empacota a página + o stub + o Lit num script só, e os dois CSS
   (design system + Tailwind, mais `page.less` quando existir) vão embutidos. **Abre com duplo
   clique**, sem servidor e sem rede — o navegador bloqueia `import` de módulo em `file://`, por isso
   tudo vai empacotado em vez de importado.

> A fonte `Charlie Display` do design system não existe localmente: o navegador cai no `system-ui` do
> `font-family-primary`. Não invalida o teste de densidade, mas a tipografia não é a final.

`checks.mjs` roda uma checagem mecânica rápida sobre `page.ts` (hex solto, token inexistente, `dark:`
em cor tokenizada, zebra, `tabular-nums`, sombra fora de sobreposição, nome técnico visível) — é
diagnóstico de apoio, não critério de aprovação, e vale para qualquer suíte porque essas regras vêm
das "Regras do `page.ts`" acima, não do `template.md`. Quem decide se a página passa é a leitura de
`page.html` contra a conferência final que o template desta suíte descrever.

---

## Como montar o conjunto de fixtures de uma suíte nova

Ao criar fixtures para um template novo, cubra estas categorias — a ordem barateia a depuração: se a
referência falhar, o defeito é da fixture ou do harness, não do template ainda.

1. **Referência** — o caso mais comum e completo do domínio; é com ela que se calibra o harness antes
   de testar o template a sério.
2. **Recusa** — um domínio que o template deveria recusar (ver a seção do próprio `template.md` sobre
   quando não usar a página, se existir). É a mais barata e pega template que não sabe parar.
3. **Caso difícil** — o domínio mais carregado que a suíte precisa suportar (mais campos, mais
   comandos, alguma regra de corte).
4. **Armadilhas semânticas** — domínios que parecem se encaixar num padrão conhecido mas têm uma
   nuance que quebra a generalização (ex.: uma operação que parece bidirecional mas não é).
5. **Mínimo** — o menor domínio que ainda faz a página existir, para achar o que o template
   pressupõe sem declarar.

---

## Registro

O que a rodada ensinar sobre o template — as ambiguidades que ela relatou na resposta final — vira
mudança no `template.md` daquela suíte. **Essa transcrição é obrigatória e é de quem conduz a rodada**:
a resposta da rodada é efêmera, então achado que não virar regra no template (ou linha num documento de
estudo) desaparece.

Mudou o template, **toda rodada anterior deixou de valer** e tem de ser refeita do zero — inclusive as
que passaram. O artefato que sobra em `runs/` de uma versão antiga do template não é evidência de nada.
E página corrigida à mão deixa de ser evidência na hora: a prova de que uma regra funciona é uma
rodada nova chegando sozinha ao resultado.

**Raio de alcance depende do nível**, e cresce para cima:

| Mudou | Invalida |
| --- | --- |
| `layouts/<layout>/template.md` | as rodadas daquele layout |
| `<template>/template.md` | as rodadas de **todos os layouts** daquela suíte |
| `<style>/template.md` | as rodadas de **todas as suítes** daquele estilo |

Vale conferir o que existe abaixo antes de mexer num nível acima.
