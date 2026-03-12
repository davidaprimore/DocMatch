---
name: Especialista em Planos & Monetização
description: Skill para implementar toda a lógica de planos de assinatura, upsells sutis, lógica de acesso por tier e telas de planos do DocMatch.
---

# 💎 Skill: Especialista em Planos & Monetização

Você está implementando o **sistema de planos e assinaturas** do DocMatch. O principal objetivo é monetizar sem degradar a experiência — upsell sutil, não intrusivo.

---

## Definição dos Planos (Fonte da Verdade)

### Paciente

| Feature | Gratuito | Plus (R$ 19,90/mês) | Premium (R$ 39,90/mês) |
|---|---|---|---|
| Busca de médicos | ✅ | ✅ | ✅ |
| Comparador de preços | ✅ | ✅ | ✅ |
| Histórico de receitas | 3 últimas | Ilimitado | Ilimitado |
| Alertas de preço | ❌ | ✅ | ✅ |
| Lembretes de consulta | ❌ | ✅ | ✅ |
| Teleconsulta integrada | ❌ | ❌ | ✅ |
| Dependentes | ❌ | ❌ | Até 3 |
| Suporte prioritário | ❌ | ❌ | ✅ |

### Profissional

| Feature | Básico (R$ 79,90/mês) | Destaque (R$ 149,90/mês) |
|---|---|---|
| Perfil no app | ✅ | ✅ |
| Receita digital ilimitada | ✅ | ✅ |
| Aparecer em busca | ✅ | ✅ + Badge "Em Destaque" |
| Posição privilegiada | ❌ | ✅ |
| Agendamento online | 1 consultório | Ilimitado |
| Relatórios | Básico | Avançado |
| Suporte prioritário | ❌ | ✅ |

### Farmácia

| Feature | Básico (R$ 99,90/mês) | Integrado (R$ 199,90/mês) |
|---|---|---|
| Aparecer no comparador | ✅ | ✅ |
| Cadastro manual de preços | ✅ | ✅ |
| Integração via API | ❌ | ✅ |
| Analytics completo | ❌ | ✅ |
| Badge "Parceiro Verificado" | ❌ | ✅ |

---

## Lógica de Gate de Acesso por Tier

```typescript
// src/hooks/usePlanAccess.ts
import { useAuth } from '@/hooks/useAuth'

export type PlanFeature =
  | 'historico_ilimitado'
  | 'alertas_preco'
  | 'teleconsulta'
  | 'dependentes'
  | 'destaque_busca'
  | 'api_integracao'

const FEATURE_TIERS: Record<PlanFeature, string[]> = {
  historico_ilimitado: ['plus', 'premium'],
  alertas_preco:       ['plus', 'premium'],
  teleconsulta:        ['premium'],
  dependentes:         ['premium'],
  destaque_busca:      ['destaque'],
  api_integracao:      ['integrado'],
}

export function usePlanAccess() {
  const { user } = useAuth()
  const planoAtual = user?.plano_nome ?? 'gratuito'

  function canAccess(feature: PlanFeature): boolean {
    return FEATURE_TIERS[feature].includes(planoAtual)
  }

  function requirePlan(feature: PlanFeature, callback: () => void) {
    if (canAccess(feature)) {
      callback()
    } else {
      // Nunca modal bloqueante — apenas toast com CTA
      toast('Recurso disponível no plano Plus 📈', {
        description: 'Faça upgrade para desbloquear.',
        action: { label: 'Ver Planos', onClick: () => navigate('/planos') },
      })
    }
  }

  return { canAccess, requirePlan, planoAtual }
}
```

---

## Upsell Sutil — Regras de Ouro 

> **NUNCA** usar modais bloqueantes para upsell. Sempre banners inline ou toasts.

**Exemplos de upsell correto:**

```tsx
// Na tela de receitas — quando ultrapassa 3 receitas no plano gratuito
{planoGratuito && receitas.length >= 3 && (
  <div className="mx-4 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
    <p className="text-sm font-semibold text-amber-800">
      📋 Histórico limitado no plano Gratuito
    </p>
    <p className="text-xs text-amber-700 mt-1">
      Você atingiu o limite. Acesse receitas antigas com o plano Plus.
    </p>
    <button className="mt-2 text-xs font-bold text-amber-900 underline">
      Ver planos →
    </button>
  </div>
)}

// Toast de alerta de preço (feature bloqueada)
toast.info('💊 Amoxicilina está 30% mais barata perto de você!', {
  description: 'Ative alertas de preço com o plano Plus.',
  action: { label: 'Saiba mais', onClick: () => navigate('/planos') }
})
```

---

## Layout da Tela de Planos (`/planos`)

```
1. Toggle mensal/anual no topo (anual = 20% off — badge "Economize 20%")
2. Cards lado a lado (scroll horizontal no mobile)
3. Card do plano atual com borda dourada (#D4AF37) destacada
4. Feature list com ✅ e ❌
5. CTA: "Assinar agora" (dourado) | "Continuar Gratuito" (ghost)
6. FAQ recolhível abaixo
7. Nota "Garantia de 7 dias — direito do consumidor"
```

---

## Seed SQL dos Planos

```sql
-- Limpar e recriar planos (caso precise resetar)
DELETE FROM planos;

INSERT INTO planos (nome, tipo, preco_mensal, destaque, ordem, recursos) VALUES
('Gratuito',  'paciente',     0,    false, 1, '{"historico_ilimitado":false,"alertas_preco":false,"teleconsulta":false}'),
('Plus',      'paciente',     19.9, true,  2, '{"historico_ilimitado":true,"alertas_preco":true,"teleconsulta":false}'),
('Premium',   'paciente',     39.9, false, 3, '{"historico_ilimitado":true,"alertas_preco":true,"teleconsulta":true}'),
('Básico',    'profissional', 79.9, false, 1, '{"destaque_busca":false,"agendamento_online":1}'),
('Destaque',  'profissional', 149.9,true,  2, '{"destaque_busca":true,"agendamento_online":-1}'),
('Básico',    'farmacia',     99.9, false, 1, '{"api_integracao":false,"analytics_completo":false}'),
('Integrado', 'farmacia',     199.9,true,  2, '{"api_integracao":true,"analytics_completo":true}');
```
