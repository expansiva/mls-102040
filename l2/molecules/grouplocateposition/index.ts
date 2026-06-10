/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouplocateposition/ml-address-autocomplete';
import '/_102040_/l2/molecules/grouplocateposition/ml-geolocation-trigger';
import '/_102040_/l2/molecules/grouplocateposition/ml-locate-map-picker';
import '/_102040_/l2/molecules/grouplocateposition/ml-locate-nearby';

@customElement('molecules--grouplocateposition--index-102040')
export class GroupLocatePositionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state()
  private cardAddressAutocomplete = '-23.55,-46.63';

  @state()
  private cardGeolocationTrigger = '';

  @state()
  private cardLocateMapPicker = '-19.92,-43.94';

  @state()
  private cardLocateNearby = '-22.90,-43.17';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupLocatePosition
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Locate Position
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to inform or visualize a geographic location. Supports address search with autocomplete, geolocation capture, and map preview through multiple implementations.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Address autocomplete</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouplocateposition--ml-address-autocomplete</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for typing an address with suggestions provided by your BFF.</p>
              <grouplocateposition--ml-address-autocomplete
                name="card-address-autocomplete"
                value="${this.cardAddressAutocomplete}"
                placeholder="Search delivery address..."
                .required=${true}
                .showMap=${true}
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAddressAutocomplete = e.detail.value;
                }}
              >
                <Label>Delivery address</Label>
                <Helper>Start typing to see nearby matches.</Helper>
                <Trigger>Use my current location</Trigger>
                <Suggestions>
                  <Item value="-23.55,-46.63">São Paulo, SP</Item>
                  <Item value="-23.57,-46.65">Av. Paulista, SP</Item>
                </Suggestions>
                <Empty>No suggestions yet</Empty>
              </grouplocateposition--ml-address-autocomplete>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Geolocation trigger</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouplocateposition--ml-geolocation-trigger</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when you only need a quick "use my location" action.</p>
              <grouplocateposition--ml-geolocation-trigger
                name="card-geolocation-trigger"
                value="${this.cardGeolocationTrigger}"
                placeholder="No location selected"
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardGeolocationTrigger = e.detail.value;
                }}
              >
                <Label>Pickup location</Label>
                <Helper>Tap the button to capture your current position.</Helper>
                <Trigger>Detect my position</Trigger>
                <Suggestions>
                  <Item value="-22.90,-43.17">Rio de Janeiro, RJ</Item>
                  <Item value="-22.91,-43.20">Copacabana, RJ</Item>
                </Suggestions>
                <Empty>No location captured yet</Empty>
              </grouplocateposition--ml-geolocation-trigger>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Map picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouplocateposition--ml-locate-map-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for selecting a precise point with a map preview.</p>
              <grouplocateposition--ml-locate-map-picker
                name="card-locate-map-picker"
                value="${this.cardLocateMapPicker}"
                placeholder="Search or drop a pin"
                .showMap=${true}
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardLocateMapPicker = e.detail.value;
                }}
              >
                <Label>Store pin</Label>
                <Helper>Move the pin or search for an address.</Helper>
                <Trigger>Use my location</Trigger>
                <Suggestions>
                  <Item value="-19.92,-43.94">Belo Horizonte, MG</Item>
                  <Item value="-19.90,-43.95">Savassi, MG</Item>
                </Suggestions>
                <Empty>Drop a pin to set the location</Empty>
              </grouplocateposition--ml-locate-map-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Nearby area selector</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouplocateposition--ml-locate-nearby</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for picking a nearby area around a known coordinate.</p>
              <grouplocateposition--ml-locate-nearby
                name="card-locate-nearby"
                value="${this.cardLocateNearby}"
                placeholder="Select a nearby area"
                .showMap=${true}
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardLocateNearby = e.detail.value;
                }}
              >
                <Label>Service area</Label>
                <Helper>Choose a nearby neighborhood for delivery.</Helper>
                <Trigger>Use my location</Trigger>
                <Suggestions>
                  <Item value="-22.90,-43.17">Centro, RJ</Item>
                  <Item value="-22.92,-43.18">Lapa, RJ</Item>
                </Suggestions>
                <Empty>No nearby options available</Empty>
              </grouplocateposition--ml-locate-nearby>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      addressAutocomplete: boolean;
      geolocationTrigger: boolean;
      locateMapPicker: boolean;
      locateNearby: boolean;
    }> = [
      {
        scenario: 'User types an address and expects search suggestions from your backend.',
        addressAutocomplete: true,
        geolocationTrigger: false,
        locateMapPicker: false,
        locateNearby: false,
      },
      {
        scenario: 'Only need a single action to capture the current coordinates.',
        addressAutocomplete: false,
        geolocationTrigger: true,
        locateMapPicker: false,
        locateNearby: false,
      },
      {
        scenario: 'User should select a precise pin with an embedded map preview.',
        addressAutocomplete: false,
        geolocationTrigger: false,
        locateMapPicker: true,
        locateNearby: false,
      },
      {
        scenario: 'Choose a nearby area once a base location is known.',
        addressAutocomplete: false,
        geolocationTrigger: false,
        locateMapPicker: false,
        locateNearby: true,
      },
    ];
    const headers = [
      { label: 'Address autocomplete', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Geolocation trigger', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Map picker', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Nearby area', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to decide which locate + position implementation best matches the way users need to inform or visualize a geographic location.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.addressAutocomplete,
                        row.geolocationTrigger,
                        row.locateMapPicker,
                        row.locateNearby,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `
                      )}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // RENDER
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
