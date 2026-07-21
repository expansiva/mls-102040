/// <mls fileReference="_102040_/l2/molecules/groupenternumberinterval/ml-number-range-slider.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML NUMBER RANGE SLIDER MOLECULE
// =============================================================================
// Skill Group: groupEnterNumberInterval
// Dual-handle horizontal range slider for selecting a numeric interval.
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  emptyValue: '—',
  rangeSeparator: '–',
  startHandle: 'Minimum value',
  endHandle: 'Maximum value',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    emptyValue: '—',
    rangeSeparator: '–',
    startHandle: 'Valor mínimo',
    endHandle: 'Valor máximo',
  },
};
/// **collab_i18n_end**

@customElement('groupenternumberinterval--ml-number-range-slider')
export class MlNumberRangeSliderMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================

  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — Data
  // ===========================================================================

  @propertyDataSource({ type: Number, attribute: 'start-value' })
  startValue: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'end-value' })
  endValue: number | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // ===========================================================================
  // PROPERTIES — Configuration
  // ===========================================================================

  @propertyDataSource({ type: Number })
  min: number | null = null;

  @propertyDataSource({ type: Number })
  max: number | null = null;

  @propertyDataSource({ type: Number })
  step: number = 1;

  @propertyDataSource({ type: Number })
  decimals: number = 0;

  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number, attribute: 'min-gap' })
  minGap: number = 0;

  @propertyDataSource({ type: Number, attribute: 'max-gap' })
  maxGap: number = 0;

  // ===========================================================================
  // PROPERTIES — States
  // ===========================================================================

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
  private activeHandle: string | null = null;

  @state()
  private focusedHandle: string | null = null;

  @state()
  private hasFocus = false;

  private trackEl: HTMLElement | null = null;
  private boundPointerMove: ((e: PointerEvent) => void) | null = null;
  private boundPointerUp: ((e: PointerEvent) => void) | null = null;
  private dragging = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  disconnectedCallback() {
    super.disconnectedCallback();
    this.teardownPointerListeners();
  }

  // ===========================================================================
  // BOUNDS HELPERS
  // ===========================================================================

  private getEffectiveMin(): number {
    return this.min !== null && this.min !== undefined ? Number(this.min) : 0;
  }

  private getEffectiveMax(): number {
    return this.max !== null && this.max !== undefined ? Number(this.max) : 100;
  }

  private getEffectiveStep(): number {
    const s = Number(this.step);
    return !s || s <= 0 ? 1 : s;
  }

  private getEffectiveDecimals(): number {
    const d = Number(this.decimals);
    return !d || d < 0 ? 0 : Math.floor(d);
  }

  private getEffectiveMinGap(): number {
    const g = Number(this.minGap);
    return !g || g < 0 ? 0 : g;
  }

  private getEffectiveMaxGap(): number {
    const g = Number(this.maxGap);
    return !g || g < 0 ? 0 : g;
  }

  private getRangeSpan(): number {
    const span = this.getEffectiveMax() - this.getEffectiveMin();
    return span <= 0 ? 1 : span;
  }

  private roundToDecimals(value: number): number {
    const d = this.getEffectiveDecimals();
    const factor = Math.pow(10, d);
    return Math.round(value * factor) / factor;
  }

  private snapToStep(value: number): number {
    const min = this.getEffectiveMin();
    const step = this.getEffectiveStep();
    const snapped = min + Math.round((value - min) / step) * step;
    return this.roundToDecimals(snapped);
  }

  private clampToBounds(value: number): number {
    let next = value;
    const min = this.getEffectiveMin();
    const max = this.getEffectiveMax();
    next = Math.max(next, min);
    next = Math.min(next, max);
    return this.roundToDecimals(next);
  }

  private clampPair(
    start: number,
    end: number,
    moving: 'start' | 'end' | 'both' = 'both'
  ): { start: number; end: number } {
    const minGap = this.getEffectiveMinGap();
    const maxGap = this.getEffectiveMaxGap();
    let s = this.clampToBounds(start);
    let e = this.clampToBounds(end);

    if (s > e) {
      if (moving === 'start') {
        s = e;
      } else if (moving === 'end') {
        e = s;
      } else {
        e = s;
      }
    }

    if (minGap > 0 && e - s < minGap) {
      if (moving === 'start') {
        s = this.clampToBounds(e - minGap);
        if (e - s < minGap) {
          e = this.clampToBounds(s + minGap);
        }
      } else if (moving === 'end') {
        e = this.clampToBounds(s + minGap);
        if (e - s < minGap) {
          s = this.clampToBounds(e - minGap);
        }
      } else {
        e = this.clampToBounds(s + minGap);
        if (e - s < minGap) {
          s = this.clampToBounds(e - minGap);
        }
      }
    }

    if (maxGap > 0 && e - s > maxGap) {
      if (moving === 'start') {
        s = this.clampToBounds(e - maxGap);
      } else if (moving === 'end') {
        e = this.clampToBounds(s + maxGap);
      } else {
        e = this.clampToBounds(s + maxGap);
      }
    }

    s = this.roundToDecimals(s);
    e = this.roundToDecimals(e);
    return { start: s, end: e };
  }

  private getResolvedStart(): number {
    if (this.startValue === null || this.startValue === undefined) {
      return this.getEffectiveMin();
    }
    return this.clampToBounds(Number(this.startValue));
  }

  private getResolvedEnd(): number {
    if (this.endValue === null || this.endValue === undefined) {
      return this.getEffectiveMax();
    }
    return this.clampToBounds(Number(this.endValue));
  }

  private valueToPercent(value: number): number {
    const min = this.getEffectiveMin();
    const span = this.getRangeSpan();
    const pct = ((value - min) / span) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  private percentToValue(percent: number): number {
    const min = this.getEffectiveMin();
    const span = this.getRangeSpan();
    const raw = min + (percent / 100) * span;
    return this.snapToStep(raw);
  }

  private clientXToPercent(clientX: number): number {
    if (!this.trackEl) return 0;
    const rect = this.trackEl.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  // ===========================================================================
  // FORMATTING
  // ===========================================================================

  private formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return this.msg.emptyValue;
    }
    const num = Number(value);
    const decimals = this.getEffectiveDecimals();
    const locale = this.locale && String(this.locale).trim() ? String(this.locale) : undefined;
    try {
      return num.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      return num.toFixed(decimals);
    }
  }

  private wrapWithAffixes(formatted: string): string {
    const prefix = this.getSlotContent('Prefix') || '';
    const suffix = this.getSlotContent('Suffix') || '';
    return `${prefix}${formatted}${suffix}`;
  }

  private formatBound(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return this.msg.emptyValue;
    }
    return this.wrapWithAffixes(this.formatNumber(value));
  }

  private formatIntervalText(): string {
    const hasStart = this.startValue !== null && this.startValue !== undefined;
    const hasEnd = this.endValue !== null && this.endValue !== undefined;
    const sep = ` ${this.msg.rangeSeparator} `;

    if (!hasStart && !hasEnd) {
      return this.msg.emptyValue;
    }
    if (hasStart && !hasEnd) {
      return `${this.formatBound(this.startValue)}${sep}${this.msg.emptyValue}`;
    }
    if (!hasStart && hasEnd) {
      return `${this.msg.emptyValue}${sep}${this.formatBound(this.endValue)}`;
    }
    return `${this.formatBound(this.startValue)}${sep}${this.formatBound(this.endValue)}`;
  }

  // ===========================================================================
  // INTERACTION GUARDS
  // ===========================================================================

  private isInteractive(): boolean {
    return (
      !!this.isEditing &&
      !this.disabled &&
      !this.readonly &&
      !this.loading
    );
  }

  private hasError(): boolean {
    if (this.error && String(this.error).trim()) return true;
    if (this.required) {
      const missingStart = this.startValue === null || this.startValue === undefined;
      const missingEnd = this.endValue === null || this.endValue === undefined;
      return missingStart || missingEnd;
    }
    return false;
  }

  // ===========================================================================
  // VALUE COMMIT
  // ===========================================================================

  private applyPair(
    start: number,
    end: number,
    moving: 'start' | 'end' | 'both',
    emitInput: boolean
  ) {
    const pair = this.clampPair(start, end, moving);
    this.startValue = pair.start;
    this.endValue = pair.end;
    if (emitInput) {
      this.emitInput();
    }
  }

  private emitInput() {
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: {
          startValue: this.startValue,
          endValue: this.endValue,
        },
      })
    );
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          startValue: this.startValue,
          endValue: this.endValue,
        },
      })
    );
  }

  private emitFocus() {
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private emitBlur() {
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  // ===========================================================================
  // POINTER HANDLERS
  // ===========================================================================

  private teardownPointerListeners() {
    if (this.boundPointerMove) {
      window.removeEventListener('pointermove', this.boundPointerMove);
      this.boundPointerMove = null;
    }
    if (this.boundPointerUp) {
      window.removeEventListener('pointerup', this.boundPointerUp);
      window.removeEventListener('pointercancel', this.boundPointerUp);
      this.boundPointerUp = null;
    }
    this.dragging = false;
  }

  private handleHandlePointerDown(e: PointerEvent, handle: 'start' | 'end') {
    if (!this.isInteractive()) return;
    e.preventDefault();
    e.stopPropagation();

    this.trackEl = (e.currentTarget as HTMLElement).closest('.ml-nrs-track-area') as HTMLElement
      || this.renderRoot?.querySelector?.('.ml-nrs-track-area') as HTMLElement
      || this.querySelector('.ml-nrs-track-area');

    this.activeHandle = handle;
    this.focusedHandle = handle;
    this.dragging = true;

    if (!this.hasFocus) {
      this.hasFocus = true;
      this.emitFocus();
    }

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // ignore capture errors
    }

    this.boundPointerMove = (ev: PointerEvent) => this.handlePointerMove(ev);
    this.boundPointerUp = (ev: PointerEvent) => this.handlePointerUp(ev);
    window.addEventListener('pointermove', this.boundPointerMove);
    window.addEventListener('pointerup', this.boundPointerUp);
    window.addEventListener('pointercancel', this.boundPointerUp);

    this.requestUpdate();
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.dragging || !this.activeHandle || !this.isInteractive()) return;
    e.preventDefault();

    const pct = this.clientXToPercent(e.clientX);
    const nextVal = this.percentToValue(pct);
    const currentStart = this.getResolvedStart();
    const currentEnd = this.getResolvedEnd();

    if (this.activeHandle === 'start') {
      this.applyPair(nextVal, currentEnd, 'start', true);
    } else {
      this.applyPair(currentStart, nextVal, 'end', true);
    }
  }

  private handlePointerUp(_e: PointerEvent) {
    if (!this.dragging) return;
    this.teardownPointerListeners();
    this.activeHandle = null;
    this.emitChange();
    this.requestUpdate();
  }

  private handleTrackPointerDown(e: PointerEvent) {
    if (!this.isInteractive()) return;

    const target = e.target as HTMLElement;
    if (target.closest('.ml-nrs-handle')) return;

    e.preventDefault();
    this.trackEl = e.currentTarget as HTMLElement;

    const pct = this.clientXToPercent(e.clientX);
    const clickVal = this.percentToValue(pct);
    const currentStart = this.getResolvedStart();
    const currentEnd = this.getResolvedEnd();

    // Ignore clicks on the selected segment between handles
    if (clickVal > currentStart && clickVal < currentEnd) {
      return;
    }

    const distStart = Math.abs(clickVal - currentStart);
    const distEnd = Math.abs(clickVal - currentEnd);
    const moving: 'start' | 'end' = distStart <= distEnd ? 'start' : 'end';

    this.activeHandle = moving;
    this.focusedHandle = moving;
    this.dragging = true;

    if (!this.hasFocus) {
      this.hasFocus = true;
      this.emitFocus();
    }

    if (moving === 'start') {
      this.applyPair(clickVal, currentEnd, 'start', true);
    } else {
      this.applyPair(currentStart, clickVal, 'end', true);
    }

    this.boundPointerMove = (ev: PointerEvent) => this.handlePointerMove(ev);
    this.boundPointerUp = (ev: PointerEvent) => this.handlePointerUp(ev);
    window.addEventListener('pointermove', this.boundPointerMove);
    window.addEventListener('pointerup', this.boundPointerUp);
    window.addEventListener('pointercancel', this.boundPointerUp);

    this.requestUpdate();
  }

  // ===========================================================================
  // KEYBOARD HANDLERS
  // ===========================================================================

  private handleHandleKeyDown(e: KeyboardEvent, handle: 'start' | 'end') {
    if (!this.isInteractive()) return;

    const step = this.getEffectiveStep();
    const min = this.getEffectiveMin();
    const max = this.getEffectiveMax();
    const currentStart = this.getResolvedStart();
    const currentEnd = this.getResolvedEnd();
    let nextStart = currentStart;
    let nextEnd = currentEnd;
    let handled = false;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown': {
        handled = true;
        if (handle === 'start') {
          nextStart = currentStart - step;
        } else {
          nextEnd = currentEnd - step;
        }
        break;
      }
      case 'ArrowRight':
      case 'ArrowUp': {
        handled = true;
        if (handle === 'start') {
          nextStart = currentStart + step;
        } else {
          nextEnd = currentEnd + step;
        }
        break;
      }
      case 'Home': {
        handled = true;
        if (handle === 'start') {
          nextStart = min;
        } else {
          nextEnd = min;
        }
        break;
      }
      case 'End': {
        handled = true;
        if (handle === 'start') {
          nextStart = max;
        } else {
          nextEnd = max;
        }
        break;
      }
      default:
        break;
    }

    if (!handled) return;
    e.preventDefault();
    e.stopPropagation();

    nextStart = this.snapToStep(nextStart);
    nextEnd = this.snapToStep(nextEnd);
    this.applyPair(nextStart, nextEnd, handle, true);
    this.emitChange();
  }

  private handleHandleFocus(handle: 'start' | 'end') {
    if (!this.isInteractive()) return;
    this.focusedHandle = handle;
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.emitFocus();
    }
    this.requestUpdate();
  }

  private handleHandleBlur(e: FocusEvent) {
    const related = e.relatedTarget as Node | null;
    const root = e.currentTarget as HTMLElement;
    const container = root.closest('.ml-nrs-root') || this;

    // Defer to allow focus to move to the other handle
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && container.contains(active)) {
        return;
      }
      if (related && container.contains(related)) {
        return;
      }
      this.focusedHandle = null;
      this.activeHandle = null;
      if (this.hasFocus) {
        this.hasFocus = false;
        this.emitBlur();
      }
      this.requestUpdate();
    });
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================

  private getRootClasses(): string {
    return [
      'flex w-full flex-col gap-1',
      'ml-nrs-root',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'ml-nrs-readonly' : '',
      this.loading ? 'ml-nrs-loading' : '',
      this.hasError() && this.isEditing ? 'ml-nrs-error' : '',
      !this.isEditing ? 'ml-nrs-view' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTrackClasses(): string {
    return [
      'relative w-full flex items-center',
      'ml-nrs-track-area',
      this.isInteractive() ? 'cursor-pointer' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getHandleClasses(handle: 'start' | 'end'): string {
    const isActive = this.activeHandle === handle;
    const isFocused = this.focusedHandle === handle;
    return [
      'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
      'flex items-center justify-center',
      'ml-nrs-handle',
      handle === 'start' ? 'ml-nrs-handle-start' : 'ml-nrs-handle-end',
      isActive ? 'ml-nrs-handle-active' : '',
      isFocused ? 'ml-nrs-handle-focused' : '',
      this.isInteractive() ? 'cursor-grab' : '',
      isActive && this.isInteractive() ? 'cursor-grabbing' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div class="${cn('mb-1 text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderSubLabels(): TemplateResult {
    const hasStart = this.hasSlot('LabelStart');
    const hasEnd = this.hasSlot('LabelEnd');
    if (!hasStart && !hasEnd) return html``;

    return html`
      <div class="mb-1 flex w-full items-center justify-between gap-2">
        ${hasStart
          ? html`
              <span class="${cn('text-xs ml-text-muted', this.getSlotClass('LabelStart'))}">
                ${unsafeHTML(this.getSlotContent('LabelStart'))}
              </span>
            `
          : html`<span></span>`}
        ${hasEnd
          ? html`
              <span class="${cn('text-xs ml-text-muted', this.getSlotClass('LabelEnd'))}">
                ${unsafeHTML(this.getSlotContent('LabelEnd'))}
              </span>
            `
          : html`<span></span>`}
      </div>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (!this.isEditing) return html``;

    if (this.hasError() && this.error && String(this.error).trim()) {
      return html`
        <p class="${cn('mt-1 text-xs ml-error-text')}" id="nrs-error" role="alert">
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}" id="nrs-helper">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  private renderTooltip(handle: 'start' | 'end', value: number): TemplateResult {
    const show =
      this.activeHandle === handle || this.focusedHandle === handle;
    if (!show) return html``;

    return html`
      <div class="ml-nrs-tooltip" aria-hidden="true">
        ${unsafeHTML(this.formatBound(value))}
      </div>
    `;
  }

  private renderHandle(
    handle: 'start' | 'end',
    value: number,
    percent: number
  ): TemplateResult {
    const label =
      handle === 'start'
        ? this.getSlotContent('LabelStart') || this.msg.startHandle
        : this.getSlotContent('LabelEnd') || this.msg.endHandle;

    const describedBy = this.hasError() && this.error && String(this.error).trim()
      ? 'nrs-error'
      : this.hasSlot('Helper')
        ? 'nrs-helper'
        : nothingAttr();

    return html`
      <div
        class="${this.getHandleClasses(handle)}"
        style="left: ${percent}%;"
        role="slider"
        tabindex="${this.isInteractive() ? 0 : -1}"
        aria-label="${label.replace(/<[^>]*>/g, '').trim() || (handle === 'start' ? this.msg.startHandle : this.msg.endHandle)}"
        aria-valuemin="${this.getEffectiveMin()}"
        aria-valuemax="${this.getEffectiveMax()}"
        aria-valuenow="${value}"
        aria-valuetext="${this.formatNumber(value)}"
        aria-disabled="${this.disabled ? 'true' : 'false'}"
        aria-readonly="${this.readonly ? 'true' : 'false'}"
        aria-required="${this.required ? 'true' : 'false'}"
        aria-invalid="${this.hasError() ? 'true' : 'false'}"
        aria-describedby="${describedBy}"
        @pointerdown=${(e: PointerEvent) => this.handleHandlePointerDown(e, handle)}
        @keydown=${(e: KeyboardEvent) => this.handleHandleKeyDown(e, handle)}
        @focus=${() => this.handleHandleFocus(handle)}
        @blur=${(e: FocusEvent) => this.handleHandleBlur(e)}
      >
        ${this.renderTooltip(handle, value)}
        <span class="ml-nrs-handle-knob"></span>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    return html`
      <div class="${cn(this.getRootClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="ml-nrs-view-value ml-text">
          ${unsafeHTML(this.formatIntervalText())}
        </div>
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="${cn(this.getRootClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="flex w-full flex-col gap-2 ml-nrs-loading-block" aria-busy="true">
          <div class="flex items-center gap-2">
            <span class="ml-spinner" aria-hidden="true"></span>
            <span class="text-sm ml-text-muted">${this.msg.loading}</span>
          </div>
          <div class="w-full ml-skeleton ml-nrs-skeleton-track"></div>
        </div>
      </div>
    `;
  }

  private renderPlaceholderHint(): TemplateResult {
    const hasStart = this.startValue !== null && this.startValue !== undefined;
    const hasEnd = this.endValue !== null && this.endValue !== undefined;
    if (hasStart || hasEnd) return html``;
    if (!this.placeholder || !String(this.placeholder).trim()) return html``;

    return html`
      <div class="mb-1 text-xs ml-text-faint ml-nrs-placeholder">
        ${this.placeholder}
      </div>
    `;
  }

  private renderValueReadout(): TemplateResult {
    return html`
      <div class="mt-2 flex w-full items-center justify-between gap-2 text-xs ml-nrs-readout">
        <span class="ml-text">${unsafeHTML(this.formatBound(this.startValue))}</span>
        <span class="ml-text-faint">${this.msg.rangeSeparator}</span>
        <span class="ml-text">${unsafeHTML(this.formatBound(this.endValue))}</span>
      </div>
    `;
  }

  private renderSlider(): TemplateResult {
    const start = this.getResolvedStart();
    const end = this.getResolvedEnd();
    const startPct = this.valueToPercent(start);
    const endPct = this.valueToPercent(end);

    return html`
      <div
        class="${this.getTrackClasses()}"
        @pointerdown=${(e: PointerEvent) => this.handleTrackPointerDown(e)}
      >
        <div class="relative w-full ml-nrs-track">
          <div class="ml-nrs-track-base"></div>
          <div
            class="ml-nrs-track-fill"
            style="left: ${startPct}%; width: ${Math.max(0, endPct - startPct)}%;"
          ></div>
          ${this.renderHandle('start', start, startPct)}
          ${this.renderHandle('end', end, endPct)}
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    if (this.loading) {
      return this.renderLoading();
    }

    return html`
      <div
        class="${cn(this.getRootClasses(), this.cssClass)}"
        data-name="${this.name || ''}"
      >
        ${this.renderLabel()}
        ${this.renderSubLabels()}
        ${this.renderPlaceholderHint()}
        ${this.renderSlider()}
        ${this.renderValueReadout()}
        ${this.renderFeedback()}
      </div>
    `;
  }
}

function nothingAttr(): string {
  return '';
}
