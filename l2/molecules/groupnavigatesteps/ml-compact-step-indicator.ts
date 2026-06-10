/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-compact-step-indicator.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// COMPACT STEP INDICATOR MOLECULE
// =============================================================================
// Skill Group: groupNavigateSteps
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
stepsLabel: 'Steps',
completed: 'completed',
current: 'current',
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
stepsLabel: 'Etapas',
completed: 'concluído',
current: 'atual',
loading: 'Carregando...',
},
};
/// **collab_i18n_end**

type StepItem = {
index: number;
title: string;
description: string;
disabled: boolean;
completed: boolean;
};

@customElement('groupnavigatesteps--ml-compact-step-indicator')
export class CompactStepIndicatorMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Step'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Number })
value = 0;
@propertyDataSource({ type: Boolean })
linear = true;
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
loading = false;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleStepClick(step: StepItem, steps: StepItem[]) {
if (!this.canSelectStep(step, steps)) return;
this.value = step.index;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: step.index, title: step.title },
}));
}

private handleStepKeyDown(event: KeyboardEvent, step: StepItem, steps: StepItem[]) {
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
this.handleStepClick(step, steps);
return;
}
if (event.key === 'ArrowRight') {
event.preventDefault();
this.focusNextSelectable(step.index, 1, steps);
return;
}
if (event.key === 'ArrowLeft') {
event.preventDefault();
this.focusNextSelectable(step.index, -1, steps);
}
}
// ===========================================================================
// HELPERS
// ===========================================================================
private getSteps(): StepItem[] {
const steps = this.getSlots('Step');
return steps.map((el, index) => {
const title = el.getAttribute('title') || `${this.msg.stepsLabel} ${index + 1}`;
const description = el.getAttribute('description') || '';
const disabled = el.hasAttribute('disabled');
const completed = el.hasAttribute('completed');
return { index, title, description, disabled, completed };
});
}

private canSelectStep(step: StepItem, steps: StepItem[]): boolean {
if (this.loading || this.disabled) return false;
if (step.disabled) return false;
if (!this.linear) return true;
const currentIndex = this.value;
const currentStep = steps[currentIndex];
if (step.index === currentIndex) return true;
if (step.index < currentIndex) return step.completed;
if (step.index === currentIndex + 1) return currentStep?.completed === true;
return false;
}

private focusNextSelectable(startIndex: number, direction: 1 | -1, steps: StepItem[]) {
let idx = startIndex + direction;
while (idx >= 0 && idx < steps.length) {
const step = steps[idx];
if (this.canSelectStep(step, steps)) {
const target = this.querySelector<HTMLButtonElement>(`[data-step-index="${idx}"]`);
if (target) target.focus();
return;
}
idx += direction;
}
}

private getIndicatorSizeClasses(): string {
const size = this.getAttribute('size') || 'md';
const sizeMap: Record<string, string> = {
sm: 'h-6 w-6 text-xs',
md: 'h-7 w-7 text-sm',
lg: 'h-8 w-8 text-sm',
};
return sizeMap[size] || sizeMap.md;
}

private getIndicatorClasses(step: StepItem, isActive: boolean, isSelectable: boolean): string {
const base = [
'flex items-center justify-center rounded-full border transition',
this.getIndicatorSizeClasses(),
].join(' ');
const disabled = step.disabled || this.disabled;
const pendingClasses = [
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'text-slate-600 dark:text-slate-400',
].join(' ');
const completedClasses = [
'bg-sky-50 dark:bg-sky-900/40',
'border-sky-500 dark:border-sky-400',
'text-sky-700 dark:text-sky-300',
].join(' ');
const activeClasses = [
'bg-sky-50 dark:bg-sky-900/40',
'border-sky-500 dark:border-sky-400',
'text-sky-700 dark:text-sky-300',
'ring-2 ring-sky-500/30 dark:ring-sky-400/30',
].join(' ');
const disabledClasses = [
'bg-slate-50 dark:bg-slate-900',
'border-slate-200 dark:border-slate-700',
'text-slate-400 dark:text-slate-600',
'opacity-50',
].join(' ');
const stateClasses = disabled
? disabledClasses
: isActive
? activeClasses
: step.completed
? completedClasses
: pendingClasses;
const interactionClasses = isSelectable
? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400'
: 'cursor-not-allowed';
const hoverClasses = isSelectable && !isActive && !step.completed
? 'hover:bg-slate-50 dark:hover:bg-slate-700'
: '';
return [base, stateClasses, interactionClasses, hoverClasses].filter(Boolean).join(' ');
}

private getStepAriaLabel(step: StepItem, isActive: boolean): string {
const details = step.description ? ` - ${step.description}` : '';
const completedLabel = step.completed ? `, ${this.msg.completed}` : '';
const currentLabel = isActive ? `, ${this.msg.current}` : '';
return `${step.title}${details}${completedLabel}${currentLabel}`;
}

private getLabelText(): string {
const content = this.getSlotContent('Label');
const text = this.stripHtml(content).trim();
return text || this.msg.stepsLabel;
}

private stripHtml(content: string): string {
const div = document.createElement('div');
div.innerHTML = content;
return div.textContent || '';
}

private renderLoading(): TemplateResult {
return html`
<div
class="flex items-center justify-center gap-2"
aria-live="polite"
aria-busy="true"
>
<span class="sr-only">${this.msg.loading}</span>
<div class="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse"></div>
<div class="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse"></div>
<div class="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse"></div>
</div>
`;
}

private renderStepItem(step: StepItem, steps: StepItem[]): TemplateResult {
const isActive = step.index === this.value;
const isSelectable = this.canSelectStep(step, steps);
const classes = this.getIndicatorClasses(step, isActive, isSelectable);
return html`
<button
class="${classes}"
role="tab"
aria-selected="${isActive}"
aria-disabled="${!isSelectable}"
aria-label="${this.getStepAriaLabel(step, isActive)}"
tabindex="${isActive ? '0' : '-1'}"
data-step-index="${step.index}"
@click="${() => this.handleStepClick(step, steps)}"
@keydown="${(event: KeyboardEvent) => this.handleStepKeyDown(event, step, steps)}"
>
${step.completed
? html`
<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
${svg`<path d="M5 10.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`}
</svg>
`
: html`<span>${step.index + 1}</span>`}
</button>
`;
}

private renderSteps(steps: StepItem[]): TemplateResult {
return html`
<div
class="flex items-center justify-between gap-2"
role="tablist"
aria-label="${this.getLabelText()}"
>
${steps.map((step) => this.renderStepItem(step, steps))}
</div>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (this.loading) {
return this.renderLoading();
}
const steps = this.getSteps();
return html`
<div class="w-full">
${this.renderSteps(steps)}
</div>
`;
}
}
