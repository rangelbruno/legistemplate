'use client'

import React, { useState, useEffect } from 'react'
import { SmartTemplate, EditableField, processTemplate } from './smart-templates'

interface SmartTemplateFormProps {
  template: SmartTemplate
  onComplete: (html: string, values: Record<string, any>) => void
  onCancel: () => void
}

export default function SmartTemplateForm({ template, onComplete, onCancel }: SmartTemplateFormProps) {
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lists, setLists] = useState<Record<string, string[]>>({})

  // Inicializar valores padrão
  useEffect(() => {
    const initialValues: Record<string, any> = {}
    const initialLists: Record<string, string[]> = {}

    template.fields.forEach(field => {
      if (field.type === 'list') {
        initialLists[field.id] = []
        initialValues[field.id] = []
      } else {
        initialValues[field.id] = field.defaultValue || ''
      }
    })

    setValues(initialValues)
    setLists(initialLists)
  }, [template])

  const handleInputChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    
    // Limpar erro quando campo é preenchido
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const handleListAdd = (fieldId: string, newValue: string) => {
    if (newValue.trim()) {
      const newList = [...(lists[fieldId] || []), newValue.trim()]
      setLists(prev => ({ ...prev, [fieldId]: newList }))
      setValues(prev => ({ ...prev, [fieldId]: newList }))
    }
  }

  const handleListRemove = (fieldId: string, index: number) => {
    const newList = lists[fieldId].filter((_, i) => i !== index)
    setLists(prev => ({ ...prev, [fieldId]: newList }))
    setValues(prev => ({ ...prev, [fieldId]: newList }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    template.fields.forEach(field => {
      if (field.required) {
        const value = values[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} é obrigatório`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const html = processTemplate(template, values)
      onComplete(html, values)
    }
  }

  const renderField = (field: EditableField) => {
    const fieldValue = values[field.id] || ''
    const hasError = !!errors[field.id]

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.id} className="mb-5">
            <label className="form-label fw-semibold">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <input
              type={field.type}
              className={`form-control ${hasError ? 'is-invalid' : ''}`}
              placeholder={field.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {hasError && <div className="invalid-feedback">{errors[field.id]}</div>}
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="mb-5">
            <label className="form-label fw-semibold">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="date"
              className={`form-control ${hasError ? 'is-invalid' : ''}`}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {hasError && <div className="invalid-feedback">{errors[field.id]}</div>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="mb-5">
            <label className="form-label fw-semibold">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <select
              className={`form-select ${hasError ? 'is-invalid' : ''}`}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <div className="invalid-feedback">{errors[field.id]}</div>}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="mb-5">
            <label className="form-label fw-semibold">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            <textarea
              className={`form-control ${hasError ? 'is-invalid' : ''}`}
              rows={4}
              placeholder={field.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {hasError && <div className="invalid-feedback">{errors[field.id]}</div>}
          </div>
        )

      case 'list':
        return (
          <div key={field.id} className="mb-5">
            <label className="form-label fw-semibold">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            
            {/* Input para adicionar itens */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={field.placeholder}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.target as HTMLInputElement
                    handleListAdd(field.id, input.value)
                    input.value = ''
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={(e) => {
                  const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                  handleListAdd(field.id, input.value)
                  input.value = ''
                }}
              >
                <i className="ki-duotone ki-plus fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </button>
            </div>

            {/* Lista de itens adicionados */}
            <div className="border rounded p-3 bg-light-primary">
              {lists[field.id]?.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {lists[field.id].map((item, index) => (
                    <span key={index} className="badge badge-primary fs-6 d-flex align-items-center">
                      {item}
                      <button
                        type="button"
                        className="btn btn-sm btn-icon ms-2"
                        onClick={() => handleListRemove(field.id, index)}
                        style={{ padding: '0', width: '16px', height: '16px' }}
                      >
                        <i className="ki-duotone ki-cross fs-4 text-white">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0 fs-7">Nenhum item adicionado</p>
              )}
            </div>
            
            {hasError && <div className="text-danger fs-7 mt-1">{errors[field.id]}</div>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              <i className="ki-duotone ki-document fs-2 me-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              {template.nome}
            </h2>
            <button
              type="button"
              className="btn btn-icon btn-sm btn-active-light-primary"
              onClick={onCancel}
            >
              <i className="ki-duotone ki-cross fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </button>
          </div>

          <div className="modal-body">
            <div className="alert alert-info d-flex align-items-center mb-7">
              <i className="ki-duotone ki-information-4 fs-2 me-3">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              <div>
                <h4 className="alert-heading">Como funciona</h4>
                <p className="mb-0">
                  Preencha os campos abaixo e o documento será gerado automaticamente com a estrutura correta. 
                  Campos marcados com <span className="text-danger">*</span> são obrigatórios.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <h3 className="fs-4 fw-bold mb-5">Informações Básicas</h3>
                  {template.fields.slice(0, Math.ceil(template.fields.length / 2)).map(renderField)}
                </div>
                <div className="col-lg-6">
                  <h3 className="fs-4 fw-bold mb-5">Conteúdo do Documento</h3>
                  {template.fields.slice(Math.ceil(template.fields.length / 2)).map(renderField)}
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              onClick={onCancel}
            >
              <i className="ki-duotone ki-cross fs-2 me-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              <i className="ki-duotone ki-check fs-2 me-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Gerar Documento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 