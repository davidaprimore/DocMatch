# Script de Configuração do Banco de Dados - DocMatch

David, como o nosso conector automático deslogou, preparei o roteiro completo para você deixar o seu Supabase pronto em 30 segundos.

### 1. Instruções para o Banco de Dados
Copie o código SQL abaixo de ponta a ponta.
1. Vá no seu painel do **Supabase**.
2. Clique no menu **SQL Editor** (o ícone de `>_` na barra lateral esquerda).
3. Clique em **"+ New query"**.
4. Cole o código e clique em **"Run"**.

```sql
-- ==========================================
-- ESTRUTURA DO BANCO DOCMATCH (FASE REAL)
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

-- 5. Farmácias e Medicamentos (Cesta de Compras)
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

-- 7. Políticas de Acesso (LGPD)
CREATE POLICY "Leitura pública de especialidades" ON public.especialidades FOR SELECT USING (true);
CREATE POLICY "Leitura pública de medicos" ON public.medicos FOR SELECT USING (true);
CREATE POLICY "Pacientes gerenciam seu próprio perfil" ON public.pacientes FOR ALL USING (auth.uid() = id);
CREATE POLICY "Pacientes gerenciam seus agendamentos" ON public.agendamentos FOR ALL USING (auth.uid() = paciente_id);

-- ==========================================
-- SEED DATA (DADOS INICIAIS)
-- ==========================================

INSERT INTO public.especialidades (nome, icone) VALUES 
('Cardiologia', 'Heart'),
('Pediatria', 'Baby'),
('Dermatologia', 'Sparkles'),
('Clínico Geral', 'Stethoscope');

-- Nota: Os médicos reais serão inseridos após criarmos as especialidades.
```

### 2. Imagens Realistas
Eu gerei e já salvei na pasta `public/images` do seu projeto as seguintes imagens exclusivas:
- **`avatar_joce.png`**: Seu novo avatar profissional.
- **`dr_lucas.png`**: Foto realista para o cardiologista.
- **`dra_ana.png`**, **`dr_andre.png`**, **`dra_beatriz.png`**: Fotos para os médicos sugeridos.

Note que o Dashboard já foi atualizado para carregar essas fotos locais! Se você atualizar o browser agora, já vai ver as fotos reais lá.

---
**Status da Missão:**
1. ✅ Arquivo `.env.local` configurado com suas chaves.
2. ✅ Dashboard atualizado com fotos realistas locais.
3. ⏳ Aguardando você rodar o SQL acima para eu começar a trocar o "MockData" pelos dados reais do banco.
