# 🏥 DocMatch - Documento de Arquitetura e Especificações

## 1. Visão Geral do Projeto

**DocMatch** é uma plataforma digital brasileira que conecta pacientes, médicos e farmácias, facilitando o processo de agendamento de consultas, emissão de receitas digitais e comparação de preços de medicamentos.

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | Next.js 15 + React 18 + TypeScript | SSR, performance, SEO |
| UI/UX | Tailwind CSS + shadcn/ui | Design consistente e elegante |
| Backend | Supabase (PostgreSQL + Auth + Storage) | BaaS completo, LGPD-ready |
| Hospedagem | Vercel + GitHub | CI/CD automático, gratuito |
| Ícones | Lucide React | Ícones modernos e consistentes |

### 2.2 Estrutura de Diretórios

```
docmatch/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globais
│   │   ├── auth/              # Autenticação
│   │   │   ├── login/
│   │   │   ├── cadastro/
│   │   │   └── recuperar-senha/
│   │   ├── dashboard/         # Área do paciente
│   │   │   ├── buscar-medicos/
│   │   │   ├── consultas/
│   │   │   ├── receitas/
│   │   │   └── medicamentos/
│   │   ├── profissional/      # Área do médico
│   │   │   ├── agenda/
│   │   │   ├── pacientes/
│   │   │   └── receitas/
│   │   ├── planos/            # Planos de assinatura
│   │   └── api/               # API Routes
│   ├── components/
│   │   ├── ui/                # Componentes base (shadcn)
│   │   ├── layout/            # Header, Footer, Sidebar
│   │   ├── forms/             # Formulários reutilizáveis
│   │   └── features/          # Componentes específicos
│   ├── lib/
│   │   ├── supabase/          # Cliente Supabase
│   │   ├── utils/             # Utilitários
│   │   └── validations/       # Validações (Zod)
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # TypeScript types
│   └── data/                  # Dados mockados
└── public/
    └── assets/
```

---

## 3. Modelos de Dados (Supabase/PostgreSQL)

### 3.1 Tabela: usuarios
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE,
  telefone VARCHAR(15),
  data_nascimento DATE,
  tipo_usuario ENUM('paciente', 'profissional', 'farmacia') NOT NULL,
  plano_id UUID REFERENCES planos(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  consentimento_lgpd BOOLEAN DEFAULT FALSE,
  termos_aceitos_em TIMESTAMP
);
```

### 3.2 Tabela: profissionais
```sql
CREATE TABLE profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  crm VARCHAR(20) UNIQUE NOT NULL,
  especialidade_id UUID REFERENCES especialidades(id),
  bio TEXT,
  foto_url VARCHAR(500),
  valor_consulta DECIMAL(10,2),
  planos_saude_aceitos UUID[], -- Array de IDs
  endereco_id UUID REFERENCES enderecos(id),
  destaque BOOLEAN DEFAULT FALSE, -- Para plano premium
  verificado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Tabela: especialidades
```sql
CREATE TABLE especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icone VARCHAR(50),
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE
);
```

### 3.4 Tabela: receitas
```sql
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES usuarios(id),
  profissional_id UUID REFERENCES profissionais(id),
  consulta_id UUID REFERENCES consultas(id),
  codigo_validacao VARCHAR(20) UNIQUE NOT NULL,
  data_emissao TIMESTAMP DEFAULT NOW(),
  data_validade DATE NOT NULL,
  status ENUM('ativa', 'utilizada', 'expirada') DEFAULT 'ativa',
  assinatura_digital TEXT,
  observacoes TEXT
);
```

### 3.5 Tabela: receita_medicamentos
```sql
CREATE TABLE receita_medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receita_id UUID REFERENCES receitas(id),
  medicamento_id UUID REFERENCES medicamentos(id),
  posologia TEXT NOT NULL,
  quantidade INT NOT NULL,
  via_administracao VARCHAR(50)
);
```

