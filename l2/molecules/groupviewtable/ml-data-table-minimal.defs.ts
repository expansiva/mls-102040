/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table-minimal.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewTable';
export const skill = `# Metadata
- TagName: groupviewtable--ml-data-table-minimal

# Objective
Fornecer uma tabela de dados minimalista com ordenação, seleção opcional, estados de vazio e carregamento, paginação e suporte completo a dark mode.

# Responsibilities
- Renderizar a hierarquia de slots do grupo (Caption, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, Empty, Loading) conforme o contrato.
- Exibir o estado de carregamento quando solicitado, substituindo o conteúdo da tabela pelo conteúdo de Loading ou pelo padrão do contrato.
- Exibir o estado vazio quando não houver linhas no corpo, usando Empty ou o padrão do contrato.
- Permitir ordenação nas colunas marcadas como ordenáveis, alternando a direção e emitindo o evento de ordenação com a chave e direção.
- Indicar visualmente a coluna ativa de ordenação e a direção atual.
- Quando a seleção estiver habilitada, permitir selecionar/deselecionar todas as linhas e linhas individuais, mantendo o valor de seleção e emitindo alterações.
- Emitir evento de clique em linha quando uma linha for acionada fora do controle de seleção.
- Quando houver paginação habilitada, permitir a troca de página e emitir o evento correspondente.
- Propagar o estado de edição para conteúdos dentro de células conforme o contrato.
- Exibir mensagem de erro abaixo da tabela quando houver erro informado.
- Renderizar o conteúdo fornecido pelos slots TableHead, TableCell, Empty e Loading conforme fornecido pelo usuário.

# Constraints
- Quando loading estiver ativo, o conteúdo da tabela não deve ser exibido.
- Quando não houver linhas, o estado vazio deve ser mostrado e nenhuma linha deve ser exibida.
- A ordenação só deve estar disponível para colunas marcadas como ordenáveis.
- Quando disabled estiver ativo, deve bloquear ordenação, seleção e paginação, mantendo o estado visual de desabilitado.
- O valor de seleção deve refletir os índices das linhas selecionadas no formato esperado pelo contrato.
- O estado de seleção não deve interferir no disparo do evento de clique em linha fora do controle de seleção.

# Notes
- O suporte a dark mode deve cobrir todos os estados visuais e de feedback (normal, selecionado, vazio, carregando, erro e desabilitado).`;

