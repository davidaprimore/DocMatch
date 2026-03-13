'use client'
 
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
 
export function useReceitas() {
    const { user } = useAuth()
    const [receitas, setReceitas] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
 
    useEffect(() => {
        if (!user) {
            setReceitas([])
            setIsLoading(false)
            return
        }
 
        async function fetchReceitas() {
            setIsLoading(true)
            try {
                const userId = user?.id
                if (!userId) return
 
                const { data, error } = await supabase
                    .from('receitas')
                    .select('*, medicos(*, especialidades(*)), medicamentos(*)')
                    .eq('paciente_id', userId)
                    .order('created_at', { ascending: false })
 
                if (error) throw error
                setReceitas(data || [])
            } catch (err) {
                console.error('Erro ao buscar receitas:', err)
            } finally {
                setIsLoading(false)
            }
        }
 
        fetchReceitas()
    }, [user])
 
    return { receitas, isLoading }
}
