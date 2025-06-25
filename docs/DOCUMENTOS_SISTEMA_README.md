# Sistema de Documentos e Templates - LegisTemplate

## 📋 Visão Geral

O Sistema de Documentos e Templates do LegisTemplate é uma solução completa para criação, edição e gerenciamento de documentos legislativos. Baseado no poderoso editor **ProseMirror**, oferece uma experiência profissional e intuitiva para vereadores e funcionários da câmara municipal.

### ✨ Principais Características

- **Editor ProseMirror Avançado**: Editor de texto rico baseado no state-of-the-art ProseMirror
- **Templates Inteligentes**: Formulários pré-configurados que geram documentos automaticamente
- **Interface Profissional**: Design moderno com toolbar customizada e atalhos de teclado
- **Auto-save Inteligente**: Salvamento automático a cada 30 segundos
- **Modo Tela Cheia**: Experiência imersiva de edição
- **Contadores em Tempo Real**: Palavras e caracteres
- **Exportação Múltipla**: PDF, Word e HTML
- **Templates Legislativos**: Específicos para atas, projetos de lei, requerimentos, etc.

## 🚀 Funcionalidades do Editor

### Interface Principal

#### Header Superior
- **Título Editável**: Campo para nome do documento
- **Status Visual**: Indicadores de "Não salvo" e "Salvo em [hora]"
- **Contadores**: Palavras e caracteres em tempo real
- **Botões de Ação**:
  - Modo tela cheia (F11)
  - Mostrar metadados (Ctrl+Shift+M)
  - Status do documento (Rascunho/Finalizado/Publicado)
  - Imprimir
  - Exportar (PDF/Word/HTML)
  - Salvar (Ctrl+S)

#### Toolbar Customizada
- **Desfazer/Refazer**: Ctrl+Z / Ctrl+Y
- **Formatação Básica**: 
  - Negrito (Ctrl+B)
  - Itálico (Ctrl+I)
  - Sublinhado (Ctrl+U)
- **Cabeçalhos**: H1 a H6 + Parágrafo normal
- **Listas**: Com marcadores e numeradas
- **Elementos Legislativos**:
  - Artigos
  - Incisos
  - Alíneas
  - Considerandos

#### Painel de Metadados (Opcional)
- Template utilizado
- Status atual
- Autor
- Data da última modificação

#### Barra de Status Inferior
- Informações do documento
- Atalhos de teclado
- Status de salvamento automático

### Atalhos de Teclado

| Atalho | Função |
|--------|--------|
| `Ctrl+S` | Salvar documento |
| `Ctrl+B` | Negrito |
| `Ctrl+I` | Itálico |
| `Ctrl+U` | Sublinhado |
| `Ctrl+Z` | Desfazer |
| `Ctrl+Y` | Refazer |
| `F11` | Modo tela cheia |
| `Ctrl+Shift+M` | Mostrar metadados |

## 📝 Templates Disponíveis

### Templates Simples
Abrem diretamente no editor com estrutura básica:
- **Documento em Branco**
- **Ata de Sessão**
- **Projeto de Lei**
- **Requerimento**
- **Decreto**
- **Ofício**
- **Relatório**

### Templates Inteligentes
Formulários que geram documentos automaticamente:

#### 1. Ata de Sessão (Inteligente)
**Campos Editáveis:**
- Número da sessão*
- Tipo de sessão (Ordinária/Extraordinária)*
- Data da sessão*
- Presidente*
- Secretários (lista dinâmica)
- Vereadores presentes (lista dinâmica)
- Vereadores ausentes (lista dinâmica)
- Matérias do expediente
- Requerimentos apresentados
- Indicações apresentadas
- Observações gerais

#### 2. Projeto de Lei (Inteligente)
**Campos Editáveis:**
- Número do projeto*
- Autor*
- Ementa*
- Justificativa*
- Artigos (lista dinâmica)

*Campos obrigatórios

## 🎨 Personalização e Configuração

### Informações da Câmara
O sistema utiliza as configurações administrativas para:
- Nome da câmara
- Endereço completo
- Telefone e email
- Site oficial
- Logo (upload de imagem)

Essas informações aparecem automaticamente nos headers e footers dos documentos.

### Estilos Legislativos
O editor inclui estilos específicos para:
- **Artigos**: Numeração automática e formatação legal
- **Incisos**: Numeração romana (I, II, III...)
- **Alíneas**: Letras minúsculas (a, b, c...)
- **Considerandos**: Formatação específica para preâmbulos
- **Assinaturas**: Blocos padronizados para assinaturas
- **Tabelas de Votação**: Para registrar votações nominais

## 🔧 Como Usar

### Acesso ao Sistema
1. Acesse **Admin → Configurações → Documentos e Templates**
2. Escolha entre as abas:
   - **Meus Documentos**: Documentos salvos
   - **Templates Disponíveis**: Criar novos documentos

### Criando Documento com Template Simples
1. Clique em **"Usar Template"** no template desejado
2. Nova aba abre com o editor
3. Edite o título e conteúdo
4. Use Ctrl+S para salvar ou aguarde o auto-save

### Criando Documento com Template Inteligente
1. Clique em **"Configurar e Criar"** no template inteligente
2. Modal abre com formulário específico
3. Preencha os campos (obrigatórios marcados com *)
4. Clique em **"Gerar Documento"**
5. Nova aba abre com documento pré-formatado
6. Faça ajustes finais se necessário
7. Salve o documento

### Editando Documento Existente
1. Na aba **"Meus Documentos"**, clique em **"Editar"**
2. Documento abre em nova aba
3. Faça as alterações necessárias
4. Sistema salva automaticamente

### Exportando Documentos
1. No editor, clique no botão **"Exportar"**
2. Escolha o formato:
   - **PDF**: Para impressão e arquivo
   - **Word**: Para edição externa
   - **HTML**: Para web