### 3.6 Tabela: medicamentos
```sql
CREATE TABLE medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_comercial VARCHAR(200) NOT NULL,
  principio_ativo VARCHAR(200) NOT NULL,
  apresentacao VARCHAR(100), -- 500mg, 10ml, etc
  laboratorio VARCHAR(100),
  tarja VARCHAR(50), -- tarja preta, vermelha, livre
  ean VARCHAR(13),
  ativo BOOLEAN DEFAULT TRUE
);
```

### 3.7 Tabela: farmacias
```sql
CREATE TABLE farmacias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255) NOT NULL,
  endereco_id UUID REFERENCES enderecos(id),
  telefone VARCHAR(15),
  api_url VARCHAR(500), -- Endpoint para integração
  api_key VARCHAR(255),
  vende_online BOOLEAN DEFAULT FALSE,
  tempo_entrega_min INT,
  taxa_entrega DECIMAL(10,2),
  ativa BOOLEAN DEFAULT TRUE
);
```

### 3.8 Tabela: precos_medicamentos
```sql
CREATE TABLE precos_medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicamento_id UUID REFERENCES medicamentos(id),
  farmacia_id UUID REFERENCES farmacias(id),
  preco DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  em_estoque BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.9 Tabela: planos (Assinaturas)
```sql
CREATE TABLE planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo ENUM('paciente', 'profissional') NOT NULL,
  preco_mensal DECIMAL(10,2) NOT NULL,
  preco_anual DECIMAL(10,2),
  recursos JSONB, -- Lista de recursos incluídos
  destaque BOOLEAN DEFAULT FALSE,
  ordem INT
);
```

### 3.10 Tabela: enderecos
```sql
CREATE TABLE enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cep VARCHAR(8) NOT NULL,
  logradouro VARCHAR(255) NOT NULL,
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8)
);
```

---

## 4. Fluxos Principais

### 4.1 Fluxo do Paciente

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Landing   │───►│   Cadastro  │───►│  Dashboard  │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
           ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
           │   Buscar    │          │  Minhas     │          │ Comparar    │
           │   Médicos   │          │  Receitas   │          │ Preços      │
           └─────────────┘          └─────────────┘          └─────────────┘
                    │                        │                        │
                    ▼                        ▼                        ▼
           ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
           │   Agendar   │          │  Ver        │          │ Farmácias   │
           │   Consulta  │          │  Detalhes   │          │ Próximas    │
           └─────────────┘          └─────────────┘          └─────────────┘
```

### 4.2 Fluxo do Profissional

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cadastro  │───►│   Escolher  │───►│  Dashboard  │
│ Profissional│    │    Plano    │    │  Profissional│
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
           ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
           │   Agenda    │          │   Emitir    │          │   Meu       │
           │   Consultas │          │   Receitas  │          │   Perfil    │
           └─────────────┘          └─────────────┘          └─────────────┘
