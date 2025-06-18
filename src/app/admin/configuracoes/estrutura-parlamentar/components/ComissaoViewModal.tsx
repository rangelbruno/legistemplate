import React from 'react'
import { Comissao, ParlamentarInfo } from '../../../../../services/estrutura-parlamentar.service'

interface ComissaoViewModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: (comissao: Comissao) => void
  comissao: Comissao | null
}

const TIPOS_COMISSAO = [
  { value: 'PERMANENTE', label: 'Permanente', color: 'primary', icon: 'ki-setting-3' },
  { value: 'TEMPORARIA', label: 'Temporária', color: 'warning', icon: 'ki-time' },
  { value: 'ESPECIAL', label: 'Especial', color: 'info', icon: 'ki-star' },
  { value: 'CPI', label: 'CPI', color: 'danger', icon: 'ki-search-list' }
] as const

const STATUS_COMISSAO = [
  { value: 'ATIVA', label: 'Ativa', color: 'success', icon: 'ki-check-circle' },
  { value: 'INATIVA', label: 'Inativa', color: 'secondary', icon: 'ki-pause' },
  { value: 'SUSPENSA', label: 'Suspensa', color: 'warning', icon: 'ki-warning' }
] as const

export default function ComissaoViewModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  comissao 
}: ComissaoViewModalProps) {
  if (!isOpen || !comissao) return null

  const getTipoConfig = (tipo: Comissao['tipo']) => {
    return TIPOS_COMISSAO.find(t => t.value === tipo) || TIPOS_COMISSAO[0]
  }

  const getStatusConfig = (status: Comissao['status']) => {
    return STATUS_COMISSAO.find(s => s.value === status) || STATUS_COMISSAO[0]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definido'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const tipoConfig = getTipoConfig(comissao.tipo)
  const statusConfig = getStatusConfig(comissao.status)

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ maxHeight: '90vh', marginTop: '5vh', marginBottom: '5vh' }}>
        <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}>
          <div className="modal-header" style={{ flexShrink: 0 }}>
            <h2 className="modal-title">
              <i className={`ki-duotone ${tipoConfig.icon} fs-1 text-${tipoConfig.color} me-3`}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
              </i>
              {comissao.nome}
            </h2>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body" style={{ flex: '1', overflowY: 'auto', padding: '20px' }}>
            <div className="row g-6">
              {/* Informações Gerais */}
              <div className="col-12">
                <div className="card border-light">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ki-duotone ki-information fs-2 text-primary me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      Informações Gerais
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <span className={`badge badge-light-${tipoConfig.color} fs-6 me-3`}>
                            <i className={`ki-duotone ${tipoConfig.icon} fs-4 me-1`}>
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                            {tipoConfig.label}
                          </span>
                          <span className={`badge badge-light-${statusConfig.color} fs-6`}>
                            <i className={`ki-duotone ${statusConfig.icon} fs-4 me-1`}>
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold text-gray-700">Nome da Comissão</label>
                          <div className="text-gray-900 fs-6">{comissao.nome}</div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold text-gray-700">Data de Constituição</label>
                          <div className="text-gray-900 fs-6">{formatDate(comissao.dataConstituicao)}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        {(comissao.tipo === 'TEMPORARIA' || comissao.tipo === 'CPI') && (
                          <>
                            <div className="mb-3">
                              <label className="form-label fw-bold text-gray-700">Período do Mandato</label>
                              <div className="text-gray-900 fs-6">
                                {comissao.mandatoInicio && comissao.mandatoFim 
                                  ? `${formatDate(comissao.mandatoInicio)} até ${formatDate(comissao.mandatoFim)}`
                                  : 'Não definido'
                                }
                              </div>
                            </div>
                          </>
                        )}
                        <div className="mb-3">
                          <label className="form-label fw-bold text-gray-700">Quantidade de Membros</label>
                          <div className="text-gray-900 fs-6">{comissao.membros.length} membros</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="separator my-4"></div>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label fw-bold text-gray-700">Descrição</label>
                        <div className="text-gray-900 fs-6 lh-lg">{comissao.descricao}</div>
                      </div>
                      {comissao.finalidade && (
                        <div className="col-12">
                          <label className="form-label fw-bold text-gray-700">Finalidade</label>
                          <div className="text-gray-900 fs-6 lh-lg">{comissao.finalidade}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mesa Diretora da Comissão */}
              <div className="col-12">
                <div className="card border-light">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ki-duotone ki-crown fs-2 text-warning me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Mesa Diretora
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      {/* Presidente */}
                      <div className="col-md-4">
                        <div className="card bg-light-warning border-warning">
                          <div className="card-body text-center p-4">
                            <i className="ki-duotone ki-crown fs-2x text-warning mb-3">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <h6 className="fw-bold text-warning mb-2">PRESIDENTE</h6>
                            <div className="text-gray-900 fw-bold fs-5">{comissao.presidente.nome}</div>
                            <div className="text-gray-600 fs-7">{comissao.presidente.partido.sigla}</div>
                          </div>
                        </div>
                      </div>

                      {/* Vice-Presidente */}
                      <div className="col-md-4">
                        <div className="card bg-light-primary border-primary">
                          <div className="card-body text-center p-4">
                            <i className="ki-duotone ki-user-tick fs-2x text-primary mb-3">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                            <h6 className="fw-bold text-primary mb-2">VICE-PRESIDENTE</h6>
                            <div className="text-gray-900 fw-bold fs-5">
                              {comissao.vicePressidente ? comissao.vicePressidente.nome : 'Não definido'}
                            </div>
                            <div className="text-gray-600 fs-7">
                              {comissao.vicePressidente ? comissao.vicePressidente.partido.sigla : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Relator */}
                      <div className="col-md-4">
                        <div className="card bg-light-info border-info">
                          <div className="card-body text-center p-4">
                            <i className="ki-duotone ki-document fs-2x text-info mb-3">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <h6 className="fw-bold text-info mb-2">RELATOR</h6>
                            <div className="text-gray-900 fw-bold fs-5">
                              {comissao.relator ? comissao.relator.nome : 'Não definido'}
                            </div>
                            <div className="text-gray-600 fs-7">
                              {comissao.relator ? comissao.relator.partido.sigla : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Todos os Membros */}
              <div className="col-12">
                <div className="card border-light">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ki-duotone ki-people fs-2 text-success me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                        <span className="path5"></span>
                      </i>
                      Membros da Comissão ({comissao.membros.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {comissao.membros.map((membro: ParlamentarInfo, index: number) => {
                        let cargo = ''
                        let cargoColor = 'secondary'
                        
                        if (membro.id === comissao.presidente.id) {
                          cargo = 'Presidente'
                          cargoColor = 'warning'
                        } else if (comissao.vicePressidente && membro.id === comissao.vicePressidente.id) {
                          cargo = 'Vice-Presidente'
                          cargoColor = 'primary'
                        } else if (comissao.relator && membro.id === comissao.relator.id) {
                          cargo = 'Relator'
                          cargoColor = 'info'
                        } else {
                          cargo = 'Membro'
                          cargoColor = 'secondary'
                        }

                        return (
                          <div key={membro.id} className="col-md-6 col-lg-4">
                            <div className="card border-light">
                              <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                  <div className="symbol symbol-40px me-3">
                                    <div className="symbol-label bg-light-secondary text-secondary fw-bold fs-6">
                                      {membro.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="fw-bold text-gray-900 fs-6">{membro.nome}</div>
                                    <div className="text-gray-600 fs-7">{membro.partido.sigla}</div>
                                    <span className={`badge badge-light-${cargoColor} fs-8 mt-1`}>
                                      {cargo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="col-12">
                <div className="card border-light">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ki-duotone ki-chart-pie fs-2 text-info me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      Composição Partidária
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {(() => {
                        const partidosCounts = comissao.membros.reduce((acc: Record<string, number>, membro: ParlamentarInfo) => {
                          acc[membro.partido.sigla] = (acc[membro.partido.sigla] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)

                        return Object.entries(partidosCounts).map(([partido, count]) => (
                          <div key={partido} className="col-md-3">
                            <div className="card bg-light-success border-success">
                              <div className="card-body text-center p-3">
                                <div className="text-success fw-bold fs-3">{count as number}</div>
                                <div className="text-gray-900 fw-bold fs-6">{partido}</div>
                                <div className="text-gray-600 fs-7">
                                  {(((count as number) / comissao.membros.length) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ flexShrink: 0, borderTop: '1px solid #e4e6ea' }}>
            <button 
              type="button" 
              className="btn btn-light" 
              onClick={onClose}
            >
              <i className="ki-duotone ki-cross fs-2 me-1">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Fechar
            </button>
            {onEdit && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => onEdit(comissao)}
              >
                <i className="ki-duotone ki-pencil fs-2 me-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                Editar Comissão
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 