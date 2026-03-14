'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useAgendamentos() {
    const { user } = useAuth()
    const [agendamentos, setAgendamentos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAgendamentos = async (silent = false) => {
        if (!user?.id) return
        if (!silent) setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('agendamentos')
                .select('*, medicos(*, especialidades(*))')
                .eq('paciente_id', user.id)
                .order('data_horario', { ascending: true })

            if (error) throw error
            setAgendamentos(data || [])
            setError(null)
        } catch (err: any) {
            console.error('Erro ao buscar agendamentos:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            setAgendamentos([])
            setIsLoading(false)
            return
        }

        fetchAgendamentos()

        // Revalidação automática quando a janela ganha foco (ex: voltar de outra aba)
        const handleFocus = () => fetchAgendamentos(true)
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [user])

    return { agendamentos, isLoading, error, refetch: () => fetchAgendamentos() }
}
