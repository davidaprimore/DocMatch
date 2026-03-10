---
name: Arquiteto de Agendamento Online
description: Skill dedicada a implementar o fluxo completo de agendamento de consultas: calendário de disponibilidade, reserva de slot, confirmação e cancelamento.
---

# 📅 Skill: Arquiteto de Agendamento Online

Você está implementando o **módulo de Agendamento** do DocMatch. Este módulo conecta pacientes a médicos permitindo marcação online de consulta em slots definidos pelo profissional.

---

## Conceitos do Domínio

```
Profissional → define → HorariosDisponibilidade (dia_semana + hora_inicio + hora_fim)
HorariosDisponibilidade → gera → SlotsDisponíveis (instâncias de datas futuras)
Paciente → reserva → SlotsDisponíveis → cria → Agendamento
```

---

## Geração de Slots (Função Helper)

```typescript
import { addDays, setHours, setMinutes, format, isBefore } from 'date-fns'

interface HorarioDisponibilidade {
  dia_semana: number      // 0=dom, 1=seg, ... 6=sáb
  hora_inicio: string     // "08:00"
  hora_fim: string        // "17:00"
}

interface Slot {
  data: Date
  hora: string            // "09:00"
  disponivel: boolean
}

/**
 * Gera todos os slots de um local profissional para os próximos N dias
 */
export function gerarSlots(
  horarios: HorarioDisponibilidade[],
  agendamentosExistentes: string[], // Array de ISO strings já agendados
  diasAFuturos = 30,
  duracaoMinutos = 30
): Slot[] {
  const slots: Slot[] = []
  const hoje = new Date()

  for (let d = 0; d <= diasAFuturos; d++) {
    const dia = addDays(hoje, d)
    const diaSemana = dia.getDay()

    const horarioDoDia = horarios.find(h => h.dia_semana === diaSemana)
    if (!horarioDoDia) continue

    const [hStart, mStart] = horarioDoDia.hora_inicio.split(':').map(Number)
    const [hEnd, mEnd] = horarioDoDia.hora_fim.split(':').map(Number)

    let slotTime = setMinutes(setHours(dia, hStart), mStart)
    const endTime = setMinutes(setHours(dia, hEnd), mEnd)

    while (isBefore(slotTime, endTime)) {
      const isoSlot = slotTime.toISOString()
      slots.push({
        data: slotTime,
        hora: format(slotTime, 'HH:mm'),
        disponivel: !agendamentosExistentes.includes(isoSlot) && isBefore(hoje, slotTime),
      })
      slotTime = addDays(slotTime, 0) // próximo slot
      slotTime = new Date(slotTime.getTime() + duracaoMinutos * 60000)
    }
  }

  return slots
}
```

---

## Estados do Agendamento

```
pendente    → Paciente marcou, aguarda confirmação do médico
confirmado  → Médico confirmou (ou auto-confirmado se configurado assim)
realizado   → Consulta aconteceu
cancelado   → Cancelado por qualquer das partes (registrar quem + motivo)
faltou      → Paciente não compareceu
```

---

## Fluxo da Tela `/agendar` (Paciente)

```
Step 1: Header com foto e nome do profissional
Step 2: Tabs — "Selecionar Data" / "Confirmar"
Step 3: Grid de dias (7 dias scrollável em carrossel horizontal)
Step 4: Grid de horários do dia selecionado
         - Botões cinza = indisponível
         - Botões azul claro = disponível (hover → azul escuro)
         - Botão selecionado = azul premium (#2D5284) com check
Step 5: Seção "Tipo de consulta": Presencial | Teleconsulta (se disponível)
Step 6: Seção "Plano de saúde ou particular?"
Step 7: Botão "Confirmar Agendamento" (dourado #D4AF37)
Step 8: Modal de confirmação → sucesso → notificação disparada
```

---

## Cancelamento (Regras)

- Cancelamento pelo **paciente**: permitido até 24h antes. Após isso: mensagem de aviso (sem bloqueio — decisão futura).
- Cancelamento pelo **médico**: sempre permitido com motivo obrigatório.
- Status muda para `'cancelado'` + registrar `cancelado_por` + `motivo_cancelamento`.
- Notificar a outra parte automaticamente.

---

## Notificações de Agendamento

```typescript
const tiposNotificacao = {
  lembrete_24h: 'Lembrete: você tem consulta amanhã às HH:MM com Dr(a). NOME',
  lembrete_2h:  'Sua consulta começa em 2 horas. Dr(a). NOME — LOCAL',
  confirmado:   'Consulta confirmada! Dr(a). NOME — DATA às HH:MM',
  cancelado:    'Consulta cancelada. MOTIVO. Reagende pelo app.',
}
```

---

## Mock de Agendamentos

```typescript
export const MOCK_AGENDAMENTOS = [
  {
    id: 'agend-01',
    profissional_nome: 'Dr. Carlos Eduardo Ferreira',
    especialidade: 'Dermatologia',
    agendado_para: '2025-04-15T14:00:00-03:00',
    status: 'confirmado',
    tipo: 'presencial',
    local: 'Clínica Barra, RJ',
  },
  {
    id: 'agend-02',
    profissional_nome: 'Dra. Mariana Alves Costa',
    especialidade: 'Clínica Geral',
    agendado_para: '2025-03-28T10:30:00-03:00',
    status: 'realizado',
    tipo: 'teleconsulta',
    local: 'Online',
  },
]
```
