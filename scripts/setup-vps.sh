#!/bin/bash

# 🚀 Script de Setup Automático para VPS - LegisTemplate
# Execute este script no seu servidor VPS para configurar o ambiente

set -e  # Parar execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
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

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar se está executando como root ou com sudo
check_privileges() {
    if [[ $EUID -eq 0 ]]; then
        SUDO=""
    else
        SUDO="sudo"
        print_warning "Executando sem privilégios de root. Alguns comandos podem precisar de senha."
    fi
}

# Configurações
APP_NAME="legistemplate"
APP_PATH="/var/www/$APP_NAME"
LOG_PATH="/var/log/$APP_NAME"
NODE_VERSION="18"
DB_PATH="$APP_PATH/database"

print_status "🚀 Iniciando configuração do VPS para $APP_NAME"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar privilégios
check_privileges

# 1. Atualizar sistema
print_status "📦 Atualizando sistema..."
$SUDO apt update && $SUDO apt upgrade -y

# 2. Instalar dependências básicas
print_status "🔧 Instalando dependências básicas..."
$SUDO apt install -y curl wget git build-essential

# 3. Instalar Node.js
if command_exists node; then
    NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_CURRENT" -ge "$NODE_VERSION" ]; then
        print_success "Node.js $NODE_CURRENT já instalado e atualizado"
    else
        print_status "📦 Atualizando Node.js para versão $NODE_VERSION..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | $SUDO -E bash -
        $SUDO apt-get install -y nodejs
    fi
else
    print_status "📦 Instalando Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | $SUDO -E bash -
    $SUDO apt-get install -y nodejs
fi

# Verificar instalação do Node.js
if command_exists node && command_exists npm; then
    print_success "Node.js $(node --version) e npm $(npm --version) instalados"
else
    print_error "Falha na instalação do Node.js"
    exit 1
fi

# 4. Instalar PM2
if command_exists pm2; then
    print_success "PM2 já instalado: $(pm2 --version)"
else
    print_status "📦 Instalando PM2..."
    $SUDO npm install -g pm2
    
    # Configurar PM2 para iniciar no boot
    print_status "⚙️ Configurando PM2 para iniciar no boot..."
    pm2 startup | grep "sudo env" | bash || true
fi

# 5. Criar estrutura de diretórios
print_status "📁 Criando estrutura de diretórios..."
$SUDO mkdir -p "$APP_PATH" "$LOG_PATH" "$DB_PATH"
$SUDO chown -R $USER:$USER "$APP_PATH"
$SUDO chown -R $USER:$USER "$LOG_PATH"

# 6. Configurar chaves SSH
print_status "🔐 Configurando chaves SSH..."
if [ ! -f ~/.ssh/id_rsa ]; then
    print_status "Gerando chave SSH..."
    ssh-keygen -t rsa -b 4096 -C "deploy@$APP_NAME" -f ~/.ssh/id_rsa -N ""
    print_success "Chave SSH gerada"
else
    print_success "Chave SSH já existe"
fi

# Adicionar chave pública ao authorized_keys
if [ ! -f ~/.ssh/authorized_keys ]; then
    touch ~/.ssh/authorized_keys
fi

if ! grep -q "$(cat ~/.ssh/id_rsa.pub)" ~/.ssh/authorized_keys 2>/dev/null; then
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    print_success "Chave pública adicionada ao authorized_keys"
fi

# Definir permissões corretas
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys

# 7. Instalar e configurar Nginx (opcional)
read -p "🌐 Deseja instalar e configurar Nginx? (y/N): " install_nginx
if [[ $install_nginx =~ ^[Yy]$ ]]; then
    if command_exists nginx; then
        print_success "Nginx já instalado"
    else
        print_status "📦 Instalando Nginx..."
        $SUDO apt install -y nginx
    fi
    
    # Configurar site
    read -p "🌍 Digite o domínio do site (ex: meusite.com): " domain
    if [ ! -z "$domain" ]; then
        print_status "⚙️ Configurando Nginx para $domain..."
        
        cat > /tmp/nginx_config << EOF
