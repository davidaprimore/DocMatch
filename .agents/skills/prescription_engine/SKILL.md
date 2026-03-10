---
name: Especialista em Prescrição Digital Brasileira
description: Skill para implementar o módulo completo de receitas digitais do DocMatch, com todos os tipos de receita regulamentados pela ANVISA/CFM, posologia, CID-10 e geração de PDF.
---

# 💊 Skill: Especialista em Prescrição Digital Brasileira

Você está implementando o módulo de **Receitas Digitais** do DocMatch. Este é um módulo regulamentado — siga as regras da ANVISA, CFM e legislação de medicamentos brasileira com rigor.

---

## Tipos de Receita (Regulamentação ANVISA)

```typescript
export type TipoReceita =
  | 'simples'            // Receita branca comum (maioria dos medicamentos)
  | 'controlada_branca'  // Notificação de receita B (benzodiazepínicos, anorexígenos)
  | 'controlada_azul'    // Receita azul (entorpecentes, morfina, codeína)
  | 'controlada_amarela' // Substâncias psicotrópicas (amphetaminas, metilfenidato)
  | 'antimicrobiano'     // Receita de controle especial (antibióticos)
```

**Validade legal por tipo:**
| Tipo | Validade padrão | Rx em 2 vias? | Descrição visual |
|---|---|---|---|
| `simples` | 30 dias | Não | Branca, sem cor especial |
| `controlada_branca` | 30 dias | Sim | Notificação B, bordas azuis |
| `controlada_azul` | 30 dias | Sim (talonário) | Azul, papel oficial |
| `controlada_amarela` | 30 dias | Sim | Amarela, papel oficial |
| `antimicrobiano` | 10 dias | Sim | Branca com carimbo específico |

---

## Schema do Banco (Português — padrão do projeto)

```sql
-- Tabela principal de receitas
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES usuarios(id),
  profissional_id UUID REFERENCES profissionais(id),
  consulta_id UUID REFERENCES agendamentos(id), -- opcional
  tipo_receita TEXT NOT NULL CHECK (tipo_receita IN (
    'simples','controlada_branca','controlada_azul','controlada_amarela','antimicrobiano'
  )),
  cid10 TEXT,              -- Código CID-10 (opcional, sensível LGPD)
  cid10_descricao TEXT,    -- Descrição por extenso
  observacoes TEXT,
  data_emissao TIMESTAMPTZ DEFAULT NOW(),
  data_validade DATE NOT NULL,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa','dispensada','expirada','cancelada')),
  assinatura_digital TEXT, -- hash SHA-256 do conteúdo
  pdf_url TEXT,            -- URL no Supabase Storage
  codigo_validacao VARCHAR(12) UNIQUE NOT NULL, -- código alfanumérico para farmácia validar
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens da receita
CREATE TABLE receita_itens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receita_id UUID REFERENCES receitas(id) ON DELETE CASCADE,
  nome_medicamento TEXT NOT NULL,
  principio_ativo TEXT,
  concentracao TEXT,          -- ex: "500mg", "10mg/mL"
  forma_farmaceutica TEXT,    -- "comprimido", "xarope", "cápsula", "pomada"
  quantidade INTEGER NOT NULL,
  unidade TEXT,               -- "caixas", "frascos", "ampolas", "comprimidos"
  posologia TEXT NOT NULL,    -- instrução completa ao paciente
  duracao_dias INTEGER,
  uso_continuo BOOLEAN DEFAULT FALSE,
  generico_autorizado BOOLEAN DEFAULT TRUE,
  codigo_anvisa TEXT,
  ordem INTEGER DEFAULT 0,    -- para ordenar os itens
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Geração do Código de Validação

```typescript
// Gerar código alfanumérico de 8 caracteres (estilo "DMX7K2P9")
export function generatePrescriptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sem caracteres ambíguos
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
```

---

## Cálculo de Data de Validade por Tipo

```typescript
import { addDays } from 'date-fns'

export function calcValidadeReceita(tipo: TipoReceita): Date {
  const hoje = new Date()
  switch (tipo) {
    case 'antimicrobiano':   return addDays(hoje, 10)
    case 'simples':          return addDays(hoje, 30)
    case 'controlada_branca': return addDays(hoje, 30)
    case 'controlada_azul':  return addDays(hoje, 30)
    case 'controlada_amarela': return addDays(hoje, 30)
    default:                 return addDays(hoje, 30)
  }
}
```

---

## Campos de CID-10

O CID-10 é opcional e sensível. Ao exibir:
- **Para o médico:** sempre visível no painel profissional
- **Para o paciente:** exibir apenas se ele optou por ver em configurações (privacidade)
- **Para a farmácia:** NUNCA exibir diagnóstico — apenas medicamentos

Busca de CID-10: Usar a lista pública. Implementar busca com `debounce(300ms)` por nome da doença ou código.

---

## Fluxo de Emissão (Tela `/profissional/receitas/nova`)

```
Step 1: Selecionar paciente (busca por nome ou CPF)
Step 2: Escolher tipo de receita + CID-10 opcional
Step 3: Adicionar medicamentos (dinâmico, arrastar para reordenar)
         - Autocomplete por nome comercial ou princípio ativo
         - Campos: concentração, forma, quantidade, posologia, duração
Step 4: Preview formatado + botão "Emitir"
         - Gera PDF → salva no Storage → notifica paciente
         - Registra assinatura digital (hash)
```

---

## RLS — Acesso à Receita

```sql
-- Paciente vê suas próprias receitas
CREATE POLICY "receita_paciente" ON receitas
  FOR SELECT USING (auth.uid() = paciente_id);

-- Profissional vê receitas que emitiu
CREATE POLICY "receita_profissional" ON receitas
  FOR ALL USING (auth.uid() = profissional_id);

-- Farmácia pode validar receita pelo código (via Edge Function — sem RLS direto)
-- Edge Function valida código e retorna apenas medicamentos (sem dados pessoais)
```

---

## Dados Mock para Teste

```typescript
export const mockReceitaSimples = {
  tipo_receita: 'simples' as const,
  cid10: 'J06.9',
  cid10_descricao: 'Infecção aguda das vias aéreas superiores',
  data_validade: '2025-04-10',
  status: 'ativa',
  codigo_validacao: 'DMX7K2P9',
  itens: [
    {
      nome_medicamento: 'Amoxicilina',
      principio_ativo: 'Amoxicilina triidratada',
      concentracao: '500mg',
      forma_farmaceutica: 'Cápsula',
      quantidade: 1,
      unidade: 'caixa',
      posologia: '1 cápsula a cada 8 horas por 7 dias',
      duracao_dias: 7,
      uso_continuo: false,
      generico_autorizado: true,
    },
    {
      nome_medicamento: 'Dipirona Sódica',
      principio_ativo: 'Dipirona sódica monoidratada',
      concentracao: '500mg',
      forma_farmaceutica: 'Comprimido',
      quantidade: 1,
      unidade: 'caixa',
      posologia: '1 comprimido a cada 6 horas em caso de dor ou febre',
      duracao_dias: 5,
      uso_continuo: false,
      generico_autorizado: true,
    },
  ],
}
```

---

## Checklist LGPD para este Módulo

- [ ] CID-10 não é exibido para farmácias
- [ ] PDF armazenado com URL assinada e expiração de 24h
- [ ] Acesso ao PDF registrado em `log_acesso_dados`
- [ ] Paciente pode baixar e deletar receita (direito de portabilidade)
- [ ] Status da receita atualizado automaticamente ao vencer
