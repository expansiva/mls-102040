# Skill: escrever um `template.md` de design de página

Como criar os documentos que um agente lê para gerar uma página, sem ver exemplo de página nenhum.

Leia junto: `test/RUN.md` (como o template é posto à prova) e `test/skills/fixtures.md` (o domínio
que ele recebe).

## Três níveis: estilo, página, layout

```
l4/templates/<style>/template.md                             # regra global do estilo
l4/templates/<style>/<template>/template.md                  # o que a página É
l4/templates/<style>/<template>/layouts/<layout>/template.md # como ela é ARRUMADA
```

O harness **monta os três num arquivo só** na pasta da rodada (`--layout <nome>`), então o agente lê
uma especificação contínua. Precedência, escrita nos três: cada nível **estreita** o anterior — é
mais específico, acrescenta restrição, nomeia a região onde a regra vale — e **nunca contradiz**.
Contradição é achado a relatar, não override a fazer em silêncio.

O terceiro nível existe porque **a mesma página tem mais de uma arrumação**: a mesma coleção de
insumos pode virar grid + painel lateral, ou grid ocupando a página com uma cena de edição à parte.
O domínio não muda; o arranjo, sim.

**Fixture e `molecules.json` não se dividem por layout.** Pertencem ao domínio, e ficam em
`test/<style>/<template>/`, compartilhados. É isso que dá valor ao terceiro nível: duas arrumações
julgadas contra os **mesmos dados**. Fixture duplicada por layout tornaria a comparação inútil.

**O corte entre estilo e página.** Um teste resolve quase todos os casos:

> *A frase continuaria verdadeira num `productCatalog` do mesmo estilo?*

**O corte entre página e layout** tem o seu próprio:

> *A frase continuaria verdadeira se a mesma página fosse arrumada de outro jeito?*

Se sim, é da página. Se ela fala de painel, cena, patamar, quem rola ou como se alcança um registro,
é do layout. Na prática:

| Estilo | Página | Layout |
| --- | --- | --- |
| como molécula é usada, registrada e estilizada | quais moléculas **estruturais** a compõem | quais campos de estado a arrumação acrescenta |
| a tabela de campo-por-papel | papel que só este domínio tem | — |
| contenção: altura nunca vem do conteúdo | — | quem rola, em cada patamar |
| os quatro estados de uma região de coleção | o que cada estado oferece neste domínio | estados que a arrumação inventa (uma cena tem os seus) |
| convenções de formulário, ação e sobreposição | o que os comandos **significam** | onde os formulários vivem |
| invariantes visuais e doutrina de medida | a medida própria da página | largura de coluna por patamar |
| disciplina de ícone | os **empregos** de ícone do domínio | empregos que a arrumação acrescenta |

**Não copie regra de nível acima.** Cópia é divergência futura: as versões derivam e nada avisa. O
`prepareRun` avisa quando um nível **repete um título** de outro, que é o sintoma mais comum disso.

**Quando criar um layout novo em vez de outra página.** Se o domínio, os comandos e o significado das
colunas são os mesmos, é layout. Se o mínimo exigido muda, ou o modelo resolvido muda de forma, é
outra página. O sinal prático: se você se pegar copiando o §1 e o §2, era layout.

**A tentação de um nível a mais.** Arquétipo — "lista+detalhe" como categoria **entre** estilo e
página — ainda não existe, e não deve existir por especulação. Espere uma **segunda** suíte do mesmo
arquétipo e suba com evidência do que de fato se repetiu. Camada prematura custa mais que uma
duplicação; o nível de layout só foi criado porque a segunda arrumação apareceu de verdade.

## O que o template é

Um **documento de resultado e comportamento**, reutilizável entre domínios: descreve o que a página
tem de ser e fazer, atribui moléculas por papel, e fixa as invariantes visuais. Um agente com
contexto limpo lê o template + uma fixture + o design system e escreve a página.

Três coisas que ele **não** é:

- **Não é código nem esqueleto.** Não contém Lit, Tailwind, nem trecho de página.
- **Não depende de `.defs`.** Não cita `uiSpec`, `stateName`, nem nome de campo de uma fixture
  específica. Fala de **papéis** ("a medida", "o rótulo", "o limiar") que qualquer domínio resolve.
- **Não fixa medida.** Nada de `4px`, `600`, `150ms`. O template declara intenção — "fonte pequena",
  "transição leve", "densidade compacta" — e o valor vem do design system.

## Onde mora, e o que precisa existir junto

```
mls-102040/l4/templates/<style>/template.md                             # estilo
mls-102040/l4/templates/<style>/<template>/template.md                  # página
mls-102040/l4/templates/<style>/<template>/layouts/<layout>/template.md # layout(s)
mls-102040/test/<style>/<template>/fixtures/*.defs.ts                   # domínios de teste
mls-102040/test/<style>/<template>/molecules.json                       # se atribui moléculas
```

