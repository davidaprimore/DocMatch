# Documentação para Antigravity - Back-end DocMatch

## Visão Geral

Olá, Antigravity! Você será responsável pelo desenvolvimento do back-end do DocMatch, uma plataforma brasileira que conecta pacientes, médicos e farmácias. Este documento contém todas as instruções detalhadas do que precisa ser implementado.

## Tecnologias

- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: RESTful API via Supabase Edge Functions (ou Node.js/Express se preferir)
- **Pagamentos**: Stripe ou PagSeguro (para assinaturas)
- **Notificações**: Firebase Cloud Messaging

## Estrutura do Banco de Dados (Supabase)

### 1. Tabela: `users`
```sql
-- Tabela principal de usuários (estende auth.users do Supabase)
create table users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  nome text not null,
  telefone text not null,
  tipo text not null check (tipo in ('paciente', 'medico', 'farmacia')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  -- LGPD
  consentimento_lgpd boolean default false,
  data_consentimento timestamp with time zone,
  
  constraint valid_phone check (telefone ~ '^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$')
);

-- Trigger para atualizar updated_at
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();
```

### 2. Tabela: `pacientes`
```sql
create table pacientes (
  id uuid references users on delete cascade primary key,
  cpf text unique not null,
  data_nascimento date not null,
  endereco jsonb not null, -- { cep, logradouro, numero, complemento, bairro, cidade, estado, latitude, longitude }
  plano_saude_id uuid references planos_saude,
  numero_carteirinha text,
  favoritos uuid[] default array[]::uuid[], -- array de IDs de médicos
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 3. Tabela: `medicos`
```sql
create table medicos (
  id uuid references users on delete cascade primary key,
  crm text unique not null,
  especialidade text not null,
  subespecialidade text,
  bio text,
  foto_url text,
  endereco_consultorio jsonb not null,
  planos_saude_aceitos uuid[] default array[]::uuid[],
  valor_consulta decimal(10,2) not null,
  valor_consulta_particular decimal(10,2) not null,
  horarios_disponiveis jsonb default '[]', -- [{ dia_semana, hora_inicio, hora_fim, intervalo_inicio, intervalo_fim }]
  avaliacao decimal(2,1) default 5.0,
  total_avaliacoes integer default 0,
  destaque boolean default false,
  formacao text[] default array[]::text[],
  experiencia text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índice para busca geoespacial
CREATE INDEX idx_medicos_location ON medicos USING GIN (endereco_consultorio);

-- Índice para busca por especialidade
CREATE INDEX idx_medicos_especialidade ON medicos (especialidade);
```

### 4. Tabela: `farmacias`
```sql
create table farmacias (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  cnpj text unique not null,
  endereco jsonb not null,
  telefone text not null,
  logo_url text,
  horario_funcionamento jsonb not null, -- { abertura, fechamento, _24h }
  entrega_online boolean default false,
  api_integracao jsonb, -- { url_base, chave_api, status }
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 5. Tabela: `consultas`
```sql
create table consultas (
  id uuid default gen_random_uuid() primary key,
  paciente_id uuid references pacientes not null,
  medico_id uuid references medicos not null,
  data date not null,
  horario time not null,
  status text default 'agendada' check (status in ('agendada', 'confirmada', 'realizada', 'cancelada', 'nao_compareceu')),
  tipo text default 'presencial' check (tipo in ('presencial', 'online')),
  valor decimal(10,2) not null,
  plano_saude_utilizado uuid references planos_saude,
  receita_id uuid,
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Índice para busca por paciente
  constraint unique_consulta unique (medico_id, data, horario)
);

CREATE INDEX idx_consultas_paciente ON consultas (paciente_id);
CREATE INDEX idx_consultas_medico ON consultas (medico_id);
CREATE INDEX idx_consultas_data ON consultas (data);
```

### 6. Tabela: `receitas`
```sql
create table receitas (
  id uuid default gen_random_uuid() primary key,
  consulta_id uuid references consultas not null,
  paciente_id uuid references pacientes not null,
  medico_id uuid references medicos not null,
  data_emissao timestamp with time zone default timezone('utc'::text, now()),
  validade date not null,
  medicamentos jsonb not null, -- [{ id, nome, principio_ativo, concentracao, forma_farmaceutica, posologia, quantidade, uso_continuo }]
  observacoes text,
  qr_code text unique,
  assinatura_digital text not null,
  status text default 'ativa' check (status in ('ativa', 'utilizada', 'vencida', 'cancelada')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE INDEX idx_receitas_paciente ON receitas (paciente_id);
CREATE INDEX idx_receitas_qr ON receitas (qr_code);
```

### 7. Tabela: `assinaturas`
```sql
create table assinaturas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users not null,
  tipo_user text not null check (tipo_user in ('paciente', 'medico')),
  plano text not null,
  status text default 'ativo' check (status in ('ativo', 'inativo', 'cancelado', 'pendente')),
  data_inicio timestamp with time zone not null,
  data_renovacao timestamp with time zone,
  data_cancelamento timestamp with time zone,
  valor_mensal decimal(10,2),
  gateway_id text, -- ID da assinatura no Stripe/PagSeguro
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE INDEX idx_assinaturas_user ON assinaturas (user_id);
CREATE INDEX idx_assinaturas_status ON assinaturas (status);
```

### 8. Tabela: `avaliacoes`
```sql
create table avaliacoes (
  id uuid default gen_random_uuid() primary key,
  paciente_id uuid references pacientes not null,
  medico_id uuid references medicos not null,
  consulta_id uuid references consultas not null,
  nota integer not null check (nota >= 1 and nota <= 5),
  comentario text,
  data timestamp with time zone default timezone('utc'::text, now()),
  anonimo boolean default false,
  
  constraint unique_avaliacao unique (paciente_id, consulta_id)
);

CREATE INDEX idx_avaliacoes_medico ON avaliacoes (medico_id);
```

### 9. Tabela: `planos_saude`
```sql
create table planos_saude (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  operadora text not null,
  tipo text check (tipo in ('individual', 'empresarial', 'familiar')),
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Inserir planos comuns no Brasil
insert into planos_saude (nome, operadora, tipo) values
  ('Unimed Nacional', 'Unimed', 'individual'),
  ('Amil One', 'Amil', 'individual'),
  ('Bradesco Saúde Top', 'Bradesco', 'individual'),
  ('SulAmérica Exato', 'SulAmérica', 'individual'),
  ('NotreDame Intermédica', 'GNDI', 'individual'),
  ('Porto Seguro Saúde', 'Porto Seguro', 'individual'),
  ('Particular', 'Particular', 'individual');
```

### 10. Tabela: `lgpd_consentimentos`
```sql
create table lgpd_consentimentos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users not null,
  finalidade text not null,
  consentido boolean not null,
  data_consentimento timestamp with time zone default timezone('utc'::text, now()),
  data_revogacao timestamp with time zone,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE INDEX idx_lgpd_user ON lgpd_consentimentos (user_id);
```

### 11. Tabela: `lgpd_solicitacoes`
```sql
create table lgpd_solicitacoes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users not null,
  tipo text not null check (tipo in ('acesso', 'retificacao', 'exclusao', 'portabilidade', 'oposicao')),
  status text default 'pendente' check (status in ('pendente', 'em_analise', 'concluida', 'negada')),
  data_solicitacao timestamp with time zone default timezone('utc'::text, now()),
  data_resposta timestamp with time zone,
  resposta text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE INDEX idx_lgpd_solicitacoes_user ON lgpd_solicitacoes (user_id);
```

## Row Level Security (RLS) - IMPORTANTE!

### Políticas de Segurança

```sql
-- Habilitar RLS em todas as tabelas
alter table users enable row level security;
alter table pacientes enable row level security;
alter table medicos enable row level security;
alter table consultas enable row level security;
alter table receitas enable row level security;
alter table avaliacoes enable row level security;

-- Política: Usuários só podem ver seus próprios dados
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política: Pacientes só podem ver seus próprios dados
CREATE POLICY "Pacientes view own" ON pacientes
  FOR ALL USING (auth.uid() = id);

-- Política: Médicos podem ser vistos por todos (para busca)
CREATE POLICY "Medicos public view" ON medicos
  FOR SELECT USING (true);

-- Política: Médicos só podem editar seus próprios dados
CREATE POLICY "Medicos edit own" ON medicos
  FOR UPDATE USING (auth.uid() = id);

-- Política: Consultas visíveis para paciente e médico envolvidos
CREATE POLICY "Consultas view participants" ON consultas
  FOR SELECT USING (
    auth.uid() = paciente_id OR 
    auth.uid() = medico_id
  );

-- Política: Receitas visíveis para paciente e médico
CREATE POLICY "Receitas view participants" ON receitas
  FOR SELECT USING (
    auth.uid() = paciente_id OR 
    auth.uid() = medico_id
  );
```

## Edge Functions (API)

### 1. Busca de Médicos
```typescript
// functions/search-doctors/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { especialidade, localizacao, plano_saude, valor_maximo, raio_km } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  let query = supabase
    .from('medicos')
    .select('*, users(nome, email, telefone)')
    .eq('users.ativo', true)
  
  if (especialidade) {
    query = query.ilike('especialidade', `%${especialidade}%`)
  }
  
  if (valor_maximo) {
    query = query.lte('valor_consulta', valor_maximo)
  }
  
  // Busca geoespacial com PostGIS
  if (localizacao && raio_km) {
    const { data } = await supabase.rpc('nearby_medicos', {
      lat: localizacao.latitude,
      long: localizacao.longitude,
      radius_km: raio_km
    })
    return new Response(JSON.stringify(data))
  }
  
  const { data, error } = await query
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  
  return new Response(JSON.stringify(data))
})
```

### 2. Função RPC para Busca Geoespacial
```sql
-- Criar extensão PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Adicionar coluna de geometria
ALTER TABLE medicos ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Criar índice espacial
CREATE INDEX idx_medicos_geom ON medicos USING GIST (geom);

-- Função para buscar médicos próximos
CREATE OR REPLACE FUNCTION nearby_medicos(
  lat double precision,
  long double precision,
  radius_km double precision
)
RETURNS TABLE (
  id uuid,
  nome text,
  especialidade text,
  avaliacao decimal,
  valor_consulta decimal,
  distance double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    u.nome,
    m.especialidade,
    m.avaliacao,
    m.valor_consulta,
    ST_Distance(
      m.geom::geography,
      ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography
    ) / 1000 as distance
  FROM medicos m
  JOIN users u ON u.id = m.id
  WHERE ST_DWithin(
    m.geom::geography,
    ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
    radius_km * 1000
  )
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;
```

## Integração com Farmácias

### Estrutura de API para Farmácias Parceiras

```typescript
// Interface que as farmácias devem implementar
interface FarmaciaAPI {
  // Autenticação
  authenticate(): Promise<string>; // Retorna token
  
  // Busca de medicamentos
  searchMedicamentos(query: string): Promise<Medicamento[]>;
  
  // Verificar preços e estoque
  getPrecos(medicamentosIds: string[]): Promise<{
    id: string;
    preco: number;
    preco_promocional?: number;
    estoque: number;
    disponivel: boolean;
  }[]>;
  
  // Criar pedido
  createOrder(dados: {
    medicamentos: { id: string; quantidade: number }[];
    cliente: { nome: string; cpf: string; telefone: string };
    endereco?: Endereco;
    tipo: 'entrega' | 'retirada';
  }): Promise<{ orderId: string; status: string }>;
}
```

### Serviço de Agregação de Preços

```typescript
// services/preco-aggregator.ts
export async function compararPrecos(
  medicamentos: string[],
  localizacao: { lat: number; long: number }
): Promise<ResultadoComparacao[]> {
  const farmacias = await getFarmaciasAtivas();
  
  const resultados = await Promise.all(
    farmacias.map(async (farmacia) => {
      try {
        const precos = await farmacia.api.getPrecos(medicamentos);
        const precoTotal = precos.reduce((sum, p) => sum + (p.preco_promocional || p.preco), 0);
        
        return {
          farmacia,
          medicamentos: precos,
          preco_total_cesta: precoTotal,
          distancia_km: calcularDistancia(localizacao, farmacia.endereco),
        };
      } catch (error) {
        console.error(`Erro ao buscar preços de ${farmacia.nome}:`, error);
        return null;
      }
    })
  );
  
  return resultados
    .filter(Boolean)
    .sort((a, b) => a!.preco_total_cesta - b!.preco_total_cesta);
}
```

## Sistema de Assinaturas

### Webhook Stripe para Assinaturas

```typescript
// functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      // Ativar assinatura
      await supabase.from('assinaturas').update({
        status: 'ativo',
        gateway_id: session.subscription,
      }).eq('user_id', session.client_reference_id)
      break
      
    case 'invoice.payment_failed':
      // Notificar usuário e suspender após 3 tentativas
      break
      
    case 'customer.subscription.deleted':
      // Cancelar assinatura
      break
  }
  
  return new Response(JSON.stringify({ received: true }))
})
```

## LGPD - Conformidade

### Logs de Acesso
```typescript
// middleware/lgpd-logger.ts
export async function logAcesso(
  userId: string,
  acao: string,
  dadosAcessados: string[],
  req: Request
) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  await supabase.from('lgpd_logs').insert({
    user_id: userId,
    acao,
    dados_acessados: dadosAcessados,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
  })
}
```

### Exportação de Dados (Portabilidade)
```typescript
// functions/export-data/index.ts
export async function exportarDadosUsuario(userId: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Buscar todos os dados do usuário
  const [user, paciente, consultas, receitas] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('pacientes').select('*').eq('id', userId).single(),
    supabase.from('consultas').select('*').eq('paciente_id', userId),
    supabase.from('receitas').select('*').eq('paciente_id', userId),
  ])
  
  const dadosCompletos = {
    perfil: user.data,
    dados_paciente: paciente.data,
    consultas: consultas.data,
    receitas: receitas.data,
    exportado_em: new Date().toISOString(),
  }
  
  // Gerar PDF ou JSON
  return dadosCompletos
}
```

## Notificações Push

```typescript
// services/notifications.ts
import { initializeApp } from 'firebase/app'
import { getMessaging, sendMulticast } from 'firebase/messaging'

const firebaseApp = initializeApp({
  // Configuração Firebase
})

export async function enviarNotificacao(
  tokens: string[],
  titulo: string,
  corpo: string,
  dados?: Record<string, string>
) {
  const messaging = getMessaging(firebaseApp)
  
  await sendMulticast({
    tokens,
    notification: {
      title: titulo,
      body: corpo,
    },
    data,
  })
}

// Notificações programadas
export async function agendarLembreteConsulta(consultaId: string) {
  // Usar Supabase Cron ou agendador externo
  // Enviar notificação 24h antes da consulta
}
```

## Cache e Performance

```typescript
// Configurar Redis para cache (Upstash ou similar)
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_REST_URL')!,
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!,
})

// Cache de busca de médicos (5 minutos)
export async function cacheBuscaMedicos(filtros: string, resultados: any[]) {
  await redis.setex(`busca:${filtros}`, 300, JSON.stringify(resultados))
}

// Cache de preços de farmácias (15 minutos)
export async function cachePrecosFarmacia(farmaciaId: string, precos: any[]) {
  await redis.setex(`precos:${farmaciaId}`, 900, JSON.stringify(precos))
}
```

## Checklist de Implementação

### Fase 1: Fundação
- [ ] Configurar projeto Supabase
- [ ] Criar todas as tabelas com RLS
- [ ] Configurar autenticação (email/social)
- [ ] Criar Edge Functions básicas
- [ ] Configurar Storage para avatares

### Fase 2: Core
- [ ] CRUD de médicos e pacientes
- [ ] Sistema de busca com filtros
- [ ] Agendamento de consultas
- [ ] Geração de receitas digitais
- [ ] Sistema de avaliações

### Fase 3: Integrações
- [ ] Integrar com APIs de farmácias
- [ ] Sistema de comparação de preços
- [ ] Pagamentos (Stripe/PagSeguro)
- [ ] Notificações push

### Fase 4: LGPD
- [ ] Implementar logs de acesso
- [ ] Criar endpoints de portabilidade
- [ ] Sistema de consentimentos
- [ ] Fluxo de exclusão de dados

### Fase 5: Otimização
- [ ] Configurar cache (Redis)
- [ ] Otimizar queries
- [ ] Monitoramento e logs
- [ ] Backup automatizado

## Variáveis de Ambiente

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PREMIUM_PACIENTE=
STRIPE_PRICE_ID_PREMIUM_MEDICO=

# Firebase (Notificações)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Redis (Cache)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# APIs de Farmácias (serão fornecidas pelas farmácias parceiras)
FARMACIA_DROGARAIA_API_KEY=
FARMACIA_PAGUEMENOS_API_KEY=
```

## Contato e Suporte

Qualquer dúvida sobre os requisitos, converse com o usuário (nosso Product Owner) para esclarecimentos. O front-end já está pronto e aguardando suas APIs!
