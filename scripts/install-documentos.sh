#!/bin/bash

echo "🚀 Instalando Sistema de Documentos e Templates - LegisTemplate"
echo "================================================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

# Instalar dependências do ProseMirror
echo "📦 Instalando dependências do ProseMirror..."
npm install prosemirror-state prosemirror-view prosemirror-model prosemirror-transform prosemirror-schema-basic prosemirror-schema-list prosemirror-commands prosemirror-keymap prosemirror-history prosemirror-inputrules prosemirror-gapcursor prosemirror-dropcursor prosemirror-menu

# Verificar se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Criar estrutura de pastas se não existir
echo "📁 Criando estrutura de pastas..."
mkdir -p src/app/admin/documentos/editor
mkdir -p src/components/editor
mkdir -p src/api/admin/documentos

echo "🎯 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: http://localhost:3000/admin/documentos"
echo "2. Escolha um template na aba 'Templates Disponíveis'"
echo "3. Clique em 'Usar Template' para abrir o editor em nova aba"
echo ""
echo "📖 Documentação completa: docs/DOCUMENTOS_SISTEMA_README.md"
echo ""
echo "🔧 Configuração:"
echo "- Edite as informações da câmara em: src/app/admin/documentos/editor/page.tsx"
echo "- Personalize templates em: src/components/editor/templates.ts"
echo "- Modifique estilos em: src/components/editor/prosemirror.css"
echo ""
echo "✨ O sistema está pronto para uso!" 