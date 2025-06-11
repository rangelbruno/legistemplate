'use client'

import { Link } from 'react-router-dom'
import { KTIcon } from '../helpers'

/**
 * Ações Rápidas Administrativas para Sidebar Esquerdo
 * 
 * Componente que exibe atalhos rápidos para administradores
 * Apenas visível quando o usuário tem role ADMIN
 */
export function AdminQuickActions() {
  // Verificar se o usuário é admin
  const isAdminUser = () => {
    const userData = localStorage.getItem('current_user')
    if (userData) {
      const user = JSON.parse(userData)
      return user.role === 'ADMIN'
    }
    return false
  }

  // Se não for admin, não mostrar o componente
  if (!isAdminUser()) {
    return null
  }

  const quickActions = [
    {
      to: '/admin/usuarios',
      icon: 'user-tick',
      title: 'Novo Usuário',
      description: 'Criar conta',
      color: 'primary'
    },
    {
      to: '/admin/configuracoes',
      icon: 'setting-2',
      title: 'Configurar',
      description: 'Sistema',
      color: 'warning'
    },
    {
      to: '/admin/relatorios',
      icon: 'document',
      title: 'Relatório',
      description: 'Gerar análise',
      color: 'info'
    }
  ]

  return (
    <>
      {/* Separador */}
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      
      {/* Header de Atalhos Rápidos */}
      <div className='menu-item'>
        <div className='menu-content pt-4 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
            <KTIcon iconName='flash' className='fs-6 me-1' />
            Atalhos Rápidos
          </span>
        </div>
      </div>

      {/* Ações Rápidas */}
      {quickActions.map((action, index) => (
        <div key={index} className='menu-item'>
          <Link to={action.to} className='menu-link'>
            <span className='menu-icon'>
              <div className={`symbol symbol-30px`}>
                <div className={`symbol-label bg-light-${action.color}`}>
                  <KTIcon iconName={action.icon} className={`fs-5 text-${action.color}`} />
                </div>
              </div>
            </span>
            <span className='menu-title'>
              <div className='d-flex flex-column'>
                <span className='fs-7 fw-bold'>{action.title}</span>
                <span className='fs-8 text-muted'>{action.description}</span>
              </div>
            </span>
          </Link>
        </div>
      ))}

      {/* Status do Sistema - Card Compacto */}
      <div className='menu-item'>
        <div className='menu-content pt-4 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
            <KTIcon iconName='information-5' className='fs-6 me-1' />
            Status Sistema
          </span>
        </div>
      </div>

      <div className='menu-item'>
        <div className='menu-link'>
          <span className='menu-icon'>
            <div className='symbol symbol-30px'>
              <div className='symbol-label bg-light-success'>
                <KTIcon iconName='people' className='fs-5 text-success' />
              </div>
            </div>
          </span>
          <span className='menu-title'>
            <div className='d-flex justify-content-between w-100'>
              <span className='fs-7 text-gray-700'>Usuários Online</span>
              <span className='fs-7 fw-bold text-success'>12</span>
            </div>
          </span>
        </div>
      </div>

      <div className='menu-item'>
        <div className='menu-link'>
          <span className='menu-icon'>
            <div className='symbol symbol-30px'>
              <div className='symbol-label bg-light-primary'>
                <KTIcon iconName='document' className='fs-5 text-primary' />
              </div>
            </div>
          </span>
          <span className='menu-title'>
            <div className='d-flex justify-content-between w-100'>
              <span className='fs-7 text-gray-700'>Proposições</span>
              <span className='fs-7 fw-bold text-primary'>45</span>
            </div>
          </span>
        </div>
      </div>

      <div className='menu-item'>
        <div className='menu-link'>
          <span className='menu-icon'>
            <div className='symbol symbol-30px'>
              <div className='symbol-label bg-light-warning'>
                <KTIcon iconName='backup' className='fs-5 text-warning' />
              </div>
            </div>
          </span>
          <span className='menu-title'>
            <div className='d-flex justify-content-between w-100'>
              <span className='fs-7 text-gray-700'>Backup</span>
              <span className='fs-7 fw-bold text-warning'>2h atrás</span>
            </div>
          </span>
        </div>
      </div>

      {/* Badge de Admin */}
      <div className='menu-item mt-4'>
        <div className='menu-content'>
          <div className='d-flex align-items-center justify-content-center'>
            <span className='badge badge-light-danger fs-8'>
              <KTIcon iconName='shield-check' className='fs-7 me-1' />
              Administrador
            </span>
          </div>
        </div>
      </div>
    </>
  )
} 