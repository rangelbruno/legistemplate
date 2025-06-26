# 🚀 Deploy na VPS Hostinger - Guia Específico

## 📋 Informações do Servidor

- **Provedor:** Hostinger VPS
- **IP:** 82.25.65.27
- **Usuário padrão:** root (geralmente)
- **Sistema:** Ubuntu/Debian

## 🔧 Passo a Passo - Configuração

### 1. **Conectar ao Servidor**

```bash
# Conectar via SSH (substitua 'root' pelo usuário correto se necessário)
ssh root@82.25.65.27
```

Se for a primeira conexão, confirme a fingerprint do servidor quando solicitado.

### 2. **Fazer Upload do Script de Setup**

No seu computador local, execute:

```bash
# Fazer upload do script para o servidor
scp scripts/setup-vps.sh root@82.25.65.27:~/

# Conectar ao servidor
ssh root@82.25.65.27

# Tornar o script executável
chmod +x setup-vps.sh

# Executar o script de configuração
./setup-vps.sh
```

### 3. **Durante a Execução do Script**

O script fará algumas perguntas. Responda conforme sua necessidade:

```bash
🌐 Deseja instalar e configurar Nginx? (y/N): y
🌍 Digite o domínio do site (ex: meusite.com): [seu-dominio.com ou deixe vazio]
🛡️ Deseja configurar o firewall UFW? (y/N): y
🔒 Deseja instalar SSL gratuito com Let's Encrypt? (y/N): y  # (se tiver domínio)
```

### 4. **Copiar a Chave SSH**

Após a execução do script, ele mostrará a chave SSH privada. **Copie toda a chave** (incluindo `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`)

## ⚙️ Configurar Secrets no GitHub

Acesse seu repositório no GitHub:
`Settings > Secrets and variables > Actions > New repository secret`

### Adicionar os seguintes secrets:

| Nome | Valor |
|------|-------|
| `VPS_SSH_PRIVATE_KEY` | Cole a chave SSH privada completa |
| `VPS_HOST` | `82.25.65.27` |
| `VPS_USER` | `root` (ou o usuário correto) |
| `VPS_APP_PATH` | `/var/www/legistemplate` |

## 🌐 Configuração de Domínio (Opcional)

Se você tem um domínio, configure o DNS:

### No painel do seu provedor de domínio:
```
Tipo: A
Nome: @ (ou www)
Valor: 82.25.65.27
TTL: 300 (ou automático)
```

### No servidor, edite o Nginx:
```bash
sudo nano /etc/nginx/sites-available/legistemplate
```

Substitua `seu-dominio.com` pelo seu domínio real.

## 🔥 Configurações Específicas da Hostinger

### 1. **Firewall da Hostinger**

A Hostinger pode ter firewall próprio. Certifique-se de que estas portas estejam abertas:
- **22** (SSH)
- **80** (HTTP)
- **443** (HTTPS)
- **3000** (aplicação - opcional, se não usar Nginx)

### 2. **Recursos da VPS**

Verifique os recursos disponíveis:
```bash
# Memória
free -h

# Espaço em disco
df -h

# CPU
nproc
```

### 3. **Otimizações para VPS Básica**

Se sua VPS tem recursos limitados, adicione swap:

```bash
# Criar arquivo de swap de 1GB
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 🚀 Primeiro Deploy

### 1. **Verificar Configuração**
```bash
# No servidor, verificar se tudo está ok
pm2 status
sudo systemctl status nginx
sudo ufw status
```

### 2. **Fazer o Deploy**
No seu repositório local:
```bash
# Fazer commit das mudanças
git add .
git commit -m "Configuração inicial para deploy Hostinger"

# Push para ativar o deploy
git push origin main
```

### 3. **Monitorar o Deploy**
- Acesse GitHub Actions: `https://github.com/seu-usuario/legistemplate/actions`
- Acompanhe a execução do workflow
- Verifique se não há erros

## 🔍 Verificação Pós-Deploy

### 1. **Verificar no Servidor**
```bash
ssh root@82.25.65.27

# Status da aplicação
pm2 status

# Logs da aplicação
pm2 logs legistemplate

# Verificar se está rodando na porta 3000
curl -I localhost:3000

# Se usar Nginx, verificar status
sudo systemctl status nginx
```

### 2. **Testar Acesso Externo**
```bash
# Do seu computador
curl -I http://82.25.65.27
# ou se configurou domínio:
curl -I http://seu-dominio.com
```

## 🛠️ Comandos Úteis - Hostinger

### Monitoramento:
```bash
# Recursos do sistema
htop

# Logs do sistema
sudo tail -f /var/log/syslog

# Espaço em disco
df -h

# Uso de memória
free -h
```

### Gerenciamento PM2:
```bash
# Status detalhado
pm2 show legistemplate

# Reiniciar aplicação
pm2 restart legistemplate

# Parar aplicação
pm2 stop legistemplate

# Logs em tempo real
pm2 logs legistemplate --follow
```

### Nginx:
```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Solução de Problemas

### Erro de Conexão SSH:
```bash
# Verificar se o servidor está acessível
ping 82.25.65.27

# Conectar com verbose para debug
ssh -v root@82.25.65.27
```

### Aplicação não carrega:
```bash
# Verificar se o PM2 está rodando
pm2 status

# Verificar logs por erros
pm2 logs legistemplate --lines 50

# Verificar se a porta está em uso
sudo netstat -tlnp | grep :3000
```

### Nginx retorna 502:
```bash
# Verificar se a aplicação está rodando
curl localhost:3000

# Verificar configuração do Nginx
sudo nginx -t

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

## 📞 Suporte Hostinger

Se tiver problemas específicos da Hostinger:
- **Painel:** hPanel da Hostinger
- **Suporte:** Chat/ticket no painel
- **Documentação:** https://support.hostinger.com/

## 🎯 Resumo dos Comandos

### No seu computador:
```bash
# 1. Upload do script
scp scripts/setup-vps.sh root@82.25.65.27:~/

# 2. Conectar e configurar
ssh root@82.25.65.27
./setup-vps.sh

# 3. Fazer deploy
git push origin main
```

### Secrets do GitHub:
- `VPS_SSH_PRIVATE_KEY`: [chave mostrada pelo script]
- `VPS_HOST`: `82.25.65.27`
- `VPS_USER`: `root`
- `VPS_APP_PATH`: `/var/www/legistemplate`

---

**🎉 Sua aplicação estará disponível em:**
- **IP direto:** http://82.25.65.27
- **Com domínio:** http://seu-dominio.com (se configurado)

**🚀 Deploy automático configurado para Hostinger VPS!** 