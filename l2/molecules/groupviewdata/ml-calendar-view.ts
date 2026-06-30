/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-calendar-view.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CALENDAR VIEW MOLECULE
// =============================================================================
// Skill Group: groupViewData
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No events to display',
 moreEvents:'+{count} more',
 monthView:'Month',
 weekView:'Week',
 sunday:'Sun',
 monday:'Mon',
 tuesday:'Tue',
 wednesday:'Wed',
 thursday:'Thu',
 friday:'Fri',
 saturday:'Sat',
 today:'Today',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum evento para exibir',
 moreEvents:'+{count} mais',
 monthView:'Mês',
 weekView:'Semana',
 sunday:'Dom',
 monday:'Seg',
 tuesday:'Ter',
 wednesday:'Qua',
 thursday:'Qui',
 friday:'Sex',
 saturday:'Sáb',
 today:'Hoje',
 },
};
/// **collab_i18n_end**

interface ParsedColumn {
 field: string;
 header: string;
 width?: string;
 align?:'left' |'center' |'right';
 hidden?: boolean;
}

interface ParsedCell {
 content: string;
 colspan?: number;
}

interface ParsedRow {
 cells: ParsedCell[];
 selected: boolean;
 disabled: boolean;
 element: Element;
}

interface CalendarEvent {
 title: string;
 date: string;
 hour?: number;
 rowIndex: number;
 cellIndex: number;
}

interface CalendarDay {
 date: Date;
 isCurrentMonth: boolean;
 isToday: boolean;
 events: CalendarEvent[];
}

