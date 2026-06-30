/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SELECT ONE AUTOCOMPLETE MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.
import { html, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
    placeholder: 'Type to search',
    noResults: 'No results found',
    loading: 'Loading...',
    required: 'Selection required',
    clear: 'Clear selection',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
    en: message_en,
    pt: {
        placeholder: 'Digite para pesquisar',
        noResults: 'Nenhum resultado encontrado',
        loading: 'Carregando...',
        required: 'Seleção obrigatória',
        clear: 'Limpar seleção',
    },
};
/// **collab_i18n_end**

type ParsedItem = {
    value: string;
    label: string;
    labelText: string;
    disabled: boolean;
};

type ParsedGroup = {
    label: string;
    items: ParsedItem[];
};

@customElement('groupselectone--ml-select-one-autocomplete')
export class SelectOneAutocompleteMolecule extends MoleculeAuraElement {
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
    error = '';

    @propertyDataSource({ type: String })
    name = '';

    @propertyDataSource({ type: String })
    placeholder = '';

    @propertyDataSource({ type: Boolean, attribute: 'searchable' })
    searchable = true;

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

    @propertyDataSource({ type: Boolean, attribute: 'clearable' })
    clearable = false;
    // ===========================================================================
    // INTERNAL STATE
    // ===========================================================================
    @state()
    private isOpen = false;

    @state()
    private searchQuery = '';

    @state()
    private highlightedIndex = -1;

    private labelId = `mlso-label-${Math.random().toString(36).slice(2, 8)}`;
    private inputId = `mlso-input-${Math.random().toString(36).slice(2, 8)}`;
    private listId = `mlso-list-${Math.random().toString(36).slice(2, 8)}`;
    private errorId = `mlso-error-${Math.random().toString(36).slice(2, 8)}`;
    private helperId = `mlso-helper-${Math.random().toString(36).slice(2, 8)}`;

