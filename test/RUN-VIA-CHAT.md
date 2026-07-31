# Pedir uma rodada pelo chat

Complemento do `RUN.md` (o protocolo) e do `harness/run.mjs` (o caminho por linha de comando). Aqui
está só como **pedir** uma rodada em conversa, e o que esperar de volta.

## O pedido mínimo

Quatro nomes bastam:

> Gere uma run: `salesforceStyle/inventoryControl`, layout `gridThenEdit`, fixture
> `cafeFlowInventoryControl`.

Não precisa dizer os passos, nem os caminhos, nem os comandos — eles são derivados desses nomes. Se
esquecer o layout numa suíte que tem layouts, a resposta será a pergunta de qual, porque escolher por
conta produziria uma página sem arrumação com aparência de rodada válida.

## Variações que valem a pena

| Situação | Como pedir |
| --- | --- |
| você já rodou o script e ele parou na geração | *"o preparo está feito"* — pula direto para gerar e fecha com `--only-build` |
| comparar duas arrumações | *"gere as duas runs, `splitView` e `gridThenEdit`, com a fixture X"* |
| ver o efeito de uma mudança de fixture | *"refaz a run da fixture X"* — mesmo layout, mesma suíte |
| só olhar o resultado de novo | *"reconstrói o `page.html` da run Y"* — sem regerar a página |
| entender o que a rodada aprendeu | *"me resume o `report.md` da run Y"* |

## O que acontece quando você pede

1. **Preparo** — monta o documento de design (estilo + página + layout) e o contrato das moléculas na
   pasta da rodada.
2. **Geração** — um subagente de **contexto limpo** escreve o `page.ts`. Ele recebe apenas os cinco
   arquivos de entrada: nada da nossa conversa, nenhuma rodada anterior, nenhuma página já gerada.
   *É o que torna a rodada um teste:* o que ele acertar veio do documento, não do que discutimos.
3. **Build** — stub → `tsc` → Tailwind → CSS das moléculas → `page.html` autocontido.
4. **Checks** — conferência mecânica.

**O prompt vem do `prompt.md` que o harness escreve**, não de um texto composto na hora. Isso importa:
o `harness/runPrompt.md` é a fonte única do contrato, então a rodada por chat e a rodada por linha de
comando testam exatamente o mesmo. Um prompt improvisado seria uma terceira versão divergindo das
outras duas.

## O que volta

O caminho do `page.html` (abre com duplo clique), o resultado dos `checks`, e o resumo do que a
rodada relatou — com atenção ao item que mais importa, **as ambiguidades do documento**: onde ele não
decidiu, o que a rodada escolheu, e em **qual dos três níveis** (estilo, página ou layout) a decisão
deveria morar.

O julgamento visual é seu. O harness diz se compilou e se passou nas regras mecânicas; se a página
está **certa** só se sabe abrindo e comparando com o checklist do documento.

## Chat ou script?

**Script** para rodada de rotina: mais rápido, mais barato, e a restrição a `Read`/`Write` torna
*impossível* a auto-verificação que já matou duas rodadas (elas tentaram rodar `tsc` e uma fabricou um
stub falso para compilar contra).

**Chat** quando você quer companhia na decisão: julgar o resultado junto, decidir na hora o que muda
em qual documento, ou investigar uma falha estranha. As três falhas que apareceram ao automatizar —
CLI fora do PATH, linha de comando acima do limite do `cmd.exe`, escrita não autorizada em modo
headless — nenhuma se apresentava como erro de template, e diagnosticar isso é conversa.

## Duas coisas que valem para os dois caminhos

**Mudou um documento de design, as rodadas anteriores deixaram de valer** — inclusive as que
passaram. E o raio cresce para cima: layout invalida aquele layout, página invalida todos os layouts
dela, estilo invalida todas as suítes dele.

**Página corrigida à mão deixa de ser evidência na hora.** Dá para pedir o ajuste — às vezes é o
caminho mais curto para ver uma ideia de pé — mas a prova de que uma regra funciona é uma **rodada
nova** chegando sozinha ao resultado.
