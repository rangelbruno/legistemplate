/**
 * Utilitários simples para roles de usuário
 * Versão temporária até os types do Prisma serem regenerados
 */

export function isDesenvolvedor(user: any): boolean {
  return user?.role === 'DESENVOLVEDOR'
}

export function isAdmin(user: any): boolean {
  return user?.role === 'ADMIN'
}

export function isParlamentar(user: any): boolean {
  return user?.role === 'PARLAMENTAR'
}

export function getRedirectPath(role: string): string {
  switch (role) {
    case 'DESENVOLVEDOR':
      return '/desenvolvedor'
    case 'ADMIN':
      return '/admin'
    case 'PARLAMENTAR':
      return '/parlamentar'
    case 'PUBLIC':
    default:
      return '/publico'
  }
} 