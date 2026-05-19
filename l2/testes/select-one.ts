/// <mls fileReference="_102040_/l2/testes/select-one.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';

@customElement('select-one-102040')
export class SelectOne102040 extends StateLitElement {

  @state() radioValue: string = 'standard';
  @state() radioGroupedValue: string = '6-10';
  @state() segmentedValue: string = 'monthly';
  @state() segmentedErrorValue: string = '';

  render() {
    return html`
<div class="bg-white dark:bg-slate-900 min-h-screen p-8 font-sans">

  <header class="text-center mb-12">
    <h1 class="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Select One — Test Page</h1>
    <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium">groupSelectOne</span>
  </header>

  <!-- ml-radio-group -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
      ml-radio-group
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">Basic</h3>
        <groupselectone--ml-radio-group
          value="${this.radioValue}"
          name="plan"
          @change=${(e: CustomEvent) => { this.radioValue = e.detail.value; }}
        >
          <Label>Plan</Label>
          <Helper>Choose the plan that fits your team.</Helper>
          <Item value="standard">Standard</Item>
          <Item value="premium">Premium</Item>
          <Item value="enterprise">Enterprise</Item>
          <Item value="trial" disabled>Trial (unavailable)</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Selected: <strong class="text-slate-900 dark:text-slate-100">${this.radioValue || '—'}</strong>
        </p>
      </article>

      <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">Grouped options</h3>
        <groupselectone--ml-radio-group
          value="${this.radioGroupedValue}"
          name="teamSize"
          @change=${(e: CustomEvent) => { this.radioGroupedValue = e.detail.value; }}
        >
          <Label>Team size</Label>
          <Group label="Small teams">
            <Item value="1-5">1–5 people</Item>
            <Item value="6-10">6–10 people</Item>
          </Group>
          <Group label="Larger teams">
            <Item value="11-25">11–25 people</Item>
            <Item value="26+">26+ people</Item>
          </Group>
        </groupselectone--ml-radio-group>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Selected: <strong class="text-slate-900 dark:text-slate-100">${this.radioGroupedValue || '—'}</strong>
        </p>
      </article>

    </div>
  </section>

  <!-- ml-segmented-control -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
      ml-segmented-control
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">Basic</h3>
        <groupselectone--ml-segmented-control
          value="${this.segmentedValue}"
          name="billingCycle"
          @change=${(e: CustomEvent) => { this.segmentedValue = e.detail.value; }}
        >
          <Label>Billing cycle</Label>
          <Item value="monthly">Monthly</Item>
          <Item value="yearly">Yearly</Item>
          <Item value="lifetime">Lifetime</Item>
        </groupselectone--ml-segmented-control>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Selected: <strong class="text-slate-900 dark:text-slate-100">${this.segmentedValue || '—'}</strong>
        </p>
      </article>

      <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">Validation error + required</h3>
        <groupselectone--ml-segmented-control
          value="${this.segmentedErrorValue}"
          name="deliverySpeed"
          error="Please select a delivery speed."
          required="true"
          @change=${(e: CustomEvent) => { this.segmentedErrorValue = e.detail.value; }}
        >
          <Label>Delivery speed</Label>
          <Item value="standard">Standard</Item>
          <Item value="express">Express</Item>
          <Item value="overnight">Overnight</Item>
        </groupselectone--ml-segmented-control>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Selected: <strong class="text-slate-900 dark:text-slate-100">${this.segmentedErrorValue || '—'}</strong>
        </p>
      </article>

    </div>
  </section>

</div>
    `;
  }
}
