/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-view-card-horizontal.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// VIEW CARD HORIZONTAL MOLECULE
// =============================================================================
// Skill Group: view + card
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

@customElement('groupviewcard--ml-view-card-horizontal')
export class ViewCardHorizontalMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'CardAction'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  clickable = false;

  @propertyDataSource({ type: Boolean })
  selected = false;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  updated() {
    this.applyEditingAttribute();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleCardClick() {
    if (!this.clickable || this.disabled || this.loading) return;
    this.dispatchEvent(new CustomEvent('cardClick', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.clickable || this.disabled || this.loading) return;
    const key = e.key;
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.handleCardClick();
    }
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private applyEditingAttribute() {
    const nodes = this.querySelectorAll('*');
    nodes.forEach((el) => {
      if (this.isEditing) {
        el.setAttribute('is-editing', 'true');
      } else {
        el.removeAttribute('is-editing');
      }
    });
  }

  private getContainerClasses(): string {
    return cn(
      'w-full rounded-lg border p-4 flex gap-4 items-start transition',
      'ml-card',
      this.selected ? 'ml-card-header' : '',
      this.clickable && !this.disabled
        ? 'cursor-pointer focus:outline-none focus:ring-2'
        : '',
      this.disabled ? 'ml-disabled' : '',
      this.cssClass,
    );
  }

  private renderHeader(): TemplateResult {
    const hasTitle = this.hasSlot('CardTitle');
    const hasDescription = this.hasSlot('CardDescription');
    const hasHeader = this.hasSlot('CardHeader');

    if (!hasHeader && !hasTitle && !hasDescription) {
      return html``;
    }

    const headerContent = this.getSlotContent('CardHeader');
    return html`
      <div class="mb-2">
        ${hasTitle
          ? html`<div class="${cn('text-sm font-semibold ml-label', this.getSlotClass('CardTitle'))}">${unsafeHTML(this.getSlotContent('CardTitle'))}</div>`
          : ''}
        ${hasDescription
          ? html`<div class="${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('CardDescription'))}">${unsafeHTML(this.getSlotContent('CardDescription'))}</div>`
          : ''}
        ${!hasTitle && !hasDescription && hasHeader
          ? html`<div class="${cn('text-sm ml-text', this.getSlotClass('CardHeader'))}">${unsafeHTML(headerContent)}</div>`
          : ''}
      </div>
    `;
  }

  private renderContentLeft(): TemplateResult {
    if (!this.hasSlot('CardContent')) return html``;
    return html`
      <div class="${cn('w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ml-card-media', this.getSlotClass('CardContent'))}">
        ${unsafeHTML(this.getSlotContent('CardContent'))}
      </div>
    `;
  }

  private renderFooter(): TemplateResult {
    if (!this.hasSlot('CardFooter')) return html``;
    return html`
      <div class="${cn('mt-2 text-xs ml-text-muted', this.getSlotClass('CardFooter'))}">
        ${unsafeHTML(this.getSlotContent('CardFooter'))}
      </div>
    `;
  }

  private renderAction(): TemplateResult {
    if (!this.hasSlot('CardAction')) return html``;
    return html`
      <div class="mt-3">
        ${unsafeHTML(this.getSlotContent('CardAction'))}
      </div>
    `;
  }

  private renderSkeleton(): TemplateResult {
    return html`
      <div class="w-full rounded-lg border ml-card p-4 flex gap-4 items-start animate-pulse">
        <div class="w-20 h-20 ml-skeleton rounded-md"></div>
        <div class="flex-1 min-w-0">
          <div class="h-4 w-2/3 ml-skeleton rounded"></div>
          <div class="mt-2 h-3 w-4/5 ml-skeleton rounded"></div>
          <div class="mt-3 h-3 w-1/3 ml-skeleton rounded"></div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    if (this.loading) {
      return this.renderSkeleton();
    }

    const role = this.clickable && !this.disabled ? 'button' : undefined;
    const tabIndex = this.clickable && !this.disabled ? 0 : undefined;

    return html`
      <div
        class="${this.getContainerClasses()}"
        role=${role || ''}
        tabindex=${tabIndex ?? ''}
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${this.handleCardClick}
        @keydown=${this.handleKeyDown}
      >
        ${this.renderContentLeft()}
        <div class="flex-1 min-w-0">
          ${this.renderHeader()}
          ${this.renderFooter()}
          ${this.renderAction()}
        </div>
      </div>
    `;
  }
}
