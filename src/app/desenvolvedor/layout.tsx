'use client'

import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface DesenvolvedorLayoutProps {
  children: ReactNode
}

/**
 * Layout da Área do Desenvolvedor - Sistema de Tramitação Parlamentar
 * 
 * Layout específico para usuários com role DESENVOLVEDOR
 * Inclui navegação entre as telas do Sprint 1
 */
export default function DesenvolvedorLayout({ children }: DesenvolvedorLayoutProps) {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    {
      to: '/desenvolvedor/dashboard',
      label: 'Dashboard',
      icon: 'bi-house-door',
      description: 'Visão geral do sistema'
    },
    {
      to: '/desenvolvedor/proposicoes',
      label: 'Proposições',
      icon: 'bi-files',
      description: 'Gerenciar proposições'
    },
    {
      to: '/desenvolvedor/workflow',
      label: 'Workflow',
      icon: 'bi-diagram-3',
      description: 'Visualizar estados e transições'
    }
  ]

  return (
    <div className="desenvolvedor-area">
      {/* Header da Área do Desenvolvedor */}
      <div className="d-flex justify-content-between align-items-center mb-6 border-bottom pb-4">
        <div>
          <h2 className="text-dark fw-bold fs-4 mb-1">
            <i className="bi bi-code-slash text-primary me-2"></i>
            Área do Desenvolvedor
          </h2>
          <p className="text-muted fs-7 mb-0">
            Sistema de Tramitação Parlamentar - Sprint 1
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge badge-light-success fs-7">
            Sprint 1 Completo
          </span>
          <span className="badge badge-light-primary fs-7">
            Desenvolvedor
          </span>
        </div>
      </div>

      {/* Navegação Horizontal */}
      <div className="card card-flush mb-6">
        <div className="card-body py-4">
                     <div className="d-flex flex-wrap gap-3">
             {navItems.map((item) => {
               const isActive = pathname === item.to
               return (
                 <Link
                   key={item.to}
                   to={item.to}
                   className={`btn btn-flex btn-outline btn-color-gray-700 btn-active-color-primary ${
                     isActive ? 'active' : ''
                   }`}
                   style={{ minWidth: '140px' }}
                 >
                   <i className={`${item.icon} fs-4 me-2`}></i>
                   <div className="d-flex flex-column align-items-start">
                     <span className="fw-bold fs-7">{item.label}</span>
                     <span className="fs-8 text-muted">{item.description}</span>
                   </div>
                 </Link>
               )
             })}
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <main className="desenvolvedor-content">
        {children}
      </main>
    </div>
  )
} 