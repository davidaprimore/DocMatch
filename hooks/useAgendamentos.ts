'use client'
 
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
 
export function useAgendamentos() {
    const { user } = useAuth()
    const [agendamentos, setAgendamentos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
 
    useEffect(() => {
        if (!user) {
            setAgendamentos([])
            setIsLoading(false)
            return
        }
 
        async function fetchAgendamentos() {
            setIsLoading(true)
            try {
                const userId = user?.id
                if (!userId) return
 
                const { data, error } = await supabase
                    .from('agendamentos')
                    .select('*, medicos(*, especialidades(*))')
                    .eq('paciente_id', userId)
                    .order('data_horario', { ascending: true })
 
                if (error) throw error
                setAgendamentos(data || [])
            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err)
            } finally {
                setIsLoading(false)
            }
        }
 
        fetchAgendamentos()
    }, [user])
 
    return { agendamentos, isLoading }
}
