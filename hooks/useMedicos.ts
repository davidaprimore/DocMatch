import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Medico {
    id: string
    nome: string
    crm: string
    especialidade: {
        id: string
        nome: string
        icone: string
    } | null
    foto: string
    bio: string
    valor_consulta: number
    nota: number
    total_avaliacoes: number
    endereco: {
        cidade: string
        estado: string
        logradouro: string
        numero: string
        bairro: string
        cep: string
    } | null
    planos_aceitos: string[]
}

export function useMedicos() {
    const [medicos, setMedicos] = useState<Medico[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchMedicos() {
            try {
                const { data, error } = await supabase
                    .from('medicos')
                    .select(`
                        *,
                        especialidade:especialidades(*)
                    `)
                    .order('nota', { ascending: false })

                if (error) throw error
                setMedicos(data as Medico[])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMedicos()
    }, [])

    return { medicos, isLoading, error }
}
