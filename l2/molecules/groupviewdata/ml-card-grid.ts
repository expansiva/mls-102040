/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-card-grid.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML CARD GRID MOLECULE
// =============================================================================
// Skill Group: groupViewData
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
empty: 'No records to display',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando...',
empty: 'Nenhum registro para exibir',
},
};
/// **collab_i18n_end**

interface ColumnDef {
field: string;
header: string;
width?: string;
align?: 'left' | 'center' | 'right';
hidden: boolean;
}

@customElement('groupviewdata--ml-card-grid')
export class MlCardGridMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Columns', 'Column', 'Rows', 'Row', 'Cell', 'Empty', 'Loading'];
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
private selectedIndices: number[] = [];

private validationDone = false;
// ===========================================================================
// LIFECYCLE
// ===========================================================================
firstUpdated() {
this.validateStructure();
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleRowActivation(rowIndex: number, rowElement: Element, isDisabled: boolean) {
if (this.loading || isDisabled) return;

if (this.selectable) {
const baseSelected = this.selectedIndices.length > 0
? new Set(this.selectedIndices)
: new Set(this.getSelectedFromRows(this.getRowElements()));

if (baseSelected.has(rowIndex)) {
baseSelected.delete(rowIndex);
} else {
baseSelected.add(rowIndex);
}

this.selectedIndices = Array.from(baseSelected).sort((a, b) => a - b);

this.dispatchEvent(new CustomEvent('selection-change', {
bubbles: true,
composed: true,
detail: { selected: this.selectedIndices },
}));
}

this.dispatchEvent(new CustomEvent('row-click', {
bubbles: true,
composed: true,
detail: { index: rowIndex, data: rowElement },
}));
}

private handleRowKeydown(e: KeyboardEvent, rowIndex: number, rowElement: Element, isDisabled: boolean) {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.handleRowActivation(rowIndex, rowElement, isDisabled);
}
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const columns = this.getColumnDefs();
const rows = this.getRowElements();

if (!this.validationDone) {
this.validateStructure();
this.validationDone = true;
}

if (this.loading) {
return this.renderLoading();
}

if (rows.length === 0) {
return this.renderEmpty();
}

return html`
<div class="w-full" aria-busy="${this.loading ? 'true' : 'false'}">
${this.renderGrid(rows, columns)}
</div>
`;
}

private renderLoading(): TemplateResult {
const loadingContent = this.hasSlot('Loading')
? this.getSlotContent('Loading')
: this.msg.loading;

return html`
<div class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-sm text-slate-600 dark:text-slate-400">
${unsafeHTML(loadingContent)}
</div>
`;
}

private renderEmpty(): TemplateResult {
const emptyContent = this.hasSlot('Empty')
? this.getSlotContent('Empty')
: this.msg.empty;

return html`
<div class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
${unsafeHTML(emptyContent)}
</div>
`;
}

private renderGrid(rows: Element[], columns: ColumnDef[]): TemplateResult {
return html`
<div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
${rows.map((row, rowIndex) => this.renderCard(row, rowIndex, columns))}
</div>
`;
}

private renderCard(rowElement: Element, rowIndex: number, columns: ColumnDef[]): TemplateResult {
const cells = this.getCellElements(rowElement);
const isDisabled = this.isTruthyAttr(rowElement.getAttribute('disabled'));
const isSelected = this.isRowSelected(rowIndex, rowElement);
const cardClasses = this.getCardClasses(isSelected, isDisabled);
const tabindex = isDisabled ? -1 : 0;

return html`
<div
class="${cardClasses}"
role="button"
aria-selected="${isSelected ? 'true' : 'false'}"
aria-disabled="${isDisabled ? 'true' : 'false'}"
tabindex="${tabindex}"
@click=${() => this.handleRowActivation(rowIndex, rowElement, isDisabled)}
@keydown=${(e: KeyboardEvent) => this.handleRowKeydown(e, rowIndex, rowElement, isDisabled)}
>
<div class="grid grid-cols-12 gap-2">
${cells.map((cell, cellIndex) => this.renderCell(cell, cellIndex, columns))}
</div>
</div>
`;
}

