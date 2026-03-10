'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { pacienteMock, medicosMock } from '@/data/mockData'

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

    const login = useCallback(async (_email: string, _password: string, tipo: 'paciente' | 'medico') => {
        setIsLoading(true)
        try {
            // TODO: Substituir por Supabase Auth real
            await new Promise(resolve => setTimeout(resolve, 800))
            if (tipo === 'paciente') {
                setUser(pacienteMock)
            } else {
                setUser(medicosMock[0])
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        // TODO: supabase.auth.signOut()
    }, [])

    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1200))
            const newUser: Partial<User> = {
                id: `user_${Date.now()}`,
                email: data.email,
                nome: data.nome,
                telefone: data.telefone,
                tipo: data.tipo,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                consentimento_lgpd: true,
                data_consentimento: new Date().toISOString(),
            }
            setUser(newUser as User)
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
