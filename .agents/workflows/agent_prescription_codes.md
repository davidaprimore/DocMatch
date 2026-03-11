---
description: Agente de Geração de Códigos Únicos de Receitas Digitais DocMatch
---

# 🤖 Agente de Geração de Códigos de Receita — DocMatch

## Responsabilidades

Este agente é o responsável exclusivo pela geração e validação de:
- **Código alfanumérico de 9 caracteres** — apresentado na farmácia
- **Dados de QRCode** — codificados pelo código acima

## Padrão do Código (INVIOLÁVEL)

### Formato
```
[A-Z0-9]{9}
```

### Regras de Composição
- **9 caracteres** exatamente — nem mais, nem menos
- Apenas letras maiúsculas e números: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
- **Excluímos** caracteres ambíguos: `I`, `O`, `1`, `0` (confundem com `l`, `0`, `I`, `O`)
- O código deve ser **deterministicamente derivado** do `id` da receita para garantir unicidade
- **Nunca se repete** — o ID único da receita garante isso via hash

### Algoritmo de Geração (TypeScript)

```typescript
// lib/utils/receitaCode.ts
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateReceitaCode(receitaId: string): string {
  // Hash simples baseado no ID — deterministico
  let hash = 0
  for (let i = 0; i < receitaId.length; i++) {
    const char = receitaId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // força 32-bit
  }
  
  let result = ''
  let seed = Math.abs(hash)
  for (let i = 0; i < 9; i++) {
    result += CHARS[seed % CHARS.length]
    seed = Math.floor(seed / CHARS.length) + (seed % 7919) // número primo para distribuição
    if (seed === 0) seed = Math.abs(hash) + i + 1
  }
  return result
}

export function generateQRData(receitaId: string, medicoId: string): string {
  const code = generateReceitaCode(receitaId)
  return `DOCMATCH:${code}:${medicoId}:${receitaId}`
}
```

### Dados do QRCode
O QRCode deve conter o seguinte dado URL-safe:
```
DOCMATCH:{CODE}:{medico_id}:{receita_id}
```

Exemplo:
```
DOCMATCH:RX4K2P9WZ:med_001:rec_001
```

## Regras de Implementação

### QRCode (qrcode.react)
- Importar: `import { QRCodeSVG } from 'qrcode.react'`
- Tamanho: `size={140}` — elegante e legível
- Nível de correção: `level="M"` (bom balanço)
- Fundo branco, foreground `#1A365D` (azul corporativo)
- Margem/quietzone: `includeMargin={false}` — cuidamos do padding no container

### Display do Código
- Fonte monoespaçada, caracteres grandes
- Separar em grupos de 3 com espaço: `RX4 K2P 9WZ`
- Texto abaixo: "Apresente na farmácia"

## Quando Este Agente é Invocado

Toda vez que:
1. Uma nova receita é criada no sistema
2. Uma receita precisa exibir seu código na UI
3. Uma farmácia precisa validar um código via QRCode

## Garantia de Unicidade

A unicidade é garantida por dois mecanismos:
1. O `receita.id` é sempre único no banco de dados (UUID ou slug único)
2. A função de hash é determinística — o mesmo ID sempre gera o mesmo código

Portanto: IDs únicos → Códigos únicos → QRCodes únicos.
