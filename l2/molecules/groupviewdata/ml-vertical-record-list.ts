/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-vertical-record-list.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// VERTICAL RECORD LIST MOLECULE
// =============================================================================
// Skill Group: groupViewData
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/shared/molecules/cn.js';

/// **collab_i18n_start**
const message_en = {
loading:'Loading...',
empty:'No records to display',
missingColumns:'Missing required slot <Columns>',
missingRows:'Missing required slot <Rows>',
missingColumnItem:'At least 1 <Column> is required inside <Columns>',
missingColumnField:'<Column> requires attribute"field"',
missingColumnHeader:'<Column> requires attribute"header"',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading:'Carregando...',
empty:'Nenhum registro para exibir',
missingColumns:'Slot obrigatório ausente: <Columns>',
missingRows:'Slot obrigatório ausente: <Rows>',
missingColumnItem:'É necessário pelo menos 1 <Column> dentro de <Columns>',
missingColumnField:'<Column> requer o atributo"field"',
missingColumnHeader:'<Column> requer o atributo"header"',
},
};
/// **collab_i18n_end**

type ColumnDef = {
field: string;
header: string;
width?: string;
align:'left' |'center' |'right';
hidden: boolean;
};

@customElement('groupviewdata--ml-vertical-record-list')
export class MlVerticalRecordListMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Columns','Column','Rows','Row','Cell','Empty','Loading'];

// This molecule TRANSFORMS its slots: it reads Rows > Row > Cell and re-emits each Row as a
// list item. Re-emitting cell content through innerHTML + unsafeHTML killed handlers and
// bindings, so a button inside a row was dead HTML. With live slots the content is MOVED into
// the row. Structure is therefore read from the LIVE DOM (getLiveSlot): a projected cell is
// empty, and a re-snapshot would read it as empty.
protected usesLiveSlots = true;

// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean })
loading = false;

@propertyDataSource({ type: Boolean })
selectable = false;

@propertyDataSource({ type: Boolean })
hoverable = true;

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private selectedIndices: Set<number> = new Set();

@state()
private selectionInitialized = false;

@state()
private lastRowCount = 0;

// ===========================================================================
// LIFECYCLE
// ===========================================================================
updated() {
const rows = this.getLiveRows();
if (!this.selectionInitialized && rows.length > 0) {
this.initializeSelection(rows);
}
if (this.lastRowCount !== rows.length) {
this.lastRowCount = rows.length;
this.pruneSelection(rows.length);
}
}

// ===========================================================================
// SELECTION
// ===========================================================================
private initializeSelection(rows: Element[]) {
const next = new Set<number>();
rows.forEach((row, index) => {
if (this.parseBooleanAttr(row,'selected')) {
next.add(index);
}
});
this.selectedIndices = next;
this.selectionInitialized = true;
}

private pruneSelection(rowCount: number) {
if (this.selectedIndices.size === 0) return;
const next = new Set<number>();
this.selectedIndices.forEach((index) => {
if (index >= 0 && index < rowCount) {
next.add(index);
}
});
this.selectedIndices = next;
}

private emitSelectionChange() {
const selected = Array.from(this.selectedIndices).sort((a, b) => a - b);
this.dispatchEvent(new CustomEvent('selection-change', {
bubbles: true,
composed: true,
detail: { selected },
}));
}

// Projected cell content can be interactive (buttons, links, inputs). Their clicks bubble to
// the row, and must not also toggle selection or fire row-click.
private isFromInteractiveContent(e: Event): boolean {
const rowEl = e.currentTarget as Element;
const target = e.target as Element | null;
const interactive = target?.closest?.('button, a[href], input, select, textarea, label, [role="button"], [contenteditable="true"]');
return !!interactive && interactive !== rowEl && rowEl.contains(interactive);
}

private handleRowClick(e: MouseEvent, index: number, rowEl: Element, isDisabled: boolean) {
if (isDisabled || this.isFromInteractiveContent(e)) return;
this.dispatchEvent(new CustomEvent('row-click', {
bubbles: true,
composed: true,
detail: { index, data: rowEl },
}));
if (!this.selectable) return;
const next = new Set(this.selectedIndices);
if (next.has(index)) {
next.delete(index);
} else {
next.add(index);
}
this.selectedIndices = next;
this.emitSelectionChange();
}

// ===========================================================================
// PARSING
// ===========================================================================
// Structure comes from the LIVE DOM: always current, and it survives projection — moving a
// cell's children removes neither the row nor the cell.
private getLiveRows(): Element[] {
const rowsEl = this.getLiveSlot('Rows');
return rowsEl ? Array.from(rowsEl.querySelectorAll('Row')) : [];
}

private parseColumns(): ColumnDef[] {
const columnsEl = this.getLiveSlot('Columns');
const columnEls = columnsEl ? Array.from(columnsEl.querySelectorAll('Column')) : [];
return columnEls.map((col) => {
const alignAttr = (col.getAttribute('align') ||'left') as'left' |'center' |'right';
const align = ['left','center','right'].includes(alignAttr) ? alignAttr :'left';
return {
field: col.getAttribute('field') ||'',
header: col.getAttribute('header') ||'',
width: col.getAttribute('width') || undefined,
align,
hidden: this.parseBooleanAttr(col,'hidden'),
};
});
}

