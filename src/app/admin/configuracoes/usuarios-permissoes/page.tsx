'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'

export default function UsuariosPermissoes() {
  const [activeTab, setActiveTab] = useState('perfis')
  const [isLoading, setIsLoading] = useState(false)

  const perfisUsuario = [
    {
      id: 'admin',
      nome: 'Administrador',
      descricao: 'Acesso total ao sistema',
      cor: 'danger',
      usuarios: 2,
      permissoes: ['usuarios.criar', 'usuarios.editar', 'usuarios.excluir', 'configuracoes.editar']
    },
    {
      id: 'secretario',
      nome: 'Secretário',
      descricao: 'Gerencia documentos e sessões',
      cor: 'primary',
      usuarios: 5,
      permissoes: ['documentos.criar', 'documentos.editar', 'sessoes.criar', 'relatorios.visualizar']
    },
    {
      id: 'vereador',
      nome: 'Vereador',
      descricao: 'Acesso aos próprios documentos',
      cor: 'success',
      usuarios: 9,
      permissoes: ['documentos.visualizar', 'proposicoes.criar', 'votacoes.participar']
    },
    {
      id: 'publico',
      nome: 'Público',
      descricao: 'Acesso limitado ao portal',
      cor: 'info',
      usuarios: 0,
      permissoes: ['portal.visualizar', 'documentos.publicos']
    }
  ]

  const configuracoesSessao = {
    tempoSessao: 120, // minutos
    loginMultiplo: false,
    senhaMinima: 8,
    senhaComplexidade: true,
    tentativasLogin: 3,
    bloqueioTempo: 30 // minutos
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Configurações de usuários salvas')
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
          { title: 'Usuários e Permissões', path: '/admin/configuracoes/usuarios-permissoes', isSeparator: false, isActive: true }
        ]}
      >
        Usuários e Permissões
      </PageTitle>
      
      <div className="usuarios-permissoes-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="bi bi-arrow-left fs-3"></i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-success me-4">
                  <div className="symbol-label">
                    <i className="bi bi-people text-success fs-2"></i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Usuários e Permissões
                  </h1>
                  <p className="text-muted mb-0">
                    Gerencie perfis de usuário, permissões e configurações de segurança
                  </p>
                </div>
              </div>
              <div>
                <button 
                  className="btn btn-success"
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

        {/* Navegação por abas */}
        <div className="card mb-7">
          <div className="card-header border-0 pt-5">
            <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2">
              <li className="nav-item">
                <a 
                  className={`nav-link text-active-primary pb-4 ${activeTab === 'perfis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('perfis')}
                  style={{cursor: 'pointer'}}
                >
                  <i className="bi bi-person-badge me-2"></i>
                  Perfis de Usuário
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link text-active-primary pb-4 ${activeTab === 'seguranca' ? 'active' : ''}`}
                  onClick={() => setActiveTab('seguranca')}
                  style={{cursor: 'pointer'}}
                >
                  <i className="bi bi-shield-check me-2"></i>
                  Configurações de Segurança
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'perfis' && (
          <div className="row g-6 g-xl-9">
            {perfisUsuario.map((perfil) => (
              <div key={perfil.id} className="col-md-6 col-xl-4">
                <div className="card card-flush h-100">
                  <div className="card-header">
                    <div className="card-title d-flex align-items-center">
                      <div className={`symbol symbol-40px symbol-circle bg-light-${perfil.cor} me-3`}>
                        <div className="symbol-label">
                          <i className={`bi bi-person text-${perfil.cor} fs-3`}></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="fw-bold text-gray-800 m-0">{perfil.nome}</h3>
                        <span className={`badge badge-light-${perfil.cor} fs-8`}>
                          {perfil.usuarios} usuários
                        </span>
                      </div>
                    </div>
                    <div className="card-toolbar">
                      <button className="btn btn-sm btn-icon btn-light">
                        <i className="bi bi-three-dots fs-3"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <p className="text-muted mb-4">
                      {perfil.descricao}
                    </p>
                    
                    <div className="mb-4">
                      <h5 className="text-gray-800 fw-semibold mb-3">Permissões:</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {perfil.permissoes.map((permissao, index) => (
                          <span key={index} className="badge badge-light fs-8">
                            {permissao}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light">
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button className={`btn btn-sm btn-${perfil.cor}`}>
                        <i className="bi bi-gear me-1"></i>
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Card para adicionar novo perfil */}
            <div className="col-md-6 col-xl-4">
              <div className="card card-flush h-100 border-dashed border-primary">
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center py-15">
                  <div className="symbol symbol-60px symbol-circle bg-light-primary mb-4">
                    <div className="symbol-label">
                      <i className="bi bi-plus text-primary fs-1"></i>
                    </div>
                  </div>
                  <h3 className="text-gray-800 fw-bold mb-3">
                    Novo Perfil
                  </h3>
                  <p className="text-muted mb-4">
                    Crie um novo perfil de usuário com permissões personalizadas
                  </p>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus me-2"></i>
                    Criar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="row g-7">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-header">
                  <div className="card-title">
                    <h3 className="fw-bold text-gray-800">Configurações de Sessão</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-5">
                    <div className="col-12">
                      <label className="form-label">Tempo limite da sessão (minutos)</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={configuracoesSessao.tempoSessao}
                        min="15"
                        max="480"
                      />
                      <div className="form-text">
                        Tempo em minutos antes da sessão expirar por inatividade
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          defaultChecked={configuracoesSessao.loginMultiplo}
                        />
                        <label className="form-check-label">
                          Permitir login múltiplo
                        </label>
                      </div>
                      <div className="form-text">
                        Permite que o mesmo usuário faça login em múltiplos dispositivos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-header">
                  <div className="card-title">
                    <h3 className="fw-bold text-gray-800">Políticas de Senha</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-5">
                    <div className="col-12">
                      <label className="form-label">Tamanho mínimo da senha</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={configuracoesSessao.senhaMinima}
                        min="6"
                        max="32"
                      />
                    </div>
                    
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          defaultChecked={configuracoesSessao.senhaComplexidade}
                        />
                        <label className="form-check-label">
                          Exigir senha complexa
                        </label>
                      </div>
                      <div className="form-text">
                        Senha deve conter maiúsculas, minúsculas, números e símbolos
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Tentativas de login</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={configuracoesSessao.tentativasLogin}
                        min="3"
                        max="10"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Tempo de bloqueio (min)</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={configuracoesSessao.bloqueioTempo}
                        min="5"
                        max="60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdministradorLayout>
  )
} 