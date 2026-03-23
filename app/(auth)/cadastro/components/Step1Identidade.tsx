'use client'

import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, ChevronDown } from 'lucide-react'
import { maskCPF, maskPhone, isValidCPF, onlyDigits } from '@/lib/utils/masks'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

interface Step1Props {
    data: any
    updateData: (data: any) => void
    onNext: () => void
}

export function Step1Identidade({ data, updateData, onNext }: Step1Props) {
    const [isGeneroOpen, setIsGeneroOpen] = useState(false)
    const GENEROS = ['Feminino', 'Masculino', 'Mulher Trans', 'Homem Trans', 'Não-binário', 'Outros / Prefiro não informar']
    const [showPassword, setShowPassword] = useState(false)
    const [availability, setAvailability] = useState<{ [key: string]: 'idle' | 'checking' | 'available' | 'taken' }>({
        email: 'idle',
        cpf: 'idle',
        telefone: 'idle'
    })

    const checkData = async (field: string, value: string) => {
        const cleanValue = onlyDigits(value)
        if (!value || (field === 'cpf' && cleanValue.length < 11) || (field === 'telefone' && cleanValue.length < 10)) {
            setAvailability(prev => ({ ...prev, [field]: 'idle' }))
            return
        }

        setAvailability(prev => ({ ...prev, [field]: 'checking' }))
        
        try {
            const { data: isAvailable, error } = await supabase.rpc('check_user_data_availability', {
                field_name: field,
                field_value: field === 'email' ? value : cleanValue
            })

            if (error) throw error
            setAvailability(prev => ({ ...prev, [field]: isAvailable ? 'available' : 'taken' }))
        } catch (err) {
            console.error(`Erro ao validar ${field}:`, err)
            setAvailability(prev => ({ ...prev, [field]: 'idle' }))
        }
    }

    // Debounce manual para validações
    useEffect(() => {
        const timer = setTimeout(() => checkData('email', data.email), 800)
        return () => clearTimeout(timer)
    }, [data.email])

    useEffect(() => {
        const timer = setTimeout(() => checkData('cpf', data.cpf), 800)
        return () => clearTimeout(timer)
    }, [data.cpf])

    useEffect(() => {
        const timer = setTimeout(() => checkData('telefone', data.telefone), 800)
        return () => clearTimeout(timer)
    }, [data.telefone])

    const passwordRequirements = [
        { label: 'Mínimo 8 caracteres', met: data.password.length >= 8 },
        { label: 'Uma letra maiúscula', met: /[A-Z]/.test(data.password) },
        { label: 'Uma letra minúscula', met: /[a-z]/.test(data.password) },
        { label: 'Um número', met: /[0-9]/.test(data.password) },
        { label: 'Um caractere especial', met: /[^A-Za-z0-9]/.test(data.password) },
    ]

    const isPasswordValid = passwordRequirements.every(r => r.met)

    const canContinue = 
        data.nome.length > 3 &&
        availability.email === 'available' &&
        availability.cpf === 'available' &&
        isValidCPF(data.cpf) &&
        availability.telefone === 'available' &&
        data.data_nascimento &&
        data.genero &&
        isPasswordValid &&
        data.password === data.confirmPassword

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
               <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Nome completo</label>
               <input 
                    value={data.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ nome: e.target.value })}
                    placeholder="Como deseja ser chamado"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Nascimento</label>
                    <input 
                        type="date"
                        value={data.data_nascimento}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ data_nascimento: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition [color-scheme:dark]"
                    />
                </div>
                <div className="space-y-1.5 relative">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Gênero</label>
                    <button type="button" onClick={() => setIsGeneroOpen(!isGeneroOpen)} className="w-full flex justify-between items-center bg-slate-100/95 border border-slate-300 rounded-2xl px-4 py-3.5 text-[#1A365D] font-bold outline-none hover:bg-white transition">
                        <span className="truncate">{data.genero || 'Selecionar'}</span>
                        <ChevronDown className={`w-4 h-4 text-[#1A365D]/50 shrink-0 transition-transform ${isGeneroOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isGeneroOpen && (
                            <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-[105%] left-0 w-[120%] bg-slate-100/95 backdrop-blur-3xl border border-slate-300 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
                                {GENEROS.map(g => (
                                    <button key={g} type="button" onClick={() => { updateData({ genero: g }); setIsGeneroOpen(false) }} className={`w-full text-left px-4 py-3 text-[13px] transition-colors border-b last:border-0 border-slate-200 ${data.genero === g ? 'bg-[#1A365D] text-[#D4AF37] font-black' : 'text-[#1A365D] font-bold hover:bg-[#1A365D] hover:text-[#D4AF37]'}`}>
                                        {g}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <InputField 
                label="E-mail"
                type="email"
                value={data.email}
                status={availability.email}
                errorMsg="E-mail já cadastrado"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ email: e.target.value })}
                placeholder="seu@email.com"
            />

            <InputField 
                label="CPF"
                value={data.cpf}
                status={availability.cpf}
                errorMsg={data.cpf && !isValidCPF(data.cpf) ? "Digite um CPF válido" : "CPF já cadastrado"}
                isInvalid={data.cpf && data.cpf.length === 14 && !isValidCPF(data.cpf)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ cpf: maskCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                inputMode="numeric"
                pattern="[0-9]*"
            />

            <InputField 
                label="Telefone Celular"
                value={data.telefone}
                status={availability.telefone}
                errorMsg="Telefone já cadastrado"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ telefone: maskPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
                inputMode="numeric"
                pattern="[0-9]*"
            />

            <div className="space-y-1.5">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={data.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ password: e.target.value })}
                        placeholder="Crie uma senha forte"
                        autoComplete="new-password"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                {/* Password Checklist */}
                {data.password && !isPasswordValid && (
                    <div className="bg-black/20 rounded-2xl p-3.5 space-y-2 border border-white/5 animate-in fade-in zoom-in-95 duration-200 mt-2">
                        {passwordRequirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {req.met ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                    <div className="w-3.5 h-3.5 border border-white/10 rounded-full" />
                                )}
                                <span className={`text-[11.5px] font-bold ${req.met ? 'text-emerald-400/80' : 'text-white/30'}`}>
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Confirmar Senha</label>
                <input 
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${data.confirmPassword && data.password !== data.confirmPassword ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]'}`}
                />
            </div>

            <button 
                onClick={onNext}
                disabled={!canContinue}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-30 disabled:grayscale mt-4 text-[13px] uppercase tracking-wider"
            >
                Próximo Passo: Localização →
            </button>
        </div>
    )
}

function InputField({ label, status, errorMsg, isInvalid, ...props }: any) {
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
                {...props}
                className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${showError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
            />
            {showError && (
                <p className="text-red-500 text-xs font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errorMsg}</p>
            )}
        </div>
    )
}
