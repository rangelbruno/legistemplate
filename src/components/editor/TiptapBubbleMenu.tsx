'use client'

import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'

interface TiptapBubbleMenuProps {
  editor: Editor
}

export function TiptapBubbleMenu({ editor }: TiptapBubbleMenuProps) {
  if (!editor) return null

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      className="tiptap-bubble-menu"
    >
      <div className="bubble-menu-content">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`bubble-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Negrito"
        >
          <i className="ki-duotone ki-text-bold fs-6">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`bubble-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Itálico"
        >
          <i className="ki-duotone ki-text-italic fs-6">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`bubble-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Sublinhado"
        >
          <i className="ki-duotone ki-text-underline fs-6">
            <span className="path1"></span>
          </i>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`bubble-btn ${editor.isActive('strike') ? 'active' : ''}`}
          title="Riscado"
        >
          <i className="ki-duotone ki-text-strike fs-6">
            <span className="path1"></span>
          </i>
        </button>
        
        <div className="bubble-separator"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`bubble-btn ${editor.isActive('highlight') ? 'active' : ''}`}
          title="Destacar"
        >
          <i className="ki-duotone ki-text-highlight fs-6">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
        
        <button
          onClick={() => {
            const url = window.prompt('Digite a URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`bubble-btn ${editor.isActive('link') ? 'active' : ''}`}
          title="Link"
        >
          <i className="ki-duotone ki-link fs-6">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            <span className="path5"></span>
          </i>
        </button>
      </div>
    </BubbleMenu>
  )
} 