    // ===========================================================================
    // LIFECYCLE
    // ===========================================================================
    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleDocumentClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleDocumentClick);
    }

    firstUpdated() {
        this.searchQuery = this.getLabelByValue(this.value) || '';
    }

    updated(changedProps: Map<string, unknown>) {
        if (changedProps.has('value')) {
            if (!this.value) {
                this.searchQuery = '';
            } else {
                const label = this.getLabelByValue(this.value);
                if (label) this.searchQuery = label;
            }
        }
    }

    // ===========================================================================
    // STATE CHANGE HANDLER
    // ===========================================================================
    handleIcaStateChange(key: string, value: any) {
        const valueAttr = this.getAttribute('value');
        if (valueAttr === `{{${key}}}`) {
            this.searchQuery = this.getLabelByValue(value) || '';
            this.highlightedIndex = -1;
        }
        this.requestUpdate();
    }

    // ===========================================================================
    // EVENT HANDLERS
    // ===========================================================================
    private handleDocumentClick = (event: MouseEvent) => {
        if (!this.contains(event.target as Node)) {
            this.closePanel();
        }
    };

    private handleInputFocus() {
        if (this.disabled || this.readonly || this.loading) return;
        this.openPanel();
        this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    }

    private handleFocusOut(event: FocusEvent) {
        const nextTarget = event.relatedTarget as Node | null;
        if (!nextTarget || !this.contains(nextTarget)) {
            this.closePanel();
            this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
        }
    }

    private handleInput(event: Event) {
        if (this.disabled || this.readonly || this.loading) return;
        if (!this.searchable) return;
        const input = event.target as HTMLInputElement;
        this.searchQuery = input.value;
        this.openPanel();
        this.highlightedIndex = this.getFilteredItems().length > 0 ? 0 : -1;
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (this.disabled || this.readonly || this.loading) return;
        const items = this.getFilteredItems();
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!this.isOpen) this.openPanel();
            this.highlightedIndex = Math.min(items.length - 1, this.highlightedIndex + 1);
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!this.isOpen) this.openPanel();
            this.highlightedIndex = Math.max(0, this.highlightedIndex - 1);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            const item = items[this.highlightedIndex];
            if (item && !item.disabled) {
                this.applySelection(item);
            }
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            this.closePanel();
        }
    }

    private handleItemSelect(item: ParsedItem) {
        if (item.disabled || this.disabled || this.readonly || this.loading) return;
        this.applySelection(item);
    }

    private handleClear(event: Event) {
        event.stopPropagation();
        if (this.disabled || this.readonly || this.loading) return;
        this.value = null;
        this.searchQuery = '';
        this.highlightedIndex = -1;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }

    private handleMouseDown(event: MouseEvent) {
        if (this.disabled || this.readonly || this.loading) {
            event.preventDefault();
        }
    }

    // ===========================================================================
    // HELPERS
    // ===========================================================================
    private openPanel() {
        if (this.disabled || this.readonly || this.loading) return;
        this.isOpen = true;
    }

    private closePanel() {
        this.isOpen = false;
        this.highlightedIndex = -1;
    }

    private applySelection(item: ParsedItem) {
        this.value = item.value;
        this.searchQuery = item.labelText;
        this.closePanel();
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: this.value },
        }));
    }

    private parseItem(el: Element): ParsedItem {
        return {
            value: el.getAttribute('value') || '',
            label: el.innerHTML,
            labelText: (el.textContent || '').trim(),
            disabled: el.hasAttribute('disabled'),
        };
    }

    private getParsedData() {
        const itemSlots = this.getSlots('Item');
        const groupSlots = this.getSlots('Group');

        const standaloneItems = itemSlots
            .filter((el) => !el.closest('Group'))
            .map((el) => this.parseItem(el));

        const groups = groupSlots.map((group) => {
            const label = group.getAttribute('label') || '';
            const items = Array.from(group.querySelectorAll('Item')).map((el) => this.parseItem(el));
            return { label, items } as ParsedGroup;
        });

        const allItems = [...standaloneItems, ...groups.flatMap((g) => g.items)];
        return { standaloneItems, groups, allItems };
    }

    private getFilteredItems(): ParsedItem[] {
        const { standaloneItems, groups } = this.getParsedData();
        const query = this.searchQuery.trim().toLowerCase();
        const filter = (item: ParsedItem) => !query || item.labelText.toLowerCase().includes(query);
        const flatFromGroups = groups.flatMap((g) => g.items.filter(filter));
        const flatStandalone = standaloneItems.filter(filter);
        return [...flatFromGroups, ...flatStandalone];
    }

    private getLabelByValue(value: string | null): string {
        if (!value) return '';
        const { allItems } = this.getParsedData();
        return allItems.find((item) => item.value === value)?.labelText || '';
    }

    private getTriggerText(): string {
        const trigger = this.getSlot('Trigger');
        return trigger?.textContent?.trim() || '';
    }

    private getInputClasses(hasError: boolean): string {
        return cn(
            'w-full rounded-lg px-3 py-2 text-sm border transition ml-combobox-input ml-select-trigger',
            'focus:outline-none focus:ring-2',
            hasError ? 'ml-select-trigger-error' : '',
            this.isOpen ? 'ml-select-trigger-open' : '',
            (this.disabled || this.readonly) ? 'ml-disabled' : '',
            this.getSlotClass('Trigger'),
        );
    }

    private getOptionClasses(item: ParsedItem, isHighlighted: boolean, isSelected: boolean): string {
        return cn(
            'flex w-full items-center rounded-md px-3 py-2 text-sm transition border ml-select-item',
            isSelected ? 'ml-select-item-selected' : 'border-transparent',
            isHighlighted && !item.disabled ? 'ml-select-item-highlighted' : '',
            item.disabled ? 'ml-disabled' : 'cursor-pointer',
            this.getSlotClass('Item'),
        );
    }

    // ===========================================================================
    // RENDER
    // ===========================================================================
    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        const { standaloneItems, groups } = this.getParsedData();
        const query = this.searchQuery.trim().toLowerCase();
        const filter = (item: ParsedItem) => !query || item.labelText.toLowerCase().includes(query);

        const filteredGroups = groups
            .map((group) => ({
                label: group.label,
                items: group.items.filter(filter),
            }))
            .filter((group) => group.items.length > 0);

        const filteredStandalone = standaloneItems.filter(filter);
        const filteredFlat = [...filteredGroups.flatMap((g) => g.items), ...filteredStandalone];

        const selectedLabelText = this.getLabelByValue(this.value);
        const placeholderText = this.placeholder || this.getTriggerText() || this.msg.placeholder;
        const hasError = !!this.error || (this.required && !this.value);
        const errorMessage = this.error || (this.required && !this.value ? this.msg.required : '');

        if (!this.isEditing) {
            return html`
<div class="${cn('flex flex-col gap-1', this.cssClass)}">
${this.hasSlot('Label')
                    ? html`<label id=${this.labelId} class="${cn('text-sm ml-label', this.getSlotClass('Label'))}">${unsafeHTML(this.getSlotContent('Label'))}</label>`
                    : html``}
<div class="text-sm ml-text">
${selectedLabelText || placeholderText || '—'}
</div>
</div>
`;
        }

        return html`
<div class="${cn('flex flex-col gap-1', this.cssClass)}" @focusout=${this.handleFocusOut}>
${this.hasSlot('Label')
                ? html`<label id=${this.labelId} for=${this.inputId} class="${cn('text-sm ml-label', this.getSlotClass('Label'))}">${unsafeHTML(this.getSlotContent('Label'))}</label>`
                : html``}
<div class="relative">
<input
id=${this.inputId}
name=${this.name}
class=${this.getInputClasses(hasError)}
.value=${this.searchQuery}
placeholder=${placeholderText}
?disabled=${this.disabled}
?readonly=${this.readonly}
role="combobox"
aria-expanded=${this.isOpen ? 'true' : 'false'}
aria-haspopup="listbox"
aria-controls=${this.listId}
aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
aria-describedby=${hasError ? this.errorId : (this.hasSlot('Helper') ? this.helperId : '')}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@focus=${this.handleInputFocus}
@input=${this.handleInput}
@keydown=${this.handleKeyDown}
@mousedown=${this.handleMouseDown}
autocomplete="off"
/>
<div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ml-text-muted">
${this.loading ? html`${this.msg.loading}` : html`
<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
${svg`<path d="M5 7l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`}
</svg>`}
</div>
${this.clearable && this.value && !this.disabled && !this.readonly
                ? html`
