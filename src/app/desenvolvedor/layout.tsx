import { ReactNode } from 'react'

interface DesenvolvedorLayoutProps {
  children: ReactNode
}

/**
 * Layout da Área do Desenvolvedor
 * 
 * Layout específico para usuários com role DESENVOLVEDOR
 * Mantém o template original sem modificações
 */
export default function DesenvolvedorLayout({ children }: DesenvolvedorLayoutProps) {
  return (
    <div className="desenvolvedor-area">
      {/* Header específico do desenvolvedor poderia ser adicionado aqui */}
      
      {/* Conteúdo principal */}
      <main className="desenvolvedor-content">
        {children}
      </main>
      
      {/* Footer específico do desenvolvedor poderia ser adicionado aqui */}
    </div>
  )
} 