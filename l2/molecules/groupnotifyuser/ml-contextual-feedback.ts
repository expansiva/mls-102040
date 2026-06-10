/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-contextual-feedback.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CONTEXTUAL FEEDBACK MOLECULE
// =============================================================================
// Skill Group: groupNotifyUser
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  dismissLabel: 'Dismiss notification',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    dismissLabel: 'Dispensar notificação',
  },
};
/// **collab_i18n_end**

@customElement('groupnotifyuser--ml-contextual-feedback')
export class ContextualFeedbackMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Title', 'Message', 'Action', 'Icon'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  type: string = 'info';

  @propertyDataSource({ type: Boolean })
  visible: boolean = false;

  @propertyDataSource({ type: Boolean })
  dismissible: boolean = true;

  @propertyDataSource({ type: Number })
  duration: number = 0;

  @propertyDataSource({ type: String })
  position: string = '';

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private isAnimatingOut: boolean = false;

  @state()
  private isAnimatingIn: boolean = false;

  private autoHideTimer: number | null = null;
  private previousVisible: boolean = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearAutoHideTimer();
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('visible')) {
      const wasVisible = this.previousVisible;
      this.previousVisible = this.visible;

      if (this.visible && !wasVisible) {
        this.handleBecomeVisible();
      } else if (!this.visible && wasVisible) {
        this.clearAutoHideTimer();
      }
    }

    if (changedProperties.has('duration') && this.visible && this.duration > 0) {
      this.startAutoHideTimer();
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: unknown) {
    const visibleAttr = this.getAttribute('visible');
    if (visibleAttr === `{{${key}}}`) {
      const wasVisible = this.visible;
      if (value && !wasVisible) {
        this.isAnimatingIn = true;
        requestAnimationFrame(() => {
          this.isAnimatingIn = false;
        });
      }
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // AUTO-DISMISS LOGIC
  // ===========================================================================
  private handleBecomeVisible() {
    this.isAnimatingIn = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.isAnimatingIn = false;
      });
    });

    if (this.duration > 0) {
      this.startAutoHideTimer();
    }
  }

  private startAutoHideTimer() {
    this.clearAutoHideTimer();
    this.autoHideTimer = window.setTimeout(() => {
      this.handleDismiss();
    }, this.duration);
  }

  private clearAutoHideTimer() {
    if (this.autoHideTimer !== null) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleDismiss() {
    this.clearAutoHideTimer();
    this.visible = false;
    this.dispatchEvent(
      new CustomEvent('dismiss', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleActionClick() {
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  // ===========================================================================
  // STYLING HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    const typeStyles = this.getTypeStyles();
    return [
      'flex items-start gap-3 p-3 rounded-lg border text-sm transition-all duration-300 ease-out',
      typeStyles.container,
      this.isAnimatingIn ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTypeStyles(): {
    container: string;
    icon: string;
    title: string;
    message: string;
  } {
    switch (this.type) {
      case 'success':
        return {
          container:
            'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700',
          icon: 'text-emerald-600 dark:text-emerald-400',
          title: 'text-emerald-800 dark:text-emerald-200',
          message: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300',
        };
      case 'warning':
        return {
          container:
            'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700',
          icon: 'text-amber-600 dark:text-amber-400',
          title: 'text-amber-800 dark:text-amber-200',
          message: 'text-amber-700 dark:text-amber-300',
        };
      case 'info':
      default:
        return {
          container: 'bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700',
          icon: 'text-sky-600 dark:text-sky-400',
          title: 'text-sky-800 dark:text-sky-200',
          message: 'text-sky-700 dark:text-sky-300',
        };
    }
  }

  private getAriaRole(): string {
    return this.type === 'error' || this.type === 'warning' ? 'alert' : 'status';
  }

  private getAriaLive(): string {
    return this.type === 'error' ? 'assertive' : 'polite';
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderDefaultIcon(): TemplateResult {
    const typeStyles = this.getTypeStyles();
    const iconClass = `w-5 h-5 flex-shrink-0 ${typeStyles.icon}`;

    switch (this.type) {
      case 'success':
        return html`
          <svg
            class="${iconClass}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        `;
      case 'error':
        return html`
          <svg
            class="${iconClass}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        `;
      case 'warning':
        return html`
          <svg
            class="${iconClass}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        `;
      case 'info':
      default:
        return html`
          <svg
            class="${iconClass}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        `;
    }
  }

  private renderIcon(): TemplateResult {
    const typeStyles = this.getTypeStyles();

    if (this.hasSlot('Icon')) {
      return html`
        <div class="flex-shrink-0 ${typeStyles.icon}" aria-hidden="true">
          ${unsafeHTML(this.getSlotContent('Icon'))}
        </div>
      `;
    }

    return this.renderDefaultIcon();
  }

  private renderTitle(): TemplateResult {
    if (!this.hasSlot('Title')) {
      return html``;
    }

    const typeStyles = this.getTypeStyles();
    return html`
      <div class="font-medium ${typeStyles.title}">
        ${unsafeHTML(this.getSlotContent('Title'))}
      </div>
    `;
  }

  private renderMessage(): TemplateResult {
    const typeStyles = this.getTypeStyles();
    const messageContent = this.getSlotContent('Message');

    if (!messageContent) {
      return html``;
    }

    return html`
      <div class="${typeStyles.message}">${unsafeHTML(messageContent)}</div>
    `;
  }

  private renderAction(): TemplateResult {
    if (!this.hasSlot('Action')) {
      return html``;
    }

    const typeStyles = this.getTypeStyles();
    return html`
      <div
        class="mt-2 ${typeStyles.title} font-medium cursor-pointer hover:underline"
        @click="${this.handleActionClick}"
      >
        ${unsafeHTML(this.getSlotContent('Action'))}
      </div>
    `;
  }

  private renderDismissButton(): TemplateResult {
    if (!this.dismissible) {
      return html``;
    }

    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
      <button
        type="button"
        class="flex-shrink-0 p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
        aria-label="${this.msg.dismissLabel}"
        @click="${this.handleDismiss}"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.visible) {
      return html``;
    }

    return html`
      <div
        class="${this.getContainerClasses()}"
        role="${this.getAriaRole()}"
        aria-live="${this.getAriaLive()}"
      >
        ${this.renderIcon()}
        <div class="flex-1 min-w-0">
          ${this.renderTitle()} ${this.renderMessage()} ${this.renderAction()}
        </div>
        ${this.renderDismissButton()}
      </div>
    `;
  }
}
