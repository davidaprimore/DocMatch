'use client'
 
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Stethoscope, User, Briefcase, CheckCircle2, Circle, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { maskCPF, maskPhone, isValidCPF, onlyDigits } from '@/lib/utils/masks'
 
export default function CadastroPage() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [tipo, setTipo] = useState<'paciente' | 'medico'>('paciente')
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ 
        nome: '', 
        email: '', 
        telefone: '', 
        password: '', 
        confirmPassword: '', 
        cpf: '', 
        crm: '', 
        especialidade: '' 
    })
 
    const passwordRequirements = useMemo(() => {
        const p = form.password
        return [
            { label: 'Mínimo 8 caracteres', met: p.length >= 8 },
            { label: 'Uma letra maiúscula', met: /[A-Z]/.test(p) },
            { label: 'Uma letra minúscula', met: /[a-z]/.test(p) },
            { label: 'Um número', met: /[0-9]/.test(p) },
            { label: 'Um caractere especial', met: /[^A-Za-z0-9]/.test(p) },
        ]
    }, [form.password])
 
    const isPasswordValid = passwordRequirements.every(r => r.met)
 
    const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let v = e.target.value
        if (f === 'cpf') v = maskCPF(v)
        if (f === 'telefone') v = maskPhone(v)
        setForm(prev => ({ ...prev, [f]: v }))
    }
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nome || !form.email || !form.password || !form.confirmPassword) { 
            toast.error('Preencha os campos obrigatórios')
            return 
        }
        if (form.password !== form.confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }
        if (!isPasswordValid) {
            toast.error('A senha não atende aos requisitos de segurança')
            return
        }
        if (tipo === 'paciente' && form.cpf && !isValidCPF(form.cpf)) { 
            toast.error('CPF inválido')
            return 
        }
 
        try {
            // Limpa máscaras para salvar apenas dígitos no banco
            const cleanData = {
                ...form,
                tipo,
                cpf: onlyDigits(form.cpf),
                telefone: onlyDigits(form.telefone)
            }
            await register(cleanData)
            router.push(tipo === 'medico' ? '/medico/dashboard' : '/dashboard')
        } catch (err: any) {
            // Toast já disparado no hook
        }
    }
 
    const especialidades = ['Alergologia', 'Cardiologia', 'Cirurgia Geral', 'Clínica Geral', 'Dermatologia', 'Endocrinologia', 'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Ortopedia', 'Pediatria', 'Psiquiatria', 'Urologia']
 
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] via-[#2D5284] to-[#1A365D] flex flex-col p-6 py-10 overflow-x-hidden">
            <button onClick={() => router.back()} className="text-white mb-6 self-start p-2 hover:bg-white/10 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
            </button>
 
            <div className="mb-6 text-center">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
                    <Stethoscope className="w-8 h-8 text-[#1A365D]" />
                </div>
                <h1 className="text-2xl font-black text-white">Criar conta grátis</h1>
                <p className="text-white/60 text-sm mt-1">Sua saúde, conectada e digital</p>
            </div>
 
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-7 border border-white/20 shadow-2xl space-y-6">
                    {/* Switch Tipo */}
                    <div className="flex bg-white/5 rounded-2xl p-1">
                        <button onClick={() => setTipo('paciente')} className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${tipo === 'paciente' ? 'bg-[#D4AF37] text-[#1A365D] shadow-lg' : 'text-white/40'}`}>
                            <User className="w-3.5 h-3.5" /> Paciente
                        </button>
                        <button onClick={() => setTipo('medico')} className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${tipo === 'medico' ? 'bg-[#D4AF37] text-[#1A365D] shadow-lg' : 'text-white/40'}`}>
                            <Briefcase className="w-3.5 h-3.5" /> Médico
                        </button>
                    </div>
 
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <InputField label="Nome completo" value={form.nome} onChange={set('nome')} placeholder="Como deseja ser chamado" />
                            <InputField label="E-mail" type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" />
                            <InputField label="Telefone" type="tel" value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" maxLength={15} />
                            
                            {tipo === 'paciente' ? (
                                <InputField label="CPF" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" maxLength={14} />
                            ) : (
                                <>
                                    <InputField label="CRM" value={form.crm} onChange={set('crm')} placeholder="UF 000000" />
                                    <div className="space-y-1.5">
                                        <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Especialidade</label>
                                        <select value={form.especialidade} onChange={set('especialidade')}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition appearance-none">
                                            <option value="" className="bg-[#1A365D]">Selecionar especialidade</option>
                                            {especialidades.map(e => <option key={e} value={e} className="bg-[#1A365D]">{e}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
 
                            <div className="space-y-1.5">
                                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Senha</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Crie uma senha forte"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
 
                            <InputField label="Confirmar Senha" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repita a senha" />
                            
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <div className="flex items-center gap-1.5 ml-1 mt-1">
                                    <XCircle className="w-3 h-3 text-red-400" />
                                    <span className="text-red-400 text-[10px] font-bold">As senhas não coincidem</span>
                                </div>
                            )}
 
                            {/* Password Checklist - Movido para baixo */}
                            {form.password && (
                                <div className="bg-black/20 rounded-2xl p-3.5 space-y-2 border border-white/5 animate-in fade-in zoom-in-95 duration-200">
                                    {passwordRequirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            {req.met ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Circle className="w-3.5 h-3.5 text-white/10" />
                                            )}
                                            <span className={`text-[10.5px] font-bold ${req.met ? 'text-emerald-400/80' : 'text-white/30'}`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
 
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-[0_12px_32px_-8px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 text-[13px] uppercase tracking-wider">
                                {isLoading ? 'Processando dados...' : 'Finalizar Cadastro →'}
                            </button>
                        </div>
                    </form>
 
                    <p className="text-center text-white/30 text-[10px] leading-relaxed max-w-[200px] mx-auto">
                        Ao se cadastrar, você concorda com nossos <Link href="/termos" className="text-[#D4AF37] font-bold hover:underline">Termos</Link> e <Link href="/privacidade" className="text-[#D4AF37] font-bold hover:underline">Privacidade</Link>.
                    </p>
                </div>
 
                <p className="text-center text-white/40 text-sm mt-8">
                    Já é membro?{' '}
                    <Link href="/login" className="text-[#D4AF37] font-black hover:underline tracking-tight">FAZER LOGIN</Link>
                </p>
            </div>
        </div>
    )
}
 
function InputField({ label, ...props }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">{label}</label>
            <input {...props} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition" 
            />
        </div>
    )
}
