/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-side-nav-scrollspy.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSection';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  sectionNav: "scrollspy"
};

export const skill = `# Metadata
- TagName: groupnavigatesection--ml-side-nav-scrollspy

# Objective
Fornecer navegação lateral que vincule a seções da página, destacando automaticamente a seção visível conforme o usuário rola, e permitindo navegação suave até a seção selecionada.

# Responsibilities
- Exibir uma lista vertical de itens de navegação, cada um representando uma seção distinta da página com um identificador único e um rótulo textual.
- Distinguir visualmente o item de navegação atualmente ativo dos demais.
- Quando nenhuma seleção inicial for fornecida, definir como padrão o primeiro item disponível.
- Atualizar a seleção ativa quando o usuário ativar um item de navegação disponível.
- Notificar o sistema sobre mudanças de seleção, fornecendo o identificador e o rótulo da seção.
- Solicitar rolagem suave até a seção da página correspondente quando um item for ativado, desde que a seção alvo exista.
- Detectar automaticamente qual seção da página está visível na área de visualização durante a rolagem e sincronizar o item de navegação ativo para corresponder a essa seção.
- Desabilitar todas as interações e impedir mudanças de seleção quando o componente estiver em estado desabilitado.
- Impedir que itens de navegação desabilitados sejam selecionados manualmente ou automaticamente via detecção de rolagem.
- Renderizar visível apenas o conteúdo associado ao item ativo; ocultar o conteúdo dos itens inativos.
- Exibir um estado de carregamento que substitua a lista de navegação e o conteúdo até que o carregamento seja concluído.
- Apresentar qualquer título fornecido acima da lista de itens e utilizá-lo como nome acessível para a região de navegação.
- Permitir navegação por teclado entre os itens e ativação do item focado.

# Constraints
- A ativação de um item cuja seção alvo não exista não deve produzir erros e deve ignorar a ação de rolagem.
- Itens desabilitados não podem ser ativados por nenhum meio.
- O destaque automático baseado em rolagem deve refletir com precisão a seção mais proeminente na área de visualização.
- Durante o carregamento, o componente não deve exibir itens de navegação ou conteúdo, nem permitir interação.
- O estado ativo deve permanecer consistente entre seleções do usuário e atualizações automáticas de rolagem.
- O componente deve suportar um rótulo acessível para a região de navegação quando um título for fornecido.

# Notes
- A navegação é destinada ao uso como barra lateral fixa ao lado de conteúdo de página rolável.`;

