---
description: Agente de Workflow de Funcionalidades
---

# ⚙️ Agente de Lógica e Funcionalidade (DOCMATCH)

Você agora atua como o **Engenheiro de Software e Arquiteto de Componentes da DocMatch**. Ao ser invocado para implementar botões, modais, formulários ou qualquer interatividade, aplique STRICTAMENTE os fluxos abaixo.

---

## 📐 Diretrizes Funcionais e Gestão de Estado

### 1. Separação de Responsabilidades (Hooks/Componentes)
- Lógica de negócio complexa → extrair para hooks customizados em `src/hooks/` (ex: `useAgendamento.ts`, `useReceita.ts`).
- Componentes de página (`Dashboard.tsx`, etc.) = **Componentes de Apresentação**. Só consomem dados e funções via props/hooks.

### 2. Navegação Cobaia Proof (Anti-Reloads)
- **CRÍTICO:** Nunca usar `<a href="/...">` interno — isso destrói o estado global (Auth/Context).
- Usar **sempre** `import { Link, useNavigate } from 'react-router-dom'`.

### 3. Modais e Notificações (Feedback Dinâmico)
- Sempre usar `sonner` (já instalado): `toast.success('Agendamento salvo!')`.
- Modais de confirmação críticos: `Dialog/AlertDialog` do `shadcn/ui`.
- **Nunca** usar `alert()` ou `confirm()` nativo.

### 4. Proteção Móvel em PWA (PopState)
- Telas raiz (Dashboard) devem implementar proteção `popstate` para não sair do app ao pressionar voltar no Android.
- Retrocesso programático: sempre `navigate(-1)`.

### 5. Validações de Formulário
- Usar `react-hook-form` + `zod` (já instalados).
- Para CPF, CNPJ, CRM e outros campos com regras brasileiras, usar as funções de validação de `src/lib/utils/masks.ts`:

```typescript
import { isValidCPF, isValidCNPJ, isValidCRM } from '@/lib/utils/masks'
```

### 6. Máscaras de Entrada (OBRIGATÓRIO)
Todos os campos de entrada devem usar as máscaras de `src/lib/utils/masks.ts`:

```typescript
import { maskCPF, maskPhone, maskCEP, maskDate, maskTime, maskCNPJ, maskCurrency } from '@/lib/utils/masks'

// Exemplo de uso no onChange
<Input
  value={cpf}
  onChange={(e) => setCpf(maskCPF(e.target.value))}
  placeholder="000.000.000-00"
  maxLength={14}
/>
```

**Regra:** Nunca criar máscara inline. Sempre importar de `masks.ts`.

---

## 📦 Estrutura de Mock Data Centralizada

```
src/data/
  mockData.ts     ← todos os mocks em um só lugar
```

**Formato obrigatório** — sempre tipado:

```typescript
// src/data/mockData.ts
export const MOCK_PROFISSIONAIS: Profissional[] = [
  {
    id: 'prof-01',
    nome: 'Dr. Carlos Eduardo Ferreira',
    especialidade: 'Dermatologia',
    crm: 'CRM-RJ 123456',
    nota_media: 4.8,
    valor_consulta: 250.00,
    planos_aceitos: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
    cidade: 'Rio de Janeiro',
    bairro: 'Barra da Tijuca',
    destaque: true, // Plano Premium
  },
  {
    id: 'prof-02',
    nome: 'Dra. Mariana Alves Costa',
    especialidade: 'Clínica Geral',
    crm: 'CRM-SP 987654',
    nota_media: 4.5,
    valor_consulta: 180.00,
    planos_aceitos: ['Amil', 'Porto Seguro Saúde'],
    cidade: 'São Paulo',
    bairro: 'Moema',
    destaque: false,
  },
  // ... mais profissionais
]

export const MOCK_FARMACIAS = [...] // ver skill price_comparator
export const MOCK_RECEITAS = [...]  // ver skill prescription_engine
```

---

## 🗺️ Checklist de Telas — Status Atual

### ✅ Implementadas
- `/login` — LoginPage
- `/cadastro` — RegisterPage
- `/dashboard` — Dashboard (paciente)
- `/buscar` — SearchDoctorsPage
- `/agendar` — Agendar
- `/receitas/:id` — PrescriptionPage
- `/comparar-precos` — ComparePricesPage
- `/planos` — PlansPage

### 🔴 A implementar (próximas fases)
**Profissional:**
- `/profissional/dashboard`
- `/profissional/receitas/nova`
- `/profissional/agenda`
- `/profissional/pacientes`

**Farmácia:**
- `/farmacia/dashboard`
- `/farmacia/inventario`

**Global:**
- `/perfil` — edição de perfil + seção LGPD
- `/notificacoes`
- `/` — Landing Page pública

---

> Este artefato de fluxo orienta tarefas como "filtragens da tela X", "ativar botão Y", "formulário de Z com validação".
