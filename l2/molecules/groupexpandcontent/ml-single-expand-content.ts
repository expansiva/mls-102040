/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SINGLE EXPAND CONTENT MOLECULE
// =============================================================================
// Skill Group: groupExpandContent
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

interface ParsedSection {
  index: number;
  title: string;
  disabled: boolean;
  content: string;
}

@customElement('groupexpandcontent--ml-single-expand-content')
export class SingleExpandContentMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Section'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  multiple: boolean = true;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  @propertyDataSource({ type: Boolean })
  expanded: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private openSections: Set<number> = new Set();

  @state()
  private parsedSections: ParsedSection[] = [];

  @state()
  private initialized: boolean = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseSections();
    this.initializeExpandedState();
    this.initialized = true;
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const expandedAttr = this.getAttribute('expanded');
    if (expandedAttr === `{{${key}}}`) {
      if (value && !this.openSections.has(0)) {
        this.openSections = new Set([0]);
      } else if (!value && this.openSections.has(0)) {
        this.openSections = new Set();
      }
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseSections(): void {
    const sectionElements = this.getSlots('Section');
    // Only process the first section as per spec
    const sectionsToProcess = sectionElements.slice(0, 1);
    
    this.parsedSections = sectionsToProcess.map((el, index) => ({
      index,
      title: el.getAttribute('title') || '',
      disabled: el.hasAttribute('disabled'),
      content: el.innerHTML,
    }));
  }

  private initializeExpandedState(): void {
    const sectionElements = this.getSlots('Section');
    if (sectionElements.length > 0) {
      const firstSection = sectionElements[0];
      // Check both the slot attribute and the component property
      if (firstSection.hasAttribute('expanded') || this.expanded) {
        this.openSections = new Set([0]);
      }
    }
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleToggle(section: ParsedSection): void {
    if (this.disabled || this.loading || section.disabled) return;

    const isCurrentlyOpen = this.openSections.has(section.index);
    const newExpandedState = !isCurrentlyOpen;

    if (newExpandedState) {
      if (this.multiple) {
        this.openSections = new Set([...this.openSections, section.index]);
      } else {
        this.openSections = new Set([section.index]);
      }
    } else {
      const newSet = new Set(this.openSections);
      newSet.delete(section.index);
      this.openSections = newSet;
    }

    // Update the expanded property to reflect current state
    this.expanded = this.openSections.has(0);

    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: {
        index: section.index,
        title: section.title,
        expanded: newExpandedState,
      },
    }));
  }

  private handleKeyDown(e: KeyboardEvent, section: ParsedSection): void {
    if (this.disabled || this.loading || section.disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleToggle(section);
    }

    // Arrow navigation for multiple sections
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const headers = this.querySelectorAll('[role="button"]');
      const currentIndex = Array.from(headers).indexOf(e.target as Element);
      let nextIndex: number;

      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % headers.length;
      } else {
        nextIndex = (currentIndex - 1 + headers.length) % headers.length;
      }

      (headers[nextIndex] as HTMLElement)?.focus();
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getHeaderClasses(section: ParsedSection, isExpanded: boolean): string {
    const isDisabled = this.disabled || section.disabled;
    
    return [
      'w-full flex items-center justify-between px-4 py-3 text-left',
      'rounded-lg border transition-all duration-200',
      'bg-white dark:bg-slate-800',
      'text-slate-900 dark:text-slate-100',
      isExpanded
        ? 'border-sky-500 dark:border-sky-400'
        : 'border-slate-200 dark:border-slate-700',
      isDisabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700',
      !isDisabled ? 'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400' : '',
    ].filter(Boolean).join(' ');
  }

  private getContentClasses(isExpanded: boolean): string {
    return [
      'overflow-hidden transition-all duration-300 ease-in-out',
      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
    ].join(' ');
  }

  private getContentInnerClasses(): string {
    return [
      'px-4 py-3 mt-2',
      'bg-slate-50 dark:bg-slate-900',
      'border border-slate-200 dark:border-slate-700',
      'rounded-lg',
      'text-slate-700 dark:text-slate-300',
    ].join(' ');
  }

  private getChevronClasses(isExpanded: boolean): string {
    return [
      'w-5 h-5 transition-transform duration-200',
      'text-slate-500 dark:text-slate-400',
      isExpanded ? 'rotate-180' : 'rotate-0',
    ].join(' ');
  }

  private renderChevron(isExpanded: boolean): TemplateResult {
    return html`
      <svg 
        class="${this.getChevronClasses(isExpanded)}" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) {
      return html``;
    }

    const labelContent = this.getSlotContent('Label');
    return html`
      <div class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        ${unsafeHTML(labelContent)}
      </div>
    `;
  }

  private renderLoadingPlaceholder(): TemplateResult {
    return html`
      <div class="animate-pulse space-y-3">
        <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div class="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
    `;
  }

  private renderSection(section: ParsedSection): TemplateResult {
    const isExpanded = this.openSections.has(section.index);
    const isDisabled = this.disabled || section.disabled;
    const headerId = `section-header-${section.index}`;
    const contentId = `section-content-${section.index}`;

    return html`
      <div class="section-wrapper">
        <div
          id="${headerId}"
          role="button"
          tabindex="${isDisabled ? -1 : 0}"
          aria-expanded="${isExpanded}"
          aria-controls="${contentId}"
          aria-disabled="${isDisabled}"
          class="${this.getHeaderClasses(section, isExpanded)}"
          @click="${() => this.handleToggle(section)}"
          @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e, section)}"
        >
          <span class="font-medium text-sm">${section.title}</span>
          ${this.renderChevron(isExpanded)}
        </div>
        
        <div
          id="${contentId}"
          role="region"
          aria-labelledby="${headerId}"
          class="${this.getContentClasses(isExpanded)}"
        >
          <div class="${this.getContentInnerClasses()}">
            ${unsafeHTML(section.content)}
          </div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return html`
        <div class="w-full">
          ${this.renderLabel()}
          ${this.renderLoadingPlaceholder()}
        </div>
      `;
    }

    // Re-parse sections if not initialized (for dynamic content)
    if (!this.initialized) {
      this.parseSections();
    }

    return html`
      <div class="w-full space-y-2">
        ${this.renderLabel()}
        ${this.parsedSections.map(section => this.renderSection(section))}
      </div>
    `;
  }
}
