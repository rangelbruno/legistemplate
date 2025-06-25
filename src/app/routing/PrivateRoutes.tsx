import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {DisableSidebar} from '../../_metronic/layout/core'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {getRedirectPath} from '../../lib/utils/user-helpers.simple'

// Import das páginas do administrador
import AdminDashboard from '../admin/dashboard/page'
import AdminVereadores from '../admin/vereadores/page'
import AdminPartidos from '../admin/partidos/page'
import AdminUsuarios from '../admin/usuarios/page'
import AdminConfiguracoes from '../admin/configuracoes/page'
import AdminRelatorios from '../admin/relatorios/page'
import AdminApiDocs from '../admin/api-docs/page'
import AdminDocumentacao from '../admin/documentacao/page'

// Import das páginas de configurações específicas
import SistemaBasico from '../admin/configuracoes/sistema-basico/page'
import UsuariosPermissoes from '../admin/configuracoes/usuarios-permissoes/page'
import CalendarioSessoes from '../admin/configuracoes/calendario-sessoes/page'
import DocumentosTemplates from '../admin/configuracoes/documentos-templates/page'
import DocumentosTemplatesEditor from '../admin/configuracoes/documentos-templates/editor/page'
import EstruturaParlamentar from '../admin/configuracoes/estrutura-parlamentar/page'
import ProcessosPrazos from '../admin/configuracoes/processos-prazos/page'
import Integracoes from '../admin/configuracoes/integracoes/page'
import ConfiguracoesTecnicas from '../admin/configuracoes/configuracoes-tecnicas/page'



const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  // Função para determinar redirecionamento baseado no role
  const getRoleBasedRedirect = () => {
    const userData = localStorage.getItem('current_user')
    if (userData) {
      const user = JSON.parse(userData)
      return getRedirectPath(user.role)
    }
    return '/dashboard'
  }

  return (
    <Routes>
      {/* Rotas especiais SEM MasterLayout (tela cheia) */}
      <Route path='admin/configuracoes/documentos-templates/editor' element={<DocumentosTemplatesEditor />} />
      <Route path='admin/documentacao' element={<AdminDocumentacao />} />
      
      {/* Todas as outras rotas COM MasterLayout */}
      <Route element={<MasterLayout />}>
        {/* Redirect baseado no role após login */}
        <Route path='auth/*' element={<Navigate to={getRoleBasedRedirect()} />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        
        {/* Rotas do Administrador */}
        <Route path='admin' element={<Navigate to='/admin/dashboard' replace />} />
        <Route path='admin/dashboard' element={<AdminDashboard />} />
        <Route path='admin/vereadores' element={<AdminVereadores />} />
        <Route path='admin/partidos' element={<AdminPartidos />} />
        <Route path='admin/usuarios' element={<AdminUsuarios />} />
        <Route path='admin/configuracoes' element={<AdminConfiguracoes />} />
        <Route path='admin/relatorios' element={<AdminRelatorios />} />
        <Route path='admin/api-docs' element={<AdminApiDocs />} />
        
        {/* Rotas de Configurações Específicas */}
        <Route path='admin/configuracoes/sistema-basico' element={<SistemaBasico />} />
        <Route path='admin/configuracoes/usuarios-permissoes' element={<UsuariosPermissoes />} />
        <Route path='admin/configuracoes/calendario-sessoes' element={<CalendarioSessoes />} />
        <Route path='admin/configuracoes/documentos-templates' element={<DocumentosTemplates />} />
        <Route path='admin/configuracoes/estrutura-parlamentar' element={<EstruturaParlamentar />} />
        <Route path='admin/configuracoes/processos-prazos' element={<ProcessosPrazos />} />
        <Route path='admin/configuracoes/integracoes' element={<Integracoes />} />
        <Route path='admin/configuracoes/configuracoes-tecnicas' element={<ConfiguracoesTecnicas />} />
        

        
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return (
    <Suspense fallback={<TopBarProgress />}>
      <DisableSidebar>{children}</DisableSidebar>
    </Suspense>
  )
}

export {PrivateRoutes}
