/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-pagination-control.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  page: 'Page',
  goToPage: 'Go to page',
  pagination: 'Pagination',
  currentPageAnnounce: 'Page {current} of {total}',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    firstPage: 'Primeira página',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    lastPage: 'Última página',
    page: 'Página',
    goToPage: 'Ir para página',
    pagination: 'Paginação',
    currentPageAnnounce: 'Página {current} de {total}',
  },
};
/// **collab_i18n_end**

// =============================================================================
// PAGINATION CONTROL MOLECULE
// =============================================================================
// Skill Group: groupTriggerAction
// This molecule does NOT contain business logic.

@customElement('grouptriggeraction--ml-pagination-control')
export class MlPaginationControlMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Icon'];

  // ===========================================================================
  // PROPERTIES — From groupTriggerAction contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  size: string = 'md';

  @propertyDataSource({ type: String })
  type: string = 'button';

  @propertyDataSource({ type: String, attribute: 'icon-position' })
  iconPosition: string = 'start';

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // PROPERTIES — Pagination-specific
  // ===========================================================================
  @propertyDataSource({ type: Number, attribute: 'current-page' })
  currentPage: number = 1;

  @propertyDataSource({ type: Number, attribute: 'total-pages' })
  totalPages: number = 1;

  @propertyDataSource({ type: Number, attribute: 'visible-pages' })
  visiblePages: number = 5;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private announcedText: string = '';

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('currentPage') || changedProps.has('totalPages')) {
      this.updateAnnouncement();
    }
  }

  handleIcaStateChange(key: string, _value: any) {
    const currentPageAttr = this.getAttribute('current-page');
    const totalPagesAttr = this.getAttribute('total-pages');
    if (
      currentPageAttr === `{{${key}}}` ||
      totalPagesAttr === `{{${key}}}`
    ) {
      this.updateAnnouncement();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private normalizePage(page: number | undefined | null): number {
    const n = Number(page);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.floor(n);
  }

  private normalizeTotal(total: number | undefined | null): number {
    const n = Number(total);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.floor(n);
  }

  private normalizeVisible(visible: number | undefined | null): number {
    const n = Number(visible);
    if (!Number.isFinite(n) || n < 1) return 5;
    return Math.floor(n);
  }

  private getSafeCurrent(): number {
    const total = this.normalizeTotal(this.totalPages);
    const current = this.normalizePage(this.currentPage);
    return Math.min(current, total);
  }

  private updateAnnouncement(): void {
    const current = this.getSafeCurrent();
    const total = this.normalizeTotal(this.totalPages);
    this.announcedText = this.msg.currentPageAnnounce
      .replace('{current}', String(current))
      .replace('{total}', String(total));
  }

  /**
   * Builds the visible page window, always including the current page.
   * Returns a mixed list of page numbers and ellipsis markers.
   */
  private buildPageItems(): Array<number | 'ellipsis-start' | 'ellipsis-end'> {
    const total = this.normalizeTotal(this.totalPages);
    const current = this.getSafeCurrent();
    const maxVisible = this.normalizeVisible(this.visiblePages);

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Reserve slots for first/last when ellipsis is shown
    const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];

    // Window size for the sliding range around current
    // Always try to show: [1] … [window] … [total]
    const sideCount = Math.max(1, maxVisible - 2); // pages in the middle window
    let start = Math.max(2, current - Math.floor((sideCount - 1) / 2));
    let end = start + sideCount - 1;

    if (end >= total) {
      end = total - 1;
      start = Math.max(2, end - sideCount + 1);
    }

    // Ensure current is inside the window
    if (current < start) start = Math.max(2, current);
    if (current > end) end = Math.min(total - 1, current);

    // First page always
    items.push(1);

    if (start > 2) {
      items.push('ellipsis-start');
    } else if (start === 2) {
      // no ellipsis, page 2 will be included in the loop
    }

    for (let p = start; p <= end; p++) {
      items.push(p);
    }

    if (end < total - 1) {
      items.push('ellipsis-end');
    }

    // Last page always (if more than 1)
    if (total > 1) {
      items.push(total);
    }

    return items;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handlePageAction(targetPage: number) {
    console.log('clicou em handlePageAction')
    if (this.disabled || this.loading) return;

    const total = this.normalizeTotal(this.totalPages);
    const current = this.getSafeCurrent();
    const page = Math.min(Math.max(1, targetPage), total);

    if (page === current) return;

    this.dispatchEvent(new CustomEvent('action', {
      bubbles: true,
      composed: true,
      detail: { page },
    }));
  }

  private handleFirst() {
    this.handlePageAction(1);
  }

  private handlePrevious() {
    this.handlePageAction(this.getSafeCurrent() - 1);
  }

  private handleNext() {
    this.handlePageAction(this.getSafeCurrent() + 1);
  }

  private handleLast() {
    this.handlePageAction(this.normalizeTotal(this.totalPages));
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================
  private getRootClasses(): string {
    return [
      'inline-flex items-center gap-1',
      'ml-pagination',
      this.disabled ? 'ml-disabled' : '',
      this.loading ? 'ml-loading' : '',
      `ml-size-${this.size || 'md'}`,
    ].filter(Boolean).join(' ');
  }

  private getNavButtonClasses(isDisabled: boolean): string {
    return [
      'inline-flex items-center justify-center',
      'min-w-[2rem] h-8 px-2 text-sm',
      'rounded-md border transition',
      'ml-pagination-nav',
      isDisabled ? 'ml-pagination-nav-disabled ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getPageButtonClasses(isCurrent: boolean): string {
    return [
      'inline-flex items-center justify-center',
      'min-w-[2rem] h-8 px-2 text-sm font-semibold',
      'rounded-md border transition',
      'ml-pagination-page',
      isCurrent ? 'ml-pagination-page-current' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getEllipsisClasses(): string {
    return [
      'inline-flex items-center justify-center',
      'min-w-[2rem] h-8 px-1 text-sm',
      'ml-pagination-ellipsis',
      'ml-text-muted',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLoading(): TemplateResult {
    return html`
      <div
        class="${cn(this.getRootClasses(), this.cssClass)}"
        role="navigation"
        aria-label=${this.msg.pagination}
        aria-busy="true"
        aria-disabled="true"
      >
        <span class="inline-flex items-center gap-2 text-sm ml-text-muted" aria-live="polite">
          <span class="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin ml-spinner" aria-hidden="true"></span>
          ${this.msg.loading}
        </span>
      </div>
    `;
  }

  private renderNavButton(
    kind: 'first' | 'previous' | 'next' | 'last',
    label: string,
    symbol: string,
    isDisabled: boolean,
    onClick: () => void,
  ): TemplateResult {
    return html`
      <button
        type="button"
        class=${this.getNavButtonClasses(isDisabled)}
        ?disabled=${isDisabled || this.disabled}
        aria-label=${label}
        aria-disabled=${isDisabled || this.disabled ? 'true' : nothing}
        @click=${onClick}
        data-nav=${kind}
      >
        <span aria-hidden="true">${symbol}</span>
      </button>
    `;
  }

  private renderPageButton(page: number, isCurrent: boolean): TemplateResult {
    const label = isCurrent
      ? `${this.msg.page} ${page}`
      : `${this.msg.goToPage} ${page}`;

    return html`
      <button
        type="button"
        class=${this.getPageButtonClasses(isCurrent)}
        ?disabled=${this.disabled || isCurrent}
        aria-label=${label}
        aria-current=${isCurrent ? 'page' : nothing}
        @click=${() => this.handlePageAction(page)}
        data-page=${page}
      >
        ${page}
      </button>
    `;
  }

  private renderEllipsis(key: string): TemplateResult {
    return html`
      <span class=${this.getEllipsisClasses()} aria-hidden="true" data-ellipsis=${key}>
        …
      </span>
    `;
  }

  private renderPageItems(): TemplateResult[] {
    const current = this.getSafeCurrent();
    const items = this.buildPageItems();

    return items.map((item) => {
      if (item === 'ellipsis-start') return this.renderEllipsis('start');
      if (item === 'ellipsis-end') return this.renderEllipsis('end');
      return this.renderPageButton(item as number, (item as number) === current);
    });
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return this.renderLoading();
    }

    const current = this.getSafeCurrent();
    const total = this.normalizeTotal(this.totalPages);
    const isFirst = current <= 1;
    const isLast = current >= total;
    const navDisabled = this.disabled;

    const announce = this.announcedText || this.msg.currentPageAnnounce
      .replace('{current}', String(current))
      .replace('{total}', String(total));

    return html`
      <nav
        class="${cn(this.getRootClasses(), this.cssClass)}"
        role="navigation"
        aria-label=${this.msg.pagination}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        ${this.renderNavButton(
          'first',
          this.msg.firstPage,
          '«',
          isFirst || navDisabled,
          () => this.handleFirst(),
        )}
        ${this.renderNavButton(
          'previous',
          this.msg.previousPage,
          '‹',
          isFirst || navDisabled,
          () => this.handlePrevious(),
        )}

        <div class="inline-flex items-center gap-1 ml-pagination-pages" role="list">
          ${this.renderPageItems()}
        </div>

        ${this.renderNavButton(
          'next',
          this.msg.nextPage,
          '›',
          isLast || navDisabled,
          () => this.handleNext(),
        )}
        ${this.renderNavButton(
          'last',
          this.msg.lastPage,
          '»',
          isLast || navDisabled,
          () => this.handleLast(),
        )}

        <span class="sr-only" aria-live="polite" aria-atomic="true">${announce}</span>
      </nav>
    `;
  }
}
