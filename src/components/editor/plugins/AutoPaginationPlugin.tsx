import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  KEY_ENTER_COMMAND,
  TextNode,
} from 'lexical';
import { useEffect, useState, useRef } from 'react';
import { throttle } from 'lodash';

import { $createPageNode, $isPageNode, PageNode } from '../nodes/PageNode';

const A4_HEIGHT_PX = 1123;
const PAGE_MARGIN_TOP = 113;
const PAGE_MARGIN_BOTTOM = 76;
const CONTENT_AREA_HEIGHT = A4_HEIGHT_PX - PAGE_MARGIN_TOP - PAGE_MARGIN_BOTTOM;

// Este plugin vai cuidar da paginação automática.
export default function AutoPaginationPlugin({
  pageHeight = CONTENT_AREA_HEIGHT,
}: {
  pageHeight?: number;
}): null {
  const [editor] = useLexicalComposerContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  // Função para garantir que o documento comece com uma página
  const initializePage = () => {
    editor.update(() => {
      const root = $getRoot();
      if (root.getChildrenSize() === 0) {
        root.append($createPageNode());
      }
    });
  };

  // Função para verificar e corrigir a paginação
  const checkAndFixPagination = () => {
    if (processingRef.current) return;
    
    processingRef.current = true;
    
    editor.update(() => {
      const root = $getRoot();
      const pages = root.getChildren().filter($isPageNode);
      
      // Verifica cada página
      for (const page of pages) {
        const pageKey = page.getKey();
        const pageElement = editor.getElementByKey(pageKey);
        
        if (pageElement) {
          // Mede a altura real do conteúdo
          const contentHeight = pageElement.scrollHeight;
          const maxAllowedHeight = pageHeight;
          
          // Se o conteúdo exceder a altura permitida
          if (contentHeight > maxAllowedHeight) {
            // Identifica os nós que estão transbordando
            const children = page.getChildren();
            const overflowingNodes = [];
            
            // Calcula a posição de cada nó filho
            for (const child of children) {
              const childElement = editor.getElementByKey(child.getKey());
              
              if (childElement) {
                const childTop = childElement.offsetTop;
                const childHeight = childElement.offsetHeight;
                const childBottom = childTop + childHeight;
                
                // Se o nó ultrapassar o limite da página, marca para mover
                if (childBottom > maxAllowedHeight) {
                  overflowingNodes.push(child);
                }
              }
            }
            
            // Se encontrou nós transbordando, move para uma nova página
            if (overflowingNodes.length > 0) {
              // Verifica se já existe uma próxima página ou cria uma nova
              let nextPage = page.getNextSibling();
              
              if (!nextPage || !$isPageNode(nextPage)) {
                nextPage = $createPageNode();
                page.insertAfter(nextPage);
              }
              
              // Move os nós para a próxima página
              overflowingNodes.forEach(node => {
                (nextPage as PageNode).append(node);
              });
              
              // Posiciona o cursor no início da nova página
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const firstNode = (nextPage as PageNode).getFirstDescendant();
                if (firstNode instanceof TextNode) {
                  selection.anchor.set(firstNode.getKey(), 0, 'text');
                  selection.focus.set(firstNode.getKey(), 0, 'text');
                }
              }
            }
          }
        }
      }
    });
    
    processingRef.current = false;
  };
  
  // Versão throttled da função de verificação
  const throttledCheckPagination = throttle(checkAndFixPagination, 100, { 
    leading: true, 
    trailing: true 
  });

  useEffect(() => {
    // Inicializa o documento com uma página
    initializePage();
    
    // Registra listener para atualizações gerais do editor
    const removeUpdateListener = editor.registerUpdateListener(() => {
      throttledCheckPagination();
    });
    
    // Registra listener específico para tecla Enter
    const removeEnterListener = editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        // Executa a verificação imediatamente após Enter
        setTimeout(checkAndFixPagination, 0);
        // Não interrompe o comando Enter original
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
    
    // Limpeza
    return () => {
      removeUpdateListener();
      removeEnterListener();
      throttledCheckPagination.cancel();
    };
  }, [editor]);

  return null;
} 