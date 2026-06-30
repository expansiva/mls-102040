/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-wizard-steps.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// WIZARD STEPS MOLECULE
// =============================================================================
// Skill Group: groupNavigateSteps
// This molecule does NOT contain business logic.
import { html, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
labelFallback: 'Steps',
loading: 'Loading steps...',
completed: 'completed',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
labelFallback: 'Etapas',
loading: 'Carregando etapas...',
completed: 'concluída',
},
};
/// **collab_i18n_end**

interface ParsedStep {
index: number;
title: string;
description: string;
completed: boolean;
disabled: boolean;
}

@customElement('groupnavigatesteps--ml-wizard-steps')
export class MlWizardStepsMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Step'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Number })
value: number = 0;
@propertyDataSource({ type: Boolean })
linear: boolean = true;
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private focusedIndex: number = -1;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleStepClick(step: ParsedStep) {
if (!this.canNavigateTo(step.index)) return;
this.focusedIndex = step.index;
this.value = step.index;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: step.index, title: step.title }
}));
}

private handleContainerKeyDown(event: KeyboardEvent) {
if (this.disabled || this.loading) return;
const steps = this.parseSteps();
const currentFocus = this.getInitialFocusIndex(steps);
if (steps.length === 0) return;
const key = event.key;
if (key === 'ArrowRight' || key === 'ArrowLeft') {
event.preventDefault();
const direction = key === 'ArrowRight' ? 1 : -1;
const nextIndex = this.findNextFocusableIndex(steps, currentFocus, direction);
if (nextIndex !== currentFocus) {
this.focusedIndex = nextIndex;
}
return;
}
if (key === 'Enter' || key === ' ') {
event.preventDefault();
const step = steps[currentFocus];
if (step) {
this.handleStepClick(step);
}
}
}
// ===========================================================================
// HELPERS
// ===========================================================================
private parseSteps(): ParsedStep[] {
const stepElements = this.getSlots('Step');
return stepElements.map((el, index) => {
const title = el.getAttribute('title') || '';
const description = el.getAttribute('description') || '';
const completed = el.hasAttribute('completed');
const disabled = el.hasAttribute('disabled');
return { index, title, description, completed, disabled };
});
}

private canNavigateTo(targetIndex: number): boolean {
if (this.disabled || this.loading) return false;
const steps = this.parseSteps();
const target = steps[targetIndex];
const current = steps[this.value];
if (!target || target.disabled) return false;
if (!this.linear) return true;
if (!current) return false;
const currentCompleted = current.completed;
if (targetIndex <= this.value) {
return target.completed || targetIndex === this.value;
}
if (targetIndex === this.value + 1) {
return currentCompleted;
}
return currentCompleted && target.completed;
}

private getInitialFocusIndex(steps: ParsedStep[]): number {
const baseIndex = this.focusedIndex >= 0 ? this.focusedIndex : this.value;
const clampedIndex = Math.max(0, Math.min(baseIndex, steps.length - 1));
const target = steps[clampedIndex];
if (target && !target.disabled) return clampedIndex;
return this.findNextFocusableIndex(steps, clampedIndex, 1);
}

private findNextFocusableIndex(steps: ParsedStep[], start: number, direction: number): number {
if (steps.length === 0) return 0;
let index = start;
for (let i = 0; i < steps.length; i += 1) {
index = (index + direction + steps.length) % steps.length;
const step = steps[index];
if (step && !step.disabled) return index;
}
return start;
}

private getStepClasses(step: ParsedStep, isActive: boolean): string {
const isClickable = this.canNavigateTo(step.index);
return [
'flex-1 min-w-0',
'rounded-lg border px-3 py-3 text-left transition',
'ml-step',
isActive ? 'ml-step-active' : '',
step.disabled || !isClickable ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private getLabelText(): string {
const raw = this.getSlotContent('Label');
if (!raw) return this.msg.labelFallback;
return raw.replace(/<[^>]*>/g, '').trim() || this.msg.labelFallback;
}

private renderLoading() {
return html`
<div class="${cn('flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ml-step-container', this.cssClass)}">
<span class="inline-flex h-4 w-4 items-center justify-center">
<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
${svg`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" opacity="0.3"></circle>`}
${svg`<path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`}
</svg>
</span>
<span>${this.msg.loading}</span>
</div>
`;
}

private renderLabel() {
if (!this.hasSlot('Label')) return html``;
return html`
<div class="${cn('mb-3 text-sm font-medium ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</div>
`;
}

private renderStep(step: ParsedStep, isActive: boolean, tabIndex: number) {
const isClickable = this.canNavigateTo(step.index);
const ariaLabel = step.completed ? `${step.title} ${this.msg.completed}` : step.title;
return html`
<button
class="${this.getStepClasses(step, isActive)}"
role="tab"
aria-selected="${isActive ? 'true' : 'false'}"
aria-disabled="${step.disabled ? 'true' : 'false'}"
aria-label="${ariaLabel}"
?disabled=${this.disabled || this.loading || step.disabled || !isClickable}
tabindex="${tabIndex}"
@click=${() => this.handleStepClick(step)}
>
<div class="flex items-center gap-2">
<span class="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${isActive
? 'ml-step-badge-active'
: step.completed
? 'ml-step-badge-done'
: 'ml-step-badge'}">
${step.completed
? html`<span aria-hidden="true">✓</span>`
: html`${step.index + 1}`}
</span>
<div class="min-w-0">
<div class="truncate text-sm font-semibold ml-text">${step.title}</div>
${step.description
? html`<div class="truncate text-xs ml-text-muted">${step.description}</div>`
: html``}
</div>
</div>
</button>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (this.loading) {
return html`${this.renderLoading()}`;
}
const steps = this.parseSteps();
const focusIndex = this.getInitialFocusIndex(steps);
const ariaLabel = this.getLabelText();
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div
class="flex items-start gap-2"
role="tablist"
aria-label="${ariaLabel}"
@keydown=${this.handleContainerKeyDown}
>
${steps.map((step, index) => this.renderStep(step, index === this.value, index === focusIndex ? 0 : -1))}
</div>
</div>
`;
}
}
