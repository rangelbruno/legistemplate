#!/bin/bash

# 🧪 Script de Teste para VPS Hostinger
# Testa conectividade e configurações básicas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações da Hostinger
HOSTINGER_IP="82.25.65.27"
HOSTINGER_USER="root"  # Altere se necessário

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

print_status "🧪 Testando VPS Hostinger (IP: $HOSTINGER_IP)"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Teste de conectividade básica
print_status "1. Testando conectividade básica..."
if ping -c 3 $HOSTINGER_IP >/dev/null 2>&1; then
    print_success "Servidor responde ao ping"
else
    print_error "Servidor não responde ao ping"
    exit 1
fi

# 2. Teste de porta SSH
print_status "2. Testando porta SSH (22)..."
if nc -z -v -w5 $HOSTINGER_IP 22 2>/dev/null; then
    print_success "Porta SSH (22) está aberta"
else
    print_error "Porta SSH (22) não está acessível"
    exit 1
fi

# 3. Teste de conexão SSH
print_status "3. Testando conexão SSH..."
echo "Tentando conectar via SSH (pode solicitar senha/confirmação)..."

# Teste de conexão SSH não interativo
if ssh -o BatchMode=yes -o ConnectTimeout=10 $HOSTINGER_USER@$HOSTINGER_IP exit 2>/dev/null; then
    print_success "Conexão SSH funcionando com chave"
    SSH_WORKS=1
else
    print_warning "Conexão SSH via chave não configurada ainda (normal na primeira vez)"
    SSH_WORKS=0
fi

# 4. Informações do servidor (se SSH funcionar)
if [ $SSH_WORKS -eq 1 ]; then
    print_status "4. Coletando informações do servidor..."
    
    # Sistema operacional
    OS_INFO=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "cat /etc/os-release | grep PRETTY_NAME" 2>/dev/null | cut -d'"' -f2)
    if [ ! -z "$OS_INFO" ]; then
        print_success "Sistema: $OS_INFO"
    fi
    
    # Memória
    MEMORY=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "free -h | grep Mem | awk '{print \$2}'" 2>/dev/null)
    if [ ! -z "$MEMORY" ]; then
        print_success "Memória total: $MEMORY"
    fi
    
    # Espaço em disco
    DISK=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "df -h / | tail -1 | awk '{print \$2}'" 2>/dev/null)
    if [ ! -z "$DISK" ]; then
        print_success "Espaço em disco: $DISK"
    fi
    
    # CPU
    CPU=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "nproc" 2>/dev/null)
    if [ ! -z "$CPU" ]; then
        print_success "CPUs: $CPU cores"
    fi
    
    # Node.js (se instalado)
    NODE_VERSION=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "node --version" 2>/dev/null || echo "Não instalado")
    print_status "Node.js: $NODE_VERSION"
    
    # PM2 (se instalado)
    PM2_VERSION=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "pm2 --version" 2>/dev/null || echo "Não instalado")
    print_status "PM2: $PM2_VERSION"
    
    # Nginx (se instalado)
    NGINX_STATUS=$(ssh $HOSTINGER_USER@$HOSTINGER_IP "systemctl is-active nginx" 2>/dev/null || echo "Não instalado")
    print_status "Nginx: $NGINX_STATUS"
    
else
    print_status "4. Pulando informações detalhadas (SSH via chave não configurado)"
fi

# 5. Teste de portas web
print_status "5. Testando portas web..."

# Porta 80 (HTTP)
if nc -z -v -w5 $HOSTINGER_IP 80 2>/dev/null; then
    print_success "Porta 80 (HTTP) está aberta"
else
    print_warning "Porta 80 (HTTP) não está acessível"
fi

# Porta 443 (HTTPS)
if nc -z -v -w5 $HOSTINGER_IP 443 2>/dev/null; then
    print_success "Porta 443 (HTTPS) está aberta"
else
    print_warning "Porta 443 (HTTPS) não está acessível"
fi

# Porta 3000 (aplicação)
if nc -z -v -w5 $HOSTINGER_IP 3000 2>/dev/null; then
    print_success "Porta 3000 (aplicação) está aberta"
else
    print_warning "Porta 3000 (aplicação) não está acessível (normal antes do deploy)"
fi

# 6. Teste de acesso web
print_status "6. Testando acesso web..."

# Teste HTTP
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 http://$HOSTINGER_IP 2>/dev/null || echo "000")
if [ "$HTTP_RESPONSE" != "000" ]; then
    print_success "Servidor web responde na porta 80 (código: $HTTP_RESPONSE)"
else
    print_warning "Servidor web não responde na porta 80"
fi

# Teste HTTPS
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 -k https://$HOSTINGER_IP 2>/dev/null || echo "000")
if [ "$HTTPS_RESPONSE" != "000" ]; then
    print_success "Servidor web responde na porta 443 (código: $HTTPS_RESPONSE)"
else
    print_warning "Servidor web não responde na porta 443"
fi

# 7. Verificar se o script de setup existe
print_status "7. Verificando arquivos de setup..."

if [ -f "scripts/setup-vps.sh" ]; then
    print_success "Script de setup encontrado: scripts/setup-vps.sh"
else
    print_error "Script de setup não encontrado!"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    print_success "Workflow de deploy encontrado: .github/workflows/deploy.yml"
else
    print_error "Workflow de deploy não encontrado!"
fi

# 8. Resumo e próximos passos
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_status "📋 RESUMO DO TESTE"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "🎯 Status da VPS Hostinger:"
echo "  • IP: $HOSTINGER_IP"
echo "  • Conectividade: ✅ OK"
echo "  • SSH: $([ $SSH_WORKS -eq 1 ] && echo "✅ Configurado" || echo "⚠️ Pendente")"
echo "  • Portas web: $([ "$HTTP_RESPONSE" != "000" ] && echo "✅ Ativas" || echo "⚠️ Pendentes")"

echo ""
echo "📝 Próximos passos:"

if [ $SSH_WORKS -eq 0 ]; then
    echo "  1. 🔧 Configurar o servidor:"
    echo "     scp scripts/setup-vps.sh $HOSTINGER_USER@$HOSTINGER_IP:~/"
    echo "     ssh $HOSTINGER_USER@$HOSTINGER_IP"
    echo "     ./setup-vps.sh"
    echo ""
fi

echo "  2. ⚙️ Configurar GitHub Secrets:"
echo "     • VPS_SSH_PRIVATE_KEY: [chave do servidor]"
echo "     • VPS_HOST: $HOSTINGER_IP"
echo "     • VPS_USER: $HOSTINGER_USER"
echo "     • VPS_APP_PATH: /var/www/legistemplate"
echo ""

echo "  3. 🚀 Fazer o primeiro deploy:"
echo "     git add ."
echo "     git commit -m \"Deploy inicial Hostinger\""
echo "     git push origin main"
echo ""

if [ $SSH_WORKS -eq 1 ]; then
    print_success "✅ VPS está pronta para deploy!"
else
    print_warning "⚠️ Execute o script de setup primeiro"
fi

print_status "🔗 Guia específico: docs/HOSTINGER_SETUP.md"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 