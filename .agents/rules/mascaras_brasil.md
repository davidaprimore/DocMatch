# 🇧🇷 Regras Globais — Máscaras e Formatação Brasil

> **REGRA CRÍTICA:** Todos os agentes e todo código produzido para o DocMatch DEVEM seguir estas regras de formatação sem exceção. Nenhum campo de entrada ou exibição de dado deve fugir destes padrões. O app é 100% brasileiro.

---

## 📋 CPF — Cadastro de Pessoas Físicas

**Formato:** `XXX.XXX.XXX-XX`

```typescript
// Máscara de entrada (aplicar no onChange)
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14)
}

// Exibição mascarada (LGPD — nunca exibir CPF completo em tela pública)
export function maskCPFPrivate(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  return `***.${clean.slice(3, 6)}.${clean.slice(6, 9)}-**`
}

// Validação (algoritmo oficial Receita Federal)
export function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(clean[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  return rest === parseInt(clean[10])
}
```

**Regras de exibição:**
- Em formulários próprios (perfil logado): exibir completo com máscara `XXX.XXX.XXX-XX`
- Em telas públicas ou de terceiros: **SEMPRE** mascarar como `***.456.789-**`
- Nunca armazenar sem criptografia no banco

---

## 📞 Telefone / Celular

**Formato celular:** `(XX) 9XXXX-XXXX` (11 dígitos)
**Formato fixo:**    `(XX) XXXX-XXXX`  (10 dígitos)

```typescript
export function maskPhone(value: string): string {
  const clean = value.replace(/\D/g, '').substring(0, 11)
  if (clean.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  // Celular: (XX) 9XXXX-XXXX
  return clean
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

// Exibição mascarada (LGPD)
export function maskPhonePrivate(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) {
    return `(${clean.slice(0,2)}) 9****-${clean.slice(7)}`
  }
  return `(${clean.slice(0,2)}) ****-${clean.slice(6)}`
}
```

**Placeholder sempre:** `(21) 99999-9999`

---

## 📮 CEP — Código de Endereçamento Postal

**Formato:** `XXXXX-XXX`

```typescript
export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 9)
}

// Após digitar CEP completo (8 dígitos), chamar ViaCEP automaticamente
export async function fetchAddressByCEP(cep: string) {
  const clean = cep.replace(/\D/g, '')
  if (clean.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const data = await res.json()
    if (data.erro) return null
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    }
  } catch {
    return null
  }
}
```

**Placeholder sempre:** `01310-100`
**Regra:** Ao preencher o CEP completo (8 dígitos), buscar automaticamente o endereço via ViaCEP e preencher os campos de rua, bairro, cidade e estado automaticamente.

---

## 📅 Data

**Formato de entrada:** `DD/MM/AAAA`
**Formato de exibição:** `DD/MM/AAAA`
**Formato de armazenamento no banco:** `YYYY-MM-DD` (ISO 8601)

```typescript
export function maskDate(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 10)
}

// Converter exibição → banco
export function dateToISO(br: string): string {
  const [d, m, y] = br.split('/')
  return `${y}-${m}-${d}`
}

// Converter banco → exibição
export function dateToDisplay(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Exibir data por extenso em português
export function dateToLong(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  // Exemplo: "15 de março de 2025"
}
```

**Placeholder sempre:** `DD/MM/AAAA`

---

## 🕒 Hora (24h)

**Formato:** `HH:MM` (formato 24 horas — padrão Brasil)

```typescript
export function maskTime(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1:$2')
    .substring(0, 5)
}

export function isValidTime(time: string): boolean {
  const [h, m] = time.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

// Exibir data + hora juntos
export function datetimeToDisplay(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  // Exemplo: "15/03/2025 às 14:30"
}
```

**Nunca usar AM/PM.** O Brasil usa formato 24h.
**Placeholder:** `HH:MM`

---

## 🏦 CNPJ — Cadastro Nacional de Pessoas Jurídicas

**Formato:** `XX.XXX.XXX/XXXX-XX`

