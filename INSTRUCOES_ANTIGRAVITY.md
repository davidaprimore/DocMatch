# 🚀 Instruções para o Antigravity (Desenvolvedor Backend)

## Olá, Antigravity! 👋

Este documento contém todas as instruções necessárias para você implementar o backend do **DocMatch**. O frontend já está pronto e funcionando com dados mockados. Seu trabalho é substituir esses dados mockados por uma integração real com o Supabase.

---

## 📁 Estrutura do Projeto

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Aplicação principal (SPA)
│   │   ├── layout.tsx        # Layout global
│   │   ├── globals.css       # Estilos globais
│   │   └── api/              # ⚠️ API Routes - VOCÊ PRECISA CRIAR
│   ├── components/           # Componentes UI (shadcn/ui)
│   ├── data/
│   │   └── mockData.ts       # Dados mockados - SUBSTITUIR por Supabase
│   ├── lib/
│   │   └── supabase/         # ⚠️ Cliente Supabase - VOCÊ PRECISA CRIAR
│   ├── hooks/                # Custom hooks
│   └── types/                # TypeScript types
├── DOCMATCH_ARCHITECTURE.md  # Documento de arquitetura completo
└── INSTRUCOES_ANTIGRAVITY.md # Este arquivo
```

---

## 🔧 Tarefa 1: Configurar Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto chamado "docmatch"
3. Anote a URL e a chave anônima do projeto

### 1.2 Criar Cliente Supabase

Crie o arquivo `/src/lib/supabase/client.ts`:

```typescript
// ⚠️ ANTI-GRAVITY: Crie este arquivo
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para usar no servidor (Server Components)
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

### 1.3 Configurar Variáveis de Ambiente

Crie o arquivo `.env.local`:

```env
# ⚠️ ANTI-GRAVITY: Crie este arquivo com suas chaves reais
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

---

## 🗄️ Tarefa 2: Criar Tabelas no Supabase

Execute os seguintes SQLs no Editor SQL do Supabase:

### 2.1 Tabela de Usuários

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE,
  telefone VARCHAR(15),
  data_nascimento DATE,
  tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('paciente', 'profissional', 'farmacia')),
  plano_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consentimento_lgpd BOOLEAN DEFAULT FALSE,
  termos_aceitos_em TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
```

### 2.2 Tabela de Especialidades

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icone VARCHAR(50),
  descricao TEXT,
  ativa BOOLEAN DEFAULT TRUE
);

-- Inserir especialidades
INSERT INTO especialidades (nome, slug, icone) VALUES
('Clínico Geral', 'clinico-geral', 'Stethoscope'),
('Cardiologia', 'cardiologia', 'Heart'),
('Dermatologia', 'dermatologia', 'Sparkles'),
('Ortopedia', 'ortopedia', 'Bone'),
('Pediatria', 'pediatria', 'Baby'),
('Ginecologia', 'ginecologia', 'User'),
('Oftalmologia', 'oftalmologia', 'Eye'),
('Psiquiatria', 'psiquiatria', 'Brain'),
('Endocrinologia', 'endocrinologia', 'Activity'),
('Neurologia', 'neurologia', 'Zap');
```

### 2.3 Tabela de Profissionais

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  crm VARCHAR(20) UNIQUE NOT NULL,
  especialidade_id UUID REFERENCES especialidades(id),
  bio TEXT,
  foto_url VARCHAR(500),
  valor_consulta DECIMAL(10,2),
  planos_saude_aceitos TEXT[],
  logradouro VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(8),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  destaque BOOLEAN DEFAULT FALSE,
  verificado BOOLEAN DEFAULT FALSE,
  nota_media DECIMAL(2,1) DEFAULT 0,
  total_avaliacoes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
```

