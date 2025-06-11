import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Página Root da Área do Desenvolvedor
 * 
 * Redireciona automaticamente para o dashboard
 * quando o usuário acessa /desenvolvedor
 */
export default function DesenvolvedorRoot() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect imediato para o dashboard
    navigate('/desenvolvedor/dashboard', { replace: true })
  }, [navigate])

  // Não renderiza nada, apenas redireciona
  return null
} 