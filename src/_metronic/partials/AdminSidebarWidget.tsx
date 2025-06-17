'use client'

import { Link, useLocation } from 'react-router-dom'
import { KTIcon } from '../helpers'

/**
 * Widget da Área Administrativa para Sidebar Direito
 * 
 * Componente que exibe a navegação administrativa no sidebar direito
 * Apenas visível quando o usuário tem role ADMIN
 */
export function AdminSidebarWidget() {
  const location = useLocation()
  const pathname = location.pathname

  // Verificar se o usuário é admin
  const isAdminUser = () => {
    const userData = localStorage.getItem('current_user')
    if (userData) {
      const user = JSON.parse(userData)
      return user.role === 'ADMIN'
    }
    return false
  }

  // Se não for admin, não mostrar o widget
  if (!isAdminUser()) {
    return (
      <div className="text-center py-10">
        <div className="symbol symbol-100px symbol-circle mx-auto mb-7">
          <div className="symbol-label bg-light-muted">
            <KTIcon iconName="lock" className="fs-1 text-muted" />
          </div>
        </div>
        <h3 className="text-muted mb-3">Acesso Restrito</h3>
        <p className="text-muted fs-7">
          Esta seção é exclusiva para administradores do sistema.
        </p>
      </div>
    )
  }

  const adminNavItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: 'house-door',
      description: 'Painel principal',
      color: 'primary'
    },
    {
      to: '/admin/vereadores',
      label: 'Vereadores',
      icon: 'people',
      description: 'Gerenciar vereadores',
      color: 'success'
    },
    {
      to: '/admin/usuarios',
      label: 'Usuários',
      icon: 'user-tick',
      description: 'Gerenciar usuários',
      color: 'info'
    },
    {
      to: '/admin/configuracoes',
      label: 'Configurações',
      icon: 'gear',
      description: 'Config. do sistema',
      color: 'warning'
    },
    {
      to: '/admin/relatorios',
      label: 'Relatórios',
      icon: 'graph-up',
      description: 'Analytics e reports',
      color: 'danger'
    }
  ]

  return (
    <div className="admin-sidebar-widget">
      {/* Header da Área Admin */}
      <div className="d-flex align-items-center mb-7">
        <div className="symbol symbol-40px me-3">
          <div className="symbol-label bg-light-danger">
            <KTIcon iconName="shield-check" className="fs-2 text-danger" />
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="fs-5 fw-bold text-gray-900">Área Administrativa</div>
          <div className="fs-7 text-muted">Painel de controle</div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="d-flex flex-wrap gap-2 mb-6">
        <span className="badge badge-light-success fs-8">
          ✅ Sistema Ativo
        </span>
        <span className="badge badge-light-danger fs-8">
          🛡️ Admin
        </span>
      </div>

      {/* Navegação Admin */}
      <div className="separator mb-6"></div>
      <h6 className="text-muted text-uppercase fs-7 mb-4">Navegação Rápida</h6>

      <div className="d-flex flex-column gap-3">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.to || pathname.startsWith(item.to + '/')
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`d-flex align-items-center p-3 rounded border ${
                isActive 
                  ? `border-${item.color} bg-light-${item.color}` 
                  : 'border-gray-200 bg-white hover-border-primary'
              }`}
              style={{ textDecoration: 'none' }}
            >
              <div className={`symbol symbol-40px me-3`}>
                <div className={`symbol-label bg-light-${item.color}`}>
                  <KTIcon iconName={item.icon} className={`fs-4 text-${item.color}`} />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className={`fs-6 fw-bold ${isActive ? `text-${item.color}` : 'text-gray-900'}`}>
                  {item.label}
                </div>
                <div className="fs-7 text-muted">{item.description}</div>
              </div>
              {isActive && (
                <KTIcon iconName="arrow-right" className={`fs-4 text-${item.color}`} />
              )}
            </Link>
          )
        })}
      </div>

      {/* Ações Rápidas */}
      <div className="separator my-6"></div>
      <h6 className="text-muted text-uppercase fs-7 mb-4">Ações Rápidas</h6>
      
      <div className="d-flex flex-column gap-2">
        <button className="btn btn-sm btn-light-primary">
          <KTIcon iconName="user-tick" className="fs-4 me-2" />
          Novo Usuário
        </button>
        <button className="btn btn-sm btn-light-warning">
          <KTIcon iconName="setting-2" className="fs-4 me-2" />
          Configurar Sistema
        </button>
        <button className="btn btn-sm btn-light-info">
          <KTIcon iconName="document" className="fs-4 me-2" />
          Gerar Relatório
        </button>
      </div>

      {/* Info do Sistema */}
      <div className="card card-flush mt-6">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <KTIcon iconName="information-5" className="fs-3 text-primary me-2" />
            <span className="fs-6 fw-bold text-gray-900">Status do Sistema</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fs-7 text-muted">Usuários Online:</span>
            <span className="fs-7 fw-bold text-success">12</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fs-7 text-muted">Proposições Ativas:</span>
            <span className="fs-7 fw-bold text-primary">45</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-7 text-muted">Último Backup:</span>
            <span className="fs-7 fw-bold text-warning">2h atrás</span>
          </div>
        </div>
      </div>
    </div>
  )
} 