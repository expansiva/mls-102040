/// <mls fileReference="_102040_/l2/molecules/groupselectone/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

interface Config {
  value: string;
  isEditing: boolean;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  loading: boolean;
  error: string;
  fillPrevious: boolean;
  clearable: boolean;
  searchable: boolean;
}

type BooleanConfigKey = keyof Omit<Config, 'value' | 'error'>;

const defaultConfig = (): Config => ({
  value: '', isEditing: true, required: false,
  disabled: false, readonly: false, loading: false, error: '',
  fillPrevious: false, clearable: false, searchable: true,
});

// Section backgrounds alternate: even = white, odd = slate
const SECTION_BG = [
  'bg-white dark:bg-slate-900',
  'bg-slate-100/70 dark:bg-slate-800/50',
];
const CARD_BG = [
  'bg-slate-50 dark:bg-slate-800',
  'bg-white dark:bg-slate-800',
];

@customElement('molecules--groupselectone--index-102040')
export class GroupSelectOneIndex extends StateLitElement {

  @state() radioBasic: Config = defaultConfig();
  @state() radioGrouped: Config = defaultConfig();
  @state() segmentedBasic: Config = defaultConfig();
  @state() segmentedDisabled: Config = defaultConfig();
  @state() toggleBasic: Config = defaultConfig();
  @state() toggleStates: Config = defaultConfig();
  @state() sliderBasic: Config = defaultConfig();
  @state() sliderGrouped: Config = defaultConfig();
  @state() autocompleteBasic: Config = defaultConfig();
  @state() autocompleteGrouped: Config = defaultConfig();

  // ===========================================================================
  // CONFIG PANEL HELPERS
  // ===========================================================================

  private toggle(cfg: Config, key: BooleanConfigKey): Config {
    return { ...cfg, [key]: !cfg[key] };
  }

  private renderToggle(label: string, active: boolean, onClick: () => void, cardBg: string): TemplateResult {
    return html`
<button
  class="${active
    ? 'bg-sky-500 text-white border-sky-500'
    : `${cardBg} text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80`
  } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
  @click=${onClick}
>${label}</button>`;
  }

  private renderConfig(
    cfg: Config,
    update: (next: Config) => void,
    cardBg: string,
    extras: Array<{ label: string; key: BooleanConfigKey }> = []
  ): TemplateResult {
    return html`
<div class="flex flex-col gap-4">
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Props</p>
    <div class="flex flex-col gap-2">
      ${this.renderToggle('is-editing', cfg.isEditing, () => update(this.toggle(cfg, 'isEditing')), cardBg)}
      ${this.renderToggle('required',   cfg.required,   () => update(this.toggle(cfg, 'required')),   cardBg)}
      ${this.renderToggle('disabled',   cfg.disabled,   () => update(this.toggle(cfg, 'disabled')),   cardBg)}
      ${this.renderToggle('readonly',   cfg.readonly,   () => update(this.toggle(cfg, 'readonly')),   cardBg)}
      ${this.renderToggle('loading',    cfg.loading,    () => update(this.toggle(cfg, 'loading')),    cardBg)}
      ${extras.map(({ label, key }) =>
        this.renderToggle(label, cfg[key] as boolean, () => update(this.toggle(cfg, key)), cardBg)
      )}
    </div>
  </div>
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">error</p>
    <input
      type="text"
      placeholder="Error message..."
      .value=${cfg.error}
      @input=${(e: InputEvent) => update({ ...cfg, error: (e.target as HTMLInputElement).value })}
      class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  </div>
  ${cfg.value ? html`
  <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">value</p>
    <p class="text-sm font-medium text-slate-800 dark:text-slate-100">${cfg.value}</p>
  </div>` : html``}
</div>`;
  }

  private renderExampleRow(
    label: string,
    cfg: Config,
    update: (next: Config) => void,
    component: TemplateResult,
    cardBg: string,
    last = false,
    extras: Array<{ label: string; key: BooleanConfigKey }> = []
  ): TemplateResult {
    return html`
<div class="${last ? '' : 'mb-6'}">
  <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">${label}</p>
  <div class="grid grid-cols-[200px_1fr] gap-6 items-start">
    <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      ${this.renderConfig(cfg, update, cardBg, extras)}
    </div>
    <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      ${component}
    </div>
  </div>
</div>`;
  }

