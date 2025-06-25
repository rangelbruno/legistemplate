'use client'

import React from 'react'
import { FloatingMenu, Editor } from '@tiptap/react'

interface TiptapFloatingMenuProps {
  editor: Editor
}

export function TiptapFloatingMenu({ editor }: TiptapFloatingMenuProps) {
  if (!editor) return null

  return (
    <FloatingMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      className="tiptap-floating-menu"
    >
      <div className="floating-menu-content">
        <span className="floating-menu-label">Clique para adicionar:</span>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="floating-btn"
          title="Título 1"
        >
          <i className="ki-duotone ki-text-bold fs-5">
            <span className="path1"></span>
          </i>
          <span>H1</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="floating-btn"
          title="Título 2"
        >
          <i className="ki-duotone ki-text-bold fs-6">
            <span className="path1"></span>
          </i>
          <span>H2</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="floating-btn"
          title="Lista"
        >
          <i className="ki-duotone ki-bullet-list fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
            <span className="path6"></span>
          </i>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="floating-btn"
          title="Lista numerada"
        >
          <i className="ki-duotone ki-numbered-list fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
          </i>
        </button>
        
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="floating-btn"
          title="Tabela"
        >
          <i className="ki-duotone ki-row-horizontal fs-5">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
      </div>
    </FloatingMenu>
  )
} 