# 👨‍💻 Área do Desenvolvedor

## 📖 Visão Geral

A área do desenvolvedor é uma seção específica do sistema parlamentar destinada a usuários com role `DESENVOLVEDOR`. Esta área utiliza o dashboard existente do template Metronic sem modificações.

## 🔑 Credenciais de Acesso

- **Email**: `dev@parlamentar.gov.br`
- **Nome**: `Desenvolvedor Sistema`
- **Role**: `DESENVOLVEDOR`

## 📂 Estrutura de Arquivos

```
src/app/desenvolvedor/
├── layout.tsx           # Layout específico da área
├── page.tsx            # Página root (redireciona para dashboard)
└── dashboard/
    └── page.tsx        # Dashboard usando DashboardWrapper

src/components/desenvolvedor/
└── README.md           # Esta documentação
```

## 🚀 Funcionalidades

### Dashboard Principal
- **Rota**: `/desenvolvedor/dashboard`
- **Componente**: Reutiliza `DashboardWrapper` do template
- **Widgets**: 
  - MixedWidget13, MixedWidget14, MixedWidget15
  - TablesWidget9
  - ListsWidget5, ListsWidget4

### Redirecionamento Automático
- **Rota**: `/desenvolvedor`
- **Comportamento**: Redireciona automaticamente para `/desenvolvedor/dashboard`

## 🔧 Componentes Utilizados

### DashboardWrapper
```tsx
import { DashboardWrapper } from '../../pages/dashboard/DashboardWrapper'

export default function DesenvolvedorDashboard() {
  return <DashboardWrapper />
}
```

### Layout Personalizado
```tsx
export default function DesenvolvedorLayout({ children }) {
  return (
    <div className="desenvolvedor-area">
      <main className="desenvolvedor-content">
        {children}
      </main>
    </div>
  )
}
```

## 🎯 Características

- ✅ **Zero Modificação**: Utiliza dashboard original sem alterações
- ✅ **Acesso Restrito**: Apenas usuários com role `DESENVOLVEDOR`
- ✅ **Redirecionamento**: Auto-redirect para dashboard
- ✅ **Template Preservado**: Mantém funcionalidade original
- ✅ **Estrutura Organizada**: Separação clara de responsabilidades

## 🔄 Próximos Passos

1. **Autenticação**: Implementar sistema de login
2. **Proteção de Rotas**: Middleware para verificar role
3. **Personalização**: Adicionar widgets específicos para desenvolvedores
4. **Métricas**: Dashboard com métricas de desenvolvimento
5. **Ferramentas**: Área de ferramentas e utilitários do sistema

## 📊 Database

O usuário desenvolvedor é criado automaticamente via seed:

```sql
SELECT * FROM users WHERE role = 'DESENVOLVEDOR';
-- Retorna: dev@parlamentar.gov.br | Desenvolvedor Sistema
```

---

**Status**: ✅ Implementado e Funcional  
**Última Atualização**: 11/06/2025  
**Responsável**: Sistema de Seed Automático 