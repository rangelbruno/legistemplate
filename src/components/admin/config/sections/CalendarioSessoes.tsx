'use client'

import React, { useState, useEffect } from 'react'

interface Sessao {
  id: string
  data: string
  tipo: 'ordinaria' | 'extraordinaria'
  horario: string
  descricao?: string
  local?: string
}

interface CalendarioSessoesProps {
  config: any
  onChange: () => void
}

export function CalendarioSessoes({ config, onChange }: CalendarioSessoesProps) {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [quickAddType, setQuickAddType] = useState<'ordinaria' | 'extraordinaria' | null>(null)
  
  const [formData, setFormData] = useState({
    data: '',
    tipo: 'ordinaria' as 'ordinaria' | 'extraordinaria',
    horario: '09:00',
    descricao: '',
    local: 'Plenário Principal'
  })

  // Templates pré-definidos para facilitar a criação
  const [templates] = useState([
    {
      id: 'ord-segunda',
      nome: 'Sessão Ordinária - Segunda-feira',
      tipo: 'ordinaria' as const,
      horario: '14:00',
      local: 'Plenário Principal',
      descricao: 'Sessão ordinária semanal'
    },
    {
      id: 'ord-terca',
      nome: 'Sessão Ordinária - Terça-feira',
      tipo: 'ordinaria' as const,
      horario: '09:00',
      local: 'Plenário Principal',
      descricao: 'Sessão ordinária semanal'
    },
    {
      id: 'ext-urgent',
      nome: 'Sessão Extraordinária - Urgente',
      tipo: 'extraordinaria' as const,
      horario: '10:00',
      local: 'Plenário Principal',
      descricao: 'Sessão extraordinária para assuntos urgentes'
    },
    {
      id: 'ext-orcamento',
      nome: 'Sessão Extraordinária - Orçamento',
      tipo: 'extraordinaria' as const,
      horario: '14:00',
      local: 'Plenário Principal',
      descricao: 'Sessão extraordinária para discussão orçamentária'
    }
  ])

  useEffect(() => {
    // Carregar sessões do localStorage ou do config
    const savedSessions = localStorage.getItem('calendar-sessions')
    if (savedSessions) {
      try {
        setSessoes(JSON.parse(savedSessions))
      } catch (error) {
        console.error('Erro ao carregar sessões do localStorage:', error)
      }
    } else if (config?.sessoes) {
      setSessoes(config.sessoes)
    }
  }, [config])

  // Funcões auxiliares para o calendário
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getSessoesForDate = (date: string) => {
    return sessoes.filter(sessao => sessao.data === date)
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateString = formatDate(clickedDate)
    setSelectedDate(dateString)
    
    // Verifica se já existe sessão nesta data
    const existingSessions = getSessoesForDate(dateString)
    
    if (existingSessions.length > 0) {
      // Se já tem sessões, abre o modal de templates/seleção rápida
      setShowTemplateModal(true)
    } else {
      // Se não tem sessões, abre modal de criação normal
      setFormData(prev => ({ ...prev, data: dateString }))
      setEditingSessao(null)
      setShowModal(true)
    }
  }

  // Função para criação rápida com template
  const handleQuickAdd = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template && selectedDate) {
      setFormData({
        data: selectedDate,
        tipo: template.tipo,
        horario: template.horario,
        descricao: template.descricao,
        local: template.local
      })
      setEditingSessao(null)
      setShowTemplateModal(false)
      setShowModal(true)
    }
  }

  // Função para criação rápida por tipo
  const handleQuickCreate = (tipo: 'ordinaria' | 'extraordinaria') => {
    const defaultTemplate = templates.find(t => t.tipo === tipo)
    if (defaultTemplate && selectedDate) {
      const newSessao: Sessao = {
        id: Date.now().toString(),
        data: selectedDate,
        tipo: defaultTemplate.tipo,
        horario: defaultTemplate.horario,
        descricao: defaultTemplate.descricao,
        local: defaultTemplate.local
      }

          const updatedSessoes = [...sessoes, newSessao]
    setSessoes(updatedSessoes)
    
    // Salvar no localStorage temporariamente
    localStorage.setItem('calendar-sessions', JSON.stringify(updatedSessoes))
    onChange()
    setShowTemplateModal(false)
    }
  }

  const handleSessaoClick = (sessao: Sessao) => {
    setEditingSessao(sessao)
    setFormData({
      data: sessao.data,
      tipo: sessao.tipo,
      horario: sessao.horario,
      descricao: sessao.descricao || '',
      local: sessao.local || 'Plenário Principal'
    })
    setShowModal(true)
  }

  // Função para verificar conflitos de horário
  const checkTimeConflict = (data: string, horario: string, excludeId?: string) => {
    const sessoesNaData = sessoes.filter(s => 
      s.data === data && 
      s.id !== excludeId
    )
    
    if (sessoesNaData.length === 0) return null

    const [hora, minuto] = horario.split(':').map(Number)
    const horarioMinutos = hora * 60 + minuto

    for (const sessao of sessoesNaData) {
      const [sessaoHora, sessaoMinuto] = sessao.horario.split(':').map(Number)
      const sessaoMinutos = sessaoHora * 60 + sessaoMinuto
      
      // Considera conflito se estiver dentro de 2 horas
      const diferenca = Math.abs(horarioMinutos - sessaoMinutos)
      if (diferenca < 120) { // 2 horas = 120 minutos
        return sessao
      }
    }
    
    return null
  }

  const handleSave = () => {
    if (!formData.data || !formData.horario) return

    // Verifica conflitos de horário
    const conflito = checkTimeConflict(formData.data, formData.horario, editingSessao?.id)
    
    if (conflito && !window.confirm(
      `⚠️ Atenção! Existe uma sessão ${conflito.tipo === 'ordinaria' ? 'ordinária' : 'extraordinária'} ` +
      `agendada para às ${conflito.horario} no mesmo dia.\n\n` +
      `Deseja continuar mesmo assim?`
    )) {
      return
    }

    const newSessao: Sessao = {
      id: editingSessao?.id || Date.now().toString(),
      data: formData.data,
      tipo: formData.tipo,
      horario: formData.horario,
      descricao: formData.descricao,
      local: formData.local
    }

    let updatedSessoes
    if (editingSessao) {
      updatedSessoes = sessoes.map(s => s.id === editingSessao.id ? newSessao : s)
    } else {
      updatedSessoes = [...sessoes, newSessao]
    }

    setSessoes(updatedSessoes)
    
    // Salvar no localStorage temporariamente
    localStorage.setItem('calendar-sessions', JSON.stringify(updatedSessoes))
    onChange()
    setShowModal(false)
    resetForm()
  }

  const handleDelete = (sessaoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão?')) {
      const updatedSessoes = sessoes.filter(s => s.id !== sessaoId)
      setSessoes(updatedSessoes)
      
      // Salvar no localStorage temporariamente
      localStorage.setItem('calendar-sessions', JSON.stringify(updatedSessoes))
      onChange()
      setShowModal(false)
    }
  }

  const resetForm = () => {
    setFormData({
      data: '',
      tipo: 'ordinaria',
      horario: '09:00',
      descricao: '',
      local: 'Plenário Principal'
    })
    setEditingSessao(null)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Dias vazios do início do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = formatDate(date)
      const sessoesDay = getSessoesForDate(dateString)
      const isToday = dateString === formatDate(new Date())

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${sessoesDay.length > 0 ? 'has-sessions' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {sessoesDay.length > 0 && (
            <div className="sessions-indicator">
              {sessoesDay.map(sessao => (
                <div
                  key={sessao.id}
                  className={`session-dot ${sessao.tipo}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSessaoClick(sessao)
                  }}
                  title={`${sessao.tipo === 'ordinaria' ? 'Ordinária' : 'Extraordinária'} - ${sessao.horario}`}
                />
              ))}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className="fw-bold text-gray-800">
            <i className="bi bi-calendar-event text-primary me-2"></i>
            Calendário de Sessões Legislativas
          </h3>
        </div>
        <div className="card-toolbar">
          {/* Versão Desktop */}
          <div className="d-none d-lg-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                const today = formatDate(new Date())
                setSelectedDate(today)
                handleQuickCreate('ordinaria')
              }}
              title="Criar Sessão Ordinária Hoje"
            >
              <i className="bi bi-calendar-check me-1"></i>
              Ordinária
            </button>

            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                const today = formatDate(new Date())
                setSelectedDate(today)
                handleQuickCreate('extraordinaria')
              }}
              title="Criar Sessão Extraordinária Hoje"
            >
              <i className="bi bi-calendar-plus me-1"></i>
              Extraordinária
            </button>

            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                setSelectedDate(formatDate(new Date()))
                setFormData(prev => ({ ...prev, data: formatDate(new Date()) }))
                setEditingSessao(null)
                setShowModal(true)
              }}
              title="Criar Sessão Personalizada"
            >
              <i className="bi bi-plus me-1"></i>
              Personalizada
            </button>
          </div>

          {/* Versão Tablet */}
          <div className="d-none d-md-flex d-lg-none gap-1">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                const today = formatDate(new Date())
                setSelectedDate(today)
                handleQuickCreate('ordinaria')
              }}
              title="Criar Sessão Ordinária"
            >
              <i className="bi bi-calendar-check me-1"></i>
              <span className="d-none d-xl-inline">Ordinária</span>
              <span className="d-xl-none">Ord</span>
            </button>

            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                const today = formatDate(new Date())
                setSelectedDate(today)
                handleQuickCreate('extraordinaria')
              }}
              title="Criar Sessão Extraordinária"
            >
              <i className="bi bi-calendar-plus me-1"></i>
              <span className="d-none d-xl-inline">Extraordinária</span>
              <span className="d-xl-none">Ext</span>
            </button>

            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                setSelectedDate(formatDate(new Date()))
                setFormData(prev => ({ ...prev, data: formatDate(new Date()) }))
                setEditingSessao(null)
                setShowModal(true)
              }}
              title="Criar Sessão Personalizada"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>

          {/* Versão Mobile */}
          <div className="d-flex d-md-none">
            <div className="dropdown">
              <button 
                className="btn btn-primary btn-sm dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                title="Criar Nova Sessão"
              >
                <i className="bi bi-plus-circle me-1"></i>
                <span className="d-none d-sm-inline">Nova</span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      const today = formatDate(new Date())
                      setSelectedDate(today)
                      handleQuickCreate('ordinaria')
                    }}
                  >
                    <i className="bi bi-calendar-check text-primary me-2"></i>
                    Sessão Ordinária
                  </a>
                </li>
                <li>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      const today = formatDate(new Date())
                      setSelectedDate(today)
                      handleQuickCreate('extraordinaria')
                    }}
                  >
                    <i className="bi bi-calendar-plus text-warning me-2"></i>
                    Sessão Extraordinária
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a 
                    className="dropdown-item" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedDate(formatDate(new Date()))
                      setFormData(prev => ({ ...prev, data: formatDate(new Date()) }))
                      setEditingSessao(null)
                      setShowModal(true)
                    }}
                  >
                    <i className="bi bi-gear text-secondary me-2"></i>
                    Personalizada
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        {/* Navegação do calendário */}
        <div className="d-flex justify-content-between align-items-center mb-7">
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigateMonth('prev')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <h4 className="fw-bold text-gray-800 mb-0">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigateMonth('next')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Legenda */}
        <div className="d-flex justify-content-center gap-5 mb-5">
          <div className="d-flex align-items-center">
            <div className="session-dot ordinaria me-2"></div>
            <span className="text-muted fs-7">Sessão Ordinária</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="session-dot extraordinaria me-2"></div>
            <span className="text-muted fs-7">Sessão Extraordinária</span>
          </div>
        </div>

        {/* Calendário */}
        <div className="calendar-container">
          {/* Cabeçalho dos dias da semana */}
          <div className="calendar-header">
            {weekDays.map(day => (
              <div key={day} className="week-day">{day}</div>
            ))}
          </div>
          
          {/* Grid do calendário */}
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        {/* Lista de sessões do mês */}
        <div className="mt-7">
          <h5 className="fw-bold text-gray-800 mb-4">
            Sessões de {monthNames[currentDate.getMonth()]}
          </h5>
          
          {sessoes
            .filter(sessao => {
              const sessaoDate = new Date(sessao.data)
              return (
                sessaoDate.getMonth() === currentDate.getMonth() &&
                sessaoDate.getFullYear() === currentDate.getFullYear()
              )
            })
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .map(sessao => (
              <div
                key={sessao.id}
                className="d-flex align-items-center bg-light rounded p-4 mb-3 cursor-pointer"
                onClick={() => handleSessaoClick(sessao)}
              >
                <div className={`session-dot ${sessao.tipo} me-3`}></div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <h6 className="fw-bold text-gray-800 mb-0 me-3">
                      {new Date(sessao.data).toLocaleDateString('pt-BR')} - {sessao.horario}
                    </h6>
                    <span className={`badge badge-light-${sessao.tipo === 'ordinaria' ? 'primary' : 'warning'} fs-7`}>
                      {sessao.tipo === 'ordinaria' ? 'Ordinária' : 'Extraordinária'}
                    </span>
                  </div>
                  {sessao.descricao && (
                    <p className="text-muted mb-1 fs-7">{sessao.descricao}</p>
                  )}
                  <p className="text-muted mb-0 fs-8">
                    <i className="bi bi-geo-alt me-1"></i>
                    {sessao.local}
                  </p>
                </div>
                <button
                  className="btn btn-light-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(sessao.id)
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          
          {sessoes.filter(sessao => {
            const sessaoDate = new Date(sessao.data)
            return (
              sessaoDate.getMonth() === currentDate.getMonth() &&
              sessaoDate.getFullYear() === currentDate.getFullYear()
            )
          }).length === 0 && (
            <div className="text-center py-5">
              <div className="symbol symbol-100px symbol-circle mx-auto mb-4 bg-light-primary">
                <div className="symbol-label">
                  <i className="bi bi-calendar-x fs-1 text-primary"></i>
                </div>
              </div>
              <p className="text-muted">Nenhuma sessão agendada para este mês</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição/Criação */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingSessao ? 'Editar Sessão' : 'Nova Sessão'}
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-5">
                  <div className="col-6">
                    <label className="required fw-semibold fs-6 mb-2">Data</label>
                    <input
                      type="date"
                      className="form-control form-control-solid"
                      value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    />
                  </div>
                  
                  <div className="col-6">
                    <label className="required fw-semibold fs-6 mb-2">Horário</label>
                    <input
                      type="time"
                      className={`form-control form-control-solid ${
                        formData.data && formData.horario && checkTimeConflict(formData.data, formData.horario, editingSessao?.id) 
                          ? 'border-warning' 
                          : ''
                      }`}
                      value={formData.horario}
                      onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                    />
                    {formData.data && formData.horario && checkTimeConflict(formData.data, formData.horario, editingSessao?.id) && (
                      <div className="form-text text-warning">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        ⚠️ Conflito de horário detectado com outra sessão
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="required fw-semibold fs-6 mb-2">Tipo de Sessão</label>
                    <select
                      className="form-select form-select-solid"
                      value={formData.tipo}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'ordinaria' | 'extraordinaria' }))}
                    >
                      <option value="ordinaria">Sessão Ordinária</option>
                      <option value="extraordinaria">Sessão Extraordinária</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="fw-semibold fs-6 mb-2">Local</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="Ex: Plenário Principal"
                      value={formData.local}
                      onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                    />
                  </div>

                  <div className="col-12">
                    <label className="fw-semibold fs-6 mb-2">Descrição/Observações</label>
                    <textarea
                      className="form-control form-control-solid"
                      rows={3}
                      placeholder="Observações sobre a sessão..."
                      value={formData.descricao}
                      onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                {editingSessao && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(editingSessao.id)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Excluir
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!formData.data || !formData.horario}
                >
                  <i className="bi bi-check me-2"></i>
                  {editingSessao ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção Rápida/Templates */}
      {showTemplateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="bi bi-calendar-plus text-primary me-2"></i>
                  Adicionar Sessão - {new Date(selectedDate).toLocaleDateString('pt-BR')}
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTemplateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Sessões já existentes nesta data */}
                {getSessoesForDate(selectedDate).length > 0 && (
                  <div className="mb-7">
                    <h5 className="fw-bold text-gray-800 mb-4">
                      <i className="bi bi-calendar-event me-2 text-info"></i>
                      Sessões já agendadas para esta data:
                    </h5>
                    <div className="row g-3 mb-5">
                      {getSessoesForDate(selectedDate).map(sessao => (
                        <div key={sessao.id} className="col-md-6">
                          <div className="card card-flush border border-gray-300">
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center">
                                <div className={`session-dot ${sessao.tipo} me-3`}></div>
                                <div>
                                  <h6 className="fw-bold text-gray-800 mb-1">
                                    {sessao.tipo === 'ordinaria' ? 'Ordinária' : 'Extraordinária'}
                                    <span className="text-muted fs-7 ms-2">{sessao.horario}</span>
                                  </h6>
                                  <p className="text-muted mb-0 fs-8">{sessao.local}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Criação rápida por tipo */}
                <div className="mb-8">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    <i className="bi bi-lightning me-2 text-warning"></i>
                    Criação Rápida
                  </h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div 
                        className="card card-flush hover-elevate-up cursor-pointer border-2 border-primary"
                        onClick={() => handleQuickCreate('ordinaria')}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        <div className="card-body text-center p-6">
                          <div className="symbol symbol-60px symbol-circle mx-auto mb-4 bg-light-primary">
                            <div className="symbol-label">
                              <i className="bi bi-calendar-check text-primary fs-1"></i>
                            </div>
                          </div>
                          <h4 className="fw-bold text-gray-800 mb-2">Sessão Ordinária</h4>
                          <p className="text-muted fs-7 mb-3">
                            Criar sessão ordinária com configurações padrão
                          </p>
                          <div className="d-flex justify-content-center gap-2">
                            <span className="badge badge-light-primary fs-8">⏰ 14:00</span>
                            <span className="badge badge-light-primary fs-8">📍 Plenário</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div 
                        className="card card-flush hover-elevate-up cursor-pointer border-2 border-warning"
                        onClick={() => handleQuickCreate('extraordinaria')}
                        style={{ transition: 'all 0.2s ease' }}
                      >
                        <div className="card-body text-center p-6">
                          <div className="symbol symbol-60px symbol-circle mx-auto mb-4 bg-light-warning">
                            <div className="symbol-label">
                              <i className="bi bi-calendar-plus text-warning fs-1"></i>
                            </div>
                          </div>
                          <h4 className="fw-bold text-gray-800 mb-2">Sessão Extraordinária</h4>
                          <p className="text-muted fs-7 mb-3">
                            Criar sessão extraordinária com configurações padrão
                          </p>
                          <div className="d-flex justify-content-center gap-2">
                            <span className="badge badge-light-warning fs-8">⏰ 10:00</span>
                            <span className="badge badge-light-warning fs-8">📍 Plenário</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Templates disponíveis */}
                <div className="mb-5">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    <i className="bi bi-layout-text-window-reverse me-2 text-info"></i>
                    Templates Disponíveis
                  </h5>
                  <div className="row g-3">
                    {templates.map(template => (
                      <div key={template.id} className="col-md-6">
                        <div 
                          className="card card-flush hover-elevate-up cursor-pointer border border-gray-300"
                          onClick={() => handleQuickAdd(template.id)}
                          style={{ transition: 'all 0.2s ease' }}
                        >
                          <div className="card-body p-4">
                            <div className="d-flex align-items-start">
                              <div className={`session-dot ${template.tipo} me-3 mt-1`}></div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-gray-800 mb-1">{template.nome}</h6>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                  <span className="text-muted fs-8">
                                    <i className="bi bi-clock me-1"></i>
                                    {template.horario}
                                  </span>
                                  <span className="text-muted fs-8">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {template.local}
                                  </span>
                                </div>
                                <p className="text-muted fs-8 mb-0">{template.descricao}</p>
                              </div>
                              <i className="bi bi-arrow-right text-primary"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, data: selectedDate }))
                    setEditingSessao(null)
                    setShowTemplateModal(false)
                    setShowModal(true)
                  }}
                >
                  <i className="bi bi-gear me-2"></i>
                  Personalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos do calendário */}
      <style>{`
        .calendar-container {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 1px;
        }
        
        .week-day {
          padding: 0.75rem;
          text-align: center;
          font-weight: 600;
          color: #6c757d;
          background-color: #f8f9fa;
          border-radius: 4px 4px 0 0;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background-color: #e9ecef;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          min-height: 80px;
        }
        
        .calendar-day:hover {
          background-color: #f8f9fa;
        }
        
        .calendar-day.empty {
          cursor: default;
          background-color: #f8f9fa;
        }
        
        .calendar-day.today {
          background-color: #e7f3ff;
          border: 2px solid #009ef7;
        }
        
        .calendar-day.has-sessions {
          background-color: #fff5f5;
        }
        
        .day-number {
          font-weight: 600;
          color: #3f4254;
          margin-bottom: 0.25rem;
        }
        
        .sessions-indicator {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          justify-content: center;
        }
        
        .session-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .session-dot.ordinaria {
          background-color: #009ef7;
        }
        
        .session-dot.extraordinaria {
          background-color: #f1c40f;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          background-color: #f1f1f2 !important;
        }

        /* Melhorias de UX */
        .hover-elevate-up:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

        .calendar-day:hover .day-number {
          color: #009ef7;
          font-weight: 700;
        }

        .calendar-day.has-sessions:hover {
          background-color: #f0f8ff;
          border: 1px solid #009ef7;
        }

        .session-dot:hover {
          transform: scale(1.2);
          transition: transform 0.2s ease;
        }

        /* Animações do modal */
        .modal.show {
          animation: fadeInModal 0.3s ease-out;
        }

        @keyframes fadeInModal {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Cards dos templates */
        .template-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .template-card:hover {
          border-color: #009ef7;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,158,247,0.15);
        }

        /* Indicadores visuais melhorados */
        .calendar-day.today .day-number {
          color: #009ef7;
          font-weight: 700;
          position: relative;
        }

        .calendar-day.today .day-number::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #009ef7;
          border-radius: 50%;
        }

        /* Tooltips melhorados */
        [title]:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #2a2a2a;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          margin-bottom: 5px;
        }

        /* Responsividade melhorada */
        @media (max-width: 768px) {
          .calendar-day {
            min-height: 60px;
            padding: 0.25rem;
          }
          
          .week-day {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
          
          .day-number {
            font-size: 0.875rem;
          }
          
          .session-dot {
            width: 8px;
            height: 8px;
          }

          /* Melhorias nos botões do cabeçalho */
          .card-toolbar .dropdown-toggle {
            min-height: 44px;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .card-toolbar .dropdown-menu {
            min-width: 200px;
          }

          .card-toolbar .dropdown-item {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .card-toolbar .dropdown-item i {
            width: 1.25rem;
          }
        }

        @media (min-width: 768px) and (max-width: 991.98px) {
          /* Tablet adjustments */
          .card-toolbar .btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.7rem;
          }
        }

        @media (min-width: 992px) {
          /* Desktop enhancements */
          .card-toolbar .btn {
            min-width: 110px;
            transition: all 0.3s ease;
          }

          .card-toolbar .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
        }

        /* Dropdown mobile específico */
        .dropdown-menu {
          border-radius: 0.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: none;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #495057;
        }

        .dropdown-item:focus {
          background-color: #e9ecef;
          color: #495057;
        }
      `}</style>
    </div>
  )
} 