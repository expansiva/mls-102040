/// <mls fileReference="_102040_/l2/molecules/summary-102040.ts" enhancement="_102020_/l2/enhancementAura" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from '/_102027_/l2/collabLitElement.js';

@customElement('molecules--summary-102040')
export class MoleculesSummary extends CollabLitElement {

  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen">
  <div class="max-w-7xl mx-auto p-8 font-sans">

    <header class="text-center mb-16">
      <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">Molecule Library</h1>
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium mb-6">mls-102040</span>
      <div class="flex justify-center gap-8 mt-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-slate-800 dark:text-slate-100">31</div>
          <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">groups</div>
        </div>
        <div class="w-px bg-slate-200 dark:bg-slate-700"></div>
        <div class="text-center">
          <div class="text-3xl font-bold text-slate-800 dark:text-slate-100">141</div>
          <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">components</div>
        </div>
      </div>
    </header>

    ${this.renderSection('Enter', '11 groups · 42 components', [
      { name: 'Enter Boolean', count: 4, color: 'sky', components: ['ml-boolean-segmented', 'ml-checkbox-preference', 'ml-toggle-icon', 'ml-toggle-switch'] },
      { name: 'Enter Date', count: 4, color: 'sky', components: ['ml-compact-calendar', 'ml-date-picker', 'ml-date-shortcut-picker', 'ml-inline-calendar'] },
      { name: 'Enter Date Interval', count: 4, color: 'sky', components: ['ml-date-interval-drag', 'ml-date-interval-presets', 'ml-date-range-dual-calendar', 'ml-month-year-range'] },
      { name: 'Enter Date Time', count: 2, color: 'sky', components: ['ml-datetime-picker', 'ml-enter-datetime-masked-input'] },
      { name: 'Enter Date Time Interval', count: 3, color: 'sky', components: ['ml-datetime-interval-timeline', 'ml-enter-datetime-interval', 'ml-event-duration-interval'] },
      { name: 'Enter Money', count: 2, color: 'sky', components: ['ml-currency-input', 'ml-enter-money-br'] },
      { name: 'Enter Number', count: 3, color: 'sky', components: ['ml-number-input', 'ml-number-stepper', 'ml-range-slider'] },
      { name: 'Enter Text', count: 7, color: 'sky', components: ['ml-address-field', 'ml-cpf-input', 'ml-floating-text-input', 'ml-multiline-text', 'ml-password-strength-input', 'ml-phone-input', 'ml-tag-input'] },
      { name: 'Enter Time', count: 3, color: 'sky', components: ['ml-clock-time-picker', 'ml-enter-time-duration', 'ml-time-scroll-picker'] },
      { name: 'Enter Time Interval', count: 6, color: 'sky', components: ['ml-enter-time-interval', 'ml-time-interval', 'ml-time-interval-range', 'ml-time-interval-selector', 'ml-time-interval-slider', 'ml-work-shift-interval'] },
      { name: 'Locate Position', count: 4, color: 'sky', components: ['ml-address-autocomplete', 'ml-geolocation-trigger', 'ml-locate-map-picker', 'ml-locate-nearby'] },
    ])}

    ${this.renderSection('Select', '3 groups · 21 components', [
      { name: 'Select One', count: 11, color: 'violet', components: ['ml-card-selector', 'ml-combobox', 'ml-dial-select', 'ml-discrete-slider', 'ml-listbox-sidebar-select', 'ml-radio-group', 'ml-segmented-control', 'ml-select-dropdown-img', 'ml-select-dropdown', 'ml-select-one-autocomplete', 'ml-select'] },
      { name: 'Select Many', count: 5, color: 'violet', components: ['ml-dual-list-select', 'ml-multi-checkbox-list', 'ml-multi-select-dropdown', 'ml-popover-multi-select', 'ml-tree-multi-select'] },
      { name: 'Select File For Upload', count: 5, color: 'violet', components: ['ml-file-metadata-uploader', 'ml-file-upload-dropzone', 'ml-file-upload-preview', 'ml-upload-file-list', 'ml-user-photo-upload'] },
    ])}

