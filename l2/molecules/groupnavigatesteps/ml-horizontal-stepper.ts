/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// HORIZONTAL STEPPER MOLECULE
// =============================================================================
// Skill Group: groupNavigateSteps
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  completed: 'completed',
  loading: 'Loading steps...',
  stepperLabel: 'Progress steps',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    completed: 'concluído',
    loading: 'Carregando etapas...',
    stepperLabel: 'Etapas de progresso',
  },
};
/// **collab_i18n_end**

type ParsedStep = {
  title: string;
  description: string;
  disabled: boolean;
  completed: boolean;
  iconHtml: string;
};

@customElement('groupnavigatesteps--ml-horizontal-stepper')
export class MlHorizontalStepperMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // =========================================================================
  slotTags = ['Label', 'Step'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // =========================================================================
  @propertyDataSource({ type: Number })
  value = 0;

  @propertyDataSource({ type: Boolean })
  linear = true;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;
  // ===========================================================================
  // INTERNAL STATE
  // =========================================================================
  @state()
  private focusedIndex = 0;
  // ===========================================================================
  // STATE CHANGE HANDLER
  // =========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.focusedIndex = Number(value) || 0;
    }
    this.requestUpdate();
  }
  // ===========================================================================
  // LIFECYCLE
  // =========================================================================
  firstUpdated() {
    this.focusedIndex = this.value || 0;
  }
  // ===========================================================================
  // PARSING
  // =========================================================================
  private getSteps(): ParsedStep[] {
    const elements = this.getSlots('Step');
    return elements.map((el) => {
      const title = (el.getAttribute('title') || '').trim();
      const description = (el.getAttribute('description') || '').trim();
      const disabled = el.hasAttribute('disabled');
      const completed = el.hasAttribute('completed');
      const iconHtml = (el as HTMLElement).innerHTML || '';
      return { title, description, disabled, completed, iconHtml };
    });
  }

  private getLabelText(): string {
    const labelEl = this.getSlot('Label');
    return (labelEl?.textContent || '').trim();
  }
  // ===========================================================================
  // NAVIGATION LOGIC (UI-only)
  // =========================================================================
  private isStepCompleted(index: number, step: ParsedStep): boolean {
    if (index < this.value) return true;
    return step.completed;
  }

  private canNavigateTo(index: number, step: ParsedStep, steps: ParsedStep[]): boolean {
    if (this.loading || this.disabled || step.disabled) return false;
    if (!this.linear) return true;

    if (index <= this.value) return true;
    if (index === this.value + 1) {
      const currentStep = steps[this.value];
      const currentCompleted = currentStep ? this.isStepCompleted(this.value, currentStep) : false;
      return currentCompleted;
    }
    return false;
  }

  private getNextFocusableIndex(direction: 1 | -1, steps: ParsedStep[]): number {
    const total = steps.length;
    if (total === 0) return 0;
    let idx = this.focusedIndex;
    for (let i = 0; i < total; i += 1) {
      idx = (idx + direction + total) % total;
      const step = steps[idx];
      if (this.canNavigateTo(idx, step, steps)) return idx;
    }
    return this.focusedIndex;
  }
  // ===========================================================================
  // EVENT HANDLERS
  // =========================================================================
  private handleStepClick(index: number, step: ParsedStep, steps: ParsedStep[]) {
    if (!this.canNavigateTo(index, step, steps)) return;
    this.value = index;
    this.focusedIndex = index;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: index, title: step.title },
      })
    );
  }

  private handleKeyDown(event: KeyboardEvent, steps: ParsedStep[]) {
    if (this.loading || this.disabled) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusedIndex = this.getNextFocusableIndex(1, steps);
      this.requestUpdate();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusedIndex = this.getNextFocusableIndex(-1, steps);
      this.requestUpdate();
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const step = steps[this.focusedIndex];
      if (step) this.handleStepClick(this.focusedIndex, step, steps);
    }
  }

  private handleFocus(index: number) {
    this.focusedIndex = index;
  }
  // ===========================================================================
  // CLASSES
  // =========================================================================
  private getIndicatorClasses(isActive: boolean, isCompleted: boolean, isDisabled: boolean): string {
    return [
      'flex items-center justify-center rounded-full border text-sm font-semibold transition',
      'w-9 h-9',
      isActive
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400'
        : isCompleted
        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500'
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      !isDisabled && !isActive ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
      !isDisabled ? 'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTitleClasses(isActive: boolean, isDisabled: boolean): string {
    return [
      'mt-2 text-xs font-medium text-center',
      isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300',
      isDisabled ? 'text-slate-400 dark:text-slate-600' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getDescriptionClasses(isDisabled: boolean): string {
    return [
      'mt-1 text-[11px] text-center',
      'text-slate-500 dark:text-slate-400',
      isDisabled ? 'text-slate-400 dark:text-slate-600' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getContainerClasses(): string {
    return [
      'w-full',
      this.loading ? 'opacity-60 pointer-events-none' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
  // ===========================================================================
  // RENDER
  // =========================================================================
  private renderLoading(): TemplateResult {
    return html`
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span class="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse"></span>
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  private renderStep(step: ParsedStep, index: number, steps: ParsedStep[]): TemplateResult {
    const isActive = index === this.value;
    const isCompleted = this.isStepCompleted(index, step);
    const isDisabled = this.disabled || this.loading || step.disabled || !this.canNavigateTo(index, step, steps);
    const indicatorClasses = this.getIndicatorClasses(isActive, isCompleted, isDisabled);
    const titleClasses = this.getTitleClasses(isActive, isDisabled);
    const descriptionClasses = this.getDescriptionClasses(isDisabled);
    const ariaLabel = isCompleted
      ? `${step.title} ${this.msg.completed}`
      : step.title;

    return html`
      <div class="flex flex-col items-center flex-1 min-w-0">
        <button
          class="${indicatorClasses}"
          type="button"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
          aria-disabled="${isDisabled ? 'true' : 'false'}"
          aria-label="${ariaLabel}"
          tabindex="${this.focusedIndex === index ? '0' : '-1'}"
          @click=${() => this.handleStepClick(index, step, steps)}
          @focus=${() => this.handleFocus(index)}
        >
          ${step.iconHtml ? unsafeHTML(step.iconHtml) : html`<span>${index + 1}</span>`}
        </button>
        <div class="${titleClasses}">${step.title}</div>
        ${step.description
          ? html`<div class="${descriptionClasses}">${step.description}</div>`
          : html``}
      </div>
    `;
  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const steps = this.getSteps();
    const labelText = this.getLabelText();
    const ariaLabel = labelText || this.msg.stepperLabel;

    return html`
      <div class="${this.getContainerClasses()}">
        ${labelText
          ? html`<div class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">${unsafeHTML(this.getSlotContent('Label'))}</div>`
          : html``}
        <div
          class="flex items-start gap-4"
          role="tablist"
          aria-label="${ariaLabel}"
          aria-busy="${this.loading ? 'true' : 'false'}"
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, steps)}
        >
          ${steps.map((step, index) => this.renderStep(step, index, steps))}
        </div>
        ${this.loading ? html`<div class="mt-3">${this.renderLoading()}</div>` : html``}
      </div>
    `;
  }
}