### 2.4 Tabela de Farmácias

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE farmacias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255) NOT NULL,
  logradouro VARCHAR(255),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(8),
  telefone VARCHAR(15),
  api_url VARCHAR(500),
  api_key VARCHAR(255),
  vende_online BOOLEAN DEFAULT FALSE,
  tempo_entrega_min INT,
  taxa_entrega DECIMAL(10,2),
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE farmacias ENABLE ROW LEVEL SECURITY;
```

### 2.5 Tabela de Medicamentos

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_comercial VARCHAR(200) NOT NULL,
  principio_ativo VARCHAR(200) NOT NULL,
  dosagem VARCHAR(50),
  apresentacao VARCHAR(100),
  laboratorio VARCHAR(100),
  tarja VARCHAR(50),
  ean VARCHAR(13),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir medicamentos populares
INSERT INTO medicamentos (nome_comercial, principio_ativo, dosagem, apresentacao) VALUES
('Dipirona Sódica', 'Dipirona sódica', '500mg', 'Comprimido - Caixa com 20 unidades'),
('Amoxicilina', 'Amoxicilina triidratada', '500mg', 'Cápsula - Caixa com 21 unidades'),
('Omeprazol', 'Omeprazol', '20mg', 'Cápsula - Caixa com 28 unidades'),
('Losartana Potássica', 'Losartana potássica', '50mg', 'Comprimido - Caixa com 30 unidades'),
('Metformina', 'Cloridrato de metformina', '850mg', 'Comprimido - Caixa com 60 unidades');
```

### 2.6 Tabela de Preços de Medicamentos

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE precos_medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicamento_id UUID REFERENCES medicamentos(id) ON DELETE CASCADE,
  farmacia_id UUID REFERENCES farmacias(id) ON DELETE CASCADE,
  preco DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  em_estoque BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(medicamento_id, farmacia_id)
);

ALTER TABLE precos_medicamentos ENABLE ROW LEVEL SECURITY;
```

### 2.7 Tabela de Receitas

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES profissionais(id),
  codigo_validacao VARCHAR(20) UNIQUE NOT NULL,
  data_emissao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_validade DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'utilizada', 'expirada')),
  assinatura_digital TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
```

### 2.8 Tabela de Receita Medicamentos

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE receita_medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receita_id UUID REFERENCES receitas(id) ON DELETE CASCADE,
  medicamento_id UUID REFERENCES medicamentos(id),
  posologia TEXT NOT NULL,
  quantidade INT NOT NULL,
  via_administracao VARCHAR(50)
);

ALTER TABLE receita_medicamentos ENABLE ROW LEVEL SECURITY;
```

### 2.9 Tabela de Planos

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('paciente', 'profissional')),
  preco_mensal DECIMAL(10,2) NOT NULL,
  preco_anual DECIMAL(10,2),
  recursos JSONB,
  destaque BOOLEAN DEFAULT FALSE,
  ordem INT,
  ativo BOOLEAN DEFAULT TRUE
);

-- Inserir planos para paciente
INSERT INTO planos (nome, tipo, preco_mensal, destaque, ordem, recursos) VALUES
('Gratuito', 'paciente', 0, false, 1, '{"busca_medicos": true, "agendamento": true, "receitas_digitais": true, "comparador_precos": true, "sem_anuncios": false, "suporte_prioritario": false, "descontos_farmacias": false, "telemedicina": false}'),
('Plus', 'paciente', 19, true, 2, '{"busca_medicos": true, "agendamento": true, "receitas_digitais": true, "comparador_precos": true, "sem_anuncios": true, "suporte_prioritario": true, "descontos_farmacias": false, "telemedicina": false}'),
('Premium', 'paciente', 39, false, 3, '{"busca_medicos": true, "agendamento": true, "receitas_digitais": true, "comparador_precos": true, "sem_anuncios": true, "suporte_prioritario": true, "descontos_farmacias": true, "telemedicina": true}');

-- Inserir planos para profissional
INSERT INTO planos (nome, tipo, preco_mensal, destaque, ordem, recursos) VALUES
('Básico', 'profissional', 49, false, 1, '{"perfil_plataforma": true, "agenda_digital": true, "receitas_digitais": true, "notificacoes_email": true, "relatorios_basicos": true, "destaque_buscas": false, "emissao_laudos": false, "integracao_whatsapp": false, "suporte_prioritario": false}'),
('Premium', 'profissional', 99, true, 2, '{"perfil_plataforma": true, "agenda_digital": true, "receitas_digitais": true, "notificacoes_email": true, "relatorios_basicos": true, "destaque_buscas": true, "emissao_laudos": true, "integracao_whatsapp": true, "suporte_prioritario": true}');
```

