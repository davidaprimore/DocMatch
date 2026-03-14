'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { maskCPF, maskPhone, isValidCPF, onlyDigits } from '@/lib/utils/masks'
import { supabase } from '@/lib/supabase'

interface Step1Props {
    data: any
    updateData: (data: any) => void
    onNext: () => void
}

export function Step1Identidade({ data, updateData, onNext }: Step1Props) {
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

    const canContinue = 
        data.nome.length > 3 &&
        availability.email === 'available' &&
        availability.cpf === 'available' &&
        isValidCPF(data.cpf) &&
        availability.telefone === 'available' &&
        data.data_nascimento &&
        data.genero &&
        data.password.length >= 8 &&
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
                <div className="space-y-1.5">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Gênero</label>
                    <select 
                        value={data.genero}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData({ genero: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition appearance-none"
                    >
                        <option value="" className="bg-[#1A365D]">Selecionar</option>
                        <option value="Feminino" className="bg-[#1A365D]">Feminino</option>
                        <option value="Masculino" className="bg-[#1A365D]">Masculino</option>
                        <option value="Mulher Trans" className="bg-[#1A365D]">Mulher Trans</option>
                        <option value="Homem Trans" className="bg-[#1A365D]">Homem Trans</option>
                        <option value="Não-binário" className="bg-[#1A365D]">Não-binário</option>
                        <option value="Prefiro não informar" className="bg-[#1A365D]">Outros / Prefiro não informar</option>
                    </select>
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
                isInvalid={data.cpf && !isValidCPF(data.cpf)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ cpf: maskCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
            />

            <InputField 
                label="Telefone Celular"
                value={data.telefone}
                status={availability.telefone}
                errorMsg="Telefone já cadastrado"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ telefone: maskPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
            />

            <div className="space-y-1.5">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={data.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ password: e.target.value })}
                        placeholder="Crie uma senha forte"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">Confirmar Senha</label>
                <input 
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData({ confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
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

function InputField({ label, status, errorMsg, ...props }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
                <label className="text-white/60 text-[11px] font-black uppercase tracking-widest uppercase">{label}</label>
                {status === 'checking' && <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />}
                {status === 'available' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {status === 'taken' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
            </div>
            <input 
                {...props}
                className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${status === 'taken' ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
            />
            {status === 'taken' && (
                <p className="text-red-400 text-[10px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errorMsg}</p>
            )}
        </div>
    )
}