    ${this.renderSection('View', '6 groups · 29 components', [
      { name: 'View Card', count: 4, color: 'emerald', components: ['ml-profile-card', 'ml-vertical-card', 'ml-view-card-horizontal', 'ml-view-card-media'] },
      { name: 'View Chart', count: 6, color: 'emerald', components: ['ml-area-chart', 'ml-bar-chart', 'ml-line-chart', 'ml-pie-chart', 'ml-radar-chart', 'ml-scatter-plot'] },
      { name: 'View Data', count: 5, color: 'emerald', components: ['ml-calendar-view', 'ml-card-grid', 'ml-kanban-board', 'ml-timeline-view', 'ml-vertical-record-list'] },
      { name: 'View Hierarchy', count: 4, color: 'emerald', components: ['ml-hierarchy-orgchart', 'ml-hierarchy-tree-diagram', 'ml-hierarchy-tree', 'ml-view-hierarchy-mindmap'] },
      { name: 'View Metric', count: 5, color: 'emerald', components: ['ml-compact-metric-sparkline', 'ml-metric-big-number', 'ml-metric-card', 'ml-metric-gauge', 'ml-metric-trend-compare'] },
      { name: 'View Table', count: 5, color: 'emerald', components: ['ml-data-table-minimal', 'ml-data-table', 'ml-inline-edit-table', 'ml-pivot-table', 'ml-view-table'] },
    ])}

    ${this.renderSection('Navigate', '3 groups · 10 components', [
      { name: 'Navigate Main', count: 1, color: 'amber', components: ['ml-sidebar-nav'] },
      { name: 'Navigate Section', count: 5, color: 'amber', components: ['ml-breadcrumb-trail', 'ml-navigate-pills', 'ml-navigate-tabs', 'ml-side-nav-scrollspy', 'ml-tabs'] },
      { name: 'Navigate Steps', count: 4, color: 'amber', components: ['ml-compact-step-indicator', 'ml-horizontal-stepper', 'ml-vertical-stepper', 'ml-wizard-steps'] },
    ])}

    ${this.renderSection('Other', '8 groups · 39 components', [
      { name: 'Expand Content', count: 5, color: 'rose', components: ['ml-accordion', 'ml-collapsible-panel', 'ml-readmore-expand', 'ml-reveal-overlay', 'ml-single-expand-content'] },
      { name: 'Notify User', count: 4, color: 'rose', components: ['ml-alert-modal', 'ml-contextual-feedback', 'ml-notify-banner', 'ml-toast-notification'] },
      { name: 'Play Media', count: 4, color: 'rose', components: ['ml-audio-player', 'ml-image-gallery', 'ml-pdf-viewer', 'ml-video-player'] },
      { name: 'Rate Item', count: 8, color: 'rose', components: ['ml-ces-scale', 'ml-csat-rating', 'ml-emoji-mood-scale', 'ml-numeric-rating-nps', 'ml-qualitative-feedback-tags', 'ml-rating-slider', 'ml-star-rating', 'ml-thumbs-rating'] },
      { name: 'Scan Code', count: 4, color: 'rose', components: ['ml-scan-code', 'ml-scan-code-1d', 'ml-scan-document', 'ml-scan-ocr'] },
      { name: 'Search Content', count: 4, color: 'rose', components: ['ml-faceted-search', 'ml-search-bar', 'ml-search-filters', 'ml-search-history'] },
      { name: 'Show Progress', count: 5, color: 'rose', components: ['ml-circular-progress', 'ml-indeterminate-spinner', 'ml-linear-progress', 'ml-segmented-progress', 'ml-upload-progress-indicator'] },
      { name: 'Trigger Action', count: 5, color: 'rose', components: ['ml-button-group', 'ml-button-standard', 'ml-icon-button', 'ml-kebab-action-trigger', 'ml-split-button'] },
    ])}

  </div>
</div>
    `;
  }

  private renderSection(title: string, subtitle: string, groups: { name: string; count: number; color: string; components: string[] }[]) {
    return html`
<section class="mb-14">
  <div class="flex items-center gap-3 mb-6">
    <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-300">${title}</h2>
    <span class="text-sm text-slate-400 dark:text-slate-500">${subtitle}</span>
    <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${groups.map(g => this.renderCard(g.name, g.count, g.color, g.components))}
  </div>
</section>
    `;
  }

  private renderCard(name: string, count: number, color: string, components: string[]) {
    const badge: Record<string, string> = {
      sky:     'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300',
      violet:  'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
      amber:   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
      rose:    'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
    };
    return html`
<article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between mb-3">
    <h3 class="font-semibold text-slate-800 dark:text-slate-100">${name}</h3>
    <span class="ml-2 shrink-0 px-2 py-0.5 ${badge[color]} rounded-full text-xs font-medium">${count}</span>
  </div>
  <ul class="space-y-1">
    ${components.map(c => html`<li class="text-sm text-slate-500 dark:text-slate-400 font-mono">${c}</li>`)}
  </ul>
</article>
    `;
  }

}
