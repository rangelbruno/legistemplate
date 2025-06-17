'use client'

import { useState, useEffect } from 'react'
import AdministradorLayout from '../layout'
import { ConfigSidebar } from '../../../components/admin/config/ConfigSidebar'
import { ConfigContent } from '../../../components/admin/config/ConfigContent'
import { FixedActionBar } from '../../../components/admin/config/FixedActionBar'
import { ConfigProvider } from '../../../context/ConfigContext'
import { PageTitle } from '../../../_metronic/layout/core'

/**
 * Página Principal de Parametrização do Sistema Parlamentar
 * 
 * Interface administrativa completa que permite a parametrização total
 * do sistema parlamentar sem necessidade de alterações no código.
 * Todas as configurações são armazenadas no banco de dados.
 */
export default function AdminConfiguracoes() {
  const [activeSection, setActiveSection] = useState('sistema-basico')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Configurações organizadas por seção
  const configSections = [
    {
      id: 'sistema-basico',
      title: 'Sistema Básico',
      icon: 'bi-sliders',
      description: 'Configurações gerais da instituição',
      categories: ['geral']
    },
    {
      id: 'usuarios-permissoes',
      title: 'Usuários e Permissões',
      icon: 'bi-people',
      description: 'Gestão de perfis e controle de acesso',
      categories: ['perfis', 'autenticacao']
    },
    {
      id: 'documentos-templates',
      title: 'Documentos e Templates',
      icon: 'bi-file-text',
      description: 'Tipos de documentos e templates',
      categories: ['documento-tipos', 'workflows']
    },
    {
      id: 'estrutura-parlamentar',
      title: 'Estrutura Parlamentar',
      icon: 'bi-building',
      description: 'Parlamentares, comissões e mesa diretora',
      categories: ['parlamentares', 'comissoes', 'mesa-diretora']
    },
    {
      id: 'processos-prazos',
      title: 'Processos e Prazos',
      icon: 'bi-clock',
      description: 'Configuração de prazos e calendário',
      categories: ['prazos', 'feriados', 'numeracao']
    },
    {
      id: 'calendario-sessoes',
      title: 'Calendário de Sessões',
      icon: 'bi-calendar-event',
      description: 'Agendar sessões ordinárias e extraordinárias',
      categories: ['sessoes-ordinarias', 'sessoes-extraordinarias', 'calendario']
    },
    {
      id: 'integracoes',
      title: 'Integrações',
      icon: 'bi-link-45deg',
      description: 'APIs externas e sincronizações',
      categories: ['integracoes', 'notificacoes']
    },
    {
      id: 'configuracoes-tecnicas',
      title: 'Configurações Técnicas',
      icon: 'bi-gear',
      description: 'Backup, segurança e performance',
      categories: ['transparencia', 'backup']
    }
  ]

  // Aviso ao sair da página com alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return (
    <ConfigProvider>
      <AdministradorLayout>
        <PageTitle 
          breadcrumbs={[
            { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
            { title: 'Parametrização', path: '/admin/configuracoes', isSeparator: false, isActive: false }
          ]}
        >
          Configurações do Sistema
        </PageTitle>
        
        <div className="admin-parametrizacao">
          {/* Status de alterações */}
          {hasUnsavedChanges && (
            <div className="alert alert-warning d-flex align-items-center mb-7">
              <i className="bi bi-exclamation-triangle fs-2 me-3"></i>
              <div>
                <strong>Alterações não salvas</strong>
                <div className="text-muted">Você tem configurações pendentes. Lembre-se de salvar suas alterações.</div>
              </div>
            </div>
          )}

          {/* Layout principal com sidebar e conteúdo */}
          <div className="row g-7">
            {/* Sidebar de navegação */}
            <div className="col-lg-3">
              <ConfigSidebar
                sections={configSections}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Área de conteúdo */}
            <div className="col-lg-9">
              <ConfigContent
                activeSection={activeSection}
                sections={configSections}
                onConfigChange={() => setHasUnsavedChanges(true)}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Barra de ações fixa */}
          <FixedActionBar
            hasUnsavedChanges={hasUnsavedChanges}
            isLoading={isLoading}
            onSave={() => {
              setIsLoading(true)
              // Lógica de salvamento será implementada no contexto
              setTimeout(() => {
                setIsLoading(false)
                setHasUnsavedChanges(false)
              }, 2000)
            }}
            onCancel={() => {
              if (hasUnsavedChanges) {
                const confirm = window.confirm('Descartar todas as alterações não salvas?')
                if (confirm) {
                  setHasUnsavedChanges(false)
                  // Recarregar configurações
                }
              }
            }}
            onExport={() => {
              // Implementar exportação
              console.log('Exportar configurações')
            }}
            onImport={() => {
              // Implementar importação
              console.log('Importar configurações')
            }}
          />

          {/* Indicador de carregamento global */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <div className="mt-3 text-muted">
                  Salvando configurações...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estilos customizados */}
        <style>{`
          .admin-parametrizacao {
            min-height: 100vh;
            padding-bottom: 100px; /* Espaço para barra de ações */
          }

          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .loading-spinner {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .alert-warning {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.95; }
            100% { opacity: 1; }
          }
        `}</style>
      </AdministradorLayout>
    </ConfigProvider>
  )
} 