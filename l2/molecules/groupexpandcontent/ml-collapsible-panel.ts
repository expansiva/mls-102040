/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-collapsible-panel.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// COLLAPSIBLE PANEL MOLECULE
// =============================================================================
// Skill Group: groupExpandContent
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupexpandcontent--ml-collapsible-panel')
export class MlCollapsiblePanelMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Section'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  multiple = true;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private openSections: Set<number> = new Set();

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.getSlots('Section').forEach((el, index) => {
      if (el.hasAttribute('expanded')) {
        this.openSections.add(index);
      }
    });
    this.requestUpdate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleHeaderClick(index: number) {
    if (this.loading || this.disabled) return;
    const sections = this.getSlots('Section');
    const sectionEl = sections[index];
    if (!sectionEl || sectionEl.hasAttribute('disabled')) return;

    const isOpen = this.openSections.has(index);
    if (this.multiple) {
      if (isOpen) {
        this.openSections.delete(index);
      } else {
        this.openSections.add(index);
      }
    } else {
      this.openSections = new Set(isOpen ? [] : [index]);
    }

    const title = sectionEl.getAttribute('title') || '';
    const expanded = this.openSections.has(index);
    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        composed: true,
        detail: { index, title, expanded },
      })
    );

    this.requestUpdate();
  }

  private handleHeaderKeydown(event: KeyboardEvent, index: number) {
    if (this.loading || this.disabled) return;
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.handleHeaderClick(index);
      return;
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      this.focusAdjacentHeader(index, key === 'ArrowDown' ? 1 : -1);
    }
  }

  private focusAdjacentHeader(currentIndex: number, delta: number) {
    const headers = Array.from(
      this.querySelectorAll<HTMLDivElement>('[data-header="true"]')
    );
    if (headers.length === 0) return;
    const nextIndex = (currentIndex + delta + headers.length) % headers.length;
    headers[nextIndex]?.focus();
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getSectionContent(el: Element): string {
    return el.innerHTML || '';
  }

  private getHeaderClasses(isOpen: boolean, isDisabled: boolean): string {
    return [
      'flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition',
      'ml-panel-header',
      isOpen ? 'ml-panel-header-open' : '',
      isDisabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getChevronClasses(isOpen: boolean): string {
    return [
      'ml-panel-chevron transition-transform',
      isOpen ? 'rotate-180 ml-panel-chevron-open' : 'rotate-0',
    ].join(' ');
  }

  private getContentClasses(isOpen: boolean): string {
    return [
      'overflow-hidden transition-all duration-300 ease-in-out ml-panel-content',
      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel()}
        ${this.loading ? this.renderLoading() : this.renderSections()}
      </div>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div class="${cn('mb-2 text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    const items = [0, 1, 2];
    return html`
      <div class="space-y-2" aria-busy="true" aria-live="polite">
        ${items.map(
          () => html`
            <div
              class="h-12 w-full ml-skeleton animate-pulse"
            ></div>
          `
        )}
        <div class="sr-only">${this.msg.loading}</div>
      </div>
    `;
  }

  private renderSections(): TemplateResult {
    const sections = this.getSlots('Section');
    return html`
      <div class="space-y-2">
        ${sections.map((el, index) => {
          const title = el.getAttribute('title') || '';
          const subtitle = el.getAttribute('subtitle') || '';
          const icon = el.getAttribute('icon') || '';
          const isDisabled = this.disabled || el.hasAttribute('disabled');
          const isOpen = this.openSections.has(index);
          const headerId = `${this.localName}-header-${index}`;
          const contentId = `${this.localName}-content-${index}`;

          return html`
            <div class="w-full ml-panel-header" style="border-radius: var(--ml-radius-sm, 6px);">
              <div
                id=${headerId}
                role="button"
                tabindex=${isDisabled ? -1 : 0}
                aria-expanded=${isOpen ? 'true' : 'false'}
                aria-disabled=${isDisabled ? 'true' : 'false'}
                data-header="true"
                class=${this.getHeaderClasses(isOpen, isDisabled)}
                @click=${() => this.handleHeaderClick(index)}
                @keydown=${(e: KeyboardEvent) => this.handleHeaderKeydown(e, index)}
              >
                <div class="flex items-center gap-3">
                  ${icon
                    ? html`<span class="ml-text-muted">${unsafeHTML(icon)}</span>`
                    : html``}
                  <div class="flex flex-col">
                    <span class="text-sm ml-label">${title}</span>
                    ${subtitle
                      ? html`<span class="text-xs ml-text-muted">${subtitle}</span>`
                      : html``}
                  </div>
                </div>
                <span class=${this.getChevronClasses(isOpen)} aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4">
                    ${svg`<path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}
                  </svg>
                </span>
              </div>
              <div
                id=${contentId}
                role="region"
                aria-labelledby=${headerId}
                class=${this.getContentClasses(isOpen)}
              >
                <div class="px-4 pb-4 pt-0 text-sm ml-panel-content">
                  ${unsafeHTML(this.getSectionContent(el))}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
