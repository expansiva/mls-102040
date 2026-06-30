/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// HIERARCHY TREE MOLECULE
// =============================================================================
// Skill Group: groupViewHierarchy
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No items to display',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum item para exibir',
 },
};
/// **collab_i18n_end**

interface ParsedNode {
 value: string | null;
 expanded: boolean;
 disabled: boolean;
 content: string;
 children: ParsedNode[];
 id: string;
}

@customElement('groupviewhierarchy--ml-hierarchy-tree')
export class HierarchyTreeMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Node','Empty'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 multiple: boolean = true;

 @propertyDataSource({ type: Boolean, attribute:'expand-all' })
 expandAll: boolean = false;

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 loading: boolean = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private expandedNodes: Set<string> = new Set();

 @state()
 private parsedNodes: ParsedNode[] = [];

 @state()
 private focusedNodeId: string | null = null;

 private nodeIdCounter: number = 0;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.parseNodes();
 this.initializeExpandedState();
 }

 updated(changedProperties: Map<string, unknown>) {
 if (changedProperties.has('expandAll')) {
 this.initializeExpandedState();
 }
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 private parseNodes() {
 this.nodeIdCounter = 0;
 const nodeElements = this.getSlots('Node');
 this.parsedNodes = nodeElements.map(el => this.parseNodeElement(el));
 }

 private parseNodeElement(element: Element): ParsedNode {
 const id = `node-${this.nodeIdCounter++}`;
 const value = element.getAttribute('value');
 const expanded = element.hasAttribute('expanded');
 const disabled = element.hasAttribute('disabled');

 const childNodes = Array.from(element.children).filter(
 child => child.tagName.toUpperCase() ==='NODE'
 );

 const contentNodes = Array.from(element.childNodes).filter(node => {
 if (node.nodeType === Node.ELEMENT_NODE) {
 return (node as Element).tagName.toUpperCase() !=='NODE';
 }
 return node.nodeType === Node.TEXT_NODE && node.textContent?.trim();
 });

 const content = contentNodes
 .map(node => {
 if (node.nodeType === Node.ELEMENT_NODE) {
 return (node as Element).outerHTML;
 }
 return node.textContent ||'';
 })
 .join('')
 .trim();

 const children = childNodes.map(child => this.parseNodeElement(child));

 return {
 value,
 expanded,
 disabled,
 content,
 children,
 id,
 };
 }

 private initializeExpandedState() {
 this.expandedNodes = new Set();
 if (this.expandAll) {
 this.expandAllNodes(this.parsedNodes);
 } else {
 this.initializeFromAttributes(this.parsedNodes);
 }
 }

 private expandAllNodes(nodes: ParsedNode[]) {
 for (const node of nodes) {
 if (node.children.length > 0) {
 this.expandedNodes.add(node.id);
 this.expandAllNodes(node.children);
 }
 }
 }

 private initializeFromAttributes(nodes: ParsedNode[]) {
 for (const node of nodes) {
 if (node.expanded && node.children.length > 0) {
 this.expandedNodes.add(node.id);
 }
 this.initializeFromAttributes(node.children);
 }
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleToggle(node: ParsedNode, siblings: ParsedNode[]) {
 if (this.disabled || node.disabled || node.children.length === 0) return;

 const isExpanded = this.expandedNodes.has(node.id);
 const newExpandedNodes = new Set(this.expandedNodes);

 if (isExpanded) {
 newExpandedNodes.delete(node.id);
 } else {
 if (!this.multiple) {
 for (const sibling of siblings) {
 if (sibling.id !== node.id) {
 newExpandedNodes.delete(sibling.id);
 }
 }
 }
 newExpandedNodes.add(node.id);
 }

 this.expandedNodes = newExpandedNodes;

 this.dispatchEvent(
 new CustomEvent('toggle', {
 bubbles: true,
 composed: true,
 detail: { value: node.value, expanded: !isExpanded },
 })
 );
 }

 private handleNodeClick(node: ParsedNode) {
 if (this.disabled || node.disabled) return;

 this.dispatchEvent(
 new CustomEvent('nodeClick', {
 bubbles: true,
 composed: true,
 detail: { value: node.value },
 })
 );
 }

 private handleKeyDown(e: KeyboardEvent, node: ParsedNode, siblings: ParsedNode[], flatNodes: ParsedNode[]) {
 if (this.disabled || node.disabled) return;

 const currentIndex = flatNodes.findIndex(n => n.id === node.id);

 switch (e.key) {
 case'ArrowDown':
 e.preventDefault();
 if (currentIndex < flatNodes.length - 1) {
 this.focusedNodeId = flatNodes[currentIndex + 1].id;
 this.focusNode(flatNodes[currentIndex + 1].id);
 }
 break;
 case'ArrowUp':
 e.preventDefault();
 if (currentIndex > 0) {
 this.focusedNodeId = flatNodes[currentIndex - 1].id;
 this.focusNode(flatNodes[currentIndex - 1].id);
 }
 break;
 case'ArrowRight':
 e.preventDefault();
 if (node.children.length > 0 && !this.expandedNodes.has(node.id)) {
 this.handleToggle(node, siblings);
 }
 break;
 case'ArrowLeft':
 e.preventDefault();
 if (node.children.length > 0 && this.expandedNodes.has(node.id)) {
 this.handleToggle(node, siblings);
 }
 break;
 case'Enter':
 case'':
 e.preventDefault();
 if (node.children.length > 0) {
 this.handleToggle(node, siblings);
 } else {
 this.handleNodeClick(node);
 }
 break;
 }
 }

 private focusNode(nodeId: string) {
 requestAnimationFrame(() => {
 const element = this.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
 if (element) {
 element.focus();
 }
 });
 }

 private getFlatNodes(nodes: ParsedNode[]): ParsedNode[] {
 const result: ParsedNode[] = [];
 for (const node of nodes) {
 result.push(node);
 if (this.expandedNodes.has(node.id) && node.children.length > 0) {
 result.push(...this.getFlatNodes(node.children));
 }
 }
 return result;
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private getContainerClasses(): string {
 return [
'w-full',
'ml-surface-bg',
'ml-text',
 ].join(' ');
 }

 private getLabelClasses(): string {
 return [
'text-sm font-medium mb-2 block',
'ml-text',
 ].join(' ');
 }

 private getNodeClasses(node: ParsedNode, level: number): string {
 const isDisabled = this.disabled || node.disabled;
 const hasChildren = node.children.length > 0;

 return [
'flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors',
'text-sm',
 level > 0 ? `ml-${Math.min(level * 4, 16)}` :'',
 isDisabled
 ?'ml-disabled ml-text-faint'
 :'ml-text',
 !isDisabled && hasChildren
 ?'cursor-pointer hover:ml-surface-dim-bg'
 :'',
 !isDisabled && !hasChildren
 ?'cursor-pointer hover:ml-surface-dim-bg'
 :'',
'',
 ].filter(Boolean).join(' ');
 }

 private getToggleClasses(node: ParsedNode): string {
 const isExpanded = this.expandedNodes.has(node.id);
 const isDisabled = this.disabled || node.disabled;

 return [
'w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform',
 isExpanded ?'rotate-90' :'',
 isDisabled
 ?'ml-text-muted'
 :'ml-text-muted',
 ].join(' ');
 }

 private getEmptyClasses(): string {
 return [
'text-sm py-4 text-center',
'ml-text-muted',
 ].join(' ');
 }

 private getLoadingClasses(): string {
 return [
'text-sm py-4 text-center',
'ml-text-muted',
 ].join(' ');
 }

 private getChildrenContainerClasses(): string {
 return [
'border-l ml-border ml-2.5',
 ].join(' ');
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

 this.parseNodes();
 this.initializeExpandedState();

 if (this.parsedNodes.length === 0) {
 return this.renderEmpty();
 }

 const flatNodes = this.getFlatNodes(this.parsedNodes);

 return html`
 <div class=${cn(this.getContainerClasses(), this.cssClass)}>
 ${this.renderLabel()}
 <div role="tree" aria-label="Hierarchy tree">
 ${this.parsedNodes.map(node =>
 this.renderNode(node, 0, this.parsedNodes, flatNodes)
 )}
 </div>
 </div>
 `;
 }

 private renderLoading(): TemplateResult {
 return html`
 <div class=${this.getLoadingClasses()}>
 ${this.msg.loading}
 </div>
 `;
 }

 private renderEmpty(): TemplateResult {
 const emptyContent = this.getSlotContent('Empty') || this.msg.empty;
 return html`
 <div class=${cn(this.getEmptyClasses(), this.getSlotClass('Empty'))}>
 ${unsafeHTML(emptyContent)}
 </div>
 `;
 }

 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) {
 return html``;
 }
 const labelContent = this.getSlotContent('Label');
 return html`
 <div class=${cn(this.getLabelClasses(), this.getSlotClass('Label'))}>
 ${unsafeHTML(labelContent)}
 </div>
 `;
 }

 private renderNode(
 node: ParsedNode,
 level: number,
 siblings: ParsedNode[],
 flatNodes: ParsedNode[]
 ): TemplateResult {
 const hasChildren = node.children.length > 0;
 const isExpanded = this.expandedNodes.has(node.id);
 const isDisabled = this.disabled || node.disabled;
 const paddingLeft = level * 16;

 return html`
 <div role="treeitem"
 aria-expanded=${hasChildren ? String(isExpanded) :'undefined'}
 aria-disabled=${isDisabled ?'true' :'false'}
 data-node-id=${node.id}
 tabindex=${isDisabled ? -1 : 0}
 class=${this.getNodeClasses(node, 0)}
 style="padding-left: ${paddingLeft}px"
 @click=${() => hasChildren ? this.handleToggle(node, siblings) : this.handleNodeClick(node)}
 @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, node, siblings, flatNodes)}>
 ${hasChildren ? this.renderToggleIcon(node) : this.renderLeafSpacer()}
 <span class="flex-1 min-w-0" @click=${(e: Event) => {
 e.stopPropagation();
 this.handleNodeClick(node);
 }}>
 ${unsafeHTML(node.content)}
 </span>
 </div>
 ${hasChildren && isExpanded ? this.renderChildren(node, level, flatNodes) : html``}
 `;
 }

 private renderToggleIcon(node: ParsedNode): TemplateResult {
 return html`
 <span class=${this.getToggleClasses(node)}>
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
 <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
 </svg>
 </span>
 `;
 }

 private renderLeafSpacer(): TemplateResult {
 return html`<span class="w-5 h-5 flex-shrink-0"></span>`;
 }

 private renderChildren(node: ParsedNode, level: number, flatNodes: ParsedNode[]): TemplateResult {
 const paddingLeft = level * 16;
 return html`
 <div role="group" class=${this.getChildrenContainerClasses()} style="margin-left: ${paddingLeft + 10}px">
 ${node.children.map(child =>
 this.renderNode(child, level + 1, node.children, flatNodes)
 )}
 </div>
 `;
 }
}