<button
class="absolute right-8 top-1/2 -translate-y-1/2 ml-text-muted"
@mousedown=${(e: Event) => e.preventDefault()}
@click=${this.handleClear}
aria-label=${this.msg.clear}
>
<svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
${svg`<path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`}
</svg>
</button>
` : html``}
</div>

${this.isOpen && !this.loading
                ? html`
<div
id=${this.listId}
role="listbox"
class="mt-2 max-h-64 overflow-auto rounded-lg border p-2 ml-select-panel"
>
${filteredFlat.length === 0
                        ? html`
<div class="px-3 py-2 text-sm ml-select-empty">
${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.noResults}
</div>
`
                        : html`
${filteredGroups.map((group) => html`
<div class="mb-2">
<div class="px-3 py-1 text-xs font-semibold uppercase ml-text-muted">
${group.label}
</div>
${group.items.map((item) => {
                            const flatIndex = filteredFlat.findIndex((i) => i.value === item.value);
                            return html`
<div
role="option"
aria-selected=${this.value === item.value ? 'true' : 'false'}
aria-disabled=${item.disabled ? 'true' : 'false'}
class=${this.getOptionClasses(item, this.highlightedIndex === flatIndex, this.value === item.value)}
@click=${() => this.handleItemSelect(item)}
@mousedown=${(e: Event) => e.preventDefault()}
>
${unsafeHTML(item.label)}
</div>
`;
                        })}
</div>
`)}
${filteredStandalone.map((item) => {
                            const flatIndex = filteredFlat.findIndex((i) => i.value === item.value);
                            return html`
<div
role="option"
aria-selected=${this.value === item.value ? 'true' : 'false'}
aria-disabled=${item.disabled ? 'true' : 'false'}
class=${this.getOptionClasses(item, this.highlightedIndex === flatIndex, this.value === item.value)}
@click=${() => this.handleItemSelect(item)}
@mousedown=${(e: Event) => e.preventDefault()}
>
${unsafeHTML(item.label)}
</div>
`;
                        })}
`}
</div>
`
                : html``}

${hasError
                ? html`<p id=${this.errorId} class="mt-1 text-xs ml-error-text">${errorMessage}</p>`
                : this.hasSlot('Helper')
                    ? html`<p id=${this.helperId} class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`
                    : html``}
</div>
`;
    }
}
