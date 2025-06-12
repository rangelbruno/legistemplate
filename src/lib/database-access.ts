/**
 * Utilitário para Acesso ao Banco de Dados - Prisma Studio
 * 
 * Gerencia o acesso ao Prisma Studio para usuários admin e desenvolvedor
 */

/**
 * Função principal para abrir o Prisma Studio
 * Versão simplificada que sempre tenta abrir
 */
export const openPrismaStudio = (): void => {
  const PRISMA_STUDIO_URL = 'http://localhost:5555'
  
  // Simplesmente abrir o Prisma Studio
  // Se não estiver rodando, o usuário verá a página de erro do navegador
  const newWindow = window.open(PRISMA_STUDIO_URL, '_blank')
  
  if (newWindow) {
    console.log('🗄️ Tentando abrir Prisma Studio...')
    
    // Aguardar um pouco e verificar se a janela ainda está aberta
    setTimeout(() => {
      try {
        if (newWindow.closed) {
          console.log('❌ Janela foi fechada - Prisma Studio pode não estar rodando')
          showPrismaStudioInstructions()
        } else {
          console.log('✅ Prisma Studio aberto com sucesso!')
        }
      } catch (error) {
        // Se não conseguir verificar, apenas mostrar instrução como backup
        console.log('ℹ️ Para garantir que funcione, verifique se o Prisma Studio está rodando')
      }
    }, 2000)
  } else {
    // Se não conseguir abrir a janela (popup bloqueado)
    alert('⚠️ Popup bloqueado! Por favor, permita popups para este site e tente novamente.')
  }
}

/**
 * Função alternativa com verificação mais robusta
 */
export const openPrismaStudioWithCheck = async (): Promise<void> => {
  const PRISMA_STUDIO_URL = 'http://localhost:5555'
  
  try {
    console.log('🔍 Verificando se Prisma Studio está rodando...')
    
    // Tentar fazer uma requisição simples
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const response = await fetch(PRISMA_STUDIO_URL, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    })
    
    clearTimeout(timeoutId)
    
    // Se chegou até aqui, o servidor está respondendo
    window.open(PRISMA_STUDIO_URL, '_blank')
    showDatabaseAccessSuccess()
    
  } catch (error) {
    console.log('❌ Prisma Studio não está respondendo:', error)
    showPrismaStudioInstructions()
  }
}

/**
 * Função para abrir diretamente (sem verificação) - para casos de emergência
 */
export const openPrismaStudioDirect = (): void => {
  window.open('http://localhost:5555', '_blank')
}

/**
 * Função de diagnóstico para verificar o status do Prisma Studio
 */
export const diagnosePrismaStudio = async (): Promise<void> => {
  console.log('🔍 Diagnóstico do Prisma Studio...')
  
  const message = `🔍 Diagnóstico do Banco de Dados

URL: http://localhost:5555

Instruções:
1. Verifique se o Prisma Studio está rodando
2. No terminal, execute: npm run db:studio
3. Aguarde a mensagem: "✔ Prisma Studio is up on http://localhost:5555"

Se estiver rodando e ainda não funcionar:
- Verifique se não há bloqueio de popup
- Tente acessar diretamente: http://localhost:5555

Deseja tentar abrir agora?`

  if (confirm(message)) {
    openPrismaStudioDirect()
  }
}

/**
 * Mostra instruções para iniciar o Prisma Studio
 */
const showPrismaStudioInstructions = (): void => {
  const message = `🗄️ Prisma Studio parece não estar rodando!

Para acessar o banco de dados:

1️⃣ Abra o terminal no diretório do projeto
2️⃣ Execute o comando:
   npm run db:studio

3️⃣ Aguarde a mensagem:
   "✔ Prisma Studio is up on http://localhost:5555"

4️⃣ Tente clicar no atalho novamente

ℹ️ O Prisma Studio é uma interface web para visualizar e editar dados do banco SQLite.

Deseja tentar abrir mesmo assim?`
  
  if (confirm(message)) {
    window.open('http://localhost:5555', '_blank')
  }
}

/**
 * Verifica se o usuário tem permissão para acessar o banco de dados
 */
export const canAccessDatabase = (): boolean => {
  const userData = localStorage.getItem('current_user')
  if (!userData) return false
  
  try {
    const user = JSON.parse(userData)
    return user.role === 'ADMIN' || user.role === 'DESENVOLVEDOR'
  } catch {
    return false
  }
}

/**
 * Função para mostrar toast de sucesso quando Prisma Studio abrir
 */
export const showDatabaseAccessSuccess = (): void => {
  console.log('✅ Prisma Studio aberto com sucesso!')
  
  // Opcional: Mostrar notificação visual
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Banco de Dados', {
      body: 'Prisma Studio aberto com sucesso!',
      icon: '/favicon.ico'
    })
  }
} 