server {
    listen 80;
    server_name $domain www.$domain;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
EOF

        $SUDO mv /tmp/nginx_config "/etc/nginx/sites-available/$APP_NAME"
        $SUDO ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/"
        
        # Remover configuração padrão
        $SUDO rm -f /etc/nginx/sites-enabled/default
        
        # Testar configuração
        if $SUDO nginx -t; then
            $SUDO systemctl restart nginx
            $SUDO systemctl enable nginx
            print_success "Nginx configurado para $domain"
        else
            print_error "Erro na configuração do Nginx"
        fi
    fi
fi

# 8. Configurar Firewall
read -p "🛡️ Deseja configurar o firewall UFW? (y/N): " setup_firewall
if [[ $setup_firewall =~ ^[Yy]$ ]]; then
    print_status "🛡️ Configurando firewall..."
    $SUDO ufw --force reset
    $SUDO ufw allow ssh
    $SUDO ufw allow 80
    $SUDO ufw allow 443
    $SUDO ufw --force enable
    print_success "Firewall configurado"
fi

# 9. Configurar SSL com Certbot (opcional)
if [[ $install_nginx =~ ^[Yy]$ ]] && [ ! -z "$domain" ]; then
    read -p "🔒 Deseja instalar SSL gratuito com Let's Encrypt? (y/N): " install_ssl
    if [[ $install_ssl =~ ^[Yy]$ ]]; then
        print_status "📦 Instalando Certbot..."
        $SUDO apt install -y certbot python3-certbot-nginx
        
        print_status "🔒 Obtendo certificado SSL para $domain..."
        $SUDO certbot --nginx -d $domain -d www.$domain --non-interactive --agree-tos --email admin@$domain
        
        if [ $? -eq 0 ]; then
            print_success "SSL configurado com sucesso!"
        else
            print_warning "Erro ao configurar SSL. Configure manualmente depois."
        fi
    fi
fi

# 10. Criar arquivo .env de exemplo
print_status "📝 Criando arquivo .env de exemplo..."
cat > "$APP_PATH/.env.example" << EOF
# Aplicação
NODE_ENV=production
PORT=3000
APP_URL=https://${domain:-localhost:3000}

# Banco de dados
DATABASE_URL="file:./database/app.db"

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# Upload de arquivos
UPLOAD_PATH=$APP_PATH/uploads
MAX_FILE_SIZE=10485760

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Logs
LOG_LEVEL=info
LOG_PATH=$LOG_PATH
EOF

# 11. Criar diretórios adicionais
print_status "📁 Criando diretórios adicionais..."
mkdir -p "$APP_PATH/uploads"
mkdir -p "$APP_PATH/current"
mkdir -p "$APP_PATH/database"

# 12. Configurar permissões finais
print_status "🔧 Configurando permissões finais..."
$SUDO chown -R $USER:$USER "$APP_PATH"
$SUDO chown -R $USER:$USER "$LOG_PATH"

# 13. Criar script de deploy local
print_status "📜 Criando script de deploy local..."
cat > "$APP_PATH/deploy-local.sh" << 'EOF'
#!/bin/bash
# Script para deploy manual local

APP_NAME="legistemplate"
APP_PATH="/var/www/legistemplate"

cd "$APP_PATH/current"

echo "🔄 Fazendo backup..."
if [ -d "$APP_PATH/current" ]; then
    cp -r "$APP_PATH/current" "$APP_PATH/backup_$(date +%Y%m%d_%H%M%S)"
fi

echo "📦 Instalando dependências..."
npm ci --production

echo "🏗️ Fazendo build..."
npm run build

echo "🗄️ Executando migrações..."
if [ -f "prisma/schema.prisma" ]; then
    npx prisma migrate deploy
fi

echo "🔄 Reiniciando aplicação..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save

echo "✅ Deploy concluído!"
EOF

chmod +x "$APP_PATH/deploy-local.sh"

# Resumo final
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "🎉 Configuração do VPS concluída com sucesso!"
print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📋 Informações importantes:"
echo "  • Aplicação: $APP_NAME"
echo "  • Diretório: $APP_PATH"
echo "  • Logs: $LOG_PATH"
echo "  • Node.js: $(node --version)"
echo "  • PM2: $(pm2 --version)"

if [[ $install_nginx =~ ^[Yy]$ ]] && [ ! -z "$domain" ]; then
    echo "  • Nginx: Configurado para $domain"
    if [[ $install_ssl =~ ^[Yy]$ ]]; then
        echo "  • SSL: Configurado com Let's Encrypt"
    fi
fi

echo ""
echo "🔐 Chave SSH privada para GitHub Secrets:"
echo "────────────────────────────────────────────────"
cat ~/.ssh/id_rsa
echo "────────────────────────────────────────────────"
echo ""

echo "⚙️ Secrets do GitHub necessários:"
echo "  • VPS_SSH_PRIVATE_KEY: (chave acima)"
echo "  • VPS_HOST: $(curl -s ifconfig.me || hostname -I | awk '{print $1}')"
echo "  • VPS_USER: $USER"
echo "  • VPS_APP_PATH: $APP_PATH"
echo ""

echo "📝 Próximos passos:"
echo "  1. Adicionar os secrets no GitHub"
echo "  2. Configurar o arquivo .env no servidor"
echo "  3. Fazer push no repositório para testar o deploy"
echo ""

print_success "VPS está pronto para receber deploys automáticos! 🚀" 