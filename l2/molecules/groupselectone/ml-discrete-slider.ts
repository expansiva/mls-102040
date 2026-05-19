/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-discrete-slider.ts" enhancement="_102020_/l2/enhancementAura"/>

// =============================================================================
// DISCRETE SLIDER MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noSelection: '—',
  loading: 'Loading...',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    noSelection: '—',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
  group?: string;
}

interface ParsedGroup {
  label: string;
  startIndex: number;
  endIndex: number;
}

@customElement('groupselectone--ml-discrete-slider')
export class MlDiscreteSliderMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

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

  @propertyDataSource({ type: Boolean, attribute: 'fill-previous' })
  fillPrevious: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private isActive: boolean = false;

  @state()
  private focusedIndex: number = -1;

  @state()
  private isDragging: boolean = false;

  @state()
  private dragRatio: number = 0;

  @state()
  private parsedItems: ParsedItem[] = [];

  @state()
  private parsedGroups: ParsedGroup[] = [];

  private boundHandleOutsideClick = this.handleOutsideClick.bind(this);
  private boundHandleKeydown = this.handleKeydown.bind(this);

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.boundHandleOutsideClick);
    document.addEventListener('keydown', this.boundHandleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.boundHandleOutsideClick);
    document.removeEventListener('keydown', this.boundHandleKeydown);
  }

  firstUpdated() {
    this.parseSlotContent();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      this.updateFocusedIndexFromValue();
    }
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseSlotContent() {
    const items: ParsedItem[] = [];
    const groups: ParsedGroup[] = [];
    let currentGroup: string | undefined;
    let groupStartIndex = 0;

    const groupElements = this.getSlots('Group');
    const itemElements = this.getSlots('Item');

    // Parse groups and their items
    groupElements.forEach((groupEl) => {
      const groupLabel = groupEl.getAttribute('label') || '';
      const groupItems = Array.from(groupEl.querySelectorAll('Item'));
      
      if (groupItems.length > 0) {
        groupStartIndex = items.length;
        groupItems.forEach((itemEl) => {
          const itemValue = itemEl.getAttribute('value');
          if (itemValue) {
            items.push({
              value: itemValue,
              label: itemEl.innerHTML.trim(),
              disabled: itemEl.hasAttribute('disabled'),
              group: groupLabel,
            });
          }
        });
        groups.push({
          label: groupLabel,
          startIndex: groupStartIndex,
          endIndex: items.length - 1,
        });
      }
    });

    // Parse standalone items
    itemElements.forEach((itemEl) => {
      const itemValue = itemEl.getAttribute('value');
      if (itemValue) {
        items.push({
          value: itemValue,
          label: itemEl.innerHTML.trim(),
          disabled: itemEl.hasAttribute('disabled'),
        });
      }
    });

    // Limit to 7 items max
    this.parsedItems = items.slice(0, 7);
    this.parsedGroups = groups.filter(g => g.endIndex < 7);
    this.updateFocusedIndexFromValue();
  }

  private updateFocusedIndexFromValue() {
    if (this.isDragging) return;
    if (this.value !== null) {
      const index = this.parsedItems.findIndex(item => item.value === this.value);
      this.focusedIndex = index >= 0 ? index : -1;
    } else {
      this.focusedIndex = -1;
    }
  }

  private findItem(value: string | null): ParsedItem | undefined {
    if (value === null) return undefined;
    return this.parsedItems.find(item => item.value === value);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleOutsideClick(e: MouseEvent) {
    if (!this.isActive) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.isActive = false;
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.isActive || !this.isEditing) return;
    if (this.disabled || this.readonly || this.loading) return;

    const enabledIndices = this.parsedItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled)
      .map(({ index }) => index);

    if (enabledIndices.length === 0) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(this.focusedIndex);
        const nextPos = currentPos < enabledIndices.length - 1 ? currentPos + 1 : 0;
        this.focusedIndex = enabledIndices[nextPos >= 0 ? nextPos : 0];
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(this.focusedIndex);
        const prevPos = currentPos > 0 ? currentPos - 1 : enabledIndices.length - 1;
        this.focusedIndex = enabledIndices[prevPos];
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (this.focusedIndex >= 0 && !this.parsedItems[this.focusedIndex]?.disabled) {
          this.selectItem(this.parsedItems[this.focusedIndex].value);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        this.isActive = false;
        this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
        break;
      }
    }
  }

  private handleTrackClick(e: MouseEvent) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    if (this.parsedItems.length < 2) return;
    if ((e.target as HTMLElement).closest('button')) return;

    if (!this.isActive) {
      this.isActive = true;
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    }

    const index = this.getIndexFromPointerX(e.clientX);
    if (index >= 0 && !this.parsedItems[index]?.disabled) {
      this.selectItem(this.parsedItems[index].value);
    }
  }

  private handleStopPointerDown(index: number, e: PointerEvent) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    if (this.parsedItems[index]?.disabled) return;

    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    this.isDragging = true;
    this.focusedIndex = index;
    this.dragRatio = this.calculateStopPosition(index) / 100;

    if (!this.isActive) {
      this.isActive = true;
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    }
  }

  private handleDragPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;
    e.preventDefault();

    const track = (this.renderRoot as ShadowRoot | HTMLElement).querySelector('[data-track]') as HTMLElement | null;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.dragRatio = ratio;

    const index = Math.round(ratio * (this.parsedItems.length - 1));
    if (index >= 0 && !this.parsedItems[index]?.disabled) {
      this.focusedIndex = index;
    }
  }

  private handleDragPointerUp(_e: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.focusedIndex >= 0 && !this.parsedItems[this.focusedIndex]?.disabled) {
      this.selectItem(this.parsedItems[this.focusedIndex].value);
    }
  }

  private selectItem(value: string) {
    this.value = value;
    this.isActive = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].filter(Boolean).join(' ');
  }

  private getSliderTrackClasses(): string {
    return [
      'relative w-full h-2 rounded-full transition-colors',
      'bg-slate-200 dark:bg-slate-700',
      this.error ? 'bg-red-200 dark:bg-red-900/40' : '',
      !this.disabled && !this.readonly && !this.loading && this.isEditing
        ? 'cursor-pointer'
        : '',
    ].filter(Boolean).join(' ');
  }

  private getStopClasses(index: number, isSelected: boolean, isPending: boolean, isPassed: boolean): string {
    const item = this.parsedItems[index];
    const isFocused = this.focusedIndex === index && this.isActive && !this.isDragging;
    const isBlue = isSelected || isPending || isPassed;

    return [
      'absolute -translate-y-1/2 -translate-x-1/2',
      'w-4 h-4 rounded-full border-2 touch-none',
      !this.isDragging ? 'transition-all' : '',
      isBlue
        ? 'bg-sky-500 dark:bg-sky-400 border-sky-500 dark:border-sky-400'
        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
      isSelected || isPending ? 'scale-125' : '',
      isFocused && !isBlue
        ? 'ring-2 ring-sky-500 dark:ring-sky-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
        : '',
      item?.disabled
        ? 'opacity-50 cursor-not-allowed'
        : !this.disabled && !this.readonly && !this.loading && this.isEditing
          ? 'cursor-grab hover:scale-110'
          : '',
    ].filter(Boolean).join(' ');
  }

  private getLabelClasses(index: number, isActiveStop: boolean): string {
    const item = this.parsedItems[index];

    return [
      'absolute top-6 -translate-x-1/2 text-xs text-center whitespace-nowrap transition-colors',
      isActiveStop
        ? 'text-sky-700 dark:text-sky-300 font-medium'
        : 'text-slate-600 dark:text-slate-400',
      item?.disabled ? 'opacity-50' : '',
    ].filter(Boolean).join(' ');
  }

  private getIndicatorClasses(): string {
    return [
      'absolute -top-8 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium transition-all',
      'bg-sky-500 dark:bg-sky-400 text-white dark:text-slate-900',
      'after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2',
      'after:border-4 after:border-transparent after:border-t-sky-500 dark:after:border-t-sky-400',
    ].join(' ');
  }

  private getGroupLabelClasses(): string {
    return [
      'absolute -bottom-8 text-xs font-medium text-center',
      'text-slate-500 dark:text-slate-400',
    ].join(' ');
  }

  private calculateStopPosition(index: number): number {
    if (this.parsedItems.length <= 1) return 50;
    return (index / (this.parsedItems.length - 1)) * 100;
  }

  private getIndexFromPointerX(clientX: number): number {
    const track = (this.renderRoot as ShadowRoot | HTMLElement).querySelector('[data-track]') as HTMLElement | null;
    if (!track || this.parsedItems.length < 2) return -1;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (this.parsedItems.length - 1));
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    // Parse slot content on each render to catch dynamic changes
    this.parseSlotContent();

    // View mode
    if (!this.isEditing) {
      return this.renderViewMode();
    }

    // Not enough items
    if (this.parsedItems.length < 2) {
      return this.renderEmptyState();
    }

    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}
        ${this.renderSlider()}
        ${this.renderFeedback()}
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayText = selectedItem
      ? selectedItem.label
      : (this.placeholder || this.msg.noSelection);

    return html`
      <div class="text-slate-900 dark:text-slate-100">
        ${unsafeHTML(displayText)}
      </div>
    `;
  }

  private renderEmptyState(): TemplateResult {
    if (this.hasSlot('Empty')) {
      return html`
        <div class="text-slate-500 dark:text-slate-400 text-sm">
          ${unsafeHTML(this.getSlotContent('Empty'))}
        </div>
      `;
    }
    return html``;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label
        id="slider-label"
        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3"
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="text-red-500 dark:text-red-400 ml-1">*</span>` : html``}
      </label>
    `;
  }

  private renderSlider(): TemplateResult {
    const selectedIndex = this.value !== null
      ? this.parsedItems.findIndex(item => item.value === this.value)
      : -1;

    const activeIndex = this.isDragging ? this.focusedIndex : selectedIndex;

    // Visual position: continuous during drag, discrete otherwise
    const visualPos = this.isDragging
      ? this.dragRatio * 100
      : (activeIndex >= 0 ? this.calculateStopPosition(activeIndex) : -1);

    return html`
      <div
        class="relative pt-10 pb-12"
        role="slider"
        aria-labelledby=${this.hasSlot('Label') ? 'slider-label' : ''}
        aria-valuemin="0"
        aria-valuemax=${this.parsedItems.length - 1}
        aria-valuenow=${selectedIndex >= 0 ? selectedIndex : ''}
        aria-valuetext=${selectedIndex >= 0 ? this.parsedItems[selectedIndex]?.label : ''}
        aria-required=${this.required}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${this.error ? 'slider-error' : this.hasSlot('Helper') ? 'slider-helper' : ''}
        tabindex=${this.disabled || this.readonly || this.loading ? -1 : 0}
        @focus=${() => !this.isActive && this.isEditing && !this.disabled && !this.readonly && !this.loading && (this.isActive = true)}
        @pointermove=${this.handleDragPointerMove}
        @pointerup=${this.handleDragPointerUp}
        @pointercancel=${this.handleDragPointerUp}
      >
        ${this.renderIndicator(activeIndex, visualPos)}
        <div class=${this.getSliderTrackClasses()} data-track @click=${this.handleTrackClick}>
          ${this.renderFilledTrack(visualPos)}
          ${this.isDragging ? this.renderDragThumb(visualPos) : html``}
          ${this.parsedItems.map((_item, index) => this.renderStop(index, activeIndex, selectedIndex))}
        </div>
        ${this.renderGroupLabels()}
      </div>
    `;
  }

  private renderIndicator(activeIndex: number, visualPos: number): TemplateResult {
    if (this.loading) {
      return html`
        <div
          class="absolute left-1/2 -top-2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
        >
          ${this.msg.loading}
        </div>
      `;
    }

    if (activeIndex < 0) {
      const triggerContent = this.hasSlot('Trigger')
        ? this.getSlotContent('Trigger')
        : (this.placeholder || this.msg.placeholder);

      return html`
        <div
          class="absolute left-1/2 -top-2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
        >
          ${unsafeHTML(triggerContent)}
        </div>
      `;
    }

    const activeItem = this.parsedItems[activeIndex];

    return html`
      <div
        class=${this.getIndicatorClasses()}
        style="left: ${visualPos >= 0 ? visualPos : this.calculateStopPosition(activeIndex)}%"
      >
        ${unsafeHTML(activeItem.label)}
      </div>
    `;
  }

  private renderFilledTrack(visualPos: number): TemplateResult {
    if (visualPos < 0) return html``;

    return html`
      <div
        class="absolute top-0 left-0 h-full rounded-full bg-sky-500 dark:bg-sky-400 pointer-events-none ${this.isDragging ? '' : 'transition-all'}"
        style="width: ${visualPos}%"
      ></div>
    `;
  }

  private renderDragThumb(visualPos: number): TemplateResult {
    return html`
      <div
        class="absolute top-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 scale-150 pointer-events-none z-10 bg-sky-500 dark:bg-sky-400 border-2 border-sky-500 dark:border-sky-400 shadow-[0_0_0_9px_rgba(14,165,233,0.18)]"
        style="left: ${visualPos}%"
      ></div>
    `;
  }

  private renderStop(index: number, activeIndex: number, selectedIndex: number): TemplateResult {
    const position = this.calculateStopPosition(index);
    const item = this.parsedItems[index];
    const isSelected = index === selectedIndex;
    const isPending = this.isDragging && index === activeIndex;
    const isPassed = this.fillPrevious && !item.disabled && activeIndex >= 0 && index < activeIndex;

    return html`
      <div
        class="absolute top-1/2"
        style="left: ${position}%"
      >
        <button
          type="button"
          class=${this.getStopClasses(index, isSelected, isPending, isPassed)}
          role="option"
          aria-selected=${isSelected}
          aria-disabled=${item.disabled}
          tabindex="-1"
          @pointerdown=${(e: PointerEvent) => this.handleStopPointerDown(index, e)}
        ></button>
        <span class=${this.getLabelClasses(index, index === activeIndex)}>
          ${unsafeHTML(item.label)}
        </span>
      </div>
    `;
  }

  private renderGroupLabels(): TemplateResult {
    if (this.parsedGroups.length === 0) return html``;

    return html`
      ${this.parsedGroups.map(group => {
        const startPos = this.calculateStopPosition(group.startIndex);
        const endPos = this.calculateStopPosition(group.endIndex);
        const centerPos = (startPos + endPos) / 2;
        const width = endPos - startPos;

        return html`
          <div
            class=${this.getGroupLabelClasses()}
            style="left: ${centerPos}%; width: ${width}%; transform: translateX(-50%)"
          >
            ${group.label}
          </div>
        `;
      })}
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
        <p id="slider-error" class="mt-2 text-xs text-red-600 dark:text-red-400">
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p id="slider-helper" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }
}
