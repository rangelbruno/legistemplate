import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Pagination } from 'tiptap-pagination-breaks';
import './TipTapPaginatedEditor.css';

// Configurações para A4 em pixels (considerando 96 DPI)
const A4_HEIGHT_PX = 297 * 3.7795; // ~1122 px (297mm)
const A4_WIDTH_PX = 210 * 3.7795;  // ~794 px (210mm)
const MARGIN_PX = 96;               // ~25mm (margens ABNT)

interface TipTapPaginatedEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

const TipTapPaginatedEditor: React.FC<TipTapPaginatedEditorProps> = ({
  content = '',
  onChange,
  editable = true
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Pagination.configure({
        pageHeight: A4_HEIGHT_PX,
        pageWidth: A4_WIDTH_PX,
        pageMargin: MARGIN_PX,
        label: 'Página',
        showPageNumber: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  const toggleStrike = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  const insertPageBreak = () => {
    editor?.chain().focus().setHardBreak().run();
  };

  if (!editor) {
    return <div>Carregando editor...</div>;
  }

  return (
    <div className="tiptap-paginated-editor">
      {editable && (
        <div className="editor-toolbar">
          <div className="toolbar-group">
            <button
              onClick={toggleBold}
              className={editor.isActive('bold') ? 'active' : ''}
              title="Negrito (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={toggleItalic}
              className={editor.isActive('italic') ? 'active' : ''}
              title="Itálico (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              onClick={toggleUnderline}
              className={editor.isActive('underline') ? 'active' : ''}
              title="Sublinhado (Ctrl+U)"
            >
              <u>U</u>
            </button>
            <button
              onClick={toggleStrike}
              className={editor.isActive('strike') ? 'active' : ''}
              title="Riscado"
            >
              <s>S</s>
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              onClick={() => setTextAlign('left')}
              className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
              title="Alinhar à esquerda"
            >
              ⬅
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
              title="Centralizar"
            >
              ⬌
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
              title="Alinhar à direita"
            >
              ➡
            </button>
            <button
              onClick={() => setTextAlign('justify')}
              className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
              title="Justificar"
            >
              ⬍
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              onClick={insertPageBreak}
              title="Quebra de página"
            >
              📄
            </button>
          </div>
        </div>
      )}

      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapPaginatedEditor; 