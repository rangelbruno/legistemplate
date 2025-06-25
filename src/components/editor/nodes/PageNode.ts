import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from 'lexical';

import { addClassNamesToElement } from '@lexical/utils';
import { ElementNode } from 'lexical';

export type SerializedPageNode = Spread<
  {
    type: 'page';
    version: 1;
  },
  SerializedElementNode
>;

// Funções de conversão para o DOM
function convertPageElement(domNode: HTMLElement): DOMConversionOutput {
  const node = $createPageNode();
  return {
    node,
  };
}

export class PageNode extends ElementNode {
  static getType(): string {
    return 'page';
  }

  static clone(node: PageNode): PageNode {
    return new PageNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');
    const className = config.theme.page;
    if (className !== undefined) {
      addClassNamesToElement(element, className);
    }
    return element;
  }

  updateDOM(prevNode: PageNode, dom: HTMLElement, config: EditorConfig): boolean {
    // Nenhuma propriedade para atualizar, então retornamos false
    return false;
  }

  static importJSON(serializedNode: SerializedPageNode): PageNode {
    return $createPageNode();
  }

  exportJSON(): SerializedPageNode {
    return {
      ...super.exportJSON(),
      type: 'page',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-page')) {
          return null;
        }
        return {
          conversion: convertPageElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(editor: any): DOMExportOutput {
    const { element } = super.exportDOM(editor);

    if (element && element instanceof HTMLElement) {
      element.setAttribute('data-lexical-page', 'true');
    }

    return {
      element,
    };
  }

  // A página deve conter outros blocos de elementos
  canBeEmpty(): false {
    return false;
  }

  // Não queremos que o usuário possa apagar uma PageNode diretamente.
  isShadowRoot(): boolean {
    return true;
  }
}

export function $createPageNode(): PageNode {
  return new PageNode();
}

export function $isPageNode(node: LexicalNode | null | undefined): node is PageNode {
  return node instanceof PageNode;
} 