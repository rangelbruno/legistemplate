'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Página Root da Área do Desenvolvedor
 * 
 * Redireciona automaticamente para o dashboard
 * quando o usuário acessa /desenvolvedor
 */
export default function DesenvolvedorRoot() {
  useEffect(() => {
    // Redirect imediato para o dashboard
    redirect('/desenvolvedor/dashboard')
  }, [])

  // Não renderiza nada, apenas redireciona
  return null
} 