'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

export default function SistemaBasico() {
  const [config, setConfig] = useState({
    nomeInstituicao: 'Câmara Municipal',
    cidade: '',
    estado: '',
    endereco: '',
    telefone: '',
    email: '',
    site: '',
    logoPath: '',
    sessaoLegislativa: '2024',
    numeroTotalVereadores: 9,
    mandatoInicio: '2021-01-01',
    mandatoFim: '2024-12-31'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Aqui seria feita a chamada para a API
      console.log('Salvando configurações:', config)
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Sistema Básico', path: '/admin/configuracoes/sistema-basico', isSeparator: false, isActive: true }
        ]}
      >
        Sistema Básico
      </PageTitle>
      
      <div className="sistema-basico-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-primary me-4">
                  <div className="symbol-label">
                    <i className="bi bi-sliders text-primary fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Configurações Básicas do Sistema
                  </h1>
                  <p className="text-muted mb-0">
                    Configure as informações gerais da instituição e parâmetros básicos do sistema
                  </p>
                </div>
              </div>
              <div>
                <button 
                  className="btn btn-primary"
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
                      Salvar Configurações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de configurações */}
        <div className="row g-7">
          {/* Informações da Instituição */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">Informações da Instituição</h3>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-5">
                  <div className="col-12">
                    <label className="form-label required">Nome da Instituição</label>
                    <input
                      type="text"
                      className="form-control"
                      value={config.nomeInstituicao}
                      onChange={(e) => handleInputChange('nomeInstituicao', e.target.value)}
                      placeholder="Ex: Câmara Municipal de..."
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label required">Cidade</label>
                    <input
                      type="text"
                      className="form-control"
                      value={config.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      placeholder="Nome da cidade"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label required">Estado</label>
                    <select
                      className="form-select"
                      value={config.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Endereço Completo</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={config.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Endereço completo da sede"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={config.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 1234-5678"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">E-mail Institucional</label>
                    <input
                      type="email"
                      className="form-control"
                      value={config.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contato@camara.gov.br"
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Site Oficial</label>
                    <input
                      type="url"
                      className="form-control"
                      value={config.site}
                      onChange={(e) => handleInputChange('site', e.target.value)}
                      placeholder="https://www.camara.gov.br"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações Legislativas */}
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <div className="card-title">
                  <h3 className="fw-bold text-gray-800">Configurações Legislativas</h3>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-5">
                  <div className="col-12">
                    <label className="form-label required">Sessão Legislativa Atual</label>
                    <input
                      type="text"
                      className="form-control"
                      value={config.sessaoLegislativa}
                      onChange={(e) => handleInputChange('sessaoLegislativa', e.target.value)}
                      placeholder="2024"
                    />
                    <div className="form-text">
                      Ano da sessão legislativa em vigor
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label required">Número Total de Vereadores</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="55"
                      value={config.numeroTotalVereadores}
                      onChange={(e) => handleInputChange('numeroTotalVereadores', parseInt(e.target.value))}
                    />
                    <div className="form-text">
                      Total de cadeiras na câmara municipal
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label required">Início do Mandato</label>
                    <input
                      type="date"
                      className="form-control"
                      value={config.mandatoInicio}
                      onChange={(e) => handleInputChange('mandatoInicio', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label required">Fim do Mandato</label>
                    <input
                      type="date"
                      className="form-control"
                      value={config.mandatoFim}
                      onChange={(e) => handleInputChange('mandatoFim', e.target.value)}
                    />
                  </div>

                  {/* Upload de Logo */}
                  <div className="col-12">
                    <label className="form-label">Logo da Instituição</label>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-100px symbol-circle bg-light-primary me-4">
                        {config.logoPath ? (
                          <img src={config.logoPath} alt="Logo" className="symbol-label" />
                        ) : (
                          <div className="symbol-label">
                            <i className="bi bi-building text-primary fs-1"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = URL.createObjectURL(file)
                              handleInputChange('logoPath', url)
                            }
                          }}
                        />
                        <div className="form-text">
                          Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card de informações adicionais */}
        <div className="card mt-7">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="symbol symbol-40px symbol-circle bg-light-warning me-3">
                <div className="symbol-label">
                  <i className="bi bi-exclamation-triangle text-warning fs-3"></i>
                </div>
              </div>
              <div>
                <h4 className="text-gray-800 fw-bold mb-1">
                  Atenção
                </h4>
                <p className="text-muted mb-0">
                  As alterações nas configurações básicas afetarão todo o sistema. 
                  Certifique-se de revisar todas as informações antes de salvar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdministradorLayout>
  )
} 