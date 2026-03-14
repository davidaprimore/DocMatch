'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Stethoscope, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDialog } from '@/components/ui/CustomDialog'

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading } = useAuth()
    const { showDialog } = useDialog()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [tipo, setTipo] = useState<'paciente' | 'medico'>('paciente')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            showDialog({
                title: 'Campos Vazios',
                message: 'Por favor, preencha seu e-mail e senha para continuar.',
                type: 'info'
            })
            return 
        }
        try {
            await login(email, password, tipo)
            router.push(tipo === 'medico' ? '/medico/dashboard' : '/dashboard')
        } catch {
            // O erro de login já é disparado via showDialog dentro do login() do useAuth
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] via-[#2D5284] to-[#1A365D] flex flex-col items-center justify-center p-6">
            <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white transition flex items-center gap-2 text-sm font-bold">
                <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o Início
            </Link>
            
            {/* Logo */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
                    <Stethoscope className="w-9 h-9 text-[#1A365D]" />
                </div>
                <h1 className="text-3xl font-black text-white">Doc<span className="text-[#D4AF37]">Match</span></h1>
                <p className="text-white/60 text-sm mt-1">Saúde inteligente ao seu alcance</p>
            </div>

            {/* Card de Login */}
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h2 className="text-white font-bold text-xl mb-5">Entrar na sua conta</h2>

                {/* Toggle Paciente / Médico */}
                <div className="flex bg-white/10 rounded-2xl p-1 mb-5">
                    {(['paciente', 'medico'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTipo(t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tipo === t ? 'bg-[#D4AF37] text-[#1A365D]' : 'text-white/60'}`}
                        >
                            {t === 'paciente' ? '👤 Paciente' : '🩺 Profissional'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-white/80 text-xs font-semibold mb-1.5 block">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                        />
                    </div>

                    <div>
                        <label className="text-white/80 text-xs font-semibold mb-1.5 block">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Link href="/recuperar-senha" className="text-[#D4AF37] text-xs font-medium hover:underline block text-right -mt-2">
                        Esqueceu a senha?
                    </Link>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:brightness-105 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Entrando...' : (<>Entrar <ArrowRight className="w-4 h-4" /></>)}
                    </button>
                </form>

                <p className="text-center text-white/50 text-sm mt-5">
                    Ainda não tem conta?{' '}
                    <Link href="/cadastro" className="text-[#D4AF37] font-semibold hover:underline">Cadastrar grátis</Link>
                </p>
            </div>
        </div>
    )
}