@customElement('groupviewdata--ml-calendar-view')
export class CalendarViewMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Columns','Column','Rows','Row','Cell','Empty','Loading'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 loading = false;

 @propertyDataSource({ type: Boolean })
 selectable = false;

 @propertyDataSource({ type: Boolean })
 hoverable = true;

 @property({ type: String })
 name ='';

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private viewMode:'month' |'week' ='month';

 @state()
 private currentDate: Date = new Date();

 @state()
 private parsedColumns: ParsedColumn[] = [];

 @state()
 private parsedRows: ParsedRow[] = [];

 private readonly MAX_EVENTS_PER_DAY = 3;
 private readonly HOURS_IN_DAY = 24;
 private readonly DAYS_IN_WEEK = 7;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.parseSlotContent();
 }

 updated(changedProperties: Map<string, unknown>) {
 if (changedProperties.has('loading')) {
 this.parseSlotContent();
 }
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 private parseSlotContent() {
 this.parsedColumns = this.parseColumns();
 this.parsedRows = this.parseRows();
 }

 private parseColumns(): ParsedColumn[] {
 const columnsSlot = this.getSlot('Columns');
 if (!columnsSlot) return [];

 const columnElements = Array.from(columnsSlot.querySelectorAll('Column'));
 return columnElements.map((col) => ({
 field: col.getAttribute('field') ||'',
 header: col.getAttribute('header') ||'',
 width: col.getAttribute('width') || undefined,
 align: (col.getAttribute('align') as'left' |'center' |'right') ||'left',
 hidden: col.hasAttribute('hidden'),
 }));
 }

 private parseRows(): ParsedRow[] {
 const rowsSlot = this.getSlot('Rows');
 if (!rowsSlot) return [];

 const rowElements = Array.from(rowsSlot.querySelectorAll('Row'));
 return rowElements.map((row) => {
 const cellElements = Array.from(row.querySelectorAll('Cell'));
 const cells: ParsedCell[] = cellElements.map((cell) => ({
 content: cell.innerHTML.trim(),
 colspan: cell.hasAttribute('colspan') ? parseInt(cell.getAttribute('colspan') ||'1', 10) : undefined,
 }));

 return {
 cells,
 selected: row.hasAttribute('selected'),
 disabled: row.hasAttribute('disabled'),
 element: row,
 };
 });
 }

 // ===========================================================================
 // CALENDAR HELPERS
 // ===========================================================================
 private getWeekDays(): string[] {
 return [
 this.msg.sunday,
 this.msg.monday,
 this.msg.tuesday,
 this.msg.wednesday,
 this.msg.thursday,
 this.msg.friday,
 this.msg.saturday,
 ];
 }

 private getMonthDays(): CalendarDay[][] {
 const year = this.currentDate.getFullYear();
 const month = this.currentDate.getMonth();
 const firstDay = new Date(year, month, 1);
 const lastDay = new Date(year, month + 1, 0);
 const today = new Date();

 const weeks: CalendarDay[][] = [];
 let currentWeek: CalendarDay[] = [];

 // Fill in days from previous month
 const startDayOfWeek = firstDay.getDay();
 for (let i = startDayOfWeek - 1; i >= 0; i--) {
 const date = new Date(year, month, -i);
 currentWeek.push({
 date,
 isCurrentMonth: false,
 isToday: this.isSameDay(date, today),
 events: this.getEventsForDate(date),
 });
 }

 // Fill in days of current month
 for (let day = 1; day <= lastDay.getDate(); day++) {
 const date = new Date(year, month, day);
 currentWeek.push({
 date,
 isCurrentMonth: true,
 isToday: this.isSameDay(date, today),
 events: this.getEventsForDate(date),
 });

 if (currentWeek.length === 7) {
 weeks.push(currentWeek);
 currentWeek = [];
 }
 }

 // Fill in days from next month
 if (currentWeek.length > 0) {
 let nextMonthDay = 1;
 while (currentWeek.length < 7) {
 const date = new Date(year, month + 1, nextMonthDay++);
 currentWeek.push({
 date,
 isCurrentMonth: false,
 isToday: this.isSameDay(date, today),
 events: this.getEventsForDate(date),
 });
 }
 weeks.push(currentWeek);
 }

 return weeks;
 }

 private getWeekDates(): CalendarDay[] {
 const today = new Date();
 const startOfWeek = new Date(this.currentDate);
 startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

 const days: CalendarDay[] = [];
 for (let i = 0; i < this.DAYS_IN_WEEK; i++) {
 const date = new Date(startOfWeek);
 date.setDate(startOfWeek.getDate() + i);
 days.push({
 date,
 isCurrentMonth: date.getMonth() === this.currentDate.getMonth(),
 isToday: this.isSameDay(date, today),
 events: this.getEventsForDate(date),
 });
 }
 return days;
 }

 private isSameDay(date1: Date, date2: Date): boolean {
 return (
 date1.getFullYear() === date2.getFullYear() &&
 date1.getMonth() === date2.getMonth() &&
 date1.getDate() === date2.getDate()
 );
 }

 private getEventsForDate(date: Date): CalendarEvent[] {
 const events: CalendarEvent[] = [];
 const dateStr = this.formatDateString(date);

 this.parsedRows.forEach((row, rowIndex) => {
 row.cells.forEach((cell, cellIndex) => {
 // Check if cell content contains the date
 if (cell.content.includes(dateStr) || cell.content.includes(date.toISOString().split('T')[0])) {
 // Extract title from cell content
 const titleMatch = cell.content.match(/title["']?\s*[:=]\s*["']?([^"'<>]+)/i);
 const title = titleMatch ? titleMatch[1].trim() : cell.content.replace(/<[^>]*>/g,'').trim();
 
 // Extract hour if present
 const hourMatch = cell.content.match(/hour["']?\s*[:=]\s*["']?(\d+)/i);
 const hour = hourMatch ? parseInt(hourMatch[1], 10) : undefined;

 events.push({
 title: title ||'Event',
 date: dateStr,
 hour,
 rowIndex,
 cellIndex,
 });
 }
 });
 });

 return events;
 }

 private formatDateString(date: Date): string {
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2,'0');
 const day = String(date.getDate()).padStart(2,'0');
 return `${year}-${month}-${day}`;
 }

 private getMonthYearLabel(): string {
 return this.currentDate.toLocaleDateString(undefined, { month:'long', year:'numeric' });
 }

 private formatHour(hour: number): string {
 const period = hour >= 12 ?'PM' :'AM';
 const displayHour = hour % 12 || 12;
 return `${displayHour} ${period}`;
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleViewModeChange(mode:'month' |'week') {
 this.viewMode = mode;
 }

 private handlePrevious() {
 const newDate = new Date(this.currentDate);
 if (this.viewMode ==='month') {
 newDate.setMonth(newDate.getMonth() - 1);
 } else {
 newDate.setDate(newDate.getDate() - 7);
 }
 this.currentDate = newDate;
 }

 private handleNext() {
 const newDate = new Date(this.currentDate);
 if (this.viewMode ==='month') {
 newDate.setMonth(newDate.getMonth() + 1);
 } else {
 newDate.setDate(newDate.getDate() + 7);
 }
 this.currentDate = newDate;
 }

 private handleToday() {
 this.currentDate = new Date();
 }

 private handleEventClick(event: CalendarEvent, e: Event) {
 e.stopPropagation();
 const row = this.parsedRows[event.rowIndex];
 if (row?.disabled) return;

 this.dispatchEvent(
 new CustomEvent('row-click', {
 bubbles: true,
 composed: true,
 detail: { index: event.rowIndex, data: row?.element },
 })
 );
 }

 private handleCellClick(day: CalendarDay, hour?: number) {
 this.dispatchEvent(
 new CustomEvent('row-click', {
 bubbles: true,
 composed: true,
 detail: {
 index: -1,
 data: {
 date: day.date,
 hour,
 isEmpty: true,
 },
 },
 })
 );
 }

 // ===========================================================================
 // STYLES
 // ===========================================================================
 private getContainerClasses(): string {
 return [
'w-full rounded-lg border overflow-hidden',
'ml-surface-bg',
'ml-border',
 ].join(' ');
 }

 private getHeaderClasses(): string {
 return [
'flex items-center justify-between p-4 border-b',
'ml-surface-dim-bg',
'ml-border',
 ].join(' ');
 }

 private getViewToggleClasses(isActive: boolean): string {
 return [
'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
 isActive
 ?'ml-primary-bg'
 :'ml-surface-bg ml-text-muted hover:ml-surface-dim-bg',
'border ml-border',
 ].join(' ');
 }

 private getNavButtonClasses(): string {
 return [
'p-2 rounded-md transition-colors',
'ml-text-muted',
'hover:ml-surface-dim-bg',
'',
 ].join(' ');
 }

 private getTodayButtonClasses(): string {
 return [
'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
'ml-surface-bg',
'ml-text-muted',
'border ml-border',
'hover:ml-surface-dim-bg',
 ].join(' ');
 }

 private getWeekDayHeaderClasses(): string {
 return [
'py-2 text-center text-xs font-semibold uppercase tracking-wider',
'ml-text-muted',
'ml-surface-dim-bg',
'border-b ml-border',
 ].join(' ');
 }

 private getDayCellClasses(day: CalendarDay): string {
 return [
'min-h-[100px] p-1 border-b border-r cursor-pointer transition-colors',
'ml-border',
 day.isCurrentMonth
 ?'ml-surface-bg'
 :'ml-surface-dim-bg',
 this.hoverable ?'hover:ml-surface-dim-bg' :'',
 ].join(' ');
 }

 private getDayNumberClasses(day: CalendarDay): string {
 return [
'inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full',
 day.isToday
 ?'ml-primary-bg'
 : day.isCurrentMonth
 ?'ml-text'
 :'ml-text-faint',
 ].join(' ');
 }

 private getEventChipClasses(rowIndex: number): string {
 const row = this.parsedRows[rowIndex];
 const isSelected = row?.selected || false;
 const isDisabled = row?.disabled || false;

 return [
'block w-full px-2 py-0.5 mb-0.5 text-xs rounded truncate transition-colors',
 isDisabled
 ?'ml-surface-dim-bg ml-text-faint cursor-not-allowed opacity-50'
 : isSelected
 ?'ml-primary-bg cursor-pointer'
 :'ml-primary-dim-bg ml-primary-text hover:ml-surface-dim-bg cursor-pointer',
 ].join(' ');
 }

 private getMoreEventsClasses(): string {
 return [
'text-xs font-medium mt-1',
'ml-text-muted',
 ].join(' ');
 }

 private getHourCellClasses(): string {
 return [
'h-12 border-b border-r relative cursor-pointer transition-colors',
'ml-border',
'ml-surface-bg',
 this.hoverable ?'hover:ml-surface-dim-bg' :'',
 ].join(' ');
 }

 private getHourLabelClasses(): string {
 return [
'w-16 h-12 flex items-start justify-end pr-2 pt-1 text-xs border-b border-r',
'ml-text-muted',
'ml-surface-dim-bg',
'ml-border',
 ].join(' ');
 }

 private getWeekHeaderCellClasses(day: CalendarDay): string {
 return [
'flex-1 py-2 text-center border-b border-r',
'ml-border',
'ml-surface-dim-bg',
 ].join(' ');
 }

 private getWeekHeaderDateClasses(day: CalendarDay): string {
 return [
'inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full',
 day.isToday
 ?'ml-primary-bg'
 :'ml-text',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER METHODS
 // ===========================================================================
 private renderHeader(): TemplateResult {
 return html`
 <div class=${this.getHeaderClasses()}>
 <div class="flex items-center gap-2">
 <button
 type="button"
 class=${this.getNavButtonClasses()}
 @click=${this.handlePrevious}
 aria-label="Previous"
 >
 ${this.renderChevronLeft()}
 </button>
 <button
 type="button"
 class=${this.getNavButtonClasses()}
 @click=${this.handleNext}
 aria-label="Next"
 >
 ${this.renderChevronRight()}
 </button>
 <button
 type="button"
 class=${this.getTodayButtonClasses()}
 @click=${this.handleToday}
 >
 ${this.msg.today}
 </button>
 <h2 class="ml-4 text-lg font-semibold ml-text">
 ${this.getMonthYearLabel()}
 </h2>
 </div>
 <div class="flex items-center gap-1">
 <button
 type="button"
 class=${this.getViewToggleClasses(this.viewMode ==='month')}
 @click=${() => this.handleViewModeChange('month')}
 >
 ${this.msg.monthView}
 </button>
 <button
 type="button"
 class=${this.getViewToggleClasses(this.viewMode ==='week')}
 @click=${() => this.handleViewModeChange('week')}
 >
 ${this.msg.weekView}
 </button>
 </div>
 </div>
 `;
 }

 private renderChevronLeft(): TemplateResult {
 return html`
 <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
 ${svg`<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />`}
 </svg>
 `;
 }

 private renderChevronRight(): TemplateResult {
 return html`
 <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
 ${svg`<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />`}
 </svg>
 `;
 }

 private renderMonthView(): TemplateResult {
 const weeks = this.getMonthDays();
 const weekDays = this.getWeekDays();

 return html`
 <div class="w-full">
 <div class="grid grid-cols-7">
 ${weekDays.map(
 (day) => html`
 <div class=${this.getWeekDayHeaderClasses()}>${day}</div>
 `
 )}
 </div>
 <div class="grid grid-cols-7">
 ${weeks.map((week) =>
 week.map((day) => this.renderMonthDayCell(day))
 )}
 </div>
 </div>
 `;
 }

 private renderMonthDayCell(day: CalendarDay): TemplateResult {
 const visibleEvents = day.events.slice(0, this.MAX_EVENTS_PER_DAY);
 const hiddenCount = day.events.length - this.MAX_EVENTS_PER_DAY;

 return html`
 <div
 class=${this.getDayCellClasses(day)}
 @click=${() => this.handleCellClick(day)}
 >
 <div class="flex justify-end mb-1">
 <span class=${this.getDayNumberClasses(day)}>
 ${day.date.getDate()}
 </span>
 </div>
 <div class="space-y-0.5">
 ${visibleEvents.map(
 (event) => html`
 <button
 type="button"
 class=${this.getEventChipClasses(event.rowIndex)}
 @click=${(e: Event) => this.handleEventClick(event, e)}
 title=${event.title}
 ?disabled=${this.parsedRows[event.rowIndex]?.disabled}
 aria-selected=${this.parsedRows[event.rowIndex]?.selected ?'true' :'false'}
 aria-disabled=${this.parsedRows[event.rowIndex]?.disabled ?'true' :'false'}
 >
 ${event.title}
 </button>
 `
 )}
 ${hiddenCount > 0
 ? html`
 <div class=${this.getMoreEventsClasses()}>
 ${this.msg.moreEvents.replace('{count}', String(hiddenCount))}
 </div>
 `
 : html``}
 </div>
 </div>
 `;
 }

 private renderWeekView(): TemplateResult {
 const weekDays = this.getWeekDates();
 const dayNames = this.getWeekDays();
 const hours = Array.from({ length: this.HOURS_IN_DAY }, (_, i) => i);

 return html`
 <div class="w-full overflow-auto">
 <div class="flex">
 <div class="w-16 flex-shrink-0"></div>
 ${weekDays.map(
 (day, index) => html`
 <div class=${this.getWeekHeaderCellClasses(day)} style="flex: 1;">
 <div class="text-xs ml-text-muted mb-1">
 ${dayNames[index]}
 </div>
 <span class=${this.getWeekHeaderDateClasses(day)}>
 ${day.date.getDate()}
 </span>
 </div>
 `
 )}
 </div>
 <div class="flex flex-col">
 ${hours.map((hour) => this.renderWeekHourRow(hour, weekDays))}
 </div>
 </div>
 `;
 }

 private renderWeekHourRow(hour: number, weekDays: CalendarDay[]): TemplateResult {
 return html`
 <div class="flex">
 <div class=${this.getHourLabelClasses()}>
 ${this.formatHour(hour)}
 </div>
 ${weekDays.map((day) => this.renderWeekHourCell(day, hour))}
 </div>
 `;
 }

 private renderWeekHourCell(day: CalendarDay, hour: number): TemplateResult {
 const eventsAtHour = day.events.filter((e) => e.hour === hour);

 return html`
 <div
 class=${this.getHourCellClasses()}
 style="flex: 1;"
 @click=${() => this.handleCellClick(day, hour)}
 >
 ${eventsAtHour.map(
 (event) => html`
 <button
 type="button"
 class=${this.getEventChipClasses(event.rowIndex)}
 @click=${(e: Event) => this.handleEventClick(event, e)}
 title=${event.title}
 ?disabled=${this.parsedRows[event.rowIndex]?.disabled}
 aria-selected=${this.parsedRows[event.rowIndex]?.selected ?'true' :'false'}
 aria-disabled=${this.parsedRows[event.rowIndex]?.disabled ?'true' :'false'}
 >
 ${event.title}
 </button>
 `
 )}
 </div>
 `;
 }

 private renderLoading(): TemplateResult {
 const loadingContent = this.getSlotContent('Loading');
 if (loadingContent) {
 return html`
 <div class="flex items-center justify-center p-8">
 ${unsafeHTML(loadingContent)}
 </div>
 `;
 }

 return html`
 <div class="flex items-center justify-center p-8">
 <div class="flex items-center gap-2 ml-text-muted">
 <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
 ${svg`
 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 `}
 </svg>
 <span>${this.msg.loading}</span>
 </div>
 </div>
 `;
 }

 private renderEmpty(): TemplateResult {
 const emptyContent = this.getSlotContent('Empty');
 if (emptyContent) {
 return html`
 <div class="flex items-center justify-center p-8 ml-text-muted">
 ${unsafeHTML(emptyContent)}
 </div>
 `;
 }

 return html`
 <div class="flex items-center justify-center p-8 ml-text-muted">
 ${this.msg.empty}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 this.parseSlotContent();

 if (this.loading) {
 return html`
 <div class=${cn(this.getContainerClasses(), this.cssClass)} aria-busy="true">
 ${this.renderHeader()}
 ${this.renderLoading()}
 </div>
 `;
 }

 const hasRows = this.parsedRows.length > 0;

 return html`
 <div class=${cn(this.getContainerClasses(), this.cssClass)} aria-busy="false">
 ${this.renderHeader()}
 ${hasRows
 ? this.viewMode ==='month'
 ? this.renderMonthView()
 : this.renderWeekView()
 : this.renderEmpty()}
 </div>
 `;
 }
}
