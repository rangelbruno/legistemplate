'use client'

import { ReactNode } from 'react'

interface EditorLayoutProps {
  children: ReactNode
}

/**
 * Layout específico para o Editor de Templates
 * Remove o sidebar e usa tela cheia para melhor experiência de edição
 */
export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="editor-fullscreen-layout">
      {children}
    </div>
  )
} 