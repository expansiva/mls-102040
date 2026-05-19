/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

type ToastType = 'info' | 'success' | 'warning' | 'error';
type Position = 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right';

interface ToastConfig {
  dismissible: boolean;
  duration: number;
  position: Position;
}

const POSITIONS: Position[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'];

const TOAST_TYPES: Array<{
  type: ToastType;
  label: string;
  bg: string;
  text: string;
  title: string;
  message: string;
}> = [
  {
    type: 'info',
    label: 'Info',
    bg: 'bg-sky-50 hover:bg-sky-100 border-sky-200 dark:bg-sky-900/30 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    title: 'New update available',
    message: 'Version 2.4.0 is ready to install. Refresh the page to apply the update.',
  },
  {
    type: 'success',
    label: 'Success',
    bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    title: 'Changes saved',
    message: 'Your profile has been updated successfully.',
  },
  {
    type: 'warning',
    label: 'Warning',
    bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    title: 'Storage almost full',
    message: 'You are using 92% of your storage quota. Consider removing unused files.',
  },
  {
    type: 'error',
    label: 'Error',
    bg: 'bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    title: 'Payment failed',
    message: 'We could not process your payment. Please check your card details and try again.',
  },
];

@customElement('molecules--groupnotifyuser--index-102040')
export class GroupNotifyUserIndex extends StateLitElement {

  @state() config: ToastConfig = { dismissible: true, duration: 3000, position: 'bottom-right' };
  @state() visibleInfo    = false;
  @state() visibleSuccess = false;
  @state() visibleWarning = false;
  @state() visibleError   = false;

  private show(type: ToastType) {
    // reset all, then show the selected one
    this.visibleInfo    = false;
    this.visibleSuccess = false;
    this.visibleWarning = false;
    this.visibleError   = false;
    requestAnimationFrame(() => {
      if (type === 'info')    this.visibleInfo    = true;
      if (type === 'success') this.visibleSuccess = true;
      if (type === 'warning') this.visibleWarning = true;
      if (type === 'error')   this.visibleError   = true;
    });
  }

  private getVisible(type: ToastType): boolean {
    if (type === 'info')    return this.visibleInfo;
    if (type === 'success') return this.visibleSuccess;
    if (type === 'warning') return this.visibleWarning;
    return this.visibleError;
  }

  private setVisible(type: ToastType, val: boolean) {
    if (type === 'info')    this.visibleInfo    = val;
    if (type === 'success') this.visibleSuccess = val;
    if (type === 'warning') this.visibleWarning = val;
    if (type === 'error')   this.visibleError   = val;
  }

  // ===========================================================================
  // CONFIG PANEL
  // ===========================================================================

  private renderConfig(): TemplateResult {
    const { dismissible, duration, position } = this.config;

    return html`
<div class="flex flex-col gap-5">

  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">position</p>
    <div class="grid grid-cols-3 gap-1.5">
      ${POSITIONS.map((p) => html`
        <button
          class="${p === position
            ? 'bg-sky-500 text-white border-sky-500'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80'
          } border rounded-md px-1.5 py-1 text-xs font-medium transition-colors cursor-pointer"
          @click=${() => { this.config = { ...this.config, position: p }; }}
        >${p}</button>
      `)}
    </div>
  </div>

  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">dismissible</p>
    <button
      class="${dismissible
        ? 'bg-sky-500 text-white border-sky-500'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80'
      } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
      @click=${() => { this.config = { ...this.config, dismissible: !dismissible }; }}
    >dismissible</button>
  </div>

  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">duration</p>
    <div class="flex flex-col gap-1.5">
      ${([0, 2000, 5000] as const).map((d) => html`
        <button
          class="${d === duration
            ? 'bg-sky-500 text-white border-sky-500'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80'
          } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
          @click=${() => { this.config = { ...this.config, duration: d }; }}
        >${d === 0 ? 'No auto-dismiss' : `${d / 1000}s`}</button>
      `)}
    </div>
  </div>

</div>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    return html`
<div class="bg-white dark:bg-slate-900 min-h-screen font-sans">

  <!-- Group header -->
  <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-10">
    <div class="max-w-3xl">
      <span class="inline-block px-2.5 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-md text-xs font-semibold uppercase tracking-wide mb-3">
        groupNotifyUser
      </span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Notify User</h1>
      <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        Informs the user about events, status changes, or action results. Controlled via the visible property.
        Supports notification types (info, success, warning, error), auto-dismiss with configurable duration,
        position hints, dismissible toggle, and optional action slot.
      </p>
    </div>
  </header>

  <!-- ml-toast-notification -->
  <section class="bg-white dark:bg-slate-900 px-8 py-12 border-t border-slate-200 dark:border-slate-700">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">Toast Notification</h2>
        <code class="text-xs bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">groupnotifyuser--ml-toast-notification</code>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
        Ephemeral floating notifications that appear in a screen corner, slide in and out smoothly,
        indicate different severity levels through color and icon, and dismiss automatically or manually.
      </p>
    </div>

    <div class="grid grid-cols-[220px_1fr] gap-6 items-start">

      <!-- Config -->
      <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig()}
      </div>

      <!-- Trigger buttons -->
      <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Trigger a notification</p>
        <div class="grid grid-cols-2 gap-3">
          ${TOAST_TYPES.map(({ type, label, bg, text, }) => html`
            <button
              class="${bg} ${text} border rounded-xl px-5 py-4 text-sm font-semibold transition-colors cursor-pointer text-left"
              @click=${() => this.show(type)}
            >
              ${label}
            </button>
          `)}
        </div>
        <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Configure position, dismissible and duration on the left, then click a type to trigger it.
        </p>
      </div>

    </div>
  </section>

  <!-- Toast instances (one per type, rendered outside the layout flow) -->
  ${TOAST_TYPES.map(({ type, title, message }) => html`
    <groupnotifyuser--ml-toast-notification
      type="${type}"
      position="${this.config.position}"
      duration="${this.config.duration}"
      .visible=${this.getVisible(type)}
      .dismissible=${this.config.dismissible}
      @dismiss=${() => this.setVisible(type, false)}
    >
      <Title>${title}</Title>
      <Message>${message}</Message>
    </groupnotifyuser--ml-toast-notification>
  `)}

</div>`;
  }
}
