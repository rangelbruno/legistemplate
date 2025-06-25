import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// Constantes para página A4
const A4_DIMENSIONS = {
  width: 794,  // 21cm em pixels (96 DPI)
  height: 1123 // 29.7cm em pixels (96 DPI)
}

const ABNT_MARGINS = {
  top: 113,    // 3cm
  right: 76,   // 2cm
  bottom: 76,  // 2cm
  left: 113    // 3cm
}

// Área útil da página (descontando margens)
const CONTENT_AREA = {
  width: A4_DIMENSIONS.width - ABNT_MARGINS.left - ABNT_MARGINS.right,
  height: A4_DIMENSIONS.height - ABNT_MARGINS.top - ABNT_MARGINS.bottom
}

// Altura estimada de linha (12pt Times New Roman com line-height 1.5)
const ESTIMATED_LINE_HEIGHT = 24 // pixels
const MAX_LINES_PER_PAGE = Math.floor(CONTENT_AREA.height / ESTIMATED_LINE_HEIGHT)

interface AutoPaginationOptions {
  pageBreakClass?: string
  onPageBreak?: (pageNumber: number) => void
  onPageOverflow?: (pageNumber: number, overflowHeight: number) => void
  enableAutoBreak?: boolean
  maxLinesPerPage?: number
}

export interface AutoPaginationStorage {
  pages: Array<{
    id: string
    startPos: number
    endPos: number
    height: number
    lineCount: number
  }>
  currentPage: number
  totalPages: number
}

const AutoPaginationPluginKey = new PluginKey('autoPagination')

export const AutoPagination = Extension.create<AutoPaginationOptions, AutoPaginationStorage>({
  name: 'autoPagination',

  addOptions() {
    return {
      pageBreakClass: 'page-break',
      onPageBreak: () => {},
      onPageOverflow: () => {},
      enableAutoBreak: true,
      maxLinesPerPage: MAX_LINES_PER_PAGE,
    }
  },

  addStorage() {
    return {
      pages: [{ id: '1', startPos: 0, endPos: 0, height: 0, lineCount: 0 }],
      currentPage: 0,
      totalPages: 1,
    }
  },



  addProseMirrorPlugins() {
    const extension = this

    return [
      new Plugin({
        key: AutoPaginationPluginKey,
        
        state: {
          init: () => {
            return {
              decorations: DecorationSet.empty,
              measurementElement: null as HTMLElement | null,
              observer: null as ResizeObserver | null,
            }
          },
          
          apply(tr, oldState, oldEditorState, newEditorState) {
            // Verificar se houve mudanças no documento
            if (!tr.docChanged) {
              return oldState
            }

            // Agendar medição do conteúdo
            setTimeout(() => {
              (extension as any).measureContent(newEditorState)
            }, 0)

            return {
              ...oldState,
              decorations: oldState.decorations.map(tr.mapping, tr.doc)
            }
          }
        },

        props: {
          decorations(state) {
            return this.getState(state)?.decorations || DecorationSet.empty
          },
        },

        view(editorView) {
          // Criar elemento de medição invisível
          const measurementElement = document.createElement('div')
          measurementElement.style.cssText = `
            position: absolute;
            visibility: hidden;
            pointer-events: none;
            top: -9999px;
            left: -9999px;
            width: ${CONTENT_AREA.width}px;
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
          `
          document.body.appendChild(measurementElement)

          // Observer para mudanças de tamanho
          const observer = new ResizeObserver(() => {
            (extension as any).measureContent(editorView.state)
          })

          // Observar o editor
          observer.observe(editorView.dom)

          return {
            destroy() {
              if (measurementElement.parentNode) {
                measurementElement.parentNode.removeChild(measurementElement)
              }
              observer.disconnect()
            }
          }
        }
      })
    ]
  },

  // Método para medir o conteúdo e detectar overflow
  measureContent(state: any) {
    if (!this.editor || !this.options.enableAutoBreak) return

    try {
      const doc = state.doc
      const text = doc.textContent
      
      // Calcular número aproximado de linhas
      const lines = text.split('\n')
      let totalLines = 0
      
      lines.forEach((line: string) => {
        if (line.trim() === '') {
          totalLines += 1
        } else {
          // Estimar quebras de linha baseado na largura
          const estimatedCharsPerLine = Math.floor(CONTENT_AREA.width / 8) // ~8px por char
          const lineBreaks = Math.ceil(line.length / estimatedCharsPerLine)
          totalLines += Math.max(1, lineBreaks)
        }
      })

      // Calcular páginas necessárias
      const pagesNeeded = Math.ceil(totalLines / this.options.maxLinesPerPage!)
      
      // Se precisar de mais páginas, criar automaticamente
      if (pagesNeeded > this.storage.totalPages) {
        this.createAdditionalPages(pagesNeeded - this.storage.totalPages)
      }

      // Atualizar informações da página atual
      this.updatePageInfo(totalLines)

      // Verificar overflow na página atual
      const currentPageLines = totalLines % this.options.maxLinesPerPage!
      if (currentPageLines > this.options.maxLinesPerPage! * 0.9) {
        const overflowHeight = (currentPageLines - this.options.maxLinesPerPage!) * ESTIMATED_LINE_HEIGHT
        this.options.onPageOverflow?.(this.storage.currentPage + 1, overflowHeight)
      }

    } catch (error) {
      console.warn('Erro ao medir conteúdo para paginação:', error)
    }
  },

  // Criar páginas adicionais automaticamente
  createAdditionalPages(count: number) {
    for (let i = 0; i < count; i++) {
      const newPageId = String(this.storage.pages.length + 1)
      const currentPos = this.editor.state.doc.content.size
      
      // Adicionar quebra de página no final do documento
      this.editor.commands.insertContent('<div class="page-break" data-page-id="' + newPageId + '"></div>')
      
      // Atualizar storage
      this.storage.pages.push({
        id: newPageId,
        startPos: currentPos,
        endPos: currentPos,
        height: 0,
        lineCount: 0
      })
    }
    
    this.storage.totalPages = this.storage.pages.length
    this.options.onPageBreak?.(this.storage.totalPages)
  },

  // Atualizar informações da página
  updatePageInfo(totalLines: number) {
    const currentPageIndex = Math.floor(totalLines / this.options.maxLinesPerPage!)
    const currentPageLines = totalLines % this.options.maxLinesPerPage! || this.options.maxLinesPerPage!
    
    this.storage.currentPage = Math.min(currentPageIndex, this.storage.pages.length - 1)
    
    // Atualizar informações da página atual
    if (this.storage.pages[this.storage.currentPage]) {
      this.storage.pages[this.storage.currentPage].lineCount = currentPageLines
      this.storage.pages[this.storage.currentPage].height = currentPageLines * ESTIMATED_LINE_HEIGHT
    }
  },

  // Método público para obter informações de paginação
  getPageInfo() {
    return {
      currentPage: this.storage.currentPage + 1,
      totalPages: this.storage.totalPages,
      pages: this.storage.pages,
      maxLinesPerPage: this.options.maxLinesPerPage,
      contentArea: CONTENT_AREA,
      a4Dimensions: A4_DIMENSIONS
    }
  },

  // Método para definir configurações de página
  setPageSettings(settings: Partial<AutoPaginationOptions>) {
    Object.assign(this.options, settings)
  }
})

export default AutoPagination 