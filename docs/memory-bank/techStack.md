# ⚙️ Tech Stack - Sistema de Tramitação Parlamentar

## 🎯 **Versões Principais e Compatibilidade**

### 🖥️ **Ambiente de Desenvolvimento**

```json
{
  "node": ">=18.17.0",
  "npm": ">=9.0.0",
  "yarn": ">=1.22.0",
  "typescript": "^5.2.0",
  "next": "^14.1.0",
  "react": "^18.2.0"
}
```

### 🚀 **Next.js 14+ - Configuração Principal**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    serverComponentsExternalPackages: ['prisma'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['cdn.parlamentar.gov.br'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/publico',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/proposicoes/:path*',
        destination: '/publico/proposicoes/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

## 📦 **Dependências Essenciais**

### 🏗️ **Core Framework**

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.0"
  }
}
```

### 🎨 **Estilização (Template Existente)**

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 🔐 **Autenticação**

```json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "@auth/prisma-adapter": "^1.4.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

### 🗄️ **Banco de Dados**

```json
{
  "dependencies": {
    "prisma": "^5.8.0",
    "@prisma/client": "^5.8.0",
    "mysql2": "^3.7.0"
  },
  "devDependencies": {
    "prisma": "^5.8.0"
  }
}
```

### 🌐 **Estado e APIs**

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.0",
    "swr": "^2.2.4",
    "zustand": "^4.4.7"
  }
}
```

### 📝 **Validação e Formulários**

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2"
  }
}
```

### 🎭 **UI Components (Template Base)**

```json
{
  "dependencies": {
    "@heroicons/react": "^2.0.18",
    "lucide-react": "^0.303.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "react-datepicker": "^4.25.0",
    "react-select": "^5.8.0"
  }
}
```

## 🛠️ **Ferramentas de Desenvolvimento**

### 🔍 **Build e Qualidade**

```json
{
  "devDependencies": {
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
```

### 🧪 **Testes**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.2.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "cypress": "^13.6.0",
    "@cypress/react18": "^2.0.1"
  }
}
```

### 📊 **Performance e Monitoramento**

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.1.1",
    "@sentry/nextjs": "^7.99.0",
    "web-vitals": "^3.5.0"
  }
}
```

## ⚙️ **Configurações de Ambiente**

### 🌍 **Variáveis de Ambiente (.env.local)**

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/parlamentar"
LEGACY_DB_HOST="legacy.db.server.com"
LEGACY_DB_USER="legacy_user"
LEGACY_DB_PASS="legacy_password"
LEGACY_DB_NAME="sistema_antigo"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Azure AD (para autenticação institucional)
AZURE_AD_CLIENT_ID="your-azure-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"

# APIs Externas
NEXT_PUBLIC_API_URL="https://api.parlamentar.gov.br"
GRAPHQL_ENDPOINT="https://graphql.parlamentar.gov.br"
GRAPHQL_TOKEN="your-graphql-token"

# CDN e Assets
NEXT_PUBLIC_CDN_URL="https://cdn.parlamentar.gov.br"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Notificações
SENDGRID_API_KEY="your-sendgrid-key"
FROM_EMAIL="noreply@parlamentar.gov.br"
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
VERCEL_ANALYTICS_ID="your-analytics-id"

# Cache e Performance
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

### 📋 **Exemplo de Configuração (.env.example)**

```bash
# Copy this file to .env.local and fill in the values

# Database Connection
DATABASE_URL="mysql://user:password@localhost:3306/parlamentar"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret-key"

# External APIs
NEXT_PUBLIC_API_URL="https://api.example.com"

# Email Service
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourapp.com"

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🏗️ **Configurações Específicas**

### 🎨 **Tailwind CSS (tailwind.config.js)**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores do template existente
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        parlamentar: {
          50: '#f0f9f9',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        admin: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 📝 **TypeScript (tsconfig.json)**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 🔧 **ESLint (.eslintrc.json)**

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["node_modules/", ".next/", "out/"]
}
```

### 🎨 **Prettier (.prettierrc)**

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 🚀 **Scripts de Build e Deploy**

### 📦 **Package.json Scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "analyze": "cross-env ANALYZE=true next build",
    "build:analyze": "npm run analyze"
  }
}
```

### 🐳 **Docker (docker-compose.yml)**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: parlamentar
      MYSQL_ROOT_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

## 🔄 **CI/CD e Deploy**

### 🚀 **Vercel Deploy**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

---

**Stack**: ⚙️ Next.js 14 + TypeScript + Tailwind  
**Database**: 🗄️ MySQL + Prisma ORM  
**Deploy**: 🚀 Vercel + Edge Functions  
**Monitoring**: 📊 Sentry + Vercel Analytics 