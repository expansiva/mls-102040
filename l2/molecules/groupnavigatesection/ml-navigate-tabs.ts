/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-navigate-tabs.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// NAVIGATE TABS MOLECULE
// =============================================================================
// Skill Group: groupNavigateSection
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
  pt: {
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

interface ParsedTab {
  value: string;
  title: string;
  icon: string;
  disabled: boolean;
  content: string;
  element: Element;
}

@customElement('groupnavigatesection--ml-navigate-tabs')
export class MlNavigateTabsMolecule extends MoleculeAuraElement {
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
  private focusedIndex: number = 0;

  @state()
  private indicatorStyle: string = '';

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private tabListRef: HTMLElement | null = null;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseTabs();
    this.initializeActiveTab();
    requestAnimationFrame(() => this.updateIndicator());
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value')) {
      requestAnimationFrame(() => this.updateIndicator());
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: unknown) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.value = value as string | null;
      requestAnimationFrame(() => this.updateIndicator());
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // TAB PARSING
  // ===========================================================================
  private parseTabs() {
    const tabElements = this.getSlots('Tab');
    this.parsedTabs = tabElements.map((el, index) => ({
      value: el.getAttribute('value') || String(index),
      title: el.getAttribute('title') || '',
      icon: el.getAttribute('icon') || '',
      disabled: el.hasAttribute('disabled'),
      content: el.innerHTML,
      element: el,
    }));
  }

  private initializeActiveTab() {
    if (this.value === null && this.parsedTabs.length > 0) {
      const firstEnabled = this.parsedTabs.find(tab => !tab.disabled);
      if (firstEnabled) {
        this.value = firstEnabled.value;
      }
    }
    this.updateFocusedIndex();
  }

  private updateFocusedIndex() {
    const index = this.parsedTabs.findIndex(tab => tab.value === this.value);
    this.focusedIndex = index >= 0 ? index : 0;
  }

  private getActiveTab(): ParsedTab | undefined {
    return this.parsedTabs.find(tab => tab.value === this.value);
  }

  // ===========================================================================
  // INDICATOR
  // ===========================================================================
  private updateIndicator() {
    const tabList = this.querySelector('[role="tablist"]') as HTMLElement;
    if (!tabList) return;

    const activeTabEl = tabList.querySelector('[aria-selected="true"]') as HTMLElement;
    if (!activeTabEl) {
      this.indicatorStyle = 'opacity: 0;';
      return;
    }

    const tabListRect = tabList.getBoundingClientRect();
    const activeRect = activeTabEl.getBoundingClientRect();

    const left = activeRect.left - tabListRect.left + tabList.scrollLeft;
    const width = activeRect.width;

    this.indicatorStyle = `left: ${left}px; width: ${width}px; opacity: 1;`;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleTabClick(tab: ParsedTab) {
    if (this.disabled || this.loading || tab.disabled) return;
    this.selectTab(tab);
  }

  private selectTab(tab: ParsedTab) {
    if (tab.disabled) return;
    this.value = tab.value;
    this.updateFocusedIndex();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: tab.value, title: tab.title },
    }));
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.disabled || this.loading) return;

    const enabledTabs = this.parsedTabs.filter(tab => !tab.disabled);
    if (enabledTabs.length === 0) return;

    const currentEnabledIndex = enabledTabs.findIndex(tab => tab.value === this.parsedTabs[this.focusedIndex]?.value);

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.moveFocus(enabledTabs, currentEnabledIndex, -1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.moveFocus(enabledTabs, currentEnabledIndex, 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const focusedTab = this.parsedTabs[this.focusedIndex];
        if (focusedTab && !focusedTab.disabled) {
          this.selectTab(focusedTab);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (enabledTabs.length > 0) {
          this.focusTab(enabledTabs[0]);
        }
        break;
      case 'End':
        e.preventDefault();
        if (enabledTabs.length > 0) {
          this.focusTab(enabledTabs[enabledTabs.length - 1]);
        }
        break;
    }
  }

  private moveFocus(enabledTabs: ParsedTab[], currentIndex: number, direction: number) {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = enabledTabs.length - 1;
    if (newIndex >= enabledTabs.length) newIndex = 0;
    this.focusTab(enabledTabs[newIndex]);
  }

  private focusTab(tab: ParsedTab) {
    const index = this.parsedTabs.findIndex(t => t.value === tab.value);
    if (index >= 0) {
      this.focusedIndex = index;
      const tabEl = this.querySelector(`[data-tab-value="${tab.value}"]`) as HTMLElement;
      tabEl?.focus();
    }
  }

  // ===========================================================================
  // TOUCH HANDLERS
  // ===========================================================================
  private handleTouchStart(e: TouchEvent) {
    if (this.disabled || this.loading) return;
    this.touchStartX = e.touches[0].clientX;
  }

  private handleTouchMove(e: TouchEvent) {
    if (this.disabled || this.loading) return;
    this.touchEndX = e.touches[0].clientX;
  }

  private handleTouchEnd() {
    if (this.disabled || this.loading) return;

    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) < swipeThreshold) return;

    const enabledTabs = this.parsedTabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.value === this.value);

    if (diff > 0) {
      // Swipe left - next tab
      const nextIndex = currentIndex + 1;
      if (nextIndex < enabledTabs.length) {
        this.selectTab(enabledTabs[nextIndex]);
      }
    } else {
      // Swipe right - previous tab
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        this.selectTab(enabledTabs[prevIndex]);
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  // ===========================================================================
  // STYLES
  // ===========================================================================
  private getContainerClasses(): string {
    return cn([
      'w-full',
      this.disabled ? 'ml-disabled' : '',
    ].filter(Boolean).join(' '), this.cssClass);
  }

  private getTabListClasses(): string {
    return [
      'relative flex overflow-x-auto scrollbar-hide',
      'border-b ml-tab-list',
    ].join(' ');
  }

  private getTabClasses(tab: ParsedTab, isActive: boolean, isFocused: boolean): string {
    return [
      'relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap',
      'transition-colors duration-200 outline-none',
      'ml-tab',
      isActive ? 'ml-tab-active' : '',
      tab.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getIndicatorClasses(): string {
    return [
      'absolute bottom-0 h-0.5 ml-tab-indicator',
      'transition-all duration-300 ease-out',
    ].join(' ');
  }

  private getPanelClasses(): string {
    return [
      'w-full py-4',
      'ml-tab-panel ml-text',
    ].join(' ');
  }

  private getLoadingClasses(): string {
    return [
      'flex items-center justify-center py-8',
      'ml-text-muted',
    ].join(' ');
  }

  private getErrorClasses(): string {
    return [
      'mt-2 text-sm ml-error-text',
    ].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'block mb-2 text-sm font-medium',
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
    const activeTab = this.getActiveTab();

    return html`
      <div class=${this.getContainerClasses()}>
        ${labelContent ? this.renderLabel(labelContent) : html``}
        ${this.renderTabList()}
        ${this.error ? this.renderError() : html``}
        ${activeTab ? this.renderPanel(activeTab) : html``}
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class=${this.getLoadingClasses()}>
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  private renderLabel(content: string): TemplateResult {
    return html`
      <span class=${this.getLabelClasses()} id="tab-label">
        ${unsafeHTML(content)}
      </span>
    `;
  }

  private renderTabList(): TemplateResult {
    const labelContent = this.getSlotContent('Label');

    return html`
      <div
        role="tablist"
        class=${this.getTabListClasses()}
        aria-label=${labelContent || ''}
        @keydown=${this.handleKeyDown}
        @touchstart=${this.handleTouchStart}
        @touchmove=${this.handleTouchMove}
        @touchend=${this.handleTouchEnd}
      >
        ${this.parsedTabs.map((tab, index) => this.renderTab(tab, index))}
        <div
          class=${this.getIndicatorClasses()}
          style=${this.indicatorStyle}
          aria-hidden="true"
        ></div>
      </div>
    `;
  }

  private renderTab(tab: ParsedTab, index: number): TemplateResult {
    const isActive = tab.value === this.value;
    const isFocused = index === this.focusedIndex;
    const panelId = `panel-${tab.value}`;
    const tabId = `tab-${tab.value}`;

    return html`
      <button
        id=${tabId}
        role="tab"
        type="button"
        class=${this.getTabClasses(tab, isActive, isFocused)}
        data-tab-value=${tab.value}
        aria-selected=${isActive ? 'true' : 'false'}
        aria-disabled=${tab.disabled ? 'true' : 'false'}
        aria-controls=${panelId}
        tabindex=${isActive ? '0' : '-1'}
        @click=${() => this.handleTabClick(tab)}
      >
        ${tab.icon ? html`<span aria-hidden="true">${tab.icon}</span>` : html``}
        <span>${tab.title}</span>
      </button>
    `;
  }

  private renderPanel(tab: ParsedTab): TemplateResult {
    const panelId = `panel-${tab.value}`;
    const tabId = `tab-${tab.value}`;

    return html`
      <div
        id=${panelId}
        role="tabpanel"
        class=${this.getPanelClasses()}
        aria-labelledby=${tabId}
        tabindex="0"
      >
        ${unsafeHTML(tab.content)}
      </div>
    `;
  }

  private renderError(): TemplateResult {
    return html`
      <p class=${this.getErrorClasses()}>
        ${unsafeHTML(this.error)}
      </p>
    `;
  }
}
