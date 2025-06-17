'use client'

import React, { useState, useEffect } from 'react'
import { useConfig } from '../../../../context/ConfigContext'

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
  const { setConfiguration } = useConfig()
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editingSessao, setEditingSessao] = useState<Sessao | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  
  const [formData, setFormData] = useState({
    data: '',
    tipo: 'ordinaria' as 'ordinaria' | 'extraordinaria',
    horario: '09:00',
    descricao: '',
    local: 'Plenário Principal'
  })

  useEffect(() => {
    if (config?.sessoes) {
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
    setFormData(prev => ({ ...prev, data: dateString }))
    setEditingSessao(null)
    setShowModal(true)
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

  const handleSave = () => {
    if (!formData.data || !formData.horario) return

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
    setConfiguration('sessoes', updatedSessoes)
    onChange()
    setShowModal(false)
    resetForm()
  }

  const handleDelete = (sessaoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão?')) {
      const updatedSessoes = sessoes.filter(s => s.id !== sessaoId)
      setSessoes(updatedSessoes)
      setConfiguration('sessoes', updatedSessoes)
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
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setSelectedDate(formatDate(new Date()))
              setFormData(prev => ({ ...prev, data: formatDate(new Date()) }))
              setEditingSessao(null)
              setShowModal(true)
            }}
          >
            <i className="bi bi-plus fs-4 me-2"></i>
            Nova Sessão
          </button>
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
                      className="form-control form-control-solid"
                      value={formData.horario}
                      onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                    />
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
      `}</style>
    </div>
  )
} 