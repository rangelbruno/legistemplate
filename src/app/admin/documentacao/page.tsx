'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, Book, Search, Menu, X, ChevronRight, Calendar, Tag, ArrowLeft, User, Settings, Code, Database, Folder, ChevronLeft, Home } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Link } from 'react-router-dom'
import './documentacao.css'

interface DocFile {
  name: string
  path: string
  content?: string
  size: number
  lastModified: string
  category: string
  type: 'file' | 'directory'
  children?: DocFile[]
}

interface DocCategory {
  name: string
  icon: React.ReactNode
  color: string
  files: DocFile[]
  description: string
}

// Componente Timeline Horizontal Performático
const HorizontalTimeline = React.memo(() => {
  const [activePhase, setActivePhase] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Dados da timeline memoizados para performance
  const timelineData = useMemo(() => [
    {
      id: 'junho-2025',
      title: 'Fundação',
      subtitle: 'Base do Sistema',
      date: 'Junho 2025',
      status: 'completed',
      progress: 100,
      icon: '📋',
      color: 'green',
      tasks: [
        { icon: '🏗️', title: 'Arquitetura Base', desc: 'Next.js 14, Prisma, PostgreSQL, Metronic UI', status: 'completed' },
        { icon: '🔐', title: 'Sistema de Autenticação', desc: 'Login, roles (Admin, Parlamentar, Público)', status: 'completed' },
        { icon: '👨‍💼', title: 'Área Administrativa', desc: 'Dashboard, configurações, gestão de usuários', status: 'completed' },
        { icon: '📝', title: 'Editor de Documentos', desc: 'Editor WYSIWYG estilo Word completo', status: 'completed' },
        { icon: '📚', title: 'Sistema de Documentação', desc: 'Interface independente, títulos amigáveis', status: 'completed' }
      ]
    },
    {
      id: 'julho-2025',
      title: 'Funcionalidades Core',
      subtitle: 'Desenvolvimento Principal',
      date: 'Julho 2025',
      status: 'in-progress',
      progress: 40,
      icon: '🚀',
      color: 'blue',
      tasks: [
        { icon: '🏛️', title: 'Área Parlamentar', desc: 'Dashboard personalizado, perfil, agenda', status: 'completed' },
        { icon: '📄', title: 'Sistema de Proposições', desc: 'CRUD completo, tramitação, status', status: 'in-progress' },
        { icon: '👥', title: 'Gestão de Comissões', desc: 'Criação, membros, reuniões, pareceres', status: 'pending' },
        { icon: '📊', title: 'Relatórios Básicos', desc: 'Estatísticas, gráficos, exportação', status: 'pending' },
        { icon: '🔔', title: 'Sistema de Notificações', desc: 'Alertas, prazos, atualizações', status: 'pending' }
      ]
    },
    {
      id: 'agosto-2025',
      title: 'Finalização',
      subtitle: 'Entrega Final',
      date: 'Agosto 2025',
      status: 'pending',
      progress: 0,
      icon: '🎯',
      color: 'gray',
      tasks: [
        { icon: '🌐', title: 'Portal Público', desc: 'Transparência, consulta de proposições', status: 'pending' },
        { icon: '🔍', title: 'Sistema de Busca', desc: 'Pesquisa avançada, filtros, indexação', status: 'pending' },
        { icon: '🧪', title: 'Testes e QA', desc: 'Testes unitários, integração, E2E', status: 'pending' },
        { icon: '🚀', title: 'Deploy e Entrega', desc: 'Ambiente de produção, documentação', status: 'pending' }
      ]
    }
  ], [])

  // Navegação entre fases com callback otimizado
  const navigateToPhase = useCallback((index: number) => {
    if (index === activePhase || isAnimating) return;
    
    setIsAnimating(true);
    setActivePhase(index);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [activePhase, isAnimating]);

  const nextPhase = useCallback(() => {
    if (activePhase < timelineData.length - 1) {
      navigateToPhase(activePhase + 1)
    }
  }, [activePhase, timelineData.length, navigateToPhase])

  const prevPhase = useCallback(() => {
    if (activePhase > 0) {
      navigateToPhase(activePhase - 1)
    }
  }, [activePhase, navigateToPhase])

  // Auto-play opcional (desabilitado por padrão para melhor UX)
  useEffect(() => {
    // Pode ser ativado se necessário
    // const interval = setInterval(nextPhase, 5000)
    // return () => clearInterval(interval)
  }, [nextPhase])

  const currentPhase = timelineData[activePhase]

  return (
    <div className="horizontal-timeline">
      {/* Header da Timeline */}
      <div className="timeline-header">
        <div className="timeline-header-content">
          <Calendar size={32} className="timeline-header-icon" />
          <div>
            <h3>Cronograma de Desenvolvimento - Sistema Parlamentar</h3>
            <p className="timeline-subtitle">Junho 2025 → Agosto 2025 | Primeira Entrega</p>
          </div>
        </div>
      </div>

      {/* Navegação das Fases */}
      <div className="timeline-navigation">
        <button 
          onClick={prevPhase}
          disabled={activePhase === 0}
          className="nav-button prev"
          aria-label="Fase anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="phases-container">
          {timelineData.map((phase, index) => (
            <div
              key={phase.id}
              className={`phase-indicator ${phase.status} ${index === activePhase ? 'active' : ''}`}
              onClick={() => navigateToPhase(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToPhase(index)}
            >
              <div className="phase-indicator-content">
                <div className="phase-icon">{phase.icon}</div>
                <div className="phase-info">
                  <span className="phase-date">{phase.date}</span>
                  <span className="phase-title">{phase.title}</span>
                </div>
              </div>
              <div className="phase-line"></div>
            </div>
          ))}
        </div>

        <button 
          onClick={nextPhase}
          disabled={activePhase === timelineData.length - 1}
          className="nav-button next"
          aria-label="Próxima fase"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Conteúdo da Fase Ativa */}
      <div className={`phase-content ${isAnimating ? 'animating' : ''}`}>
        <div className={`phase-card ${currentPhase.status}`}>
          <div className="card-header">
            <div className="header-left">
              <div className="phase-icon-large">{currentPhase.icon}</div>
              <div className="header-info">
                <h4>{currentPhase.title}</h4>
                <p>{currentPhase.subtitle}</p>
              </div>
            </div>
            <div className="header-right">
              <div className={`status-badge ${currentPhase.status}`}>
                {currentPhase.status === 'completed' && '✅ Concluído'}
                {currentPhase.status === 'in-progress' && '🔄 Em Andamento'}
                {currentPhase.status === 'pending' && '⏳ Planejado'}
              </div>
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${currentPhase.progress}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">
                    {currentPhase.progress}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="tasks-grid">
            {currentPhase.tasks.map((task, index) => (
              <div 
                key={`${currentPhase.id}-task-${index}`}
                className={`task-card ${task.status}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="task-icon">{task.icon}</div>
                <div className="task-content">
                  <h5>{task.title}</h5>
                  <p>{task.desc}</p>
                </div>
                <div className={`task-status ${task.status}`}>
                  {task.status === 'completed' && '✓'}
                  {task.status === 'in-progress' && '◐'}
                  {task.status === 'pending' && '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de Progresso */}
      <div className="timeline-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((activePhase + 1) / timelineData.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-info">
          <span>Fase {activePhase + 1} de {timelineData.length}</span>
          <span>{currentPhase.progress}% Completo</span>
        </div>
      </div>
    </div>
  )
})

HorizontalTimeline.displayName = 'HorizontalTimeline'

export default function DocumentacaoPage() {
  console.log('🚀 Página de Documentação sendo renderizada!')
  
  const [docFiles, setDocFiles] = useState<DocFile[]>([])
  const [categories, setCategories] = useState<DocCategory[]>([])
  const [selectedFile, setSelectedFile] = useState<DocFile | null>(null)
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const handleGoHome = useCallback(() => {
    setSelectedFile(null)
    setMarkdownContent('')
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // Lista completa dos arquivos MD disponíveis com títulos extraídos do conteúdo
  const availableFiles: DocFile[] = useMemo(() => [
    // Memory Bank
    {
      name: 'Project Brief - Sistema de Tramitação Parlamentar',
      path: 'memory-bank/projectbrief.md',
      size: 2048,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
    {
      name: 'Contexto do Produto - Portal Legislativo',
      path: 'memory-bank/productContext.md',
      size: 3072,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
    {
      name: 'Arquitetura do Sistema - Next.js App Router',
      path: 'memory-bank/systemArchitecture.md',
      size: 4096,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
     {
      name: 'Stack de Tecnologia - Next.js e Metronic',
      path: 'memory-bank/techStack.md',
      size: 2800,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
    {
      name: 'Contexto Ativo - Desenvolvimento Atual',
      path: 'memory-bank/activeContext.md',
      size: 1536,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
    {
      name: 'Progresso do Projeto - Status Atual',
      path: 'memory-bank/progress.md',
      size: 2560,
      lastModified: new Date().toISOString(),
      category: 'Memory Bank',
      type: 'file'
    },
    
    // Documentação do Sistema
    {
      name: 'Títulos Amigáveis - Sistema de Documentação',
      path: 'TITULOS_AMIGAVEIS_DOCUMENTACAO.md',
      size: 18000,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    {
      name: 'Interface Independente de Documentação - Implementação Final',
      path: 'DOCUMENTACAO_INTERFACE_INDEPENDENTE.md',
      size: 15000,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    {
      name: 'Sistema de Documentação - Implementação Final',
      path: 'SISTEMA_DOCUMENTACAO_FINAL.md',
      size: 9500,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    {
      name: 'Sistema de Documentação - Visualizador de Arquivos MD',
      path: 'DOCUMENTACAO_SISTEMA_README.md',
      size: 8500,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    {
      name: 'Teste de Documentação - Verificação do Sistema',
      path: 'teste-documentacao.md',
      size: 1200,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    {
      name: 'Estrutura de Pastas - Organização do Sistema',
      path: 'estrutura-pastas-sistema.md',
      size: 12000,
      lastModified: new Date().toISOString(),
      category: 'Documentação',
      type: 'file'
    },
    
    // Administração
    {
      name: 'Sistema de Gerenciamento de Usuários - Área Administrativa',
      path: 'ADMIN_USER_README.md',
      size: 6800,
      lastModified: new Date().toISOString(),
      category: 'Administração',
      type: 'file'
    },
    {
      name: 'Sistema de Configurações Administrativas',
      path: 'ADMIN_CONFIG_SYSTEM_README.md',
      size: 7400,
      lastModified: new Date().toISOString(),
      category: 'Administração',
      type: 'file'
    },
    {
      name: 'Sistema de Autenticação e Autorização',
      path: 'AUTH_README.md',
      size: 5400,
      lastModified: new Date().toISOString(),
      category: 'Administração',
      type: 'file'
    },
    
    // Editor de Documentos
    {
      name: 'Editor de Documentos Estilo Word - Implementação Completa',
      path: 'EDITOR_WORD_LIKE_README.md',
      size: 10000,
      lastModified: new Date().toISOString(),
      category: 'Editor',
      type: 'file'
    },
    {
      name: 'Editor de Documentos - Resumo da Implementação',
      path: 'EDITOR_IMPLEMENTADO_RESUMO.md',
      size: 5700,
      lastModified: new Date().toISOString(),
      category: 'Editor',
      type: 'file'
    },

    // Backend
    {
      name: 'Estrutura da API - Endpoints e Padrões',
      path: 'API_STRUCTURE_README.md',
      size: 8100,
      lastModified: new Date().toISOString(),
      category: 'Backend',
      type: 'file'
    },

    // Sistema
    {
      name: 'Configuração do Ambiente de Desenvolvimento',
      path: 'DEV_ENV_SETUP_README.md',
      size: 3200,
      lastModified: new Date().toISOString(),
      category: 'Sistema',
      type: 'file'
    },
    {
      name: 'Deploy e Build - Processo de CI/CD',
      path: 'DEPLOY_BUILD_README.md',
      size: 4500,
      lastModified: new Date().toISOString(),
      category: 'Sistema',
      type: 'file'
    },
    
    // Cronograma
    {
      name: 'Cronograma de Desenvolvimento - 2025',
      path: 'CRONOGRAMA_DESENVOLVIMENTO_2025.md',
      size: 4500,
      lastModified: new Date().toISOString(),
      category: 'Cronograma',
      type: 'file'
    }
  ], []);

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'Memory Bank': return <Book size={18} />
      case 'Documentação': return <FileText size={18} />
      case 'Administração': return <User size={18} />
      case 'Editor': return <Code size={18} />
      case 'Backend': return <Database size={18} />
      case 'Sistema': return <Settings size={18} />
      case 'Cronograma': return <Calendar size={18} />
      default: return <Folder size={18} />
    }
  }, []);

  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case 'Memory Bank': return 'blue'
      case 'Documentação': return 'green'
      case 'Administração': return 'red'
      case 'Editor': return 'purple'
      case 'Cronograma': return 'orange'
      case 'Backend': return 'indigo'
      case 'Sistema': return 'teal'
      default: return 'gray'
    }
  }, []);

  const getCategoryDescription = useCallback((category: string) => {
    switch (category) {
      case 'Memory Bank': return 'Arquivos de base e contexto do projeto.'
      case 'Documentação': return 'Guias e documentação técnica do sistema.'
      case 'Administração': return 'Gerenciamento de usuários e configs.'
      case 'Editor': return 'Detalhes sobre o editor de documentos.'
      case 'Cronograma': return 'Planejamento e progresso do dev.'
      case 'Backend': return 'APIs, banco de dados e serviços.'
      case 'Sistema': return 'Configurações de ambiente e deploy.'
      default: return 'Documentos diversos.'
    }
  }, []);

  const categorizeFiles = useCallback((files: DocFile[]) => {
    const categoryMap = new Map<string, DocFile[]>()
    
    files.forEach(file => {
      const cat = file.category || 'Outros'
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, [])
      }
      categoryMap.get(cat)!.push(file)
    })
    
    // Definir ordem específica das categorias - Backend e Cronograma no topo
    const categoryOrder = [
      'Backend',
      'Cronograma',
      'Memory Bank', 
      'Documentação', 
      'Administração', 
      'Editor', 
      'Sistema'
    ]
    
    // Criar categorias na ordem especificada
    const newCategories: DocCategory[] = []
    
    // Adicionar categorias na ordem definida
    categoryOrder.forEach(categoryName => {
      if (categoryMap.has(categoryName)) {
        newCategories.push({
          name: categoryName,
          files: categoryMap.get(categoryName)!,
          icon: getCategoryIcon(categoryName),
          color: getCategoryColor(categoryName),
          description: getCategoryDescription(categoryName),
        })
      }
    })
    
    // Adicionar qualquer categoria restante que não estava na ordem definida
    Array.from(categoryMap.keys()).forEach(categoryName => {
      if (!categoryOrder.includes(categoryName)) {
        newCategories.push({
          name: categoryName,
          files: categoryMap.get(categoryName)!,
          icon: getCategoryIcon(categoryName),
          color: getCategoryColor(categoryName),
          description: getCategoryDescription(categoryName),
        })
      }
    })

    setCategories(newCategories)
  }, [getCategoryIcon, getCategoryColor, getCategoryDescription]);

  // Carregar arquivos disponíveis
  useEffect(() => {
    const loadDocFiles = async () => {
      try {
        setLoading(true)
        // Simula a busca de arquivos, mas usa a lista estática com títulos
        const filesWithCategory = availableFiles.map((file) => ({
          ...file,
          category: file.category || 'Outros',
        }));
        setDocFiles(filesWithCategory);
        categorizeFiles(filesWithCategory);
      } catch (error) {
        console.error("Failed to load documents", error);
      } finally {
        setLoading(false)
      }
    }
    loadDocFiles()
  }, [availableFiles, categorizeFiles])

  const loadFileContent = useCallback(async (file: DocFile) => {
    if (isMobile) {
      setSidebarOpen(false)
    }
    if (selectedFile?.path === file.path) return

    setSelectedFile(file)
    setMarkdownContent('## Carregando conteúdo...')

    try {
      // Carregar arquivo MD diretamente via fetch do diretório público
      const response = await fetch(`/docs/${file.path}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      
      // Extrai o título do H1, se existir, senão usa o nome do arquivo
      const match = text.match(/^#\s+(.*)/)
      const title = match ? match[1] : file.name

      // Atualiza o nome do arquivo na lista (opcional, para consistência)
      setDocFiles(prevFiles => 
        prevFiles.map(f => f.path === file.path ? { ...f, name: title } : f)
      );
      setSelectedFile(prevFile => prevFile ? { ...prevFile, name: title } : null);

      setMarkdownContent(text)
    } catch (error) {
      console.error('Falha ao carregar o documento:', error)
      setMarkdownContent(
        `# Erro ao carregar o documento\n\nNão foi possível encontrar ou carregar o arquivo \`${file.path}\`. Por favor, verifique se o arquivo existe na pasta \`public/docs\` e tente novamente.`
      )
    }
  }, [isMobile, selectedFile?.path]);

  const getFilteredFiles = useCallback((files: DocFile[]) => {
    if (!searchTerm) return files
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm]);

  const filteredCategories = useMemo(() => categories
    .map(category => ({
      ...category,
      files: getFilteredFiles(category.files),
    }))
    .filter(
      category =>
        (selectedCategory === 'all' || category.name === selectedCategory) &&
        category.files.length > 0
    ), [categories, getFilteredFiles, selectedCategory]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, []);

  const markdownComponents = useMemo(() => ({
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow as any}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }), []);

  if (loading) {
    return (
      <div className="docs-loading-fullpage">
        <div className="docs-spinner"></div>
        <p>Carregando sistema de documentação...</p>
      </div>
    )
  }

  return (
    <div className="docs-page">
      <header className="docs-header">
        <div className="docs-header-content">
          <div className="docs-header-left">
            <button 
              className="docs-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="docs-title">
              <Book size={24} className="docs-title-icon" />
              <h1>Documentação do Sistema</h1>
            </div>
          </div>
          <div className="docs-header-right">
            <Link to="/admin" className="docs-back-btn">
              <ArrowLeft size={16} />
              <span>Voltar ao Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Sidebar */}
        <aside className={`docs-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="docs-sidebar-content">
            {/* Busca */}
            <div className="docs-search">
              <div className="docs-search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por Categoria */}
            <div className="docs-filter">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="docs-category-select"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.files.length})
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Categorias e Arquivos */}
            <div className="docs-menu">
              <div
                className={`docs-file-item home-item ${!selectedFile ? 'active' : ''}`}
                onClick={handleGoHome}
              >
                <Home size={16} />
                <div className="docs-file-info">
                  <h4>Início</h4>
                  <div className="docs-file-meta">
                    <span>Visão geral do projeto</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="docs-loading">
                  <div className="docs-spinner"></div>
                  <p>Carregando documentos...</p>
                </div>
              ) : (
                filteredCategories.map(category => (
                  <div key={category.name} className="docs-category">
                    <div className={`docs-category-header docs-category-${category.color}`}>
                      {category.icon}
                      <div className="docs-category-info">
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                      </div>
                      <span className="docs-category-count">
                        {getFilteredFiles(category.files).length}
                      </span>
                    </div>
                    
                    <div className="docs-category-files">
                      {getFilteredFiles(category.files).map(file => (
                        <div
                          key={file.path}
                          className={`docs-file-item ${
                            selectedFile?.path === file.path ? 'active' : ''
                          }`}
                          onClick={() => loadFileContent(file)}
                        >
                          <FileText size={16} />
                          <div className="docs-file-info">
                            <h4>{file.name}</h4>
                            <div className="docs-file-meta">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{formatDate(file.lastModified)}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Área Principal - Visualizador de Markdown */}
        <main className="docs-main">
          {selectedFile && markdownContent ? (
            <div className="docs-content">
                             <div className="docs-content-header">
                 <div className="docs-content-title">
                   <h1>{selectedFile.name}</h1>
                   <div className="docs-content-meta">
                     <Tag size={14} />
                     <span>{selectedFile.category}</span>
                     <span>•</span>
                     <Calendar size={14} />
                     <span>Atualizado em {formatDate(selectedFile.lastModified)}</span>
                     <span>•</span>
                     <span>{formatFileSize(selectedFile.size)}</span>
                   </div>
                 </div>
                
                {isMobile && (
                  <button 
                    className="docs-mobile-menu"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={16} />
                  </button>
                )}
              </div>
              
              <div className="docs-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="docs-empty">
              <Book size={64} />
              
              {/* Métricas de Progresso */}
              <div className="progress-metrics">
                <div className="metric-card">
                  <div className="metric-value">65%</div>
                  <div className="metric-label">Progresso Geral</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">12</div>
                  <div className="metric-label">Funcionalidades Concluídas</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">6</div>
                  <div className="metric-label">Em Desenvolvimento</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">45</div>
                  <div className="metric-label">Dias para Entrega</div>
                </div>
              </div>
              
              <div className="docs-stats">
                <div className="docs-stat">
                  <strong>{docFiles.length}</strong>
                  <span>Documentos</span>
                </div>
                <div className="docs-stat">
                  <strong>{categories.length}</strong>
                  <span>Categorias</span>
                </div>
              </div>

              {/* Cronograma Horizontal Performático */}
              <HorizontalTimeline />

            </div>
          )}
        </main>
      </div>

      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="docs-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
} 