import React from 'react'
import {Link} from 'react-router-dom'
import {KTIcon} from '../../../helpers'

const HelpDrawer = () => {
  return (
    <div
      id='kt_help'
      className='bg-body'
      data-kt-drawer='true'
      data-kt-drawer-name='help'
      data-kt-drawer-activate='true'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'350px', 'md': '525px'}"
      data-kt-drawer-direction='end'
      data-kt-drawer-toggle='#kt_help_toggle'
      data-kt-drawer-close='#kt_help_close'
    >
      {/* begin::Card */}
      <div className='card shadow-none rounded-0 w-100'>
        {/* begin::Header */}
        <div className='card-header' id='kt_help_header'>
          <h5 className='card-title fw-bold text-gray-600'>Ajuda do Sistema</h5>

          <div className='card-toolbar'>
            <button
              type='button'
              className='btn btn-sm btn-icon explore-btn-dismiss me-n5'
              id='kt_help_close'
            >
              <KTIcon iconName='cross' className='fs-2' />
            </button>
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className='card-body' id='kt_help_body'>
          {/* begin::Content */}
          <div
            id='kt_help_scroll'
            className='hover-scroll-overlay-y'
            data-kt-scroll='true'
            data-kt-scroll-height='auto'
            data-kt-scroll-wrappers='#kt_help_body'
            data-kt-scroll-dependencies='#kt_help_header'
            data-kt-scroll-offset='5px'
          >
            {/* begin::Support */}
            <div className='rounded border border-dashed border-gray-300 p-6 p-lg-8 mb-10'>
              {/* begin::Heading */}
              <h2 className='fw-bolder mb-5'>
                Portal de Transparência{' '}
                <span className='text-primary'>
                  Legislativa
                </span>
              </h2>
              {/* end::Heading */}

              {/* begin::Description */}
              <div className='fs-5 fw-bold mb-5'>
                <span className='text-gray-500'>
                  Sistema dedicado à transparência e acompanhamento das atividades legislativas.
                </span>
              </div>
              {/* end::Description */}

              {/* begin::Link */}
              <div className='btn btn-lg btn-primary w-100 cursor-default'>
                Bem-vindo ao Sistema
              </div>
              {/* end::Link */}
            </div>
            {/* end::Support */}

            {/* begin::Link */}
            <div className='d-flex align-items-center mb-7'>
              {/* begin::Icon */}
              <div className='d-flex flex-center w-50px h-50px w-lg-75px h-lg-75px flex-shrink-0 rounded bg-light-warning'>
                <KTIcon iconName='book-open' className='text-warning fs-2x text-lg-3x' />
              </div>
              {/* end::Icon */}
              {/* begin::Info */}
              <div className='d-flex flex-stack flex-grow-1 ms-4 ms-lg-6'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column me-2 me-lg-5'>
                  {/* begin::Title */}
                  <div className='text-gray-900 fw-bolder fs-6 fs-lg-4 mb-1'>
                    Documentos Legislativos
                  </div>
                  {/* end::Title */}
                  {/* begin::Description */}
                  <div className='text-muted fw-bold fs-7 fs-lg-6'>
                    Acesse projetos de lei, emendas, pareceres e demais documentos do processo legislativo.
                  </div>
                  {/* end::Description */}
                </div>
                {/* end::Wrapper */}
                <KTIcon iconName='arrow-right' className='text-gray-500 fs-2' />
              </div>
              {/* end::Info */}
            </div>
            {/* end::Link */}

            {/* begin::Link */}
            <div className='d-flex align-items-center mb-7'>
              {/* begin::Icon */}
              <div className='d-flex flex-center w-50px h-50px w-lg-75px h-lg-75px flex-shrink-0 rounded bg-light-primary'>
                <KTIcon iconName='user-tick' className='text-primary fs-2x text-lg-3x' />
              </div>
              {/* end::Icon */}
              {/* begin::Info */}
              <div className='d-flex flex-stack flex-grow-1 ms-4 ms-lg-6'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column me-2 me-lg-5'>
                  {/* begin::Title */}
                  <div className='text-gray-900 fw-bolder fs-6 fs-lg-4 mb-1'>
                    Representantes
                  </div>
                  {/* end::Title */}
                  {/* begin::Description */}
                  <div className='text-muted fw-bold fs-7 fs-lg-6'>
                    Consulte informações sobre deputados, senadores e suas atividades parlamentares.
                  </div>
                  {/* end::Description */}
                </div>
                {/* end::Wrapper */}
                <KTIcon iconName='arrow-right' className='text-gray-500 fs-2' />
              </div>
              {/* end::Info */}
            </div>
            {/* end::Link */}

            {/* begin::Link */}
            <div className='d-flex align-items-center mb-7'>
              {/* begin::Icon */}
              <div className='d-flex flex-center w-50px h-50px w-lg-75px h-lg-75px flex-shrink-0 rounded bg-light-info'>
                <KTIcon iconName='chart-line' className='text-info fs-2x text-lg-3x' />
              </div>
              {/* end::Icon */}
              {/* begin::Info */}
              <div className='d-flex flex-stack flex-grow-1 ms-4 ms-lg-6'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column me-2 me-lg-5'>
                  {/* begin::Title */}
                  <div className='text-gray-900 fw-bolder fs-6 fs-lg-4 mb-1'>
                    Relatórios e Estatísticas
                  </div>
                  {/* end::Title */}
                  {/* begin::Description */}
                  <div className='text-muted fw-bold fs-7 fs-lg-6'>
                    Visualize dados sobre votações, frequência e performance parlamentar.
                  </div>
                  {/* end::Description */}
                </div>
                {/* end::Wrapper */}
                <KTIcon iconName='arrow-right' className='text-gray-500 fs-2' />
              </div>
              {/* end::Info */}
            </div>
            {/* end::Link */}

            {/* begin::Link */}
            <div className='d-flex align-items-center mb-7'>
              {/* begin::Icon */}
              <div className='d-flex flex-center w-50px h-50px w-lg-75px h-lg-75px flex-shrink-0 rounded bg-light-success'>
                <KTIcon iconName='search-list' className='text-success fs-2x text-lg-3x' />
              </div>
              {/* end::Icon */}
              {/* begin::Info */}
              <div className='d-flex flex-stack flex-grow-1 ms-4 ms-lg-6'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column me-2 me-lg-5'>
                  {/* begin::Title */}
                  <div className='text-gray-900 fw-bolder fs-6 fs-lg-4 mb-1'>
                    Busca Avançada
                  </div>
                  {/* end::Title */}
                  {/* begin::Description */}
                  <div className='text-muted fw-bold fs-7 fs-lg-6'>
                    Utilize filtros avançados para encontrar documentos específicos rapidamente.
                  </div>
                  {/* end::Description */}
                </div>
                {/* end::Wrapper */}
                <KTIcon iconName='arrow-right' className='text-gray-500 fs-2' />
              </div>
              {/* end::Info */}
            </div>
            {/* end::Link */}

            {/* begin::Link */}
            <div className='d-flex align-items-center mb-7'>
              {/* begin::Icon */}
              <div className='d-flex flex-center w-50px h-50px w-lg-75px h-lg-75px flex-shrink-0 rounded bg-light-danger'>
                <KTIcon iconName='notification-bing' className='text-danger fs-2x text-lg-3x' />
              </div>
              {/* end::Icon */}
              {/* begin::Info */}
              <div className='d-flex flex-stack flex-grow-1 ms-4 ms-lg-6'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column me-2 me-lg-5'>
                  {/* begin::Title */}
                  <div className='text-gray-900 fw-bolder fs-6 fs-lg-4 mb-1'>
                    Notificações
                  </div>
                  {/* end::Title */}
                  {/* begin::Description */}
                  <div className='text-muted fw-bold fs-7 fs-lg-6'>
                    Receba alertas sobre atualizações de projetos e sessões de seu interesse.
                  </div>
                  {/* end::Description */}
                </div>
                {/* end::Wrapper */}
                <KTIcon iconName='arrow-right' className='text-gray-500 fs-2' />
              </div>
              {/* end::Info */}
            </div>
            {/* end::Link */}

            {/* begin::Additional Info */}
            <div className='rounded bg-light-primary p-6 p-lg-8 mt-10'>
              <h6 className='fw-bolder text-primary mb-3'>Como usar o sistema:</h6>
              <div className='text-gray-700 fs-7 mb-2'>
                • Utilize a barra de pesquisa para encontrar documentos específicos
              </div>
              <div className='text-gray-700 fs-7 mb-2'>
                • Navegue pelas categorias para explorar diferentes tipos de conteúdo
              </div>
              <div className='text-gray-700 fs-7 mb-2'>
                • Configure alertas para acompanhar projetos de seu interesse
              </div>
              <div className='text-gray-700 fs-7'>
                • Acesse relatórios para análises detalhadas da atividade parlamentar
              </div>
            </div>
            {/* end::Additional Info */}

          </div>
          {/* end::Content */}
        </div>
        {/* end::Body */}
      </div>
      {/* end::Card */}
    </div>
  )
}

export {HelpDrawer}
