# 📝 Editor de Documentos Legislativos - Manual Completo

## 🎯 Visão Geral

O Editor de Documentos é uma ferramenta avançada que permite aos vereadores criar, editar e formatar documentos legislativos de forma profissional e eficiente. O sistema oferece três modos de edição e funcionalidades específicas para documentos legislativos.

## 🚀 Funcionalidades Principais

### ✨ **Três Modos de Edição**

#### 1. **Modo Visual** 📝
- Editor WYSIWYG (What You See Is What You Get)
- Formatação visual em tempo real
- Toolbar com ferramentas de formatação
- Ideal para usuários não técnicos

#### 2. **Modo HTML** 💻
- Editor de código HTML direto
- Syntax highlighting
- Para usuários avançados
- Controle total sobre a estrutura

#### 3. **Modo Preview** 👁️
- Visualização como será impresso
- Layout final do documento
- Sem ferramentas de edição
- Ideal para revisão final

### 🛠️ **Toolbar de Formatação** (Modo Visual)

#### Formatação de Texto:
- **Negrito** (Ctrl+B)
- **Itálico** (Ctrl+I)
- **Sublinhado** (Ctrl+U)

#### Estrutura de Títulos:
- **H1** - Título Principal (Ctrl+1)
- **H2** - Título Secundário (Ctrl+2)
- **H3** - Título Terciário (Ctrl+3)

#### Listas:
- **Lista com marcadores** (•)
- **Lista numerada** (1, 2, 3...)

#### Elementos Legislativos:
- **Art.** - Inserir artigo ("Art. º - ")
- **§** - Inserir parágrafo ("§ º - ")
- **Inc.** - Inserir inciso ("Inciso - ")

## ⌨️ **Atalhos de Teclado**

### Gerais:
- `Ctrl + S` - Salvar documento
- `F11` - Alternar modo tela cheia
- `Esc` - Sair do modo tela cheia

### Formatação (Modo Visual):
- `Ctrl + B` - Negrito
- `Ctrl + I` - Itálico
- `Ctrl + U` - Sublinhado
- `Ctrl + 1` - Título H1
- `Ctrl + 2` - Título H2
- `Ctrl + 3` - Título H3

## 📋 **Templates Pré-configurados**

### 1. **Requerimento**
```html
<div class="document-header">
  <h1>REQUERIMENTO</h1>
  <p><strong>Requerente:</strong> [Nome do Vereador]</p>
</div>

<div class="document-body">
  <h3>SOLICITA:</h3>
  <p>[Descreva aqui o que está sendo solicitado]</p>
  
  <h3>JUSTIFICATIVA:</h3>
  <p>[Apresente aqui a justificativa]</p>
</div>

<div class="document-footer">
  <div class="assinatura">
    <p>[Nome do Vereador]</p>
    <p>Vereador</p>
  </div>
</div>
```

### 2. **Projeto de Lei**
```html
<div class="document-header">
  <h1>PROJETO DE LEI Nº ___/2025</h1>
  <p><strong>Autor:</strong> [Nome do Vereador]</p>
</div>

<div class="document-body">
  <h3>EMENTA</h3>
  <p>[Descreva brevemente o objeto da lei]</p>
  
  <h3>A CÂMARA MUNICIPAL DECRETA:</h3>
  
  <div class="artigos-lei">
    <p>Art. 1º - [Primeiro artigo da lei]</p>
    <p>Art. 2º - Esta lei entra em vigor na data de sua publicação.</p>
  </div>
  
  <h3>JUSTIFICATIVA</h3>
  <div class="justificativa">
    [Apresente aqui a justificativa para o projeto de lei]
  </div>
</div>
```

### 3. **Ata de Sessão**
```html
<div class="document-header">
  <h1>ATA DA ___ª SESSÃO ORDINÁRIA</h1>
  <p><strong>Data:</strong> [Data da Sessão]</p>
  <p><strong>Presidente:</strong> [Nome do Presidente]</p>
</div>

<div class="document-body">
  <h3>VEREADORES PRESENTES:</h3>
  <ul>
    <li>[Nome do Vereador 1]</li>
    <li>[Nome do Vereador 2]</li>
  </ul>
  
  <h3>ORDEM DO DIA:</h3>
  <ol>
    <li>[Item 1 da ordem do dia]</li>
    <li>[Item 2 da ordem do dia]</li>
  </ol>
</div>
```

## 💾 **Sistema de Salvamento**

