/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-floating-number-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// GROUP ENTER NUMBER – FLOATING NUMBER INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterNumber
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

let idCounter = 0;

@customElement('groupenternumber--ml-floating-number-input')
export class MlFloatingNumberInputMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `ml-fni-${++idCounter}`;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: Number })
  min: number | null = null;

  @propertyDataSource({ type: Number })
  max: number | null = null;

  @propertyDataSource({ type: Number })
  step = 1;

  @propertyDataSource({ type: Number })
  decimals = 0;

  @propertyDataSource({ type: String })
  locale = '';

  @propertyDataSource({ type: String })
  placeholder = '';

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing = true;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  readonly = false;

  @propertyDataSource({ type: Boolean })
  required = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private rawValue = '';

  @state()
  private isFocused = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('value')) {
      if (this.value === null || this.value === undefined) {
        this.rawValue = '';
      } else {
        const parsedRaw = this.parseRawValue(this.rawValue);
        if (parsedRaw !== this.value) {
          this.rawValue = this.formatToDisplay(this.value);
        }
      }
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, _value: any) {
    const valueAttr = this.getAttribute('value');
    const localeAttr = this.getAttribute('locale');
    const decimalsAttr = this.getAttribute('decimals');

    if (valueAttr === `{{${key}}}`) {
      this.rawValue = this.value === null || this.value === undefined
        ? ''
        : this.formatToDisplay(this.value);
    }
    if (localeAttr === `{{${key}}}` || decimalsAttr === `{{${key}}}`) {
      this.rawValue = this.value === null || this.value === undefined
        ? ''
        : this.formatToDisplay(this.value);
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;
    const input = e.target as HTMLInputElement;
    this.rawValue = input.value;
    const parsed = this.parseRawValue(this.rawValue);
    this.value = parsed;
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleBlur() {
    this.isFocused = false;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    if (this.disabled || this.readonly || this.loading) return;

    const parsed = this.parseRawValue(this.rawValue);
    if (parsed === null) {
      this.value = null;
      this.rawValue = '';
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: null },
      }));
      return;
    }

    let next = this.roundToDecimals(parsed);
    if (this.min !== null && next < this.min) next = this.min;
    if (this.max !== null && next > this.max) next = this.max;

    this.value = next;
    this.rawValue = this.formatToDisplay(next);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleFocus() {
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  // ===========================================================================
  // HELPERS — Formatting & Parsing (same as ml-number-input)
  // ===========================================================================
  private getSeparators(): { group: string; decimal: string } {
    try {
      const parts = new Intl.NumberFormat(this.locale || undefined).formatToParts(1000.1);
      const group = parts.find(p => p.type === 'group')?.value || ',';
      const decimal = parts.find(p => p.type === 'decimal')?.value || '.';
      return { group, decimal };
    } catch {
      return { group: ',', decimal: '.' };
    }
  }

  private parseRawValue(raw: string): number | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const { group, decimal } = this.getSeparators();
    let normalized = trimmed.split(group).join('');
    if (decimal !== '.') normalized = normalized.split(decimal).join('.');
    let cleaned = normalized.replace(/[^0-9.-]/g, '');
    if (!cleaned) return null;
    if (cleaned.includes('-')) {
      cleaned = cleaned.replace(/-/g, '');
      cleaned = `-${cleaned}`;
      if (cleaned === '-') return null;
    }
    const parts = cleaned.split('.');
    if (parts.length > 2) cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  private roundToDecimals(num: number): number {
    const factor = Math.pow(10, Math.max(0, this.decimals));
    return Math.round(num * factor) / factor;
  }

  private formatToDisplay(num: number): string {
    try {
      return num.toLocaleString(this.locale || undefined, {
        minimumFractionDigits: Math.max(0, this.decimals),
        maximumFractionDigits: Math.max(0, this.decimals),
      });
    } catch {
      return num.toFixed(Math.max(0, this.decimals));
    }
  }

  // ===========================================================================
  // CSS CLASS BUILDERS
  // ===========================================================================
  private getContainerClasses(hasInlineLabel: boolean): string {
    return [
      'relative flex w-full items-center gap-2 ml-input-container',
      hasInlineLabel ? 'pt-4 pb-1 px-3' : 'py-2 px-3',
      this.error ? 'ml-input-container-error' : '',
      this.disabled || this.loading ? 'ml-disabled' : 'cursor-text',
    ].filter(Boolean).join(' ');
  }

  private getInputClasses(): string {
    return [
      'flex-1 bg-transparent outline-none text-sm ml-input',
      this.disabled || this.loading ? 'cursor-not-allowed' : '',
      this.readonly ? 'cursor-default' : '',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderFloatingLabel(labelText: string, labelId: string): TemplateResult {
    if (!labelText) return html``;
    return html`<label id="${labelId}" class="${cn('mb-1 block text-xs ml-text-muted', this.getSlotClass('Label'))}">${unsafeHTML(labelText)}</label>`;
  }

  private renderInlineLabel(labelText: string, labelId: string): TemplateResult {
    if (!labelText) return html``;
    const labelClasses = [
      this.hasSlot('Prefix') ? 'left-10' : 'left-3',
      'absolute transition-all pointer-events-none top-1/2 -translate-y-1/2 text-sm ml-text-faint',
      this.getSlotClass('Label'),
    ].filter(Boolean).join(' ');
    return html`<label id="${labelId}" class="${labelClasses}">${unsafeHTML(labelText)}</label>`;
  }

  private renderPrefix(): TemplateResult {
    if (!this.hasSlot('Prefix')) return html``;
    return html`<div class="${cn('ml-text-muted', this.getSlotClass('Prefix'))}">${unsafeHTML(this.getSlotContent('Prefix'))}</div>`;
  }

  private renderSuffix(): TemplateResult {
    if (!this.hasSlot('Suffix') && !this.loading) return html``;
    return html`
<div class="${cn('flex items-center gap-2 ml-text-muted', this.getSlotClass('Suffix'))}">
${this.hasSlot('Suffix') ? unsafeHTML(this.getSlotContent('Suffix')) : html``}
${this.loading ? html`<span class="inline-block h-4 w-4 animate-spin rounded-full ml-spinner"></span>` : html``}
</div>`;
  }

  private renderFeedback(labelId: string): TemplateResult {
    if (!this.isEditing) return html``;
    if (this.error) {
      return html`<p id="${labelId}-error" class="mt-1 text-xs ml-error-text">${unsafeHTML(this.error)}</p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id="${labelId}-helper" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
    }
    return html``;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const labelText = this.hasSlot('Label') ? this.getSlotContent('Label') : '';
    const labelId = `${this.uid}-label`;

    // Sync rawValue on first render when value is already set
    if (!this.rawValue && this.value !== null && this.value !== undefined) {
      this.rawValue = this.formatToDisplay(this.value);
    }

    if (!this.isEditing) {
      const displayValue = this.value === null || this.value === undefined
        ? this.msg.empty
        : this.formatToDisplay(this.value);
      return html`
<div class="${cn('w-full', this.cssClass)}">
${labelText ? html`<div class="mb-1 text-sm ml-text-muted">${unsafeHTML(labelText)}</div>` : html``}
<div class="flex items-center gap-2 text-sm ml-text">
${this.renderPrefix()}
<span>${displayValue}</span>
${this.renderSuffix()}
</div>
</div>`;
    }

    const floating = this.isFocused || this.value !== null;
    const showFloatingLabel = Boolean(labelText) && floating;
    const showInlineLabel = Boolean(labelText) && !floating;
    const describedBy = this.error
      ? `${labelId}-error`
      : this.hasSlot('Helper') ? `${labelId}-helper` : undefined;

    return html`
<div class="${cn('w-full', this.cssClass)}">
<div class="min-h-[1rem]">
${showFloatingLabel ? this.renderFloatingLabel(labelText, labelId) : html``}
</div>
<div class="${this.getContainerClasses(showInlineLabel)}">
${showInlineLabel ? this.renderInlineLabel(labelText, labelId) : html``}
${this.renderPrefix()}
<input
class="${this.getInputClasses()}"
type="text"
inputmode="decimal"
.value="${this.rawValue}"
placeholder="${showInlineLabel ? '' : (this.placeholder || '')}"
name="${this.name}"
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${ifDefined(labelText ? labelId : undefined)}
aria-describedby=${ifDefined(describedBy)}
aria-invalid=${this.error ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@input=${this.handleInput}
@blur=${this.handleBlur}
@focus=${this.handleFocus}

@change="${(e: Event) => e.stopPropagation()}"
/>
${this.renderSuffix()}
</div>
${this.renderFeedback(labelId)}
</div>`;
  }
}