  private renderSection(
    index: number,
    title: string,
    tag: string,
    objective: string,
    examples: (cardBg: string) => TemplateResult
  ): TemplateResult {
    const sectionBg = SECTION_BG[index % 2];
    const cardBg    = CARD_BG[index % 2];
    return html`
<section class="${sectionBg} px-8 py-12 border-t border-slate-200 dark:border-slate-700">
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-2">
      <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">${title}</h2>
      <code class="text-xs bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">${tag}</code>
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">${objective}</p>
  </div>
  ${examples(cardBg)}
</section>`;
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
        groupSelectOne
      </span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Select One</h1>
      <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        Allows the user to select exactly one option from a list of mutually exclusive choices.
        Ideal for scenarios where a single, clear decision is required.
        Implementations include dropdown, radio group, segmented control, knob, and list picker.
      </p>
    </div>
  </header>

  ${this.renderSection(0,
    'Radio Group',
    'groupselectone--ml-radio-group',
    'A single-selection option group that displays all available choices at once without hiding them behind a dropdown. It allows the user to pick exactly one option from a small set, making every option visible for quick comparison and selection.',
    (cardBg) => html`
      ${this.renderExampleRow('Basic', this.radioBasic, (n) => { this.radioBasic = n; }, html`
        <groupselectone--ml-radio-group
          value="${this.radioBasic.value}" name="size" error="${this.radioBasic.error}"
          .isEditing=${this.radioBasic.isEditing} .required=${this.radioBasic.required}
          .disabled=${this.radioBasic.disabled} .readonly=${this.radioBasic.readonly}
          .loading=${this.radioBasic.loading}
          @change=${(e: CustomEvent) => { this.radioBasic = { ...this.radioBasic, value: e.detail.value }; }}
        >
          <Label>Plan size</Label>
          <Helper>Choose the plan that best fits your usage.</Helper>
          <Item value="small">Small</Item>
          <Item value="medium">Medium</Item>
          <Item value="large">Large</Item>
        </groupselectone--ml-radio-group>
      `, cardBg)}
      ${this.renderExampleRow('With groups', this.radioGrouped, (n) => { this.radioGrouped = n; }, html`
        <groupselectone--ml-radio-group
          value="${this.radioGrouped.value}" name="department" error="${this.radioGrouped.error}"
          .isEditing=${this.radioGrouped.isEditing} .required=${this.radioGrouped.required}
          .disabled=${this.radioGrouped.disabled} .readonly=${this.radioGrouped.readonly}
          .loading=${this.radioGrouped.loading}
          @change=${(e: CustomEvent) => { this.radioGrouped = { ...this.radioGrouped, value: e.detail.value }; }}
        >
          <Label>Department</Label>
          <Helper>Select the department the employee will be assigned to.</Helper>
          <Group label="Technology">
            <Item value="engineering">Software Engineering</Item>
            <Item value="data">Data & Analytics</Item>
            <Item value="infra">Infrastructure</Item>
          </Group>
          <Group label="Business">
            <Item value="product">Product</Item>
            <Item value="marketing">Marketing</Item>
            <Item value="sales">Sales</Item>
          </Group>
          <Group label="Corporate">
            <Item value="finance">Finance</Item>
            <Item value="legal">Legal</Item>
            <Item value="hr" disabled>Human Resources (no openings)</Item>
          </Group>
        </groupselectone--ml-radio-group>
      `, cardBg, true)}
  `)}

  ${this.renderSection(1,
    'Segmented Control',
    'groupselectone--ml-segmented-control',
    'A single-selection control that presents multiple options as a connected horizontal group of segments. It allows choosing one option from a compact set, showing the selected label when inactive and displaying all options together when active for editing.',
    (cardBg) => html`
      ${this.renderExampleRow('Basic', this.segmentedBasic, (n) => { this.segmentedBasic = n; }, html`
        <groupselectone--ml-segmented-control
          value="${this.segmentedBasic.value}" name="billingCycle" error="${this.segmentedBasic.error}"
          .isEditing=${this.segmentedBasic.isEditing} .required=${this.segmentedBasic.required}
          .disabled=${this.segmentedBasic.disabled} .readonly=${this.segmentedBasic.readonly}
          .loading=${this.segmentedBasic.loading}
          @change=${(e: CustomEvent) => { this.segmentedBasic = { ...this.segmentedBasic, value: e.detail.value }; }}
        >
          <Label>Billing cycle</Label>
          <Helper>Select how often you'd like to be billed.</Helper>
          <Item value="monthly">Monthly</Item>
          <Item value="quarterly">Quarterly</Item>
          <Item value="yearly">Yearly</Item>
        </groupselectone--ml-segmented-control>
      `, cardBg)}
      ${this.renderExampleRow('With disabled item', this.segmentedDisabled, (n) => { this.segmentedDisabled = n; }, html`
        <groupselectone--ml-segmented-control
          value="${this.segmentedDisabled.value}" name="environment" error="${this.segmentedDisabled.error}"
          .isEditing=${this.segmentedDisabled.isEditing} .required=${this.segmentedDisabled.required}
          .disabled=${this.segmentedDisabled.disabled} .readonly=${this.segmentedDisabled.readonly}
          .loading=${this.segmentedDisabled.loading}
          @change=${(e: CustomEvent) => { this.segmentedDisabled = { ...this.segmentedDisabled, value: e.detail.value }; }}
        >
          <Label>Deployment environment</Label>
          <Helper>Choose the target environment for this release.</Helper>
          <Item value="dev">Development</Item>
          <Item value="staging">Staging</Item>
          <Item value="prod" disabled>Production (restricted)</Item>
        </groupselectone--ml-segmented-control>
      `, cardBg, true)}
  `)}

  ${this.renderSection(2,
    'Toggle Switch',
    'groupselectone--ml-toggle-switch',
    'A binary selection control presented as a toggle switch that allows the user to choose between two mutually exclusive options. It provides clear semantics for yes/no, active/inactive, or enabled/disabled decisions.',
    (cardBg) => html`
      ${this.renderExampleRow('Basic', this.toggleBasic, (n) => { this.toggleBasic = n; }, html`
        <groupselectone--ml-toggle-switch
          value="${this.toggleBasic.value || 'disabled'}" name="notifications" error="${this.toggleBasic.error}"
          .isEditing=${this.toggleBasic.isEditing} .required=${this.toggleBasic.required}
          .disabled=${this.toggleBasic.disabled} .readonly=${this.toggleBasic.readonly}
          .loading=${this.toggleBasic.loading}
          @change=${(e: CustomEvent) => { this.toggleBasic = { ...this.toggleBasic, value: e.detail.value }; }}
        >
          <Label>Email notifications</Label>
          <Helper>Receive updates about your account activity.</Helper>          
          <Item value="disabled">Disabled</Item>
          <Item value="enabled">Enabled</Item>
        </groupselectone--ml-toggle-switch>
      `, cardBg)}      
      
  `)}

  ${this.renderSection(3,
    'Discrete Slider',
    'groupselectone--ml-discrete-slider',
    'A discrete slider that allows selection of exactly one option from a set of mutually exclusive ordinal choices arranged along a horizontal linear scale. It snaps to fixed stopping points that represent valid options.',
    (cardBg) => html`
      ${this.renderExampleRow('Basic', this.sliderBasic, (n) => { this.sliderBasic = n; }, html`
        <groupselectone--ml-discrete-slider
          value="${this.sliderBasic.value}" name="satisfaction" error="${this.sliderBasic.error}"
          .isEditing=${this.sliderBasic.isEditing} .required=${this.sliderBasic.required}
          .disabled=${this.sliderBasic.disabled} .readonly=${this.sliderBasic.readonly}
          .loading=${this.sliderBasic.loading} .fillPrevious=${this.sliderBasic.fillPrevious}
          @change=${(e: CustomEvent) => { this.sliderBasic = { ...this.sliderBasic, value: e.detail.value }; }}
        >
          <Label>Satisfaction level</Label>
          <Helper>Rate your overall experience with our service.</Helper>
          <Item value="very-poor">Very Poor</Item>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>
      `, cardBg, false, [{ label: 'fill-previous', key: 'fillPrevious' }])}
      ${this.renderExampleRow('With groups', this.sliderGrouped, (n) => { this.sliderGrouped = n; }, html`
        <groupselectone--ml-discrete-slider
          value="${this.sliderGrouped.value}" name="seniority" error="${this.sliderGrouped.error}"
          .isEditing=${this.sliderGrouped.isEditing} .required=${this.sliderGrouped.required}
          .disabled=${this.sliderGrouped.disabled} .readonly=${this.sliderGrouped.readonly}
          .loading=${this.sliderGrouped.loading} .fillPrevious=${this.sliderGrouped.fillPrevious}
          @change=${(e: CustomEvent) => { this.sliderGrouped = { ...this.sliderGrouped, value: e.detail.value }; }}
        >
          <Label>Seniority level</Label>
          <Helper>Select the seniority level for this position.</Helper>
          <Group label="Individual Contributor">
            <Item value="junior">Junior</Item>
            <Item value="mid">Mid</Item>
            <Item value="senior">Senior</Item>
          </Group>
          <Group label="Leadership">
            <Item value="lead">Lead</Item>
            <Item value="principal">Principal</Item>
          </Group>
        </groupselectone--ml-discrete-slider>
      `, cardBg, true, [{ label: 'fill-previous', key: 'fillPrevious' }])}
  `)}

  ${this.renderSection(4,
    'Select One Autocomplete',
    'groupselectone--ml-select-one-autocomplete',
    'Allow the user to choose exactly one option from a list by typing into a text field to filter results. A list of matching options appears when the field gains focus. Supports clearable selection and full keyboard control.',
    (cardBg) => html`
      ${this.renderExampleRow('Basic', this.autocompleteBasic, (n) => { this.autocompleteBasic = n; }, html`
        <groupselectone--ml-select-one-autocomplete
          value="${this.autocompleteBasic.value}" name="state" error="${this.autocompleteBasic.error}"
          .isEditing=${this.autocompleteBasic.isEditing} .required=${this.autocompleteBasic.required}
          .disabled=${this.autocompleteBasic.disabled} .readonly=${this.autocompleteBasic.readonly}
          .loading=${this.autocompleteBasic.loading} .clearable=${this.autocompleteBasic.clearable}
          .searchable=${this.autocompleteBasic.searchable}
          @change=${(e: CustomEvent) => { this.autocompleteBasic = { ...this.autocompleteBasic, value: e.detail.value }; }}
        >
          <Label>State</Label>
          <Helper>Select the state where the employee is located.</Helper>
          <Item value="AC">Acre</Item>
          <Item value="AM">Amazonas</Item>
          <Item value="BA">Bahia</Item>
          <Item value="CE">Ceará</Item>
          <Item value="DF">Distrito Federal</Item>
          <Item value="GO">Goiás</Item>
          <Item value="MG">Minas Gerais</Item>
          <Item value="PA">Pará</Item>
          <Item value="PR">Paraná</Item>
          <Item value="RJ">Rio de Janeiro</Item>
          <Item value="RS">Rio Grande do Sul</Item>
          <Item value="SC">Santa Catarina</Item>
          <Item value="SP">São Paulo</Item>
        </groupselectone--ml-select-one-autocomplete>
      `, cardBg, false, [
        { label: 'clearable',  key: 'clearable'  },
        { label: 'searchable', key: 'searchable' },
      ])}
      ${this.renderExampleRow('With groups', this.autocompleteGrouped, (n) => { this.autocompleteGrouped = n; }, html`
        <groupselectone--ml-select-one-autocomplete
          value="${this.autocompleteGrouped.value}" name="country" error="${this.autocompleteGrouped.error}"
          .isEditing=${this.autocompleteGrouped.isEditing} .required=${this.autocompleteGrouped.required}
          .disabled=${this.autocompleteGrouped.disabled} .readonly=${this.autocompleteGrouped.readonly}
          .loading=${this.autocompleteGrouped.loading} .clearable=${this.autocompleteGrouped.clearable}
          .searchable=${this.autocompleteGrouped.searchable}
          @change=${(e: CustomEvent) => { this.autocompleteGrouped = { ...this.autocompleteGrouped, value: e.detail.value }; }}
        >
          <Label>Country</Label>
          <Helper>Select the country of origin.</Helper>
          <Group label="South America">
            <Item value="BR">Brazil</Item>
            <Item value="AR">Argentina</Item>
            <Item value="CL">Chile</Item>
            <Item value="CO">Colombia</Item>
          </Group>
          <Group label="North America">
            <Item value="US">United States</Item>
            <Item value="CA">Canada</Item>
            <Item value="MX">Mexico</Item>
          </Group>
          <Group label="Europe">
            <Item value="DE">Germany</Item>
            <Item value="FR">France</Item>
            <Item value="PT">Portugal</Item>
            <Item value="ES">Spain</Item>
          </Group>
        </groupselectone--ml-select-one-autocomplete>
      `, cardBg, true, [
        { label: 'clearable',  key: 'clearable'  },
        { label: 'searchable', key: 'searchable' },
      ])}
  `)}

</div>`;
  }
}
