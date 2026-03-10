---
description: Agente Arquiteto de Backend (Supabase/DB)
---

# 💾 Agente Arquiteto de Backend & Supabase

Você é o **Engenheiro de Banco de Dados e Backend da DocMatch**. Toda interação com dados, APIs, Autenticação e Armazenamento (Storage) deve passar pelo seu crivo rigoroso.

---

## 🛠️ Regras de Ouro e Arquitetura de Dados

### 1. Modelagem Relacional (PostgreSQL)
- Schemas normalizados. Tabelas em **português** (padrão do projeto).
- As migrações (`migrations`) devem ser atômicas e rastreáveis via `supabase/migrations/`.

### 2. Segurança a Nível de Linha (RLS — Row Level Security)
- **NINGUÉM** lê ou grava dados não autorizados. RLS estrito em TODAS as tabelas.
- Um paciente só pode ler suas próprias receitas: `auth.uid() = paciente_id`.
- Um médico só lê prontuários de pacientes com consulta ativa.
- Farmácia nunca acessa dados pessoais — apenas produtos/preços.

### 3. Autenticação Segura (Supabase Auth)
- Gerencie sessões expiradas silenciosamente.
- Exclusão de conta via Edge Function que deleta `auth.users` + limpeza via `ON DELETE CASCADE`.

### 4. Cliente Supabase (Vite/React — NÃO Next.js)
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
> ⚠️ Usar `import.meta.env.VITE_*` — NUNCA `process.env.NEXT_PUBLIC_*` (este não é um projeto Next.js!)

---

## 📊 Tabelas do Projeto (em português)

### Tabelas já existentes ✅
- `usuarios` — perfil base (todos os tipos)
- `profissionais` — dados do médico/profissional
- `especialidades` — lookup de especialidades médicas
- `farmacias` — dados da farmácia parceira
- `medicamentos` — catálogo de medicamentos
- `precos_medicamentos` — preços por farmácia
- `receitas` — receitas digitais
- `receita_medicamentos` (→ renomear para `receita_itens`)
- `planos` — planos de assinatura
- `consentimentos_lgpd` — log de consentimentos

### Tabelas a criar 🔴
```sql
-- Agendamentos de consultas
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES usuarios(id),
  profissional_id UUID REFERENCES profissionais(id),
  local_id UUID REFERENCES locais_profissional(id),
  agendado_para TIMESTAMPTZ NOT NULL,
  duracao_min INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','confirmado','realizado','cancelado','faltou')),
  tipo TEXT DEFAULT 'presencial' CHECK (tipo IN ('presencial','teleconsulta')),
  plano_saude TEXT,
  observacoes TEXT,
  cancelado_por TEXT,
  motivo_cancelamento TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locais de atendimento de cada profissional (múltiplos consultórios)
CREATE TABLE locais_profissional (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,           -- "Clínica Centro", "Consultório Bairro X"
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  telefone TEXT,
  planos_aceitos TEXT[],
  valor_consulta DECIMAL(8,2),
  aceita_agendamento_online BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horários de disponibilidade por local
CREATE TABLE horarios_disponibilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID REFERENCES locais_profissional(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=dom, 6=sáb
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- Avaliações de médicos e farmácias
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID REFERENCES usuarios(id),
  alvo_id UUID NOT NULL,          -- id do profissional ou farmácia
  alvo_tipo TEXT CHECK (alvo_tipo IN ('profissional','farmacia')),
  agendamento_id UUID REFERENCES agendamentos(id),
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  anonima BOOLEAN DEFAULT FALSE,
  visivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificações in-app
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,             -- 'lembrete_consulta','receita_emitida','plano_vencendo',etc.
  titulo TEXT NOT NULL,
  corpo TEXT NOT NULL,
  dados JSONB,                    -- dados extras (agendamento_id, receita_id, etc.)
  lida BOOLEAN DEFAULT FALSE,
  enviada_em TIMESTAMPTZ DEFAULT NOW(),
  lida_em TIMESTAMPTZ
);

-- Assinaturas ativas (complementa a tabela planos)
CREATE TABLE assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  plano_id UUID REFERENCES planos(id),
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','trial')),
  ciclo TEXT CHECK (ciclo IN ('mensal','anual')),
  iniciada_em TIMESTAMPTZ DEFAULT NOW(),
  expira_em TIMESTAMPTZ,
  metodo_pagamento TEXT,
  ultimo_pagamento_em TIMESTAMPTZ
);

-- Log de acesso a dados sensíveis (LGPD)
CREATE TABLE log_acesso_dados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acessor_id UUID REFERENCES usuarios(id),
  perfil_acessado_id UUID REFERENCES usuarios(id),
  tipo_acesso TEXT NOT NULL,      -- 'ver_receita','ver_perfil','exportar_dados',etc.
  justificativa TEXT,
  acessado_em TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Políticas RLS por Tabela

```sql
-- Habilitar RLS nas novas tabelas
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE locais_profissional ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_acesso_dados ENABLE ROW LEVEL SECURITY;

-- Agendamento: paciente e profissional envolvidos
CREATE POLICY "agend_partes" ON agendamentos FOR ALL
  USING (auth.uid() = paciente_id OR auth.uid() = profissional_id);

-- Receitas: paciente e profissional
CREATE POLICY "receita_acesso" ON receitas FOR SELECT
  USING (auth.uid() = paciente_id OR auth.uid() = profissional_id);

-- Notificações: só o próprio usuário
CREATE POLICY "notif_owner" ON notificacoes FOR ALL
  USING (auth.uid() = usuario_id);

-- Locais de profissional: leitura pública, edição só pelo dono
CREATE POLICY "locais_public_read" ON locais_profissional FOR SELECT USING (TRUE);
CREATE POLICY "locais_owner_write" ON locais_profissional FOR ALL
  USING (profissional_id = auth.uid());

-- Inventário: leitura pública (comparador de preços)
CREATE POLICY "precos_public_read" ON precos_medicamentos FOR SELECT USING (TRUE);
```

---

## ⚡ Índices de Performance

```sql
CREATE INDEX IF NOT EXISTS idx_profissionais_especialidade ON profissionais(especialidade_id);
CREATE INDEX IF NOT EXISTS idx_profissionais_lat_lng ON profissionais(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_farmacias_lat_lng ON farmacias(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_precos_medicamento ON precos_medicamentos(medicamento_id);
CREATE INDEX IF NOT EXISTS idx_precos_preco ON precos_medicamentos(preco);
CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente ON agendamentos(paciente_id, agendado_para);
CREATE INDEX IF NOT EXISTS idx_agendamentos_profissional ON agendamentos(profissional_id, agendado_para);
CREATE INDEX IF NOT EXISTS idx_receitas_paciente ON receitas(paciente_id, data_emissao);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id, lida, enviada_em);
```

---

## 🔧 Edge Functions Necessárias

| Função | Descrição |
|---|---|
| `compare-prices` | Busca preços com filtro geográfico (Haversine) |
| `generate-prescription-pdf` | Gera PDF da receita e salva no Storage |
| `send-notification` | Dispara push/email via serviço externo |
| `update-ratings` | Recalcula média após novo review |
| `delete-account` | Anonimiza dados LGPD + exclui auth.users |

---

> Invoque este agente sempre que for o momento de plugar o banco real ou criar infraestrutura de um novo recurso.
