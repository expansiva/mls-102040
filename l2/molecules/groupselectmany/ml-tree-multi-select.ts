/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-tree-multi-select.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TREE MULTI-SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectMany
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'No items selected',
  noResults: 'No results found',
  loading: 'Loading...',
  searchPlaceholder: 'Search...',
  selectedCount: 'items selected',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Nenhum item selecionado',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    searchPlaceholder: 'Buscar...',
    selectedCount: 'itens selecionados',
  },
};
/// **collab_i18n_end**

interface TreeNode {
  value: string;
  label: string;
  disabled: boolean;
  children: TreeNode[];
  parent: TreeNode | null;
  groupLabel?: string;
}

@customElement('groupselectmany--ml-tree-multi-select')
export class MlTreeMultiSelectMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string = '';

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Boolean })
  searchable: boolean = false;

  @propertyDataSource({ type: Number, attribute: 'min-selection' })
  minSelection: number = 0;

  @propertyDataSource({ type: Number, attribute: 'max-selection' })
  maxSelection: number = 0;

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
  private searchQuery: string = '';

  @state()
  private expandedNodes: Set<string> = new Set();

  @state()
  private treeNodes: TreeNode[] = [];

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseTreeStructure();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      this.requestUpdate();
    }
  }

  // ===========================================================================
  // TREE PARSING
  // ===========================================================================
  private parseTreeStructure() {
    const items = this.getSlots('Item');
    const groups = this.getSlots('Group');
    const nodes: TreeNode[] = [];

    // Parse groups first
    groups.forEach((group) => {
      const groupLabel = group.getAttribute('label') || '';
      const groupItems = Array.from(group.querySelectorAll('Item'));
      const groupNodes = this.parseItems(groupItems, null, groupLabel);
      nodes.push(...groupNodes);
    });

    // Parse standalone items (not inside groups)
    const standaloneItems = items.filter((item) => !item.closest('Group'));
    const standaloneNodes = this.parseItems(Array.from(standaloneItems), null);
    nodes.push(...standaloneNodes);

    this.treeNodes = nodes;

    // Auto-expand all nodes initially
    this.expandAllNodes(nodes);
  }

  private parseItems(items: Element[], parent: TreeNode | null, groupLabel?: string): TreeNode[] {
    const nodes: TreeNode[] = [];

    items.forEach((item) => {
      const value = item.getAttribute('value') || '';
      const label = item.innerHTML.trim();
      const disabled = item.hasAttribute('disabled');
      const childItems = Array.from(item.querySelectorAll(':scope > Item'));

      const node: TreeNode = {
        value,
        label,
        disabled,
        children: [],
        parent,
        groupLabel,
      };

      if (childItems.length > 0) {
        node.children = this.parseItems(childItems, node);
      }

      nodes.push(node);
    });

    return nodes;
  }

  private expandAllNodes(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        this.expandedNodes.add(node.value);
        this.expandAllNodes(node.children);
      }
    });
  }

  // ===========================================================================
  // VALUE HELPERS
  // ===========================================================================
  private getSelectedValues(): Set<string> {
    if (!this.value || this.value.trim() === '') {
      return new Set();
    }
    return new Set(this.value.split(',').filter(Boolean));
  }

  private getSelectedCount(): number {
    return this.getSelectedValues().size;
  }

  private isNodeSelected(node: TreeNode): boolean {
    return this.getSelectedValues().has(node.value);
  }

  private isNodeIndeterminate(node: TreeNode): boolean {
    if (node.children.length === 0) return false;

    const allDescendants = this.getAllDescendants(node);
    const selectedCount = allDescendants.filter((n) => this.isNodeSelected(n)).length;

    return selectedCount > 0 && selectedCount < allDescendants.length;
  }

  private getAllDescendants(node: TreeNode): TreeNode[] {
    const descendants: TreeNode[] = [];

    node.children.forEach((child) => {
      descendants.push(child);
      descendants.push(...this.getAllDescendants(child));
    });

    return descendants;
  }

  private getAllLeafDescendants(node: TreeNode): TreeNode[] {
    if (node.children.length === 0) {
      return [node];
    }

    const leaves: TreeNode[] = [];
    node.children.forEach((child) => {
      leaves.push(...this.getAllLeafDescendants(child));
    });
    return leaves;
  }

  private canSelectMore(): boolean {
    if (this.maxSelection === 0) return true;
    return this.getSelectedCount() < this.maxSelection;
  }

  // ===========================================================================
  // SEARCH HELPERS
  // ===========================================================================
  private matchesSearch(node: TreeNode): boolean {
    if (!this.searchQuery) return true;

    const query = this.searchQuery.toLowerCase();
    const labelText = node.label.replace(/<[^>]*>/g, '').toLowerCase();

    if (labelText.includes(query)) return true;

    return node.children.some((child) => this.matchesSearch(child));
  }

  private getFilteredNodes(): TreeNode[] {
    if (!this.searchQuery) return this.treeNodes;

    return this.filterNodes(this.treeNodes);
  }

  private filterNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.filter((node) => this.matchesSearch(node));
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleToggleExpand(node: TreeNode, e: Event) {
    e.stopPropagation();

    if (this.expandedNodes.has(node.value)) {
      this.expandedNodes.delete(node.value);
    } else {
      this.expandedNodes.add(node.value);
    }

    this.expandedNodes = new Set(this.expandedNodes);
  }

  private handleNodeSelect(node: TreeNode, e: Event) {
    e.stopPropagation();

    if (this.disabled || this.readonly || this.loading || node.disabled) return;

    const selectedValues = this.getSelectedValues();
    const isCurrentlySelected = selectedValues.has(node.value);

    if (node.children.length > 0) {
      // Parent node: cascade selection to all descendants
      const allDescendants = this.getAllDescendants(node);
      const selectableDescendants = allDescendants.filter((n) => !n.disabled);

      if (isCurrentlySelected || this.isNodeIndeterminate(node)) {
        // Deselect all descendants
        selectableDescendants.forEach((n) => selectedValues.delete(n.value));
        selectedValues.delete(node.value);
      } else {
        // Select all descendants (respecting maxSelection)
        const nodesToSelect = [node, ...selectableDescendants];
        for (const n of nodesToSelect) {
          if (this.maxSelection === 0 || selectedValues.size < this.maxSelection) {
            selectedValues.add(n.value);
          }
        }
      }
    } else {
      // Leaf node
      if (isCurrentlySelected) {
        selectedValues.delete(node.value);
      } else {
        if (!this.canSelectMore()) return;
        selectedValues.add(node.value);
      }
    }

    // Update parent states
    this.updateParentStates(node, selectedValues);

    this.value = Array.from(selectedValues).join(',');

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private updateParentStates(node: TreeNode, selectedValues: Set<string>) {
    let parent = node.parent;

    while (parent) {
      const allDescendants = this.getAllDescendants(parent);
      const allSelected = allDescendants.every((n) => selectedValues.has(n.value) || n.disabled);
      const noneSelected = allDescendants.every((n) => !selectedValues.has(n.value));

      if (allSelected) {
        selectedValues.add(parent.value);
      } else if (noneSelected) {
        selectedValues.delete(parent.value);
      } else {
        selectedValues.delete(parent.value);
      }

      parent = parent.parent;
    }
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
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
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // ===========================================================================
  // CSS HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full rounded-lg border transition',
      'bg-white dark:bg-slate-800',
      this.error
        ? 'border-red-500 dark:border-red-400'
        : 'border-slate-200 dark:border-slate-700',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getNodeClasses(node: TreeNode, isSelected: boolean): string {
    const isDisabled = node.disabled || this.disabled || this.readonly || this.loading;
    const isMaxReached = !isSelected && !this.canSelectMore();

    return [
      'flex items-center gap-2 px-2 py-1.5 rounded-md transition cursor-pointer',
      'text-sm',
      isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
        : 'text-slate-900 dark:text-slate-100',
      !isDisabled && !isMaxReached && !isSelected
        ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
        : '',
      isDisabled || isMaxReached ? 'opacity-50 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getCheckboxClasses(isSelected: boolean, isIndeterminate: boolean): string {
    return [
      'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition',
      isSelected || isIndeterminate
        ? 'bg-sky-500 dark:bg-sky-400 border-sky-500 dark:border-sky-400'
        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600',
    ].join(' ');
  }

  private getExpandIconClasses(isExpanded: boolean): string {
    return [
      'w-4 h-4 flex-shrink-0 transition-transform duration-200',
      'text-slate-400 dark:text-slate-500',
      isExpanded ? 'rotate-90' : '',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="text-red-500 dark:text-red-400">*</span>` : html``}
      </label>
    `;
  }

  private renderSearch(): TemplateResult {
    if (!this.searchable || !this.isEditing) return html``;

    const inputClasses = [
      'w-full px-3 py-2 text-sm rounded-t-lg border-b',
      'bg-slate-50 dark:bg-slate-900',
      'text-slate-900 dark:text-slate-100',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'border-slate-200 dark:border-slate-700',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      this.disabled ? 'cursor-not-allowed' : '',
    ].join(' ');

    return html`
      <div class="sticky top-0 z-10">
        <input
          type="text"
          class=${inputClasses}
          placeholder=${this.msg.searchPlaceholder}
          .value=${this.searchQuery}
          @input=${this.handleSearchInput}
          ?disabled=${this.disabled || this.loading}
        />
      </div>
    `;
  }

  private renderCheckIcon(): TemplateResult {
    return html`
      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    `;
  }

  private renderIndeterminateIcon(): TemplateResult {
    return html`
      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h14" />
      </svg>
    `;
  }

  private renderExpandIcon(): TemplateResult {
    return html`
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    `;
  }

  private renderNode(node: TreeNode, depth: number = 0): TemplateResult {
    if (!this.matchesSearch(node)) return html``;

    const isSelected = this.isNodeSelected(node);
    const isIndeterminate = this.isNodeIndeterminate(node);
    const hasChildren = node.children.length > 0;
    const isExpanded = this.expandedNodes.has(node.value);
    const paddingLeft = depth * 20 + 8;

    return html`
      <div class="select-none">
        <div
          class=${this.getNodeClasses(node, isSelected)}
          style="padding-left: ${paddingLeft}px"
          @click=${(e: Event) => this.handleNodeSelect(node, e)}
          role="option"
          aria-selected=${isSelected}
          aria-disabled=${node.disabled || this.disabled}
        >
          ${hasChildren
            ? html`
                <span
                  class=${this.getExpandIconClasses(isExpanded)}
                  @click=${(e: Event) => this.handleToggleExpand(node, e)}
                >
                  ${this.renderExpandIcon()}
                </span>
              `
            : html`<span class="w-4 flex-shrink-0"></span>`}

          <span class=${this.getCheckboxClasses(isSelected, isIndeterminate)}>
            ${isSelected
              ? this.renderCheckIcon()
              : isIndeterminate
                ? this.renderIndeterminateIcon()
                : html``}
          </span>

          <span class="flex-1 truncate">${unsafeHTML(node.label)}</span>
        </div>

        ${hasChildren && isExpanded
          ? html`
              <div class="ml-2">
                ${node.children.map((child) => this.renderNode(child, depth + 1))}
              </div>
            `
          : html``}
      </div>
    `;
  }

  private renderTree(): TemplateResult {
    const filteredNodes = this.getFilteredNodes();

    if (filteredNodes.length === 0) {
      return this.renderEmpty();
    }

    return html`
      <div
        class="p-2 max-h-64 overflow-y-auto"
        role="listbox"
        aria-multiselectable="true"
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        tabindex="0"
      >
        ${filteredNodes.map((node) => this.renderNode(node, 0))}
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const content = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.noResults;

    return html`
      <div class="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (this.error) {
      return html`
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <div class="inline-flex items-center gap-2">
          <svg
            class="animate-spin h-4 w-4 text-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>${this.msg.loading}</span>
        </div>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const selectedValues = this.getSelectedValues();

    if (selectedValues.size === 0) {
      const placeholderText = this.placeholder || this.msg.placeholder;
      return html`
        <div class="text-sm text-slate-400 dark:text-slate-500">${placeholderText}</div>
      `;
    }

    const selectedLabels = this.getSelectedLabels(selectedValues);

    return html`
      <div class="flex flex-wrap gap-1">
        ${selectedLabels.map(
          (label) => html`
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300"
            >
              ${unsafeHTML(label)}
            </span>
          `
        )}
      </div>
    `;
  }

  private getSelectedLabels(selectedValues: Set<string>): string[] {
    const labels: string[] = [];

    const findLabels = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (selectedValues.has(node.value)) {
          labels.push(node.label);
        }
        if (node.children.length > 0) {
          findLabels(node.children);
        }
      });
    };

    findLabels(this.treeNodes);
    return labels;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    // Re-parse tree structure on each render to pick up slot changes
    this.parseTreeStructure();

    if (!this.isEditing) {
      return html`
        <div>
          ${this.renderLabel()}
          ${this.renderViewMode()}
        </div>
      `;
    }

    return html`
      <div
        class="w-full"
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
      >
        ${this.renderLabel()}

        <div class=${this.getContainerClasses()}>
          ${this.renderSearch()}
          ${this.loading ? this.renderLoading() : this.renderTree()}
        </div>

        ${this.renderHelper()}
      </div>
    `;
  }
}
