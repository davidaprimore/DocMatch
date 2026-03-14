'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useAgendamento(id: string) {
    const { user } = useAuth()
    const [agendamento, setAgendamento] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user || !id) {
            setAgendamento(null)
            setIsLoading(false)
            return
        }

        async function fetchAgendamento() {
            setIsLoading(true)
            setError(null)
            try {
                const { data, error: supabaseError } = await supabase
                    .from('agendamentos')
                    .select('*, medicos(*, especialidades(*))')
                    .eq('id', id)
                    .single()

                if (supabaseError) throw supabaseError
                
                // Verificar se o agendamento pertence ao usuário logado
                if (data.paciente_id !== user?.id) {
                    throw new Error('Você não tem permissão para ver esta consulta.')
                }

                setAgendamento(data)
            } catch (err: any) {
                console.error('Erro ao buscar agendamento:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAgendamento()
    }, [user, id])

    return { agendamento, isLoading, error, setAgendamento }
}
