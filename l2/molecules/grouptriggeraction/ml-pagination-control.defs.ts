/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-pagination-control.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupTriggerAction';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  actionStyle: "standard"
};

export const skill = `# Metadata
- TagName: grouptriggeraction--ml-pagination-control

# Objective
Um controle de paginação que exibe números de páginas clicáveis e botões de navegação (primeira, anterior, próxima, última), permitindo ao usuário navegar entre páginas de um conjunto de dados. Segue o contrato do grupo groupTriggerAction, despachando um evento action com o número da página alvo no detalhe.

# Responsibilities
- Exibe números de páginas como itens clicáveis dispostos em uma linha horizontal
- Mostra quatro botões de navegação: primeira página (<<), página anterior (<), próxima página (>) e última página (>>), posicionados ao redor dos números de página
- Destaca visualmente a página atualmente selecionada, que carrega o maior peso visual entre os itens de página
- Os botões de navegação são visualmente subordinados aos números de página
- Desabilita os botões de primeira e anterior quando a página atual é a primeira página
- Desabilita os botões de próxima e última quando a página atual é a última página
- Botões de navegação desabilitados têm destaque visual reduzido
- Despacha um evento action contendo o número da página alvo no detalhe quando um número de página ou botão de navegação é clicado
- Limita o número de páginas visíveis conforme uma propriedade configurável, exibindo reticências para indicar páginas fora do intervalo visível
- Mantém a página atual sempre visível na lista de números de página
- As reticências têm peso visual menor que os números de página
- Substitui o conteúdo interativo por um indicador de carregamento durante o estado de carregamento
- Anuncia mudanças de página para tecnologias assistivas

# Constraints
- Não despacha eventos quando o componente está desabilitado ou em estado de carregamento
- Os números de página e botões de navegação são dispostos exclusivamente em uma linha horizontal
- Os estados visuais suportados são: normal, hover, ativo (pressionado), focado, desabilitado e carregando
- O componente recebe a página atual e o total de páginas como entradas
- O limite de páginas visíveis é configurável por propriedade
- O evento action deve conter obrigatoriamente o número da página alvo no detalhe

# Notes
- A página atual permanece sempre dentro do intervalo visível, mesmo quando o total de páginas excede o limite configurável
- As reticências aparecem tanto no início quanto no final do intervalo visível quando há páginas ocultas em cada extremidade
- O componente segue o contrato do grupo groupTriggerAction quanto ao despacho do evento action
- A acessibilidade inclui anúncio de mudanças de página via atributos ARIA para leitores de tela
- Durante o estado de carregamento, toda interação é bloqueada e o indicador de carregamento substitui o conteúdo interativo`;