O `molecules.json` lista os **grupos** de molécula cuja skill de `usage` a rodada recebe. O harness
compara a lista com as TagNames que o template atribui e **avisa quando divergem** — acrescentar
molécula no template sem acrescentar o grupo aqui deixa a rodada sem o contrato dela. Seja generoso:
mandar um usage que a fixture não exercita custa alguns milhares de tokens; omitir um que ela precisa
custa a rodada inteira.

## A estrutura que funciona

Ordem testada no `inventoryControl`. Adapte os nomes ao que a página é — o que importa é a cobertura,
não a numeração.

**Documento de página:**

| Seção | O que decide |
| --- | --- |
| **1. When to use it** | quando a página se aplica, e o **mínimo exigido** do domínio |
| **2. Resolve the model** | o vocabulário de papéis e as regras de resolução |
| **3. Structural molecules** | o que cada slot deve/não deve fazer, e qual molécula o preenche |
| **4. Regions and behavior** | região por região: o que existe, o que significa, o que os comandos fazem |
| **5. Visual specifics** | só o que é próprio da página, e ainda como passo de escala |
| **Apêndice A — Variation matrix** | as variações que o domínio dispara e a consequência de cada |
| **Apêndice B — Delivery checklist** | conferência final, item por item verificável |
| **Apêndice C — Decisions to record** | o que a rodada tem de prestar contas |

A seção 1 é a que dá ao template a capacidade de **recusar**: um domínio que não atende o mínimo não
produz página nenhuma. Sem isso o template aceita qualquer coisa e a fixture de recusa não tem o que
provar.

**Documento de layout** (seções prefixadas `L` para não colidir com a numeração da página):

| Seção | O que decide |
| --- | --- |
| **L1. What this layout contributes** | os campos que ele acrescenta ao modelo resolvido |
| **L2. Layout contract** | o desenho das formas, o que decide cada uma, quem rola |
| **L3. How a record is reached** | clique de linha, ação por linha, ou o que for — e o que isso exclui |
| **L4.** navegação / painel | o que sobrevive ao ir e voltar, ou como o painel se comporta |
| **L5. States** | os estados que a arrumação inventa e a região de coleção não cobre |
| **L6. Icon employments it adds** | acréscimos à lista fechada da página |
| **L7. Checklist** | conferência do que só esta arrumação pode errar |

## Como escrever uma regra

O padrão que sobreviveu: **requisito + razão + o que isso exclui.**

> A remoção carrega o estilo danger, no painel e na ação que confirma no diálogo. *Quiet é o estilo
> de ação secundária reversível, então uma remoção quiet fica indistinguível do Editar ao lado.* O
> cancelar do diálogo continua quiet: só um lado de uma escolha destrutiva é alto.

A razão não é enfeite — é o que permite ao agente decidir o caso que você não previu. Regra sem
razão vira ritual, e ele a aplica onde não devia (ou a abandona no primeiro conflito).

Nomear **o que a regra exclui** vale quase tanto quanto a regra. Duas vezes um template foi obedecido
e produziu o resultado errado porque descrevia o efeito e não proibia o desvio: "clicar seleciona e
carrega o painel" foi cumprido sem marcar a linha; "a dismissible top banner" produziu banner
flutuante cobrindo o cabeçalho.

### Vocabulário compartilhado é a armadilha mais cara

Palavra que existe no template **e** na API de uma molécula, com sentidos diferentes, produz erro que
parece desobediência e é obediência a um mal-entendido:

| Template dizia | Molécula entendeu | Resultado |
| --- | --- | --- |
| "top banner" (topo do conteúdo) | `position="top"` (flutuar contra a tela) | banner cobrindo o cabeçalho |
| "not a selection table" | não usar `selectable` **nem** `value` | linha selecionada sem marca |

Ao escrever uma regra que toca uma prop de molécula, diga **em que camada** a palavra vale. E quando
a skill da molécula estiver errada ou incompleta, corrija a skill — não contorne no template.

## Atribuir molécula

Uma tabela por papel: **papel → TagName**, com a razão da escolha e as alternativas descartadas (com
o motivo de cada descarte). O agente usa as alternativas para decidir quando o caso dele foge do
comum.

Três regras que precisam estar escritas, porque nenhuma é óbvia:

**Atribuição é permissão, não obrigação.** Molécula atribuída que não tem papel na página **fica sem
uso**. Sem essa frase, o agente procura onde encaixá-la — foi assim que o banner de sistema virou
depósito do erro de coleção, que pertencia à região de dados.

**A molécula ganha no que é dela.** Paginação própria, cabeçalho fixo, estado vazio — a versão da
molécula é a que vai, e não se duplica. Mas o contrato de layout continua valendo: o que ela traz tem
de caber na região atribuída e respeitar quem rola. Molécula que não cabe é **achado a relatar**, não
coisa a contornar desligando o recurso e refazendo à mão.

