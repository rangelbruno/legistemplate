'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Página Principal da Área do Administrador
 * 
 * Redireciona automaticamente para o dashboard
 * Dashboard administrativo principal
 */
export default function AdminPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect imediato para o dashboard do administrador
    navigate('/admin/dashboard', { replace: true })
  }, [navigate])

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecionando...</span>
      </div>
    </div>
  )
} 