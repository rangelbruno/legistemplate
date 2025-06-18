import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword} from '../core/_requests'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de email inválido')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Email é obrigatório'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        requestPassword(values.email)
          .then(() => {
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('Erro ao processar solicitação. Tente novamente.')
          })
      }, 1000)
    },
  })

  return (
    <div className="login-form">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="symbol symbol-75px mx-auto mb-5">
          <div className="symbol-label bg-light-warning">
            <i className="bi bi-key-fill text-warning fs-1"></i>
          </div>
        </div>
        
        <h1 className="text-gray-900 fw-bolder mb-3 fs-2qx">
          Recuperar Senha
        </h1>
        
        <div className="text-gray-600 fw-semibold fs-5 mb-2">
          Esqueceu sua senha de acesso?
        </div>
        
        <div className="text-gray-500 fw-normal fs-6">
          Digite seu email institucional para receber as instruções de recuperação
        </div>
      </div>

      {/* Linha divisória */}
      <div className="d-flex align-items-center mb-8">
        <div className="border-bottom border-gray-300 flex-grow-1"></div>
        <div className="mx-4">
          <div className="symbol symbol-40px">
            <div className="symbol-label bg-light-warning">
              <i className="bi bi-envelope-check text-warning fs-4"></i>
            </div>
          </div>
        </div>
        <div className="border-bottom border-gray-300 flex-grow-1"></div>
      </div>

      <form
        className="form w-100"
        noValidate
        id="kt_login_password_reset_form"
        onSubmit={formik.handleSubmit}
      >
        {/* Mensagem de erro */}
        {hasErrors === true && (
          <div className="alert alert-danger d-flex align-items-center mb-8">
            <i className="bi bi-exclamation-triangle-fill fs-2hx text-danger me-4"></i>
            <div className="d-flex flex-column">
              <h5 className="mb-1">Erro no Processamento</h5>
              <span>Erro ao processar solicitação. Verifique o email e tente novamente.</span>
            </div>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {hasErrors === false && (
          <div className="alert alert-success d-flex align-items-center mb-8">
            <i className="bi bi-check-circle-fill fs-2hx text-success me-4"></i>
            <div className="d-flex flex-column">
              <h5 className="mb-1">Email Enviado!</h5>
              <span>Instruções de recuperação foram enviadas para seu email.</span>
            </div>
          </div>
        )}

        {/* Instruções */}
        {hasErrors === undefined && (
          <div className="notice bg-light-primary rounded border-primary border border-dashed p-6 mb-8">
            <div className="d-flex flex-stack">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px me-4">
                  <div className="symbol-label bg-primary">
                    <i className="bi bi-info-circle text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <h5 className="text-gray-800 mb-1">Como Funciona</h5>
                                     <div className="fw-semibold">
                     <span className="text-gray-700">📧 Email válido:</span> 
                     <span className="text-primary ms-1">admin@parlamentar.gov.br</span>
                     <br/>
                     <span className="text-gray-700">1.</span> 
                     <span className="text-primary ms-1">Digite seu email institucional</span>
                     <br/>
                     <span className="text-gray-700">2.</span> 
                     <span className="text-primary ms-1">Receberá instruções por email</span>
                     <br/>
                     <span className="text-gray-700">3.</span> 
                     <span className="text-primary ms-1">Siga as instruções para criar nova senha</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campo Email */}
        <div className="fv-row mb-8">
          <label className="form-label fs-6 fw-bold text-gray-900 mb-2">
            <i className="bi bi-envelope me-2 text-primary"></i>
            Email Institucional
          </label>
          <input
            type="email"
            placeholder="Digite seu email institucional"
            autoComplete="email"
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control form-control-lg bg-transparent px-3',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {'is-valid': formik.touched.email && !formik.errors.email}
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="fv-plugins-message-container mt-2">
              <div className="fv-help-block">
                <span role="alert" className="text-danger fw-semibold">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {formik.errors.email}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-8">
          <button 
            type="submit" 
            id="kt_password_reset_submit" 
            className="btn btn-lg btn-warning fw-bold"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && (
              <span className="indicator-label">
                <i className="bi bi-send me-2"></i>
                Enviar Instruções
              </span>
            )}
            {loading && (
              <span className="indicator-progress" style={{display: 'block'}}>
                <span className="spinner-border spinner-border-sm align-middle me-2"></span>
                Processando...
              </span>
            )}
          </button>
          
          <Link to="/auth/login">
            <button
              type="button"
              className="btn btn-lg btn-light-primary fw-bold"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Voltar ao Login
            </button>
          </Link>
        </div>

        {/* Footer informativo */}
        <div className="text-center">
          <div className="text-gray-500 fw-semibold fs-7 mb-3">
            <i className="bi bi-clock me-1"></i>
            O email pode levar até 5 minutos para chegar
          </div>
          
          <div className="text-gray-400 fs-8">
            <span>Não recebeu o email? Verifique sua caixa de spam</span>
          </div>
          
          <div className="d-flex justify-content-center align-items-center gap-3 text-gray-400 fs-8 mt-3">
            <span>
              <i className="bi bi-telephone me-1"></i>
              Suporte: (11) 1234-5678
            </span>
            <span>•</span>
            <span>
              <i className="bi bi-envelope me-1"></i>
              suporte@parlamentar.gov.br
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