### 2.10 Tabela de Consentimentos LGPD

```sql
-- ⚠️ ANTI-GRAVITY: Execute este SQL no Supabase
CREATE TABLE consentimentos_lgpd (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  termos_versao VARCHAR(10) NOT NULL,
  politica_privacidade_versao VARCHAR(10) NOT NULL,
  consentimento_marketing BOOLEAN DEFAULT FALSE,
  consentimento_terceiros BOOLEAN DEFAULT FALSE,
  data_consentimento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

ALTER TABLE consentimentos_lgpd ENABLE ROW LEVEL SECURITY;
```

---

## 🔌 Tarefa 3: Criar API Routes

### 3.1 Estrutura de Pastas

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   ├── logout/route.ts
│   └── me/route.ts
├── usuarios/
│   └── [id]/route.ts
├── profissionais/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── busca/route.ts
├── especialidades/
│   └── route.ts
├── farmacias/
│   ├── route.ts
│   └── [id]/route.ts
├── medicamentos/
│   ├── route.ts
│   └── comparar/route.ts
├── receitas/
│   ├── route.ts
│   └── [id]/route.ts
├── planos/
│   └── route.ts
└── lgpd/
    └── consentimento/route.ts
```

### 3.2 Exemplo: API de Autenticação

```typescript
// ⚠️ ANTI-GRAVITY: Crie o arquivo /src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome_completo, email, cpf, telefone, data_nascimento, senha, tipo_usuario, planos_saude } = body

    // Validações básicas
    if (!nome_completo || !email || !senha) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const senha_hash = await hash(senha, 10)

    // Inserir usuário
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        nome_completo,
        email,
        cpf: cpf?.replace(/\D/g, ''),
        telefone,
        data_nascimento,
        tipo_usuario: tipo_usuario || 'paciente',
        consentimento_lgpd: true,
        termos_aceitos_em: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    // Registrar consentimento LGPD
    await supabase
      .from('consentimentos_lgpd')
      .insert({
        usuario_id: usuario.id,
        termos_versao: '1.0',
        politica_privacidade_versao: '1.0',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent')
      })

    return NextResponse.json({ usuario }, { status: 201 })
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### 3.3 Exemplo: API de Busca de Médicos

