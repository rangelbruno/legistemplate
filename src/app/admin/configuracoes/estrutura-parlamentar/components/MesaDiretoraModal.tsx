'use client'

import { useState, useEffect } from 'react'
import { 
  type ParlamentarInfo,
  type MesaDiretora
} from '../../../../../services/estrutura-parlamentar.service'

interface MesaDiretoraModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (mesaDiretora: Omit<MesaDiretora, 'id'>) => Promise<void>
  mesaDiretoraAtual?: MesaDiretora | null
  vereadores: ParlamentarInfo[]
}

interface MesaDiretoraForm {
  presidenteId: string
  vicePrimeiroId: string
  viceSegundoId: string
  primeiroSecretarioId: string
  segundoSecretarioId: string
  terceiroSecretarioId: string
  quartoSecretarioId: string
  dataPosse: string
  mandatoInicio: string
  mandatoFim: string
}

export default function MesaDiretoraModal({
  isOpen,
  onClose,
  onSave,
  mesaDiretoraAtual,
  vereadores
}: MesaDiretoraModalProps) {
  const [form, setForm] = useState<MesaDiretoraForm>({
    presidenteId: '',
    vicePrimeiroId: '',
    viceSegundoId: '',
    primeiroSecretarioId: '',
    segundoSecretarioId: '',
    terceiroSecretarioId: '',
    quartoSecretarioId: '',
    dataPosse: '',
    mandatoInicio: '',
    mandatoFim: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<MesaDiretoraForm>>({})

  // Preencher formulário com dados existentes
  useEffect(() => {
    if (mesaDiretoraAtual) {
      setForm({
        presidenteId: mesaDiretoraAtual.presidente.id,
        vicePrimeiroId: mesaDiretoraAtual.vicePrimeiro?.id || '',
        viceSegundoId: mesaDiretoraAtual.viceSegundo?.id || '',
        primeiroSecretarioId: mesaDiretoraAtual.primeiroSecretario?.id || '',
        segundoSecretarioId: mesaDiretoraAtual.segundoSecretario?.id || '',
        terceiroSecretarioId: mesaDiretoraAtual.terceiroSecretario?.id || '',
        quartoSecretarioId: mesaDiretoraAtual.quartoSecretario?.id || '',
        dataPosse: mesaDiretoraAtual.dataPosse.split('T')[0],
        mandatoInicio: mesaDiretoraAtual.mandatoInicio.split('T')[0],
        mandatoFim: mesaDiretoraAtual.mandatoFim.split('T')[0]
      })
    } else {
      // Valores padrão para nova mesa diretora
      const hoje = new Date().toISOString().split('T')[0]
      const fimMandato = new Date()
      fimMandato.setFullYear(fimMandato.getFullYear() + 2)
      
      setForm({
        presidenteId: '',
        vicePrimeiroId: '',
        viceSegundoId: '',
        primeiroSecretarioId: '',
        segundoSecretarioId: '',
        terceiroSecretarioId: '',
        quartoSecretarioId: '',
        dataPosse: hoje,
        mandatoInicio: hoje,
        mandatoFim: fimMandato.toISOString().split('T')[0]
      })
    }
  }, [mesaDiretoraAtual, isOpen])

  const handleChange = (field: keyof MesaDiretoraForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo ao alterar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<MesaDiretoraForm> = {}

    // Presidente é obrigatório
    if (!form.presidenteId) {
      newErrors.presidenteId = 'Presidente é obrigatório'
    }

    // Datas são obrigatórias
    if (!form.dataPosse) {
      newErrors.dataPosse = 'Data de posse é obrigatória'
    }
    if (!form.mandatoInicio) {
      newErrors.mandatoInicio = 'Data de início do mandato é obrigatória'
    }
    if (!form.mandatoFim) {
      newErrors.mandatoFim = 'Data de fim do mandato é obrigatória'
    }

    // Validar se as datas fazem sentido
    if (form.mandatoInicio && form.mandatoFim) {
      if (new Date(form.mandatoInicio) >= new Date(form.mandatoFim)) {
        newErrors.mandatoFim = 'Data de fim deve ser posterior ao início'
      }
    }

    // Verificar se não há vereadores duplicados
    const cargosPreenchidos = [
      form.presidenteId,
      form.vicePrimeiroId,
      form.viceSegundoId,
      form.primeiroSecretarioId,
      form.segundoSecretarioId,
      form.terceiroSecretarioId,
      form.quartoSecretarioId
    ].filter(id => id !== '')

    const duplicados = cargosPreenchidos.filter((id, index) => 
      cargosPreenchidos.indexOf(id) !== index
    )

    if (duplicados.length > 0) {
      newErrors.presidenteId = 'Não é possível ter o mesmo vereador em múltiplos cargos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Buscar dados dos vereadores selecionados
      const findVereador = (id: string) => vereadores.find(v => v.id === id)

      const presidente = findVereador(form.presidenteId)
      if (!presidente) {
        throw new Error('Presidente não encontrado')
      }

      const mesaDiretoraDados: Omit<MesaDiretora, 'id'> = {
        presidente,
        vicePrimeiro: form.vicePrimeiroId ? findVereador(form.vicePrimeiroId) : undefined,
        viceSegundo: form.viceSegundoId ? findVereador(form.viceSegundoId) : undefined,
        primeiroSecretario: form.primeiroSecretarioId ? findVereador(form.primeiroSecretarioId) : undefined,
        segundoSecretario: form.segundoSecretarioId ? findVereador(form.segundoSecretarioId) : undefined,
        terceiroSecretario: form.terceiroSecretarioId ? findVereador(form.terceiroSecretarioId) : undefined,
        quartoSecretario: form.quartoSecretarioId ? findVereador(form.quartoSecretarioId) : undefined,
        dataPosse: form.dataPosse,
        mandatoInicio: form.mandatoInicio,
        mandatoFim: form.mandatoFim
      }

      await onSave(mesaDiretoraDados)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar Mesa Diretora:', error)
      alert('Erro ao salvar Mesa Diretora. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              <i className="ki-duotone ki-crown fs-1 text-warning me-3">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              {mesaDiretoraAtual ? 'Editar Mesa Diretora' : 'Configurar Mesa Diretora'}
            </h2>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-6">
                {/* Presidente - Campo obrigatório */}
                <div className="col-md-6">
                  <div className="fv-row">
                    <label className="required form-label">
                      <i className="ki-duotone ki-crown fs-3 text-warning me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Presidente da Câmara
                    </label>
                    <select
                      className={`form-select ${errors.presidenteId ? 'is-invalid' : ''}`}
                      value={form.presidenteId}
                      onChange={(e) => handleChange('presidenteId', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Selecione o Presidente</option>
                      {vereadores.map(vereador => (
                        <option key={vereador.id} value={vereador.id}>
                          {vereador.nome} ({vereador.partido.sigla})
                        </option>
                      ))}
                    </select>
                    {errors.presidenteId && (
                      <div className="invalid-feedback">{errors.presidenteId}</div>
                    )}
                  </div>
                </div>

                {/* 1º Vice-Presidente */}
                <div className="col-md-6">
                  <div className="fv-row">
                    <label className="form-label">
                      <i className="ki-duotone ki-user-tick fs-3 text-primary me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      1º Vice-Presidente
                    </label>
                    <select
                      className="form-select"
                      value={form.vicePrimeiroId}
                      onChange={(e) => handleChange('vicePrimeiroId', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Selecione o Vice-Presidente</option>
                      {vereadores.map(vereador => (
                        <option key={vereador.id} value={vereador.id}>
                          {vereador.nome} ({vereador.partido.sigla})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2º Vice-Presidente */}
                <div className="col-md-6">
                  <div className="fv-row">
                    <label className="form-label">
                      <i className="ki-duotone ki-user fs-3 text-info me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      2º Vice-Presidente
                    </label>
                    <select
                      className="form-select"
                      value={form.viceSegundoId}
                      onChange={(e) => handleChange('viceSegundoId', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Selecione o Vice-Presidente</option>
                      {vereadores.map(vereador => (
                        <option key={vereador.id} value={vereador.id}>
                          {vereador.nome} ({vereador.partido.sigla})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 1º Secretário */}
                <div className="col-md-6">
                  <div className="fv-row">
                    <label className="form-label">
                      <i className="ki-duotone ki-document fs-3 text-success me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      1º Secretário
                    </label>
                    <select
                      className="form-select"
                      value={form.primeiroSecretarioId}
                      onChange={(e) => handleChange('primeiroSecretarioId', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Selecione o Secretário</option>
                      {vereadores.map(vereador => (
                        <option key={vereador.id} value={vereador.id}>
                          {vereador.nome} ({vereador.partido.sigla})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Secretários menores em uma linha */}
                <div className="col-12">
                  <div className="separator my-4"></div>
                  <h5 className="text-gray-800 fw-bold mb-4">
                    <i className="ki-duotone ki-document fs-2 text-secondary me-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    Demais Secretários
                  </h5>
                  <div className="row g-4">
                    {/* 2º Secretário */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="form-label">2º Secretário</label>
                        <select
                          className="form-select"
                          value={form.segundoSecretarioId}
                          onChange={(e) => handleChange('segundoSecretarioId', e.target.value)}
                          disabled={loading}
                        >
                          <option value="">Selecione</option>
                          {vereadores.map(vereador => (
                            <option key={vereador.id} value={vereador.id}>
                              {vereador.nome} ({vereador.partido.sigla})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 3º Secretário */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="form-label">3º Secretário</label>
                        <select
                          className="form-select"
                          value={form.terceiroSecretarioId}
                          onChange={(e) => handleChange('terceiroSecretarioId', e.target.value)}
                          disabled={loading}
                        >
                          <option value="">Selecione</option>
                          {vereadores.map(vereador => (
                            <option key={vereador.id} value={vereador.id}>
                              {vereador.nome} ({vereador.partido.sigla})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 4º Secretário */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="form-label">4º Secretário</label>
                        <select
                          className="form-select"
                          value={form.quartoSecretarioId}
                          onChange={(e) => handleChange('quartoSecretarioId', e.target.value)}
                          disabled={loading}
                        >
                          <option value="">Selecione</option>
                          {vereadores.map(vereador => (
                            <option key={vereador.id} value={vereador.id}>
                              {vereador.nome} ({vereador.partido.sigla})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Datas */}
                <div className="col-12">
                  <div className="separator my-4"></div>
                  <h5 className="text-gray-800 fw-bold mb-4">
                    <i className="ki-duotone ki-calendar fs-2 text-primary me-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    Datas do Mandato
                  </h5>
                  <div className="row g-4">
                    {/* Data de Posse */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="required form-label">Data de Posse</label>
                        <input
                          type="date"
                          className={`form-control ${errors.dataPosse ? 'is-invalid' : ''}`}
                          value={form.dataPosse}
                          onChange={(e) => handleChange('dataPosse', e.target.value)}
                          disabled={loading}
                        />
                        {errors.dataPosse && (
                          <div className="invalid-feedback">{errors.dataPosse}</div>
                        )}
                      </div>
                    </div>

                    {/* Início do Mandato */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="required form-label">Início do Mandato</label>
                        <input
                          type="date"
                          className={`form-control ${errors.mandatoInicio ? 'is-invalid' : ''}`}
                          value={form.mandatoInicio}
                          onChange={(e) => handleChange('mandatoInicio', e.target.value)}
                          disabled={loading}
                        />
                        {errors.mandatoInicio && (
                          <div className="invalid-feedback">{errors.mandatoInicio}</div>
                        )}
                      </div>
                    </div>

                    {/* Fim do Mandato */}
                    <div className="col-md-4">
                      <div className="fv-row">
                        <label className="required form-label">Fim do Mandato</label>
                        <input
                          type="date"
                          className={`form-control ${errors.mandatoFim ? 'is-invalid' : ''}`}
                          value={form.mandatoFim}
                          onChange={(e) => handleChange('mandatoFim', e.target.value)}
                          disabled={loading}
                        />
                        {errors.mandatoFim && (
                          <div className="invalid-feedback">{errors.mandatoFim}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-light" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="ki-duotone ki-check fs-2"></i>
                    {mesaDiretoraAtual ? 'Atualizar Mesa Diretora' : 'Criar Mesa Diretora'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 