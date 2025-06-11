'use client'

import { ReactNode } from 'react'

interface AdministradorLayoutProps {
  children: ReactNode
}

/**
 * Layout da Área do Administrador - Sistema de Tramitação Parlamentar
 * 
 * Layout simplificado para usuários com role ADMINISTRADOR
 * Navegação feita através do sidebar esquerdo
 */
export default function AdministradorLayout({ children }: AdministradorLayoutProps) {
  return (
    <div className="administrador-area">
      {/* Conteúdo principal sem navegação redundante */}
      <main className="administrador-content">
        {children}
      </main>
    </div>
  )
} 