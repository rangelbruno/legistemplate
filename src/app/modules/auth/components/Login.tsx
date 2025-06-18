import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de email inválido')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Email é obrigatório')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Digite um email válido'
    ),
  password: Yup.string()
    .min(6, 'Mínimo de 6 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Senha é obrigatória'),
})

const initialValues = {
  email: 'admin@parlamentar.gov.br',
  password: '123456',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const {data: auth} = await login(values.email, values.password)
        saveAuth(auth)
        const {data: user} = await getUserByToken(auth.api_token)
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Email ou senha incorretos. Verifique suas credenciais.')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  // Função para limpar o campo email
  const clearEmail = () => {
    formik.setFieldValue('email', '')
    formik.setFieldTouched('email', false)
  }

  // Função para detectar se o email é válido visualmente
  const isEmailValid = formik.values.email && 
    !formik.errors.email && 
    formik.values.email.length > 0

  // Função para detectar se a senha é válida visualmente  
  const isPasswordValid = formik.values.password && 
    !formik.errors.password && 
    formik.values.password.length >= 6

  return (
    <div className="login-form">
      {/* Header institucional */}
      <div className="text-center mb-10">
        <div className="symbol symbol-75px mx-auto mb-5">
          <div className="symbol-label bg-light-primary">
            <i className="bi bi-building-fill text-primary fs-1"></i>
          </div>
        </div>
        
        <h1 className="text-gray-900 fw-bolder mb-3 fs-2qx">
          Sistema Parlamentar
        </h1>
        
        <div className="text-gray-600 fw-semibold fs-4 mb-2">
          Acesso ao Sistema de Gestão Legislativa
        </div>
        
        <div className="text-gray-500 fw-normal fs-6">
          Digite suas credenciais para acessar o sistema
        </div>
      </div>

      {/* Linha divisória com ícone */}
      <div className="d-flex align-items-center mb-8">
        <div className="border-bottom border-gray-300 flex-grow-1"></div>
        <div className="mx-4">
          <div className="symbol symbol-40px">
            <div className="symbol-label bg-light-success">
              <i className="bi bi-shield-check text-success fs-4"></i>
            </div>
          </div>
        </div>
        <div className="border-bottom border-gray-300 flex-grow-1"></div>
      </div>

      <form
        className="form w-100"
        onSubmit={formik.handleSubmit}
        noValidate
        id="kt_login_signin_form"
      >
        {/* Mensagem de erro */}
        {formik.status && (
          <div className="alert alert-danger d-flex align-items-center mb-8">
            <i className="bi bi-exclamation-triangle-fill fs-2hx text-danger me-4"></i>
            <div className="d-flex flex-column">
              <h5 className="mb-1">Erro de Autenticação</h5>
              <span>{formik.status}</span>
            </div>
          </div>
        )}

        {/* Credenciais disponíveis */}
        {!formik.status && (
          <div className="notice bg-light-primary rounded border-primary border border-dashed p-6 mb-8">
            <div className="d-flex flex-stack">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px me-4">
                  <div className="symbol-label bg-primary">
                    <i className="bi bi-person-check text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <h5 className="text-gray-800 mb-1">Credencial Disponível</h5>
                  <div className="fw-semibold">
                    <span className="text-gray-700">👤 Administrador:</span> 
                    <span className="text-primary ms-1">admin@parlamentar.gov.br</span>
                    <br/>
                    <span className="text-gray-700">🔑 Senha:</span> 
                    <span className="text-success ms-1">123456</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campo Email Melhorado */}
        <div className="fv-row mb-6">
          <label className="form-label fs-6 fw-bold text-gray-900 mb-2">
            <i className="bi bi-envelope me-2 text-primary"></i>
            Email Institucional
            {isEmailValid && <i className="bi bi-check-circle text-success ms-2"></i>}
          </label>
          <div className="position-relative">
            <input
              placeholder="exemplo@parlamentar.gov.br"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-lg bg-transparent px-3 pe-5',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {'is-valid': formik.touched.email && !formik.errors.email && formik.values.email},
                {'input-focused': emailFocused}
              )}
              type="email"
              name="email"
              autoComplete="username email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            
            {/* Botão de limpar email */}
            {formik.values.email && (
              <button
                type="button"
                className="btn btn-sm btn-icon position-absolute translate-middle-y top-50 end-0 me-3"
                onClick={clearEmail}
                title="Limpar email"
              >
                <i className="bi bi-x-circle text-muted"></i>
              </button>
            )}
            
            {/* Ícone de status do email */}
            {isEmailValid && (
              <div className="position-absolute translate-middle-y top-50 end-0 me-12">
                <i className="bi bi-check-circle text-success"></i>
              </div>
            )}
          </div>
          
          {/* Feedback do email */}
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
          
          {/* Sugestão de domínio */}
          {formik.values.email && 
           !formik.values.email.includes('@parlamentar.gov.br') && 
           formik.values.email.includes('@') && (
            <div className="form-text text-info">
              <i className="bi bi-info-circle me-1"></i>
              Sugestão: Use um email do domínio @parlamentar.gov.br
            </div>
          )}
        </div>

        {/* Campo Senha Melhorado */}
        <div className="fv-row mb-6">
          <label className="form-label fs-6 fw-bold text-gray-900 mb-2">
            <i className="bi bi-lock me-2 text-primary"></i>
            Senha de Acesso
            {isPasswordValid && <i className="bi bi-check-circle text-success ms-2"></i>}
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha segura"
              autoComplete="current-password"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-lg bg-transparent px-3 pe-5',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {'is-valid': formik.touched.password && !formik.errors.password && formik.values.password},
                {'input-focused': passwordFocused}
              )}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            
            {/* Botão de mostrar/ocultar senha */}
            <button
              type="button"
              className="btn btn-sm btn-icon position-absolute translate-middle-y top-50 end-0 me-3"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
            </button>
            
            {/* Indicador de status da senha */}
            {isPasswordValid && (
              <div className="position-absolute translate-middle-y top-50 end-0 me-12">
                <i className="bi bi-check-circle text-success"></i>
              </div>
            )}
          </div>
          
          {/* Feedback da senha */}
          {formik.touched.password && formik.errors.password && (
            <div className="fv-plugins-message-container mt-2">
              <div className="fv-help-block">
                <span role="alert" className="text-danger fw-semibold">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {formik.errors.password}
                </span>
              </div>
            </div>
          )}
          

        </div>

        {/* Opções auxiliares */}
        <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="remember_me"
            />
            <label className="form-check-label text-gray-700" htmlFor="remember_me">
              Lembrar-me neste dispositivo
            </label>
          </div>

          <Link 
            to="/auth/forgot-password" 
            className="link-primary text-decoration-none"
          >
            <i className="bi bi-question-circle me-1"></i>
            Esqueci minha senha
          </Link>
        </div>

        {/* Botão de Login */}
        <div className="d-grid mb-8">
          <button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-lg btn-primary fw-bold"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && (
              <span className="indicator-label">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Acessar Sistema
              </span>
            )}
            {loading && (
              <span className="indicator-progress" style={{display: 'block'}}>
                <span className="spinner-border spinner-border-sm align-middle me-2"></span>
                Verificando credenciais...
              </span>
            )}
          </button>
        </div>

        {/* Footer informativo */}
        <div className="text-center">
          <div className="text-gray-500 fw-semibold fs-7 mb-3">
            <i className="bi bi-shield-lock me-1"></i>
            Acesso restrito a usuários autorizados
          </div>
          
          <div className="d-flex justify-content-center align-items-center gap-3 text-gray-400 fs-8">
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
