import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import './auth-custom.css'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100">
      {/* Seção do Formulário - Lado Esquerdo */}
      <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1 bg-body">
        {/* Área do Formulário */}
        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
          <div className="w-lg-500px p-10">
            <Outlet />
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="d-flex flex-center flex-wrap px-5">
          <div className="d-flex fw-semibold text-gray-600 fs-base gap-5">
            <a href="#" className="text-hover-primary text-decoration-none">
              <i className="bi bi-file-text me-1"></i>
              Termos de Uso
            </a>
            <a href="#" className="text-hover-primary text-decoration-none">
              <i className="bi bi-shield-check me-1"></i>
              Política de Privacidade
            </a>
            <a href="#" className="text-hover-primary text-decoration-none">
              <i className="bi bi-headset me-1"></i>
              Suporte Técnico
            </a>
          </div>
        </div>
      </div>

      {/* Seção Visual - Lado Direito */}
      <div className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2 position-relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             minHeight: '100vh'
           }}>
        
        {/* Overlay com padrão */}
        <div className="position-absolute w-100 h-100 opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30 0 60 30 30 60 0 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>

        {/* Conteúdo Visual */}
        <div className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100 position-relative">
          
          {/* Logo Principal */}
          <div className="text-center mb-12">
            <div className="symbol symbol-150px mx-auto mb-8">
              <div className="symbol-label bg-white bg-opacity-20 backdrop-blur">
                <i className="bi bi-building text-white fs-2x"></i>
              </div>
            </div>
            <Link to="/" className="text-decoration-none">
              <h2 className="text-white fw-bolder fs-2qx mb-3">
                Sistema Parlamentar
              </h2>
              <div className="text-white opacity-75 fs-4 fw-semibold">
                Gestão Legislativa Digital
              </div>
            </Link>
          </div>

          {/* Cards informativos */}
          <div className="row g-5 mb-10 w-100">
            <div className="col-12">
              <div className="card bg-white bg-opacity-10 backdrop-blur border-0">
                <div className="card-body text-center py-8">
                  <div className="symbol symbol-60px mx-auto mb-4">
                    <div className="symbol-label bg-light-success">
                      <i className="bi bi-shield-check text-success fs-2"></i>
                    </div>
                  </div>
                  <h4 className="text-white fw-bold mb-3">Acesso Seguro</h4>
                  <p className="text-white opacity-75 mb-0">
                    Sistema protegido com autenticação robusta e controle de acesso baseado em perfis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card bg-white bg-opacity-10 backdrop-blur border-0 h-100">
                <div className="card-body text-center py-6">
                  <div className="symbol symbol-50px mx-auto mb-3">
                    <div className="symbol-label bg-light-primary">
                      <i className="bi bi-speedometer2 text-primary fs-3"></i>
                    </div>
                  </div>
                  <h5 className="text-white fw-bold mb-2">Eficiência</h5>
                  <p className="text-white opacity-75 fs-7 mb-0">
                    Otimize processos legislativos
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card bg-white bg-opacity-10 backdrop-blur border-0 h-100">
                <div className="card-body text-center py-6">
                  <div className="symbol symbol-50px mx-auto mb-3">
                    <div className="symbol-label bg-light-info">
                      <i className="bi bi-graph-up text-info fs-3"></i>
                    </div>
                  </div>
                  <h5 className="text-white fw-bold mb-2">Transparência</h5>
                  <p className="text-white opacity-75 fs-7 mb-0">
                    Acompanhe tramitações em tempo real
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="row g-5 w-100">
            <div className="col-4">
              <div className="text-center">
                <div className="text-white fs-2qx fw-bolder">24/7</div>
                <div className="text-white opacity-75 fs-6">Disponibilidade</div>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="text-white fs-2qx fw-bolder">100%</div>
                <div className="text-white opacity-75 fs-6">Segurança</div>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center">
                <div className="text-white fs-2qx fw-bolder">∞</div>
                <div className="text-white opacity-75 fs-6">Possibilidades</div>
              </div>
            </div>
          </div>

          {/* Badge de Versão */}
          <div className="position-absolute bottom-0 end-0 me-8 mb-8">
            <div className="badge badge-light-success fs-8 fw-bold py-2 px-3">
              <i className="bi bi-check-circle me-1"></i>
              v2.0 Estável
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {AuthLayout}
