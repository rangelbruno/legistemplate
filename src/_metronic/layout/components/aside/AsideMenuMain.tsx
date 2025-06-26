import {useIntl} from 'react-intl'
import {useEffect} from 'react'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {AdminQuickActions} from '../../../partials/AdminQuickActions'
import {openPrismaStudio} from '../../../../lib/database-access'

export function AsideMenuMain() {
  // const intl = useIntl() // Não utilizado atualmente

  // Configurar comportamento do menu para melhor performance (desabilitado temporariamente)
  useEffect(() => {
    // Aguardar inicialização completa antes de aplicar configurações
    const timer = setTimeout(() => {
      const menuContainer = document.querySelector('#kt_aside_menu')
      if (menuContainer && !menuContainer.hasAttribute('data-kt-menu')) {
        menuContainer.setAttribute('data-kt-menu', 'true')
      }
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

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
      {/* Dashboard Principal - direciona para admin se for ADMIN */}
      <AsideMenuItem
        to={userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
        icon='element-11'
        title='Dashboard'
        fontIcon='bi-house-door'
      />
      
      {/* Visão Geral das Configurações - Para Administradores */}
      {userRole === 'ADMIN' && (
        <AsideMenuItem
          to='/admin/configuracoes'
          icon='setting-2'
          title='Visão Geral'
          fontIcon='bi-gear'
        />
      )}
      
      {/* Seção de Administração - Apenas para Administradores */}
      {userRole === 'ADMIN' && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-4 pb-1'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                Administração
              </span>
            </div>
          </div>
          
          {/* Gestão de Dados */}
          <div className='menu-item' data-menu-category='admin'>
            <AsideMenuItemWithSub
              to='/admin/gestao'
              title='Gestão de Dados'
              fontIcon='bi-people-fill'
              icon='abstract-17'
            >
              <AsideMenuItem to='/admin/vereadores' title='Vereadores' hasBullet={true} />
              <AsideMenuItem to='/admin/partidos' title='Partidos Políticos' hasBullet={true} />
              <AsideMenuItem to='/admin/usuarios' title='Usuários do Sistema' hasBullet={true} />
            </AsideMenuItemWithSub>
          </div>
          
          {/* Configurações do Sistema */}
          <div className='menu-item' data-menu-category='admin'>
            <AsideMenuItemWithSub
              to='/admin/configuracoes/detalhes'
              title='Configurações'
              fontIcon='bi-gear-fill'
              icon='setting-2'
            >
              <AsideMenuItem to='/admin/configuracoes/sistema-basico' title='Sistema Básico' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/usuarios-permissoes' title='Usuários e Permissões' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/configuracoes-tecnicas' title='Configurações Técnicas' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/estrutura-parlamentar' title='Estrutura Parlamentar' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/calendario-sessoes' title='Calendário de Sessões' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/processos-prazos' title='Processos e Prazos' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/documentos-templates' title='Documentos e Templates' hasBullet={true} />
              <AsideMenuItem to='/admin/configuracoes/integracoes' title='Integrações e APIs' hasBullet={true} />
            </AsideMenuItemWithSub>
          </div>
          
          {/* Relatórios e Análises */}
          <div className='menu-item' data-menu-category='admin'>
            <AsideMenuItemWithSub
              to='/admin/relatorios'
              title='Relatórios'
              fontIcon='bi-graph-up'
              icon='chart-simple'
            >
              <AsideMenuItem to='/admin/relatorios' title='Dashboard de Relatórios' hasBullet={true} />
              {/* Futuros relatórios específicos podem ser adicionados aqui */}
            </AsideMenuItemWithSub>
          </div>
          
          {/* Ferramentas de Desenvolvimento */}
          <div className='menu-item' data-menu-category='admin'>
            <AsideMenuItemWithSub
              to='/admin/dev-tools'
              title='Ferramentas Dev'
              fontIcon='bi-tools'
              icon='code'
            >
              <AsideMenuItem to='/admin/api-docs' title='Documentação da API' hasBullet={true} />
              <AsideMenuItem to='/admin/documentacao' title='Documentação do Sistema' hasBullet={true} />
              
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
                  <span className='menu-title'>Banco de Dados</span>
                </a>
              </div>
            </AsideMenuItemWithSub>
          </div>
          
          {/* Atalhos Rápidos Administrativos */}
          <AdminQuickActions />
        </>
      )}





      {/* Seção Pública - Para todos os usuários */}
      <div className='menu-item'>
        <div className='menu-content pt-4 pb-1'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
            Portal Público
          </span>
        </div>
      </div>
      
      <div className='menu-item' data-menu-category='public'>
        <AsideMenuItemWithSub
          to='/publico'
          title='Transparência'
          fontIcon='bi-eye'
          icon='abstract-46'
        >
          <AsideMenuItem to='/publico/proposicoes' title='Proposições' hasBullet={true} />
          <AsideMenuItem to='/publico/sessoes' title='Sessões Plenárias' hasBullet={true} />
          <AsideMenuItem to='/publico/vereadores' title='Vereadores' hasBullet={true} />
          <AsideMenuItem to='/publico/legislacao' title='Legislação' hasBullet={true} />
        </AsideMenuItemWithSub>
      </div>
      
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-6'></div>
        </div>
      </div>
      
      {/* Changelog */}
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'} rel="noreferrer"
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