```typescript
export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .substring(0, 18)
}

export function isValidCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, '')
  if (clean.length !== 14 || /^(\d)\1+$/.test(clean)) return false
  const calc = (c: string, n: number) => {
    let sum = 0
    let pos = n - 7
    for (let i = n; i >= 1; i--) {
      sum += parseInt(c[n - i]) * pos--
      if (pos < 2) pos = 9
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }
  return (
    calc(clean, 12) === parseInt(clean[12]) &&
    calc(clean, 13) === parseInt(clean[13])
  )
}
```

**Placeholder:** `00.000.000/0001-00`

---

## 💊 CRM / CRO / CREFITO (Registro de Profissional)

**Formato:** `CRM-SP 123456` ou `CRO-RJ 98765`

```typescript
export function maskCRM(value: string): string {
  // Remove tudo que não é letra, número ou hífen
  const upper = value.toUpperCase().replace(/[^A-Z0-9\-\s]/g, '')
  return upper.substring(0, 15)
}

export function isValidCRM(crm: string): boolean {
  // Aceita: CRM-UF 000000 ou CRM-UF-000000
  return /^(CRM|CRO|CREFITO|CREFONO|CFN|CFF|CRN|CFMV)-[A-Z]{2}[\s-]\d{4,7}$/.test(crm.trim().toUpperCase())
}
```

**Formato exato exigido no cadastro de profissionais:** `SIGLA-UF NÚMERO`
Exemplos: `CRM-SP 123456` | `CRO-RJ 9876` | `CREFITO-MG 12345`

---

## 💰 Moeda (Real Brasileiro)

**Formato:** `R$ X.XXX,XX` (ponto como separador de milhar, vírgula como decimal)

```typescript
export function maskCurrency(value: string): string {
  const clean = value.replace(/\D/g, '')
  const number = parseInt(clean) / 100
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  // Exemplo: "R$ 1.250,90"
}

export function currencyToNumber(formatted: string): number {
  return parseFloat(
    formatted.replace(/[R$\s.]/g, '').replace(',', '.')
  )
}
```

**Nunca usar ponto como separador decimal.** Ex: ~~R$ 1250.90~~ ❌ → R$ 1.250,90 ✅

---

## 📏 Distância

**Formato:** `X,X km` (vírgula decimal, unidade km)

```typescript
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1).replace('.', ',')} km`
}
// Exemplos: "350 m" | "1,5 km" | "12,8 km"
```

---

## 📁 Arquivo para Colocar Estas Funções

**Criar em:** `src/lib/utils/masks.ts`

Todas as funções de máscara devem residir neste arquivo único. Importar onde necessário:

```typescript
import { maskCPF, maskPhone, maskCEP, maskDate, maskTime, maskCNPJ, maskCurrency } from '@/lib/utils/masks'
```

---

## ✅ Checklist de Uso por Tela

| Campo | Máscara entrada | Exibição logado | Exibição público |
|---|---|---|---|
| CPF | `maskCPF` | `XXX.XXX.XXX-XX` | `***.XXX.XXX-**` |
| Telefone | `maskPhone` | `(XX) 9XXXX-XXXX` | `(XX) 9****-XXXX` |
| CEP | `maskCEP` + ViaCEP auto | `XXXXX-XXX` | — |
| Data nasc. | `maskDate` | `DD/MM/AAAA` | só mostrar idade |
| Hora | `maskTime` (24h) | `HH:MM` | `HH:MM` |
| CNPJ | `maskCNPJ` | `XX.XXX.XXX/XXXX-XX` | — |
| CRM/CRO | `maskCRM` | `CRM-SP XXXXXX` | `CRM-SP XXXXXX` |
| Valor | `maskCurrency` | `R$ X.XXX,XX` | `R$ X.XXX,XX` |
| Distância | `formatDistance` | `X,X km` | `X,X km` |

---

> **Lembre-se:** O Brasil usa vírgula como separador decimal (`1,50`) e ponto como separador de milhar (`1.000`). O oposto do padrão inglês. Nunca confundir.