```typescript
// ⚠️ ANTI-GRAVITY: Crie o arquivo /src/app/api/profissionais/busca/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const especialidade_id = searchParams.get('especialidade_id')
    const plano_saude = searchParams.get('plano_saude')
    const valor_maximo = searchParams.get('valor_maximo')
    const latitude = searchParams.get('lat')
    const longitude = searchParams.get('lng')
    const raio = searchParams.get('raio') || '10'

    let query = supabase
      .from('profissionais')
      .select(`
        *,
        especialidades (nome, icone)
      `)
      .eq('verificado', true)

    // Filtro por especialidade
    if (especialidade_id) {
      query = query.eq('especialidade_id', especialidade_id)
    }

    // Filtro por valor máximo
    if (valor_maximo) {
      query = query.lte('valor_consulta', parseFloat(valor_maximo))
    }

    // Filtro por plano de saúde
    if (plano_saude) {
      query = query.contains('planos_saude_aceitos', [plano_saude])
    }

    // Ordenação: destacados primeiro
    query = query.order('destaque', { ascending: false })
    query = query.order('nota_media', { ascending: false })

    const { data: profissionais, error } = await query

    if (error) {
      console.error('Erro na busca:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar profissionais' },
        { status: 500 }
      )
    }

    // Se tiver coordenadas, calcular distância
    // NOTA: Para produção, usar PostGIS ou função SQL de distância

    return NextResponse.json({ profissionais })
  } catch (error) {
    console.error('Erro na busca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### 3.4 Exemplo: API de Comparação de Preços

```typescript
// ⚠️ ANTI-GRAVITY: Crie o arquivo /src/app/api/medicamentos/comparar/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { medicamentos_ids, latitude, longitude, raio } = body

    // Buscar preços dos medicamentos nas farmácias
    const { data: precos, error } = await supabase
      .from('precos_medicamentos')
      .select(`
        *,
        medicamentos (id, nome_comercial, principio_ativo, dosagem, apresentacao),
        farmacias (id, nome_fantasia, logradouro, numero, bairro, cidade, vende_online, tempo_entrega_min)
      `)
      .in('medicamento_id', medicamentos_ids)
      .eq('em_estoque', true)

    if (error) {
      console.error('Erro ao buscar preços:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar preços' },
        { status: 500 }
      )
    }

    // Agrupar por farmácia e calcular total
    const farmaciasComPrecos: Record<string, any> = {}
    
    precos.forEach((preco: any) => {
      const farmaciaId = preco.farmacias.id
      
      if (!farmaciasComPrecos[farmaciaId]) {
        farmaciasComPrecos[farmaciaId] = {
          farmacia: preco.farmacias,
          medicamentos: [],
          total: 0,
          disponiveis: 0
        }
      }
      
      farmaciasComPrecos[farmaciaId].medicamentos.push({
        medicamento: preco.medicamentos,
        preco: preco.preco,
        preco_promocional: preco.preco_promocional
      })
      farmaciasComPrecos[farmaciaId].total += preco.preco_promocional || preco.preco
      farmaciasComPrecos[farmaciaId].disponiveis++
    })

    // Ordenar por menor preço
    const resultados = Object.values(farmaciasComPrecos)
      .sort((a: any, b: any) => a.total - b.total)

    return NextResponse.json({ resultados })
  } catch (error) {
    console.error('Erro na comparação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

---

## 🔐 Tarefa 4: Configurar Autenticação

### 4.1 Usar Supabase Auth

O Supabase já tem autenticação embutida. Configure assim:

```typescript
// ⚠️ ANTI-GRAVITY: Atualize o arquivo /src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    if (error) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Buscar dados do usuário
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({ 
      session: data.session,
      usuario 
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### 4.2 Login com Google

Configure no Dashboard do Supabase:
1. Vá em Authentication > Providers
2. Ative Google
3. Configure as credenciais OAuth do Google

---

## 🇧🇷 Tarefa 5: Implementar LGPD

### 5.1 Validações Necessárias

```typescript
// ⚠️ ANTI-GRAVITY: Adicione estas validações no registro

// Validar CPF (algoritmo brasileiro)
export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')
  
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false
  
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf[9])) return false
  
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf[10])) return false
  
  return true
}

// Validar CRM (formato: CRM-UF 000000)
export function validarCRM(crm: string): boolean {
  const regex = /^CRM-[A-Z]{2}\s\d{4,6}$/
  return regex.test(crm.toUpperCase())
}

