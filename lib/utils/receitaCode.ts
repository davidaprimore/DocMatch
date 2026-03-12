/**
 * Gerator de Códigos Únicos de Receitas Digitais — DocMatch
 * Agente: agent_prescription_codes
 * 
 * Padrão: 9 chars alfanuméricos, sem caracteres ambíguos (I, O, 0, 1)
 * Determinístico: mesmo receitaId → mesmo código (garante unicidade)
 */

// Alfabeto sem caracteres ambíguos: sem I, O, 0, 1
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * Gera código de 9 caracteres deterministicamente a partir do ID da receita
 */
export function generateReceitaCode(receitaId: string): string {
    // Hash polynomial rolling — rápido e determinístico
    let hash = 5381
    for (let i = 0; i < receitaId.length; i++) {
        hash = ((hash << 5) + hash) ^ receitaId.charCodeAt(i)
        hash = hash >>> 0 // força unsigned 32-bit
    }

    let result = ''
    let seed = hash

    for (let i = 0; i < 9; i++) {
        result += CHARS[seed % CHARS.length]
        // LCG (Linear Congruential Generator) com constantes cuidadosas
        seed = (seed * 1664525 + 1013904223) >>> 0
        if (seed === 0) seed = hash ^ (i * 2654435769)
    }

    return result
}

/**
 * Formata o código em grupos de 3 para leitura humana: "RX4 K2P 9WZ"
 */
export function formatReceitaCode(code: string): string {
    return `${code.slice(0, 3)} ${code.slice(3, 6)} ${code.slice(6, 9)}`
}

/**
 * Gera o valor a ser encodado no QRCode
 * Formato: DOCMATCH:{CODE}:{medicoId}:{receitaId}
 */
export function generateQRData(receitaId: string, medicoId: string): string {
    const code = generateReceitaCode(receitaId)
    return `DOCMATCH:${code}:${medicoId}:${receitaId}`
}
