/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-date-shortcut-picker.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// DATE SHORTCUT PICKER MOLECULE
// =============================================================================
// Skill Group: groupEnterDate
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  thisMonth: 'This month',
  last30Days: 'Last 30 days',
  placeholder: 'Enter date',
  loading: 'Loading...',
  noValue: '—',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    today: 'Hoje',
    yesterday: 'Ontem',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mês',
    last30Days: 'Últimos 30 dias',
    placeholder: 'Digite a data',
    loading: 'Carregando...',
    noValue: '—',
  },
};
/// **collab_i18n_end**

interface ShortcutOption {
  key: string;
  label: string;
  getDate: () => string;
}

@customElement('groupenterdate--ml-date-shortcut-picker')
export class DateShortcutPickerMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================

  // Data
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // Configuration
  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: String, attribute: 'min-date' })
  minDate: string = '';

  @propertyDataSource({ type: String, attribute: 'max-date' })
  maxDate: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number, attribute: 'first-day-of-week' })
  firstDayOfWeek: number = 0;

  @propertyDataSource({ type: Boolean, attribute: 'show-week-numbers' })
  showWeekNumbers: boolean = false;

  // States
  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = true;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  readonly: boolean = false;

  @propertyDataSource({ type: Boolean })
  required: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private inputValue: string = '';

  @state()
  private isFocused: boolean = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.syncInputValue();
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.syncInputValue();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================
  private syncInputValue() {
    if (this.value) {
      this.inputValue = this.formatDateForDisplay(this.value);
    } else {
      this.inputValue = '';
    }
  }

  private getLocale(): string {
    return this.locale || navigator.language || 'en-US';
  }

  private formatDateForDisplay(isoDate: string): string {
    if (!isoDate) return '';
    try {
      const [year, month, day] = isoDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(this.getLocale());
    } catch {
      return isoDate;
    }
  }

  private parseDisplayToIso(displayDate: string): string | null {
    if (!displayDate.trim()) return null;
    
    // Try parsing as ISO first
    const isoMatch = displayDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      return displayDate;
    }

    // Try parsing based on locale patterns
    const locale = this.getLocale();
    const parts = displayDate.split(/[\/\.\-]/);
    
    if (parts.length !== 3) return null;

    let year: number, month: number, day: number;

    if (locale.startsWith('en-US')) {
      // MM/DD/YYYY
      [month, day, year] = parts.map(Number);
    } else {
      // DD/MM/YYYY or DD.MM.YYYY
      [day, month, year] = parts.map(Number);
    }

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    if (year < 1000) year += 2000;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private getTodayIso(): string {
    const today = new Date();
    return this.dateToIso(today);
  }

  private dateToIso(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getYesterdayIso(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.dateToIso(yesterday);
  }

  private getThisWeekStartIso(): string {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = (currentDay - this.firstDayOfWeek + 7) % 7;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - diff);
    return this.dateToIso(weekStart);
  }

  private getThisMonthStartIso(): string {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.dateToIso(monthStart);
  }

  private getLast30DaysIso(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return this.dateToIso(date);
  }

  private isDateInRange(isoDate: string): boolean {
    if (!isoDate) return false;
    if (this.minDate && isoDate < this.minDate) return false;
    if (this.maxDate && isoDate > this.maxDate) return false;
    return true;
  }

  private getShortcuts(): ShortcutOption[] {
    return [
      { key: 'today', label: this.msg.today, getDate: () => this.getTodayIso() },
      { key: 'yesterday', label: this.msg.yesterday, getDate: () => this.getYesterdayIso() },
      { key: 'thisWeek', label: this.msg.thisWeek, getDate: () => this.getThisWeekStartIso() },
      { key: 'thisMonth', label: this.msg.thisMonth, getDate: () => this.getThisMonthStartIso() },
      { key: 'last30Days', label: this.msg.last30Days, getDate: () => this.getLast30DaysIso() },
    ];
  }

  private isShortcutSelected(shortcut: ShortcutOption): boolean {
    if (!this.value) return false;
    return this.value === shortcut.getDate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleShortcutClick(shortcut: ShortcutOption) {
    if (this.disabled || this.readonly) return;

    const dateValue = shortcut.getDate();
    if (!this.isDateInRange(dateValue)) return;

    this.value = dateValue;
    this.inputValue = this.formatDateForDisplay(dateValue);

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleInputChange(e: Event) {
    e.stopPropagation();
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;

    if (!input.value.trim()) {
      this.value = null;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: null },
      }));
      return;
    }

    const isoDate = this.parseDisplayToIso(input.value);
    if (isoDate && this.isDateInRange(isoDate)) {
      this.value = isoDate;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }));
    }
  }

  private handleInputFocus() {
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleInputBlur() {
    this.isFocused = false;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return cn('flex flex-col gap-2 w-full', this.cssClass);
  }

  private getShortcutsContainerClasses(): string {
    return 'flex flex-wrap gap-2';
  }

  private getShortcutClasses(shortcut: ShortcutOption): string {
    const isSelected = this.isShortcutSelected(shortcut);
    const isDisabled = this.disabled || !this.isDateInRange(shortcut.getDate());

    return cn(
      'ml-date-shortcut px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
      'border cursor-pointer select-none',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      isSelected ? 'ml-date-shortcut-active' : '',
      !isDisabled && !isSelected ? 'ml-date-shortcut--hoverable' : '',
      isDisabled ? 'ml-disabled' : '',
    );
  }

  private getInputClasses(): string {
    const hasError = !!this.error;

    return cn(
      'ml-date-shortcut-input w-full rounded-lg px-3 py-2 text-sm border transition-all duration-150',
      'focus:outline-none focus:ring-2',
      hasError ? 'ml-date-shortcut-input--error' : '',
      this.isFocused && !hasError ? 'ml-date-shortcut-input--focused' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'ml-date-shortcut-input--readonly' : '',
    );
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const labelContent = this.getSlotContent('Label');
    const labelId = `label-${this.name || 'date-shortcut'}`;
    return html`
      <label id="${labelId}" class="${cn('ml-label text-sm', this.getSlotClass('Label'))}">
        ${unsafeHTML(labelContent)}
        ${this.required ? html`<span class="ml-error-text ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderShortcuts(): TemplateResult {
    const shortcuts = this.getShortcuts();

    return html`
      <div class="${this.getShortcutsContainerClasses()}" role="group" aria-label="Date shortcuts">
        ${shortcuts.map(shortcut => this.renderShortcut(shortcut))}
      </div>
    `;
  }

  private renderShortcut(shortcut: ShortcutOption): TemplateResult {
    const isDisabled = this.disabled || !this.isDateInRange(shortcut.getDate());
    const isSelected = this.isShortcutSelected(shortcut);

    return html`
      <button
        type="button"
        class="${this.getShortcutClasses(shortcut)}"
        ?disabled="${isDisabled}"
        aria-pressed="${isSelected}"
        @click="${() => this.handleShortcutClick(shortcut)}"
      >
        ${shortcut.label}
      </button>
    `;
  }

  private renderInput(): TemplateResult {
    const placeholderText = this.placeholder || this.msg.placeholder;
    const labelId = `label-${this.name || 'date-shortcut'}`;
    const errorId = `error-${this.name || 'date-shortcut'}`;
    const hasError = !!this.error;

    return html`
      <input
        type="text"
        class="${this.getInputClasses()}"
        .value="${this.inputValue}"
        placeholder="${placeholderText}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        aria-labelledby="${this.hasSlot('Label') ? labelId : ''}"
        aria-describedby="${hasError ? errorId : ''}"
        aria-invalid="${hasError}"
        aria-required="${this.required}"
        @input="${this.handleInputChange}"
        @focus="${this.handleInputFocus}"
        @blur="${this.handleInputBlur}"
      
      @change="${(e: Event) => e.stopPropagation()}"
/>
    `;
  }

  private renderFeedback(): TemplateResult {
    const errorId = `error-${this.name || 'date-shortcut'}`;

    if (this.error) {
      return html`
        <p id="${errorId}" class="ml-error-text text-xs">
          ${unsafeHTML(this.error)}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class="${cn('ml-helper text-xs', this.getSlotClass('Helper'))}">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="ml-text-muted flex items-center justify-center py-4 text-sm">
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${this.msg.loading}
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const displayValue = this.value
      ? this.formatDateForDisplay(this.value)
      : this.msg.noValue;

    return html`
      <div class="${this.getContainerClasses()}">
        ${this.renderLabel()}
        <span class="ml-text text-sm">${displayValue}</span>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    return html`
      <div class="${this.getContainerClasses()}">
        ${this.renderLabel()}
        ${this.renderShortcuts()}
        ${this.renderInput()}
        ${this.renderFeedback()}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    if (this.loading) {
      return html`
        <div class="${this.getContainerClasses()}">
          ${this.renderLabel()}
          ${this.renderLoading()}
        </div>
      `;
    }

    return this.renderEditMode();
  }
}