```

---

## 5. Planos de Assinatura

### 5.1 Planos para Profissionais

| Recurso | Básico (R$49/mês) | Premium (R$99/mês) |
|---------|-------------------|---------------------|
| Perfil profissional | ✅ | ✅ |
| Emissão de receitas digitais | ✅ | ✅ |
| Agenda online | ✅ | ✅ |
| Aparecer em buscas | ✅ | ✅ |
| **Destaque nos resultados** | ❌ | ✅ |
| **Relatórios avançados** | ❌ | ✅ |
| **Suporte prioritário** | ❌ | ✅ |
| **Múltiplos endereços** | ❌ | ✅ |
| **Selos de verificação** | ❌ | ✅ |

### 5.2 Planos para Pacientes

| Recurso | Gratuito | Plus (R$19/mês) | Premium (R$39/mês) |
|---------|----------|-----------------|---------------------|
| Busca de médicos | ✅ | ✅ | ✅ |
| Receitas digitais | ✅ | ✅ | ✅ |
| Comparação de preços | ✅ | ✅ | ✅ |
| **Sem anúncios** | ❌ | ✅ | ✅ |
| **Descontos em farmácias** | ❌ | ✅ | ✅ |
| **Agendamentos ilimitados** | 5/mês | Ilimitado | Ilimitado |
| **Histórico médico completo** | ❌ | ✅ | ✅ |
| **Telemedicina** | ❌ | ❌ | ✅ |
| **Consulta com especialistas** | ❌ | ❌ | ✅ |
| **Atendimento prioritário** | ❌ | ❌ | ✅ |

---

## 6. Conformidade LGPD

### 6.1 Princípios Implementados

1. **Transparência**: Todos os formulários têm links claros para políticas
2. **Finalidade**: Dados coletados apenas para finalidades específicas
3. **Minimização**: Apenas dados necessários são solicitados
4. **Segurança**: Criptografia em trânsito (HTTPS) e repouso
5. **Consentimento**: Checkbox obrigatório para aceitação dos termos
6. **Acesso**: Usuários podem visualizar e exportar seus dados
7. **Exclusão**: Opção de excluir conta e dados associados

### 6.2 Implementações Técnicas

```typescript
// Exemplo de registro de consentimento
interface ConsentimentoLGPD {
  usuario_id: string;
  termos_versao: string;
  politica_privacidade_versao: string;
  consentimento_marketing: boolean;
  consentimento_terceiros: boolean;
  data_consentimento: Date;
  ip_address: string;
}
```

### 6.3 Políticas Necessárias

- [ ] Política de Privacidade
- [ ] Termos de Uso
- [ ] Termo de Consentimento para Profissionais
- [ ] Termo de Consentimento para Pacientes
- [ ] Política de Cookies

---

## 7. Design System

### 7.1 Paleta de Cores

```css
/* Cores Primárias - Azul Marinho Elegante */
--docmatch-navy: oklch(0.35 0.10 250);      /* Azul marinho principal - Ações primárias */
--docmatch-navy-light: oklch(0.45 0.12 250); /* Azul marinho claro - Hover */
--docmatch-navy-dark: oklch(0.25 0.08 250);  /* Azul marinho escuro - Gradientes */

/* Cores de Destaque - Dourado Elegante */
--docmatch-gold: oklch(0.60 0.14 85);        /* Dourado principal - Destaques */
--docmatch-gold-light: oklch(0.70 0.16 85);  /* Dourado claro - Hover */
--docmatch-gold-dark: oklch(0.50 0.12 85);   /* Dourado escuro - Acentos */

/* Uso das cores:
   - Azul Marinho: Botões principais, títulos, textos de destaque, ícones
   - Dourado: Badges "Mais Popular", estrelas de avaliação, destaques premium, economia
   - Combinação: Cards de planos pagos, banners promocionais
*/

/* Cores Neutras */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Semânticas */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 7.2 Tipografia

```css
/* Famílias */
--font-heading: 'Inter', sans-serif;  /* Títulos */
--font-body: 'Inter', sans-serif;     /* Corpo */

/* Escalas */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 7.3 Espaçamentos

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### 7.4 Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Botões pequenos */
--radius-md: 0.5rem;    /* 8px - Inputs, cards */
--radius-lg: 0.75rem;   /* 12px - Cards grandes */
--radius-xl: 1rem;      /* 16px - Modais */
--radius-full: 9999px;  /* Circular */
```

---

## 8. Telas do Protótipo

### 8.1 Lista de Telas

1. **Landing Page** (`/`)
   - Hero com proposta de valor
   - Como funciona
   - Benefícios para cada tipo de usuário
   - CTAs principais

2. **Cadastro Paciente** (`/auth/cadastro/paciente`)
   - Dados pessoais
   - Endereço
   - Planos de saúde
   - Consentimento LGPD

3. **Cadastro Profissional** (`/auth/cadastro/profissional`)
   - Dados pessoais
   - Dados profissionais (CRM, especialidade)
   - Endereço do consultório
   - Escolha do plano

4. **Login** (`/auth/login`)
   - Email/senha
   - Login social (Google)
   - Recuperar senha

5. **Dashboard Paciente** (`/dashboard`)
   - Resumo de atividades
   - Próximas consultas
   - Receitas recentes
   - Ofertas do plano pago

6. **Buscar Médicos** (`/dashboard/buscar-medicos`)
   - Filtros (especialidade, localização, plano de saúde, valor)
   - Lista de resultados
   - Cards com informações

