# Refatoração Majoritária do Editor para Paginação Automática

## Resumo da Mudança

O componente `WordLikeEditor.tsx` foi completamente refatorado para suportar **paginação automática real**. A arquitetura anterior, que utilizava múltiplas instâncias do editor Lexical (uma para cada página), foi substituída por um **modelo de editor único**.

Essa mudança foi fundamental para permitir que o conteúdo flua de forma natural entre as páginas à medida que o usuário digita, resolvendo a complexidade de sincronizar múltiplos editores.

## Principais Alterações Arquiteturais

1.  **Editor Único (`LexicalComposer`)**:
    *   Anteriormente: Cada página renderizada era uma instância separada do `LexicalComposer`.
    *   Atualmente: Todo o `WordLikeEditor` é encapsulado em um único `LexicalComposer`. Isso cria um estado unificado para todo o documento, facilitando a manipulação do conteúdo de forma coesa.

2.  **Nó de Página Customizado (`PageNode.ts`)**:
    *   Para representar visualmente as páginas dentro do editor único, foi criado um novo `LexicalNode` chamado `PageNode`.
    *   Este nó atua como um container para o conteúdo de cada página A4. O próprio editor agora renderiza a aparência da página (bordas, sombra, etc.) através do tema do Lexical.
    *   Localização: `src/components/editor/nodes/PageNode.ts`

3.  **Plugin de Paginação Automática (`AutoPaginationPlugin.tsx`)**:
    *   Este novo plugin é o cérebro por trás da paginação.
    *   Ele monitora constantemente o conteúdo do editor.
    *   Quando detecta que o conteúdo de um `PageNode` ultrapassou a altura definida para a área útil do A4, ele automaticamente:
        a. Identifica os nós de conteúdo que estão transbordando.
        b. Cria um novo `PageNode` (uma nova página) logo após a página atual.
        c. Move os nós excedentes para a nova página.
    *   Localização: `src/components/editor/plugins/AutoPaginationPlugin.tsx`

4.  **Estrutura de Arquivos de Nós**:
    *   Para uma melhor organização, os nós customizados do Lexical foram movidos para um diretório dedicado.
    *   O `ImageNode.tsx` foi movido para `src/components/editor/nodes/`.
    *   Todos os novos nós devem ser criados neste diretório.

## Componentes Removidos e Simplificados

Como parte da refatoração, os seguintes componentes e hooks, que eram parte da arquitetura de múltiplas páginas, foram removidos ou simplificados:

*   **Removido**: `useMultiPageEditor` (hook de gerenciamento de páginas).
*   **Removido**: `EditablePageA4` (componente que continha uma instância de editor).
*   **Removido**: `PagesThumbnailPanel` e `PageThumbnail` (a lógica de miniaturas de página precisa ser refeita para ser compatível com a nova arquitetura).
*   **Simplificado**: `WordLikeEditor.tsx` agora tem um foco único em renderizar o editor principal.
*   **Simplificado**: `ABNTToolbar` ainda existe, mas sua lógica para interagir com páginas foi removida e precisará ser adaptada para controlar o editor único.

## Próximos Passos

*   [ ] Reimplementar a funcionalidade da barra de ferramentas (`ABNTToolbar`) para aplicar formatação no editor único.
*   [ ] Testar exaustivamente a lógica de paginação com diferentes tipos de conteúdo (texto, imagens grandes, listas).
*   [ ] Reimplementar o painel de miniaturas de página, fazendo com que ele leia os `PageNode`s do estado do editor.
*   [ ] Ajustar o CSS e os estilos para garantir que a aparência do editor e das páginas esteja correta.

Esta refatoração estabelece uma base sólida e correta para a construção de um editor de documentos robusto e com uma experiência de usuário fluida. 