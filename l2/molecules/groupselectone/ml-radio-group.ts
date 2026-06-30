/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-radio-group.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RADIO GROUP MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'No selection',
  noOptions: 'No options available',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Nenhuma seleção',
    noOptions: 'Nenhuma opção disponível',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**
interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
}
interface ParsedGroup {
  label: string;
  items: ParsedItem[];
}
@customElement('groupselectone--ml-radio-group')
export class MlRadioGroupMolecule extends MoleculeAuraElement {
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
  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private focusedValue: string | null = null;
  private labelId = `label-${Math.random().toString(36).slice(2, 9)}`;
  private errorId = `error-${Math.random().toString(36).slice(2, 9)}`;
  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
  }
  // ===========================================================================
  // PARSING HELPERS
  // ===========================================================================
  private parseItems(): ParsedItem[] {
    return this.getSlots('Item')
      .filter((el) => el.closest('Group') === null)
      .map((el) => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML.trim(),
        disabled: el.hasAttribute('disabled'),
      }));
  }
  private parseGroups(): ParsedGroup[] {
    const groupElements = this.getSlots('Group');
    return groupElements.map((groupEl) => {
      const groupLabel = groupEl.getAttribute('label') || '';
      const itemElements = Array.from(groupEl.querySelectorAll('Item'));
      const items: ParsedItem[] = itemElements.map((el) => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML.trim(),
        disabled: el.hasAttribute('disabled'),
      }));
      return { label: groupLabel, items };
    });
  }
  private getAllItems(): ParsedItem[] {
    const standaloneItems = this.parseItems();
    const groups = this.parseGroups();
    const groupedItems = groups.flatMap((g) => g.items);
    return [...standaloneItems, ...groupedItems];
  }
  private findItem(value: string | null): ParsedItem | undefined {
    if (value === null) return undefined;
    return this.getAllItems().find((item) => item.value === value);
  }
  private getSelectableItems(): ParsedItem[] {
    return this.getAllItems().filter((item) => !item.disabled);
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleSelect(item: ParsedItem) {
    if (this.disabled || this.readonly || this.loading || item.disabled) return;
    this.value = item.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }
  private handleFocus() {
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }
  private handleBlur() {
    this.focusedValue = null;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }
  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled || this.readonly || this.loading || !this.isEditing) return;
    const selectableItems = this.getSelectableItems();
    if (selectableItems.length === 0) return;
    const currentIndex = this.focusedValue
      ? selectableItems.findIndex((item) => item.value === this.focusedValue)
      : this.value
        ? selectableItems.findIndex((item) => item.value === this.value)
        : -1;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = currentIndex < selectableItems.length - 1 ? currentIndex + 1 : 0;
        this.focusedValue = selectableItems[nextIndex].value;
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : selectableItems.length - 1;
        this.focusedValue = selectableItems[prevIndex].value;
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (this.focusedValue) {
          const item = this.findItem(this.focusedValue);
          if (item && !item.disabled) {
            this.handleSelect(item);
          }
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        this.focusedValue = null;
        (this as HTMLElement).blur();
        break;
      }
    }
  };
  // ===========================================================================
  // CSS HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    return cn(
      'flex flex-col gap-2',
      this.disabled ? 'ml-disabled' : '',
    );
  }
  private getOptionClasses(item: ParsedItem): string {
    const isSelected = this.value === item.value;
    const isFocused = this.focusedValue === item.value;
    const hasError = this.error !== '';
    return cn(
      'flex items-center gap-3 px-3 py-2 transition-all cursor-pointer ml-radio-option',
      isSelected ? 'ml-radio-option-selected' : '',
      isFocused && !isSelected ? 'ml-radio-option-focused' : '',
      hasError && !isSelected ? 'ml-radio-option-error' : '',
      item.disabled ? 'ml-disabled' : '',
      this.disabled || this.readonly || this.loading ? 'cursor-not-allowed' : '',
      this.getSlotClass('Item'),
    );
  }
  private getRadioClasses(item: ParsedItem): string {
    const isSelected = this.value === item.value;
    return cn(
      'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ml-radio-dot',
      isSelected ? 'ml-radio-dot-selected' : '',
      item.disabled ? 'ml-disabled' : '',
    );
  }
  private getLabelTextClasses(item: ParsedItem): string {
    const isSelected = this.value === item.value;
    return cn(
      'text-sm transition-colors ml-text',
      isSelected ? 'font-medium ml-radio-label-selected' : '',
      item.disabled ? 'ml-text-muted' : '',
    );
  }
  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