**Afordância mais fina que o estado exigido não satisfaz o estado.** Se o template exige "erro com
repetição" e a molécula só declara `error: string` sem ação, a região desenha o estado e a prop fica
sem uso. Escreva isso, ou o agente considera a prop suficiente.

## Medidas e responsividade

Declare **intenção e restrição**, nunca número:

- "fonte pequena", "densidade compacta", "transição leve" → o valor sai do design system.
- Patamares saem de **restrições aritméticas** declaradas no template ("a grade precisa de N colunas
  legíveis e o painel de largura mínima confortável; abaixo disso, empilha"), e a rodada presta contas
  do número que calculou no Apêndice C.
- Cor só por token, sempre com fallback dentro do `var()`. Modo noite é trabalho dos tokens — a
  página nunca cita valor de modo noturno.

Isso é o que mantém o template reutilizável entre design systems: ele diz *pequeno*, o DS diz *quanto*.

## Como o template é posto à prova

```
node harness/prepareRun.mjs <style>/<template> runs/<id>          # antes
# … a rodada (subagente de contexto limpo) escreve page.ts …
node harness/build.mjs   <style>/<template> runs/<id> fixtures/<fixture>.defs.ts
node harness/checks.mjs  <style>/<template> runs/<id> fixtures/<fixture>.defs.ts
```

Depois abre-se `page.html` e se julga **por imagem**, contra o Apêndice B. O `checks.mjs` é
diagnóstico mecânico de apoio, não critério de aprovação.

Duas consequências de processo que valem mais que qualquer regra de escrita:

**O relatório da rodada é o produto principal.** O item "ambiguidades do template — onde ele não
decidiu e o que a rodada escolheu" é o que ensina o template. Ele é **efêmero**: sai na resposta do
subagente e não em arquivo. Achado que não for transcrito para o `template.md` desaparece. Essa
transcrição é de quem conduz a rodada.

Ao transcrever, decida **em que nível** o achado mora — a mesma pergunta do corte acima. Achado que
valeria para qualquer página do estilo e que for parar no template da página vira a duplicação que a
divisão em dois níveis existe para evitar.

**Mudou o template, toda rodada anterior deixou de valer** — inclusive as que passaram. Artefato em
`runs/` de uma versão antiga não é evidência de nada. E página corrigida à mão deixa de ser evidência
na hora: a prova de que uma regra funciona é uma rodada nova chegando sozinha ao resultado.

O raio depende do nível e cresce para cima: layout invalida as rodadas daquele layout; página invalida
as de **todos os layouts** da suíte; estilo invalida as de **todas as suítes** do estilo.

## Conferência antes de dar o template por pronto

- [ ] Nenhuma medida fixa (px, ms, peso numérico) — só intenção + token.
- [ ] Nenhuma citação de `.defs`, `uiSpec`, `stateName` ou campo de fixture específica.
- [ ] Fala de papéis, não de nomes de domínio.
- [ ] Seção 1 permite **recusar**, com o mínimo exigido explícito.
- [ ] Toda molécula atribuída tem razão + alternativas descartadas.
- [ ] Está escrito que atribuição é permissão, não obrigação.
- [ ] Cada regra tem razão, e as arriscadas nomeiam o que excluem.
- [ ] Nenhuma palavra ambígua entre template e prop de molécula sem dizer a camada.
- [ ] Estados exigidos dizem **onde** aparecem e que sua apresentação é consistente entre si.
- [ ] Apêndice B é verificável por imagem (nada de "está bonito").
- [ ] `molecules.json` da suíte cobre todos os grupos atribuídos.
- [ ] Existe fixture de **referência** e de **recusa**.
- [ ] Nenhum texto morto: seção removida sai inteira, sem marcador de "(removido)".
- [ ] **Nenhuma regra global copiada** no template da página — `prepareRun` sem aviso de título repetido.
- [ ] Precedência (cada nível estreita o anterior e não o contradiz) escrita em **todos** os documentos.
- [ ] Nada de arrumação no template da página: sem patamar, sem painel, sem cena.

## Erros já cometidos, para não repetir

| Sintoma na página gerada | Causa no template |
| --- | --- |
| molécula usada para o que não é dela | atribuição sem dizer que é permissão, não obrigação |
| comportamento cumprido sem o feedback visual | regra descrevia o efeito, não o que ela exclui |
| prop de molécula usada com o sentido errado | palavra ambígua entre as duas camadas |
| estado exigido "atendido" por uma linha de rodapé | faltava dizer que afordância fina não satisfaz |
| dois estados da mesma região com layouts diferentes | faltava exigir apresentação consistente |
| medida do DS ignorada, número cravado na página | template trazia o número em vez da intenção |
| seção citando algo que não existe mais | texto morto após remoção parcial |
