import { useEffect } from 'react'

interface UsePageTitleOptions {
  suffix?: string
  separator?: string
}

/**
 * Hook customizado para gerenciar o título da página
 * Automaticamente inclui "LegisInc" no título
 */
export const usePageTitle = (
  title?: string, 
  options: UsePageTitleOptions = {}
) => {
  const { 
    suffix = 'LegisInc - Sistema Legislativo', 
    separator = ' | ' 
  } = options

  useEffect(() => {
    const pageTitle = title 
      ? `${title}${separator}${suffix}`
      : suffix

    document.title = pageTitle
    
    // Cleanup para restaurar título padrão
    return () => {
      document.title = suffix
    }
  }, [title, suffix, separator])

  const setTitle = (newTitle: string) => {
    const pageTitle = newTitle 
      ? `${newTitle}${separator}${suffix}`
      : suffix
    
    document.title = pageTitle
  }

  return { setTitle }
}

export default usePageTitle 