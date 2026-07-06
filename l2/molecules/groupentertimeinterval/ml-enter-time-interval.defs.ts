/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-enter-time-interval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTimeInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "fields",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-enter-time-interval

# Objective
Definir e apresentar um intervalo de horário individual, com hora de início e hora de fim, permitindo alternância entre edição e visualização, aplicando validações e refletindo estados de interação conforme o contrato do grupo.

# Responsibilities
- Apresentar um par de horários no formato 24 horas, com opção de incluir segundos
- Disponibilizar campos para edição do horário de início e do horário de fim quando em modo de edição
- Exibir apenas o texto formatado do intervalo quando em modo de visualização, sem campos editáveis, mensagens de erro ou conteúdo auxiliar
- Identificar e sinalizar intervalos que ultrapassem a meia-noite quando essa opção estiver habilitada
- Notificar quando o intervalo completo for confirmado, quando cada horário for modificado individualmente, e quando os campos receberem ou perderem foco
- Aplicar restrições de seleção baseadas em limites de horário, passo de minutos, duração mínima e máxima, permissão de horários idênticos e permissão de intervalo overnight
- Exibir mensagem de erro quando fornecida, ou apresentar conteúdo auxiliar quando disponível e não houver erro
- Responder ao estado de carregamento impedindo interações e exibindo indicador visual apropriado
- Responder ao estado desabilitado impedindo interações em ambos os campos e aplicando aparência de inatividade
- Responder ao estado somente leitura impedindo alterações enquanto mantém o texto legível e selecionável
- Permitir a associação de rótulos distintos para o campo geral, para o horário de início e para o horário de fim, fornecidos externamente
- Diferenciar visualmente qual campo de horário está ativo no momento
- Diferenciar visualmente quando ambos os horários estiverem definidos

# Constraints
- Em modo de visualização, o layout deve conter apenas o intervalo formatado, ocultando qualquer elemento de entrada ou suporte
- O indicador de próximo dia deve ser exibido somente quando o intervalo overnight estiver permitido e o horário de fim for anterior ao de início
- Quando ambos os horários estiverem ausentes, a apresentação deve seguir o padrão definido pelo contrato do grupo
- A mensagem de erro tem prioridade sobre o conteúdo auxiliar; o conteúdo auxiliar só deve aparecer na ausência de erro
- As regras de validação devem restringir as seleções inválidas antes da confirmação do intervalo
- A duração entre início e fim deve respeitar os limites mínimo e máximo estabelecidos, quando definidos
- O formato de exibição deve manter consistência com o padrão 24 horas e incluir segundos apenas quando configurado para tal
- Cada ocorrência deste elemento gerencia exclusivamente um único par de horários; o agrupamento de múltiplos intervalos deve ser tratado externamente

# Notes
- O texto descritivo de recorrência, incluindo dias da semana, deve ser fornecido externamente através do rótulo geral, não sendo gerado internamente
- A composição de múltiplos intervalos de horário deve ser tratada externamente, agrupando várias ocorrências deste elemento conforme necessário`;

