/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-dropdown-img.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SELECT DROPDOWN IMG MOLECULE
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
    noResults: 'No results found',
    loading: 'Loading...',
    searchPlaceholder: 'Search...',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
    en: message_en,
    pt: {
        placeholder: 'Selecione uma opção',
        noResults: 'Nenhum resultado encontrado',
        loading: 'Carregando...',
        searchPlaceholder: 'Pesquisar...',
    },
};
/// **collab_i18n_end**

interface ParsedItem {
    value: string;
    label: string;
    disabled: boolean;
    icon: string;
    group?: string;
}

@customElement('groupselectone--ml-select-dropdown-img')
export class MlSelectDropdownImgMolecule extends MoleculeAuraElement {
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

    @propertyDataSource({ type: Boolean })
    searchable: boolean = false;

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
    private isOpen: boolean = false;

    @state()
    private searchQuery: string = '';

    @state()
    private parsedItems: ParsedItem[] = [];

    @state()
    private focusedIndex: number = -1;

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
        this.parseItems();
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('isOpen') && !this.isOpen) {
            this.searchQuery = '';
            this.focusedIndex = -1;
        }
    }

    // ===========================================================================
    // ITEM PARSING
    // ===========================================================================
    private parseItems(): void {
        const items: ParsedItem[] = [];
        const itemElements = this.getSlots('Item');
        const groupElements = this.getSlots('Group');

        // Parse items inside groups
        groupElements.forEach((group) => {
            const groupLabel = group.getAttribute('label') || '';
            const groupItems = group.querySelectorAll('Item');
            groupItems.forEach((item) => {
                items.push(this.parseItemElement(item, groupLabel));
            });
        });

        // Parse standalone items
        itemElements.forEach((item) => {
            if (!item.closest('Group')) {
                items.push(this.parseItemElement(item));
            }
        });

        this.parsedItems = items;
    }

    private parseItemElement(item: Element, group?: string): ParsedItem {
        const value = item.getAttribute('value') || '';
        const disabled = item.hasAttribute('disabled');
        const imgElement = item.querySelector('img');
        const icon = imgElement ? imgElement.outerHTML : '';
        
        // Get text content excluding the img element
        const clonedItem = item.cloneNode(true) as Element;
        const clonedImg = clonedItem.querySelector('img');
        if (clonedImg) {
            clonedImg.remove();
        }
        const label = clonedItem.innerHTML.trim();

        return { value, label, disabled, icon, group };
    }

    private findItem(value: string | null): ParsedItem | undefined {
        if (value === null) return undefined;
        return this.parsedItems.find((item) => item.value === value);
    }

    private getFilteredItems(): ParsedItem[] {
        if (!this.searchQuery) return this.parsedItems;
        const query = this.searchQuery.toLowerCase();
        return this.parsedItems.filter((item) =>
            item.label.toLowerCase().includes(query)
        );
    }

    // ===========================================================================
    // EVENT HANDLERS
    // ===========================================================================
    private handleTriggerClick(e: Event): void {
        e.stopPropagation();
        if (this.disabled || this.readonly || this.loading) return;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.parseItems();
            this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
        }
    }

    private handleSelect(item: ParsedItem): void {
        if (item.disabled || this.disabled || this.readonly) return;
        this.value = item.value;
        this.isOpen = false;
        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value: this.value },
            })
        );
    }

    private handleOutsideClick(e: Event): void {
        if (!this.isOpen) return;
        const path = e.composedPath();
        if (!path.includes(this)) {
            this.isOpen = false;
            this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
        }
    }

    private handleKeydown(e: KeyboardEvent): void {
        if (!this.isOpen) return;

        const filteredItems = this.getFilteredItems();
        const selectableItems = filteredItems.filter((item) => !item.disabled);

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.isOpen = false;
                this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (selectableItems.length > 0) {
                    this.focusedIndex = Math.min(this.focusedIndex + 1, selectableItems.length - 1);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (selectableItems.length > 0) {
                    this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (this.focusedIndex >= 0 && this.focusedIndex < selectableItems.length) {
                    this.handleSelect(selectableItems[this.focusedIndex]);
                }
                break;
        }
    }

    private handleSearchInput(e: Event): void {
        const input = e.target as HTMLInputElement;
        this.searchQuery = input.value;
        this.focusedIndex = -1;
    }

    // ===========================================================================
    // RENDER HELPERS
    // ===========================================================================
    private getTriggerClasses(): string {
        const hasError = this.error !== '';
        return [
            'w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm border transition-all duration-200',
            'bg-white dark:bg-slate-900',
            'text-slate-900 dark:text-slate-100',
            hasError
                ? 'border-red-500 dark:border-red-400'
                : this.isOpen
                ? 'border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/20 dark:ring-sky-400/20'
                : 'border-slate-200 dark:border-slate-700',
            !this.disabled && !this.readonly && !this.loading
                ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600'
                : '',
            this.disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : '',
            this.readonly ? 'cursor-default bg-slate-50 dark:bg-slate-800' : '',
        ].filter(Boolean).join(' ');
    }

    private getPanelClasses(): string {
        return [
            'absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden',
            'bg-white dark:bg-slate-800',
            'border-slate-200 dark:border-slate-700',
        ].join(' ');
    }

    private getItemClasses(item: ParsedItem, isSelected: boolean, isFocused: boolean): string {
        return [
            'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150 cursor-pointer',
            isSelected
                ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                : 'text-slate-900 dark:text-slate-100',
            !item.disabled && !isSelected
                ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
                : '',
            isFocused && !item.disabled
                ? 'bg-slate-100 dark:bg-slate-700'
                : '',
            item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : '',
        ].filter(Boolean).join(' ');
    }

    private getSearchInputClasses(): string {
        return [
            'w-full px-3 py-2 text-sm border-b outline-none',
            'bg-white dark:bg-slate-800',
            'text-slate-900 dark:text-slate-100',
            'border-slate-200 dark:border-slate-700',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:border-sky-500 dark:focus:border-sky-400',
        ].join(' ');
    }

    // ===========================================================================
    // RENDER METHODS
    // ===========================================================================
    private renderLabel(): TemplateResult {
        if (!this.hasSlot('Label')) return html``;
        const labelContent = this.getSlotContent('Label');
        return html`
            <label
                class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
                id="label-${this.name}"
            >
                ${unsafeHTML(labelContent)}
                ${this.required ? html`<span class="text-red-500 dark:text-red-400 ml-0.5">*</span>` : html``}
            </label>
        `;
    }

    private renderTriggerContent(): TemplateResult {
        const selectedItem = this.findItem(this.value);

        if (this.loading) {
            return html`
                <span class="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ${this.msg.loading}
                </span>
            `;
        }

        if (selectedItem) {
            return html`
                <span class="flex items-center gap-2 truncate">
                    ${selectedItem.icon ? html`<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center [&>img]:max-w-full [&>img]:max-h-full [&>img]:object-contain">${unsafeHTML(selectedItem.icon)}</span>` : html``}
                    <span class="truncate">${unsafeHTML(selectedItem.label)}</span>
                </span>
            `;
        }

        if (this.hasSlot('Trigger')) {
            return html`<span class="text-slate-400 dark:text-slate-500 truncate">${unsafeHTML(this.getSlotContent('Trigger'))}</span>`;
        }

        const placeholderText = this.placeholder || this.msg.placeholder;
        return html`<span class="text-slate-400 dark:text-slate-500 truncate">${placeholderText}</span>`;
    }

    private renderChevron(): TemplateResult {
        const rotateClass = this.isOpen ? 'rotate-180' : '';
        return html`
            <svg
                class="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${rotateClass}"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
        `;
    }

    private renderTrigger(): TemplateResult {
        const hasError = this.error !== '';
        return html`
            <button
                type="button"
                role="combobox"
                aria-expanded="${this.isOpen}"
                aria-haspopup="listbox"
                aria-labelledby="${this.hasSlot('Label') ? `label-${this.name}` : ''}"
                aria-describedby="${hasError ? `error-${this.name}` : this.hasSlot('Helper') ? `helper-${this.name}` : ''}"
                aria-invalid="${hasError}"
                aria-required="${this.required}"
                class="${this.getTriggerClasses()}"
                ?disabled="${this.disabled}"
                @click="${this.handleTriggerClick}"
            >
                ${this.renderTriggerContent()}
                ${this.renderChevron()}
            </button>
        `;
    }

    private renderSearch(): TemplateResult {
        if (!this.searchable) return html``;
        return html`
            <div class="p-2 border-b border-slate-200 dark:border-slate-700">
                <input
                    type="text"
                    class="${this.getSearchInputClasses()}"
                    placeholder="${this.msg.searchPlaceholder}"
                    .value="${this.searchQuery}"
                    @input="${this.handleSearchInput}"
                    @click="${(e: Event) => e.stopPropagation()}"
                />
            </div>
        `;
    }

    private renderItems(): TemplateResult {
        const filteredItems = this.getFilteredItems();
        const selectableItems = filteredItems.filter((item) => !item.disabled);

        if (filteredItems.length === 0) {
            if (this.hasSlot('Empty')) {
                return html`
                    <div class="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                        ${unsafeHTML(this.getSlotContent('Empty'))}
                    </div>
                `;
            }
            return html`
                <div class="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                    ${this.msg.noResults}
                </div>
            `;
        }

        // Group items by their group property
        const groupedItems = new Map<string, ParsedItem[]>();
        const ungroupedItems: ParsedItem[] = [];

        filteredItems.forEach((item) => {
            if (item.group) {
                if (!groupedItems.has(item.group)) {
                    groupedItems.set(item.group, []);
                }
                groupedItems.get(item.group)!.push(item);
            } else {
                ungroupedItems.push(item);
            }
        });

        let selectableIndex = -1;

        const renderItem = (item: ParsedItem): TemplateResult => {
            const isSelected = this.value === item.value;
            let isFocused = false;
            if (!item.disabled) {
                selectableIndex++;
                isFocused = this.focusedIndex === selectableIndex;
            }

            return html`
                <div
                    role="option"
                    aria-selected="${isSelected}"
                    aria-disabled="${item.disabled}"
                    class="${this.getItemClasses(item, isSelected, isFocused)}"
                    @click="${() => this.handleSelect(item)}"
                >
                    ${item.icon ? html`<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center [&>img]:max-w-full [&>img]:max-h-full [&>img]:object-contain">${unsafeHTML(item.icon)}</span>` : html``}
                    <span class="flex-1 truncate">${unsafeHTML(item.label)}</span>
                    ${isSelected ? html`
                        <svg class="w-4 h-4 flex-shrink-0 text-sky-500 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                        </svg>
                    ` : html``}
                </div>
            `;
        };

        return html`
            <div role="listbox" class="max-h-60 overflow-y-auto py-1">
                ${ungroupedItems.map((item) => renderItem(item))}
                ${Array.from(groupedItems.entries()).map(([groupLabel, items]) => html`
                    <div class="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                        ${groupLabel}
                    </div>
                    ${items.map((item) => renderItem(item))}
                `)}
            </div>
        `;
    }

    private renderPanel(): TemplateResult {
        if (!this.isOpen) return html``;
        return html`
            <div class="${this.getPanelClasses()}">
                ${this.renderSearch()}
                ${this.renderItems()}
            </div>
        `;
    }

    private renderHelper(): TemplateResult {
        if (this.error) {
            return html`
                <p id="error-${this.name}" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
                    ${unsafeHTML(this.error)}
                </p>
            `;
        }
        if (this.hasSlot('Helper')) {
            return html`
                <p id="helper-${this.name}" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    ${unsafeHTML(this.getSlotContent('Helper'))}
                </p>
            `;
        }
        return html``;
    }

    private renderViewMode(): TemplateResult {
        const selectedItem = this.findItem(this.value);
        if (!selectedItem) {
            return html`<span class="text-slate-400 dark:text-slate-500">—</span>`;
        }
        return html`
            <span class="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                ${selectedItem.icon ? html`<span class="flex-shrink-0 w-5 h-5 flex items-center justify-center [&>img]:max-w-full [&>img]:max-h-full [&>img]:object-contain">${unsafeHTML(selectedItem.icon)}</span>` : html``}
                <span>${unsafeHTML(selectedItem.label)}</span>
            </span>
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
            <div class="relative w-full">
                ${this.renderLabel()}
                ${this.renderTrigger()}
                ${this.renderPanel()}
                ${this.renderHelper()}
            </div>
        `;
    }
}
