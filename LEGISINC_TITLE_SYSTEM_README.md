# Sistema de Title "LegisInc" - Implementação Completa

## 📋 Resumo das Alterações

Foi implementado o title "**LegisInc**" em todo o sistema, incluindo:

### 1. **HTML Principal (index.html)**
- ✅ Título da página: `LegisInc - Sistema de Tramitação Legislativa`
- ✅ Meta description atualizada
- ✅ Splash screen com logo LegisInc

### 2. **Componentes de Layout**
- ✅ Header atualizado com logo legisinc.svg
- ✅ Sidebar atualizado com logo e nome do sistema
- ✅ Componente Brand reutilizável criado

### 3. **Hook Customizado**
- ✅ `usePageTitle` - gerencia títulos das páginas automaticamente

### 4. **Logos**
- ✅ Uso do arquivo `legisinc.svg` existente
- ✅ Substituição de `trace.svg` em todos os componentes

---

## 🏗️ Arquivos Modificados

### **Frontend/UI**
```
index.html                                          # Title principal
src/_metronic/layout/components/header/HeaderWrapper.tsx
src/_metronic/layout/components/aside/AsideDefault.tsx
```

### **Componentes Criados**
```
src/components/ui/Brand.tsx                         # Componente reutilizável (com buildUrl)
src/hooks/usePageTitle.ts                          # Hook para títulos
```

### **Exemplo de Uso**
```
src/app/admin/configuracoes/documentos-templates/page.tsx
```

---

## 🎨 Variantes do Componente Brand

### **1. Full** (`variant="full"`)
```tsx
<Brand variant="full" />
```
- **Prioridade**: Logo
- **Fallback**: Nome + Subtítulo
- Para headers principais

### **2. Compact** (`variant="compact"`)
```tsx
<Brand variant="compact" />
```
- **Prioridade**: Logo
- **Fallback**: "LegisInc"
- Para headers mobile/pequenos

### **3. Mini** (`variant="mini"`)
```tsx
<Brand variant="mini" />
```
- **Prioridade**: Logo
- **Fallback**: "LI" (iniciais)
- Para espaços muito pequenos

### **4. Sidebar** (`variant="sidebar"`)
```tsx
<Brand variant="sidebar" />
```
- **Prioridade**: Logo
- **Fallback**: Nome + Subtítulo (vertical)
- Para sidebar/menu lateral

## 🔄 **Sistema de Fallback**

Todas as variantes implementam fallback automático:
1. **🖼️ Tenta carregar a imagem** (`legisinc.svg`)
2. **⚠️ Se falhar**, automaticamente mostra o texto
3. **🎯 Sem duplicação** - apenas um dos dois é exibido

---

## 🔧 Como Usar o Hook usePageTitle

### **Básico**
```tsx
import { usePageTitle } from '../hooks/usePageTitle'

function MinhaPage() {
  usePageTitle('Nome da Página')
  // Resultado: "Nome da Página | LegisInc - Sistema Legislativo"
  
  return <div>Conteúdo</div>
}
```

### **Avançado**
```tsx
const { setTitle } = usePageTitle()

// Dinamicamente
useEffect(() => {
  setTitle(`Editando: ${documentoNome}`)
}, [documentoNome])
```

---

## 📱 Visual Final

### **Header Mobile** 
```
[🏛️ LOGO] [≡]  (40px altura)
```

### **Sidebar**
```
  🏛️ LOGO      (80px altura - destaque principal)
```

## 📏 **Tamanhos da Logo**

- **Sidebar**: `100px` - Logo principal, bem destacada
- **Full**: `60px` - Headers principais  
- **Compact**: `50px` - Header mobile
- **Mini**: `45px` - Espaços pequenos

> 📈 **Tamanhos aumentados novamente** para maior destaque visual

## 🎯 **Navegação**

- **🔗 Link padrão**: `/admin/dashboard`
- **📱 Clique na logo**: Direciona para dashboard administrativo
- **🏠 Comportamento**: Consistente em todas as variantes
- **🔧 Sistema de URL**: Utiliza `buildUrl()` para compatibilidade com base URL do sistema (`/metronic8/react/demo3/`)

### **Títulos de Páginas**
```
Documentos e Templates | LegisInc - Sistema Legislativo
Editor | LegisInc - Sistema Legislativo  
Dashboard | LegisInc - Sistema Legislativo
```

---

## ✅ Testes Sugeridos

### **Funcionamento Normal**
1. **Carregamento**: Verificar splash screen com novo logo
2. **Header**: Logo visível em desktop/mobile
3. **Sidebar**: Logo centralizado (sem texto)
4. **Títulos**: Páginas com títulos corretos na aba do browser
5. **Responsividade**: Funcionamento em todas as resoluções

### **Teste de Fallback**
Para testar o fallback de texto quando a imagem falha:

1. **DevTools**: Abra F12 → Network → Block `legisinc.svg`
2. **Resultado esperado**: 
   - Sidebar mostra "LegisInc" + "Sistema Legislativo"
   - Header mostra "LegisInc"
   - Mini mostra "LI"

3. **Alternativa**: Renomeie temporariamente `legisinc.svg` para `legisinc-test.svg`

---

## 🔄 Futuras Melhorias

- [ ] **Favicon**: Criar favicon com logo LegisInc
- [ ] **PWA**: Manifest com informações do LegisInc
- [ ] **SEO**: Meta tags específicas por página
- [ ] **Tema Dark**: Versão escura do logo (se necessário)

---

## 🎯 Status: **COMPLETO** ✅

O sistema agora exibe consistentemente "**LegisInc**" como título e marca em todos os componentes, mantendo a identidade visual e usabilidade do sistema legislativo. 