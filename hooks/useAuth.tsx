'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { onlyDigits } from '@/lib/utils/masks'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string, tipo: 'paciente' | 'medico') => Promise<void>
    logout: () => void
    register: (data: RegisterData) => Promise<void>
    updateUser: (data: Partial<User>) => void
    updateProfile: (data: Partial<User>) => Promise<void>
    refreshUser: () => Promise<void>
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
    const router = useRouter()

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Erro ao buscar perfil:', error)
                return null
            }

            if (profile) {
                return {
                    id: profile.id,
                    email: profile.email,
                    nome: profile.nome_completo,
                    telefone: profile.telefone,
                    tipo: profile.tipo_usuario,
                    foto: profile.foto,
                    cpf: profile.cpf,
                    consentimento_lgpd: profile.consentimento_lgpd,
                    created_at: profile.created_at,
                    updated_at: profile.updated_at
                } as User
            }
            return null
        } catch (err) {
            console.error('Erro na requisição de perfil:', err)
            return null
        }
    }, [])

    const refreshUser = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            setUser(profile)
        } else {
            setUser(null)
        }
    }, [fetchProfile])

    // Escuta mudanças no estado de autenticação e dados em tempo real
    useEffect(() => {
        let profileChannel: any = null

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const profile = await fetchProfile(session.user.id)
                setUser(profile)

                // Configurar Sincronização em Tempo Real (WebSockets)
                if (profileChannel) profileChannel.unsubscribe()
                
                profileChannel = supabase
                    .channel(`profile_sync_${session.user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'usuarios',
                            filter: `id=eq.${session.user.id}`
                        },
                        (payload) => {
                            const updated = payload.new as any
                            setUser(prev => prev ? {
                                ...prev,
                                nome: updated.nome_completo,
                                email: updated.email,
                                telefone: updated.telefone,
                                foto: updated.foto,
                                cpf: updated.cpf,
                                updated_at: updated.updated_at
                            } : null)
                        }
                    )
                    .subscribe()
            } else {
                setUser(null)
                if (profileChannel) profileChannel.unsubscribe()
            }
            
            if (event === 'SIGNED_OUT') {
                router.push('/login')
            }
        })

        // Inicialização
        refreshUser().finally(() => setIsLoading(false))

        return () => {
            subscription.unsubscribe()
            if (profileChannel) profileChannel.unsubscribe()
        }
    }, [fetchProfile, refreshUser, router])

    const login = useCallback(async (email: string, password: string, tipo: 'paciente' | 'medico') => {
        setIsLoading(true)
        try {
            // 1. Autenticação REAL no Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Falha na autenticação')

            // 2. Busca perfil
            const profile = await fetchProfile(authData.user.id)
            
            if (!profile) {
                throw new Error('Perfil de usuário não encontrado no banco de dados.')
            }

            // 3. Valida se o tipo bate (opcional, mas seguro)
            if (profile.tipo !== tipo) {
                // Apenas avisar ou bloquear? Vamos apenas avisar, mas deixar logar.
                console.warn(`Tipo de usuário divergente. Esperado: ${tipo}, Encontrado: ${profile.tipo}`)
            }

            setUser(profile)
        } catch (err: any) {
            console.error('Erro no login:', err)
            let message = 'E-mail ou senha incorretos'
            
            // Diagnóstico para Vercel
            if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
                message = 'Configuração do Supabase ausente na Vercel. Verifique as Variáveis de Ambiente.'
            } else if (err.message?.includes('Invalid login credentials')) {
                message = 'E-mail ou senha incorretos.'
            } else if (err.message) {
                message = err.message
            }
            toast.error(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [fetchProfile])

    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            toast.success('Sessão encerrada.')
        } catch (err) {
            console.error('Erro ao deslogar:', err)
        }
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
 
            // 2. Inserção na tabela principal (usuarios) - Usamos upsert pois o Trigger pode ter criado antes
            const { error: profileError } = await supabase
                .from('usuarios')
                .upsert({
                    id: authData.user.id,
                    nome_completo: data.nome,
                    email: data.email,
                    telefone: onlyDigits(data.telefone),
                    tipo_usuario: data.tipo,
                    cpf: onlyDigits(data.cpf || ''),
                    consentimento_lgpd: true,
                    termos_aceitos_em: new Date().toISOString()
                })
 
            if (profileError) {
                console.error('Erro ao salvar perfil em usuarios:', JSON.stringify(profileError, null, 2))
                throw new Error(`Erro no perfil: ${profileError.message}`)
            }
            
            // 3. Pós-registro para médicos
            if (data.tipo === 'medico') {
                let especialidadeId = null
                if (data.especialidade) {
                    const { data: espData } = await supabase
                        .from('especialidades')
                        .select('id')
                        .eq('nome', data.especialidade)
                        .maybeSingle()
                    especialidadeId = espData?.id
                }

                const { error: medicoError } = await supabase.from('medicos').upsert({
                    id: authData.user.id,
                    nome: data.nome,
                    crm: data.crm || 'N/A',
                    especialidade_id: especialidadeId
                })
                if (medicoError) {
                    console.error('Erro ao salvar medico:', medicoError)
                    // Não vamos travar o processo se o perfil principal já foi criado, 
                    // mas vamos avisar no console.
                }
            } else if (data.tipo === 'paciente') {
                const { error: pacienteError } = await supabase.from('pacientes').upsert({
                    id: authData.user.id,
                    nome: data.nome,
                    email: data.email,
                    telefone: onlyDigits(data.telefone),
                    cpf: onlyDigits(data.cpf || '')
                })
                if (pacienteError) console.error('Erro ao salvar paciente:', pacienteError)
            }
 
            // 4. Atualiza estado local (só funciona se não houver confirmação de e-mail pendente)
            if (authData.session) {
                const finalProfile = await fetchProfile(authData.user.id)
                setUser(finalProfile)
            } else {
                toast.info('Verifique seu e-mail para confirmar o cadastro.', { duration: 10000 })
            }
 
            toast.success('Conta criada com sucesso!')
        } catch (err: any) {
            console.error('Erro completo no registro:', err)
            let message = err.message || 'Erro ao criar conta.'
            
            if (message.includes('rate limit')) {
                message = 'Muitas tentativas. Aguarde um momento.'
            } else if (message.includes('User already registered') || message.includes('already exists')) {
                message = 'Este e-mail já está cadastrado.'
            } else if (message.includes('violates check constraint')) {
                message = 'Dados inválidos. Verifique o CPF e telefone.'
            }

            toast.error(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [fetchProfile])

    const updateUser = useCallback((data: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...data } : null)
    }, [])

    const updateProfile = useCallback(async (data: Partial<User>) => {
        if (!user) return
 
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({
                    nome_completo: data.nome,
                    telefone: data.telefone,
                    foto: data.foto,
                    cpf: data.cpf,
                    consentimento_lgpd: data.consentimento_lgpd
                })
                .eq('id', user.id)
 
            if (error) throw error
            setUser(prev => prev ? { ...prev, ...data } : null)
        } catch (err) {
            console.error('Erro ao atualizar perfil:', err)
            throw err
        }
    }, [user])
 
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, updateUser, updateProfile, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
