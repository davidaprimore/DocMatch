'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Eye, EyeOff, Loader2, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { maskCPF, maskPhone, isValidCPF, onlyDigits } from '@/lib/utils/masks'
import { supabase } from '@/lib/supabase'

export function FormMedico() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const [form, setForm] = useState({ 
        prefixo: 'Dra.', nome: '', email: '', telefone: '', cpf: '',
        crm: '', uf_crm: '', especialidade: '', password: '', confirmPassword: ''
    })
    const [isUfOpen, setIsUfOpen] = useState(false)

    const [availability, setAvailability] = useState<{ [key: string]: 'idle' | 'checking' | 'available' | 'taken' }>({
        email: 'idle',
        cpf: 'idle',
        telefone: 'idle',
        crm: 'idle'
    })

    const checkData = async (field: string, value: string) => {
        const cleanValue = field === 'email' || field === 'crm' ? value : onlyDigits(value)
        
        if (!value || 
           (field === 'cpf' && cleanValue.length < 11) || 
           (field === 'telefone' && cleanValue.length < 10) ||
           (field === 'crm' && value.length < 4)) {
            setAvailability(prev => ({ ...prev, [field]: 'idle' }))
            return
        }

        setAvailability(prev => ({ ...prev, [field]: 'checking' }))
        
        try {
            if (field === 'crm') {
                const { data } = await supabase.from('medicos').select('id').eq('crm', value).maybeSingle()
                setAvailability(prev => ({ ...prev, [field]: data ? 'taken' : 'available' }))
            } else {
                const { data: isAvailable, error } = await supabase.rpc('check_user_data_availability', {
                    field_name: field,
                    field_value: cleanValue
                })
                if (error) throw error
                setAvailability(prev => ({ ...prev, [field]: isAvailable ? 'available' : 'taken' }))
            }
        } catch (err) {
            console.error(`Erro ao validar ${field}:`, err)
            setAvailability(prev => ({ ...prev, [field]: 'idle' }))
        }
    }

    // Debounce effects
    useEffect(() => { const timer = setTimeout(() => checkData('email', form.email), 800); return () => clearTimeout(timer) }, [form.email])
    useEffect(() => { const timer = setTimeout(() => checkData('cpf', form.cpf), 800); return () => clearTimeout(timer) }, [form.cpf])
    useEffect(() => { const timer = setTimeout(() => checkData('telefone', form.telefone), 800); return () => clearTimeout(timer) }, [form.telefone])
    useEffect(() => { const timer = setTimeout(() => checkData('crm', form.crm), 800); return () => clearTimeout(timer) }, [form.crm])

    const passwordRequirements = [
        { label: 'Mínimo 8 caracteres', met: form.password.length >= 8 },
        { label: 'Uma letra maiúscula', met: /[A-Z]/.test(form.password) },
        { label: 'Uma letra minúscula', met: /[a-z]/.test(form.password) },
        { label: 'Um número', met: /[0-9]/.test(form.password) },
        { label: 'Um caractere especial', met: /[^A-Za-z0-9]/.test(form.password) },
    ]

    const isPasswordValid = passwordRequirements.every(r => r.met)

    const canContinue = 
        form.nome.length > 3 &&
        availability.email === 'available' &&
        availability.cpf === 'available' &&
        isValidCPF(form.cpf) &&
        availability.telefone === 'available' &&
        availability.crm === 'available' &&
        form.uf_crm !== '' &&
        isPasswordValid &&
        form.password === form.confirmPassword

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let val = e.target.value
        if (e.target.name === 'cpf') val = maskCPF(val)
        if (e.target.name === 'telefone') val = maskPhone(val)
        setForm({ ...form, [e.target.name]: val })
    }

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting || !canContinue) return
        setIsSubmitting(true)

        try {
            await register({
                ...form,
                tipo: 'medico' as const,
            })
            toast.success('Doutor(a) cadastrado com sucesso!')
            setIsSubmitting(false)
            setTimeout(() => {
                router.push('/medico/dashboard')
            }, 800)
        } catch (err: any) {
            // O erro de UI é tratado pelo useAuth.tsx showDialog
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-3">
                <div className="flex gap-4">
                    <div className="w-[30%] space-y-1.5 relative">
                        <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Prefixo</label>
                        <select name="prefixo" value={form.prefixo} onChange={handleChange} className="w-full bg-slate-100/95 border border-slate-300 rounded-2xl px-4 py-3.5 text-[#1A365D] font-bold outline-none hover:bg-white transition appearance-none cursor-pointer">
                            {['Dr.', 'Dra.', 'Prof.', 'Profa.', 'Psic.', 'Fisiot.', 'Nutri.', 'Enferm.', 'Fono.', 'Odonto.', 'Outro'].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-[65%] -translate-y-1/2 w-4 h-4 text-[#1A365D]/50 pointer-events-none" />
                    </div>
                    <div className="w-[70%] space-y-1.5">
                        <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Nome Completo</label>
                        <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu Nome" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-[55%]">
                        <InputField label="CPF" name="cpf" value={form.cpf} onChange={handleChange} status={availability.cpf} errorMsg={form.cpf && !isValidCPF(form.cpf) ? "Digite um CPF válido" : "CPF já cadastrado"} isInvalid={form.cpf && form.cpf.length === 14 && !isValidCPF(form.cpf)} placeholder="000...-00" maxLength={14} />
                    </div>
                    <div className="w-[45%]">
                        <InputField label="Celular" name="telefone" value={form.telefone} onChange={handleChange} status={availability.telefone} errorMsg="Já em uso" placeholder="(00) 00000" maxLength={15} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-[60%]">
                        <InputField label="CRM" name="crm" value={form.crm} onChange={handleChange} status={availability.crm} errorMsg="Já cadastrado" placeholder="CRM" />
                    </div>
                    <div className="w-[40%] space-y-1.5 relative">
                        <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">UF CRM</label>
                        <button 
                            type="button"
                            onClick={() => setIsUfOpen(!isUfOpen)}
                            className="w-full flex justify-between items-center bg-slate-100/95 border border-slate-300 rounded-2xl px-4 py-3.5 text-[#1A365D] font-bold outline-none hover:bg-white transition"
                        >
                            <span>{form.uf_crm || 'UF'}</span>
                            <ChevronDown className={`w-4 h-4 text-[#1A365D]/50 transition-transform ${isUfOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isUfOpen && (
                                <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-[105%] left-0 w-full max-h-48 overflow-y-auto bg-slate-100/95 backdrop-blur-3xl border border-slate-300 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden hide-scrollbar">
                                    {['SP','RJ','MG','RS','PR','SC','BA','DF','GO','PE','CE'].map(uf => (
                                        <button key={uf} type="button" onClick={() => { setForm({ ...form, uf_crm: uf }); setIsUfOpen(false) }} className={`w-full text-left px-4 py-3 transition-colors border-b last:border-0 border-slate-200 flex items-center justify-between ${form.uf_crm === uf ? 'bg-[#1A365D] text-[#D4AF37] font-black' : 'text-[#1A365D] font-bold hover:bg-[#1A365D] hover:text-[#D4AF37]'}`}>
                                            {uf}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <InputField label="E-mail Profissional" name="email" type="email" value={form.email} onChange={handleChange} status={availability.email} errorMsg="E-mail já está em uso" placeholder="doutor@email.com" />

                <div className="space-y-1.5">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Senha Segura</label>
                    <div className="relative">
                        <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required placeholder="Crie uma senha forte" autoComplete="new-password" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {form.password && !isPasswordValid && (
                        <div className="bg-black/20 rounded-2xl p-3.5 space-y-2 border border-white/5 animate-in fade-in zoom-in-95 duration-200 mt-2">
                            {passwordRequirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {req.met ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 border border-white/10 rounded-full" />}
                                    <span className={`text-[11.5px] font-bold ${req.met ? 'text-emerald-400/80' : 'text-white/30'}`}>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Confirmar Senha</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repita a senha" autoComplete="new-password" className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]'}`} />
                </div>
            </div>

            <button type="submit" disabled={isLoading || isSubmitting || !canContinue} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-[0_8px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-30 disabled:grayscale mt-4 text-[13px] uppercase tracking-wider flex justify-center items-center gap-2 border-0">
                {isLoading || isSubmitting ? 'CADASTRANDO...' : 'BEM-VINDO, DR(A)!'}
                {!isLoading && !isSubmitting && <ChevronRight className="w-4 h-4" />}
            </button>
        </form>
    )
}

function InputField({ label, status, errorMsg, isInvalid, onChange, ...props }: any) {
    const showCheck = status === 'available' && !isInvalid
    const showError = status === 'taken' || (isInvalid && props.value && props.value.length >= (label === 'CPF' ? 14 : 0))

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest">{label}</label>
                {status === 'checking' && <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />}
                {showCheck && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in duration-300" />}
                {showError && <XCircle className="w-3.5 h-3.5 text-red-500 animate-in zoom-in duration-300" />}
            </div>
            <input 
                onChange={onChange}
                {...props}
                className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${showError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
            />
            {showError && (
                <p className="text-red-500 text-xs font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errorMsg}</p>
            )}
        </div>
    )
}
