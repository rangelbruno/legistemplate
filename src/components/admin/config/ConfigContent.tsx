'use client'

import React from 'react'
import { useConfig } from '../../../context/ConfigContext'
import { ConfiguracoesGerais } from './sections/ConfiguracoesGerais'

import { ConfiguracoesPerfis } from './sections/ConfiguracoesPerfis'
import { ConfiguracoesAutenticacao } from './sections/ConfiguracoesAutenticacao'
import { ConfiguracoesDocumentos } from './sections/ConfiguracoesDocumentos'
import { ConfiguracoesWorkflows } from './sections/ConfiguracoesWorkflows'
import { ConfiguracoesIntegracoes } from './sections/ConfiguracoesIntegracoes'
import { ConfiguracoesTransparencia } from './sections/ConfiguracoesTransparencia'
import { CalendarioSessoes } from './sections/CalendarioSessoes'

interface ConfigSection {
  id: string
  title: string
  icon: string
  description: string
  categories: string[]
}

interface ConfigContentProps {
  activeSection: string
  sections: ConfigSection[]
  onConfigChange: () => void
  isLoading: boolean
}

export function ConfigContent({ activeSection, sections, onConfigChange, isLoading }: ConfigContentProps) {
  const { configurations, loading } = useConfig()

  const currentSection = sections.find(s => s.id === activeSection)

  if (loading || isLoading) {
    return (
      <div className="config-content-loading">
        <div className="card">
          <div className="card-body text-center py-15">
            <div className="spinner-border text-primary mb-5" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h3 className="text-gray-800 mb-3">Carregando Configurações</h3>
            <p className="text-muted">
              Por favor, aguarde enquanto as configurações são carregadas...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSection) {
    return (
      <div className="config-content-error">
        <div className="card">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-warning">
              <div className="symbol-label">
                <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
              </div>
            </div>
            <h3 className="text-gray-800 mb-3">Seção não encontrada</h3>
            <p className="text-muted">
              A seção solicitada não foi encontrada. Por favor, selecione uma seção válida.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="config-content">
      {/* Header da seção */}
      <div className="card mb-7">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50px symbol-circle bg-light-primary me-4">
              <div className="symbol-label">
                <i className={`${currentSection.icon} text-primary fs-2`}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <h2 className="text-gray-800 fw-bold mb-1">
                {currentSection.title}
              </h2>
              <p className="text-muted mb-0">
                {currentSection.description}
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {currentSection.categories.map((category) => (
                <span key={category} className="badge badge-light-primary">
                  {getCategoryLabel(category)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo da seção */}
      <div className="config-section-content">
        {renderSectionContent(activeSection, configurations, onConfigChange)}
      </div>
    </div>
  )
}

// Função para renderizar o conteúdo específico de cada seção
function renderSectionContent(sectionId: string, configurations: any, onConfigChange: () => void) {
  switch (sectionId) {
    case 'sistema-basico':
      return (
        <div className="row g-7">
          <div className="col-12">
            <ConfiguracoesGerais 
              config={configurations.geral} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    case 'usuarios-permissoes':
      return (
        <div className="row g-7">
          <div className="col-12">
            <ConfiguracoesPerfis 
              config={configurations.perfis} 
              onChange={onConfigChange}
            />
          </div>
          <div className="col-12">
            <ConfiguracoesAutenticacao 
              config={configurations.autenticacao} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    case 'documentos-templates':
      return (
        <div className="row g-7">
          <div className="col-12">
            <ConfiguracoesDocumentos 
              config={configurations.documentoTipos} 
              onChange={onConfigChange}
            />
          </div>
          <div className="col-12">
            <ConfiguracoesWorkflows 
              config={configurations.workflows} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    case 'integracoes':
      return (
        <div className="row g-7">
          <div className="col-12">
            <ConfiguracoesIntegracoes 
              config={configurations.integracoes} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    case 'calendario-sessoes':
      return (
        <div className="row g-7">
          <div className="col-12">
            <CalendarioSessoes 
              config={configurations.sessoes} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    case 'configuracoes-tecnicas':
      return (
        <div className="row g-7">
          <div className="col-12">
            <ConfiguracoesTransparencia 
              config={configurations.transparencia} 
              onChange={onConfigChange}
            />
          </div>
        </div>
      )

    default:
      return (
        <div className="card">
          <div className="card-body text-center py-15">
            <div className="symbol symbol-100px symbol-circle mx-auto mb-7 bg-light-info">
              <div className="symbol-label">
                <i className="bi bi-info-circle fs-1 text-info"></i>
              </div>
            </div>
            <h3 className="text-gray-800 mb-3">Em Desenvolvimento</h3>
            <p className="text-muted mb-7">
              Esta seção está em desenvolvimento e será implementada em breve.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <span className="badge badge-light-warning fs-7">
                🚧 Em Construção
              </span>
              <span className="badge badge-light-info fs-7">
                📋 Próxima Sprint
              </span>
            </div>
          </div>
        </div>
      )
  }
}

// Função auxiliar para converter categoria em label legível
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'geral': 'Configurações Gerais',
    'sessao-legislativa': 'Sessão Legislativa',
    'perfis': 'Perfis de Usuário',
    'autenticacao': 'Autenticação',
    'documento-tipos': 'Tipos de Documento',
    'workflows': 'Fluxos de Trabalho',
    'parlamentares': 'Parlamentares',
    'comissoes': 'Comissões',
    'mesa-diretora': 'Mesa Diretora',
    'prazos': 'Prazos',
    'feriados': 'Feriados',
    'numeracao': 'Numeração',
    'integracoes': 'Integrações',
    'notificacoes': 'Notificações',
    'transparencia': 'Portal de Transparência',
    'backup': 'Backup e Recuperação',
    'sessoes-ordinarias': 'Sessões Ordinárias',
    'sessoes-extraordinarias': 'Sessões Extraordinárias',
    'calendario': 'Calendário'
  }
  
  return labels[category] || category
} 