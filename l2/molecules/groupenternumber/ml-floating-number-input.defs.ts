/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-floating-number-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterNumber';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  numberInput: "input",
  labelPlacement: "floating",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenternumber--ml-floating-number-input

# Objective
Permitir ao usuário inserir ou visualizar números inteiros e decimais em um campo com label flutuante, seguindo regras de acessibilidade, formatação e estados visuais definidos pelo contrato groupEnterNumber.

# Responsibilities
- Aceitar entrada de valores inteiros e decimais conforme as propriedades de configuração.
- Exibir e atualizar o valor atual, podendo ser um número ou nulo.
- Emitir evento de alteração de valor a cada modificação.
- Emitir evento de confirmação de valor ao perder foco ou ao usar controles de incremento/decremento.
- Emitir eventos ao receber e ao perder foco.
- Alternar entre modo de edição (input) e visualização (texto formatado) conforme configuração.
- Impedir interação quando desabilitado e refletir visualmente esse estado.
- Impedir edição, mas permitir seleção de texto quando somente leitura.
- Indicar obrigatoriedade visual e semanticamente quando requerido.
- Exibir mensagem de erro e refletir estado de erro quando configurado.
- Exibir indicador de carregamento e bloquear interação quando em carregamento.
- Respeitar limites mínimos, máximos e passos definidos para o valor.
- Renderizar rótulo flutuante, prefixo, sufixo e mensagem auxiliar conforme slots e propriedades.
- Aplicar regras de acessibilidade para rótulo, erro, obrigatoriedade e estado inválido.
- Formatar o valor exibido conforme localidade e quantidade de decimais.
- Exibir valor formatado como texto quando em modo de visualização, sem input, erro ou helper.
- Exibir traço (—) quando o valor for nulo em modo de visualização.

# Constraints
- O campo só aceita números válidos conforme as propriedades de decimais, localidade, mínimo, máximo e passo.
- Não permite interação ou edição quando desabilitado ou em carregamento.
- Não permite edição quando somente leitura, mas permite seleção do texto.
- O campo deve indicar obrigatoriedade e erro de forma visual e acessível.
- O label deve flutuar para fora do campo ao receber foco ou quando houver valor; caso contrário, permanece dentro do campo.
- O helper só é exibido quando não há erro e o slot correspondente está presente.
- Em modo de visualização, não exibe input, erro ou helper, apenas o valor formatado, prefixo e sufixo.
- Quando o valor for nulo em modo de visualização, exibe traço (—).
- O componente deve garantir espaçamento e alinhamento adequados entre todos os elementos visuais.
- O componente deve aplicar estilos visuais e de acessibilidade conforme o estado atual (normal, focado, preenchido, desabilitado, somente leitura, erro, carregando).

# Notes
- O componente deve garantir que todos os estados e transições sejam perceptíveis e acessíveis ao usuário.
- O label flutuante deve ter transição suave entre os estados.
- O componente deve suportar dark mode conforme padrão do contrato.`;

