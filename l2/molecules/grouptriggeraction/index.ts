/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-group';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-standard';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-kebab-action-trigger';
import '/_102040_/l2/molecules/grouptriggeraction/ml-pagination-control';
import '/_102040_/l2/molecules/grouptriggeraction/ml-split-button';
import { molecules, scenarios } from '/_102040_/l2/molecules/grouptriggeraction/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--grouptriggeraction--index-102040')
export class GroupTriggerActionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardStandard = '';
  @state() private cardIcon = '';
  @state() private cardGroup = '';
  @state() private cardSplit = '';
  @state() private cardKebab = '';
  @state() private cardPagination = 1;
  @state() private cardTotalPages = 10;
  @state() private cardCurrentPage = 1;

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    return html`
      <div class="font-sans min-h-screen bg-slate-100 dark:bg-slate-950">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupTriggerAction
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Trigger + Action
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Componentes para executar uma ação ou comando — botões padrão, ícone, grupo, split,
          menu kebab e controle de paginação. Escolha a implementação conforme o contexto de interação.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">

          <!-- ml-button-standard -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Button Standard</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-button-standard</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Botão de ação principal com rótulo e variante visual</p>
              <grouptriggeraction--ml-button-standard
                name="card-standard"
                data-variant="primary"
                size="md"
                .value=${this.cardStandard}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardStandard = e.detail.value; }}
                @action=${() => { this.cardStandard = 'clicked'; }}
              >
                <Label>Salvar alterações</Label>
              </grouptriggeraction--ml-button-standard>
            </div>
          </div>

          <!-- ml-icon-button -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Icon Button</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-icon-button</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ação compacta representada apenas por ícone</p>
              <grouptriggeraction--ml-icon-button
                name="card-icon"
                data-variant="secondary"
                size="md"
                .value=${this.cardIcon}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardIcon = e.detail.value; }}
                @action=${() => { this.cardIcon = 'clicked'; }}
              >
                <Icon>⚙️</Icon>
                <Label>Configurações</Label>
              </grouptriggeraction--ml-icon-button>
            </div>
          </div>

          <!-- ml-button-group -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Button Group</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-button-group</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Conjunto de ações relacionadas exibidas lado a lado</p>
              <grouptriggeraction--ml-button-group
                name="card-group"
                data-variant="secondary"
                size="md"
                .value=${this.cardGroup}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardGroup = e.detail.value; }}
                @action=${() => { this.cardGroup = 'clicked'; }}
              >
                <Label>Esquerda</Label>
                <Label>Centro</Label>
                <Label>Direita</Label>
              </grouptriggeraction--ml-button-group>
            </div>
          </div>

          <!-- ml-split-button -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Split Button</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-split-button</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ação primária com opções secundárias no menu adjacente</p>
              <grouptriggeraction--ml-split-button
                name="card-split"
                data-variant="primary"
                size="md"
                .value=${this.cardSplit}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardSplit = e.detail.value; }}
                @action=${() => { this.cardSplit = 'clicked'; }}
              >
                <Label>Publicar</Label>
                <Icon>▼</Icon>
              </grouptriggeraction--ml-split-button>
            </div>
          </div>

          <!-- ml-kebab-action-trigger -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Kebab Action Trigger</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-kebab-action-trigger</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Menu de overflow (⋮) para ações secundárias ou contextuais</p>
              <grouptriggeraction--ml-kebab-action-trigger
                name="card-kebab"
                data-variant="ghost"
                size="md"
                .value=${this.cardKebab}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardKebab = e.detail.value; }}
                @action=${() => { this.cardKebab = 'clicked'; }}
              >
                <Icon>⋮</Icon>
                <Label>Mais ações</Label>
              </grouptriggeraction--ml-kebab-action-trigger>
            </div>
          </div>

          <!-- ml-pagination-control -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pagination Control</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-pagination-control</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Navegação entre páginas com números e botões primeira/anterior/próxima/última</p>
              <grouptriggeraction--ml-pagination-control            
                name="card-pagination"
                total-pages="${this.cardTotalPages}"
                current-page="${this.cardCurrentPage}"
                .value=${this.cardPagination}
                .isEditing=${true}
                @action=${(e: CustomEvent) => { console.log(e.detail.page); this.cardCurrentPage = e.detail.page; }}
                @change=${(e: CustomEvent) => { alert('teste 2'); this.cardPagination = e.detail.value; }}
                @page-change=${(e: CustomEvent) => { alert('teste'); this.cardPagination = e.detail?.page ?? e.detail?.value ?? this.cardPagination; }}
              >
                <Label>Página</Label>
              </grouptriggeraction--ml-pagination-control>
              <p class="text-xs text-slate-400 mt-3">Página atual: <span class="font-semibold text-slate-600 dark:text-slate-300">${this.cardPagination}</span></p>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }
}