// Validar CNPJ
export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '')
  
  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false
  
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(0))) return false
  
  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(1))) return false
  
  return true
}
```

### 5.2 Exportar Dados do Usuário (Direito LGPD)

```typescript
// ⚠️ ANTI-GRAVITY: Crie /src/app/api/lgpd/exportar/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const usuario_id = request.headers.get('x-user-id') // Viria do token JWT

    // Buscar todos os dados do usuário
    const [usuario, receitas, consentimentos] = await Promise.all([
      supabase.from('usuarios').select('*').eq('id', usuario_id).single(),
      supabase.from('receitas').select('*').eq('paciente_id', usuario_id),
      supabase.from('consentimentos_lgpd').select('*').eq('usuario_id', usuario_id)
    ])

    const dadosExportacao = {
      usuario: usuario.data,
      receitas: receitas.data,
      consentimentos: consentimentos.data,
      exportado_em: new Date().toISOString()
    }

    return NextResponse.json(dadosExportacao)
  } catch (error) {
    console.error('Erro ao exportar:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    )
  }
}
```

### 5.3 Excluir Conta (Direito LGPD)

```typescript
// ⚠️ ANTI-GRAVITY: Crie /src/app/api/lgpd/excluir/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function DELETE(request: NextRequest) {
  try {
    const usuario_id = request.headers.get('x-user-id')

    // Excluir em cascata (configurar ON DELETE CASCADE nas tabelas)
    // Ou excluir manualmente:
    
    await supabase.from('consentimentos_lgpd').delete().eq('usuario_id', usuario_id)
    await supabase.from('receita_medicamentos').delete().in('receita_id', 
      supabase.from('receitas').select('id').eq('paciente_id', usuario_id)
    )
    await supabase.from('receitas').delete().eq('paciente_id', usuario_id)
    
    // Por fim, excluir o usuário
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', usuario_id)

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao excluir conta' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Conta excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

---

## 🔗 Tarefa 6: Integração com APIs de Farmácias (Futuro)

### 6.1 Interface de Integração

```typescript
// ⚠️ ANTI-GRAVITY: Crie /src/lib/integrations/pharmacy-api.ts

interface PharmacyAPIConfig {
  farmacia_id: string
  endpoint: string
  api_key: string
}

interface MedicationSearchResult {
  ean: string
  nome: string
  preco: number
  em_estoque: boolean
}

export async function searchMedicationInPharmacy(
  config: PharmacyAPIConfig,
  ean: string
): Promise<MedicationSearchResult | null> {
  try {
    const response = await fetch(`${config.endpoint}/medicamentos?ean=${ean}`, {
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Erro na integração com farmácia:', error)
    return null
  }
}

// Função para sincronizar preços (rodar via cron job)
export async function syncPharmacyPrices() {
  const { data: farmacias } = await supabase
    .from('farmacias')
    .select('*')
    .eq('ativa', true)
    .not('api_url', 'is', null)

  const { data: medicamentos } = await supabase
    .from('medicamentos')
    .select('id, ean')
    .not('ean', 'is', null)

  for (const farmacia of farmacias || []) {
    for (const medicamento of medicamentos || []) {
      const resultado = await searchMedicationInPharmacy(
        {
          farmacia_id: farmacia.id,
          endpoint: farmacia.api_url,
          api_key: farmacia.api_key
        },
        medicamento.ean
      )

      if (resultado) {
        await supabase
          .from('precos_medicamentos')
          .upsert({
            medicamento_id: medicamento.id,
            farmacia_id: farmacia.id,
            preco: resultado.preco,
            em_estoque: resultado.em_estoque,
            updated_at: new Date().toISOString()
          }, { onConflict: 'medicamento_id,farmacia_id' })
      }
    }
  }
}
```

---

## 📋 Checklist Final

Antes de considerar o backend completo, verifique:

- [ ] Projeto Supabase criado
- [ ] Todas as tabelas criadas
- [ ] RLS habilitado em todas as tabelas
- [ ] API de autenticação funcionando
- [ ] API de cadastro de paciente funcionando
- [ ] API de cadastro de profissional funcionando
- [ ] API de busca de médicos com filtros
- [ ] API de receitas (criar, listar, detalhar)
- [ ] API de comparação de preços
- [ ] API de planos
- [ ] Validações de CPF, CRM, CNPJ implementadas
- [ ] Exportação de dados LGPD funcionando
- [ ] Exclusão de conta LGPD funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Dados de teste inseridos (especialidades, medicamentos, farmácias)

---

## 💡 Dicas Importantes

1. **Sempre use TypeScript** - O projeto já está configurado com tipos
2. **Siga os padrões de código** - Use o ESLint para verificar
3. **Teste as APIs** - Use Postman ou similar
4. **Documente endpoints** - Adicione comentários explicativos
5. **Erro handling** - Sempre retorne mensagens claras de erro
6. **Logs** - Adicione console.log para debug (serão removidos depois)
7. **Segurança** - Nunca exponha a service_role_key no frontend

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas sobre alguma implementação:

1. Consulte o arquivo `DOCMATCH_ARCHITECTURE.md` para referência
2. Verifique os dados mockados em `/src/data/mockData.ts`
3. Analise como o frontend está esperando os dados

---

**Boa sorte, Antigravity! 🚀**

*Este documento foi criado pelo Frontend Architect para guiar a implementação do backend.*
