'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ConfigContextType {
  configurations: any
  loading: boolean
  saving: boolean
  hasChanges: boolean
  loadConfigurations: () => Promise<void>
  saveConfigurations: (categoria: string, dados: any) => Promise<void>
  saveAllConfigurations: () => Promise<void>
  exportConfigurations: (categorias?: string[]) => Promise<void>
  importConfigurations: (file: File) => Promise<void>
  validateConfiguration: (categoria: string, dados: any) => Promise<any>
  resetChanges: () => void
  setConfiguration: (categoria: string, dados: any) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

interface ConfigProviderProps {
  children: ReactNode
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [configurations, setConfigurations] = useState<any>({})
  const [originalConfigurations, setOriginalConfigurations] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Carregar configurações do servidor
  const loadConfigurations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/admin/config')
      if (response.ok) {
        const data = await response.json()
        setConfigurations(data.data)
        setOriginalConfigurations(JSON.parse(JSON.stringify(data.data)))
        setHasChanges(false)
      } else {
        console.error('Erro ao carregar configurações')
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  // Salvar configuração específica
  const saveConfigurations = async (categoria: string, dados: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/v1/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoria,
          dados,
          usuarioId: 'current-user' // TODO: Pegar do contexto de auth
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Atualizar configurações locais
        setConfigurations(prev => ({
          ...prev,
          [categoria]: result.data
        }))
        setOriginalConfigurations(prev => ({
          ...prev,
          [categoria]: JSON.parse(JSON.stringify(result.data))
        }))
        return result
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar configuração')
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  // Salvar todas as configurações
  const saveAllConfigurations = async () => {
    setSaving(true)
    try {
      const promises = Object.keys(configurations).map(categoria => {
        if (JSON.stringify(configurations[categoria]) !== JSON.stringify(originalConfigurations[categoria])) {
          return saveConfigurations(categoria, configurations[categoria])
        }
        return Promise.resolve()
      })

      await Promise.all(promises)
      setHasChanges(false)
    } catch (error) {
      console.error('Erro ao salvar todas as configurações:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  // Exportar configurações
  const exportConfigurations = async (categorias?: string[]) => {
    try {
      const params = new URLSearchParams()
      if (categorias) {
        params.append('categorias', categorias.join(','))
      }

      const response = await fetch(`/api/v1/admin/config/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `config-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Erro ao exportar configurações')
      }
    } catch (error) {
      console.error('Erro ao exportar configurações:', error)
      throw error
    }
  }

  // Importar configurações
  const importConfigurations = async (file: File) => {
    try {
      const fileContent = await file.text()
      const importData = JSON.parse(fileContent)

      const response = await fetch('/api/v1/admin/config/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configurations: importData.configurations,
          usuarioId: 'current-user' // TODO: Pegar do contexto de auth
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Recarregar configurações após importação
        await loadConfigurations()
        return result
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao importar configurações')
      }
    } catch (error) {
      console.error('Erro ao importar configurações:', error)
      throw error
    }
  }

  // Validar configuração
  const validateConfiguration = async (categoria: string, dados: any) => {
    try {
      const response = await fetch('/api/v1/admin/config/validate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoria, dados })
      })

      if (response.ok) {
        return await response.json()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao validar configuração')
      }
    } catch (error) {
      console.error('Erro ao validar configuração:', error)
      throw error
    }
  }

  // Resetar alterações
  const resetChanges = () => {
    setConfigurations(JSON.parse(JSON.stringify(originalConfigurations)))
    setHasChanges(false)
  }

  // Definir configuração (uso interno)
  const setConfiguration = (categoria: string, dados: any) => {
    setConfigurations(prev => ({
      ...prev,
      [categoria]: dados
    }))
    setHasChanges(true)
  }

  // Verificar se há alterações
  useEffect(() => {
    const hasChanges = JSON.stringify(configurations) !== JSON.stringify(originalConfigurations)
    setHasChanges(hasChanges)
  }, [configurations, originalConfigurations])

  // Carregar configurações iniciais
  useEffect(() => {
    loadConfigurations()
  }, [])

  const value: ConfigContextType = {
    configurations,
    loading,
    saving,
    hasChanges,
    loadConfigurations,
    saveConfigurations,
    saveAllConfigurations,
    exportConfigurations,
    importConfigurations,
    validateConfiguration,
    resetChanges,
    setConfiguration
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

// Hook para usar o contexto
export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
} 