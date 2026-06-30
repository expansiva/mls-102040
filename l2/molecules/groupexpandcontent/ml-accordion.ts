/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-accordion.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// ML ACCORDION MOLECULE
// =============================================================================
// Skill Group: expand + content
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
    loading: 'Loading...',
    empty: 'No sections available',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
    en: message_en,
    pt: {
        loading: 'Carregando...',
        empty: 'Nenhuma seção disponível',
    },
};
/// **collab_i18n_end**

@customElement('groupexpandcontent--ml-accordion')
export class MlAccordionMolecule extends MoleculeAuraElement {
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
        const sections = this.getSlots('Section');
        const initialOpen = new Set<number>();
        sections.forEach((el, index) => {
            if (el.hasAttribute('expanded')) {
                if (!this.multiple && initialOpen.size > 0) return;
                initialOpen.add(index);
            }
        });
        this.openSections = new Set(initialOpen);
        this.requestUpdate();
    }
    // ===========================================================================
    // EVENT HANDLERS
    // ===========================================================================
    private handleToggle(index: number, title: string, isDisabled: boolean) {
        if (this.disabled || this.loading || isDisabled) return;
        const next = new Set(this.openSections);
        const isOpen = next.has(index);
        if (isOpen) {
            next.delete(index);
        } else {
            if (!this.multiple) {
                next.clear();
            }
            next.add(index);
        }
        this.openSections = new Set(next);
        this.dispatchEvent(new CustomEvent('toggle', {
            bubbles: true,
            composed: true,
            detail: { index, title, expanded: !isOpen }
        }));
    }

    private handleHeaderKeydown(event: KeyboardEvent, index: number, title: string, isDisabled: boolean) {
        if (this.disabled || this.loading) return;
        const target = event.currentTarget as HTMLElement;
        if (!target) return;
        const key = event.key;
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            this.handleToggle(index, title, isDisabled);
            return;
        }
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            event.preventDefault();
            const headers = Array.from(this.querySelectorAll<HTMLElement>('[data-accordion-header="true"]'));
            const currentIndex = headers.indexOf(target);
            if (currentIndex === -1) return;
            const direction = key === 'ArrowDown' ? 1 : -1;
            const nextHeader = this.findNextEnabledHeader(headers, currentIndex, direction);
            nextHeader?.focus();
        }
    }

    private findNextEnabledHeader(headers: HTMLElement[], startIndex: number, direction: number): HTMLElement | null {
        const total = headers.length;
        for (let i = 1; i <= total; i += 1) {
            const idx = (startIndex + direction * i + total) % total;
            const el = headers[idx];
            if (el && el.getAttribute('aria-disabled') !== 'true') {
                return el;
            }
        }
        return null;
    }
    // ===========================================================================
    // HELPERS
    // ===========================================================================
    private getSectionContent(el: Element): string {
        const template = el.querySelector(':scope > template');
        return template ? template.innerHTML : el.innerHTML;
    }

    private getHeaderClasses(isOpen: boolean, isDisabled: boolean): string {
        return [
            'w-full flex items-center justify-between gap-3 px-4 py-3 text-sm',
            'ml-accordion-header',
            isOpen ? 'ml-accordion-header-open' : '',
            (this.disabled || isDisabled) ? 'ml-disabled' : 'cursor-pointer',
        ].filter(Boolean).join(' ');
    }

    private getContentClasses(isOpen: boolean): string {
        return [
            'overflow-hidden transition-all duration-200 ml-accordion-content',
            isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        ].filter(Boolean).join(' ');
    }

    private getChevronClasses(isOpen: boolean): string {
        return [
            'flex items-center justify-center transition-transform duration-200 ml-accordion-chevron',
            isOpen ? 'rotate-180 ml-accordion-chevron-open' : 'rotate-0',
        ].filter(Boolean).join(' ');
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
        return html`
<div class="space-y-2">
<div class="h-10 w-full ml-skeleton animate-pulse"></div>
<div class="h-10 w-full ml-skeleton animate-pulse"></div>
<div class="text-xs ml-text-muted">${this.msg.loading}</div>
</div>
`;
    }

    private renderSections(): TemplateResult {
        const sectionElements = this.getSlots('Section');
        if (sectionElements.length === 0) {
            return html`
<div class="text-sm ml-text-muted">${this.msg.empty}</div>
`;
        }

        return html`
<div class="space-y-2">
${sectionElements.map((el, index) => this.renderSection(el, index))}
</div>
`;
    }

    private renderSection(el: Element, index: number): TemplateResult {
        const title = el.getAttribute('title') || '';
        const isDisabled = el.hasAttribute('disabled');
        const isOpen = this.openSections.has(index);
        const headerId = `accordion-header-${index}`;
        const contentId = `accordion-content-${index}`;
        const content = this.getSectionContent(el);
        return html`
<div>
<div
id=${headerId}
data-accordion-header="true"
role="button"
aria-expanded=${String(isOpen)}
aria-controls=${contentId}
aria-disabled=${String(this.disabled || isDisabled)}
class=${this.getHeaderClasses(isOpen, isDisabled)}
tabindex=${this.disabled || isDisabled ? -1 : 0}
@click=${() => this.handleToggle(index, title, isDisabled)}
@keydown=${(e: KeyboardEvent) => this.handleHeaderKeydown(e, index, title, isDisabled)}
>
<span class="truncate">${title}</span>
<span class=${this.getChevronClasses(isOpen)} aria-hidden="true">
<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
</svg>
</span>
</div>
<div
id=${contentId}
role="region"
aria-labelledby=${headerId}
class=${this.getContentClasses(isOpen)}
>
<div class="px-4 pb-4 pt-2 text-sm ml-accordion-content">
${unsafeHTML(content)}
</div>
</div>
</div>
`;
    }
}
