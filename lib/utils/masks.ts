/**
 * DocMatch — Biblioteca de Máscaras e Formatação Brasil
 * Referência: .agents/rules/mascaras_brasil.md
 *
 * Regra: SEMPRE importar deste arquivo. Nunca criar máscaras inline.
 * import { maskCPF, maskPhone, maskCEP, ... } from '@/lib/utils/masks'
 */

// ─────────────────────────────────────────────
// CPF
// ─────────────────────────────────────────────

/** Aplica máscara de CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14)
}

/** Exibição privada (LGPD): ***.456.789-** */
export function maskCPFPrivate(cpf: string): string {
    const c = cpf.replace(/\D/g, '')
    if (c.length !== 11) return '***.***.***-**'
    return `***.${c.slice(3, 6)}.${c.slice(6, 9)}-**`
}

/** Valida CPF pelo algoritmo da Receita Federal */
export function isValidCPF(cpf: string): boolean {
    const c = cpf.replace(/\D/g, '')
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i)
    let rest = (sum * 10) % 11
    if (rest === 10 || rest === 11) rest = 0
    if (rest !== parseInt(c[9])) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i)
    rest = (sum * 10) % 11
    if (rest === 10 || rest === 11) rest = 0
    return rest === parseInt(c[10])
}

// ─────────────────────────────────────────────
// TELEFONE / CELULAR
// ─────────────────────────────────────────────

/** Aplica máscara de telefone: (21) 99999-9999 ou (21) 3333-3333 */
export function maskPhone(value: string): string {
    const c = value.replace(/\D/g, '').substring(0, 11)
    if (c.length <= 10) {
        return c
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
    }
    return c
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

/** Exibição privada (LGPD): (21) 9****-8765 */
export function maskPhonePrivate(phone: string): string {
    const c = phone.replace(/\D/g, '')
    if (c.length === 11) return `(${c.slice(0, 2)}) 9****-${c.slice(7)}`
    return `(${c.slice(0, 2)}) ****-${c.slice(6)}`
}

// ─────────────────────────────────────────────
// CEP
// ─────────────────────────────────────────────

/** Aplica máscara de CEP: 01310-100 */
export function maskCEP(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d{1,3})$/, '$1-$2')
        .substring(0, 9)
}

/** Busca endereço pelo CEP via ViaCEP (auto-fill) */
export async function fetchAddressByCEP(cep: string): Promise<{
    logradouro: string
    bairro: string
    cidade: string
    estado: string
} | null> {
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

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

/** Aplica máscara de data: DD/MM/AAAA */
export function maskDate(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 10)
}

/** Converte data de exibição BR → ISO para o banco: DD/MM/AAAA → YYYY-MM-DD */
export function dateToISO(br: string): string {
    const [d, m, y] = br.split('/')
    if (!d || !m || !y) return ''
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

/** Converte ISO (banco) → exibição BR: YYYY-MM-DD → DD/MM/AAAA */
export function dateToDisplay(iso: string): string {
    if (!iso) return ''
    const [y, m, d] = iso.split('T')[0].split('-')
    return `${d}/${m}/${y}`
}

/** Formata data por extenso em pt-BR: "15 de março de 2025" */
export function dateLong(iso: string): string {
    return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

/** Exibe há quanto tempo: "há 2 dias", "há 3 meses" */
export function dateRelative(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'agora mesmo'
    if (minutes < 60) return `há ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `há ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 30) return `há ${days} dia${days > 1 ? 's' : ''}`
    const months = Math.floor(days / 30)
    if (months < 12) return `há ${months} ${months > 1 ? 'meses' : 'mês'}`
    const years = Math.floor(months / 12)
    return `há ${years} ano${years > 1 ? 's' : ''}`
}

// ─────────────────────────────────────────────
// HORA (24H — padrão Brasil)
// ─────────────────────────────────────────────

/** Aplica máscara de hora 24h: HH:MM */
export function maskTime(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{1,2})$/, '$1:$2')
        .substring(0, 5)
}

/** Valida hora 24h */
export function isValidTime(time: string): boolean {
    const [h, m] = time.split(':').map(Number)
    return !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/** Formata ISO datetime → "DD/MM/AAAA às HH:MM" */
export function datetimeToDisplay(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
    }).replace(',', ' às')
}

// ─────────────────────────────────────────────
// CNPJ
// ─────────────────────────────────────────────

/** Aplica máscara de CNPJ: 00.000.000/0001-00 */
export function maskCNPJ(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .substring(0, 18)
}

/** Valida CNPJ */
export function isValidCNPJ(cnpj: string): boolean {
    const c = cnpj.replace(/\D/g, '')
    if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false
    const calc = (n: number): number => {
        let sum = 0
        let pos = n - 7
        for (let i = n; i >= 1; i--) {
            sum += parseInt(c[n - i]) * pos--
            if (pos < 2) pos = 9
        }
        return sum % 11 < 2 ? 0 : 11 - (sum % 11)
    }
    return calc(12) === parseInt(c[12]) && calc(13) === parseInt(c[13])
}

// ─────────────────────────────────────────────
// CRM / REGISTROS DE PROFISSIONAL
// ─────────────────────────────────────────────

/** Formata registro profissional: CRM-SP 123456 */
export function maskRegistroProfissional(value: string): string {
    return value.toUpperCase().replace(/[^A-Z0-9\-\s]/g, '').substring(0, 16)
}

/** Valida registro (CRM, CRO, CREFITO, etc.) */
export function isValidRegistroProfissional(value: string): boolean {
    return /^(CRM|CRO|CREFITO|CREFONO|CFN|CFF|CRN|CFMV)-[A-Z]{2}[\s\-]\d{4,7}$/.test(
        value.trim().toUpperCase()
    )
}

// ─────────────────────────────────────────────
// MOEDA (Real Brasileiro)
// ─────────────────────────────────────────────

/** Formata número como moeda BRL: R$ 1.250,90 */
export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

/** Máscara de entrada de moeda (para campos de formulário) */
export function maskCurrency(value: string): string {
    const clean = value.replace(/\D/g, '')
    if (!clean) return ''
    const number = parseInt(clean) / 100
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

/** Converte string formatada em BRL → número: "R$ 1.250,90" → 1250.90 */
export function parseCurrency(formatted: string): number {
    return parseFloat(
        formatted.replace(/[R$\s.]/g, '').replace(',', '.')
    ) || 0
}

// ─────────────────────────────────────────────
// DISTÂNCIA
// ─────────────────────────────────────────────

/** Formata distância em km ou metros */
export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`
    if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`
    return `${Math.round(km)} km`
}

// ─────────────────────────────────────────────
// UTILITÁRIOS GERAIS
// ─────────────────────────────────────────────

/** Remove qualquer máscara de uma string (só dígitos) */
export function onlyDigits(value: string): string {
    return value.replace(/\D/g, '')
}

/** Calcula idade a partir de data de nascimento ISO */
export function calcAge(dob: string): number {
    const today = new Date()
    const birth = new Date(dob)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
}
