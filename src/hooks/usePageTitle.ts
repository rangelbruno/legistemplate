import { useEffect } from 'react'
import { usePageData } from '../_metronic/layout/core'

/**
 * Hook personalizado para gerenciar títulos de página de forma mais robusta
 * Garante que o título anterior seja sempre limpo antes de definir um novo
 */
export const usePageTitle = (title: string, breadcrumbs?: Array<{
  title: string
  path: string
  isActive: boolean
  isSeparator?: boolean
}>, description?: string) => {
  const { setPageTitle, setPageDescription, setPageBreadcrumbs } = usePageData()

  useEffect(() => {
    // Limpa todos os estados primeiro
    setPageTitle('')
    setPageDescription('')
    setPageBreadcrumbs([])

    // Pequeno delay para garantir que a limpeza aconteça primeiro
    const timeoutId = setTimeout(() => {
      setPageTitle(title)
      if (description) {
        setPageDescription(description)
      }
      if (breadcrumbs) {
        setPageBreadcrumbs(breadcrumbs)
      }
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      setPageTitle('')
      setPageDescription('')
      setPageBreadcrumbs([])
    }
  }, [title, description, breadcrumbs, setPageTitle, setPageDescription, setPageBreadcrumbs])

  // Função para limpar manualmente se necessário
  const clearPageData = () => {
    setPageTitle('')
    setPageDescription('')
    setPageBreadcrumbs([])
  }

  return { clearPageData }
}

export default usePageTitle 