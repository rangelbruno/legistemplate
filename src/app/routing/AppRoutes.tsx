/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import {getRedirectPath} from '../../lib/utils/user-helpers.simple'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  
  // Determinar o redirecionamento baseado no role do usuário
  const getDefaultRoute = () => {
    if (!currentUser) return '/auth'
    
    // Pegar role do localStorage (dados salvos durante login)
    const userData = localStorage.getItem('current_user')
    if (userData) {
      const user = JSON.parse(userData)
      const redirectPath = getRedirectPath(user.role)
      console.log(`🔄 Redirecionando usuário ${user.role} para: ${redirectPath}`)
      return redirectPath
    }
    
    return '/dashboard' // Fallback
  }

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to={getDefaultRoute()} />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
