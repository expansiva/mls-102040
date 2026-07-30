// Fixture de teste do template salesforceStyle/inventoryControl.
// Contém: contrato de dados (consulta + comandos), regras declaradas, superfície de amarração,
// vocabulário de tokens e dados estáticos. NÃO contém decisão de layout nem de aparência —
// essas saem do template.
//
// CONVERTIDA a partir do .defs de produção (definition/dataBindings, mesmo pageId
// "stockManagement") + os .defs de operação canônicos em
// mls-102051/l4/cafeFlow/operations/{browseStockItems,createStockItem,updateStockItem,
// deleteStockItem,createStockAdjustment}.defs.ts, que são a fonte de tipos/campos —
// o .defs de produção não declara tipo nem shape de saída. Mesmo domínio de `cafeFlowStock`;
// difere nos campos que o outputShape de produção expõe além do básico (description/updatedAt
// em addStockItem, description em editStockItem, managerUserId/shiftId/notes/status em
// registerStockAdjustment) — testa o §7.2 ("o que ⟦detalhe⟧ trouxer além deles").

export const fixture = {
  fixtureId: 'cafeFlowInventoryControl',
  domain: 'Cafeteria — controle de insumos',
  moduleContext: 'CaféFlow · Estoque',
  language: 'pt-BR',
  actor: 'gerente',
  entity: 'StockItem',
  purpose: 'O gerente mantém o cadastro de insumos, revisa alertas de estoque baixo e registra ajustes manuais de saldo.',

  query: {
    id: 'listStockItems',
    inputs: [
      { name: 'nameFilter', type: 'string' },
      { name: 'lowStockOnly', type: 'boolean' },
      { name: 'page', type: 'number' },
      { name: 'pageSize', type: 'number' },
    ],
    output: {
      kind: 'paginated',
      arrayField: 'stockItems',
      totalField: 'total',
      item: [
        { name: 'stockItemId', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'currentBalance', type: 'number' },
        { name: 'minimumLevel', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'updatedAt', type: 'datetime' },
        { name: 'isLowStock', type: 'boolean' },
      ],
    },
  },

  commands: [
    {
      id: 'addStockItem',
      inputs: [
        { name: 'name', type: 'string', required: true },
        { name: 'unit', type: 'string', required: true },
        { name: 'currentBalance', type: 'number', required: true },
        { name: 'minimumLevel', type: 'number', required: true },
        { name: 'description', type: 'string' },
      ],
      output: [
        { name: 'stockItemId', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'currentBalance', type: 'number' },
        { name: 'minimumLevel', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'createdAt', type: 'datetime' },
        { name: 'updatedAt', type: 'datetime' },
      ],
    },
    {
      id: 'editStockItem',
      inputs: [
        { name: 'stockItemId', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'unit', type: 'string', required: true },
        { name: 'minimumLevel', type: 'number', required: true },
        { name: 'description', type: 'string' },
      ],
      output: [
        { name: 'stockItemId', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'currentBalance', type: 'number' },
        { name: 'minimumLevel', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'updatedAt', type: 'datetime' },
      ],
    },
    {
      id: 'removeStockItem',
      inputs: [{ name: 'stockItemId', type: 'string', required: true }],
      output: [
        { name: 'stockItemId', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    },
    {
      id: 'registerStockAdjustment',
      inputs: [
        { name: 'stockItemId', type: 'string', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'direction', type: 'string', required: true },
        { name: 'reason', type: 'string', required: true },
        { name: 'notes', type: 'string' },
      ],
      output: [
        { name: 'stockAdjustmentId', type: 'string' },
        { name: 'stockItemId', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'direction', type: 'string' },
        { name: 'reason', type: 'string' },
        { name: 'managerUserId', type: 'string' },
        { name: 'shiftId', type: 'string' },
        { name: 'resultingBalance', type: 'number' },
        { name: 'notes', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'createdAt', type: 'datetime' },
      ],
    },
  ],

  businessRules: [
    'Um insumo está em estoque baixo quando o saldo atual (currentBalance) é menor ou igual ao nível mínimo (minimumLevel).',
    'O gerente pode registrar ajuste manual de saldo informando quantidade, direção e motivo.',
    'A quantidade de um ajuste é sempre positiva.',
    'O ajuste manual fica registrado como evento (status) e atualiza o saldo do insumo para o valor resultante.',
    'Atualizar o cadastro do insumo (editStockItem) não altera o saldo atual — o saldo muda somente por ajuste registrado.',
  ],

  // Conjuntos de valores DECLARADOS pelo domínio. Vazio = nenhum conjunto fechado conhecido.
  // Os .defs de operação descrevem exemplos de unidade/motivo em prosa ("kg, liter, portion ou
  // unit"; "contagem, perda, vencimento, divergência ou outro") mas não como um enum/options
  // formal — por isso permanecem de fora daqui (nunca inventar conjunto a partir de texto livre).
  declaredOptionSets: [],

  binding: {
    baseClass: 'CafeFlowStockManagementBase',
    // Contrato de TIPOS da amarração — o que a classe base expõe. A página compila em
    // strict contra isto e não precisa de mais nada para tipar.
    contract: {
      itemTypeName: 'StockItemRow',
      itemFields: 'todo campo do item é `T | null` (T = o tipo declarado em query.output.item)',
      queryData: '{ stockItems: StockItemRow[]; total: number } | null',
      queryState: "'' | 'loading' | 'success' | 'error'",
      queryError: 'string',
      commandState: "'' | 'loading' | 'success' | 'error'",
      commandError: 'string',
      commandOutput: 'Record<string, unknown> | null',
      inputState: 'string | number | boolean, conforme o tipo declarado do campo',
      setter: '(value: T) => void',
      handler: '() => void',
      msg: '(key: string) => string',
    },
    queries: {
      listStockItems: {
        data: 'listStockItemsData',
        state: 'listStockItemsState',
        error: 'listStockItemsError',
        handler: 'handleListStockItemsClick',
        inputs: {
          nameFilter: { state: 'listStockItemsNameFilter', setter: 'setListStockItemsNameFilter' },
          lowStockOnly: { state: 'listStockItemsLowStockOnly', setter: 'setListStockItemsLowStockOnly' },
          page: { state: 'listStockItemsPage', setter: 'setListStockItemsPage' },
          pageSize: { state: 'listStockItemsPageSize', setter: 'setListStockItemsPageSize' },
        },
      },
    },
    commands: {
      addStockItem: {
        state: 'addStockItemState',
        error: 'addStockItemError',
        output: 'addStockItemOutput',
        handler: 'handleAddStockItemClick',
        inputs: {
          name: { state: 'addStockItemName', setter: 'setAddStockItemName' },
          unit: { state: 'addStockItemUnit', setter: 'setAddStockItemUnit' },
          currentBalance: { state: 'addStockItemCurrentBalance', setter: 'setAddStockItemCurrentBalance' },
          minimumLevel: { state: 'addStockItemMinimumLevel', setter: 'setAddStockItemMinimumLevel' },
          description: { state: 'addStockItemDescription', setter: 'setAddStockItemDescription' },
        },
      },
      editStockItem: {
        state: 'editStockItemState',
        error: 'editStockItemError',
        output: 'editStockItemOutput',
        handler: 'handleEditStockItemClick',
        inputs: {
          stockItemId: { state: 'editStockItemStockItemId', setter: 'setEditStockItemStockItemId' },
          name: { state: 'editStockItemName', setter: 'setEditStockItemName' },
          unit: { state: 'editStockItemUnit', setter: 'setEditStockItemUnit' },
          minimumLevel: { state: 'editStockItemMinimumLevel', setter: 'setEditStockItemMinimumLevel' },
          description: { state: 'editStockItemDescription', setter: 'setEditStockItemDescription' },
        },
      },
      removeStockItem: {
        state: 'removeStockItemState',
        error: 'removeStockItemError',
        output: 'removeStockItemOutput',
        handler: 'handleRemoveStockItemClick',
        inputs: {
          stockItemId: { state: 'removeStockItemStockItemId', setter: 'setRemoveStockItemStockItemId' },
        },
      },
      registerStockAdjustment: {
        state: 'registerStockAdjustmentState',
        error: 'registerStockAdjustmentError',
        output: 'registerStockAdjustmentOutput',
        handler: 'handleRegisterStockAdjustmentClick',
        inputs: {
          stockItemId: { state: 'registerStockAdjustmentStockItemId', setter: 'setRegisterStockAdjustmentStockItemId' },
          quantity: { state: 'registerStockAdjustmentQuantity', setter: 'setRegisterStockAdjustmentQuantity' },
          direction: { state: 'registerStockAdjustmentDirection', setter: 'setRegisterStockAdjustmentDirection' },
          reason: { state: 'registerStockAdjustmentReason', setter: 'setRegisterStockAdjustmentReason' },
          notes: { state: 'registerStockAdjustmentNotes', setter: 'setRegisterStockAdjustmentNotes' },
        },
      },
    },
    // Mensagens disponíveis via this.msg('<chave>'). Mapa vazio = usar texto literal.
    i18n: {
      'stockManagement.title': 'Controlar estoque',
      'stockManagement.purpose': 'Mantenha o cadastro de insumos, acompanhe alertas de estoque baixo e registre ajustes de saldo.',
      'stockManagement.action.create': 'Novo insumo',
      'stockManagement.empty': 'Nenhum insumo cadastrado.',
    },
  },

  seed: {
    // Tamanho da coleção e ÚNICA autoridade — tem de bater com rows.length (61). Maior que uma
    // página (pageSize 25) de propósito: com uma página só, a molécula esconde a paginação e não
    // há o que testar. São 3 páginas: 25 + 25 + 11.
    total: 61,
    rows: [
      { stockItemId: 'si-001', name: 'Café em grãos 100% arábica', unit: 'kg', currentBalance: 128.5, minimumLevel: 50, isLowStock: false, description: 'Torra média, fornecedor Serra Alta', updatedAt: '2026-07-24T14:12:00Z' },
      { stockItemId: 'si-002', name: 'Leite integral UHT caixa 1L — fornecedor Vale Verde (contrato mensal renovável)', unit: 'L', currentBalance: 96, minimumLevel: 120, isLowStock: true, description: 'Entrega toda segunda-feira', updatedAt: '2026-07-25T09:40:00Z' },
      { stockItemId: 'si-003', name: 'Açúcar refinado', unit: 'kg', currentBalance: 42, minimumLevel: 30, isLowStock: false, description: null, updatedAt: '2026-07-21T16:05:00Z' },
      { stockItemId: 'si-004', name: 'Copo descartável 300ml', unit: 'un', currentBalance: 1280, minimumLevel: 500, isLowStock: false, description: 'Caixa com 100 unidades', updatedAt: '2026-07-23T11:22:00Z' },
      { stockItemId: 'si-005', name: 'Chocolate em pó 50% cacau', unit: 'kg', currentBalance: 6.5, minimumLevel: 8, isLowStock: true, description: null, updatedAt: '2026-07-25T18:30:00Z' },
      { stockItemId: 'si-006', name: 'Canela em pó', unit: 'g', currentBalance: 850, minimumLevel: 300, isLowStock: false, description: 'Pote de 250g', updatedAt: '2026-07-18T08:15:00Z' },
      { stockItemId: 'si-007', name: 'Creme de leite fresco', unit: 'L', currentBalance: 14, minimumLevel: 20, isLowStock: true, description: 'Validade curta, conferir semanalmente', updatedAt: '2026-07-26T07:05:00Z' },
      { stockItemId: 'si-008', name: 'Farinha de trigo tipo 1', unit: 'kg', currentBalance: 75, minimumLevel: 40, isLowStock: false, description: null, updatedAt: '2026-07-20T13:48:00Z' },
      { stockItemId: 'si-009', name: 'Manteiga sem sal', unit: 'kg', currentBalance: 12.4, minimumLevel: 10, isLowStock: false, description: 'Uso exclusivo da confeitaria', updatedAt: '2026-07-24T10:10:00Z' },
      { stockItemId: 'si-010', name: 'Ovos brancos', unit: 'un', currentBalance: 360, minimumLevel: 240, isLowStock: false, description: 'Bandeja com 30', updatedAt: '2026-07-25T06:55:00Z' },
      { stockItemId: 'si-011', name: 'Xarope de baunilha', unit: 'L', currentBalance: 3.2, minimumLevel: 4, isLowStock: true, description: null, updatedAt: '2026-07-22T15:35:00Z' },
      { stockItemId: 'si-012', name: 'Xarope de caramelo', unit: 'L', currentBalance: 5.8, minimumLevel: 4, isLowStock: false, description: null, updatedAt: '2026-07-22T15:36:00Z' },
      { stockItemId: 'si-013', name: 'Chá preto em sachê', unit: 'un', currentBalance: 420, minimumLevel: 200, isLowStock: false, description: 'Caixa com 50 sachês', updatedAt: '2026-07-19T17:20:00Z' },
      { stockItemId: 'si-014', name: 'Chá de hortelã em sachê', unit: 'un', currentBalance: 180, minimumLevel: 200, isLowStock: true, description: null, updatedAt: '2026-07-19T17:21:00Z' },
      { stockItemId: 'si-015', name: 'Guardanapo de papel', unit: 'un', currentBalance: 2400, minimumLevel: 1000, isLowStock: false, description: 'Pacote com 200', updatedAt: '2026-07-17T12:00:00Z' },
      { stockItemId: 'si-016', name: 'Tampa para copo 300ml', unit: 'un', currentBalance: 940, minimumLevel: 500, isLowStock: false, description: null, updatedAt: '2026-07-23T11:25:00Z' },
      { stockItemId: 'si-017', name: 'Leite vegetal de aveia', unit: 'L', currentBalance: 28, minimumLevel: 24, isLowStock: false, description: 'Alternativa sem lactose', updatedAt: '2026-07-26T08:40:00Z' },
      { stockItemId: 'si-018', name: 'Pão de fermentação natural', unit: 'un', currentBalance: 18, minimumLevel: 25, isLowStock: true, description: 'Produção própria, saldo diário', updatedAt: '2026-07-26T05:30:00Z' },
      { stockItemId: 'si-019', name: 'Queijo prato fatiado', unit: 'kg', currentBalance: 7.9, minimumLevel: 6, isLowStock: false, description: null, updatedAt: '2026-07-25T14:50:00Z' },
      { stockItemId: 'si-020', name: 'Presunto cozido fatiado', unit: 'kg', currentBalance: 5.2, minimumLevel: 6, isLowStock: true, description: null, updatedAt: '2026-07-25T14:52:00Z' },
      { stockItemId: 'si-021', name: 'Suco de laranja integral', unit: 'L', currentBalance: 36, minimumLevel: 20, isLowStock: false, description: 'Garrafa de 1L', updatedAt: '2026-07-24T09:15:00Z' },
      { stockItemId: 'si-022', name: 'Água mineral sem gás 500ml', unit: 'un', currentBalance: 288, minimumLevel: 144, isLowStock: false, description: null, updatedAt: '2026-07-21T10:05:00Z' },
      { stockItemId: 'si-023', name: 'Filtro de papel para coador', unit: 'un', currentBalance: 0, minimumLevel: 100, isLowStock: true, description: 'Reposição urgente', updatedAt: '2026-07-26T09:00:00Z' },
      { stockItemId: 'si-024', name: 'Detergente neutro', unit: 'L', currentBalance: 9.5, minimumLevel: 5, isLowStock: false, description: null, updatedAt: '2026-07-16T15:45:00Z' },
      { stockItemId: 'si-025', name: 'Papel toalha industrial', unit: 'un', currentBalance: 62, minimumLevel: 40, isLowStock: false, description: 'Bobina de 200m', updatedAt: '2026-07-18T11:30:00Z' },
      { stockItemId: 'si-026', name: 'Café em grãos blend house', unit: 'kg', currentBalance: 74, minimumLevel: 40, isLowStock: false, description: 'Torra escura, uso em espresso', updatedAt: '2026-07-23T08:20:00Z' },
      { stockItemId: 'si-027', name: 'Café descafeinado em grãos', unit: 'kg', currentBalance: 11, minimumLevel: 15, isLowStock: true, description: null, updatedAt: '2026-07-25T13:05:00Z' },
      { stockItemId: 'si-028', name: 'Leite desnatado UHT caixa 1L', unit: 'L', currentBalance: 54, minimumLevel: 60, isLowStock: true, description: 'Demanda crescente no turno da manhã', updatedAt: '2026-07-26T07:50:00Z' },
      { stockItemId: 'si-029', name: 'Leite sem lactose caixa 1L', unit: 'L', currentBalance: 38, minimumLevel: 24, isLowStock: false, description: null, updatedAt: '2026-07-22T10:15:00Z' },
      { stockItemId: 'si-030', name: 'Bebida vegetal de amêndoas', unit: 'L', currentBalance: 22, minimumLevel: 18, isLowStock: false, description: 'Sem açúcar adicionado', updatedAt: '2026-07-24T16:40:00Z' },
      { stockItemId: 'si-031', name: 'Bebida vegetal de aveia barista', unit: 'L', currentBalance: 16, minimumLevel: 20, isLowStock: true, description: 'Preferida para latte art', updatedAt: '2026-07-26T11:25:00Z' },
      { stockItemId: 'si-032', name: 'Creme de leite fresco', unit: 'L', currentBalance: 12.5, minimumLevel: 10, isLowStock: false, description: 'Validade curta, girar rápido', updatedAt: '2026-07-25T06:35:00Z' },
      { stockItemId: 'si-033', name: 'Açúcar mascavo', unit: 'kg', currentBalance: 18, minimumLevel: 12, isLowStock: false, description: null, updatedAt: '2026-07-19T14:00:00Z' },
      { stockItemId: 'si-034', name: 'Adoçante em sachê', unit: 'un', currentBalance: 420, minimumLevel: 300, isLowStock: false, description: 'Caixa com 1000 unidades', updatedAt: '2026-07-17T09:10:00Z' },
      { stockItemId: 'si-035', name: 'Calda de caramelo', unit: 'L', currentBalance: 4.2, minimumLevel: 6, isLowStock: true, description: 'Usada em bebidas geladas', updatedAt: '2026-07-26T15:55:00Z' },
      { stockItemId: 'si-036', name: 'Calda de chocolate meio amargo', unit: 'L', currentBalance: 7.8, minimumLevel: 6, isLowStock: false, description: null, updatedAt: '2026-07-23T17:20:00Z' },
      { stockItemId: 'si-037', name: 'Calda de baunilha', unit: 'L', currentBalance: 5.5, minimumLevel: 4, isLowStock: false, description: null, updatedAt: '2026-07-20T12:45:00Z' },
      { stockItemId: 'si-038', name: 'Cacau em pó 100%', unit: 'kg', currentBalance: 6.4, minimumLevel: 5, isLowStock: false, description: 'Para mocha e cappuccino', updatedAt: '2026-07-21T08:05:00Z' },
      { stockItemId: 'si-039', name: 'Canela em pó', unit: 'kg', currentBalance: 1.2, minimumLevel: 2, isLowStock: true, description: null, updatedAt: '2026-07-25T10:30:00Z' },
      { stockItemId: 'si-040', name: 'Chá preto em sachê', unit: 'un', currentBalance: 240, minimumLevel: 150, isLowStock: false, description: 'Caixa com 100 sachês', updatedAt: '2026-07-18T13:15:00Z' },
      { stockItemId: 'si-041', name: 'Chá de camomila em sachê', unit: 'un', currentBalance: 96, minimumLevel: 120, isLowStock: true, description: 'Saída alta no fim da tarde', updatedAt: '2026-07-26T18:00:00Z' },
      { stockItemId: 'si-042', name: 'Chá verde em sachê', unit: 'un', currentBalance: 168, minimumLevel: 120, isLowStock: false, description: null, updatedAt: '2026-07-22T15:10:00Z' },
      { stockItemId: 'si-043', name: 'Pão de fermentação natural', unit: 'un', currentBalance: 34, minimumLevel: 30, isLowStock: false, description: 'Entrega diária às 6h', updatedAt: '2026-07-27T06:10:00Z' },
      { stockItemId: 'si-044', name: 'Pão de queijo congelado', unit: 'kg', currentBalance: 21.5, minimumLevel: 25, isLowStock: true, description: 'Assar sob demanda', updatedAt: '2026-07-26T07:20:00Z' },
      { stockItemId: 'si-045', name: 'Croissant congelado', unit: 'un', currentBalance: 88, minimumLevel: 60, isLowStock: false, description: null, updatedAt: '2026-07-24T05:55:00Z' },
      { stockItemId: 'si-046', name: 'Bolo de cenoura em fatias', unit: 'un', currentBalance: 14, minimumLevel: 20, isLowStock: true, description: 'Produção própria, 2x por semana', updatedAt: '2026-07-25T14:35:00Z' },
      { stockItemId: 'si-047', name: 'Cookie de gotas de chocolate', unit: 'un', currentBalance: 132, minimumLevel: 80, isLowStock: false, description: null, updatedAt: '2026-07-23T11:00:00Z' },
      { stockItemId: 'si-048', name: 'Queijo minas padrão', unit: 'kg', currentBalance: 8.6, minimumLevel: 10, isLowStock: true, description: 'Sanduíches e tábuas', updatedAt: '2026-07-26T09:45:00Z' },
      { stockItemId: 'si-049', name: 'Presunto cozido fatiado', unit: 'kg', currentBalance: 6.2, minimumLevel: 8, isLowStock: true, description: null, updatedAt: '2026-07-26T09:45:00Z' },
      { stockItemId: 'si-050', name: 'Manteiga com sal', unit: 'kg', currentBalance: 9.4, minimumLevel: 6, isLowStock: false, description: null, updatedAt: '2026-07-20T08:30:00Z' },
      { stockItemId: 'si-051', name: 'Geleia de morango', unit: 'kg', currentBalance: 3.8, minimumLevel: 3, isLowStock: false, description: 'Pote de 600g', updatedAt: '2026-07-19T16:20:00Z' },
      { stockItemId: 'si-052', name: 'Granola artesanal', unit: 'kg', currentBalance: 5.1, minimumLevel: 4, isLowStock: false, description: null, updatedAt: '2026-07-22T09:05:00Z' },
      { stockItemId: 'si-053', name: 'Iogurte natural integral', unit: 'L', currentBalance: 14, minimumLevel: 18, isLowStock: true, description: 'Base do parfait de frutas', updatedAt: '2026-07-26T10:50:00Z' },
      { stockItemId: 'si-054', name: 'Copo de papel 240ml', unit: 'un', currentBalance: 1450, minimumLevel: 1000, isLowStock: false, description: 'Caixa com 500 unidades', updatedAt: '2026-07-17T11:40:00Z' },
      { stockItemId: 'si-055', name: 'Copo de papel 360ml', unit: 'un', currentBalance: 820, minimumLevel: 1000, isLowStock: true, description: 'Tamanho mais pedido', updatedAt: '2026-07-26T12:15:00Z' },
      { stockItemId: 'si-056', name: 'Tampa plástica para copo quente', unit: 'un', currentBalance: 1980, minimumLevel: 1200, isLowStock: false, description: null, updatedAt: '2026-07-18T10:20:00Z' },
      { stockItemId: 'si-057', name: 'Canudo de papel biodegradável', unit: 'un', currentBalance: 640, minimumLevel: 800, isLowStock: true, description: 'Trocado por exigência de contrato', updatedAt: '2026-07-25T17:30:00Z' },
      { stockItemId: 'si-058', name: 'Guardanapo de papel', unit: 'un', currentBalance: 3200, minimumLevel: 2000, isLowStock: false, description: null, updatedAt: '2026-07-16T09:25:00Z' },
      { stockItemId: 'si-059', name: 'Sacola de papel kraft', unit: 'un', currentBalance: 410, minimumLevel: 300, isLowStock: false, description: 'Para pedidos de balcão', updatedAt: '2026-07-21T13:50:00Z' },
      { stockItemId: 'si-060', name: 'Álcool 70% para higienização', unit: 'L', currentBalance: 12.5, minimumLevel: 8, isLowStock: false, description: null, updatedAt: '2026-07-19T07:15:00Z' },
      { stockItemId: 'si-061', name: 'Pastilha para limpeza de máquina de espresso', unit: 'un', currentBalance: 24, minimumLevel: 30, isLowStock: true, description: 'Ciclo de limpeza semanal', updatedAt: '2026-07-26T20:05:00Z' },
    ],
    scenarios: {
      // sem `total`: com useSeedRows o tamanho vem de seed.total (dois totais divergiam e a
      // página anunciava um número que o seed não tinha)
      populated: { queryState: 'success', useSeedRows: true, filtersApplied: false },
      emptyNoFilter: { queryState: 'success', useSeedRows: false, total: 0, filtersApplied: false },
      emptyByFilter: { queryState: 'success', useSeedRows: false, total: 0, filtersApplied: true },
      loading: { queryState: 'loading', useSeedRows: false, total: 0, filtersApplied: false },
      queryError: { queryState: 'error', useSeedRows: false, total: 0, filtersApplied: false, message: 'Não foi possível carregar os insumos.' },
    },
  },
} as const;

export default fixture;
