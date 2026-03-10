-- ==========================================
-- ESTRUTURA DO BANCO DOCMATCH (AUTONOMIA TOTAL)
-- ==========================================

-- 1. Especialidades
CREATE TABLE IF NOT EXISTS public.especialidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    icone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Médicos
CREATE TABLE IF NOT EXISTS public.medicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    crm TEXT UNIQUE NOT NULL,
    especialidade_id UUID REFERENCES public.especialidades(id),
    foto TEXT,
    bio TEXT,
    valor_consulta NUMERIC,
    nota NUMERIC DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    endereco JSONB,
    planos_aceitos TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Pacientes (Linkado ao Auth do Supabase)
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    data_nascimento DATE,
    foto TEXT,
    planos_saude TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    medico_id UUID REFERENCES public.medicos(id) ON DELETE CASCADE,
    data_horario TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Outras Tabelas Necessárias
CREATE TABLE IF NOT EXISTS public.farmacias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    logo TEXT,
    endereco JSONB,
    distancia NUMERIC,
    entrega_online BOOLEAN DEFAULT false,
    tempo_entrega TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medicamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    principio_ativo TEXT,
    dosagem TEXT,
    apresentacao TEXT,
    preco_referencia NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Habilitar Segurança (RLS)
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- 7. Políticas de Acesso
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Leitura pública de especialidades" ON public.especialidades;
    CREATE POLICY "Leitura pública de especialidades" ON public.especialidades FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Leitura pública de medicos" ON public.medicos;
    CREATE POLICY "Leitura pública de medicos" ON public.medicos FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Pacientes gerenciam seu próprio perfil" ON public.pacientes;
    CREATE POLICY "Pacientes gerenciam seu próprio perfil" ON public.pacientes FOR ALL USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Pacientes gerenciam seus agendamentos" ON public.agendamentos;
    CREATE POLICY "Pacientes gerenciam seus agendamentos" ON public.agendamentos FOR ALL USING (auth.uid() = paciente_id);
END $$;

-- 8. Seed Inicial
INSERT INTO public.especialidades (nome, icone) VALUES 
('Cardiologia', 'Heart'),
('Pediatria', 'Baby'),
('Dermatologia', 'Sparkles'),
('Clínico Geral', 'Stethoscope')
ON CONFLICT DO NOTHING;
