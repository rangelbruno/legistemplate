import React from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import EditorTheme from './themes/EditorTheme';
import './themes/Editor.css';
import ToolbarPlugin from './plugins/ToolbarPlugin';

// Componente ErrorBoundary customizado para resolver o problema de tipo
class MyErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div>Algo deu errado.</div>;
    }
    return this.props.children;
  }
}

function Placeholder() {
  return <div className="editor-placeholder">Comece a escrever seu documento aqui...</div>;
}

const editorConfig = {
  namespace: 'LegisTemplateEditor',
  theme: EditorTheme,
  onError(error: Error) {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
};

const Editor = () => {
  return (
    <div className="editor-shell">
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div className="editor-scroller">
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={MyErrorBoundary}
            />
          </div>
        </div>
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default Editor; 