'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Stethoscope, User, Briefcase } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { maskCPF, maskPhone, isValidCPF } from '@/lib/utils/masks'

export default function CadastroPage() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [tipo, setTipo] = useState<'paciente' | 'medico'>('paciente')
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ nome: '', email: '', telefone: '', password: '', cpf: '', crm: '', especialidade: '' })

    const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let v = e.target.value
        if (f === 'cpf') v = maskCPF(v)
        if (f === 'telefone') v = maskPhone(v)
        setForm(prev => ({ ...prev, [f]: v }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nome || !form.email || !form.password) { toast.error('Preencha todos os campos obrigatórios'); return }
        if (tipo === 'paciente' && form.cpf && !isValidCPF(form.cpf)) { toast.error('CPF inválido'); return }
        try {
            await register({ ...form, tipo })
            toast.success('Conta criada com sucesso!')
            router.push(tipo === 'medico' ? '/profissional/dashboard' : '/dashboard')
        } catch {
            toast.error('Erro ao criar conta. Tente novamente.')
        }
    }

    const especialidades = ['Alergologia', 'Cardiologia', 'Cirurgia Geral', 'Clínica Geral', 'Dermatologia', 'Endocrinologia', 'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Ortopedia', 'Pediatria', 'Psiquiatria', 'Urologia']

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] via-[#2D5284] to-[#1A365D] flex flex-col p-6 py-10">
            <button onClick={() => router.back()} className="text-white mb-6 self-start">
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
                    <Stethoscope className="w-8 h-8 text-[#1A365D]" />
                </div>
                <h1 className="text-2xl font-black text-white">Criar conta grátis</h1>
                <p className="text-white/60 text-sm mt-1">Faça parte da saúde inteligente</p>
            </div>

            <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <div className="flex bg-white/10 rounded-2xl p-1 mb-5">
                    <button onClick={() => setTipo('paciente')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${tipo === 'paciente' ? 'bg-[#D4AF37] text-[#1A365D]' : 'text-white/60'}`}>
                        <User className="w-4 h-4" /> Paciente
                    </button>
                    <button onClick={() => setTipo('medico')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${tipo === 'medico' ? 'bg-[#D4AF37] text-[#1A365D]' : 'text-white/60'}`}>
                        <Briefcase className="w-4 h-4" /> Profissional
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    {[
                        { label: 'Nome completo *', field: 'nome', type: 'text', placeholder: 'Seu nome completo' },
                        { label: 'E-mail *', field: 'email', type: 'email', placeholder: 'seu@email.com' },
                    ].map(({ label, field, type, placeholder }) => (
                        <div key={field}>
                            <label className="text-white/80 text-xs font-semibold mb-1 block">{label}</label>
                            <input type={type} value={form[field as keyof typeof form]} onChange={set(field as keyof typeof form)} placeholder={placeholder}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                        </div>
                    ))}

                    <div>
                        <label className="text-white/80 text-xs font-semibold mb-1 block">Telefone</label>
                        <input type="tel" value={form.telefone} onChange={set('telefone')} placeholder="(11) 99999-9999" maxLength={15}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                    </div>

                    {tipo === 'paciente' && (
                        <div>
                            <label className="text-white/80 text-xs font-semibold mb-1 block">CPF</label>
                            <input type="text" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" maxLength={14}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                        </div>
                    )}

                    {tipo === 'medico' && (
                        <>
                            <div>
                                <label className="text-white/80 text-xs font-semibold mb-1 block">CRM (ex: CRM-SP 123456)</label>
                                <input type="text" value={form.crm} onChange={set('crm')} placeholder="CRM-SP 123456"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                            </div>
                            <div>
                                <label className="text-white/80 text-xs font-semibold mb-1 block">Especialidade</label>
                                <select value={form.especialidade} onChange={set('especialidade')}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4AF37] transition">
                                    <option value="" className="bg-[#1A365D]">Selecionar...</option>
                                    {especialidades.map(e => <option key={e} value={e} className="bg-[#1A365D]">{e}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="text-white/80 text-xs font-semibold mb-1 block">Senha *</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <p className="text-white/40 text-[10px] leading-relaxed">
                        Ao criar conta, você concorda com nossos{' '}
                        <Link href="/termos" className="text-[#D4AF37] underline">Termos de Uso</Link>{' '}e{' '}
                        <Link href="/privacidade" className="text-[#D4AF37] underline">Política de Privacidade</Link> (LGPD).
                    </p>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3.5 shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:brightness-105 transition disabled:opacity-50 mt-2">
                        {isLoading ? 'Criando conta...' : 'Criar conta grátis →'}
                    </button>
                </form>

                <p className="text-center text-white/50 text-sm mt-4">
                    Já tem conta?{' '}
                    <Link href="/login" className="text-[#D4AF37] font-semibold hover:underline">Entrar</Link>
                </p>
            </div>
        </div>
    )
}
