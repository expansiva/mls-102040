/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-record-form-table.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cellSortKey, compareSortKeys } from '/_102033_/l2/shared/molecules/tableSort.js';
import { cn } from '/_102033_/l2/shared/molecules/cn.js';

// =============================================================================
// RECORD FORM TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule owns presentation and interaction mode, never record values.

@customElement('groupviewtable--ml-record-form-table')
export class GroupViewTableMlRecordFormTableMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Caption', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableFooter', 'Empty', 'Loading', 'Detail', 'RowActions', 'RowAction', 'NewRecordRow'];
  protected usesLiveSlots = true;

  // ===========================================================================
  // PROPERTIES
  // ===========================================================================
  @propertyDataSource({ type: Boolean }) selectable = false;
  @propertyDataSource({ type: Boolean }) isEditing = false;
  @propertyDataSource({ type: String, attribute: 'editing-rows' }) editingRows?: string;
  @propertyDataSource({ type: Number }) page = 1;
  @propertyDataSource({ type: Number, attribute: 'page-size' }) pageSize = 0;
  @propertyDataSource({ type: Number, attribute: 'total-items' }) totalItems = 0;
  @propertyDataSource({ type: String }) value = '';
  @propertyDataSource({ type: String }) error = '';
  @propertyDataSource({ type: Boolean }) disabled = false;
  @propertyDataSource({ type: Boolean }) loading = false;
  @propertyDataSource({ type: Boolean, attribute: 'fit-height' }) fitHeight = false;

  @state() private sortKey: string | null = null;
  @state() private sortDirection = 'asc';
  @state() private openKey: string | null = null;
  @state() private privateEditingKey: string | null = null;
  @state() private draftOpen = false;

  // ===========================================================================
  // STRUCTURE READERS
  // ===========================================================================
  private directRows(tag: string): Element[] {
    const slot = this.getLiveSlot(tag);
    return slot ? Array.from(slot.querySelectorAll(':scope > TableRow')) : [];
  }

  private bodyRows(): Element[] { return this.directRows('TableBody'); }
  private rowKey(row: Element, index: number): string { return row.getAttribute('key') || String(index); }
  private rowCells(row: Element): Element[] { return Array.from(row.querySelectorAll(':scope > TableCell')); }
  private rowDetail(row: Element): Element | null { return row.querySelector(':scope > Detail'); }
  private rowActions(row: Element): Element[] {
    const group = row.querySelector(':scope > RowActions');
    return group ? Array.from(group.querySelectorAll(':scope > RowAction')) : [];
  }
  private actionName(action: Element): string { return action.getAttribute('action') || ''; }
  private actionWhen(action: Element): string { return action.getAttribute('when') || ''; }
  private hasRowActions(): boolean {
    return this.bodyRows().some(r => this.rowActions(r).length > 0) || !!this.newRow()?.querySelector(':scope > RowActions');
  }
  private newRow(): Element | null { return this.getLiveSlot('NewRecordRow'); }
  private ownsEditingMode(): boolean {
    return this.hasAttribute('is-editing') || this.hasAttribute('editing-rows') || !!this.privateEditingKey || this.hasRowActions() || this.draftOpen;
  }
  private isRowEditing(key: string): boolean {
    if (this.draftOpen && key === this.newRow()?.getAttribute('key')) return true;
    if (this.hasAttribute('editing-rows')) return String(this.editingRows ?? '').split(',').map(v => v.trim()).includes(key);
    if (this.isEditing) return true;
    return this.privateEditingKey === key;
  }
  private selected(): Set<number> {
    return new Set(String(this.value ?? '').split(',').filter(v => /^\d+$/.test(v)).map(Number));
  }
  private externalMode(): boolean { return Number(this.totalItems) > this.bodyRows().length; }

  // ===========================================================================
  // EVENTS AND MODE TRANSITIONS
  // ===========================================================================
  private emit(name: string, detail: Record<string, unknown> = {}): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }
  private rowIdentity(row: Element, index: number): string { return this.rowKey(row, index); }
  private handleSort(head: Element): void {
    if (this.disabled || !head.hasAttribute('sortable')) return;
    const key = head.getAttribute('key') || '';
    this.sortDirection = this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;
    this.emit('sort', { key, direction: this.sortDirection });
  }
  private handlePage(next: number): void {
    if (this.disabled) return;
    const total = this.totalPages();
    if (next < 1 || next > total || next === Number(this.page)) return;
    this.emit('pageChange', { page: next });
  }
  private handleSelection(index: number, checked: boolean): void {
    if (this.disabled || !this.selectable) return;
    const set = this.selected();
    checked ? set.add(index) : set.delete(index);
    const value = Array.from(set).sort((a, b) => a - b).join(',');
    this.value = value;
    this.emit('change', { value });
  }
  private handleSelectAll(checked: boolean): void {
    if (this.disabled || !this.selectable) return;
    const rows = this.bodyRows();
    const set = this.selected();
    rows.forEach((_, i) => checked ? set.add(i) : set.delete(i));
    const value = Array.from(set).sort((a, b) => a - b).join(',');
    this.value = value;
    this.emit('change', { value });
  }
  private handleRowClick(e: Event, index: number): void {
    if (this.disabled) return;
    const target = e.target as Element;
    if (target.closest('[data-ml-selection], [data-ml-action]')) return;
    this.emit('rowClick', { index });
  }
  private handleRowKey(e: KeyboardEvent, index: number): void {
    if (e.key === 'Enter') this.handleRowClick(e, index);
    if (e.key === ' ' && this.selectable) { e.preventDefault(); this.handleSelection(index, !this.selected().has(index)); }
  }
  private handleAction(e: Event, action: Element, key: string, isNew = false): void {
    e.stopPropagation();
    if (this.disabled) return;
    const name = this.actionName(action);
    const editing = isNew || this.isRowEditing(key);
    if (name === 'new') {
      if (this.draftOpen) return;
      this.draftOpen = !!this.newRow();
      this.emit('newRecord');
    } else if (name === 'open' && !editing) {
    this.emit('rowAction', { key, action: name });
    if (this.bodyRows().some((r, i) => this.rowIdentity(r, i) === key && this.rowDetail(r))) {
    this.privateEditingKey = null;
    this.openKey = key;
    this.propagateEditing();
    }
    } else if (name === 'edit' && !editing) {
      this.emit('edit', { key });
      if (!this.hasAttribute('editing-rows')) this.privateEditingKey = key;
    } else if ((name === 'save' || name === 'cancel') && editing) {
      this.emit(name, isNew ? { key, isNew: true } : { key });
      if (isNew) this.draftOpen = false;
      else if (!this.hasAttribute('editing-rows')) this.privateEditingKey = null;
    } else if (name === 'delete' && !editing) {
      this.emit('delete', { key });
    } else if (!['edit', 'save', 'cancel', 'delete', 'new', 'open'].includes(name)) {
      this.emit('rowAction', { key, action: name });
    }
  }
  private handleBack(): void { if (!this.disabled) this.openKey = null; }

  // ===========================================================================
  // PAGINATION AND ORDERING
  // ===========================================================================
  private totalPages(): number {
    const count = this.externalMode() ? Number(this.totalItems) : this.bodyRows().length;
    return Math.max(1, this.pageSize > 0 ? Math.ceil(count / this.pageSize) : 1);
  }
  private displayRows(): Array<{ row: Element; index: number }> {
    const rows = this.bodyRows().map((row, index) => ({ row, index }));
    if (!this.externalMode() && this.sortKey) {
      const heads = this.headerCells();
      const col = heads.findIndex(h => h.getAttribute('key') === this.sortKey);
      if (col >= 0) rows.sort((a, b) => compareSortKeys(cellSortKey(this.rowCells(a.row)[col], this.getLiveText(this.rowCells(a.row)[col])), cellSortKey(this.rowCells(b.row)[col], this.getLiveText(this.rowCells(b.row)[col]))) * (this.sortDirection === 'asc' ? 1 : -1));
    }
    return !this.externalMode() && this.pageSize > 0 ? rows.slice((Math.max(1, Number(this.page)) - 1) * this.pageSize, Number(this.page) * this.pageSize) : rows;
  }
  private headerCells(): Element[] {
    const header = this.getLiveSlot('TableHeader');
    return header ? Array.from(header.querySelectorAll(':scope > TableRow > TableHead')) : [];
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderAction(action: Element, key: string, isNew: boolean, index: number): TemplateResult {
    const name = this.actionName(action);
    const editing = isNew || this.isRowEditing(key);
    const explicit = this.actionWhen(action);
    const inDetail = this.openKey === key;
    const available = explicit === 'always' || (explicit === 'edit' ? editing : explicit === 'view' ? !editing : name === 'edit' ? inDetail && !editing : name === 'delete' || name === 'open' ? !inDetail && !editing : name === 'save' || name === 'cancel' ? editing : true);
    const actionClasses = ['inline-flex items-center gap-2 px-2 py-1 text-sm transition', 'ml-row-action', available ? '' : 'ml-action-hidden', this.disabled ? 'ml-disabled' : ''].filter(Boolean).join(' ');
    return html`<span data-ml-action data-action-index="${index}" role="button" tabindex="${available && !this.disabled ? 0 : -1}" aria-hidden="${available ? 'false' : 'true'}" class="${actionClasses}" @click=${(e: Event) => this.handleAction(e, action, key, isNew)} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.handleAction(e, action, key, isNew); } }}>${this.renderLiveSlotFrom(action)}</span>`;
  }
  private renderCells(row: Element, index: number, isNew = false): TemplateResult[] {
    return this.rowCells(row).map(cell => html`<td role="cell" class="p-3 ml-table-cell">${this.renderLiveSlotFrom(cell)}</td>`);
  }
  private renderTableRow(row: Element, index: number, isNew = false): TemplateResult {
    const key = isNew ? (row.getAttribute('key') || 'new') : this.rowIdentity(row, index);
    const actions = this.rowActions(row);
    const editing = isNew || this.isRowEditing(key);
    return html`<tr data-row-index="${index}" data-row-key="${key}" role="row" tabindex="0" class="${['ml-table-row', editing ? 'ml-row-editing' : '', isNew ? 'ml-draft-row' : '', this.selected().has(index) ? 'ml-row-selected' : ''].filter(Boolean).join(' ')}" @click=${(e: Event) => this.handleRowClick(e, index)} @keydown=${(e: KeyboardEvent) => this.handleRowKey(e, index)}>${this.selectable && !isNew ? html`<td role="cell" data-ml-selection class="p-3"><input type="checkbox" aria-label="Select row ${index + 1}" .checked=${this.selected().has(index)} ?disabled=${this.disabled} @change=${(e: Event) => { e.stopPropagation(); this.handleSelection(index, (e.target as HTMLInputElement).checked); }} @input=${(e: Event) => e.stopPropagation()} /></td>` : nothing}${this.renderCells(row, index, isNew)}${actions.length ? html`<td role="cell" class="p-3 ml-actions-column"><div class="inline-flex flex-wrap items-center gap-2">${actions.map((a, i) => this.renderAction(a, key, isNew, i))}</div></td>` : nothing}</tr>`;
  }
  private renderList(): TemplateResult {
    const rows = this.displayRows();
    const heads = this.headerCells();
    const selected = this.selected();
    const all = rows.length > 0 && rows.every(r => selected.has(r.index));
    const footer = this.getLiveSlot('TableFooter');
    const newAction = footer ? Array.from(footer.querySelectorAll(':scope > RowAction')).find(a => this.actionName(a) === 'new') : undefined;
    return html`<div class="${cn('flex w-full flex-col gap-3', this.fitHeight ? 'h-full' : '', this.disabled ? 'ml-disabled' : '', this.cssClass)}" aria-busy=${this.loading ? 'true' : 'false'}>${this.hasSlot('Caption') ? html`<div class="text-lg font-semibold ml-label">${this.renderLiveSlot('Caption')}</div>` : nothing}${this.error ? html`<div role="alert" class="ml-error-text">${this.error}</div>` : nothing}${this.loading ? html`<div class="p-4 ml-skeleton" role="status">${this.hasSlot('Loading') ? this.renderLiveSlot('Loading') : 'Loading…'}</div>` : rows.length === 0 ? html`<div class="p-4 ml-text-muted" role="status">${this.hasSlot('Empty') ? this.renderLiveSlot('Empty') : 'No records found'}</div>` : html`<div class="w-full overflow-auto ${this.fitHeight ? 'h-full' : ''}"><table role="table" class="w-full ml-surface-bg ml-border"><caption class="sr-only">Record table</caption><thead role="rowgroup"><tr role="row">${this.selectable ? html`<th role="columnheader" class="p-3"><input type="checkbox" aria-label="Select all rows" .checked=${all} ?disabled=${this.disabled} @change=${(e: Event) => { e.stopPropagation(); this.handleSelectAll((e.target as HTMLInputElement).checked); }} @input=${(e: Event) => e.stopPropagation()} /></th>` : nothing}${heads.map((h, i) => { const active = this.sortKey === h.getAttribute('key'); return html`<th role="columnheader" tabindex="${h.hasAttribute('sortable') && !this.disabled ? 0 : -1}" aria-sort=${h.hasAttribute('sortable') ? active ? this.sortDirection === 'asc' ? 'ascending' : 'descending' : 'none' : nothing} class="p-3 text-left ml-table-head" @click=${() => this.handleSort(h)} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.handleSort(h); } }}>${this.renderLiveSlotFrom(h)}${active ? html`<span aria-hidden="true" class="ml-sort-indicator">${this.sortDirection === 'asc' ? '↑' : '↓'}</span>` : nothing}</th>`; })}${this.hasRowActions() ? html`<th role="columnheader" class="p-3 ml-actions-column">Actions</th>` : nothing}</tr></thead><tbody role="rowgroup">${rows.map(r => this.renderTableRow(r.row, r.index))}${this.draftOpen && this.newRow() ? this.renderTableRow(this.newRow()!, -1, true) : nothing}</tbody></table></div>`}${footer ? html`<div class="flex items-center justify-between gap-3 p-2 ml-table-footer"><div>${newAction ? this.renderAction(newAction, 'new', false, 0) : nothing}</div><nav role="navigation" aria-label="Table pagination" class="inline-flex items-center gap-2"><button class="ml-pagination-button" ?disabled=${this.disabled || Number(this.page) <= 1} @click=${() => this.handlePage(Number(this.page) - 1)}>Previous</button><span class="ml-text-muted" aria-live="polite">Page ${Number(this.page)} of ${this.totalPages()}</span><button class="ml-pagination-button" ?disabled=${this.disabled || Number(this.page) >= this.totalPages()} @click=${() => this.handlePage(Number(this.page) + 1)}>Next</button></nav></div>` : nothing}</div>`;
  }
  private renderDetail(): TemplateResult {
    const rows = this.bodyRows();
    const index = rows.findIndex((r, i) => this.rowIdentity(r, i) === this.openKey);
    const row = index >= 0 ? rows[index] : null;
    const detail = row ? this.rowDetail(row) : null;
    if (!row || !detail) return this.renderList();
    const key = this.rowIdentity(row, index);
    const actions = this.rowActions(row);
    return html`<section data-row-key="${key}" class="${cn('flex w-full flex-col gap-4 p-4 ml-record-detail', this.isRowEditing(key) ? 'ml-detail-editing' : 'ml-detail-viewing', this.cssClass)}" aria-label=${detail.getAttribute('label') || 'Record details'}><div class="flex items-center justify-between gap-3"><button class="inline-flex items-center gap-2 px-3 py-2 transition ml-back-button" @click=${this.handleBack} ?disabled=${this.disabled}>Back to records</button><div class="inline-flex flex-wrap items-center gap-2">${actions.map((a, i) => this.renderAction(a, key, false, i))}</div></div><div class="w-full ml-detail-content">${this.renderLiveSlotFrom(detail)}</div></section>`;
  }

  // ===========================================================================
  // PROPAGATION AND RENDER
  // ===========================================================================
  /**
   * Escreve `is-editing` só quando o valor MUDA.
   *
   * O guard não é otimização — é o que impede um laço infinito. O MutationObserver da base observa
   * `attributes: true` em toda a subárvore e agenda re-render quando o alvo está DENTRO de uma slot
   * tag (moleculeBase, `_isInsideSlotTag`). Um `setAttribute` gera registro de mutação mesmo
   * escrevendo o mesmo valor, então marcar em todo ciclo alimenta o observer que causa o ciclo
   * seguinte. Só aparece quando há componente dentro de slot tag NÃO projetada — o `<Detail>` das
   * linhas fechadas é exatamente esse caso; as células, por serem projetadas, saem da slot tag.
   */
  private marcar(el: Element, editing: boolean): void {
    const valor = String(editing);
    if (el.getAttribute('is-editing') === valor) return;
    el.setAttribute('is-editing', valor);
    // O `requestUpdate` NÃO é redundante — sem ele o consumidor não redesenha ao trocar de modo.
    // O conversor Boolean do Lit é `v => v !== null`, então "false" e "true" chegam ao setter como
    // o MESMO `true`: `requestUpdate(prop, oldValue)` vê true→true e cancela o render. Quem sabe
    // distinguir as duas strings é o getter do propertyDataSource, e ele só é consultado se houver
    // render. Medido em 01/09: com is-editing="true" nos 5 campos da ficha, todos seguiam em leitura.
    (el as unknown as { requestUpdate?: () => void }).requestUpdate?.();
  }
  private propagateEditing(): void {
  this.querySelectorAll<HTMLElement>('TableCell, Detail, [data-row-key]').forEach(el => {
  const renderedRow = el.closest('[data-row-key]');
  const sourceRow = el.closest('TableRow');
  const sourceIndex = sourceRow ? this.bodyRows().indexOf(sourceRow) : -1;
  const key = renderedRow?.getAttribute('data-row-key') || (sourceRow && sourceIndex >= 0 ? this.rowIdentity(sourceRow, sourceIndex) : '');
  if (!key) return;
  const editing = key === (this.newRow()?.getAttribute('key') || '') && this.draftOpen || this.isRowEditing(key);
  // `setAttribute(..., 'false')`, NUNCA `toggleAttribute`: nesta plataforma atributo AUSENTE não
  // significa falso. O getter do propertyDataSource devolve `_isEditing` quando o atributo não está
  // lá, e o inicializador de campo do consumidor já gravou o padrão dele — no ml-enter-text esse
  // padrão é `true`. Remover o atributo entrega o campo ao padrão dele, que é edição.
  if (el.tagName.includes('-')) this.marcar(el, editing);
  el.querySelectorAll<HTMLElement>('*').forEach(child => { if (child.tagName.includes('-')) this.marcar(child, editing); });
  });
  }
  updated(): void { this.propagateEditing(); }

  render(): TemplateResult {
    return this.openKey ? this.renderDetail() : this.renderList();
  }
}