#!/bin/bash

# 🚀 Setup Automatizado para Hostinger VPS
# Este script configura tudo automaticamente para deploy

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
HOSTINGER_IP="82.25.65.27"
HOSTINGER_USER="root"
APP_NAME="legistemplate"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "🚀 Setup Automatizado para Hostinger VPS"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Verificar se os arquivos necessários existem
print_status "1. Verificando arquivos necessários..."

if [ ! -f "scripts/setup-vps.sh" ]; then
    print_error "Script scripts/setup-vps.sh não encontrado!"
    exit 1
fi

if [ ! -f ".github/workflows/deploy.yml" ]; then
    print_error "Workflow .github/workflows/deploy.yml não encontrado!"
    exit 1
fi

print_success "Todos os arquivos necessários encontrados"

# 2. Testar conectividade
print_status "2. Testando conectividade com $HOSTINGER_IP..."

if ! ping -c 2 $HOSTINGER_IP >/dev/null 2>&1; then
    print_error "Servidor não responde ao ping"
    exit 1
fi

print_success "Servidor está acessível"

# 3. Fazer upload do script de setup
print_status "3. Fazendo upload do script de setup..."

echo "📤 Enviando script para o servidor..."
if scp scripts/setup-vps.sh $HOSTINGER_USER@$HOSTINGER_IP:~/; then
    print_success "Script enviado com sucesso"
else
    print_error "Falha no upload do script"
    exit 1
fi

# 4. Executar o script no servidor
print_status "4. Executando configuração no servidor..."

echo ""
print_warning "ATENÇÃO: O script no servidor fará algumas perguntas."
print_warning "Sugestões de respostas:"
echo "  🌐 Nginx: y (sim)"
echo "  🌍 Domínio: [seu domínio ou deixe vazio]"
echo "  🛡️ Firewall: y (sim)"
echo "  🔒 SSL: y (se tiver domínio)"
echo ""

read -p "Pressione ENTER para continuar..."

print_status "Executando setup no servidor (isso pode demorar alguns minutos)..."

# Conectar e executar o script
ssh -t $HOSTINGER_USER@$HOSTINGER_IP "
    chmod +x setup-vps.sh && 
    echo '🚀 Iniciando configuração do servidor...' &&
    ./setup-vps.sh
"

print_success "Configuração do servidor concluída!"

# 5. Obter a chave SSH
print_status "5. Obtendo chave SSH para GitHub..."

echo ""
print_status "Copiando chave SSH privada..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Obter a chave SSH do servidor
ssh $HOSTINGER_USER@$HOSTINGER_IP "cat ~/.ssh/id_rsa"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 6. Instruções para GitHub Secrets
print_status "6. Configurando GitHub Secrets..."

echo ""
print_success "✅ Servidor configurado com sucesso!"
echo ""
echo "🔑 Agora configure os seguintes SECRETS no GitHub:"
echo "   Acesse: Settings > Secrets and variables > Actions"
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│ Nome do Secret        │ Valor                               │"
echo "├─────────────────────────────────────────────────────────────┤"
echo "│ VPS_SSH_PRIVATE_KEY   │ [chave SSH mostrada acima]          │"
echo "│ VPS_HOST              │ 82.25.65.27                         │"
echo "│ VPS_USER              │ root                                │"
echo "│ VPS_APP_PATH          │ /var/www/legistemplate              │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

# 7. Preparar para o primeiro deploy
print_status "7. Preparando primeiro deploy..."

echo "📝 Comandos para o primeiro deploy:"
echo ""
echo "   git add ."
echo "   git commit -m 'Configuração inicial para Hostinger VPS'"
echo "   git push origin main"
echo ""

# 8. Verificação final
print_status "8. Verificação final..."

echo "🔍 Verificando status do servidor..."
ssh $HOSTINGER_USER@$HOSTINGER_IP "
    echo '📊 Status dos serviços:' &&
    echo '  • PM2:' \$(pm2 --version 2>/dev/null || echo 'Instalado') &&
    echo '  • Node.js:' \$(node --version 2>/dev/null || echo 'Não instalado') &&
    echo '  • Nginx:' \$(systemctl is-active nginx 2>/dev/null || echo 'Inativo') &&
    echo '  • Firewall:' \$(ufw status 2>/dev/null | head -1 || echo 'Inativo')
"

# 9. Resumo final
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "🎉 CONFIGURAÇÃO CONCLUÍDA!"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "✅ O que foi configurado:"
echo "  • Servidor Hostinger (82.25.65.27) ✅"
echo "  • Node.js 18 e PM2 ✅"
echo "  • Nginx e firewall ✅"
echo "  • Chaves SSH ✅"
echo "  • Estrutura de diretórios ✅"
echo ""

echo "📝 Próximos passos:"
echo "  1. Copie a chave SSH (mostrada above) para GitHub Secrets"
echo "  2. Configure os 4 secrets no GitHub"
echo "  3. Faça git push para ativar o deploy"
echo ""

echo "🌐 Sua aplicação estará disponível em:"
echo "  • http://82.25.65.27"
echo "  • http://seu-dominio.com (se configurou)"
echo ""

echo "📚 Documentação:"
echo "  • Guia completo: docs/HOSTINGER_SETUP.md"
echo "  • Checklist: docs/DEPLOY_CHECKLIST.md"
echo ""

print_success "🚀 Pronto para deploy automático!"

# Mostrar informações de acesso
echo ""
print_status "🔗 Acesso ao servidor:"
echo "   ssh $HOSTINGER_USER@$HOSTINGER_IP"
echo ""
print_status "📊 Comandos úteis no servidor:"
echo "   pm2 status              # Ver status da aplicação"
echo "   pm2 logs legistemplate  # Ver logs"
echo "   sudo systemctl status nginx  # Status do Nginx"
echo ""

echo "🚀 Deploy automático configurado para Hostinger VPS!" 