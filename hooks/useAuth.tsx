'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { pacienteMock, medicosMock } from '@/data/mockData'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string, tipo: 'paciente' | 'medico') => Promise<void>
    logout: () => void
    register: (data: RegisterData) => Promise<void>
    updateUser: (data: Partial<User>) => void
}

interface RegisterData {
    nome: string
    email: string
    telefone: string
    password: string
    tipo: 'paciente' | 'medico'
    cpf?: string
    crm?: string
    especialidade?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = useCallback(async (email: string, _password: string, tipo: 'paciente' | 'medico') => {
        setIsLoading(true)
        try {
            // Busca perfil real no Supabase (tabela usuarios)
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single()

            if (data && !error) {
                setUser({
                    id: data.id,
                    email: data.email,
                    nome: data.nome_completo,
                    telefone: data.telefone,
                    tipo: data.tipo_usuario,
                    foto: data.foto || '/avatar-sophie.png',
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    consentimento_lgpd: data.consentimento_lgpd || false,
                } as User)
            } else {
                // Fallback para mock se o usuário não for encontrado (Sophie padrão)
                await new Promise(resolve => setTimeout(resolve, 800))
                if (tipo === 'paciente') {
                    setUser(pacienteMock)
                } else {
                    setUser(medicosMock[0])
                }
            }
        } catch (err) {
            console.error('Erro ao buscar perfil:', err)
            // Fallback em caso de erro de conexão
            if (tipo === 'paciente') setUser(pacienteMock)
            else setUser(medicosMock[0])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        setUser(null)
        await supabase.auth.signOut()
    }, [])

    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true)
        try {
            // Em um sistema real, aqui usariamos supabase.auth.signUp
            // Por enquanto, simulamos e inserimos na tabela usuarios
            const { data: newUser, error } = await supabase
                .from('usuarios')
                .insert({
                    nome_completo: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    tipo_usuario: data.tipo,
                    consentimento_lgpd: true
                })
                .select()
                .single()

            if (error) throw error
            
            setUser({
                id: newUser.id,
                email: newUser.email,
                nome: newUser.nome_completo,
                telefone: newUser.telefone,
                tipo: newUser.tipo_usuario,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at,
                consentimento_lgpd: true,
            } as User)
        } catch (err) {
            console.error('Erro no registro:', err)
            toast.error('Erro ao criar conta.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateUser = useCallback((data: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...data } : null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
