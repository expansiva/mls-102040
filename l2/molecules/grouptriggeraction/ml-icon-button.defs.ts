/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-icon-button.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupTriggerAction';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  actionStyle: "icon"
};

export const skill = `# Metadata
- TagName: grouptriggeraction--ml-icon-button

# Objective
Botão compacto contendo apenas ícone para execução de ações rápidas em barras de ferramentas, tabelas e listas. Deve permitir que o usuário execute uma ação imediata ao interagir com o ícone, apresentando-se em diferentes tamanhos e respeitando estados de interação definidos pelo grupo groupTriggerAction.

# Responsibilities
- Apresentar exclusivamente um ícone como conteúdo visível, sem texto aparente
- Permitir a associação de uma descrição textual oculta para identificação da ação
- Utilizar a descrição textual disponível como identificação acessível quando o botão contiver apenas ícone
- Disparar a ação vinculada ao grupo quando acionado pelo usuário, exceto em estados restritivos
- Bloquear totalmente a interação quando estiver ocupado processando uma tarefa
- Bloquear totalmente a interação quando estiver inativo
- Indicar estado de ocupado de forma perceptível
- Disponibilizar variações de tamanho adequadas para contextos compactos

# Constraints
- Não deve exibir texto visível sob nenhuma circunstância
- Não deve acionar a ação vinculada quando estiver inativo
- Não deve acionar a ação vinculada quando estiver ocupado
- Deve manter o ícone perfeitamente centralizado em qualquer tamanho disponível
- Em estado ocupado, o indicador de ocupação deve ocupar o mesmo espaço e alinhamento do ícone
- Deve reagir visualmente aos estados de repouso, ao passar o cursor, ao pressionar e ao receber foco
- O estado de foco deve ser evidenciado por um anel ou contorno visível
- O estado inativo deve apresentar redução de opacidade e ausência de resposta a interações
- Deve respeitar as variações de tamanho definidas pelo grupo: xs, sm, md e lg

# Notes
- A descrição textual oculta é essencial para acessibilidade em botões sem texto visível
- Indicação de estado ocupado deve ser comunicada de forma que recursos de acessibilidade possam identificar
- Projetado para uso em espaços restritos como linhas de tabela, cards e barras de ferramentas`;

