'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

interface PrazoConfig {
  id: string
  tipoPrazo: string
  diasUteis: number
  permiteProrrogacao: boolean
  maximoProrrogacoes?: number
  notificarDiasAntes?: number
  escalonarAposVencimento: boolean
}

interface Feriado {
  id: string
  data: string
  descricao: string
  tipo: 'NACIONAL' | 'ESTADUAL' | 'MUNICIPAL'
  recorrente: boolean
}

interface ConfigNumeracao {
  id: string
  tipoDocumento: string
  formato: string
  contadorAtual: number
  reiniciaAnualmente: boolean
  prefixo?: string
  sufixo?: string
  digitosMinimos: number
}

export default function ProcessosPrazos() {
  const [activeTab, setActiveTab] = useState<'prazos' | 'feriados' | 'numeracao'>('prazos')
  const [editingPrazo, setEditingPrazo] = useState<PrazoConfig | null>(null)
  const [editingFeriado, setEditingFeriado] = useState<Feriado | null>(null)
  const [editingNumeracao, setEditingNumeracao] = useState<ConfigNumeracao | null>(null)

  // Dados mock para demonstração
  const [prazosConfig, setPrazosConfig] = useState<PrazoConfig[]>([
    {
      id: '1',
      tipoPrazo: 'relatoria',
      diasUteis: 15,
      permiteProrrogacao: true,
      maximoProrrogacoes: 2,
      notificarDiasAntes: 3,
      escalonarAposVencimento: true
    },
    {
      id: '2',
      tipoPrazo: 'emenda',
      diasUteis: 5,
      permiteProrrogacao: false,
      notificarDiasAntes: 1,
      escalonarAposVencimento: false
    },
    {
      id: '3',
      tipoPrazo: 'votacao',
      diasUteis: 30,
      permiteProrrogacao: true,
      maximoProrrogacoes: 1,
      notificarDiasAntes: 7,
      escalonarAposVencimento: true
    }
  ])

  const [feriados, setFeriados] = useState<Feriado[]>([
    {
      id: '1',
      data: '2024-01-01',
      descricao: 'Confraternização Universal',
      tipo: 'NACIONAL',
      recorrente: true
    },
    {
      id: '2',
      data: '2024-04-21',
      descricao: 'Tiradentes',
      tipo: 'NACIONAL',
      recorrente: true
    },
    {
      id: '3',
      data: '2024-06-15',
      descricao: 'Aniversário da Cidade',
      tipo: 'MUNICIPAL',
      recorrente: true
    }
  ])

  const [numeracaoConfig, setNumeracaoConfig] = useState<ConfigNumeracao[]>([
    {
      id: '1',
      tipoDocumento: 'Projeto de Lei',
      formato: 'PL-{numero}/{ano}',
      contadorAtual: 15,
      reiniciaAnualmente: true,
      prefixo: 'PL',
      digitosMinimos: 3
    },
    {
      id: '2',
      tipoDocumento: 'Requerimento',
      formato: 'REQ-{numero}/{ano}',
      contadorAtual: 8,
      reiniciaAnualmente: true,
      prefixo: 'REQ',
      digitosMinimos: 3
    }
  ])

  const tiposPrazo = [
    { value: 'relatoria', label: 'Relatoria' },
    { value: 'emenda', label: 'Apresentação de Emendas' },
    { value: 'votacao', label: 'Votação' },
    { value: 'recurso', label: 'Apresentação de Recurso' },
    { value: 'manifestacao', label: 'Manifestação do Executivo' }
  ]

  const tiposFeriado = [
    { value: 'NACIONAL', label: 'Nacional' },
    { value: 'ESTADUAL', label: 'Estadual' },
    { value: 'MUNICIPAL', label: 'Municipal' }
  ]

  const tiposDocumento = [
    'Projeto de Lei',
    'Projeto de Lei Complementar',
    'Requerimento',
    'Indicação',
    'Proposta de Emenda',
    'Decreto Legislativo'
  ]

  const handleSavePrazo = (prazo: PrazoConfig) => {
    if (prazo.id) {
      setPrazosConfig(prev => prev.map(p => p.id === prazo.id ? prazo : p))
    } else {
      setPrazosConfig(prev => [...prev, { ...prazo, id: Date.now().toString() }])
    }
    setEditingPrazo(null)
  }

  const handleSaveFeriado = (feriado: Feriado) => {
    if (feriado.id) {
      setFeriados(prev => prev.map(f => f.id === feriado.id ? feriado : f))
    } else {
      setFeriados(prev => [...prev, { ...feriado, id: Date.now().toString() }])
    }
    setEditingFeriado(null)
  }

  const handleSaveNumeracao = (config: ConfigNumeracao) => {
    if (config.id) {
      setNumeracaoConfig(prev => prev.map(n => n.id === config.id ? config : n))
    } else {
      setNumeracaoConfig(prev => [...prev, { ...config, id: Date.now().toString() }])
    }
    setEditingNumeracao(null)
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Processos e Prazos', path: '/admin/configuracoes/processos-prazos', isSeparator: false, isActive: true }
        ]}
      >
        Processos e Prazos
      </PageTitle>
      
      <div className="processos-prazos-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-danger me-4">
                  <div className="symbol-label">
                    <i className="bi bi-clock text-danger fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Processos e Prazos
                  </h1>
                  <p className="text-muted mb-0">
                    Configure prazos processuais, feriados e numeração de documentos
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light btn-sm">
                  <i className="bi bi-download me-2"></i>
                  Exportar
                </button>
                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-check2 me-2"></i>
                  Salvar Todas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header card-header-stretch">
                <div className="card-toolbar">
                  <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                    <li className="nav-item">
                      <a 
                        className={`nav-link ${activeTab === 'prazos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prazos')}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-clock me-2"></i>
                        Prazos Processuais
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        className={`nav-link ${activeTab === 'feriados' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feriados')}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-calendar-event me-2"></i>
                        Feriados
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        className={`nav-link ${activeTab === 'numeracao' ? 'active' : ''}`}
                        onClick={() => setActiveTab('numeracao')}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-hash me-2"></i>
                        Numeração
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-body">
                {/* Tab Prazos Processuais */}
                {activeTab === 'prazos' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-6">
                      <div>
                        <h3 className="text-gray-800 fw-bold mb-1">Configuração de Prazos</h3>
                        <p className="text-muted mb-0">Defina os prazos para cada tipo de processo legislativo</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setEditingPrazo({
                          id: '',
                          tipoPrazo: '',
                          diasUteis: 15,
                          permiteProrrogacao: false,
                          escalonarAposVencimento: false
                        })}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Novo Prazo
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-row-dashed table-row-gray-300 gy-7">
                        <thead>
                          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th>Tipo de Prazo</th>
                            <th>Dias Úteis</th>
                            <th>Prorrogação</th>
                            <th>Notificação</th>
                            <th>Escalona</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prazosConfig.map(prazo => (
                            <tr key={prazo.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="symbol symbol-45px me-5">
                                    <div className="symbol-label bg-light-primary">
                                      <i className="bi bi-clock text-primary fs-3"></i>
                                    </div>
                                  </div>
                                  <div className="fw-bold text-gray-800 text-capitalize">
                                    {prazo.tipoPrazo}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-light-primary fs-7">
                                  {prazo.diasUteis} dias
                                </span>
                              </td>
                              <td>
                                {prazo.permiteProrrogacao ? (
                                  <span className="badge badge-light-success fs-7">
                                    <i className="bi bi-check me-1"></i>
                                    Até {prazo.maximoProrrogacoes}x
                                  </span>
                                ) : (
                                  <span className="badge badge-light-danger fs-7">
                                    <i className="bi bi-x me-1"></i>
                                    Não permite
                                  </span>
                                )}
                              </td>
                              <td>
                                {prazo.notificarDiasAntes && (
                                  <span className="badge badge-light-warning fs-7">
                                    {prazo.notificarDiasAntes} dias antes
                                  </span>
                                )}
                              </td>
                              <td>
                                {prazo.escalonarAposVencimento ? (
                                  <span className="badge badge-light-info fs-7">
                                    <i className="bi bi-check me-1"></i>
                                    Sim
                                  </span>
                                ) : (
                                  <span className="badge badge-light-secondary fs-7">
                                    <i className="bi bi-x me-1"></i>
                                    Não
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-icon btn-light btn-sm" 
                                    onClick={() => setEditingPrazo(prazo)}
                                  >
                                    <i className="bi bi-pencil fs-4"></i>
                                  </button>
                                  <button className="btn btn-icon btn-light btn-sm">
                                    <i className="bi bi-trash fs-4"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab Feriados */}
                {activeTab === 'feriados' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-6">
                      <div>
                        <h3 className="text-gray-800 fw-bold mb-1">Calendário de Feriados</h3>
                        <p className="text-muted mb-0">Gerencie os feriados que afetam o cálculo de prazos</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setEditingFeriado({
                          id: '',
                          data: '',
                          descricao: '',
                          tipo: 'MUNICIPAL',
                          recorrente: false
                        })}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Novo Feriado
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-row-dashed table-row-gray-300 gy-7">
                        <thead>
                          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <th>Recorrente</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feriados.map(feriado => (
                            <tr key={feriado.id}>
                              <td>
                                <div className="fw-bold text-gray-800">
                                  {new Date(feriado.data).toLocaleDateString('pt-BR')}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="symbol symbol-45px me-5">
                                    <div className="symbol-label bg-light-info">
                                      <i className="bi bi-calendar-event text-info fs-3"></i>
                                    </div>
                                  </div>
                                  <div className="fw-bold text-gray-800">
                                    {feriado.descricao}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`badge fs-7 ${
                                  feriado.tipo === 'NACIONAL' ? 'badge-light-success' :
                                  feriado.tipo === 'ESTADUAL' ? 'badge-light-warning' :
                                  'badge-light-primary'
                                }`}>
                                  {feriado.tipo}
                                </span>
                              </td>
                              <td>
                                {feriado.recorrente ? (
                                  <span className="badge badge-light-success fs-7">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    Anual
                                  </span>
                                ) : (
                                  <span className="badge badge-light-secondary fs-7">
                                    <i className="bi bi-calendar me-1"></i>
                                    Único
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-icon btn-light btn-sm" 
                                    onClick={() => setEditingFeriado(feriado)}
                                  >
                                    <i className="bi bi-pencil fs-4"></i>
                                  </button>
                                  <button className="btn btn-icon btn-light btn-sm">
                                    <i className="bi bi-trash fs-4"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab Numeração */}
                {activeTab === 'numeracao' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-6">
                      <div>
                        <h3 className="text-gray-800 fw-bold mb-1">Configuração de Numeração</h3>
                        <p className="text-muted mb-0">Defina os padrões de numeração para cada tipo de documento</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setEditingNumeracao({
                          id: '',
                          tipoDocumento: '',
                          formato: '{prefixo}-{numero}/{ano}',
                          contadorAtual: 0,
                          reiniciaAnualmente: true,
                          digitosMinimos: 3
                        })}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Nova Configuração
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-row-dashed table-row-gray-300 gy-7">
                        <thead>
                          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th>Tipo de Documento</th>
                            <th>Formato</th>
                            <th>Contador Atual</th>
                            <th>Exemplo</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {numeracaoConfig.map(config => (
                            <tr key={config.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="symbol symbol-45px me-5">
                                    <div className="symbol-label bg-light-warning">
                                      <i className="bi bi-hash text-warning fs-3"></i>
                                    </div>
                                  </div>
                                  <div className="fw-bold text-gray-800">
                                    {config.tipoDocumento}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <code className="text-gray-700">{config.formato}</code>
                              </td>
                              <td>
                                <span className="badge badge-light-primary fs-7">
                                  {config.contadorAtual}
                                </span>
                              </td>
                              <td>
                                <span className="text-muted">
                                  {config.prefixo}-{String(config.contadorAtual + 1).padStart(config.digitosMinimos, '0')}/{new Date().getFullYear()}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-icon btn-light btn-sm" 
                                    onClick={() => setEditingNumeracao(config)}
                                  >
                                    <i className="bi bi-pencil fs-4"></i>
                                  </button>
                                  <button className="btn btn-icon btn-light btn-sm">
                                    <i className="bi bi-trash fs-4"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals de Edição */}
        {editingPrazo && (
          <PrazoModal 
            prazo={editingPrazo}
            tiposPrazo={tiposPrazo}
            onSave={handleSavePrazo}
            onClose={() => setEditingPrazo(null)}
          />
        )}

        {editingFeriado && (
          <FeriadoModal
            feriado={editingFeriado}
            tiposFeriado={tiposFeriado}
            onSave={handleSaveFeriado}
            onClose={() => setEditingFeriado(null)}
          />
        )}

        {editingNumeracao && (
          <NumeracaoModal
            config={editingNumeracao}
            tiposDocumento={tiposDocumento}
            onSave={handleSaveNumeracao}
            onClose={() => setEditingNumeracao(null)}
          />
        )}
      </div>
    </AdministradorLayout>
  )
}

// Componentes dos Modals
function PrazoModal({ prazo, tiposPrazo, onSave, onClose }: {
  prazo: PrazoConfig
  tiposPrazo: Array<{ value: string, label: string }>
  onSave: (prazo: PrazoConfig) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState(prazo)

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {prazo.id ? 'Editar' : 'Novo'} Prazo Processual
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
              <div className="mb-4">
                <label className="form-label required">Tipo de Prazo</label>
                <select 
                  className="form-select" 
                  value={formData.tipoPrazo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoPrazo: e.target.value }))}
                  required
                >
                  <option value="">Selecione...</option>
                  {tiposPrazo.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label required">Dias Úteis</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={formData.diasUteis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diasUteis: parseInt(e.target.value) || 0 }))}
                  min="1"
                  required
                />
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox"
                  checked={formData.permiteProrrogacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, permiteProrrogacao: e.target.checked }))}
                />
                <label className="form-check-label">Permite Prorrogação</label>
              </div>

              {formData.permiteProrrogacao && (
                <div className="mb-4">
                  <label className="form-label">Máximo de Prorrogações</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={formData.maximoProrrogacoes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maximoProrrogacoes: parseInt(e.target.value) || undefined }))}
                    min="1"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label">Notificar (dias antes)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={formData.notificarDiasAntes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificarDiasAntes: parseInt(e.target.value) || undefined }))}
                  min="1"
                />
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox"
                  checked={formData.escalonarAposVencimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, escalonarAposVencimento: e.target.checked }))}
                />
                <label className="form-check-label">Escalonar Após Vencimento</label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeriadoModal({ feriado, tiposFeriado, onSave, onClose }: {
  feriado: Feriado
  tiposFeriado: Array<{ value: string, label: string }>
  onSave: (feriado: Feriado) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState(feriado)

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {feriado.id ? 'Editar' : 'Novo'} Feriado
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
              <div className="mb-4">
                <label className="form-label required">Data</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label required">Descrição</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Ex: Dia da Independência"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label required">Tipo</label>
                <select 
                  className="form-select"
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                  required
                >
                  {tiposFeriado.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox"
                  checked={formData.recorrente}
                  onChange={(e) => setFormData(prev => ({ ...prev, recorrente: e.target.checked }))}
                />
                <label className="form-check-label">Feriado Recorrente (repete anualmente)</label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function NumeracaoModal({ config, tiposDocumento, onSave, onClose }: {
  config: ConfigNumeracao
  tiposDocumento: string[]
  onSave: (config: ConfigNumeracao) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState(config)

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {config.id ? 'Editar' : 'Nova'} Configuração de Numeração
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
              <div className="mb-4">
                <label className="form-label required">Tipo de Documento</label>
                <select 
                  className="form-select"
                  value={formData.tipoDocumento}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoDocumento: e.target.value }))}
                  required
                >
                  <option value="">Selecione...</option>
                  {tiposDocumento.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Prefixo</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.prefixo || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, prefixo: e.target.value }))}
                  placeholder="Ex: PL, REQ"
                />
              </div>

              <div className="mb-4">
                <label className="form-label required">Formato</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.formato}
                  onChange={(e) => setFormData(prev => ({ ...prev, formato: e.target.value }))}
                  placeholder="Ex: {prefixo}-{numero}/{ano}"
                  required
                />
                <div className="form-text">Use {'{prefixo}'}, {'{numero}'}, {'{ano}'} como variáveis</div>
              </div>

              <div className="mb-4">
                <label className="form-label required">Contador Atual</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={formData.contadorAtual}
                  onChange={(e) => setFormData(prev => ({ ...prev, contadorAtual: parseInt(e.target.value) || 0 }))}
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label required">Dígitos Mínimos</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={formData.digitosMinimos}
                  onChange={(e) => setFormData(prev => ({ ...prev, digitosMinimos: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                  required
                />
                <div className="form-text">Número será preenchido com zeros à esquerda</div>
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox"
                  checked={formData.reiniciaAnualmente}
                  onChange={(e) => setFormData(prev => ({ ...prev, reiniciaAnualmente: e.target.checked }))}
                />
                <label className="form-check-label">Reinicia Contador Anualmente</label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 