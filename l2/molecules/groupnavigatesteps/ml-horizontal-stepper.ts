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
import { cn } from '/_102033_/l2/cn.js';

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
      const newValue = Number(value) || 0;
      this.value = newValue;
      this.focusedIndex = newValue;
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

    return index <= this.value + 1;
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
    this.requestUpdate();
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
      'ml-step-number',
      isActive ? 'ml-step-active' : '',
      isCompleted ? 'ml-step-completed' : '',
      isDisabled ? 'ml-disabled' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTitleClasses(isActive: boolean, isDisabled: boolean): string {
    return [
      'mt-2 text-xs font-medium text-center',
      isActive ? 'ml-step-active-text' : 'ml-text',
      isDisabled ? 'ml-text-muted' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getDescriptionClasses(isDisabled: boolean): string {
    return [
      'mt-1 text-[11px] text-center',
      'ml-text-muted',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getContainerClasses(): string {
    return cn([
      'w-full',
      this.loading ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '), this.cssClass);
  }
  // ===========================================================================
  // RENDER
  // =========================================================================
  private renderLoading(): TemplateResult {
    return html`
      <div class="flex items-center gap-2 text-sm ml-text-muted">
        <span class="h-2 w-2 rounded-full ml-step-loading-dot animate-pulse"></span>
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
      <div class="flex flex-col items-center flex-none">
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

  private renderConnector(afterIndex: number): TemplateResult {
    const isCompleted = afterIndex < this.value;
    return html`
      <div class="flex-1 flex items-start pt-[18px] px-2">
        <div class="h-0.5 w-full transition-colors ml-step-connector ${isCompleted ? 'ml-step-connector-completed' : ''}"></div>
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
          ? html`<div class="mb-3 text-sm font-semibold ml-label">${unsafeHTML(this.getSlotContent('Label'))}</div>`
          : html``}
        <div
          class="flex items-start"
          role="tablist"
          aria-label="${ariaLabel}"
          aria-busy="${this.loading ? 'true' : 'false'}"
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, steps)}
        >
          ${steps.map((step, index) => html`
            ${this.renderStep(step, index, steps)}
            ${index < steps.length - 1 ? this.renderConnector(index) : html``}
          `)}
        </div>
        ${this.loading ? html`<div class="mt-3">${this.renderLoading()}</div>` : html``}
      </div>
    `;
  }
}
