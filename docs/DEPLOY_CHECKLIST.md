# ✅ Checklist de Deploy para VPS

Use este checklist para verificar se tudo está configurado corretamente antes de fazer o primeiro deploy.

## 🎯 Pré-Deploy

### ☐ 1. Servidor VPS Preparado
- [ ] VPS criado e acessível via SSH
- [ ] Sistema operacional atualizado (Ubuntu/Debian recomendado)
- [ ] Script `scripts/setup-vps.sh` executado no servidor
- [ ] Node.js 18+ instalado
- [ ] PM2 instalado e configurado
- [ ] Nginx instalado (opcional)
- [ ] Firewall configurado

### ☐ 2. GitHub Secrets Configurados
Acesse: `Settings > Secrets and variables > Actions`

- [ ] `VPS_SSH_PRIVATE_KEY` - Chave SSH privada
- [ ] `VPS_HOST` - IP ou domínio do VPS
- [ ] `VPS_USER` - Usuário SSH (ex: ubuntu)
- [ ] `VPS_APP_PATH` - Caminho da aplicação (ex: /var/www/legistemplate)

### ☐ 3. Estrutura do Projeto
- [ ] Arquivo `.github/workflows/deploy.yml` existe
- [ ] Script `package.json` com comando `start` configurado
- [ ] Arquivo `.env.example` criado
- [ ] Diretório `prisma/` com schema (se usando banco de dados)

## 🔧 Configuração do Servidor

### ☐ 4. Diretórios Criados
```bash
# Verificar se existem:
ls -la /var/www/legistemplate/
ls -la /var/log/legistemplate/
```

- [ ] `/var/www/legistemplate/` - Diretório principal
- [ ] `/var/www/legistemplate/current/` - Versão atual
- [ ] `/var/www/legistemplate/database/` - Banco de dados
- [ ] `/var/log/legistemplate/` - Logs

### ☐ 5. Permissões Corretas
```bash
# Verificar proprietário:
ls -la /var/www/legistemplate/
```

- [ ] Usuário é dono dos diretórios da aplicação
- [ ] Permissões SSH corretas (600 para chave privada)

### ☐ 6. Serviços Ativos
```bash
# Verificar serviços:
systemctl status nginx  # Se instalado
pm2 status
```

- [ ] Nginx rodando (se instalado)
- [ ] PM2 configurado para iniciar no boot

## 🌐 Configuração de Rede

### ☐ 7. Conectividade
```bash
# Testar conectividade:
ssh usuario@ip-do-servidor
curl -I localhost:3000  # Depois do primeiro deploy
```

- [ ] Acesso SSH funcionando
- [ ] Portas abertas no firewall (22, 80, 443)
- [ ] DNS configurado (se usando domínio)

### ☐ 8. SSL/HTTPS (Opcional)
- [ ] Certificado SSL configurado
- [ ] Redirecionamento HTTP → HTTPS
- [ ] Domínio resolvendo corretamente

## 🗄️ Banco de Dados

### ☐ 9. Configuração do Banco
- [ ] SQLite: Diretório `/var/www/legistemplate/database/` criado
- [ ] PostgreSQL: Banco e usuário criados (se aplicável)
- [ ] Variável `DATABASE_URL` configurada no `.env`

### ☐ 10. Migrações
```bash
# Testar migrações:
cd /var/www/legistemplate/current
npx prisma migrate deploy
```

- [ ] Schema Prisma válido
- [ ] Migrações executam sem erro

## 🚀 Primeiro Deploy

### ☐ 11. Teste Local do Workflow
- [ ] Push para branch `main` ou `master`
- [ ] Workflow executado sem erros
- [ ] Build concluído com sucesso
- [ ] Deploy executado sem erros

### ☐ 12. Verificação Pós-Deploy
```bash
# No servidor, verificar:
pm2 status legistemplate
pm2 logs legistemplate
curl -I localhost:3000
```

- [ ] Aplicação rodando no PM2
- [ ] Sem erros nos logs
- [ ] Porta 3000 respondendo
- [ ] Site acessível via navegador

## 📊 Monitoramento

### ☐ 13. Logs e Monitoramento
```bash
# Comandos para verificar:
pm2 logs legistemplate --lines 20
tail -f /var/log/legistemplate/app.log
sudo tail -f /var/log/nginx/access.log
```

- [ ] Logs da aplicação acessíveis
- [ ] Logs do Nginx (se instalado)
- [ ] Sistema de monitoramento configurado

### ☐ 14. Backups Automáticos
- [ ] Backups de versões anteriores sendo criados
- [ ] Limpeza automática de backups antigos
- [ ] Backup do banco de dados (se crítico)

## 🔄 Testes de Deploy

### ☐ 15. Cenários de Teste
- [ ] Deploy com mudanças simples (texto)
- [ ] Deploy com mudanças de dependências
- [ ] Deploy com migrações de banco
- [ ] Rollback para versão anterior

### ☐ 16. Performance
- [ ] Tempo de build aceitável (< 5min)
- [ ] Tempo de deploy aceitável (< 3min)
- [ ] Zero downtime durante deploy
- [ ] Cache e compressão funcionando

## 🚨 Solução de Problemas

### ☐ 17. Cenários de Erro Comum
- [ ] Erro de SSH: Verificar chaves e permissões
- [ ] Erro de build: Verificar dependências e Node.js
- [ ] Erro 502: Verificar se app está rodando na porta 3000
- [ ] Erro de migração: Verificar schema e conexão DB

### ☐ 18. Plano de Contingência
- [ ] Procedimento de rollback documentado
- [ ] Contatos de emergência definidos
- [ ] Backup da configuração do servidor
- [ ] Monitoramento de uptime configurado

## 📝 Comandos de Verificação Rápida

### Verificar Status Geral:
```bash
# Status dos serviços
systemctl status nginx
pm2 status

# Logs recentes
pm2 logs legistemplate --lines 10
tail -5 /var/log/nginx/error.log

# Uso de recursos
htop
df -h
```

### Testar Conectividade:
```bash
# Do seu computador:
ssh usuario@ip-do-servidor "pm2 status"
curl -I http://seu-dominio.com

# No servidor:
curl -I localhost:3000
netstat -tlnp | grep :3000
```

### Verificar Arquivos:
```bash
# Estrutura dos arquivos
ls -la /var/www/legistemplate/
cat /var/www/legistemplate/current/.env
cat /etc/nginx/sites-enabled/legistemplate
```

---

## 🎉 Deploy Pronto!

Se todos os itens acima estão marcados, seu sistema de deploy automático está configurado e funcionando corretamente!

### 📚 Recursos Adicionais:
- [Documentação completa](./DEPLOY_VPS_SETUP.md)
- [GitHub Actions Logs](https://github.com/seu-usuario/seu-repo/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### 🔗 Links Úteis:
- **Aplicação**: http://seu-dominio.com
- **Logs PM2**: `pm2 logs legistemplate`
- **Status**: `pm2 status`
- **Reiniciar**: `pm2 restart legistemplate` 