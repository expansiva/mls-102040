// Conjunto de ícones do teste — compartilhado por qualquer suíte <style>/<template>.
//
// APENAS PARA TESTE. Em produção, o conjunto de ícones do projeto ainda será definido; aqui ele
// existe para que a regra do template ("ícones vêm do conjunto do projeto, nunca glifo de texto")
// seja cumprível e verificável.
//
// Conjunto FECHADO: um ícone por emprego que o template autoriza, e nenhum a mais.
// Forma fixa de todos: viewBox 0 0 24 24 · fill none · stroke currentColor · stroke-width 1.5 ·
// aria-hidden. Cor nunca é declarada aqui — herda a do texto (currentColor), como o template exige.
//
// Uso na página:
//   import { icons } from './icons.js';
//   ${icons.search()}                 // tamanho padrão (14–16px)
//   ${icons.sortAsc('h-3 w-3')}       // seta de ordenação, menor (10–12px)

import { html, svg } from 'lit';
import type { SVGTemplateResult, TemplateResult } from 'lit';

/** Tamanho padrão de ícone do template: 14–16px. `h-4 w-4` = 16px. */
const DEFAULT_SIZE = 'h-4 w-4';

/** Tamanho da seta de ordenação: o template pede 10–12px. `h-3 w-3` = 12px. */
export const SORT_ARROW_SIZE = 'h-3 w-3';

// Os traços de cada ícone vêm da tag `svg` do Lit, NUNCA de `html`. Motivo, e é uma armadilha que
// não dá erro nenhum: um fragmento criado com `html` é parseado em contexto HTML, onde `<circle>` e
// `<path>` não existem — o browser cria HTMLUnknownElement, o elemento entra no DOM, aparece no
// inspetor e **não pinta nada**. A tag `svg` parseia no namespace certo.
//
// `shrink-0` é essencial: sem ele o ícone é comprimido (e deforma) dentro de container flex apertado,
// que é exatamente o que acontece nos patamares estreitos.
const icon = (paths: SVGTemplateResult, cls: string): TemplateResult => html`<svg
  class="shrink-0 ${cls}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>${paths}</svg>`;

export const icons = {
  /** Busca — campo de busca da faixa de controles. */
  search: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />`, cls),

  /** Ordenação crescente — coluna ativa da grade. */
  sortAsc: (cls: string = SORT_ARROW_SIZE): TemplateResult =>
    icon(svg`<path d="m6 14 6-6 6 6" />`, cls),

  /** Ordenação decrescente — coluna ativa da grade. */
  sortDesc: (cls: string = SORT_ARROW_SIZE): TemplateResult =>
    icon(svg`<path d="m6 10 6 6 6-6" />`, cls),

  /** Página anterior — rodapé da grade. */
  chevronLeft: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="m14 6-6 6 6 6" />`, cls),

  /** Próxima página — rodapé da grade. */
  chevronRight: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="m10 6 6 6-6 6" />`, cls),

  /** Dispensar — notificação, faixa de erro de sistema. */
  dismiss: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M6 6l12 12M18 6L6 18" />`, cls),

  /** Voltar à lista — afordância de retorno do painel no patamar estreito (empilhado). */
  back: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M19 12H5" /><path d="m11 6-6 6 6 6" />`, cls),

  /** Criar — a única ação primária da página. */
  create: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M12 5v14" /><path d="M5 12h14" />`, cls),

  /** Remover — zona de perigo do painel e confirmação do diálogo. */
  remove: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" />`, cls),

  /** Recarregar a consulta — ação secundária do cabeçalho. */
  reload: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v4h-4" />`, cls),

  /** Sucesso — notificação de comando concluído. */
  success: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="m5 13 4 4L19 7" />`, cls),

  /** Situação de atenção — acompanha SEMPRE o texto do chip, nunca o substitui. */
  warning: (cls: string = DEFAULT_SIZE): TemplateResult =>
    icon(svg`<path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />`, cls),

  /** Coleção vazia e painel sem seleção — a ilustração discreta que o template permite. */
  empty: (cls: string = 'h-6 w-6'): TemplateResult =>
    icon(svg`<path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" /><path d="M3 8l2-4h14l2 4" /><path d="M9 12h6" />`, cls),
} as const;

export default icons;
