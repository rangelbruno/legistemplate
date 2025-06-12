import axios from "axios";
import { AuthModel, UserModel } from "./_models";
import bcrypt from 'bcryptjs'

const API_URL = import.meta.env.VITE_APP_API_URL || '/api';

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Dados simulados baseados no nosso seed
const MOCK_USERS = [
  {
    id: 'admin_user', 
    email: 'admin@parlamentar.gov.br',
    name: 'Administrador Sistema',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTqG6nHsAa5HhF8KG', // hash de "123456"
    role: 'ADMIN',
    ativo: true
  }
]

// Função de login personalizada usando dados mockados
export async function login(email: string, password: string): Promise<{data: AuthModel}> {
  try {
    console.log('🔐 Tentando login com:', { email, password })
    
    // Buscar usuário nos dados mockados
    const user = MOCK_USERS.find(u => u.email === email)
    console.log('👤 Usuário encontrado:', user)

    if (!user || !user.ativo) {
      throw new Error('Email ou senha inválidos')
    }

    // Para desenvolvimento, aceitar senha "123456" diretamente
    if (password !== '123456') {
      throw new Error('Email ou senha inválidos')
    }

    console.log('✅ Senha válida')

    // Retornar token simulado
    const authData: AuthModel = {
      api_token: `mock_token_${user.id}_${Date.now()}`,
      refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    }

    console.log('✅ Login bem-sucedido:', authData)
    
    // Salvar dados do usuário no localStorage para uso posterior
    localStorage.setItem('current_user', JSON.stringify({
      id: user.id,
      username: user.email,
      email: user.email,
      first_name: user.name.split(' ')[0] || user.name,
      last_name: user.name.split(' ').slice(1).join(' ') || '',
      role: user.role
    }))

    return { data: authData }
    
  } catch (error) {
    console.error('❌ Erro no login:', error)
    throw error
  }
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string): Promise<{data: UserModel}> {
  try {
    console.log('🔍 Buscando usuário por token:', token)
    
    // Recuperar dados do localStorage
    const userData = localStorage.getItem('current_user')
    if (!userData) {
      throw new Error('Usuário não encontrado')
    }

    const user = JSON.parse(userData)
    console.log('👤 Dados do usuário recuperados:', user)
    
    const userModel: UserModel = {
      id: parseInt(user.id) || 1,
      username: user.username,
      password: undefined,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      fullname: `${user.first_name} ${user.last_name}`,
      occupation: getOccupationByRole(user.role),
      companyName: 'Sistema Parlamentar',
      phone: 'N/A',
      roles: [1], // ID numérico genérico
      pic: './media/avatars/300-1.jpg',
      language: 'en',
      timeZone: 'America/Sao_Paulo',
      website: 'https://keenthemes.com',
      emailSettings: {
        emailNotification: true,
        sendCopyToPersonalEmail: false,
        activityRelatesEmail: {
          youHaveNewNotifications: false,
          youAreSentADirectMessage: false,
          someoneAddsYouAsAsAConnection: true,
          uponNewOrder: false,
          newMembershipApproval: false,
          memberRegistration: true,
        },
        updatesFromKeenthemes: {
          newsAboutKeenthemesProductsAndFeatureUpdates: false,
          tipsOnGettingMoreOutOfKeen: false,
          thingsYouMissedSindeYouLastLoggedIntoKeen: true,
          newsAboutStartOnPartnerProductsAndOtherServices: true,
          tipsOnStartBusinessProducts: true,
        },
      },
      communication: {
        email: true,
        sms: true,
        phone: false,
      },
      address: {
        addressLine: 'Congresso Nacional',
        city: 'Brasília',
        state: 'DF',
        postCode: '70160-900',
      },
    }

    return Promise.resolve({ data: userModel })
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error)
    return Promise.reject(error)
  }
}

function getOccupationByRole(role: string): string {
  switch (role) {
    case 'PARLAMENTAR':
      return 'Parlamentar'
    case 'ADMIN':
      return 'Administrador do Sistema'
    default:
      return 'Usuário'
  }
}