3. Arquivo será baixado automaticamente

## 🔧 Funcionalidades Avançadas

### Auto-save Inteligente
- Salva automaticamente a cada 30 segundos
- Apenas quando há alterações não salvas
- Indicador visual do status de salvamento
- Funciona em background sem interromper a edição

### Modo Tela Cheia
- Pressione F11 ou clique no botão de expansão
- Remove distrações para foco total na escrita
- Mantém todas as funcionalidades do editor
- Saia pressionando F11 novamente

### Contadores em Tempo Real
- Conta palavras e caracteres automaticamente
- Atualiza conforme você digita
- Útil para documentos com limite de tamanho
- Exibido no header superior

### Prevenção de Perda de Dados
- Aviso antes de fechar aba com alterações não salvas
- Confirmação para sair sem salvar
- Auto-save reduz risco de perda acidental

## 🎯 Elementos Legislativos Específicos

### Estrutura de Artigos
```
Art. 1º - [CAPUT DO ARTIGO]
    I - [TEXTO DO INCISO];
    II - [TEXTO DO INCISO]:
        a) [TEXTO DA ALÍNEA];
        b) [TEXTO DA ALÍNEA].
```

### Considerandos
```
CONSIDERANDO que [JUSTIFICATIVA];
CONSIDERANDO que [JUSTIFICATIVA];
```

### Blocos de Assinatura
```
_________________________________
[NOME DO SIGNATÁRIO]
[CARGO/FUNÇÃO]
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Editor não carrega
- Verifique se o JavaScript está habilitado
- Limpe o cache do navegador
- Recarregue a página

#### Auto-save não funciona
- Verifique conexão com internet
- Certifique-se que o título do documento está preenchido
- Verifique se há alterações não salvas

#### Formatação perdida na exportação
- Use apenas os estilos disponíveis na toolbar
- Evite colar conteúdo de outras fontes sem limpar formatação
- Prefira usar os elementos legislativos específicos

#### Template inteligente não gera documento
- Verifique se todos os campos obrigatórios (*) estão preenchidos
- Certifique-se que não há caracteres especiais nos campos
- Tente novamente após alguns segundos

### Suporte Técnico
Para problemas não resolvidos:
1. Anote a mensagem de erro exata
2. Descreva os passos que levaram ao problema
3. Informe navegador e versão utilizada
4. Entre em contato com o suporte técnico

## 🔍 Detalhes Técnicos

### Tecnologias Utilizadas
- **ProseMirror**: Editor de texto rico profissional
- **Next.js**: Framework React para interface
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Bootstrap**: Framework CSS para design responsivo
- **Prisma**: ORM para banco de dados

### Schema ProseMirror Customizado
O editor utiliza um schema específico para documentos legislativos:
- Nodes: document_header, article_section, inciso, alinea, signature_block
- Marks: strong, em, underline, article_number, legal_reference
- Plugins: history, keymap, dropcursor, gapcursor, menubar

### API Endpoints
```
GET    /api/admin/configuracoes/documentos-templates     # Listar documentos
POST   /api/admin/configuracoes/documentos-templates     # Criar documento
PUT    /api/admin/configuracoes/documentos-templates/:id # Atualizar documento
DELETE /api/admin/configuracoes/documentos-templates/:id # Excluir documento
POST   /api/admin/configuracoes/documentos-templates/export # Exportar documento
```

### Estrutura de Dados
```typescript
interface DocumentoData {
  id?: string
  titulo: string
  template: string
  conteudo?: string
  html?: string
  status: 'rascunho' | 'finalizado' | 'publicado'
  autor: string
  criadoEm?: string
  atualizadoEm?: string
}
```

## 📦 Instalação e Configuração

### Dependências ProseMirror
```bash
npm install prosemirror-state prosemirror-view prosemirror-model
npm install prosemirror-transform prosemirror-schema-basic
npm install prosemirror-schema-list prosemirror-commands
npm install prosemirror-keymap prosemirror-history
npm install prosemirror-inputrules prosemirror-gapcursor
npm install prosemirror-dropcursor prosemirror-menu
```

### Configuração do Banco de Dados
```sql
-- Tabela para documentos
CREATE TABLE documentos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  template TEXT NOT NULL,
  conteudo TEXT,
  html TEXT,
  status TEXT CHECK(status IN ('rascunho', 'finalizado', 'publicado')),
  autor TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Script de Instalação Automatizada
Execute o script fornecido para configuração completa:
```bash
chmod +x scripts/install-documentos.sh
./scripts/install-documentos.sh
```

## 🎉 Conclusão

O Sistema de Documentos e Templates do LegisTemplate oferece uma solução completa e profissional para criação de documentos legislativos. Com interface moderna, templates inteligentes e funcionalidades avançadas, facilita o trabalho de vereadores e funcionários da câmara municipal.

### Benefícios Principais:
- ✅ **Produtividade**: Templates aceleram criação de documentos
- ✅ **Padronização**: Documentos seguem formato legal correto
- ✅ **Facilidade**: Interface intuitiva e amigável
- ✅ **Segurança**: Auto-save previne perda de dados
- ✅ **Flexibilidade**: Editor poderoso para personalização
- ✅ **Profissionalismo**: Documentos com aparência oficial

### Próximas Melhorias Planejadas:
- [ ] Versionamento de documentos
- [ ] Colaboração em tempo real
- [ ] Assinatura digital
- [ ] Integração com sistema de tramitação
- [ ] Templates personalizáveis pelo usuário
- [ ] Histórico de alterações detalhado

---

**Versão**: 2.0  
**Última Atualização**: Janeiro 2025  
**Autor**: Sistema LegisTemplate 