7. **Perfil do Médico** (`/dashboard/medicos/[id]`)
   - Informações completas
   - Avaliações
   - Agenda disponível
   - Botão de agendamento

8. **Minhas Receitas** (`/dashboard/receitas`)
   - Lista de receitas
   - Filtros por data/status
   - Opção de compartilhar

9. **Detalhes da Receita** (`/dashboard/receitas/[id]`)
   - Medicamentos prescritos
   - Posologia
   - Validade
   - Botão para comparar preços

10. **Comparar Preços** (`/dashboard/medicamentos/comparar`)
    - Lista de farmácias
    - Preços por medicamento
    - Cesta completa mais barata
    - Filtros (distância, online/balcão)

11. **Planos** (`/planos`)
    - Comparativo de planos
    - Tabela de recursos
    - CTAs de assinatura

---

## 9. Integrações Futuras (Pontos de Extensão)

### 9.1 APIs de Farmácias

```typescript
// Interface padrão para integração
interface PharmacyAPIIntegration {
  farmacia_id: string;
  endpoint: string;
  authentication: {
    type: 'api_key' | 'oauth2' | 'basic';
    credentials: Record<string, string>;
  };
  endpoints: {
    search_medicines: string;    // GET /medicamentos?nome=...
    check_stock: string;         // GET /estoque?ean=...
    get_price: string;           // GET /preco?ean=...
    create_order: string;        // POST /pedido
    track_order: string;         // GET /pedido/{id}/rastreamento
  };
  sync_config: {
    frequency: 'realtime' | 'hourly' | 'daily';
    last_sync: Date;
  };
}
```

### 9.2 Webhooks (Para o futuro)

```typescript
// Eventos que o sistema deverá emitir
type DocMatchWebhookEvents = 
  | 'consulta.agendada'
  | 'consulta.cancelada'
  | 'receita.emitida'
  | 'receita.utilizada'
  | 'pagamento.confirmado'
  | 'usuario.cadastrado'
  | 'plano.assinado';
```

---

## 10. Instruções para o Desenvolvedor Backend (Antigravity)

### 10.1 O que o Antigravity precisa fazer:

1. **Configurar o Supabase**
   - Criar projeto no Supabase
   - Executar os scripts SQL das tabelas
   - Configurar Row Level Security (RLS)
   - Configurar autenticação (email/senha + Google OAuth)

2. **Criar as API Routes** (`/src/app/api/`)
   - `/api/auth/*` - Autenticação customizada
   - `/api/usuarios/*` - CRUD de usuários
   - `/api/profissionais/*` - CRUD de profissionais
   - `/api/busca/medicos` - Busca com filtros
   - `/api/receitas/*` - CRUD de receitas
   - `/api/medicamentos/*` - Comparação de preços
   - `/api/planos/*` - Gestão de assinaturas
   - `/api/pagamentos/*` - Integração com gateway de pagamento

3. **Implementar Validações**
   - Validar CPF (algoritmo brasileiro)
   - Validar CRM (formato brasileiro)
   - Validar CNPJ (para farmácias)
   - Sanitização de inputs

4. **Implementar LGPD**
   - Endpoint para exportar dados do usuário
   - Endpoint para excluir conta e dados
   - Log de consentimentos
   - Políticas versionadas

5. **Criar Dados Mockados**
   - Inserir especialidades médicas
   - Inserir medicamentos populares
   - Inserir farmácias fictícias
   - Inserir profissionais fictícios
   - Inserir preços de medicamentos

---

## 11. Próximos Passos

1. ✅ Criar protótipo visual (frontend)
2. ⬜ Configurar projeto Supabase
3. ⬜ Implementar autenticação
4. ⬜ Desenvolver módulos de negócio
5. ⬜ Integrar pagamentos (Stripe/Asaas)
6. ⬜ Testes end-to-end
7. ⬜ Deploy em produção

---

*Documento criado em: Janeiro 2025*
*Versão: 1.0.0*
*Autor: Equipe DocMatch (Frontend Architect + Antigravity)*
