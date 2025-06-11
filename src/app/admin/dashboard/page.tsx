'use client'

import { DashboardWrapper } from '../../pages/dashboard/DashboardWrapper'
import AdministradorLayout from '../layout'

/**
 * Dashboard do Administrador - Sistema de Tramitação Parlamentar
 * 
 * Utiliza o dashboard principal existente do projeto
 * Mantém todas as funcionalidades e widgets originais
 */
export default function AdminDashboardPage() {
  return (
    <AdministradorLayout>
      {/* Dashboard principal do projeto sem elementos redundantes */}
      <DashboardWrapper />
    </AdministradorLayout>
  )
} 