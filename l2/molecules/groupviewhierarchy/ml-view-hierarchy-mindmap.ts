/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/ml-view-hierarchy-mindmap.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// VIEW HIERARCHY MINDMAP MOLECULE
// =============================================================================
// Skill Group: groupViewHierarchy
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  empty: 'No data available',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    empty: 'Nenhum dado disponível',
  },
};
/// **collab_i18n_end**

interface ParsedNode {
  id: string;
  value: string | null;
  content: string;
  children: ParsedNode[];
  expanded: boolean;
  disabled: boolean;
  depth: number;
  parent: ParsedNode | null;
}

interface NodePosition {
  x: number;
  y: number;
  node: ParsedNode;
}

@customElement('groupviewhierarchy--ml-view-hierarchy-mindmap')
export class MlViewHierarchyMindmapMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Node', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  multiple: boolean = true;

  @propertyDataSource({ type: Boolean, attribute: 'expand-all' })
  expandAll: boolean = false;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private parsedNodes: ParsedNode[] = [];

  @state()
  private expandedMap: Map<string, boolean> = new Map();

  @state()
  private viewBox = { x: -400, y: -300, width: 800, height: 600 };

  @state()
  private scale: number = 1;

  @state()
  private focusedNodeId: string | null = null;

  private nodeIdCounter: number = 0;
  private isPanning: boolean = false;
  private panStart = { x: 0, y: 0 };
  private viewBoxStart = { x: 0, y: 0 };

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseNodes();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('expandAll')) {
      this.parseNodes();
    }
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseNodes() {
    this.nodeIdCounter = 0;
    const nodeElements = this.getSlots('Node');
    this.parsedNodes = nodeElements.map(el => this.parseNodeElement(el, 0, null));
    this.initializeExpandedState();
  }

  private parseNodeElement(element: Element, depth: number, parent: ParsedNode | null): ParsedNode {
    const id = `node-${this.nodeIdCounter++}`;
    const value = element.getAttribute('value');
    const hasExpanded = element.hasAttribute('expanded');
    const hasDisabled = element.hasAttribute('disabled');

    const childNodeElements = Array.from(element.children).filter(
      child => child.tagName.toUpperCase() === 'NODE'
    );

    const contentClone = element.cloneNode(true) as Element;
    Array.from(contentClone.children)
      .filter(child => child.tagName.toUpperCase() === 'NODE')
      .forEach(child => child.remove());
    const content = contentClone.innerHTML.trim();

    const node: ParsedNode = {
      id,
      value,
      content,
      children: [],
      expanded: this.expandAll || hasExpanded,
      disabled: hasDisabled,
      depth,
      parent,
    };

    node.children = childNodeElements.map(child => this.parseNodeElement(child, depth + 1, node));

    return node;
  }

  private initializeExpandedState() {
    this.expandedMap = new Map();
    const initNode = (node: ParsedNode) => {
      this.expandedMap.set(node.id, node.expanded);
      node.children.forEach(initNode);
    };
    this.parsedNodes.forEach(initNode);
  }

  private isExpanded(nodeId: string): boolean {
    return this.expandedMap.get(nodeId) ?? false;
  }

  // ===========================================================================
  // LAYOUT CALCULATION
  // ===========================================================================
  private calculatePositions(): NodePosition[] {
    const positions: NodePosition[] = [];
    if (this.parsedNodes.length === 0) return positions;

    const centerX = 0;
    const centerY = 0;
    const ringSpacing = 180;
    const minNodeSpacing = 120;

    if (this.parsedNodes.length === 1) {
      const centralNode = this.parsedNodes[0];
      positions.push({ x: centerX, y: centerY, node: centralNode });
      this.layoutChildren(centralNode, centerX, centerY, 0, Math.PI * 2, 1, ringSpacing, minNodeSpacing, positions);
    } else {
      const centralNode = this.parsedNodes[0];
      positions.push({ x: centerX, y: centerY, node: centralNode });

      const siblingNodes = this.parsedNodes.slice(1);
      const allFirstRingNodes = [...(this.isExpanded(centralNode.id) ? centralNode.children : []), ...siblingNodes];

      if (allFirstRingNodes.length > 0) {
        const angleStep = (Math.PI * 2) / allFirstRingNodes.length;
        allFirstRingNodes.forEach((node, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          const x = centerX + Math.cos(angle) * ringSpacing;
          const y = centerY + Math.sin(angle) * ringSpacing;
          positions.push({ x, y, node });

          if (this.isExpanded(node.id) && node.children.length > 0) {
            const spreadAngle = Math.min(Math.PI / 2, (Math.PI * 2) / allFirstRingNodes.length);
            this.layoutChildren(node, x, y, angle - spreadAngle / 2, angle + spreadAngle / 2, 2, ringSpacing, minNodeSpacing, positions);
          }
        });
      }
    }

    return positions;
  }

  private layoutChildren(
    parentNode: ParsedNode,
    parentX: number,
    parentY: number,
    startAngle: number,
    endAngle: number,
    ring: number,
    ringSpacing: number,
    minNodeSpacing: number,
    positions: NodePosition[]
  ) {
    if (!this.isExpanded(parentNode.id)) return;

    const children = parentNode.children;
    if (children.length === 0) return;

    const radius = ring * ringSpacing;
    const arcLength = (endAngle - startAngle) * radius;
    const requiredSpace = children.length * minNodeSpacing;

    let actualStartAngle = startAngle;
    let actualEndAngle = endAngle;

    if (arcLength < requiredSpace && ring > 1) {
      const neededAngle = requiredSpace / radius;
      const midAngle = (startAngle + endAngle) / 2;
      actualStartAngle = midAngle - neededAngle / 2;
      actualEndAngle = midAngle + neededAngle / 2;
    }

    const angleStep = children.length > 1 ? (actualEndAngle - actualStartAngle) / (children.length - 1) : 0;
    const baseAngle = children.length > 1 ? actualStartAngle : (actualStartAngle + actualEndAngle) / 2;

    children.forEach((child, index) => {
      const angle = baseAngle + index * angleStep;
      const x = parentX + Math.cos(angle) * ringSpacing;
      const y = parentY + Math.sin(angle) * ringSpacing;
      positions.push({ x, y, node: child });

      if (this.isExpanded(child.id) && child.children.length > 0) {
        const spreadAngle = Math.min(Math.PI / 3, Math.PI / (children.length + 1));
        this.layoutChildren(child, x, y, angle - spreadAngle / 2, angle + spreadAngle / 2, ring + 1, ringSpacing, minNodeSpacing, positions);
      }
    });
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleNodeClick(node: ParsedNode, e: Event) {
    e.stopPropagation();
    if (this.disabled || node.disabled) return;

    this.dispatchEvent(new CustomEvent('nodeClick', {
      bubbles: true,
      composed: true,
      detail: { value: node.value }
    }));
  }

  private handleNodeDblClick(node: ParsedNode, e: Event) {
    e.stopPropagation();
    if (this.disabled || node.disabled) return;

    this.dispatchEvent(new CustomEvent('nodeClick', {
      bubbles: true,
      composed: true,
      detail: { value: node.value }
    }));
  }

  private handleToggle(node: ParsedNode, e: Event) {
    e.stopPropagation();
    if (this.disabled || node.disabled) return;
    if (node.children.length === 0) return;

    const currentExpanded = this.isExpanded(node.id);
    const newExpanded = !currentExpanded;

    const newMap = new Map(this.expandedMap);

    if (!this.multiple && newExpanded && node.parent) {
      const siblings = node.parent.children;
      siblings.forEach(sibling => {
        if (sibling.id !== node.id) {
          newMap.set(sibling.id, false);
        }
      });
    }

    if (!this.multiple && newExpanded && node.depth === 0) {
      this.parsedNodes.forEach(sibling => {
        if (sibling.id !== node.id) {
          newMap.set(sibling.id, false);
        }
      });
    }

    newMap.set(node.id, newExpanded);
    this.expandedMap = newMap;

    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      composed: true,
      detail: { value: node.value, expanded: newExpanded }
    }));
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.25, Math.min(4, this.scale * delta));

    const scaleChange = newScale / this.scale;
    this.viewBox = {
      x: this.viewBox.x,
      y: this.viewBox.y,
      width: this.viewBox.width * scaleChange,
      height: this.viewBox.height * scaleChange,
    };
    this.scale = newScale;
  }

  private handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.isPanning = true;
    this.panStart = { x: e.clientX, y: e.clientY };
    this.viewBoxStart = { x: this.viewBox.x, y: this.viewBox.y };
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isPanning) return;
    const dx = (e.clientX - this.panStart.x) * (this.viewBox.width / 800);
    const dy = (e.clientY - this.panStart.y) * (this.viewBox.height / 600);
    this.viewBox = {
      ...this.viewBox,
      x: this.viewBoxStart.x - dx,
      y: this.viewBoxStart.y - dy,
    };
  }

  private handleMouseUp() {
    this.isPanning = false;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    const positions = this.calculatePositions();
    if (positions.length === 0) return;

    const currentIndex = this.focusedNodeId
      ? positions.findIndex(p => p.node.id === this.focusedNodeId)
      : -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < positions.length - 1) {
          this.focusedNodeId = positions[currentIndex + 1].node.id;
        } else if (currentIndex === -1 && positions.length > 0) {
          this.focusedNodeId = positions[0].node.id;
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          this.focusedNodeId = positions[currentIndex - 1].node.id;
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (this.focusedNodeId) {
          const node = this.findNodeById(this.focusedNodeId);
          if (node && node.children.length > 0 && !this.isExpanded(node.id)) {
            this.handleToggle(node, e);
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (this.focusedNodeId) {
          const node = this.findNodeById(this.focusedNodeId);
          if (node && node.children.length > 0 && this.isExpanded(node.id)) {
            this.handleToggle(node, e);
          }
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (this.focusedNodeId) {
          const node = this.findNodeById(this.focusedNodeId);
          if (node && node.children.length > 0) {
            this.handleToggle(node, e);
          }
        }
        break;
    }
  }

  private findNodeById(id: string): ParsedNode | null {
    const search = (nodes: ParsedNode[]): ParsedNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        const found = search(node.children);
        if (found) return found;
      }
      return null;
    };
    return search(this.parsedNodes);
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getNodeClasses(node: ParsedNode, isFocused: boolean): string {
    const isDisabled = this.disabled || node.disabled;
    return [
      'cursor-pointer transition-all duration-200',
      isDisabled ? 'opacity-50' : '',
      isFocused ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
    ].filter(Boolean).join(' ');
  }

  private renderConnections(positions: NodePosition[]): TemplateResult {
    const lines: TemplateResult[] = [];

    const positionMap = new Map<string, NodePosition>();
    positions.forEach(p => positionMap.set(p.node.id, p));

    positions.forEach(pos => {
      if (pos.node.parent && this.isExpanded(pos.node.parent.id)) {
        const parentPos = positionMap.get(pos.node.parent.id);
        if (parentPos) {
          lines.push(svg`
            <line
              x1="${parentPos.x}"
              y1="${parentPos.y}"
              x2="${pos.x}"
              y2="${pos.y}"
              stroke="currentColor"
              stroke-width="2"
              class="text-slate-300 dark:text-slate-600"
            />
          `);
        }
      }

      if (pos.node.depth === 0 && this.parsedNodes.indexOf(pos.node) > 0) {
        const centralPos = positionMap.get(this.parsedNodes[0].id);
        if (centralPos) {
          lines.push(svg`
            <line
              x1="${centralPos.x}"
              y1="${centralPos.y}"
              x2="${pos.x}"
              y2="${pos.y}"
              stroke="currentColor"
              stroke-width="2"
              class="text-slate-300 dark:text-slate-600"
              stroke-dasharray="4 4"
            />
          `);
        }
      }
    });

    return html`${lines}`;
  }

  private renderNodes(positions: NodePosition[]): TemplateResult {
    return html`
      ${positions.map(pos => this.renderNode(pos))}
    `;
  }

  private renderNode(pos: NodePosition): TemplateResult {
    const { x, y, node } = pos;
    const hasChildren = node.children.length > 0;
    const isExpanded = this.isExpanded(node.id);
    const isDisabled = this.disabled || node.disabled;
    const isFocused = this.focusedNodeId === node.id;
    const isCentral = node.depth === 0 && this.parsedNodes.indexOf(node) === 0;

    const nodeWidth = isCentral ? 160 : 140;
    const nodeHeight = isCentral ? 60 : 50;

    const bgClass = isCentral
      ? 'fill-sky-100 dark:fill-sky-900'
      : 'fill-white dark:fill-slate-800';
    const strokeClass = isCentral
      ? 'stroke-sky-500 dark:stroke-sky-400'
      : 'stroke-slate-300 dark:stroke-slate-600';
    const textClass = isCentral
      ? 'fill-sky-900 dark:fill-sky-100'
      : 'fill-slate-900 dark:fill-slate-100';

    return html`
      <g
        class="${this.getNodeClasses(node, isFocused)}"
        role="treeitem"
        aria-expanded="${hasChildren ? isExpanded : undefined}"
        aria-disabled="${isDisabled}"
        tabindex="${isDisabled ? -1 : 0}"
        @click="${(e: Event) => this.handleNodeClick(node, e)}"
        @dblclick="${(e: Event) => this.handleNodeDblClick(node, e)}"
        @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e)}"
      >
        ${svg`
          <rect
            x="${x - nodeWidth / 2}"
            y="${y - nodeHeight / 2}"
            width="${nodeWidth}"
            height="${nodeHeight}"
            rx="8"
            class="${bgClass} ${strokeClass} ${isDisabled ? 'opacity-50' : ''}"
            stroke-width="2"
          />
        `}
        <foreignObject
          x="${x - nodeWidth / 2 + 8}"
          y="${y - nodeHeight / 2 + 4}"
          width="${nodeWidth - 16 - (hasChildren ? 24 : 0)}"
          height="${nodeHeight - 8}"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="flex items-center justify-center h-full text-sm text-center overflow-hidden ${isCentral ? 'text-sky-900 dark:text-sky-100 font-medium' : 'text-slate-900 dark:text-slate-100'} ${isDisabled ? 'opacity-50' : ''}"
          >
            ${unsafeHTML(node.content)}
          </div>
        </foreignObject>
        ${hasChildren ? this.renderToggleButton(x + nodeWidth / 2 - 20, y, isExpanded, isDisabled, node) : html``}
      </g>
    `;
  }

  private renderToggleButton(x: number, y: number, isExpanded: boolean, isDisabled: boolean, node: ParsedNode): TemplateResult {
    return html`
      <g
        @click="${(e: Event) => this.handleToggle(node, e)}"
        class="cursor-pointer"
      >
        ${svg`
          <circle
            cx="${x}"
            cy="${y}"
            r="10"
            class="fill-slate-100 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-500 ${isDisabled ? 'opacity-50' : ''}"
            stroke-width="1"
          />
          <text
            x="${x}"
            y="${y + 4}"
            text-anchor="middle"
            class="fill-slate-600 dark:fill-slate-300 text-xs font-bold select-none ${isDisabled ? 'opacity-50' : ''}"
            style="font-size: 14px;"
          >
            ${isExpanded ? '−' : '+'}
          </text>
        `}
      </g>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const labelContent = this.getSlotContent('Label');
    return html`
      <div class="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        ${unsafeHTML(labelContent)}
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const emptyContent = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.empty;
    return html`
      <div class="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        ${unsafeHTML(emptyContent)}
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"></div>
          <span class="text-slate-500 dark:text-slate-400 text-sm">${this.msg.loading}</span>
        </div>
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

    this.parseNodes();

    if (this.parsedNodes.length === 0) {
      return html`
        <div class="w-full">
          ${this.renderLabel()}
          ${this.renderEmpty()}
        </div>
      `;
    }

    const positions = this.calculatePositions();

    return html`
      <div class="w-full">
        ${this.renderLabel()}
        <div
          class="relative w-full h-96 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          role="tree"
          @wheel="${this.handleWheel}"
          @mousedown="${this.handleMouseDown}"
          @mousemove="${this.handleMouseMove}"
          @mouseup="${this.handleMouseUp}"
          @mouseleave="${this.handleMouseUp}"
        >
          <svg
            class="w-full h-full"
            viewBox="${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}"
            preserveAspectRatio="xMidYMid meet"
          >
            ${svg`
              <g role="group">
                ${this.renderConnections(positions)}
                ${this.renderNodes(positions)}
              </g>
            `}
          </svg>
        </div>
      </div>
    `;
  }
}
