# Upload de Logo da Câmara - Configurações Gerais

## 📋 Resumo das Mudanças

Substituição das configurações de tema/cores por um sistema completo de upload e edição de logo da câmara, incluindo preview em tempo real e ferramenta de corte com **drag and drop**. Remoção das configurações regionais desnecessárias.

## 🎯 Funcionalidades Implementadas

### ✅ Funcionalidades Removidas
- **Configurações de Tema e Cores**
  - Cor Primária
  - Cor Secundária  
  - Cor de Destaque
  - Interface de seleção de cores
- **Configurações Regionais**
  - Timezone
  - Idioma Padrão

### ✅ Funcionalidades Adicionadas

#### 1. **Upload de Logo**
- Campo de upload com suporte a múltiplos formatos
- Validação de tipos de arquivo (PNG, JPG, JPEG, SVG)
- Limite de tamanho (5MB)
- Interface intuitiva com botão de upload

#### 2. **Preview da Logo**
- Visualização imediata da logo carregada
- Informações de dimensões finais (200x80px)
- Botão para remover logo atual
- Dimensões fixas otimizadas para o sistema

#### 3. **Editor de Corte com Drag & Drop**
- Modal com ferramenta de crop profissional
- **Área de corte arrastável** - tamanho fixo 200x80px
- **Preview em tempo real** durante o arraste
- **Interface visual intuitiva**:
  - Área de crop com bordas azuis
  - Ícone de movimento no centro
  - Indicadores visuais nos cantos
  - Cursor grab/grabbing
- **Centralização automática** da área de crop

## 🛠️ Estrutura de Dados Simplificada

```typescript
const [formData, setFormData] = useState({
  nomeInstituicao: '',
  sigla: '',
  logoUrl: '',        // ← Campo da logo
  enderecoCompleto: '',
  telefone: '',
  email: '',
  website: '',
  cnpj: ''
  // ← Removidos: timezone, idiomapadrao
})

const [cropData, setCropData] = useState({
  originalImage: '',
  cropX: 50,
  cropY: 50,
  cropWidth: 200,     // ← Tamanho FIXO
  cropHeight: 80,     // ← Tamanho FIXO
  imageWidth: 0,
  imageHeight: 0
})

const [isDragging, setIsDragging] = useState(false)
const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
```

## 🎨 Layout Final da Página

### Seções Mantidas
```
┌─────────────────────────────────────────────────────────────┐
│ 🏛️ Identidade Institucional                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────┐  ┌──────────────────────┐        │
│ │ Informações Básicas  │  │ Contato              │        │
│ │ • Nome Instituição   │  │ • Email              │        │
│ │ • Sigla              │  │ • Telefone           │        │
│ │ • CNPJ               │  │ • Website            │        │
│ └──────────────────────┘  └──────────────────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Endereço Completo                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📷 Logo da Câmara                                       │ │
│ │ • Upload com drag & drop                                │ │
│ │ • Preview e edição                                      │ │
│ │ • Dimensões: 200x80px                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Seções Removidas
```
❌ Configurações de Tema e Cores
   • Cor Primária
   • Cor Secundária  
   • Cor de Destaque

❌ Configurações Regionais
   • Timezone
   • Idioma Padrão
```

## 📐 Foco nas Funcionalidades Essenciais

### **Campos Mantidos (Essenciais)**
1. **Identidade Institucional**
   - Nome da Instituição (obrigatório)
   - Sigla
   - CNPJ
   
2. **Informações de Contato**
   - Email Institucional
   - Telefone
   - Website
   
3. **Localização**
   - Endereço Completo
   
4. **Identidade Visual**
   - Logo da Câmara (upload + crop)

### **Campos Removidos (Desnecessários)**
1. **~~Tema/Cores~~** - Sistema padrão mais consistente
2. **~~Timezone~~** - Configuração do servidor/sistema
3. **~~Idioma~~** - Definido a nível de aplicação

## 🎯 Benefícios da Simplificação

### **Interface Mais Limpa**
- ✅ Foco nas informações realmente necessárias
- ✅ Menos campos para preencher
- ✅ Processo mais rápido de configuração
- ✅ Menor chance de confusão

### **Manutenção Reduzida**
- ✅ Menos campos para validar
- ✅ Menos configurações para gerenciar
- ✅ Código mais simples e focado
- ✅ Menor superfície para bugs

### **Experiência do Usuário**
- ✅ Configuração mais direta
- ✅ Foco na identidade institucional
- ✅ Processo simplificado
- ✅ Menos decisões desnecessárias

## 🚀 Fluxo de Configuração Otimizado

### **Passo 1: Informações Básicas**
1. Nome da instituição (obrigatório)
2. Sigla e CNPJ
3. Dados de contato

### **Passo 2: Localização**
1. Endereço completo

### **Passo 3: Identidade Visual**
1. Upload da logo
2. Ajuste com drag & drop
3. Aplicação automática (200x80px)

### **Resultado**
- ✅ Configuração completa em 3 passos
- ✅ Foco no essencial
- ✅ Logo otimizada automaticamente
- ✅ Sistema pronto para uso

## 📋 Resumo Final

### **O que foi mantido:**
- ✅ Informações institucionais essenciais
- ✅ Dados de contato
- ✅ Upload de logo com editor avançado
- ✅ Interface limpa e profissional

### **O que foi removido:**
- ❌ Configurações de tema/cores
- ❌ Configurações regionais (timezone/idioma)
- ❌ Sliders complexos no editor
- ❌ Controles desnecessários

### **Resultado:**
Interface focada, eficiente e fácil de usar para configuração da identidade institucional, com destaque para o sistema profissional de upload e edição de logo.

---

*Configurações gerais simplificadas e otimizadas, mantendo apenas o essencial para a identidade institucional e removendo complexidades desnecessárias.* 