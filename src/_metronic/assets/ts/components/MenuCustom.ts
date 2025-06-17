import { MenuComponent } from './MenuComponent'

class MenuCustom {
  private static scrollPosition: number = 0
  private static isAnimating: boolean = false

  // Configurar menu com opções otimizadas
  public static init() {
    // Não criar novas instâncias, apenas configurar as existentes
    this.enableMultipleAccordions()
    this.disableAutoScroll()
    this.addScrollPreventionListeners()
  }

  // Adicionar listeners para prevenir scroll automático
  private static addScrollPreventionListeners() {
    // Listener para início de animação de accordion
    document.addEventListener('kt.menu.accordion.show', (e) => {
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop
      this.isAnimating = true
    })

    // Listener para fim de animação de accordion
    document.addEventListener('kt.menu.accordion.shown', (e) => {
      setTimeout(() => {
        this.isAnimating = false
      }, 100)
    })

    // Listener para scroll durante animação
    document.addEventListener('scroll', (e) => {
      if (this.isAnimating) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop
        
        // Se houve mudança significativa no scroll, restaurar posição
        if (Math.abs(currentScroll - this.scrollPosition) > 20) {
          window.scrollTo({
            top: this.scrollPosition,
            behavior: 'auto'
          })
        }
      }
    }, { passive: false })
  }

  // Método para atualizar configurações do menu
  public static updateConfig(newOptions: any) {
    const menuElements = document.querySelectorAll('[data-kt-menu="true"]')
    menuElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      const menuInstance = MenuComponent.getInstance(htmlElement)
      
      if (menuInstance) {
        // Atualizar opções se necessário
        Object.assign(menuInstance.options, newOptions)
      }
    })
  }

  // Método para forçar múltiplos accordions abertos
  public static enableMultipleAccordions() {
    const menuElements = document.querySelectorAll('[data-kt-menu="true"]')
    menuElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.setAttribute('data-kt-menu-accordion-expand', 'true')
      
      const menuInstance = MenuComponent.getInstance(htmlElement)
      if (menuInstance) {
        menuInstance.options.accordion.expand = true
      }
    })
  }

  // Método para desabilitar scroll automático globalmente
  public static disableAutoScroll() {
    // Adicionar CSS para prevenir scroll automático
    const style = document.createElement('style')
    style.id = 'menu-no-auto-scroll'
    style.textContent = `
      html {
        scroll-behavior: auto !important;
      }
      
      .menu-item.showing,
      .menu-item.hiding {
        contain: layout style;
      }
      
      .menu-sub-accordion {
        contain: layout;
      }
    `
    
    // Remover estilo anterior se existir
    const existingStyle = document.getElementById('menu-no-auto-scroll')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    document.head.appendChild(style)
  }
}

export { MenuCustom } 