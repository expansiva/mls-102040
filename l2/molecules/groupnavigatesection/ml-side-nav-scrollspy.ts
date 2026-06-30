/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-side-nav-scrollspy.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SIDE NAV SCROLLSPY MOLECULE
// =============================================================================
// Skill Group: groupNavigateSection
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  navigation: 'Navigation',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    navigation: 'Navegação',
  },
};
/// **collab_i18n_end**

interface ParsedTab {
  value: string;
  title: string;
  icon: string;
  disabled: boolean;
  content: string;
}

@customElement('groupnavigatesection--ml-side-nav-scrollspy')
export class MlSideNavScrollspyMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Tab'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private parsedTabs: ParsedTab[] = [];

  @state()
  private activeValue: string = '';

  @state()
  private isScrolling: boolean = false;

  private scrollTimeout: number | null = null;
  private observer: IntersectionObserver | null = null;
  private sectionVisibility: Map<string, number> = new Map();

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.handleScroll);
    this.cleanupObserver();
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  firstUpdated() {
    this.parseTabs();
    this.initializeActiveValue();
    this.setupIntersectionObserver();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      this.syncActiveValue();
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: unknown) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.syncActiveValue();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseTabs() {
    const tabElements = this.getSlots('Tab');
    this.parsedTabs = tabElements.map(el => ({
      value: el.getAttribute('value') || '',
      title: el.getAttribute('title') || '',
      icon: el.getAttribute('icon') || '',
      disabled: el.hasAttribute('disabled'),
      content: el.innerHTML,
    }));
  }

  private initializeActiveValue() {
    if (this.value !== null && this.value !== '') {
      const tab = this.parsedTabs.find(t => t.value === this.value && !t.disabled);
      if (tab) {
        this.activeValue = tab.value;
        return;
      }
    }
    const firstEnabled = this.parsedTabs.find(t => !t.disabled);
    if (firstEnabled) {
      this.activeValue = firstEnabled.value;
      this.value = firstEnabled.value;
    }
  }

  private syncActiveValue() {
    if (this.value !== null && this.value !== '') {
      const tab = this.parsedTabs.find(t => t.value === this.value && !t.disabled);
      if (tab) {
        this.activeValue = tab.value;
      }
    }
  }

  // ===========================================================================
  // INTERSECTION OBSERVER
  // ===========================================================================
  private setupIntersectionObserver() {
    this.cleanupObserver();

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.isScrolling) return;

        entries.forEach(entry => {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            this.sectionVisibility.set(sectionId, entry.intersectionRatio);
          }
        });

        this.updateActiveFromVisibility();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    this.parsedTabs.forEach(tab => {
      const section = document.getElementById(tab.value);
      if (section) {
        this.observer?.observe(section);
      }
    });
  }

  private cleanupObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.sectionVisibility.clear();
  }

  private updateActiveFromVisibility() {
    if (this.disabled) return;

    let maxVisibility = 0;
    let mostVisibleSection = '';

    this.sectionVisibility.forEach((visibility, sectionId) => {
      const tab = this.parsedTabs.find(t => t.value === sectionId);
      if (tab && !tab.disabled && visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleSection = sectionId;
      }
    });

    if (mostVisibleSection && mostVisibleSection !== this.activeValue) {
      this.activeValue = mostVisibleSection;
      this.value = mostVisibleSection;
      this.emitChange(mostVisibleSection);
    }
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleScroll = () => {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = window.setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  };

  private handleTabClick(tab: ParsedTab) {
    if (this.disabled || tab.disabled) return;

    this.isScrolling = true;
    this.activeValue = tab.value;
    this.value = tab.value;
    this.emitChange(tab.value);
    this.scrollToSection(tab.value);
  }

  private handleKeyDown(e: KeyboardEvent, tab: ParsedTab, index: number) {
    if (this.disabled) return;

    const enabledTabs = this.parsedTabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex(t => t.value === tab.value);

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < enabledTabs.length - 1) {
          this.focusTab(enabledTabs[currentIndex + 1].value);
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) {
          this.focusTab(enabledTabs[currentIndex - 1].value);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleTabClick(tab);
        break;
      case 'Home':
        e.preventDefault();
        if (enabledTabs.length > 0) {
          this.focusTab(enabledTabs[0].value);
        }
        break;
      case 'End':
        e.preventDefault();
        if (enabledTabs.length > 0) {
          this.focusTab(enabledTabs[enabledTabs.length - 1].value);
        }
        break;
    }
  }

  private focusTab(value: string) {
    const tabElement = this.querySelector(`[data-tab-value="${value}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.focus();
    }
  }

  private scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private emitChange(value: string) {
    const tab = this.parsedTabs.find(t => t.value === value);
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value, title: tab?.title || '' },
    }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getNavClasses(): string {
    return [
      'flex flex-col gap-1 w-full',
      this.disabled ? 'ml-disabled' : '',
    ].filter(Boolean).join(' ');
  }

  private getTabClasses(tab: ParsedTab, isActive: boolean): string {
    return [
      'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200',
      'border-l-2 -ml-px',
      'ml-scrollspy-item',
      isActive ? 'ml-scrollspy-item-active font-medium' : '',
      tab.disabled || this.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getContainerClasses(): string {
    return cn('flex gap-6 w-full', this.cssClass);
  }

  private getSidebarClasses(): string {
    return [
      'flex-shrink-0 w-48 sticky top-4 self-start',
    ].join(' ');
  }

  private getContentClasses(): string {
    return [
      'flex-1 min-w-0',
    ].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'text-xs font-semibold uppercase tracking-wider mb-3 px-3',
      'ml-label',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return this.renderLoading();
    }

    const labelContent = this.getSlotContent('Label');
    const activeTab = this.parsedTabs.find(t => t.value === this.activeValue);

    return html`
      <div class=${this.getContainerClasses()}>
        <aside class=${this.getSidebarClasses()}>
          <nav
            role="tablist"
            aria-label=${labelContent || this.msg.navigation}
            aria-orientation="vertical"
            class=${this.getNavClasses()}
          >
            ${labelContent ? html`
              <div class=${this.getLabelClasses()}>
                ${unsafeHTML(labelContent)}
              </div>
            ` : html``}
            ${this.parsedTabs.map((tab, index) => this.renderTab(tab, index))}
          </nav>
        </aside>
        <div
          class=${this.getContentClasses()}
          role="tabpanel"
          aria-labelledby=${activeTab ? `tab-${activeTab.value}` : ''}
        >
          ${activeTab ? html`${unsafeHTML(activeTab.content)}` : html``}
        </div>
      </div>
      ${this.error ? this.renderError() : html``}
    `;
  }

  private renderTab(tab: ParsedTab, index: number): TemplateResult {
    const isActive = tab.value === this.activeValue;
    const isDisabled = tab.disabled || this.disabled;

    return html`
      <button
        id="tab-${tab.value}"
        data-tab-value=${tab.value}
        role="tab"
        aria-selected=${isActive ? 'true' : 'false'}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        aria-controls="panel-${tab.value}"
        tabindex=${isActive && !isDisabled ? '0' : '-1'}
        class=${this.getTabClasses(tab, isActive)}
        @click=${() => this.handleTabClick(tab)}
        @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, tab, index)}
        ?disabled=${isDisabled}
      >
        ${tab.icon ? html`<span class="flex-shrink-0">${tab.icon}</span>` : html``}
        <span class="truncate">${tab.title}</span>
        ${isActive ? html`
          <span class="ml-auto w-1.5 h-1.5 rounded-full ml-scrollspy-dot flex-shrink-0"></span>
        ` : html``}
      </button>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class=${this.getContainerClasses()}>
        <aside class=${this.getSidebarClasses()}>
          <nav class=${this.getNavClasses()}>
            <div class="animate-pulse space-y-2 px-3">
              <div class="h-3 w-16 ml-skeleton rounded"></div>
              <div class="h-8 w-full ml-skeleton rounded"></div>
              <div class="h-8 w-full ml-skeleton rounded"></div>
              <div class="h-8 w-full ml-skeleton rounded"></div>
              <div class="h-8 w-3/4 ml-skeleton rounded"></div>
            </div>
          </nav>
        </aside>
        <div class=${this.getContentClasses()}>
          <div class="animate-pulse space-y-4">
            <div class="h-6 w-1/3 ml-skeleton rounded"></div>
            <div class="h-4 w-full ml-skeleton rounded"></div>
            <div class="h-4 w-full ml-skeleton rounded"></div>
            <div class="h-4 w-2/3 ml-skeleton rounded"></div>
          </div>
        </div>
      </div>
    `;
  }

  private renderError(): TemplateResult {
    return html`
      <p class="mt-2 text-xs ml-error-text">
        ${unsafeHTML(this.error)}
      </p>
    `;
  }
}
