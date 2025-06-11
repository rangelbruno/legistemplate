'use client'

import { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './fluxograma.module.css'
import CustomNode from './components/CustomNode'

// Tipos de nós personalizados
const nodeTypes = {
  custom: CustomNode,
}

// Nós iniciais do fluxo de tramitação
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: (
        <div className="p-3">
          <div className="fw-bold text-primary">📝 Apresentação</div>
          <div className="fs-7 text-muted">Proposição é protocolizada</div>
        </div>
      )
    },
    position: { x: 250, y: 25 },
    style: {
      background: '#fff',
      border: '2px solid #0d6efd',
      borderRadius: '8px',
      width: 200,
    },
  },
  {
    id: '2',
    data: { 
      label: (
        <div className="p-3">
          <div className="fw-bold text-warning">📋 Análise Preliminar</div>
          <div className="fs-7 text-muted">Verificação de requisitos</div>
        </div>
      )
    },
    position: { x: 250, y: 125 },
    style: {
      background: '#fff',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      width: 200,
    },
  },
  {
    id: '3',
    data: { 
      label: (
        <div className="p-3">
          <div className="fw-bold text-info">🏛️ Comissão</div>
          <div className="fs-7 text-muted">Análise técnica</div>
        </div>
      )
    },
    position: { x: 100, y: 225 },
    style: {
      background: '#fff',
      border: '2px solid #0dcaf0',
      borderRadius: '8px',
      width: 200,
    },
  },
  {
    id: '4',
    data: { 
      label: (
        <div className="p-3">
          <div className="fw-bold text-purple">⚖️ Plenário</div>
          <div className="fs-7 text-muted">Votação final</div>
        </div>
      )
    },
    position: { x: 400, y: 225 },
    style: {
      background: '#fff',
      border: '2px solid #6f42c1',
      borderRadius: '8px',
      width: 200,
    },
  },
  {
    id: '5',
    type: 'output',
    data: { 
      label: (
        <div className="p-3">
          <div className="fw-bold text-success">✅ Aprovada</div>
          <div className="fs-7 text-muted">Proposição aprovada</div>
        </div>
      )
    },
    position: { x: 250, y: 325 },
    style: {
      background: '#fff',
      border: '2px solid #198754',
      borderRadius: '8px',
      width: 200,
    },
  },
]

// Conexões iniciais
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
]

// Componente da barra de ferramentas
const Toolbar = ({ onAddNode, onSaveFlow, onLoadFlow }: {
  onAddNode: (type: string) => void
  onSaveFlow: () => void
  onLoadFlow: () => void
}) => {
  return (
    <Panel position="top-left" className="flow-panel flow-toolbar p-3">
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <h6 className="mb-0 me-3">🛠️ Ferramentas</h6>
        
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => onAddNode('default')}
          title="Adicionar Etapa"
        >
          ➕ Etapa
        </button>
        
        <button 
          className="btn btn-sm btn-info"
          onClick={() => onAddNode('input')}
          title="Adicionar Início"
        >
          🏁 Início
        </button>
        
        <button 
          className="btn btn-sm btn-success"
          onClick={() => onAddNode('output')}
          title="Adicionar Fim"
        >
          🎯 Fim
        </button>
        
        <div className="vr"></div>
        
        <button 
          className="btn btn-sm btn-secondary"
          onClick={onSaveFlow}
          title="Salvar Fluxograma"
        >
          💾 Salvar
        </button>
        
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={onLoadFlow}
          title="Carregar Fluxograma"
        >
          📁 Carregar
        </button>
      </div>
    </Panel>
  )
}

// Componente principal do fluxograma
const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [nodeId, setNodeId] = useState(6)
  const { getViewport, setViewport } = useReactFlow()
  const yPos = useRef(0)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Adicionar novo nó
  const onAddNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${nodeId}`,
      type,
      data: { 
        label: (
          <div className="p-3">
            <div className="fw-bold">🔧 Nova Etapa</div>
            <div className="fs-7 text-muted">Clique para editar</div>
          </div>
        )
      },
      position: { x: Math.random() * 400, y: yPos.current },
      style: {
        background: '#fff',
        border: '2px solid #6c757d',
        borderRadius: '8px',
        width: 200,
      },
    }
    
    setNodes((nds) => nds.concat(newNode))
    setNodeId((id) => id + 1)
    yPos.current += 100
  }, [nodeId, setNodes])

  // Salvar fluxograma
  const onSaveFlow = useCallback(() => {
    const flow = {
      nodes,
      edges,
      viewport: getViewport(),
    }
    localStorage.setItem('tramitacao-flow', JSON.stringify(flow))
    
    // Mostrar notificação de sucesso
    const toast = document.createElement('div')
    toast.className = 'toast-container position-fixed top-0 end-0 p-3'
    toast.innerHTML = `
      <div class="toast show" role="alert">
        <div class="toast-header">
          <strong class="me-auto">✅ Sucesso</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          Fluxograma salvo com sucesso!
        </div>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }, [nodes, edges, getViewport])

  // Carregar fluxograma
  const onLoadFlow = useCallback(() => {
    const savedFlow = localStorage.getItem('tramitacao-flow')
    if (savedFlow) {
      const flow = JSON.parse(savedFlow)
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 })
    }
  }, [setNodes, setEdges, setViewport])

  return (
    <div className="h-100 w-100 position-relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor="#6c757d"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#dee2e6"
        />
        
        <Toolbar 
          onAddNode={onAddNode}
          onSaveFlow={onSaveFlow}
          onLoadFlow={onLoadFlow}
        />
        
        {/* Painel de informações */}
        <Panel position="top-right" className="flow-panel p-3" style={{ width: '280px' }}>
          <div>
            <h6 className="text-primary mb-3">📊 Informações do Fluxo</h6>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="card bg-light">
                  <div className="card-body p-2 text-center">
                    <div className="fs-4 fw-bold text-primary">{nodes.length}</div>
                    <div className="fs-7 text-muted">Etapas</div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-light">
                  <div className="card-body p-2 text-center">
                    <div className="fs-4 fw-bold text-success">{edges.length}</div>
                    <div className="fs-7 text-muted">Conexões</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-top pt-3">
              <h6 className="fs-7 text-uppercase text-muted mb-2">Ações Rápidas</h6>
              <div className="d-grid gap-1">
                <button className="btn btn-sm btn-outline-primary">
                  📋 Exportar PDF
                </button>
                <button className="btn btn-sm btn-outline-success">
                  📤 Compartilhar
                </button>
                <button className="btn btn-sm btn-outline-warning">
                  🔄 Versionar
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// Componente wrapper com provider
const FluxogramaPage = () => {
  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="bg-white border-bottom p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-1">🔄 Editor de Fluxogramas</h1>
            <p className="text-muted mb-0">
              Crie e edite fluxogramas de tramitação de forma visual e interativa
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              📋 Templates
            </button>
            <button className="btn btn-primary">
              ➕ Novo Fluxo
            </button>
          </div>
        </div>
      </div>
      
      {/* Flow Editor */}
      <div className="flex-grow-1 position-relative">
        <ReactFlowProvider>
          <FlowChart />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

export default FluxogramaPage 