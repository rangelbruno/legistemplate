import React, { useState, useMemo } from 'react';

interface Sessao {
  id: string;
  titulo: string;
  tipo: 'ordinaria' | 'extraordinaria';
  data: string;
  hora: string;
  local: string;
  status: 'agendada' | 'em-andamento' | 'concluida' | 'cancelada';
  descricao?: string;
  criadoPor: string;
  criadoEm: string;
  participantes?: number;
}

interface ListaSessoesProps {
  sessoes?: Sessao[];
  onEdit?: (sessao: Sessao) => void;
  onDelete?: (id: string) => void;
  onView?: (sessao: Sessao) => void;
}

const ListaSessoes: React.FC<ListaSessoesProps> = ({ 
  sessoes = [], 
  onEdit, 
  onDelete, 
  onView 
}) => {
  // Estados para filtros e busca
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroMes, setFiltroMes] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<'data' | 'titulo' | 'tipo' | 'status'>('data');
  const [direcao, setDirecao] = useState<'asc' | 'desc'>('asc');
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const itensPorPagina = 10;

  // Estados para modais
  const [modalVisualizar, setModalVisualizar] = useState<boolean>(false);
  const [modalEditar, setModalEditar] = useState<boolean>(false);
  const [modalExcluir, setModalExcluir] = useState<boolean>(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [sessaoEditando, setSessaoEditando] = useState<Sessao | null>(null);
  const [sessaoExcluindo, setSessaoExcluindo] = useState<Sessao | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock de dados para desenvolvimento
  const sessoesMock: Sessao[] = [
    {
      id: '1',
      titulo: 'Sessão Ordinária - Janeiro',
      tipo: 'ordinaria',
      data: '2025-01-15',
      hora: '14:00',
      local: 'Plenário Principal',
      status: 'agendada',
      descricao: 'Discussão e votação de projetos de lei',
      criadoPor: 'Admin',
      criadoEm: '2025-01-10',
      participantes: 15
    },
    {
      id: '2',
      titulo: 'Sessão Extraordinária - Orçamento 2025',
      tipo: 'extraordinaria',
      data: '2025-01-20',
      hora: '09:00',
      local: 'Plenário Principal',
      status: 'agendada',
      descricao: 'Análise urgente do projeto de lei orçamentária',
      criadoPor: 'Presidente',
      criadoEm: '2025-01-12',
      participantes: 21
    },
    {
      id: '3',
      titulo: 'Sessão Ordinária - Fevereiro',
      tipo: 'ordinaria',
      data: '2025-02-05',
      hora: '14:00',
      local: 'Plenário Principal',
      status: 'concluida',
      descricao: 'Sessão regular mensal',
      criadoPor: 'Admin',
      criadoEm: '2025-01-25',
      participantes: 18
    },
    {
      id: '4',
      titulo: 'Sessão Extraordinária - Emergência',
      tipo: 'extraordinaria',
      data: '2025-02-10',
      hora: '16:30',
      local: 'Sala de Comissões',
      status: 'cancelada',
      descricao: 'Sessão cancelada devido a questões técnicas',
      criadoPor: 'Secretário',
      criadoEm: '2025-02-08',
      participantes: 0
    },
    {
      id: '5',
      titulo: 'Sessão Ordinária - Março',
      tipo: 'ordinaria',
      data: '2025-03-12',
      hora: '14:00',
      local: 'Plenário Principal',
      status: 'em-andamento',
      descricao: 'Sessão em andamento',
      criadoPor: 'Admin',
      criadoEm: '2025-03-10',
      participantes: 19
    }
  ];

  const dadosSessoes = sessoes.length > 0 ? sessoes : sessoesMock;

  // Função para filtrar e ordenar sessões
  const sessoesFiltradas = useMemo(() => {
    let resultado = [...dadosSessoes];

    // Filtro por busca
    if (busca) {
      resultado = resultado.filter(sessao =>
        sessao.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        sessao.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        sessao.local.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(sessao => sessao.tipo === filtroTipo);
    }

    // Filtro por status
    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(sessao => sessao.status === filtroStatus);
    }

    // Filtro por mês
    if (filtroMes !== 'todos') {
      resultado = resultado.filter(sessao => {
        const mesSessao = new Date(sessao.data).getMonth() + 1;
        return mesSessao.toString() === filtroMes;
      });
    }

    // Ordenação
    resultado.sort((a, b) => {
      let valorA: any, valorB: any;

      switch (ordenacao) {
        case 'data':
          valorA = new Date(a.data + ' ' + a.hora);
          valorB = new Date(b.data + ' ' + b.hora);
          break;
        case 'titulo':
          valorA = a.titulo.toLowerCase();
          valorB = b.titulo.toLowerCase();
          break;
        case 'tipo':
          valorA = a.tipo;
          valorB = b.tipo;
          break;
        case 'status':
          valorA = a.status;
          valorB = b.status;
          break;
        default:
          valorA = a.data;
          valorB = b.data;
      }

      if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [dadosSessoes, busca, filtroTipo, filtroStatus, filtroMes, ordenacao, direcao]);

  // Paginação
  const totalPaginas = Math.ceil(sessoesFiltradas.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const sessoesPaginadas = sessoesFiltradas.slice(indiceInicio, indiceInicio + itensPorPagina);

  // Funções auxiliares
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora: string) => {
    return hora;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'agendada': return 'badge-light-primary';
      case 'em-andamento': return 'badge-light-success';
      case 'concluida': return 'badge-light-info';
      case 'cancelada': return 'badge-light-danger';
      default: return 'badge-light-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'em-andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getTipoClass = (tipo: string) => {
    return tipo === 'ordinaria' ? 'badge-light-primary' : 'badge-light-warning';
  };

  const getTipoText = (tipo: string) => {
    return tipo === 'ordinaria' ? 'Ordinária' : 'Extraordinária';
  };

  const handleOrdenacao = (campo: 'data' | 'titulo' | 'tipo' | 'status') => {
    if (ordenacao === campo) {
      setDirecao(direcao === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenacao(campo);
      setDirecao('asc');
    }
  };

  const limparFiltros = () => {
    setFiltroTipo('todos');
    setFiltroStatus('todos');
    setFiltroMes('todos');
    setBusca('');
    setPaginaAtual(1);
  };

  // Funções para gerenciar modais
  const handleVisualizar = (sessao: Sessao) => {
    setSessaoSelecionada(sessao);
    setModalVisualizar(true);
    onView && onView(sessao);
  };

  const handleEditar = (sessao: Sessao) => {
    setSessaoEditando({ ...sessao });
    setModalEditar(true);
  };

  const handleSalvarEdicao = async () => {
    if (!sessaoEditando) return;
    
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada para a API
      onEdit && onEdit(sessaoEditando);
      
      setModalEditar(false);
      setSessaoEditando(null);
      console.log('Sessão editada:', sessaoEditando);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluir = (sessao: Sessao) => {
    setSessaoExcluindo(sessao);
    setModalExcluir(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!sessaoExcluindo) return;
    
    setIsLoading(true);
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada para a API
      onDelete && onDelete(sessaoExcluindo.id);
      
      setModalExcluir(false);
      setSessaoExcluindo(null);
      console.log('Sessão excluída:', sessaoExcluindo);
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFecharModais = () => {
    setModalVisualizar(false);
    setModalEditar(false);
    setModalExcluir(false);
    setSessaoSelecionada(null);
    setSessaoEditando(null);
    setSessaoExcluindo(null);
  };

  const formatarDataCompleta = (data: string, hora: string) => {
    const dataObj = new Date(data + ' ' + hora);
    return dataObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' às ' + hora;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-list-ul text-primary me-2"></i>
            Agenda de Sessões
          </h3>
        </div>
        <div className="card-toolbar">
          <span className="badge badge-light-info">{sessoesFiltradas.length} sessões</span>
        </div>
      </div>

      <div className="card-body">
        {/* Filtros e Busca */}
        <div className="row g-3 mb-6 align-items-end">
          {/* Busca */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold text-gray-600 fs-7">Buscar</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search fs-6"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Digite título, descrição ou local..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro Tipo */}
          <div className="col-6 col-md-2">
            <label className="form-label fw-semibold text-gray-600 fs-7">Tipo</label>
            <select
              className="form-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="ordinaria">Ordinária</option>
              <option value="extraordinaria">Extraordinária</option>
            </select>
          </div>

          {/* Filtro Status */}
          <div className="col-6 col-md-2">
            <label className="form-label fw-semibold text-gray-600 fs-7">Status</label>
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="agendada">Agendada</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Filtro Mês */}
          <div className="col-6 col-md-2">
            <label className="form-label fw-semibold text-gray-600 fs-7">Mês</label>
            <select
              className="form-select"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          {/* Botão Limpar */}
          <div className="col-6 col-md-2">
            <button
              type="button"
              className="btn btn-light btn-sm w-100"
              onClick={limparFiltros}
              title="Limpar todos os filtros"
            >
              <i className="bi bi-x-circle me-1"></i>
              <span className="d-none d-md-inline">Limpar</span>
            </button>
          </div>
        </div>

        {/* Tabela de Sessões - Desktop */}
        <div className="table-responsive d-none d-lg-block sessoes-table">
          <table className="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th 
                  className="min-w-200px cursor-pointer sortable-header"
                  onClick={() => handleOrdenacao('titulo')}
                >
                  <div className="d-flex align-items-center">
                    Sessão
                    {ordenacao === 'titulo' && (
                      <i className={`bi bi-chevron-${direcao === 'asc' ? 'up' : 'down'} ms-2 text-primary`}></i>
                    )}
                  </div>
                </th>
                <th 
                  className="min-w-100px cursor-pointer sortable-header"
                  onClick={() => handleOrdenacao('tipo')}
                >
                  <div className="d-flex align-items-center">
                    Tipo
                    {ordenacao === 'tipo' && (
                      <i className={`bi bi-chevron-${direcao === 'asc' ? 'up' : 'down'} ms-2 text-primary`}></i>
                    )}
                  </div>
                </th>
                <th 
                  className="min-w-150px cursor-pointer sortable-header"
                  onClick={() => handleOrdenacao('data')}
                >
                  <div className="d-flex align-items-center">
                    Data/Hora
                    {ordenacao === 'data' && (
                      <i className={`bi bi-chevron-${direcao === 'asc' ? 'up' : 'down'} ms-2 text-primary`}></i>
                    )}
                  </div>
                </th>
                <th className="min-w-125px">Local</th>
                <th 
                  className="min-w-100px cursor-pointer sortable-header"
                  onClick={() => handleOrdenacao('status')}
                >
                  <div className="d-flex align-items-center">
                    Status
                    {ordenacao === 'status' && (
                      <i className={`bi bi-chevron-${direcao === 'asc' ? 'up' : 'down'} ms-2 text-primary`}></i>
                    )}
                  </div>
                </th>
                <th className="min-w-100px">Participantes</th>
                <th className="text-end min-w-120px">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
              {sessoesPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-15">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <i className="bi bi-calendar-x text-muted"></i>
                      </div>
                      <h3 className="text-gray-800 fw-bold mb-2">Nenhuma sessão encontrada</h3>
                      <p className="text-muted mb-0">Tente ajustar os filtros ou adicionar novas sessões</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessoesPaginadas.map((sessao, index) => (
                  <tr key={sessao.id} className="sessao-row" style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="text-gray-800 fw-bold text-hover-primary mb-1">{sessao.titulo}</span>
                        {sessao.descricao && (
                          <span className="text-muted fs-7">{sessao.descricao}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge fs-7 fw-bold ${getTipoClass(sessao.tipo)}`}>
                        {getTipoText(sessao.tipo)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="text-gray-800 fw-semibold">{formatarData(sessao.data)}</span>
                        <span className="text-muted fs-7">{formatarHora(sessao.hora)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-geo-alt text-muted me-2"></i>
                        <span className="text-gray-700">{sessao.local}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge fs-7 fw-bold ${getStatusClass(sessao.status)}`}>
                        {getStatusText(sessao.status)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-30px me-3">
                          <div className="symbol-label bg-light-primary">
                            <i className="bi bi-people text-primary fs-7"></i>
                          </div>
                        </div>
                        <span className="text-gray-800 fw-bold">{sessao.participantes || 0}</span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-toolbar justify-content-end" role="toolbar">
                        <div className="btn-group btn-group-sm action-buttons" role="group">
                          <button
                            type="button"
                            className="btn btn-icon btn-light btn-active-light-primary"
                            onClick={() => handleVisualizar(sessao)}
                            title="Visualizar detalhes"
                          >
                            <i className="bi bi-eye fs-6"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-icon btn-light btn-active-light-info"
                            onClick={() => handleEditar(sessao)}
                            title="Editar sessão"
                          >
                            <i className="bi bi-pencil fs-6"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-icon btn-light btn-active-light-danger"
                            onClick={() => handleExcluir(sessao)}
                            title="Excluir sessão"
                          >
                            <i className="bi bi-trash fs-6"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards de Sessões - Mobile/Tablet */}
        <div className="d-block d-lg-none sessoes-cards">
          {sessoesPaginadas.length === 0 ? (
            <div className="empty-state-mobile">
              <div className="text-center py-15">
                <div className="empty-state-icon mb-5">
                  <i className="bi bi-calendar-x text-muted"></i>
                </div>
                <h3 className="text-gray-800 fw-bold mb-2">Nenhuma sessão encontrada</h3>
                <p className="text-muted mb-0">Tente ajustar os filtros</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {sessoesPaginadas.map((sessao, index) => (
                <div key={sessao.id} className="col-12 col-md-6">
                  <div className="card sessao-card h-100" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="card-body p-6">
                      {/* Header do Card */}
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="flex-grow-1">
                          <h5 className="card-title text-gray-800 fw-bold mb-2">{sessao.titulo}</h5>
                          {sessao.descricao && (
                            <p className="card-text text-muted fs-7 mb-0">{sessao.descricao}</p>
                          )}
                        </div>
                        <div className="ms-3">
                          <span className={`badge fs-7 fw-bold ${getTipoClass(sessao.tipo)}`}>
                            {getTipoText(sessao.tipo)}
                          </span>
                        </div>
                      </div>

                      {/* Informações principais */}
                      <div className="separator separator-dashed my-4"></div>
                      
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-35px me-3">
                              <div className="symbol-label bg-light-primary">
                                <i className="bi bi-calendar-event text-primary fs-6"></i>
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-800 fw-semibold fs-7">{formatarData(sessao.data)}</div>
                              <div className="text-muted fs-8">{formatarHora(sessao.hora)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-35px me-3">
                              <div className="symbol-label bg-light-info">
                                <i className="bi bi-geo-alt text-info fs-6"></i>
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-800 fw-semibold fs-7">{sessao.local}</div>
                              <div className="text-muted fs-8">Local</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status e Participantes */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-30px symbol-circle me-3">
                            <div className="symbol-label bg-light-success">
                              <i className="bi bi-people text-success fs-7"></i>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-800 fw-bold">{sessao.participantes || 0}</span>
                            <span className="text-muted fs-7 ms-1">participantes</span>
                          </div>
                        </div>
                        
                        <span className={`badge fs-7 fw-bold ${getStatusClass(sessao.status)}`}>
                          {getStatusText(sessao.status)}
                        </span>
                      </div>

                      {/* Botões de ação */}
                      <div className="separator separator-dashed my-4"></div>
                      
                      <div className="d-flex justify-content-between">
                        <div className="btn-group btn-group-sm flex-fill" role="group">
                          <button
                            type="button"
                            className="btn btn-light btn-active-light-primary flex-fill"
                            onClick={() => handleVisualizar(sessao)}
                          >
                            <i className="bi bi-eye me-2"></i>
                            Ver
                          </button>
                          <button
                            type="button"
                            className="btn btn-light btn-active-light-info flex-fill"
                            onClick={() => handleEditar(sessao)}
                          >
                            <i className="bi bi-pencil me-2"></i>
                            Editar
                          </button>
                        </div>
                        <div className="dropdown ms-2">
                          <button
                            className="btn btn-light btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleExcluir(sessao)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Excluir
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="d-flex flex-stack flex-wrap pt-6">
            <div className="fs-6 fw-semibold text-gray-700">
              Mostrando {indiceInicio + 1} a {Math.min(indiceInicio + itensPorPagina, sessoesFiltradas.length)} de {sessoesFiltradas.length} resultados
            </div>
            
            <ul className="pagination">
              <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaAtual(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                >
                  <i className="previous"></i>
                </button>
              </li>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <li key={pagina} className={`page-item ${paginaAtual === pagina ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaAtual(pagina)}
                  >
                    {pagina}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaAtual(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  <i className="next"></i>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

              {/* Modal de Visualização */}
        {modalVisualizar && sessaoSelecionada && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content bg-white text-dark">
              <div className="modal-header border-0 pb-0">
                <h3 className="modal-title fw-bold text-gray-800">
                  <i className="bi bi-eye text-primary me-3"></i>
                  Detalhes da Sessão
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-icon btn-active-light-primary"
                  onClick={handleFecharModais}
                >
                  <i className="bi bi-x fs-2"></i>
                </button>
              </div>
              
              <div className="modal-body pt-0">
                <div className="d-flex flex-column">
                  {/* Cabeçalho com título e tipo */}
                  <div className="d-flex justify-content-between align-items-start mb-7">
                    <div className="flex-grow-1">
                      <h4 className="text-gray-800 fw-bold mb-2">{sessaoSelecionada.titulo}</h4>
                      {sessaoSelecionada.descricao && (
                        <p className="text-muted mb-0">{sessaoSelecionada.descricao}</p>
                      )}
                    </div>
                    <span className={`badge fs-6 fw-bold ${getTipoClass(sessaoSelecionada.tipo)}`}>
                      {getTipoText(sessaoSelecionada.tipo)}
                    </span>
                  </div>

                  {/* Informações principais em grid */}
                  <div className="row g-6 mb-7">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50px me-4">
                          <div className="symbol-label bg-light-primary">
                            <i className="bi bi-calendar-event text-primary fs-3"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-800 fw-bold fs-6">Data e Hora</div>
                          <div className="text-muted">{formatarDataCompleta(sessaoSelecionada.data, sessaoSelecionada.hora)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50px me-4">
                          <div className="symbol-label bg-light-info">
                            <i className="bi bi-geo-alt text-info fs-3"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-800 fw-bold fs-6">Local</div>
                          <div className="text-muted">{sessaoSelecionada.local}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-6 mb-7">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50px me-4">
                          <div className="symbol-label bg-light-success">
                            <i className="bi bi-flag text-success fs-3"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-800 fw-bold fs-6">Status</div>
                          <span className={`badge fs-7 fw-bold ${getStatusClass(sessaoSelecionada.status)}`}>
                            {getStatusText(sessaoSelecionada.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50px me-4">
                          <div className="symbol-label bg-light-warning">
                            <i className="bi bi-people text-warning fs-3"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-800 fw-bold fs-6">Participantes</div>
                          <div className="text-muted">{sessaoSelecionada.participantes || 0} pessoa(s)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações de criação */}
                  <div className="separator separator-dashed my-6"></div>
                  
                  <div className="row g-6">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-40px me-3">
                          <div className="symbol-label bg-light-secondary">
                            <i className="bi bi-person text-secondary fs-4"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 fs-7">Criado por</div>
                          <div className="text-gray-800 fw-semibold">{sessaoSelecionada.criadoPor}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-40px me-3">
                          <div className="symbol-label bg-light-secondary">
                            <i className="bi bi-clock text-secondary fs-4"></i>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 fs-7">Criado em</div>
                          <div className="text-gray-800 fw-semibold">{formatarData(sessaoSelecionada.criadoEm)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  onClick={handleFecharModais}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleFecharModais();
                    handleEditar(sessaoSelecionada);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Sessão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

              {/* Modal de Edição */}
        {modalEditar && sessaoEditando && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content bg-white text-dark">
              <div className="modal-header border-0 pb-0">
                <h3 className="modal-title fw-bold text-gray-800">
                  <i className="bi bi-pencil text-primary me-3"></i>
                  Editar Sessão
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-icon btn-active-light-primary"
                  onClick={handleFecharModais}
                  disabled={isLoading}
                >
                  <i className="bi bi-x fs-2"></i>
                </button>
              </div>
              
              <div className="modal-body pt-0">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row g-6">
                    {/* Título */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-gray-600 required">Título da Sessão</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={sessaoEditando.titulo}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, titulo: e.target.value })}
                        placeholder="Digite o título da sessão"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Descrição */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-gray-600">Descrição</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={sessaoEditando.descricao || ''}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, descricao: e.target.value })}
                        placeholder="Descrição detalhada da sessão"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Tipo e Status */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-600 required">Tipo de Sessão</label>
                      <select
                        className="form-select form-select-lg"
                        value={sessaoEditando.tipo}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, tipo: e.target.value as 'ordinaria' | 'extraordinaria' })}
                        disabled={isLoading}
                      >
                        <option value="ordinaria">Ordinária</option>
                        <option value="extraordinaria">Extraordinária</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-600 required">Status</label>
                      <select
                        className="form-select form-select-lg"
                        value={sessaoEditando.status}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, status: e.target.value as any })}
                        disabled={isLoading}
                      >
                        <option value="agendada">Agendada</option>
                        <option value="em-andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </div>

                    {/* Data e Hora */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-600 required">Data</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        value={sessaoEditando.data}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, data: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-600 required">Hora</label>
                      <input
                        type="time"
                        className="form-control form-control-lg"
                        value={sessaoEditando.hora}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, hora: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Local e Participantes */}
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-gray-600 required">Local</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={sessaoEditando.local}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, local: e.target.value })}
                        placeholder="Local onde será realizada a sessão"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-gray-600">Participantes</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={sessaoEditando.participantes || 0}
                        onChange={(e) => setSessaoEditando({ ...sessaoEditando, participantes: parseInt(e.target.value) || 0 })}
                        placeholder="Número de participantes"
                        min="0"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  onClick={handleFecharModais}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSalvarEdicao}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2 me-2"></i>
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
              )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluir && sessaoExcluindo && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white text-dark">
              <div className="modal-header border-0 pb-0">
                <h3 className="modal-title fw-bold text-danger">
                  <i className="bi bi-exclamation-triangle text-danger me-3"></i>
                  Confirmar Exclusão
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-icon btn-active-light-danger"
                  onClick={handleFecharModais}
                  disabled={isLoading}
                >
                  <i className="bi bi-x fs-2"></i>
                </button>
              </div>
              
              <div className="modal-body pt-0">
                <div className="text-center py-4">
                  {/* Ícone de alerta grande */}
                  <div className="symbol symbol-100px mx-auto mb-6">
                    <div className="symbol-label bg-light-danger">
                      <i className="bi bi-trash text-danger fs-1"></i>
                    </div>
                  </div>
                  
                  {/* Mensagem de confirmação */}
                  <h4 className="fw-bold text-gray-800 mb-4">
                    Tem certeza que deseja excluir esta sessão?
                  </h4>
                  
                  {/* Detalhes da sessão a ser excluída */}
                  <div className="bg-light-danger rounded p-4 mb-6">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <span className={`badge fs-6 fw-bold me-3 ${getTipoClass(sessaoExcluindo.tipo)}`}>
                        {getTipoText(sessaoExcluindo.tipo)}
                      </span>
                      <span className={`badge fs-6 fw-bold ${getStatusClass(sessaoExcluindo.status)}`}>
                        {getStatusText(sessaoExcluindo.status)}
                      </span>
                    </div>
                    
                    <h5 className="fw-bold text-gray-800 mb-2">{sessaoExcluindo.titulo}</h5>
                    
                    <div className="text-muted fs-6">
                      <i className="bi bi-calendar-event me-2"></i>
                      {formatarDataCompleta(sessaoExcluindo.data, sessaoExcluindo.hora)}
                    </div>
                    
                    <div className="text-muted fs-6 mt-1">
                      <i className="bi bi-geo-alt me-2"></i>
                      {sessaoExcluindo.local}
                    </div>
                  </div>
                  
                  {/* Aviso sobre a ação */}
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                    <div className="text-start">
                      <strong>Atenção!</strong> Esta ação não pode ser desfeita. 
                      Todos os dados relacionados a esta sessão serão permanentemente removidos.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-0 pt-0 justify-content-center">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  onClick={handleFecharModais}
                  disabled={isLoading}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmarExclusao}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Sim, Excluir Sessão
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos customizados avançados */}
      <style>{`
        /* === ANIMAÇÕES E TRANSIÇÕES === */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* === TABELA DESKTOP === */
        .sessoes-table {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .sessao-row {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .sessao-row:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .sortable-header {
          transition: all 0.2s ease;
          padding: 1rem 0.75rem;
        }
        
        .sortable-header:hover {
          background-color: #f1f3f6 !important;
          color: #3699ff !important;
        }
        
        .action-buttons .btn {
          transition: all 0.2s ease;
          margin: 0 2px;
        }
        
        .action-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        /* === CARDS MOBILE === */
        .sessoes-cards {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .sessao-card {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
          transition: all 0.3s ease;
          border: 1px solid #e4e6ea;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        
        .sessao-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #3699ff;
        }
        
        .sessao-card .card-body {
          position: relative;
        }
        
        .sessao-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3699ff, #06d6a0);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .sessao-card:hover::before {
          opacity: 1;
        }

        /* === ESTADOS VAZIOS === */
        .empty-state {
          animation: fadeInUp 0.8s ease-out;
          padding: 3rem 1rem;
        }
        
        .empty-state-icon i {
          font-size: 4rem;
          opacity: 0.6;
        }
        
        .empty-state-mobile .empty-state-icon i {
          font-size: 3rem;
          opacity: 0.6;
        }

        /* === BADGES APRIMORADOS === */
        .badge {
          letter-spacing: 0.5px;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600 !important;
        }

        /* === SYMBOLS E ÍCONES === */
        .symbol .symbol-label {
          transition: all 0.2s ease;
        }
        
        .symbol:hover .symbol-label {
          transform: scale(1.1);
        }

        /* === FILTROS APRIMORADOS === */
        .form-control:focus,
        .form-select:focus {
          border-color: #3699ff;
          box-shadow: 0 0 0 0.2rem rgba(54, 153, 255, 0.15);
        }

        /* === PAGINAÇÃO MODERNA === */
        .pagination .page-link {
          padding: 0.5rem 0.75rem;
          margin: 0 0.125rem;
          border-radius: 0.5rem;
          border: none;
          background-color: #f5f8fa;
          color: #7e8299;
          transition: all 0.2s ease;
        }
        
        .pagination .page-item.active .page-link {
          background-color: #3699ff;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(54, 153, 255, 0.3);
        }
        
        .pagination .page-link:hover {
          background-color: #e4e6ea;
          color: #3699ff;
          transform: translateY(-1px);
        }

        /* === RESPONSIVIDADE AVANÇADA === */
        @media (max-width: 1199.98px) {
          .action-buttons .btn {
            padding: 0.375rem 0.5rem;
          }
        }

        @media (max-width: 991.98px) {
          .sessao-card {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 767.98px) {
          .badge {
            padding: 0.375rem 0.5rem;
            font-size: 0.65rem;
          }
          
          .btn-group-sm .btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .pagination .page-link {
            padding: 0.375rem 0.5rem;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 575.98px) {
          .sessoes-cards .col-12 {
            padding: 0 0.5rem;
          }
          
          .sessao-card .card-body {
            padding: 1rem !important;
          }
          
          .symbol-35px {
            width: 30px !important;
            height: 30px !important;
          }
          
          .symbol-30px {
            width: 25px !important;
            height: 25px !important;
          }
        }

        /* === MICRO-INTERAÇÕES === */
        .text-hover-primary:hover {
          color: #3699ff !important;
          cursor: pointer;
        }
        
        .dropdown-toggle:hover {
          background-color: #e4e6ea !important;
        }
        
        .dropdown-item {
          transition: all 0.2s ease;
          padding: 0.5rem 1rem;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(4px);
        }

        /* === LOADING STATES === */
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        /* === SCROLL CUSTOMIZADO === */
        .table-responsive::-webkit-scrollbar {
          height: 8px;
        }
        
        .table-responsive::-webkit-scrollbar-track {
          background: #f1f3f6;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb {
          background: #c4c4c4;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* === ACESSIBILIDADE === */
        .btn:focus,
        .form-control:focus,
        .form-select:focus {
          outline: 2px solid #3699ff;
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* === MODAIS ESTILIZADOS === */
        .modal.show {
          animation: fadeInUp 0.3s ease-out;
        }
        
        .modal-content {
          border: none;
          border-radius: 0.75rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          background-color: #ffffff !important;
          color: #181c32 !important;
        }
        
        .modal-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
          padding: 1.5rem 2rem;
          color: #181c32 !important;
        }
        
        .modal-body {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
          background-color: #ffffff !important;
          color: #181c32 !important;
        }
        
        .modal-footer {
          padding: 1.5rem 2rem;
          background-color: #f8f9fa !important;
          color: #181c32 !important;
        }
        
        .modal-title {
          font-size: 1.25rem;
        }
        
        .modal-title i {
          font-size: 1.5rem;
        }
        
        /* === FORMULÁRIOS DOS MODAIS === */
        .modal .form-control,
        .modal .form-select,
        .modal .form-control-lg,
        .modal .form-select-lg {
          background-color: #ffffff !important;
          border-color: #e4e6ea !important;
          color: #181c32 !important;
        }
        
        .modal .form-control:focus,
        .modal .form-select:focus {
          border-color: #3699ff !important;
          box-shadow: 0 0 0 0.2rem rgba(54, 153, 255, 0.15) !important;
          background-color: #ffffff !important;
          color: #181c32 !important;
        }
        
        .modal .form-control-lg {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }
        
        .modal .form-select-lg {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }
        
        .modal .form-label {
          color: #7e8299 !important;
        }
        
        .modal .required::after {
          content: ' *';
          color: #f1416c;
          font-weight: bold;
        }
        
        /* === MODAL DE EXCLUSÃO === */
        .modal .bg-light-danger {
          background-color: #fff5f8 !important;
          border: 1px solid #fdd8e5 !important;
        }
        
        .modal .alert-danger {
          background-color: #fff5f8 !important;
          border-color: #f1416c !important;
          color: #a61e69 !important;
        }
        
        .modal .text-danger {
          color: #f1416c !important;
        }
        
        .modal .btn-danger {
          background-color: #f1416c !important;
          border-color: #f1416c !important;
          color: #ffffff !important;
        }
        
        .modal .btn-danger:hover {
          background-color: #d33b5c !important;
          border-color: #d33b5c !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(241, 65, 108, 0.3);
        }
        
        .modal .symbol-100px .symbol-label {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        
        /* === SÍMBOLOS NOS MODAIS === */
        .modal .symbol .symbol-label {
          transition: all 0.2s ease;
        }
        
        .modal .symbol:hover .symbol-label {
          transform: scale(1.05);
        }
        
        /* === RESPONSIVIDADE DOS MODAIS === */
        @media (max-width: 991.98px) {
          .modal-dialog.modal-xl {
            max-width: 95%;
            margin: 1rem auto;
          }
          
          .modal-dialog.modal-lg {
            max-width: 90%;
            margin: 1rem auto;
          }
          
          .modal-body {
            padding: 1.5rem;
          }
          
          .modal-header,
          .modal-footer {
            padding: 1rem 1.5rem;
          }
        }
        
        @media (max-width: 767.98px) {
          .modal-dialog {
            margin: 0.5rem;
            max-width: calc(100% - 1rem);
          }
          
          .modal-body {
            padding: 1rem;
            max-height: 60vh;
          }
          
          .modal-header,
          .modal-footer {
            padding: 1rem;
          }
          
          .modal-title {
            font-size: 1.1rem;
          }
          
          .modal .symbol-50px {
            width: 40px !important;
            height: 40px !important;
          }
          
          .modal .symbol-40px {
            width: 35px !important;
            height: 35px !important;
          }
        }
        
        @media (max-width: 575.98px) {
          .modal-body .row.g-6 {
            --bs-gutter-x: 1rem;
            --bs-gutter-y: 1rem;
          }
          
          .modal .col-md-6,
          .modal .col-md-8,
          .modal .col-md-4 {
            margin-bottom: 1rem;
          }
        }

        /* === FORÇAR TEMA CLARO NOS MODAIS === */
        .modal-content,
        .modal-content *,
        .modal-header,
        .modal-header *,
        .modal-body,
        .modal-body *,
        .modal-footer,
        .modal-footer * {
          color: #181c32 !important;
        }
        
        .modal-content .text-muted {
          color: #7e8299 !important;
        }
        
        .modal-content .text-gray-800 {
          color: #181c32 !important;
        }
        
        .modal-content .text-gray-600 {
          color: #7e8299 !important;
        }

        /* === TEMAS ESCUROS (APENAS PARA CARDS) === */
        @media (prefers-color-scheme: dark) {
          .sessao-card {
            background-color: #1e1e2d;
            border-color: #2d2d3a;
          }
          
          .empty-state-icon i {
            color: #7e8299 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ListaSessoes; 