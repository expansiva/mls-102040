/// <mls fileReference="_102040_/l2/molecules/groupnavigatemain/ml-sidebar-nav.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// ML SIDEBAR NAV MOLECULE
// =============================================================================
// Skill Group: groupNavigateMain
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  navigation: 'Sidebar navigation',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    collapse: 'Recolher menu',
    expand: 'Expandir menu',
    navigation: 'Menu lateral',
  },
};
/// **collab_i18n_end**

// =============================================================================
// TYPES
// =============================================================================
interface NavItem {
  value: string;
  label: string;
  icon: string;
  badge: string | null;
  disabled: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@customElement('groupnavigatemain--ml-sidebar-nav')
export class MlSidebarNavMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Item', 'Group', 'Footer'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: Boolean })
  collapsed = false;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state() private collapsedGroups: Set<string> = new Set();

  // ===========================================================================
  // PARSERS
  // ===========================================================================
  private parseItem(el: Element): NavItem {
    return {
      value: el.getAttribute('value') || '',
      label: el.textContent?.trim() || '',
      icon: el.getAttribute('icon') || '',
      badge: el.getAttribute('badge'),
      disabled: el.hasAttribute('disabled'),
    };
  }

  private parseTopItems(): NavItem[] {
    return this.getSlots('Item')
      .filter(el => {
        const parentTag = el.parentElement?.tagName?.toLowerCase();
        return parentTag !== 'group' && parentTag !== 'footer';
      })
      .map(el => this.parseItem(el));
  }

  private parseGroups(): NavGroup[] {
    return this.getSlots('Group').map(el => ({
      label: el.getAttribute('label') || '',
      items: Array.from(el.querySelectorAll('Item')).map(item => this.parseItem(item)),
    }));
  }

