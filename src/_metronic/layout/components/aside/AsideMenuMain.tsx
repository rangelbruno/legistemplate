import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {AdminQuickActions} from '../../../partials/AdminQuickActions'
import {openPrismaStudio} from '../../../../lib/database-access'

export function AsideMenuMain() {
  const intl = useIntl()

  // Verificar o role do usuário para mostrar seções específicas
  const getUserRole = () => {
    const userData = localStorage.getItem('current_user')
    if (userData) {
      const user = JSON.parse(userData)
      return user.role
    }
    return null
  }

  const userRole = getUserRole()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='black-right'
        title='Dashboard Principal'
        fontIcon='bi-app-indicator'
      />
      
      {/* Seção de Desenvolvimento - Apenas para Desenvolvedores */}
      {userRole === 'DESENVOLVEDOR' && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-6 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Desenvolvimento</span>
            </div>
          </div>
          <AsideMenuItemWithSub
            to='/desenvolvedor'
            title='Sistema de Tramitação'
            fontIcon='bi-diagram-3'
            icon='black-right'
          >
            <AsideMenuItem to='/desenvolvedor/dashboard' title='Dashboard' hasBullet={true} />
            <AsideMenuItem to='/desenvolvedor/proposicoes' title='Proposições' hasBullet={true} />
            <AsideMenuItem to='/desenvolvedor/workflow' title='Fluxo de Trabalho' hasBullet={true} />
            <AsideMenuItem to='/desenvolvedor/fluxograma' title='Editor de Fluxogramas' hasBullet={true} />
            <AsideMenuItem to='/desenvolvedor/api-docs' title='Documentação da API' hasBullet={true} />
            
            {/* Atalho para Banco de Dados */}
            <div className='menu-item'>
              <a
                className='menu-link py-3'
                onClick={(e) => {
                  e.preventDefault()
                  openPrismaStudio()
                }}
                style={{ cursor: 'pointer' }}
                title='Acessar Prisma Studio (Interface do Banco de Dados)'
              >
                <span className='menu-bullet'>
                  <span className='bullet bullet-dot'></span>
                </span>
                <span className='menu-title'>
                  <KTIcon iconName='data' className='fs-6 me-2' />
                  Banco de Dados
                </span>
              </a>
            </div>
          </AsideMenuItemWithSub>
        </>
      )}
      
      {/* Seção de Administração - Apenas para Administradores */}
      {userRole === 'ADMIN' && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-6 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Administração</span>
            </div>
          </div>
          <AsideMenuItemWithSub
            to='/admin'
            title='Painel Administrativo'
            fontIcon='bi-shield-check'
            icon='black-right'
          >
            <AsideMenuItem to='/admin/dashboard' title='Dashboard' hasBullet={true} />
            <AsideMenuItem to='/admin/usuarios' title='Usuários' hasBullet={true} />
            <AsideMenuItem to='/admin/configuracoes' title='Configurações' hasBullet={true} />
            <AsideMenuItem to='/admin/relatorios' title='Relatórios' hasBullet={true} />
            <AsideMenuItem to='/desenvolvedor/api-docs' title='Documentação da API' hasBullet={true} />
            
            {/* Atalho para Banco de Dados */}
            <div className='menu-item'>
              <a
                className='menu-link py-3'
                onClick={(e) => {
                  e.preventDefault()
                  openPrismaStudio()
                }}
                style={{ cursor: 'pointer' }}
                title='Acessar Prisma Studio (Interface do Banco de Dados)'
              >
                <span className='menu-bullet'>
                  <span className='bullet bullet-dot'></span>
                </span>
                <span className='menu-title'>
                  <KTIcon iconName='data' className='fs-6 me-2' />
                  Banco de Dados
                </span>
              </a>
            </div>
          </AsideMenuItemWithSub>
          
          {/* Atalhos Rápidos Administrativos */}
          <AdminQuickActions />
        </>
      )}
      
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-6'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='document' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div>
    </>
  )
}