private parseBooleanAttr(el: Element, attr: string): boolean {
if (!el.hasAttribute(attr)) return false;
const value = el.getAttribute(attr);
if (value === null) return true;
return value !=='false';
}

// ===========================================================================
// VALIDATION
// ===========================================================================
private getValidationErrors(columnsEl: Element | null, rowsEl: Element | null, columns: ColumnDef[]): string[] {
const errors: string[] = [];
if (!columnsEl) errors.push(this.msg.missingColumns);
if (!rowsEl) errors.push(this.msg.missingRows);
if (columnsEl && columns.length === 0) errors.push(this.msg.missingColumnItem);
columns.forEach((col) => {
if (!col.field) errors.push(this.msg.missingColumnField);
if (!col.header) errors.push(this.msg.missingColumnHeader);
});
return errors;
}

private renderValidation(errors: string[]): TemplateResult {
if (errors.length === 0) return html``;
return html`
<div class="mb-3 rounded-lg border ml-border-error ml-error-dim-bg p-3 text-sm ml-error-text">
${errors.map((err) => html`<div>${err}</div>`)}
</div>
`;
}

// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLoading(): TemplateResult {
if (this.hasSlot('Loading')) {
return html`
<div class="w-full py-8">
${this.renderLiveSlot('Loading')}
</div>
`;
}
return html`
<div class="w-full py-8 text-center text-sm ml-text-muted">
${this.msg.loading}
</div>
`;
}

private renderEmpty(): TemplateResult {
if (this.hasSlot('Empty')) {
return html`
<div class="w-full py-10 flex items-center justify-center">
${this.renderLiveSlot('Empty')}
</div>
`;
}
return html`
<div class="w-full py-10 text-center text-sm ml-text-muted">
${this.msg.empty}
</div>
`;
}

private renderRows(rows: Element[], columns: ColumnDef[]): TemplateResult {
return html`
<div role="list" class="w-full">
${rows.map((row, index) => this.renderRow(row, index, columns, index === rows.length - 1))}
</div>
`;
}

private renderRow(row: Element, index: number, columns: ColumnDef[], isLast: boolean): TemplateResult {
const isDisabled = this.parseBooleanAttr(row,'disabled');
const isSelected = this.selectedIndices.has(index);
const classes = this.getRowClasses(isSelected, isDisabled, isLast);
const cells = Array.from(row.querySelectorAll('Cell')) as Element[];
return html`
<div
role="listitem"
class="${classes}"
aria-selected="${isSelected ?'true' :'false'}"
aria-disabled="${isDisabled ?'true' :'false'}"
@click=${(e: MouseEvent) => this.handleRowClick(e, index, row, isDisabled)}
>
${this.renderCells(cells, columns)}
</div>
`;
}

private renderCells(cells: Element[], columns: ColumnDef[]): TemplateResult {
return html`
<div class="flex w-full items-start gap-4">
${cells.map((cell, index) => {
const col = columns[index];
const colspan = parseInt(cell.getAttribute('colspan') ||'1', 10);
const style = this.getCellStyle(col, colspan);
const classes = this.getCellClasses(col, colspan);
return html`
<div class="${classes}" style="${style}">
${this.renderLiveSlotFrom(cell)}
</div>
`;
})}
</div>
`;
}

private getCellClasses(col: ColumnDef | undefined, colspan: number): string {
const align = col?.align ||'left';
return [
'flex min-w-0',
col?.hidden ?'hidden' :'',
colspan > 1 ?'' :'flex-1',
align ==='center' ?'text-center' : align ==='right' ?'text-right' :'text-left',
'ml-text',
].filter(Boolean).join(' ');
}

private getCellStyle(col: ColumnDef | undefined, colspan: number): string {
if (col?.width && colspan === 1) {
return `width: ${col.width};`;
}
if (colspan > 1) {
return `flex: ${colspan} 1 0%;`;
}
return'';
}

private getRowClasses(isSelected: boolean, isDisabled: boolean, isLast: boolean): string {
return [
'w-full px-4 py-3 transition',
'ml-surface-bg',
!isLast ?'border-b ml-border' :'',
this.hoverable && !isDisabled ?'hover:ml-surface-dim-bg' :'',
isSelected ?'ml-primary-dim-bg border-l-4 ml-border-focus' :'border-l-4 border-transparent',
!isDisabled ?'cursor-pointer' :'cursor-not-allowed opacity-50',
].filter(Boolean).join(' ');
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const columnsEl = this.getLiveSlot('Columns');
const rowsEl = this.getLiveSlot('Rows');
const columns = this.parseColumns();
const rows = this.getLiveRows();
const validationErrors = this.getValidationErrors(columnsEl, rowsEl, columns);

return html`
<div class="${cn('w-full', this.cssClass)}" aria-busy="${this.loading ?'true' :'false'}">
${this.renderValidation(validationErrors)}
${this.loading
? this.renderLoading()
: rows.length === 0
? this.renderEmpty()
: this.renderRows(rows, columns)}
</div>
`;
}
}
