'use client'

import { DisableSidebar, PageTitle } from '../../../_metronic/layout/core'
import { KTIcon } from '../../../_metronic/helpers'
import { 
  UsersStatsWidget, 
  PropositionStatsWidget, 
  SessionStatsWidget 
} from '../../../components/admin/widgets/ParliamentaryWidget'
import { PropositionsTable } from '../../../components/admin/widgets/PropositionsTable'
import AdministradorLayout from '../layout'
import { useState } from 'react'

/**
 * Dashboard do Administrador - Sistema de Tramitação Parlamentar
 * 
 * Dashboard personalizado com métricas e informações relevantes
 * para administração de um sistema parlamentar
 */

// Componente para Atividades Recentes com Timeline
const RecentActivitiesWidget = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleRefresh = () => {
    setIsLoading(true)
    
    // Simula chamada de API para atualizar atividades
    setTimeout(() => {
      setIsLoading(false)
      // Aqui você adicionaria a lógica real de atualização das atividades
      console.log('Atividades recentes atualizadas!')
    }, 2000)
  }

  return (
    <div className='card card-xl-stretch mb-xl-8'>
      {/* CSS Keyframes inline */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .icon-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      {/* Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold mb-2 text-gray-900'>Atividades Recentes</span>
          <span className='text-muted fw-semibold fs-7'>156 ações hoje</span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            onClick={handleRefresh}
            disabled={isLoading}
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Atualizar atividades recentes'
          >
            <i className={`ki-duotone ki-arrows-circle fs-2 ${isLoading ? 'icon-spin' : ''}`}>
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        </div>
      </div>

      {/* Body com Timeline */}
      <div className={`card-body pt-5 position-relative ${isLoading ? 'opacity-50' : ''}`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div 
            className='d-flex justify-content-center align-items-center position-absolute w-100 h-100 bg-white' 
            style={{
              zIndex: 10, 
              top: 0, 
              left: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className='d-flex flex-column align-items-center'>
              <div className='spinner-border text-primary mb-3' role='status'>
                <span className='visually-hidden'>Carregando...</span>
              </div>
              <span className='text-muted fw-semibold'>Atualizando atividades...</span>
            </div>
          </div>
        )}
        
        <div className='timeline-label'>
          
          {/* Proposição cadastrada */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>08:42</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-primary fs-1'></i>
            </div>
            <div className='timeline-content fw-semibold text-gray-800 ps-3'>
              Nova proposição cadastrada: 
              <a href='#' className='text-primary ms-1'>PL 2024/001</a>
              por Vereador João Silva
            </div>
          </div>

          {/* Sessão aprovada */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>10:15</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-success fs-1'></i>
            </div>
            <div className='timeline-content d-flex'>
              <span className='fw-bold text-gray-800 ps-3'>
                Sessão Ordinária 15/12/2024 aprovada com 12 proposições
              </span>
            </div>
          </div>

          {/* Usuário cadastrado */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>11:30</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-warning fs-1'></i>
            </div>
            <div className='timeline-content fw-semibold text-gray-800 ps-3'>
              Novo usuário cadastrado: 
              <a href='#' className='text-primary ms-1'>Maria Santos</a>
              - Assessora Parlamentar
            </div>
          </div>

          {/* Tramitação atualizada */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>14:20</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-info fs-1'></i>
            </div>
            <div className='timeline-content fw-normal text-muted ps-3'>
              Tramitação atualizada para Comissão de Obras - REQ 2024/002
            </div>
          </div>

          {/* Relatório gerado */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>15:45</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-success fs-1'></i>
            </div>
            <div className='timeline-content fw-semibold text-gray-800 ps-3'>
              Relatório mensal gerado: 
              <a href='#' className='text-primary ms-1'>relatorio-dezembro-2024.pdf</a>
            </div>
          </div>

          {/* Requerimento respondido */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>16:30</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-primary fs-1'></i>
            </div>
            <div className='timeline-content fw-normal text-muted ps-3'>
              Requerimento respondido pelo Executivo Municipal sobre obras de mobilidade
            </div>
          </div>

          {/* Votação realizada */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>17:10</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-danger fs-1'></i>
            </div>
            <div className='timeline-content fw-semibold text-gray-800 ps-3'>
              Votação realizada: 
              <a href='#' className='text-primary ms-1'>PL 2024/003</a>
              - Aprovado por unanimidade
            </div>
          </div>

          {/* Backup do sistema */}
          <div className='timeline-item'>
            <div className='timeline-label fw-bold text-gray-800 fs-6'>18:00</div>
            <div className='timeline-badge'>
              <i className='fa fa-genderless text-success fs-1'></i>
            </div>
            <div className='timeline-content fw-normal text-muted ps-3'>
              Backup automático do sistema realizado com sucesso
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Componente para Estatísticas por Tipo - Novo Estilo
const PropositionTypesWidget = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleRefresh = () => {
    setIsLoading(true)
    
    // Simula chamada de API para atualizar dados
    setTimeout(() => {
      setIsLoading(false)
      // Aqui você adicionaria a lógica real de atualização dos dados
      console.log('Dados das proposições atualizados!')
    }, 2000)
  }

  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* CSS Keyframes inline */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .icon-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      {/* Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-gray-900'>Proposições por Tipo</h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            onClick={handleRefresh}
            disabled={isLoading}
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='Atualizar dados das proposições'
          >
            <i className={`ki-duotone ki-arrows-circle fs-2 ${isLoading ? 'icon-spin' : ''}`}>
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`card-body pt-0 position-relative ${isLoading ? 'opacity-50' : ''}`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div 
            className='d-flex justify-content-center align-items-center position-absolute w-100 h-100 bg-white' 
            style={{
              zIndex: 10, 
              top: 0, 
              left: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className='d-flex flex-column align-items-center'>
              <div className='spinner-border text-primary mb-3' role='status'>
                <span className='visually-hidden'>Carregando...</span>
              </div>
              <span className='text-muted fw-semibold'>Atualizando dados...</span>
            </div>
          </div>
        )}
        
        {/* Projetos de Lei */}
        <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
          <span className='text-primary me-5'>
            <KTIcon iconName='book' className='text-primary fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
              Projetos de Lei
            </a>
            <span className='text-muted fw-semibold d-block'>34 em tramitação</span>
          </div>
          <span className='fw-bold text-primary py-1 fs-4'>34</span>
        </div>

        {/* Requerimentos */}
        <div className='d-flex align-items-center bg-light-success rounded p-5 mb-7'>
          <span className='text-success me-5'>
            <KTIcon iconName='questionnaire-tablet' className='text-success fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
              Requerimentos
            </a>
            <span className='text-muted fw-semibold d-block'>18 pendentes de resposta</span>
          </div>
          <span className='fw-bold text-success py-1 fs-4'>18</span>
        </div>

        {/* Indicações */}
        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'>
          <span className='text-warning me-5'>
            <KTIcon iconName='arrow-up-right' className='text-warning fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
              Indicações
            </a>
            <span className='text-muted fw-semibold d-block'>12 aguardando execução</span>
          </div>
          <span className='fw-bold text-warning py-1 fs-4'>12</span>
        </div>

        {/* Moções */}
        <div className='d-flex align-items-center bg-light-info rounded p-5'>
          <span className='text-info me-5'>
            <KTIcon iconName='notepad' className='text-info fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
              Moções
            </a>
            <span className='text-muted fw-semibold d-block'>8 aprovadas este mês</span>
          </div>
          <span className='fw-bold text-info py-1 fs-4'>8</span>
        </div>

      </div>
    </div>
  )
}

const AdminDashboardContent = () => (
  <>
    {/* Métricas Principais - Cards com Gráficos */}
    <div className='row gy-5 g-xl-10'>
      
      {/* Widget de Usuários Ativos */}
      <div className='col-xl-4'>
        <UsersStatsWidget
          className='card-xl-stretch mb-xl-10'
          userCount={1247}
          chartHeight="100px"
        />
      </div>

      {/* Widget de Proposições Ativas */}
      <div className='col-xl-4'>
        <PropositionStatsWidget
          className='card-xl-stretch mb-xl-10'
          propositionCount={89}
          chartHeight="100px"
        />
      </div>

      {/* Widget de Sessões Plenárias */}
      <div className='col-xl-4'>
        <SessionStatsWidget
          className='card-xl-stretch mb-xl-10'
          sessionCount={24}
          period="este ano"
          chartHeight="100px"
        />
      </div>
    </div>

    {/* Tabela Principal - Proposições Recentes */}
    <PropositionsTable className='mb-5 mb-xl-10' />

    {/* Seção Inferior - Widgets Laterais */}
    <div className='row gy-5 g-xl-10'>
      
      {/* Atividades Recentes */}
      <div className='col-xxl-6'>
        <RecentActivitiesWidget />
      </div>

      {/* Estatísticas por Categoria */}
      <div className='col-xxl-6'>
        <PropositionTypesWidget />
      </div>
    </div>
  </>
)

export default function AdminDashboardPage() {
  return (
    <AdministradorLayout>
      <DisableSidebar>
        <PageTitle 
          breadcrumbs={[
            { title: 'Administração', path: '/admin', isSeparator: false, isActive: false }
          ]}
        >
          Dashboard Administrativo
        </PageTitle>
        <AdminDashboardContent />
      </DisableSidebar>
    </AdministradorLayout>
  )
} 