<label
id=${this.labelId}
class="${cn('text-sm font-medium ml-label', this.getSlotClass('Label'))}"
>
${unsafeHTML(this.getSlotContent('Label'))}
${this.required
        ? html`<span class="ml-error-text ml-0.5">*</span>`
        : html``}
</label>
`;
  }
  private renderRadioIndicator(item: ParsedItem): TemplateResult {
    const isSelected = this.value === item.value;
    return html`
<span class=${this.getRadioClasses(item)}>
${isSelected
        ? html`<span class="w-2 h-2 rounded-full ml-radio-dot-inner"></span>`
        : html``}
</span>
`;
  }
  private renderOption(item: ParsedItem): TemplateResult {
    const isSelected = this.value === item.value;
    return html`
<div
role="radio"
aria-checked=${isSelected ? 'true' : 'false'}
aria-disabled=${item.disabled || this.disabled || this.readonly || this.loading
        ? 'true'
        : 'false'}
tabindex=${item.disabled || this.disabled || this.readonly || this.loading
        ? '-1'
        : '0'}
class=${this.getOptionClasses(item)}
@click=${() => this.handleSelect(item)}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
>
${this.renderRadioIndicator(item)}
<span class=${this.getLabelTextClasses(item)}>
${unsafeHTML(item.label)}
</span>
</div>
`;
  }
  private renderGroup(group: ParsedGroup): TemplateResult {
    if (group.items.length === 0) return html``;
    return html`
<div class="flex flex-col gap-1">
<span class="${cn('text-xs font-semibold uppercase tracking-wide px-1 ml-select-group-label', this.getSlotClass('Group'))}">
${group.label}
</span>
<div class="flex flex-col gap-1">
${group.items.map((item) => this.renderOption(item))}
</div>
</div>
`;
  }
  private renderRadioOptions(): TemplateResult {
    const standaloneItems = this.parseItems();
    const groups = this.parseGroups();
    const hasItems = standaloneItems.length > 0 || groups.some((g) => g.items.length > 0);
    if (!hasItems) {
      if (this.hasSlot('Empty')) {
        return html`
<div class="${cn('text-sm py-2 ml-text-muted', this.getSlotClass('Empty'))}">
${unsafeHTML(this.getSlotContent('Empty'))}
</div>
`;
      }
      return html`
<div class="text-sm py-2 ml-text-muted">
${this.msg.noOptions}
</div>
`;
    }
    return html`
<div
role="radiogroup"
aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
aria-required=${this.required ? 'true' : 'false'}
aria-invalid=${this.error ? 'true' : 'false'}
aria-describedby=${this.error ? this.errorId : ''}
class="flex flex-col gap-2"
>
${standaloneItems.map((item) => this.renderOption(item))}
${groups.map((group) => this.renderGroup(group))}
</div>
`;
  }
  private renderLoading(): TemplateResult {
    return html`
<div class="flex items-center gap-2 py-2">
<div class="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ml-spinner"></div>
<span class="text-sm ml-text-muted">${this.msg.loading}</span>
</div>
`;
  }
  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
<p
id=${this.errorId}
class="text-xs ml-error-text"
>
${unsafeHTML(this.error)}
</p>
`;
    }
    if (this.hasSlot('Helper')) {
      return html`
<p class="${cn('text-xs ml-helper', this.getSlotClass('Helper'))}">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
    }
    return html``;
  }
  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayText = selectedItem
      ? selectedItem.label
      : this.placeholder || this.msg.placeholder;
    return html`
<div class="flex flex-col gap-1">
${this.renderLabel()}
<span class="text-sm ml-text">
${selectedItem ? unsafeHTML(displayText) : displayText}
</span>
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
    return html`
<div class="${cn(this.getContainerClasses(), this.cssClass)}">
${this.renderLabel()}
${this.loading ? this.renderLoading() : this.renderRadioOptions()}
${this.renderFeedback()}
</div>
`;
  }
}
