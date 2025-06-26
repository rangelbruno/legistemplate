# 🚀 Configuração de Deploy para VPS

Este documento explica como configurar o workflow de deploy automático para VPS usando GitHub Actions.

## 📋 Pré-requisitos

### No Servidor VPS:
- Ubuntu/Debian ou CentOS
- Node.js 18+ instalado
- PM2 para gerenciamento de processos
- Nginx (opcional, para proxy reverso)
- Acesso SSH configurado

### No GitHub:
- Repositório com GitHub Actions habilitado
- Secrets configurados (ver seção abaixo)

## 🔐 Configuração de Secrets no GitHub

Acesse: `Settings > Secrets and variables > Actions > New repository secret`

### Secrets obrigatórios:

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `VPS_SSH_PRIVATE_KEY` | Chave SSH privada para acesso ao VPS | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_HOST` | Endereço IP ou domínio do VPS | `192.168.1.100` ou `meusite.com` |
| `VPS_USER` | Usuário SSH do VPS | `ubuntu` ou `root` |
| `VPS_APP_PATH` | Caminho onde a aplicação será instalada | `/var/www/legistemplate` |

## 🔧 Configuração do Servidor VPS

### 1. Instalar Node.js e PM2

```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Configurar PM2 para iniciar no boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 2. Configurar SSH

```bash
# Gerar chave SSH (se não existir)
ssh-keygen -t rsa -b 4096 -C "deploy@legistemplate"

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# Copiar chave privada para usar no GitHub Secrets
cat ~/.ssh/id_rsa
```

### 3. Criar estrutura de diretórios

```bash
# Criar diretório da aplicação
sudo mkdir -p /var/www/legistemplate
sudo chown -R $USER:$USER /var/www/legistemplate

# Criar diretório de logs
sudo mkdir -p /var/log/legistemplate
sudo chown -R $USER:$USER /var/log/legistemplate
```

### 4. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Criar configuração do site
sudo nano /etc/nginx/sites-available/legistemplate
```

**Configuração do Nginx:**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/legistemplate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🗄️ Configuração do Banco de Dados

### Para SQLite (já configurado):
```bash
# Criar diretório para banco
mkdir -p /var/www/legistemplate/database
```

### Para PostgreSQL:
```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar usuário e banco
sudo -u postgres psql
CREATE USER legistemplate WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE legistemplate OWNER legistemplate;
GRANT ALL PRIVILEGES ON DATABASE legistemplate TO legistemplate;
\q
```

## 🌐 Variáveis de Ambiente

Crie o arquivo `.env` no servidor:

```bash
# Criar arquivo de exemplo
nano /var/www/legistemplate/.env.example
```

**Conteúdo do .env.example:**

```env
# Aplicação
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com

# Banco de dados
DATABASE_URL="file:./database/app.db"
# Para PostgreSQL: "postgresql://legistemplate:senha@localhost:5432/legistemplate"

# JWT
JWT_SECRET=sua_chave_jwt_muito_segura_aqui

# Upload de arquivos
UPLOAD_PATH=/var/www/legistemplate/uploads
MAX_FILE_SIZE=10485760

# Email (se usar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha_app

# Logs
LOG_LEVEL=info
LOG_PATH=/var/log/legistemplate
```

## 🚀 Como Usar o Workflow

### Deploy Automático:
1. Faça push para a branch `main` ou `master`
2. O workflow será executado automaticamente
3. Monitore o progresso em `Actions` no GitHub

### Deploy Manual:
1. Acesse `Actions` no GitHub
2. Selecione o workflow "Deploy para VPS"
3. Clique em "Run workflow"

## 📊 Monitoramento

### Verificar status da aplicação:
```bash
# Status do PM2
pm2 status

# Logs da aplicação
pm2 logs legistemplate

# Logs do sistema
tail -f /var/log/legistemplate/app.log
```

### Verificar Nginx:
```bash
# Status do Nginx
sudo systemctl status nginx

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Solução de Problemas

### Erro de permissão SSH:
```bash
# Verificar permissões
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 700 ~/.ssh
```

### Aplicação não inicia:
```bash
# Verificar logs
pm2 logs legistemplate --lines 50

# Reiniciar aplicação
pm2 restart legistemplate

# Verificar porta
netstat -tlnp | grep :3000
```

### Problemas de build:
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📝 Comandos Úteis

```bash
# Parar aplicação
pm2 stop legistemplate

# Reiniciar aplicação
pm2 restart legistemplate

# Ver logs em tempo real
pm2 logs legistemplate --follow

# Listar processos PM2
pm2 list

# Salvar configuração PM2
pm2 save

# Restaurar processos salvos
pm2 resurrect
```

## 🔄 Rollback Manual

Se algo der errado, você pode voltar para a versão anterior:

```bash
cd /var/www/legistemplate
sudo rm -rf current
sudo mv backup_AAAAMMDD_HHMMSS current
pm2 restart legistemplate
```

## 🛡️ Segurança

### Firewall:
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### SSL (opcional com Certbot):
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do GitHub Actions
2. Verifique os logs do servidor (`pm2 logs`)
3. Verifique a conectividade SSH
4. Confirme as variáveis de ambiente

---

**✅ Workflow configurado com sucesso!** 🎉

A cada push na branch principal, sua aplicação será automaticamente deployada no VPS com backup automático e verificação de integridade. 