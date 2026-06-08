/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouplocateposition/ml-address-autocomplete';
import '/_102040_/l2/molecules/grouplocateposition/ml-locate-map-picker';
import '/_102040_/l2/molecules/grouplocateposition/ml-geolocation-trigger';

@customElement('molecules--grouplocateposition--index-102040')
export class GroupLocatePositionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state()
  private cardAddress = '-23.55,-46.63';

  @state()
  private cardMapPicker = '-22.90,-43.17';

  @state()
  private cardGeolocation = '';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupLocatePosition
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Locate &amp; Position
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to inform or visualize a geographic location with address search, geolocation capture, and map previews. Values are stored as a lat/lng JSON string while the page supplies autocomplete suggestions.
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
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-address-autocomplete</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Search for an address and select a suggestion provided by the page.</p>
              <grouplocateposition--ml-address-autocomplete
                name="card-address"
                value="${this.cardAddress}"
                placeholder="Search for a pickup address"
                .showMap=${true}
                .allowGeolocation=${true}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAddress = e.detail.value;
                }}
              >
                <Label>Pickup address</Label>
                <Helper>Type at least 3 characters to fetch suggestions.</Helper>
                <Suggestions>
                  <Item value="-23.55,-46.63">São Paulo, SP</Item>
                  <Item value="-22.90,-43.17">Rio de Janeiro, RJ</Item>
                </Suggestions>
                <Empty>No suggestions yet — start typing.</Empty>
              </grouplocateposition--ml-address-autocomplete>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Map picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-locate-map-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Let users pin a location on a map with a preview.</p>
              <grouplocateposition--ml-locate-map-picker
                name="card-map-picker"
                value="${this.cardMapPicker}"
                placeholder="Search or drop a pin"
                .showMap=${true}
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardMapPicker = e.detail.value;
                }}
              >
                <Label>Delivery pin</Label>
                <Helper>Drag the pin or search to set the exact spot.</Helper>
                <Empty>Select a point to preview it on the map.</Empty>
              </grouplocateposition--ml-locate-map-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Geolocation trigger</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-geolocation-trigger</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Capture the user’s current position with a dedicated button.</p>
              <grouplocateposition--ml-geolocation-trigger
                name="card-geolocation"
                value="${this.cardGeolocation}"
                .allowGeolocation=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardGeolocation = e.detail.value;
                }}
              >
                <Label>Use my location</Label>
                <Helper>We’ll request permission to read your location.</Helper>
                <Trigger>Use current location</Trigger>
                <Empty>No location captured yet.</Empty>
              </grouplocateposition--ml-geolocation-trigger>
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
      locateMapPicker: boolean;
      geolocationTrigger: boolean;
    }> = [
      {
        scenario: 'Users know the address and need fast search with suggestions.',
        addressAutocomplete: true,
        locateMapPicker: false,
        geolocationTrigger: false,
      },
      {
        scenario: 'Users need to place a pin or visually verify the location.',
        addressAutocomplete: false,
        locateMapPicker: true,
        geolocationTrigger: false,
      },
      {
        scenario: 'Users should share their current position with one action.',
        addressAutocomplete: false,
        locateMapPicker: false,
        geolocationTrigger: true,
      },
      {
        scenario: 'Offer both search and pin drop for maximum accuracy.',
        addressAutocomplete: true,
        locateMapPicker: true,
        geolocationTrigger: false,
      },
      {
        scenario: 'Combine search with a quick “use my location” option.',
        addressAutocomplete: true,
        locateMapPicker: false,
        geolocationTrigger: true,
      },
    ];
    const headers = [
      { label: 'Address Autocomplete', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Map Picker', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Geolocation Trigger', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this table to decide how to collect or visualize coordinates when you need address search, map selection, or a one-tap geolocation action.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.addressAutocomplete,
                        row.locateMapPicker,
                        row.geolocationTrigger,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
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
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
