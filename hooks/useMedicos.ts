'use client'

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

    const fetchMedicos = async (silent = false) => {
        if (!silent) setIsLoading(true)
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
            setError(null)
        } catch (err: any) {
            console.error('Erro ao buscar médicos:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMedicos()

        // Revalidação automática ao voltar para a aba
        const handleFocus = () => fetchMedicos(true)
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [])

    return { medicos, isLoading, error, refetch: () => fetchMedicos() }
}