private renderCell(cellElement: Element, cellIndex: number, columns: ColumnDef[]): TemplateResult {
const column = columns[cellIndex];
if (column?.hidden) {
return html``;
}

const alignClass = column?.align === 'center'
? 'text-center'
: column?.align === 'right'
? 'text-right'
: 'text-left';

const colspanAttr = cellElement.getAttribute('colspan');
const colspan = colspanAttr ? Number(colspanAttr) : null;
const gridSpanStyle = colspan && colspan > 1
? `grid-column: span ${colspan} / span ${colspan};`
: '';

const widthStyle = column?.width ? `width: ${column.width};` : '';
const style = `${gridSpanStyle}${widthStyle}`.trim();

const cellClasses = [
'col-span-12 text-sm text-slate-900 dark:text-slate-100',
alignClass,
].filter(Boolean).join(' ');

return html`
<div class="${cellClasses}" style="${style}">
${unsafeHTML(cellElement.innerHTML)}
</div>
`;
}
// ===========================================================================
// HELPERS
// ===========================================================================
private getColumnDefs(): ColumnDef[] {
const columnsSlot = this.getSlot('Columns');
if (!columnsSlot) return [];

const columnElements = this.getDirectChildrenByTag(columnsSlot, 'Column');
return columnElements.map((el) => {
const field = el.getAttribute('field') || '';
const header = el.getAttribute('header') || '';
const width = el.getAttribute('width') || undefined;
const align = (el.getAttribute('align') as 'left' | 'center' | 'right' | null) || undefined;
const hidden = this.isTruthyAttr(el.getAttribute('hidden'));

return { field, header, width, align, hidden };
});
}

private getRowElements(): Element[] {
const rowsSlot = this.getSlot('Rows');
if (!rowsSlot) return [];
return this.getDirectChildrenByTag(rowsSlot, 'Row');
}

private getCellElements(rowElement: Element): Element[] {
return this.getDirectChildrenByTag(rowElement, 'Cell');
}

private getDirectChildrenByTag(parent: Element, tagName: string): Element[] {
return Array.from(parent.children).filter((child) => child.tagName === tagName.toUpperCase());
}

private getSelectedFromRows(rows: Element[]): number[] {
return rows
.map((row, index) => (this.isTruthyAttr(row.getAttribute('selected')) ? index : -1))
.filter((index) => index >= 0);
}

private isRowSelected(rowIndex: number, rowElement: Element): boolean {
if (this.selectedIndices.length > 0) {
return this.selectedIndices.includes(rowIndex);
}
return this.isTruthyAttr(rowElement.getAttribute('selected'));
}

private isTruthyAttr(value: string | null): boolean {
if (value === null) return false;
if (value.toLowerCase() === 'false') return false;
return true;
}

private getCardClasses(isSelected: boolean, isDisabled: boolean): string {
return [
'rounded-xl border p-4 transition',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'text-slate-900 dark:text-slate-100',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 border-sky-500 dark:border-sky-400'
: '',
this.hoverable && !isDisabled && !isSelected
? 'hover:bg-slate-50 dark:hover:bg-slate-700'
: '',
isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
].filter(Boolean).join(' ');
}
// ===========================================================================
// VALIDATION
// ===========================================================================
private validateStructure() {
const columnsSlot = this.getSlot('Columns');
const rowsSlot = this.getSlot('Rows');

if (!columnsSlot) {
console.error('Missing required slot <Columns>');
}

if (!rowsSlot) {
console.error('Missing required slot <Rows>');
}

const columnElements = columnsSlot ? this.getDirectChildrenByTag(columnsSlot, 'Column') : [];
if (columnsSlot && columnElements.length === 0) {
console.error('At least 1 <Column> is required inside <Columns>');
}

columnElements.forEach((col) => {
if (!col.getAttribute('field')) {
console.error('<Column> requires attribute "field"');
}
if (!col.getAttribute('header')) {
console.error('<Column> requires attribute "header"');
}
});

this.validateUnknownTags(columnsSlot, rowsSlot);
}

private validateUnknownTags(columnsSlot: Element | null, rowsSlot: Element | null) {
const allowedRoot = new Set(['COLUMNS', 'ROWS', 'EMPTY', 'LOADING']);
Array.from(this.children).forEach((child) => {
if (!allowedRoot.has(child.tagName)) {
console.warn(`Unknown slot <${child.tagName}> ignored`);
}
});

if (columnsSlot) {
Array.from(columnsSlot.children).forEach((child) => {
if (child.tagName !== 'COLUMN') {
console.warn(`Unknown slot <${child.tagName}> ignored`);
}
});
}

if (rowsSlot) {
Array.from(rowsSlot.children).forEach((child) => {
if (child.tagName !== 'ROW') {
console.warn(`Unknown slot <${child.tagName}> ignored`);
}
if (child.tagName === 'ROW') {
Array.from(child.children).forEach((rowChild) => {
if (rowChild.tagName !== 'CELL') {
console.warn(`Unknown slot <${rowChild.tagName}> ignored`);
}
});
}
});
}
}
}

declare global {
interface HTMLElementTagNameMap {
'groupviewdata--ml-card-grid': MlCardGridMolecule;
}
}
