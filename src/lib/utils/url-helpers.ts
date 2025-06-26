/**
 * Utilitários para URLs do sistema
 * Gerencia a base URL configurada do Metronic
 */

// Base URL configurada do sistema
const BASE_URL = '/metronic8/react/demo3'

/**
 * Constrói uma URL completa com a base URL
 * @param path - Caminho relativo
 * @returns URL completa
 */
export function buildUrl(path: string): string {
  // Remove barra inicial se existir para evitar duplicação
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE_URL}/${cleanPath}`
}

/**
 * Abre uma URL em nova aba
 * @param path - Caminho relativo
 */
export function openInNewTab(path: string): void {
  const url = buildUrl(path)
  window.open(url, '_blank')
}

/**
 * URLs específicas do sistema de documentos
 */
export const DocumentUrls = {
  // Páginas
  list: () => buildUrl('admin/configuracoes/documentos-templates'),
  editor: (params?: { template?: string; id?: string; novo?: boolean; content?: string }) => {
    const url = 'admin/configuracoes/documentos-templates/editor'
    const searchParams = new URLSearchParams()
    
    if (params?.template) searchParams.set('template', params.template)
    if (params?.id) searchParams.set('id', params.id)
    if (params?.novo) searchParams.set('novo', 'true')
    if (params?.content) searchParams.set('content', params.content)
    
    const queryString = searchParams.toString()
    return buildUrl(queryString ? `${url}?${queryString}` : url)
  },
  
  // APIs
  api: {
    list: () => buildUrl('api/admin/configuracoes/documentos-templates'),
    get: (id: string) => buildUrl(`api/admin/configuracoes/documentos-templates/${id}`),
    create: () => buildUrl('api/admin/configuracoes/documentos-templates'),
    update: (id: string) => buildUrl(`api/admin/configuracoes/documentos-templates/${id}`),
    delete: (id: string) => buildUrl(`api/admin/configuracoes/documentos-templates/${id}`),
    export: () => buildUrl('api/admin/configuracoes/documentos-templates/export')
  }
} 