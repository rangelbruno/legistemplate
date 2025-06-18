'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdministradorLayout from '../../layout'
import { PageTitle } from '../../../../_metronic/layout/core'
import { 
  buscarEstruturaParlamentar, 
  obterPartidosRepresentados,
  buscarMesaDiretora,
  buscarComissoes,
  salvarMesaDiretora,
  salvarComissao,
  excluirComissao,
  type ParlamentarInfo,
  type EstruturaParlamentar,
  type MesaDiretora,
  type Comissao
} from '../../../../services/estrutura-parlamentar.service'
import MesaDiretoraModal from './components/MesaDiretoraModal'
import ComissaoModal from './components/ComissaoModal'
import ComissaoViewModal from './components/ComissaoViewModal'

export default function EstruturaParlamentar() {
  const [estrutura, setEstrutura] = useState<EstruturaParlamentar | null>(null)
  const [loading, setLoading] = useState(true)
  const [partidoSelecionado, setPartidoSelecionado] = useState<string>('TODOS')
  const [modalMesaDiretora, setModalMesaDiretora] = useState(false)
  const [modalComissao, setModalComissao] = useState(false)
  const [modalComissaoView, setModalComissaoView] = useState(false)
  const [comissaoEditando, setComissaoEditando] = useState<Comissao | null>(null)
  const [comissaoVisualizando, setComissaoVisualizando] = useState<Comissao | null>(null)

  // Carregar dados da estrutura parlamentar
  useEffect(() => {
    let isMounted = true

    const carregarDados = async () => {
      try {
        console.log('🔄 Iniciando carregamento da estrutura parlamentar...')
        setLoading(true)
        
        const estruturaData = await buscarEstruturaParlamentar()
        console.log('✅ Estrutura parlamentar carregada com sucesso:', estruturaData)
        
        // Só atualiza o estado se o componente ainda estiver montado
        if (isMounted) {
          setEstrutura(estruturaData)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar estrutura parlamentar:', error)
        
        // Só atualiza o estado se o componente ainda estiver montado
        if (isMounted) {
          setEstrutura({
            totalVereadores: 0,
            totalPartidos: 0,
            presidente: null,
            vereadores: [],
            legislaturaAtual: '2021-2024',
            comissoes: [],
            totalComissoes: 0
          })
        }
      } finally {
        if (isMounted) {
          console.log('🏁 Finalizando carregamento da estrutura parlamentar')
          setLoading(false)
        }
      }
    }

    carregarDados()

    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false
    }
  }, [])

  const carregarEstruturaParlamentar = async () => {
    try {
      setLoading(true)
      const estruturaData = await buscarEstruturaParlamentar()
      setEstrutura(estruturaData)
    } catch (error) {
      console.error('Erro ao carregar estrutura parlamentar:', error)
      setEstrutura({
        totalVereadores: 0,
        totalPartidos: 0,
        presidente: null,
        vereadores: [],
        legislaturaAtual: '2021-2024',
        comissoes: [],
        totalComissoes: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar vereadores por partido
  const vereadoresFiltrados = estrutura && partidoSelecionado === 'TODOS' 
    ? estrutura.vereadores 
    : estrutura?.vereadores.filter(v => v.partido.sigla === partidoSelecionado) || []

  // Obter lista de partidos para filtro
  const partidos = obterPartidosRepresentados()

  // Função para salvar Mesa Diretora
  const handleSalvarMesaDiretora = async (dadosMesaDiretora: Omit<MesaDiretora, 'id'>) => {
    try {
      const mesaDiretoraAtualizada = await salvarMesaDiretora(dadosMesaDiretora)
      
      // Recarregar dados da estrutura parlamentar
      await carregarEstruturaParlamentar()
      
      console.log('Mesa Diretora salva com sucesso:', mesaDiretoraAtualizada)
    } catch (error) {
      console.error('Erro ao salvar Mesa Diretora:', error)
      throw error
    }
  }

  // Função para abrir modal de nova comissão
  const handleNovaComissao = () => {
    setComissaoEditando(null)
    setModalComissao(true)
  }

  // Função para abrir modal de editar comissão
  const handleEditarComissao = (comissao: Comissao) => {
    setComissaoEditando(comissao)
    setModalComissao(true)
  }

  // Função para abrir modal de visualizar comissão
  const handleVisualizarComissao = (comissao: Comissao) => {
    setComissaoVisualizando(comissao)
    setModalComissaoView(true)
  }

  // Função para editar comissão a partir do modal de visualização
  const handleEditarComissaoFromView = (comissao: Comissao) => {
    setModalComissaoView(false) // Fechar modal de visualização
    setComissaoEditando(comissao)
    setModalComissao(true) // Abrir modal de edição
  }

  // Função para salvar comissão
  const handleSalvarComissao = async (dadosComissao: Omit<Comissao, 'id'>) => {
    try {
      const comissaoSalva = await salvarComissao(dadosComissao, comissaoEditando?.id)
      
      // Recarregar dados da estrutura parlamentar
      await carregarEstruturaParlamentar()
      
      console.log('Comissão salva com sucesso:', comissaoSalva)
    } catch (error) {
      console.error('Erro ao salvar comissão:', error)
      throw error
    }
  }

  // Função para excluir comissão
  const handleExcluirComissao = async (comissaoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta comissão?')) {
      try {
        await excluirComissao(comissaoId)
        
        // Recarregar dados da estrutura parlamentar
        await carregarEstruturaParlamentar()
        
        console.log('Comissão excluída com sucesso')
      } catch (error) {
        console.error('Erro ao excluir comissão:', error)
        alert('Erro ao excluir comissão. Tente novamente.')
      }
    }
  }

  if (loading) {
    return (
      <AdministradorLayout>
        <PageTitle 
          breadcrumbs={[
            { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
            { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
            { title: 'Estrutura Parlamentar', path: '/admin/configuracoes/estrutura-parlamentar', isSeparator: false, isActive: true }
          ]}
        >
          Estrutura Parlamentar
        </PageTitle>
        
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando estrutura parlamentar...</span>
          </div>
        </div>
      </AdministradorLayout>
    )
  }

  return (
    <AdministradorLayout>
      <PageTitle 
        breadcrumbs={[
          { title: 'Administração', path: '/admin', isSeparator: false, isActive: false },
          { title: 'Configurações', path: '/admin/configuracoes', isSeparator: false, isActive: false },
          { title: 'Estrutura Parlamentar', path: '/admin/configuracoes/estrutura-parlamentar', isSeparator: false, isActive: true }
        ]}
      >
        Estrutura Parlamentar
      </PageTitle>
      
      <div className="estrutura-parlamentar-config">
        {/* Header da página */}
        <div className="card mb-7">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link to="/admin/configuracoes" className="btn btn-icon btn-sm btn-light me-3">
                  <i className="ki-duotone ki-arrow-left fs-3">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </Link>
                <div className="symbol symbol-50px symbol-circle bg-light-primary me-4">
                  <div className="symbol-label">
                    <i className="ki-duotone ki-office-bag text-primary fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                    </i>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 fw-bold mb-1">
                    Estrutura Parlamentar
                  </h1>
                  <p className="text-muted mb-0">
                    Visualize e gerencie a composição da Câmara Municipal
                  </p>
                </div>
              </div>
              <div>
                <button 
                  className="btn btn-light-primary me-3"
                  onClick={carregarEstruturaParlamentar}
                  disabled={loading}
                >
                  <i className="ki-duotone ki-arrows-circle fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  Atualizar
                </button>
                <Link to="/admin/vereadores" className="btn btn-primary">
                  <i className="ki-duotone ki-plus fs-2"></i>
                  Gerenciar Vereadores
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas gerais */}
        <div className="row g-6 mb-8">
          <div className="col-xl-3 col-md-6">
            <div className="card card-flush h-xl-100">
              <div className="card-header pt-5">
                <div className="card-title d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1">
                      {estrutura?.totalVereadores || 0}
                    </span>
                  </div>
                  <span className="text-gray-500 pt-1 fw-semibold fs-6">Total de Vereadores</span>
                </div>
              </div>
              <div className="card-body pt-2 pb-4 d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-primary">
                      <i className="ki-duotone ki-people fs-2 text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                      </i>
                    </div>
                  </div>
                  <span className="text-gray-500 fw-semibold fs-7">{estrutura?.legislaturaAtual || 'Legislatura 2021-2024'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card card-flush h-xl-100">
              <div className="card-header pt-5">
                <div className="card-title d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1">
                      {estrutura?.totalPartidos || 0}
                    </span>
                  </div>
                  <span className="text-gray-500 pt-1 fw-semibold fs-6">Partidos Representados</span>
                </div>
              </div>
              <div className="card-body pt-2 pb-4 d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-success">
                      <i className="ki-duotone ki-flag fs-2 text-success">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </div>
                  </div>
                  <span className="text-gray-500 fw-semibold fs-7">Pluralidade Política</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card card-flush h-xl-100">
              <div className="card-header pt-5">
                <div className="card-title d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1">
                      {estrutura?.totalComissoes || 0}
                    </span>
                  </div>
                  <span className="text-gray-500 pt-1 fw-semibold fs-6">Comissões Ativas</span>
                </div>
              </div>
              <div className="card-body pt-2 pb-4 d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <div className="symbol-label bg-light-info">
                      <i className="ki-duotone ki-data fs-2 text-info">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                  </div>
                  <span className="text-gray-500 fw-semibold fs-7">Trabalho Legislativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Mesa Diretora */}
        <div className="card mb-8">
          <div className="card-header">
            <div className="card-title">
              <div className="d-flex align-items-center">
                <i className="ki-duotone ki-crown fs-1 text-warning me-3">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                <div>
                  <h3 className="fw-bold text-gray-900 mb-1">Mesa Diretora</h3>
                  <p className="text-gray-600 mb-0">Composição da Mesa Diretora da Câmara Municipal</p>
                </div>
              </div>
            </div>
            <div className="card-toolbar">
              <button 
                className="btn btn-sm btn-light-primary"
                onClick={() => setModalMesaDiretora(true)}
              >
                <i className="ki-duotone ki-pencil fs-3">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                Editar Mesa Diretora
              </button>
            </div>
          </div>
          <div className="card-body">
            {estrutura?.mesaDiretora ? (
              <div className="row g-6">
                {/* Presidente */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-4 bg-light-warning rounded">
                    <div className="symbol symbol-60px me-4">
                      <div className="symbol-label bg-warning">
                        <i className="ki-duotone ki-crown fs-2 text-white">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-900 fw-bold mb-1">Presidente</h4>
                      <div className="text-gray-800 fw-semibold">{estrutura.mesaDiretora.presidente.nome}</div>
                      <div className="text-gray-600 fs-7">{estrutura.mesaDiretora.presidente.partido.sigla}</div>
                    </div>
                  </div>
                </div>

                {/* Vice-Presidente Primeiro */}
                {estrutura.mesaDiretora.vicePrimeiro && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-4 bg-light-primary rounded">
                      <div className="symbol symbol-60px me-4">
                        <div className="symbol-label bg-primary">
                          <i className="ki-duotone ki-user-tick fs-2 text-white">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-900 fw-bold mb-1">1º Vice-Presidente</h4>
                        <div className="text-gray-800 fw-semibold">{estrutura.mesaDiretora.vicePrimeiro.nome}</div>
                        <div className="text-gray-600 fs-7">{estrutura.mesaDiretora.vicePrimeiro.partido.sigla}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vice-Presidente Segundo */}
                {estrutura.mesaDiretora.viceSegundo && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-4 bg-light-info rounded">
                      <div className="symbol symbol-60px me-4">
                        <div className="symbol-label bg-info">
                          <i className="ki-duotone ki-user fs-2 text-white">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-900 fw-bold mb-1">2º Vice-Presidente</h4>
                        <div className="text-gray-800 fw-semibold">{estrutura.mesaDiretora.viceSegundo.nome}</div>
                        <div className="text-gray-600 fs-7">{estrutura.mesaDiretora.viceSegundo.partido.sigla}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primeiro Secretário */}
                {estrutura.mesaDiretora.primeiroSecretario && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-4 bg-light-success rounded">
                      <div className="symbol symbol-60px me-4">
                        <div className="symbol-label bg-success">
                          <i className="ki-duotone ki-document fs-2 text-white">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-900 fw-bold mb-1">1º Secretário</h4>
                        <div className="text-gray-800 fw-semibold">{estrutura.mesaDiretora.primeiroSecretario.nome}</div>
                        <div className="text-gray-600 fs-7">{estrutura.mesaDiretora.primeiroSecretario.partido.sigla}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Demais secretários... */}
                <div className="col-12">
                  <div className="row g-4">
                    {estrutura.mesaDiretora.segundoSecretario && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="symbol symbol-40px me-3">
                            <div className="symbol-label bg-secondary">
                              <i className="ki-duotone ki-document fs-6 text-white">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900 fw-bold fs-7">2º Secretário</div>
                            <div className="text-gray-800 fs-8">{estrutura.mesaDiretora.segundoSecretario.nome}</div>
                            <div className="text-gray-600 fs-9">{estrutura.mesaDiretora.segundoSecretario.partido.sigla}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {estrutura.mesaDiretora.terceiroSecretario && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="symbol symbol-40px me-3">
                            <div className="symbol-label bg-secondary">
                              <i className="ki-duotone ki-document fs-6 text-white">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900 fw-bold fs-7">3º Secretário</div>
                            <div className="text-gray-800 fs-8">{estrutura.mesaDiretora.terceiroSecretario.nome}</div>
                            <div className="text-gray-600 fs-9">{estrutura.mesaDiretora.terceiroSecretario.partido.sigla}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {estrutura.mesaDiretora.quartoSecretario && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="symbol symbol-40px me-3">
                            <div className="symbol-label bg-secondary">
                              <i className="ki-duotone ki-document fs-6 text-white">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900 fw-bold fs-7">4º Secretário</div>
                            <div className="text-gray-800 fs-8">{estrutura.mesaDiretora.quartoSecretario.nome}</div>
                            <div className="text-gray-600 fs-9">{estrutura.mesaDiretora.quartoSecretario.partido.sigla}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações do mandato */}
                <div className="col-12">
                  <div className="separator my-4"></div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-gray-600 fw-semibold">Mandato: </span>
                      <span className="text-gray-900 fw-bold">
                        {new Date(estrutura.mesaDiretora.mandatoInicio).getFullYear()} - {new Date(estrutura.mesaDiretora.mandatoFim).getFullYear()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 fw-semibold">Posse: </span>
                      <span className="text-gray-900">{new Date(estrutura.mesaDiretora.dataPosse).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="symbol symbol-100px mx-auto mb-4">
                  <div className="symbol-label bg-light-secondary">
                    <i className="ki-duotone ki-questionnaire-tablet fs-2x text-secondary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </div>
                </div>
                <h4 className="text-gray-900 fw-bold mb-2">Mesa Diretora não constituída</h4>
                <p className="text-gray-600 mb-4">Configure a composição da Mesa Diretora da Câmara Municipal</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setModalMesaDiretora(true)}
                >
                  <i className="ki-duotone ki-plus fs-2"></i>
                  Configurar Mesa Diretora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seção Comissões */}
        <div className="card mb-8">
          <div className="card-header">
            <div className="card-title">
              <div className="d-flex align-items-center">
                <i className="ki-duotone ki-data fs-1 text-info me-3">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
                <div>
                  <h3 className="fw-bold text-gray-900 mb-1">Comissões</h3>
                  <p className="text-gray-600 mb-0">Comissões permanentes e temporárias da Câmara</p>
                </div>
              </div>
            </div>
            <div className="card-toolbar">
              <button className="btn btn-sm btn-light-info me-2">
                <i className="ki-duotone ki-filter fs-3">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                Filtrar
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleNovaComissao}
              >
                <i className="ki-duotone ki-plus fs-3"></i>
                Nova Comissão
              </button>
            </div>
          </div>
          <div className="card-body">
            {estrutura?.comissoes && estrutura.comissoes.length > 0 ? (
              <div className="row g-6">
                {estrutura.comissoes.map(comissao => (
                  <div key={comissao.id} className="col-xl-6 col-lg-12">
                    <div className="card card-flush h-100">
                      <div className="card-header pt-5">
                        <div className="card-title d-flex flex-column">
                          <div className="d-flex align-items-start">
                            <div className="symbol symbol-40px me-3">
                              <div className={`symbol-label ${
                                comissao.tipo === 'PERMANENTE' ? 'bg-light-primary' :
                                comissao.tipo === 'CPI' ? 'bg-light-danger' :
                                comissao.tipo === 'TEMPORARIA' ? 'bg-light-warning' :
                                'bg-light-info'
                              }`}>
                                <i className={`ki-duotone ki-data fs-2 ${
                                  comissao.tipo === 'PERMANENTE' ? 'text-primary' :
                                  comissao.tipo === 'CPI' ? 'text-danger' :
                                  comissao.tipo === 'TEMPORARIA' ? 'text-warning' :
                                  'text-info'
                                }`}>
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  <span className="path3"></span>
                                </i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h4 className="text-gray-900 fw-bold mb-1">{comissao.nome}</h4>
                              <div className="d-flex align-items-center">
                                <span className={`badge ${
                                  comissao.tipo === 'PERMANENTE' ? 'badge-light-primary' :
                                  comissao.tipo === 'CPI' ? 'badge-light-danger' :
                                  comissao.tipo === 'TEMPORARIA' ? 'badge-light-warning' :
                                  'badge-light-info'
                                } me-2`}>
                                  {comissao.tipo}
                                </span>
                                <span className={`badge ${
                                  comissao.status === 'ATIVA' ? 'badge-light-success' :
                                  comissao.status === 'INATIVA' ? 'badge-light-secondary' :
                                  'badge-light-warning'
                                }`}>
                                  {comissao.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-body pt-3">
                        <div className="mb-4">
                          <div className="text-gray-600 fw-semibold fs-7 mb-1">Descrição</div>
                          <div className="text-gray-800 fs-7">{comissao.descricao}</div>
                        </div>

                        <div className="mb-4">
                          <div className="text-gray-600 fw-semibold fs-7 mb-2">Membros</div>
                          <div className="d-flex align-items-center mb-2">
                            <div className="symbol symbol-30px me-2">
                              <div className="symbol-label bg-light-warning">
                                <i className="ki-duotone ki-crown fs-6 text-warning">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                </i>
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-900 fw-bold fs-8">Presidente</div>
                              <div className="text-gray-600 fs-9">{comissao.presidente.nome} ({comissao.presidente.partido.sigla})</div>
                            </div>
                          </div>

                          {comissao.vicePressidente && (
                            <div className="d-flex align-items-center mb-2">
                              <div className="symbol symbol-30px me-2">
                                <div className="symbol-label bg-light-primary">
                                  <i className="ki-duotone ki-user fs-6 text-primary">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                  </i>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-900 fw-bold fs-8">Vice-Presidente</div>
                                <div className="text-gray-600 fs-9">{comissao.vicePressidente.nome} ({comissao.vicePressidente.partido.sigla})</div>
                              </div>
                            </div>
                          )}

                          {comissao.relator && (
                            <div className="d-flex align-items-center mb-2">
                              <div className="symbol symbol-30px me-2">
                                <div className="symbol-label bg-light-success">
                                  <i className="ki-duotone ki-document fs-6 text-success">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-900 fw-bold fs-8">Relator</div>
                                <div className="text-gray-600 fs-9">{comissao.relator.nome} ({comissao.relator.partido.sigla})</div>
                              </div>
                            </div>
                          )}

                          <div className="text-gray-600 fs-8 mt-2">
                            <span className="fw-semibold">{comissao.membros.length}</span> membro(s) total
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-gray-600 fw-semibold fs-7 mb-1">Constituição</div>
                          <div className="text-gray-800 fw-bold fs-8">
                            {new Date(comissao.dataConstituicao).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        <div className="d-flex justify-content-end">
                          <button 
                            className="btn btn-sm btn-light-primary me-2"
                            onClick={() => handleVisualizarComissao(comissao)}
                          >
                            <i className="ki-duotone ki-eye fs-4">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                            Visualizar
                          </button>
                          <button 
                            className="btn btn-sm btn-light"
                            onClick={() => handleEditarComissao(comissao)}
                          >
                            <i className="ki-duotone ki-pencil fs-4">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="symbol symbol-100px mx-auto mb-4">
                  <div className="symbol-label bg-light-secondary">
                    <i className="ki-duotone ki-data fs-2x text-secondary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  </div>
                </div>
                <h4 className="text-gray-900 fw-bold mb-2">Nenhuma comissão cadastrada</h4>
                <p className="text-gray-600 mb-4">Crie comissões permanentes e temporárias para organizar o trabalho legislativo</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleNovaComissao}
                >
                  <i className="ki-duotone ki-plus fs-2"></i>
                  Criar Primeira Comissão
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filtros e Lista de Vereadores */}
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                <input
                  type="text"
                  data-kt-customer-table-filter="search"
                  className="form-control form-control-solid w-250px ps-13"
                  placeholder="Buscar vereador..."
                />
              </div>
            </div>

            <div className="card-toolbar">
              <div className="d-flex justify-content-end" data-kt-customer-table-toolbar="base">
                <select
                  className="form-select form-select-solid w-150px me-3"
                  value={partidoSelecionado}
                  onChange={(e) => setPartidoSelecionado(e.target.value)}
                >
                  <option value="TODOS">Todos os Partidos</option>
                  {partidos.map(partido => (
                    <option key={partido} value={partido}>{partido}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row g-6">
              {vereadoresFiltrados.map(vereador => (
                <div key={vereador.id} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card card-flush h-xl-100">
                    <div className="card-header pt-7">
                      <div className="card-title d-flex flex-column">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-50px me-3">
                            {vereador.foto ? (
                              <img src={vereador.foto} alt={vereador.nome} className="w-100" />
                            ) : (
                              <div className="symbol-label bg-light-primary fs-3 fw-bold text-primary">
                                {vereador.nome.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-gray-900 fw-bold mb-1">{vereador.nome}</h3>
                            <div className="d-flex align-items-center">
                              <span className="badge badge-light-primary me-2">
                                {vereador.partido.sigla}
                              </span>
                              {vereador.presidenteCamara && (
                                <span className="badge badge-light-warning">
                                  <i className="ki-duotone ki-crown fs-8 me-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                  Presidente
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body pt-3">
                      <div className="mb-3">
                        <div className="text-gray-600 fw-semibold fs-7">Partido</div>
                        <div className="text-gray-900 fw-bold fs-6">
                          {vereador.partido.nome} ({vereador.partido.sigla})
                        </div>
                      </div>

                      {vereador.profissao && (
                        <div className="mb-3">
                          <div className="text-gray-600 fw-semibold fs-7">Profissão</div>
                          <div className="text-gray-900 fw-bold fs-6">{vereador.profissao}</div>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="text-gray-600 fw-semibold fs-7">Mandato</div>
                        <div className="text-gray-900 fw-bold fs-6">
                          {new Date(vereador.mandatoInicio).getFullYear()} - {' '}
                          {vereador.mandatoFim ? new Date(vereador.mandatoFim).getFullYear() : '2024'}
                        </div>
                      </div>

                      {vereador.telefone && (
                        <div className="mb-3">
                          <div className="text-gray-600 fw-semibold fs-7">Contato</div>
                          <div className="text-gray-900 fw-bold fs-6">
                            <i className="ki-duotone ki-phone fs-7 me-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            {vereador.telefone}
                          </div>
                        </div>
                      )}

                      {vereador.biografia && (
                        <div className="mb-3">
                          <div className="text-gray-600 fw-semibold fs-7">Biografia</div>
                          <div className="text-gray-700 fs-7 text-truncate" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                            {vereador.biografia}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-footer pt-3">
                      <Link to={`/admin/vereadores/${vereador.id}`} className="btn btn-light-primary btn-sm w-100">
                        <i className="ki-duotone ki-eye fs-7 me-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        Ver/Editar Perfil
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {vereadoresFiltrados.length === 0 && (
              <div className="text-center py-10">
                <div className="mb-4">
                  <i className="ki-duotone ki-search-list fs-4x text-muted">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <h4 className="text-gray-600 fw-semibold mb-2">Nenhum vereador encontrado</h4>
                <p className="text-gray-500 mb-0">
                  {partidoSelecionado !== 'TODOS' 
                    ? `Não há vereadores do partido ${partidoSelecionado}` 
                    : 'Nenhum vereador corresponde aos critérios de busca'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Mesa Diretora */}
      <MesaDiretoraModal
        isOpen={modalMesaDiretora}
        onClose={() => setModalMesaDiretora(false)}
        onSave={handleSalvarMesaDiretora}
        mesaDiretoraAtual={estrutura?.mesaDiretora}
        vereadores={estrutura?.vereadores || []}
      />

      {/* Modal Comissão */}
      <ComissaoModal
        isOpen={modalComissao}
        onClose={() => setModalComissao(false)}
        onSave={handleSalvarComissao}
        comissaoAtual={comissaoEditando}
        vereadores={estrutura?.vereadores || []}
      />

      {/* Modal Visualizar Comissão */}
      <ComissaoViewModal
        isOpen={modalComissaoView}
        onClose={() => setModalComissaoView(false)}
        onEdit={handleEditarComissaoFromView}
        comissao={comissaoVisualizando}
      />
    </AdministradorLayout>
  )
} 