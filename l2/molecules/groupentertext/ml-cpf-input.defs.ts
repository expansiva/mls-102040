/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-cpf-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupentertext--ml-cpf-input
# Objective
Permitir a entrada e exibição de CPF com formatação padrão, mantendo o valor armazenado como apenas números.
# Responsibilities
- Aceitar a digitação de até 11 dígitos numéricos para CPF.
- Exibir o CPF formatado como 000.000.000-00 quando houver 11 dígitos.
- Manter e disponibilizar o valor armazenado apenas como sequência numérica, sem pontos e hífen.
- Em modo de edição, permitir entrada em uma única linha com formatação aplicada na exibição.
- Disparar atualização a cada digitação com o valor bruto numérico.
- Ao perder o foco, emitir eventos de alteração e de perda de foco com o valor bruto numérico.
- Em modo de visualização, exibir o valor formatado quando existir; caso contrário, exibir “—”.
- Exibir rótulo, ajuda, prefixo e sufixo quando fornecidos.
- Exibir mensagem de erro quando fornecida e aplicar o estado de erro.
# Constraints
- Quando desabilitado, não permitir interação nem emitir eventos de entrada.
- Quando somente leitura, bloquear edição e permitir seleção de texto, sem emitir eventos de entrada.
- Se obrigatório e o valor estiver vazio, entrar em estado de erro quando a mensagem de erro for fornecida.
- Deve apresentar os estados visuais: normal, focado, preenchido, desabilitado, somente leitura, erro e carregando.
- A exibição deve sempre seguir o formato de CPF com pontos e hífen quando houver valor.
# Notes
- O valor armazenado é sempre numérico e sem formatação.`;

