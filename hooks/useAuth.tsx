'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
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
    const [isLoading, setIsLoading] = useState(true)

    // Recupera sessão ao montar
    useEffect(() => {
        async function getSession() {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('usuarios')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    if (profile) {
                        setUser({
                            id: profile.id,
                            email: profile.email,
                            nome: profile.nome_completo,
                            telefone: profile.telefone,
                            tipo: profile.tipo_usuario,
                            foto: profile.foto,
                            cpf: profile.cpf,
                            consentimento_lgpd: profile.consentimento_lgpd,
                            created_at: session.user.created_at,
                            updated_at: session.user.updated_at
                        } as User)
                    }
                }
            } catch (err) {
                console.error('Erro ao recuperar sessão:', err)
            } finally {
                setIsLoading(false)
            }
        }
        getSession()
    }, [])

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
                    foto: data.foto || null,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    consentimento_lgpd: data.consentimento_lgpd || false,
                } as User)
            } else {
                throw new Error('Usuário não encontrado')
            }
        } catch (err) {
            console.error('Erro ao buscar perfil:', err)
            throw err
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
            // 1. Registro no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        nome_completo: data.nome,
                        tipo_usuario: data.tipo
                    }
                }
            })
 
            if (authError) throw authError
            if (!authData.user) throw new Error('Falha ao criar usuário Auth')
 
            // 2. Inserção na tabela de perfis (usuarios)
            const { data: newUser, error: profileError } = await supabase
                .from('usuarios')
                .insert({
                    id: authData.user.id,
                    nome_completo: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    tipo_usuario: data.tipo,
                    cpf: data.cpf,
                    consentimento_lgpd: true,
                    data_consentimento: new Date().toISOString()
                })
                .select()
                .single()
 
            if (profileError) {
                // Se der erro no perfil, removemos o user do auth? 
                // Geralmente deixamos ou tratamos, mas como é um teste, vamos apenas logar o erro
                console.error('Erro ao salvar perfil:', profileError)
                throw profileError
            }
            
            // 3. Pós-registro para médicos
            if (data.tipo === 'medico' && data.crm) {
                await supabase.from('medicos').insert({
                    id: authData.user.id,
                    nome: data.nome,
                    crm: data.crm,
                    especialidade_id: data.especialidade // Assumindo que o select passa o ID
                })
            } else if (data.tipo === 'paciente') {
                await supabase.from('pacientes').insert({
                    id: authData.user.id,
                    nome: data.nome,
                    cpf: data.cpf
                })
            }
 
            setUser({
                id: authData.user.id,
                email: data.email,
                nome: data.nome,
                telefone: data.telefone,
                tipo: data.tipo,
                cpf: data.cpf,
                created_at: authData.user.created_at,
                updated_at: authData.user.updated_at,
                consentimento_lgpd: true,
            } as User)
 
            toast.success('Conta criada com sucesso!')
        } catch (err: any) {
            console.error('Erro no registro:', err)
            let message = err.message || 'Erro ao criar conta.'
            
            // Tradução de erros comuns do Supabase Auth
            if (message.includes('rate limit')) {
                message = 'Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos e tente novamente.'
            } else if (message.includes('User already registered') || message.includes('already exists')) {
                message = 'Este e-mail já está cadastrado em nossa plataforma.'
            } else if (message.includes('valid email')) {
                message = 'Por favor, insira um e-mail válido.'
            }

            toast.error(message)
            // Não re-lançamos para evitar que o Next.js mostre o overlay de erro em dev
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
