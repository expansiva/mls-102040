/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-inline-edit-table.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INLINE EDIT TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult, nothing } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/shared/molecules/cn.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No data available',
 selectAll:'Select all rows',
 selectRow:'Select row',
 sortAscending:'Sort ascending',
 sortDescending:'Sort descending',
 pagination:'Table pagination',
 previous:'Previous',
 next:'Next',
 page:'Page',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum dado disponível',
 selectAll:'Selecionar todas as linhas',
 selectRow:'Selecionar linha',
 sortAscending:'Ordenar crescente',
 sortDescending:'Ordenar decrescente',
 pagination:'Paginação da tabela',
 previous:'Anterior',
 next:'Próximo',
 page:'Página',
 },
};
/// **collab_i18n_end**

// O modelo guarda ELEMENTOS, não strings. Antes eram `content: string` e `cells: string[]`, com
// o innerHTML de cada célula — o que matava handler e binding do consumidor e, nesta molécula em
// particular, esvaziava o recurso principal: a edição inline depende de a molécula dentro da
// célula estar viva para receber `is-editing`.
interface ParsedColumn {
 key: string;
 sortable: boolean;
 headEl: Element;
}

interface ParsedRow {
 element: Element;
 cellEls: Element[];
 index: number;
}

@customElement('groupviewtable--ml-inline-edit-table')
export class MlInlineEditTableMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Caption','TableHeader','TableBody','TableRow','TableHead','TableCell','TableFooter','Empty','Loading'];

 // Migrada por INTEIRO para slots vivos, sem sobrar serialização de slot. Numa tabela a célula
 // é onde o consumidor põe controle, e aqui isso é o recurso central: `propagateEditingState`
 // marca `is-editing` nos componentes de dentro da célula, e num clone de string aquilo era
 // apenas um atributo num elemento sem ligação com a página.
 //
 // Migrar por inteiro também evita a segunda pintura: molécula que deixa algum slot serializado
 // e recebe componente nele acaba com o markup já renderizado dentro do próprio snapshot.
 protected usesLiveSlots = true;

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 selectable: boolean = false;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing: boolean = false;

 /**
  * Chaves das linhas em edição, separadas por vírgula — o modo POR LINHA, que é o caso de uso
  * real de uma tabela de edição inline: edita-se um registro por vez, com salvar e cancelar.
  *
  * A linha se identifica por `<TableRow key="...">`, do mesmo jeito que a coluna já usa `key`
  * no `<TableHead>`. Chave e não índice: índice é posição, e posição muda ao ordenar.
  *
  * Vazio e sem `is-editing` = a molécula NÃO mexe em `is-editing` de ninguém. Ver `ownsEditing`.
  */
 @propertyDataSource({ type: String, attribute:'editing-rows' })
 editingRows: string ='';

 @propertyDataSource({ type: Number })
 page: number = 1;

 @propertyDataSource({ type: Number, attribute:'page-size' })
 pageSize: number = 0;

 @propertyDataSource({ type: Number, attribute:'total-items' })
 totalItems: number = 0;

 @propertyDataSource({ type: String })
 value: string ='';

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 loading: boolean = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private sortKey: string | null = null;

 @state()
 private sortDirection:'asc' |'desc' ='asc';

 @state()
 private focusedRowIndex: number = -1;

 @state()
 private parsedColumns: ParsedColumn[] = [];

 @state()
 private parsedRows: ParsedRow[] = [];

 @state()
 private sortedRowIndices: number[] = [];

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 // A estrutura já foi lida no `willUpdate` desta mesma passada.
 this.propagateEditingState();
 }

 /**
  * Propaga em TODO update, sem consultar `changedProperties`.
  *
  * Não é por desconfiança do mapa de mudanças — ele funciona. É porque a propagação também
  * precisa alcançar a célula que ACABOU de ser projetada (linha que entrou pela paginação, por
  * exemplo): ela precisa receber o atributo mesmo sem `isEditing` ou `editingRows` ter mudado.
  *
  * Quem evita o efeito colateral é o `ownsEditing()`: sem `is-editing` nem `editing-rows`, a
  * molécula não toca em nada.
  */
 updated() {
 this.propagateEditingState();
 }

 // ===========================================================================
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: unknown) {
 const isEditingAttr = this.getAttribute('is-editing');
 if (isEditingAttr === `{{${key}}}`) {
 this.propagateEditingState();
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 /**
  * Relê a estrutura e PRESERVA a ordenação vigente.
  *
  * Antes terminava sempre em `initializeSortedIndices()`, que devolve a ordem original — e como
  * era chamada de dentro do `render()`, toda re-renderização apagava a ordenação recém-calculada.
  * O clique no cabeçalho computava a ordem certa e a tela nunca mudava. Medido em 2026-08-04 com
  * a página demotable--funcionariosedicao: `ordemFinal=2,5,6,3,7,0,4,1` e a tela intacta.
  */
 private parseTableStructure() {
 this.parseColumns();
 this.parseRows();
 if (this.sortKey) this.applySorting();
 else this.initializeSortedIndices();
 }

 private parseColumns() {
 // getLiveSlot e não getSlot: molécula que projeta não pode ler do snapshot, porque a origem
 // fica vazia depois da projeção e um re-snapshot leria vazio.
 const headerSlot = this.getLiveSlot('TableHeader');
 if (!headerSlot) {
 this.parsedColumns = [];
 return;
 }

 const headerRow = headerSlot.querySelector('TableRow');
 if (!headerRow) {
 this.parsedColumns = [];
 return;
 }

 const heads = Array.from(headerRow.querySelectorAll('TableHead'));
 this.parsedColumns = heads.map((head) => ({
 key: head.getAttribute('key') ||'',
 sortable: head.hasAttribute('sortable'),
 headEl: head,
 }));
 }

 private parseRows() {
 const bodySlot = this.getLiveSlot('TableBody');
 if (!bodySlot) {
 this.parsedRows = [];
 return;
 }

 const rows = Array.from(bodySlot.querySelectorAll('TableRow'));
 this.parsedRows = rows.map((row, index) => ({
 element: row,
 cellEls: Array.from(row.querySelectorAll('TableCell')),
 index,
 }));
 }

 private initializeSortedIndices() {
 this.sortedRowIndices = this.parsedRows.map((_, i) => i);
 }

 // ===========================================================================
 // EDITING PROPAGATION
 // ===========================================================================
 /**
  * Marca `is-editing` nos componentes que o consumidor pôs dentro das células.
  *
  * Precisa varrer DOIS lugares. Com slots vivos os filhos da célula são MOVIDOS para a âncora
  * dentro do `<td>` renderizado, então a origem (`<TableCell>`) fica vazia — varrer só ela, como
  * era antes, não marcaria ninguém. A origem continua na lista porque uma célula ainda não
  * projetada (linha fora da página corrente, por exemplo) guarda os filhos dela.
  */
 /**
  * A molécula só carimba `is-editing` quando o consumidor entregou o controle a ela.
  *
  * Antes ela carimbava SEMPRE — inclusive `is-editing="false"` em tudo, a cada render. Isso
  * atropelava silenciosamente qualquer consumidor que ligasse o modo de edição célula a célula:
  * o binding da página era desfeito no `updated()` da tabela, que roda depois. Medido em
  * 2026-08-04 com a página demotable--funcionariosedicao.
  */
 private ownsEditing(): boolean {
 // PRESENÇA do atributo, não conteúdo. `editing-rows=""` significa "nenhuma linha em edição",
 // e é aí que a molécula mais precisa agir: é o estado inicial da tela e o estado logo depois
 // de salvar ou cancelar. Exigir conteúdo não-vazio, como estava, deixava os campos abertos ao
 // entrar e a linha editada aberta depois de fechar.
 return (
 this.hasAttribute('is-editing') ||
 this.isEditing === true ||
 this.hasAttribute('editing-rows') ||
 this.rowsInEdit().size > 0
 );
 }

 private rowsInEdit(): Set<string> {
 return new Set(
 String(this.editingRows ||'')
 .split(',')
 .map((s) => s.trim())
 .filter(Boolean)
 );
 }

 /**
  * Marca `is-editing` e FORÇA o update do componente marcado.
  *
  * O `requestUpdate()` explícito não é zelo: sem ele a transição `"false"` → `"true"` não
  * re-renderiza. O conversor Boolean do Lit é `v => v !== null`, então qualquer atributo
  * presente — inclusive `is-editing="false"` — chega ao setter do `@propertyDataSource` como
  * `true` e fica guardado assim no interno `_is-editing`. O getter, por sua vez, lê o TEXTO do
  * atributo e devolve o valor real. Como a detecção de mudança do Lit compara o getter com o
  * `oldValue` tirado do interno, `false → true` fica invisível e a tela não muda.
  *
  * Medido em 2026-08-04 com a página demotable--funcionariosedicao: `attr="true" prop=true` e
  * nenhum `<input>` na linha. O defeito é do decorador (mls-102029/l2/collabDecorators.ts) e
  * está registrado para correção própria; aqui só se garante o efeito.
  */
 private marcar(raiz: Element, editando: boolean) {
 raiz.querySelectorAll('*').forEach((child) => {
 if (!child.tagName.includes('-')) return;
 child.setAttribute('is-editing', String(editando));
 (child as any).requestUpdate?.();
 });
 }

 private propagateEditingState() {
 if (!this.ownsEditing()) return;

 const chaves = this.rowsInEdit();
 const porLinha = chaves.size > 0;

 for (const row of this.parsedRows) {
 const chave = row.element.getAttribute('key') ||'';
 const editando = porLinha ? chaves.has(chave) : this.isEditing;

 // A origem, para célula ainda não projetada, e a linha já renderizada, onde vivem os nós
 // projetados. `data-row-key` no <tr> é o que liga uma coisa na outra.
 row.cellEls.forEach((cell) => this.marcar(cell, editando));
 const tr = this.querySelector(`tr[data-row-key="${CSS.escape(chave)}"]`);
 if (tr) this.marcar(tr, editando);
 }
 }

 // ===========================================================================
 // SELECTION
 // ===========================================================================
 private getSelectedIndices(): Set<number> {
 if (!this.value) return new Set();
 return new Set(
 this.value
 .split(',')
 .map((s) => parseInt(s.trim(), 10))
 .filter((n) => !isNaN(n))
 );
 }

 private setSelectedIndices(indices: Set<number>) {
 const sorted = Array.from(indices).sort((a, b) => a - b);
 this.value = sorted.join(',');
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 })
 );
 }

 private handleSelectAll(e: Event) {
 e.stopPropagation();
 if (this.disabled) return;
 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.every((row) => selected.has(row.index));

 if (allSelected) {
 this.setSelectedIndices(new Set());
 } else {
 this.setSelectedIndices(new Set(this.parsedRows.map((row) => row.index)));
 }
 }

 private handleRowSelect(index: number) {
 if (this.disabled) return;
 const selected = this.getSelectedIndices();

 if (selected.has(index)) {
 selected.delete(index);
 } else {
 selected.add(index);
 }

 this.setSelectedIndices(selected);
 }

 // ===========================================================================
 // SORTING
 // ===========================================================================
 private handleSort(key: string) {
 if (this.disabled) return;

 if (this.sortKey === key) {
 this.sortDirection = this.sortDirection ==='asc' ?'desc' :'asc';
 } else {
 this.sortKey = key;
 this.sortDirection ='asc';
 }

 // Não chama `applySorting()` aqui: mudar `sortKey`/`sortDirection` já agenda o update, e o
 // `willUpdate` reaplica a ordenação antes de desenhar. Chamar nos dois lugares ordenava duas
 // vezes por clique.

 this.dispatchEvent(
 new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 })
 );
 }

 private applySorting() {
 if (!this.sortKey) {
 this.initializeSortedIndices();
 return;
 }

 const columnIndex = this.parsedColumns.findIndex((col) => col.key === this.sortKey);
 if (columnIndex === -1) {
 this.initializeSortedIndices();
 return;
 }

 // getLiveText: a célula projetada está vazia (os filhos foram movidos para a âncora), e a
 // base sabe recuperar o texto corrente dos nós movidos. Ele ignora os comentários de
 // marcação do Lit — incluí-los fazia a chave de ordenação virar `?lit$...$70`.
 const rowsWithValues = this.parsedRows.map((row) => ({
 index: row.index,
 value: this.getLiveText(row.cellEls[columnIndex]),
 }));

 rowsWithValues.sort((a, b) => {
 const comparison = a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity:'base' });
 return this.sortDirection ==='asc' ? comparison : -comparison;
 });

 this.sortedRowIndices = rowsWithValues.map((r) => r.index);
 }

 // ===========================================================================
 // ROW CLICK
 // ===========================================================================
 private handleRowClick(index: number, event: Event) {
 const target = event.target as HTMLElement;
 if (target.tagName ==='INPUT' && (target as HTMLInputElement).type ==='checkbox') {
 return;
 }

 this.dispatchEvent(
 new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index },
 })
 );
 }

 // ===========================================================================
 // PAGINATION
 // ===========================================================================
 private get totalPages(): number {
 if (this.pageSize <= 0) return 1;
 return Math.ceil(this.totalItems / this.pageSize) || 1;
 }

 private handlePageChange(newPage: number) {
 if (this.disabled) return;
 if (newPage < 1 || newPage > this.totalPages) return;

 this.page = newPage;
 this.dispatchEvent(
 new CustomEvent('pageChange', {
 bubbles: true,
 composed: true,
 detail: { page: newPage },
 })
 );
 }

 // ===========================================================================
 // KEYBOARD NAVIGATION
 // ===========================================================================
 private handleKeyDown(event: KeyboardEvent) {
 if (this.disabled) return;

 const target = event.target as HTMLElement;
 const isInsideCell = target.closest('td') !== null;

 if (isInsideCell && (event.key ==='Tab' || event.key ==='Enter')) {
 return;
 }

 switch (event.key) {
 case'ArrowUp':
 event.preventDefault();
 this.moveFocus(-1);
 break;
 case'ArrowDown':
 event.preventDefault();
 this.moveFocus(1);
 break;
 case'':
 if (this.selectable && this.focusedRowIndex >= 0) {
 event.preventDefault();
 this.handleRowSelect(this.focusedRowIndex);
 }
 break;
 }
 }

 private handleHeaderKeyDown(event: KeyboardEvent, key: string, sortable: boolean) {
 if (event.key ==='Enter' && sortable) {
 event.preventDefault();
 this.handleSort(key);
 }
 }

 private moveFocus(direction: number) {
 const rowCount = this.sortedRowIndices.length;
 if (rowCount === 0) return;

 if (this.focusedRowIndex === -1) {
 this.focusedRowIndex = direction > 0 ? 0 : rowCount - 1;
 } else {
 const currentPosition = this.sortedRowIndices.indexOf(this.focusedRowIndex);
 const newPosition = Math.max(0, Math.min(rowCount - 1, currentPosition + direction));
 this.focusedRowIndex = this.sortedRowIndices[newPosition];
 }
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private getTableClasses(): string {
 return [
'w-full border-collapse',
'ml-surface-bg',
'ml-text',
 this.disabled ?'opacity-50 pointer-events-none' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getHeaderCellClasses(sortable: boolean): string {
 return [
'px-4 py-3 text-left text-sm font-semibold',
'ml-surface-dim-bg',
'ml-text',
'border-b ml-border',
 sortable ?'cursor-pointer select-none hover:ml-surface-dim-bg' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getRowClasses(index: number, isSelected: boolean): string {
 return [
'transition-colors',
 isSelected ?'ml-primary-dim-bg' :'ml-surface-bg',
 this.focusedRowIndex === index ?'ring-2 ring-inset ml-focus-ring' :'',
'hover:ml-surface-dim-bg',
'border-b ml-border',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getCellClasses(): string {
 return ['px-4 py-3 text-sm','ml-text'].join(' ');
 }

 private getCheckboxClasses(): string {
 return [
'w-4 h-4 rounded',
'ml-border',
'ml-primary-text',
'',
'ml-surface-bg',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER SECTIONS
 // ===========================================================================
 private renderCaption(): TemplateResult | typeof nothing {
 if (!this.hasSlot('Caption')) return nothing;
 return html`
 <caption class="${cn('px-4 py-3 text-left text-lg font-semibold ml-text ml-surface-bg', this.getSlotClass('Caption'))}">
 ${this.renderLiveSlot('Caption')}
 </caption>
 `;
 }

 private renderHeader(): TemplateResult {
 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.length > 0 && this.parsedRows.every((row) => selected.has(row.index));
 const someSelected = this.parsedRows.some((row) => selected.has(row.index));

 return html`
 <thead role="rowgroup">
 <tr role="row">
 ${this.selectable
 ? html`
 <th class="${this.getHeaderCellClasses(false)} w-12" role="columnheader">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${allSelected}
 .indeterminate=${someSelected && !allSelected}
 @change=${this.handleSelectAll}
 aria-label=${this.msg.selectAll}
 ?disabled=${this.disabled}
 
 @input="${(e: Event) => e.stopPropagation()}"
/>
 </th>
 `
 : nothing}
 ${this.parsedColumns.map((col) => this.renderHeaderCell(col))}
 </tr>
 </thead>
 `;
 }

 private renderHeaderCell(col: ParsedColumn): TemplateResult {
 const isSorted = this.sortKey === col.key;
 const ariaSort = isSorted ? (this.sortDirection ==='asc' ?'ascending' :'descending') : undefined;

 return html`
 <th
 class="${this.getHeaderCellClasses(col.sortable)}"
 role="columnheader"
 aria-sort=${ariaSort || nothing}
 tabindex=${col.sortable ?'0' : nothing}
 @click=${col.sortable ? () => this.handleSort(col.key) : nothing}
 @keydown=${col.sortable ? (e: KeyboardEvent) => this.handleHeaderKeyDown(e, col.key, col.sortable) : nothing}
 >
 <span class="flex items-center gap-2">
 ${this.renderLiveSlotFrom(col.headEl)}
 ${col.sortable ? this.renderSortIcon(isSorted) : nothing}
 </span>
 </th>
 `;
 }

 private renderSortIcon(isSorted: boolean): TemplateResult {
 if (!isSorted) {
 return html`
 <span class="ml-text-faint">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>`}
 </svg>
 </span>
 `;
 }

 return html`
 <span class="ml-primary-text">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${this.sortDirection ==='asc'
 ? svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>`
 : svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>`}
 </svg>
 </span>
 `;
 }

 private renderBody(): TemplateResult {
 if (this.parsedRows.length === 0) {
 return this.renderEmpty();
 }

 const selected = this.getSelectedIndices();

 return html`
 <tbody role="rowgroup">
 ${this.sortedRowIndices.map((rowIndex) => {
 const row = this.parsedRows.find((r) => r.index === rowIndex);
 if (!row) return nothing;
 return this.renderRow(row, selected.has(rowIndex));
 })}
 </tbody>
 `;
 }

 private renderRow(row: ParsedRow, isSelected: boolean): TemplateResult {
 return html`
 <tr
 class="${this.getRowClasses(row.index, isSelected)}"
 role="row"
 data-row-key=${row.element.getAttribute('key') ||''}
 tabindex="0"
 @click=${(e: Event) => this.handleRowClick(row.index, e)}
 @focus=${() => (this.focusedRowIndex = row.index)}
 >
 ${this.selectable
 ? html`
 <td class="${this.getCellClasses()} w-12" role="cell">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${isSelected}
 @change=${(e: Event) => { e.stopPropagation(); this.handleRowSelect(row.index); }}
 aria-label="${this.msg.selectRow} ${row.index + 1}"
 ?disabled=${this.disabled}
 
 @input="${(e: Event) => e.stopPropagation()}"
/>
 </td>
 `
 : nothing}
 ${row.cellEls.map((cell) => this.renderCell(cell))}
 </tr>
 `;
 }

 private renderCell(cell: Element): TemplateResult {
 return html` <td class="${this.getCellClasses()}" role="cell">${this.renderLiveSlotFrom(cell)}</td> `;
 }

 private renderEmpty(): TemplateResult {
 const colSpan = this.parsedColumns.length + (this.selectable ? 1 : 0);
 const content = this.hasSlot('Empty') ? this.renderLiveSlot('Empty') : html`${this.msg.empty}`;

 return html`
 <tbody role="rowgroup">
 <tr role="row">
 <td colspan="${colSpan}" class="px-4 py-12 text-center ml-text-muted" role="cell">
 ${content}
 </td>
 </tr>
 </tbody>
 `;
 }

 private renderLoading(): TemplateResult {
 const colSpan = this.parsedColumns.length + (this.selectable ? 1 : 0);

 if (this.hasSlot('Loading')) {
 return html`
 <tbody role="rowgroup">
 <tr role="row">
 <td colspan="${colSpan}" class="px-4 py-8" role="cell">${this.renderLiveSlot('Loading')}</td>
 </tr>
 </tbody>
 `;
 }

 return html`
 <tbody role="rowgroup">
 ${[1, 2, 3].map(
 () => html`
 <tr role="row" class="border-b ml-border">
 ${this.selectable
 ? html`
 <td class="px-4 py-3 w-12" role="cell">
 <div class="w-4 h-4 ml-surface-dim-bg rounded animate-pulse"></div>
 </td>
 `
 : nothing}
 ${this.parsedColumns.map(
 () => html`
 <td class="px-4 py-3" role="cell">
 <div class="h-4 ml-surface-dim-bg rounded animate-pulse"></div>
 </td>
 `
 )}
 </tr>
 `
 )}
 </tbody>
 `;
 }

 private renderFooter(): TemplateResult | typeof nothing {
 if (!this.hasSlot('TableFooter')) return nothing;

 const footerSlot = this.getSlot('TableFooter');
 if (!footerSlot) return nothing;

 const footerRows = Array.from(footerSlot.querySelectorAll('TableRow'));

 return html`
 <tfoot role="rowgroup" class="${cn('ml-surface-dim-bg', this.getSlotClass('TableFooter'))}">
 ${footerRows.map((row) => {
 const cells = Array.from(row.querySelectorAll('TableCell'));
 return html`
 <tr role="row" class="border-t ml-border">
 ${this.selectable ? html`<td class="px-4 py-3" role="cell"></td>` : nothing}
 ${cells.map((cell) => html` <td class="${this.getCellClasses()}" role="cell">${this.renderLiveSlotFrom(cell)}</td> `)}
 </tr>
 `;
 })}
 </tfoot>
 `;
 }

 private renderPagination(): TemplateResult | typeof nothing {
 if (this.pageSize <= 0) return nothing;

 const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
 const showEllipsis = this.totalPages > 7;

 return html`
 <nav
 class="flex items-center justify-between px-4 py-3 ml-surface-bg border-t ml-border"
 role="navigation"
 aria-label=${this.msg.pagination}
 >
 <button
 class="${this.getPaginationButtonClasses(this.page === 1)}"
 @click=${() => this.handlePageChange(this.page - 1)}
 ?disabled=${this.page === 1 || this.disabled}
 aria-label=${this.msg.previous}
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>`}
 </svg>
 <span class="sr-only">${this.msg.previous}</span>
 </button>

 <div class="flex items-center gap-1">
 ${showEllipsis ? this.renderPaginationWithEllipsis() : pages.map((p) => this.renderPageButton(p))}
 </div>

 <button
 class="${this.getPaginationButtonClasses(this.page === this.totalPages)}"
 @click=${() => this.handlePageChange(this.page + 1)}
 ?disabled=${this.page === this.totalPages || this.disabled}
 aria-label=${this.msg.next}
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>`}
 </svg>
 <span class="sr-only">${this.msg.next}</span>
 </button>
 </nav>
 `;
 }

 private renderPaginationWithEllipsis(): TemplateResult {
 const pages: (number | string)[] = [];
 const current = this.page;
 const total = this.totalPages;

 pages.push(1);

 if (current > 3) {
 pages.push('...');
 }

 for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
 pages.push(i);
 }

 if (current < total - 2) {
 pages.push('...');
 }

 if (total > 1) {
 pages.push(total);
 }

 return html`
 ${pages.map((p) =>
 typeof p ==='string'
 ? html`<span class="px-2 ml-text-faint">...</span>`
 : this.renderPageButton(p)
 )}
 `;
 }

 private renderPageButton(pageNum: number): TemplateResult {
 const isActive = pageNum === this.page;
 const classes = [
'min-w-[2rem] h-8 px-2 text-sm font-medium rounded transition-colors',
 isActive
 ?'ml-primary-bg text-white'
 :'ml-text hover:ml-surface-dim-bg',
 this.disabled ?'ml-disabled' :'cursor-pointer',
 ].join(' ');

 return html`
 <button
 class="${classes}"
 @click=${() => this.handlePageChange(pageNum)}
 ?disabled=${this.disabled}
 aria-label="${this.msg.page} ${pageNum}"
 aria-current=${isActive ?'page' : nothing}
 >
 ${pageNum}
 </button>
 `;
 }

 private getPaginationButtonClasses(isDisabled: boolean): string {
 return [
'p-2 rounded transition-colors',
'ml-text-muted',
 isDisabled
 ?'ml-disabled'
 :'hover:ml-surface-dim-bg cursor-pointer',
 ].join(' ');
 }

 private renderError(): TemplateResult | typeof nothing {
 if (!this.error) return nothing;

 return html`
 <div class="px-4 py-3 text-sm ml-error-text ml-error-dim-bg border-t ml-border-error">
 ${this.error}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 /**
  * A leitura da estrutura sai daqui e vai para o `willUpdate`, que é o lugar do Lit para derivar
  * estado antes do render: escrever propriedade reativa dentro do `render()` agenda outro ciclo,
  * e `parsedRows`/`sortedRowIndices` são reativas.
  */
 willUpdate() {
 this.parseTableStructure();
 }

 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 return html`
 <div
 class="${cn('overflow-hidden rounded-lg border ml-border ml-surface-bg', this.cssClass)}"
 @keydown=${this.handleKeyDown}
 >
 <div class="overflow-x-auto">
 <table class="${this.getTableClasses()}" role="table">
 ${this.renderCaption()} ${this.renderHeader()} ${this.loading ? this.renderLoading() : this.renderBody()}
 ${this.renderFooter()}
 </table>
 </div>
 ${this.renderPagination()} ${this.renderError()}
 </div>
 `;
 }
}