### Auto-save:
- **Intervalo**: A cada 5 segundos
- **Condição**: Apenas quando há alterações não salvas
- **Indicador**: Badge "Não salvo" com animação
- **Log**: Console mostra "Auto-save executado"

### Salvamento Manual:
- **Botão**: "Salvar" no header
- **Atalho**: Ctrl+S
- **Feedback**: Badge desaparece, status atualizado

## 🖥️ **Interface do Usuário**

### Header:
- **Botão Voltar**: Retorna à página anterior
- **Campo Título**: Editável em tempo real
- **Indicador Status**: Badge "Não salvo" quando necessário
- **Modos de Edição**: Visual, HTML, Preview
- **Botão Fullscreen**: Modo tela cheia
- **Botão Salvar**: Salvamento manual

### Footer:
- **Informações**: Template, Status do documento
- **Status de Salvamento**: Salvo/Não salvo
- **Auto-save**: Indicador de intervalo
- **Atalhos**: Lista de atalhos disponíveis

## 📱 **Responsividade**

### Desktop (> 768px):
- Toolbar completa
- Editor em tamanho total
- Todos os botões visíveis

### Mobile (< 768px):
- Toolbar adaptada
- Botões empilhados
- Fonte reduzida
- Padding otimizado

## 🎨 **Estilos e Formatação**

### Classes CSS Principais:
- `.document-preview` - Container do preview
- `.document-header` - Cabeçalho do documento
- `.document-body` - Corpo do documento
- `.document-footer` - Rodapé do documento
- `.assinatura` - Área de assinatura
- `.artigos-lei` - Artigos de lei
- `.editor-toolbar` - Toolbar de formatação
- `.unsaved-indicator` - Indicador não salvo

### Cores:
- **Primária**: #009ef7 (Azul)
- **Warning**: #ffc700 (Amarelo - não salvo)
- **Texto**: #333 (Cinza escuro)
- **Bordas**: #e4e6ef (Cinza claro)

## 🔧 **Configuração e Uso**

### Inicialização:
1. Sistema carrega parâmetros da URL
2. Identifica template solicitado
3. Carrega conteúdo pré-definido
4. Inicializa editor no modo visual
5. Configura auto-save e atalhos

### Fluxo de Trabalho:
1. **Criar**: Selecionar template na página principal
2. **Editar**: Usar toolbar ou atalhos para formatar
3. **Visualizar**: Alternar para modo preview
4. **Salvar**: Automático ou manual (Ctrl+S)
5. **Finalizar**: Botão voltar ou fechar aba

## 🐛 **Solução de Problemas**

### Problemas Comuns:

#### 1. **Editor não carrega**
- Verificar se não há erro de JavaScript no console
- Recarregar a página
- Verificar parâmetros da URL

#### 2. **Formatação não funciona**
- Certificar-se de estar no modo Visual
- Verificar se o texto está selecionado
- Tentar usar atalhos de teclado

#### 3. **Auto-save não funciona**
- Verificar se há alterações no documento
- Aguardar 5 segundos
- Verificar logs no console

#### 4. **Modo fullscreen travado**
- Pressionar Esc
- Pressionar F11 novamente
- Recarregar a página

## 📊 **Performance**

### Otimizações:
- **Loading**: Controlado e otimizado (800ms)
- **Auto-save**: Debounce de 5 segundos
- **Atalhos**: Event listeners otimizados
- **CSS**: Arquivo externo para cache
- **Estados**: useMemo para parâmetros de URL

### Métricas:
- **Carregamento inicial**: < 1 segundo
- **Resposta de formatação**: Instantânea
- **Auto-save**: 5 segundos após alteração
- **Troca de modo**: Instantânea

## 🔄 **Próximas Funcionalidades**

### Em Desenvolvimento:
- [ ] Exportação para PDF
- [ ] Exportação para DOCX
- [ ] Sistema de comentários
- [ ] Histórico de versões
- [ ] Colaboração em tempo real
- [ ] Spell checker
- [ ] Contador de palavras em tempo real
- [ ] Templates personalizados

### Planejadas:
- [ ] Integração com assinatura digital
- [ ] Workflow de aprovação
- [ ] Notificações push
- [ ] Backup automático na nuvem
- [ ] Modo offline
- [ ] Integração com sistemas externos

## 📞 **Suporte**

Para problemas ou sugestões:
1. Verificar logs do console (F12)
2. Reproduzir o problema
3. Documentar passos para reprodução
4. Entrar em contato com suporte técnico

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025  
**Compatibilidade**: Todos os navegadores modernos 