'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

export default function CalendarioSessoes() {
  const [activeTab, setActiveTab] = useState('calendario')
  const [isLoading, setIsLoading] = useState(false)

  const sessoesAgendadas = [
    {
      id: 1,
      tipo: 'Ordinária',
      data: '2024-02-15',
      hora: '14:00',
      status: 'agendada',
      pauta: 'Discussão do orçamento 2024'
    },
    {
      id: 2,
      tipo: 'Extraordinária',
      data: '2024-02-20',
      hora: '10:00',
      status: 'agendada',
      pauta: 'Votação do projeto de lei complementar'
    }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Configurações de sessões salvas')
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Calendário de Sessões', path: '/admin/configuracoes/calendario-sessoes', isSeparator: false, isActive: true }
        ]}
      >
        Calendário de Sessões
      </PageTitle>
      
      <div className="calendario-sessoes-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-dark me-4">
                  <div className="symbol-label">
                    <i className="bi bi-calendar-event text-dark fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Calendário de Sessões
                  </h1>
                  <p className="text-muted mb-0">
                    Configure sessões ordinárias, extraordinárias e parâmetros do calendário legislativo
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light btn-sm">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Nova Sessão
                </button>
                <button 
                  className="btn btn-dark"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2 me-2"></i>
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de sessões */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h3 className="fw-bold text-gray-800">Próximas Sessões</h3>
            </div>
            <div className="card-toolbar">
              <button className="btn btn-sm btn-primary">
                <i className="bi bi-plus me-1"></i>
                Agendar Sessão
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-6">
              {sessoesAgendadas.map((sessao) => (
                <div key={sessao.id} className="col-md-6">
                  <div className="card card-flush h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-4">
                        <div className={`symbol symbol-50px symbol-circle me-3 bg-light-${sessao.tipo === 'Ordinária' ? 'primary' : 'warning'}`}>
                          <div className="symbol-label">
                            <i className={`bi bi-calendar-event text-${sessao.tipo === 'Ordinária' ? 'primary' : 'warning'} fs-2`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h4 className="text-gray-800 fw-bold mb-1">{sessao.tipo}</h4>
                          <p className="text-muted mb-0">{new Date(sessao.data).toLocaleDateString('pt-BR')} às {sessao.hora}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{sessao.pauta}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className={`badge badge-light-${sessao.status === 'agendada' ? 'primary' : 'success'} fs-7`}>
                          {sessao.status === 'agendada' ? 'Agendada' : 'Realizada'}
                        </span>
                        <div className="d-flex gap-1">
                          <button className="btn btn-icon btn-sm btn-light">
                            <i className="bi bi-pencil fs-4"></i>
                          </button>
                          <button className="btn btn-icon btn-sm btn-light">
                            <i className="bi bi-eye fs-4"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 