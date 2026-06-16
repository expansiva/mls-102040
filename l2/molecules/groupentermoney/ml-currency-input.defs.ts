/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-currency-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterMoney';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupentermoney--ml-currency-input

# Objective
Permitir ao usuário inserir e visualizar valores monetários em USD, com formatação e validação conforme padrão en-US, aceitando até 20 dígitos numéricos.

# Responsibilities
- Aceitar entrada de valores monetários em USD.
- Permitir digitação de números e ponto decimal (.) da esquerda para a direita.
- Ignorar e impedir caracteres não numéricos, exceto o ponto decimal.
- Permitir entrada de pelo menos 20 dígitos numéricos (excluindo o ponto decimal).
- Formatar e exibir o valor conforme padrão en-US, sempre com duas casas decimais.
- Emitir eventos de input a cada alteração e de change/blur ao perder o foco.
- Atualizar e emitir o valor como número com duas casas decimais.
- Definir o valor como null se a entrada estiver vazia ou inválida.
- Suportar modos de edição (input) e visualização (string formatada como moeda USD).
- Impedir edição quando disabled ou readonly estiverem ativos.
- Exibir indicador de carregamento e bloquear entrada quando loading for true.
- Indicar visualmente campos obrigatórios, estados de erro e exibir mensagens de erro.
- Exibir texto de ajuda quando não houver erro.
- Renderizar slots de label e helper em suas posições respectivas, se fornecidos.
- Indicar visualmente os estados disabled e readonly.
- Garantir conformidade de acessibilidade conforme o contrato do grupo.

# Constraints
- Não permitir entrada de caracteres não numéricos, exceto o ponto decimal.
- Limitar a entrada a pelo menos 20 dígitos numéricos (excluindo o ponto decimal).
- O campo deve exibir o placeholder "0.00" quando vazio.
- O valor exibido deve seguir a formatação en-US, com separador de milhar e duas casas decimais.
- O valor deve ser null se a entrada estiver vazia ou inválida.
- O campo não pode ser editado quando disabled ou readonly estiverem ativos.
- O campo deve ser visualmente distinto nos estados disabled (opacidade reduzida) e readonly (texto selecionável).
- Slots de label e helper devem ser renderizados apenas se fornecidos.
- Texto de ajuda não deve ser exibido quando houver erro.
- O indicador de carregamento deve bloquear a entrada quando loading for true.

# Notes
- Exemplo de formatação: ao digitar 123, exibir "1.23"; ao digitar 123456, exibir "1,234.56".
- O campo deve garantir acessibilidade conforme o contrato do grupo.`;

