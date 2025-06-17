import { useCallback, useEffect, useRef } from 'react'

interface UseMenuAccordionOptions {
  preventAutoScroll?: boolean
  expandMultiple?: boolean
}

export const useMenuAccordion = (options: UseMenuAccordionOptions = {}) => {
  const { preventAutoScroll = true, expandMultiple = true } = options
  const scrollPositionRef = useRef<number>(0)
  const isExpandingRef = useRef<boolean>(false)

  // Salvar posição atual do scroll
  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop
  }, [])

  // Restaurar posição do scroll se necessário
  const restoreScrollPosition = useCallback(() => {
    if (!preventAutoScroll) return
    
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
    const savedScroll = scrollPositionRef.current
    
    // Se o scroll mudou mais que 10px, restaurar
    if (Math.abs(currentScroll - savedScroll) > 10) {
      window.scrollTo({
        top: savedScroll,
        behavior: 'auto'
      })
    }
  }, [preventAutoScroll])

  // Handler para clique no menu accordion
  const handleAccordionClick = useCallback((e: React.MouseEvent, callback?: () => void) => {
    if (preventAutoScroll) {
      saveScrollPosition()
      isExpandingRef.current = true
      
      // Restaurar scroll após animação
      setTimeout(() => {
        restoreScrollPosition()
        isExpandingRef.current = false
      }, 300) // Tempo da animação do accordion
    }
    
    // Executar callback se fornecido
    if (callback) {
      callback()
    }
  }, [preventAutoScroll, saveScrollPosition, restoreScrollPosition])

  // Configurar opções globais do menu (simplificado)
  useEffect(() => {
    if (expandMultiple) {
      // Configuração mais suave para múltiplos accordions
      setTimeout(() => {
        const menuElements = document.querySelectorAll('[data-kt-menu="true"]')
        menuElements.forEach(element => {
          const htmlElement = element as HTMLElement
          htmlElement.setAttribute('data-kt-menu-accordion-expand', 'true')
        })
      }, 1000) // Esperar menu inicializar completamente
    }
  }, [expandMultiple])

  // Listener para scroll durante expansão
  useEffect(() => {
    if (!preventAutoScroll) return

    const handleScroll = () => {
      if (isExpandingRef.current) {
        // Prevenir scroll durante expansão
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto'
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [preventAutoScroll])

  return {
    handleAccordionClick,
    saveScrollPosition,
    restoreScrollPosition
  }
} 