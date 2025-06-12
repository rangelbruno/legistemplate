import React from 'react'
import { KTIcon } from '../../../_metronic/helpers'

// Tipos para as proposições
type PropositionStatus = 'Em Tramitação' | 'Aprovada' | 'Rejeitada' | 'Arquivada' | 'Pendente'
type PropositionType = 'PL' | 'REQ' | 'IND' | 'MOC'

interface Proposition {
  id: string
  number: string
  year: number
  type: PropositionType
  title: string
  author: string
  status: PropositionStatus
  createdAt: string
  lastUpdate: string
}

type Props = {
  className?: string
  propositions?: Proposition[]
}

// Dados mockados para demonstração
const mockPropositions: Proposition[] = [
  {
    id: '1',
    number: '001',
    year: 2024,
    type: 'PL',
    title: 'Dispõe sobre a criação do Programa Municipal de Sustentabilidade Ambiental',
    author: 'Vereador João Silva',
    status: 'Em Tramitação',
    createdAt: '2024-12-12',
    lastUpdate: '2024-12-15'
  },
  {
    id: '2',
    number: '002',
    year: 2024,
    type: 'REQ',
    title: 'Solicita informações sobre obras de mobilidade urbana no centro da cidade',
    author: 'Vereadora Maria Santos',
    status: 'Pendente',
    createdAt: '2024-12-10',
    lastUpdate: '2024-12-10'
  },
  {
    id: '3',
    number: '003',
    year: 2024,
    type: 'PL',
    title: 'Institui o Programa de Apoio aos Microempreendedores Individuais',
    author: 'Vereador Carlos Oliveira',
    status: 'Aprovada',
    createdAt: '2024-12-08',
    lastUpdate: '2024-12-14'
  },
  {
    id: '4',
    number: '004',
    year: 2024,
    type: 'IND',
    title: 'Indica a necessidade de melhoria na iluminação pública do bairro São José',
    author: 'Vereadora Ana Costa',
    status: 'Em Tramitação',
    createdAt: '2024-12-05',
    lastUpdate: '2024-12-12'
  },
  {
    id: '5',
    number: '005',
    year: 2024,
    type: 'MOC',
    title: 'Moção de apoio aos profissionais da educação municipal',
    author: 'Vereador Roberto Lima',
    status: 'Aprovada',
    createdAt: '2024-12-03',
    lastUpdate: '2024-12-11'
  }
]

const getStatusBadgeClass = (status: PropositionStatus): string => {
  switch (status) {
    case 'Em Tramitação':
      return 'badge-light-primary'
    case 'Aprovada':
      return 'badge-light-success'
    case 'Rejeitada':
      return 'badge-light-danger'
    case 'Arquivada':
      return 'badge-light-secondary'
    case 'Pendente':
      return 'badge-light-warning'
    default:
      return 'badge-light-secondary'
  }
}

const getTypeIcon = (type: PropositionType): string => {
  switch (type) {
    case 'PL':
      return 'book'
    case 'REQ':
      return 'questionnaire-tablet'
    case 'IND':
      return 'arrow-up-right'
    case 'MOC':
      return 'notepad'
    default:
      return 'document'
  }
}

const getTypeDescription = (type: PropositionType): string => {
  switch (type) {
    case 'PL':
      return 'Projeto de Lei'
    case 'REQ':
      return 'Requerimento'
    case 'IND':
      return 'Indicação'
    case 'MOC':
      return 'Moção'
    default:
      return 'Documento'
  }
}

export const PropositionsTable: React.FC<Props> = ({ 
  className = '', 
  propositions = mockPropositions 
}) => {
  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Proposições Recentes</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Últimas {propositions.length} proposições cadastradas no sistema
          </span>
        </h3>
      </div>

      {/* Body */}
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* Table Head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      data-kt-check='true'
                      data-kt-check-target='.proposition-check'
                    />
                  </div>
                </th>
                <th className='min-w-120px'>Identificação</th>
                <th className='min-w-300px'>Ementa</th>
                <th className='min-w-140px'>Autor</th>
                <th className='min-w-100px'>Status</th>
                <th className='min-w-100px'>Atualização</th>
                <th className='min-w-100px text-end'>Ações</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {propositions.map((proposition) => (
                <tr key={proposition.id}>
                  <td>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input 
                        className='form-check-input proposition-check' 
                        type='checkbox' 
                        value={proposition.id} 
                      />
                    </div>
                  </td>

                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-40px me-3'>
                        <span className='symbol-label bg-light-primary'>
                          <KTIcon 
                            iconName={getTypeIcon(proposition.type)} 
                            className='fs-2 text-primary' 
                          />
                        </span>
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <span className='text-gray-900 fw-bold fs-6'>
                          {proposition.type} {proposition.year}/{proposition.number}
                        </span>
                        <span className='text-muted fw-semibold fs-7'>
                          {getTypeDescription(proposition.type)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className='d-flex flex-column'>
                      <span className='text-gray-900 fw-bold fs-6 mb-1'>
                        {proposition.title.length > 60 
                          ? `${proposition.title.substring(0, 60)}...` 
                          : proposition.title
                        }
                      </span>
                      <span className='text-muted fw-semibold fs-7'>
                        Criada em {new Date(proposition.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className='text-gray-900 fw-bold d-block fs-6'>
                      {proposition.author}
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${getStatusBadgeClass(proposition.status)} fw-bold`}>
                      {proposition.status}
                    </span>
                  </td>

                  <td>
                    <span className='text-gray-900 fw-semibold d-block fs-7'>
                      {new Date(proposition.lastUpdate).toLocaleDateString('pt-BR')}
                    </span>
                  </td>

                  <td>
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        data-bs-toggle='tooltip'
                        data-bs-placement='top'
                        title='Visualizar detalhes'
                      >
                        <KTIcon iconName='eye' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        data-bs-toggle='tooltip'
                        data-bs-placement='top'
                        title='Editar proposição'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                        data-bs-toggle='tooltip'
                        data-bs-placement='top' 
                        title='Tramitar proposição'
                      >
                        <KTIcon iconName='arrow-right' className='fs-3' />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination ou Load More */}
        <div className='d-flex justify-content-between align-items-center pt-3'>
          <div className='text-muted fw-semibold fs-7'>
            Mostrando {propositions.length} de {propositions.length} proposições
          </div>
          <div>
            <a href='#' className='btn btn-sm btn-light-primary'>
              Ver Todas as Proposições
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 