  private parseFooterItems(): NavItem[] {
    const footerEl = this.getSlot('Footer');
    if (!footerEl) return [];
    return Array.from(footerEl.querySelectorAll('Item')).map(item => this.parseItem(item));
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleItemClick(item: NavItem) {
    if (this.disabled || item.disabled) return;
    this.value = item.value;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: item.value, label: item.label, badge: item.badge },
    }));
  }

  private handleToggleCollapse() {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(new CustomEvent('collapse', {
      bubbles: true,
      composed: true,
      detail: { collapsed: this.collapsed },
    }));
  }

  private handleToggleGroup(groupLabel: string) {
    const next = new Set(this.collapsedGroups);
    if (next.has(groupLabel)) next.delete(groupLabel);
    else next.add(groupLabel);
    this.collapsedGroups = next;
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================
  private getItemClasses(item: NavItem): string {
    const isActive = this.value === item.value;
    const isDisabled = this.disabled || item.disabled;
    return [
      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      isActive
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
        : 'text-slate-700 dark:text-slate-300',
      !isActive && !isDisabled
        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
        : '',
      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      this.collapsed ? 'justify-center' : '',
    ].filter(Boolean).join(' ');
  }

  private getIconClasses(item: NavItem): string {
    const isActive = this.value === item.value;
    return [
      'flex h-5 w-5 flex-shrink-0 items-center justify-center',
      isActive
        ? 'text-sky-600 dark:text-sky-400'
        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderItemIcon(item: NavItem): TemplateResult {
    if (item.icon) {
      return html`<span class=${this.getIconClasses(item)}>${unsafeHTML(item.icon)}</span>`;
    }
    // Fallback: initials when no icon provided
    const initials = item.label.trim().slice(0, 2).toUpperCase();
    return html`
      <span class="${this.getIconClasses(item)} rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-bold">
        ${initials}
      </span>
    `;
  }

  private renderNavItem(item: NavItem): TemplateResult {
    const isActive = this.value === item.value;
    const isDisabled = this.disabled || item.disabled;

    return html`
      <button
        class=${this.getItemClasses(item)}
        type="button"
        title=${this.collapsed ? item.label : ''}
        aria-current=${isActive ? 'page' : nothing}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        @click=${() => this.handleItemClick(item)}
      >
        ${this.renderItemIcon(item)}

        ${!this.collapsed ? html`
          <span class="flex-1 truncate text-left">${item.label}</span>
          ${item.badge ? html`
            <span class="ml-auto inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900/50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
              ${item.badge}
            </span>
          ` : nothing}
        ` : html`
          ${item.badge ? html`
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
          ` : nothing}
        `}
      </button>
    `;
  }

  private renderGroup(group: NavGroup): TemplateResult {
    if (this.collapsed) {
      return html`
        <div class="space-y-1">
          <div class="mx-3 my-2 h-px bg-slate-200 dark:bg-slate-700"></div>
          ${group.items.map(item => this.renderNavItem(item))}
        </div>
      `;
    }

    const isGroupCollapsed = this.collapsedGroups.has(group.label);

    return html`
      <div class="space-y-1">
        ${group.label ? html`
          <button
            class="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition focus:outline-none"
            type="button"
            @click=${() => this.handleToggleGroup(group.label)}
          >
            <span class="truncate">${group.label}</span>
            <svg
              class="ml-2 h-3 w-3 flex-shrink-0 transition-transform ${isGroupCollapsed ? '' : 'rotate-90'}"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
          ${!isGroupCollapsed
            ? html`<div class="space-y-1">${group.items.map(item => this.renderNavItem(item))}</div>`
            : nothing}
        ` : html`
          <div class="space-y-1">${group.items.map(item => this.renderNavItem(item))}</div>
        `}
      </div>
    `;
  }

  private renderCollapseToggle(): TemplateResult {
    return html`
      <button
        class="flex items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
        type="button"
        aria-label=${this.collapsed ? this.msg.expand : this.msg.collapse}
        @click=${this.handleToggleCollapse}
      >
        <svg
          class="h-4 w-4 transition-transform ${this.collapsed ? 'rotate-180' : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="space-y-1 animate-pulse">
        ${[1, 2, 3, 4].map(() => html`
          <div class="flex items-center gap-3 rounded-lg px-3 py-2">
            <div class="h-5 w-5 flex-shrink-0 rounded bg-slate-200 dark:bg-slate-700"></div>
            ${!this.collapsed ? html`
              <div class="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
            ` : nothing}
          </div>
        `)}
        <div class="mx-3 my-3 h-px bg-slate-200 dark:bg-slate-700"></div>
        ${[1, 2].map(() => html`
          <div class="flex items-center gap-3 rounded-lg px-3 py-2">
            <div class="h-5 w-5 flex-shrink-0 rounded bg-slate-200 dark:bg-slate-700"></div>
            ${!this.collapsed ? html`
              <div class="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
            ` : nothing}
          </div>
        `)}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const labelContent = this.hasSlot('Label') ? this.getSlotContent('Label') : '';
    const topItems = this.parseTopItems();
    const groups = this.parseGroups();
    const footerItems = this.parseFooterItems();

    const sidebarWidth = this.collapsed ? 'w-16' : 'w-64';

    return html`
      <nav
        class="${sidebarWidth} flex h-full flex-col overflow-hidden border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-200"
        aria-label=${labelContent || this.msg.navigation}
      >
        <!-- Header: label + collapse toggle -->
        <div class="flex min-h-[56px] items-center justify-between border-b border-slate-200 dark:border-slate-700 px-3 py-3">
          ${!this.collapsed && labelContent ? html`
            <span class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              ${unsafeHTML(labelContent)}
            </span>
          ` : html`<span></span>`}
          ${this.renderCollapseToggle()}
        </div>

        <!-- Main nav items -->
        <div class="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          ${this.loading
            ? this.renderLoading()
            : html`
              ${topItems.map(item => this.renderNavItem(item))}
              ${groups.map(group => this.renderGroup(group))}
            `}
        </div>

        <!-- Footer items -->
        ${footerItems.length > 0 ? html`
          <div class="border-t border-slate-200 dark:border-slate-700 px-2 py-3 space-y-1">
            ${footerItems.map(item => this.renderNavItem(item))}
          </div>
        ` : nothing}
      </nav>
    `;
  }
}
