# 🚀 Deploy VPS - Resumo da Configuração

## ✅ O que foi criado:

### 1. **Workflow de Deploy** (`.github/workflows/deploy.yml`)
- ✅ Build automático com Node.js 18
- ✅ Execução de testes e linting
- ✅ Deploy via SSH com rsync
- ✅ Gerenciamento com PM2
- ✅ Backup automático de versões
- ✅ Suporte a migrações Prisma
- ✅ Reinicialização do Nginx
- ✅ Verificação de integridade pós-deploy

### 2. **Script de Setup** (`scripts/setup-vps.sh`)
- ✅ Instalação automática do Node.js 18
- ✅ Configuração do PM2
- ✅ Setup de chaves SSH
- ✅ Configuração do Nginx (opcional)
- ✅ Setup de SSL com Let's Encrypt
- ✅ Configuração de firewall
- ✅ Criação de estrutura de diretórios

### 3. **Documentação Completa**
- ✅ Guia de configuração detalhado (`docs/DEPLOY_VPS_SETUP.md`)
- ✅ Checklist de verificação (`docs/DEPLOY_CHECKLIST.md`)
- ✅ Script de setup automatizado (`scripts/setup-vps.sh`)

### 4. **Configurações do Projeto**
- ✅ Script `start` adicionado ao `package.json`
- ✅ Arquivo de exemplo de variáveis (`env.example`)

## 🔧 Próximos Passos:

### 1. **No Servidor VPS:**
```bash
# Fazer upload e executar o script de setup
scp scripts/setup-vps.sh usuario@ip-do-servidor:~/
ssh usuario@ip-do-servidor
chmod +x setup-vps.sh
./setup-vps.sh
```

### 2. **No GitHub:**
Adicionar os seguintes **Secrets** em `Settings > Secrets and variables > Actions`:
- `VPS_SSH_PRIVATE_KEY` - Chave SSH privada (será mostrada após executar o script)
- `VPS_HOST` - IP ou domínio do seu VPS
- `VPS_USER` - Usuário SSH (ex: ubuntu)
- `VPS_APP_PATH` - Caminho da aplicação (ex: /var/www/legistemplate)

### 3. **Primeiro Deploy:**
- Fazer push para branch `main` ou `master`
- Verificar em `Actions` se o workflow executou com sucesso
- Acessar o site no IP/domínio configurado

## 🛠️ Estrutura Final no VPS:

```
/var/www/legistemplate/
├── current/          # Versão atual da aplicação
├── backup_*/         # Backups automáticos
├── database/         # Banco de dados SQLite
├── uploads/          # Arquivos enviados
└── deploy-local.sh   # Script de deploy manual
```

## 📊 Features do Deploy:

### ✅ **Automação Completa**
- Deploy automático via push
- Build e testes automatizados
- Backup antes do deploy
- Rollback em caso de erro

### ✅ **Segurança**
- Conexão SSH segura
- Firewall configurado
- SSL/HTTPS opcional
- Chaves SSH dedicadas

### ✅ **Monitoramento**
- Logs centralizados
- Verificação de integridade
- Status dos serviços
- Cleanup automático

### ✅ **Performance**
- Zero downtime
- Cache de assets
- Compressão Nginx
- PM2 cluster mode

## 🚀 Comandos Úteis:

### No VPS:
```bash
# Status da aplicação
pm2 status

# Ver logs
pm2 logs legistemplate

# Reiniciar aplicação
pm2 restart legistemplate

# Status do Nginx
sudo systemctl status nginx

# Deploy manual (se necessário)
cd /var/www/legistemplate && ./deploy-local.sh
```

### Localmente:
```bash
# Testar build
npm run build

# Verificar linting
npm run lint

# Deploy manual via SSH
ssh usuario@ip-do-servidor "cd /var/www/legistemplate && ./deploy-local.sh"
```

## 🔍 Verificação Rápida:

Após o primeiro deploy, verificar:
1. ✅ Aplicação rodando: `curl -I http://seu-ip:3000`
2. ✅ PM2 ativo: `pm2 status`
3. ✅ Logs sem erros: `pm2 logs legistemplate`
4. ✅ Site acessível no navegador

## 📞 Suporte:

Em caso de problemas:
1. Verificar logs do GitHub Actions
2. Verificar logs do PM2: `pm2 logs legistemplate`
3. Verificar conectividade SSH
4. Consultar o checklist em `docs/DEPLOY_CHECKLIST.md`

---

**🎉 Sistema de deploy configurado com sucesso!**

Agora você tem um pipeline completo de CI/CD para seu VPS com backup automático, monitoramento e zero downtime! 🚀 