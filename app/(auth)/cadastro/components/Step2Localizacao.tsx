'use client'

import { useState, useEffect } from 'react'
import { MapPin, Loader2, ArrowLeft, Search } from 'lucide-react'
import { onlyDigits } from '@/lib/utils/masks'

interface Step2Props {
    data: any
    updateData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export function Step2Localizacao({ data, updateData, onNext, onBack }: Step2Props) {
    const [isSearching, setIsSearching] = useState(false)

    const handleCEP = async (cep: string) => {
        const cleanCEP = onlyDigits(cep)
        updateData({ cep: cleanCEP })

        if (cleanCEP.length === 8) {
            setIsSearching(true)
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
                const json = await res.json()
                
                if (!json.erro) {
                    updateData({
                        logradouro: json.logradouro,
                        bairro: json.bairro,
                        cidade: json.localidade,
                        uf: json.uf
                    })
                }
            } catch (err) {
                console.error('Erro ao buscar CEP:', err)
            } finally {
                setIsSearching(false)
            }
        }
    }

    const canContinue = 
        data.cep.length === 8 && 
        data.logradouro && 
        data.numero && 
        data.cidade

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                    <label className="text-white/60 text-[11px] font-black uppercase tracking-widest">CEP</label>
                    {isSearching && <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />}
                </div>
                <div className="relative">
                    <input 
                        value={data.cep}
                        onChange={e => handleCEP(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none focus:border-[#D4AF37] focus:bg-white/10 transition"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <InputField 
                    label="Logradouro" 
                    value={data.logradouro} 
                    readOnly 
                    placeholder="Encontrado pelo CEP"
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Número" 
                        value={data.numero} 
                        onChange={(e: any) => updateData({ numero: e.target.value })} 
                        placeholder="123"
                    />
                    <InputField 
                        label="Complemento" 
                        value={data.complemento} 
                        onChange={(e: any) => updateData({ complemento: e.target.value })} 
                        placeholder="Apto/Bloco"
                    />
                </div>

                <InputField 
                    label="Bairro" 
                    value={data.bairro} 
                    readOnly 
                    placeholder="Bairro"
                />

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <InputField label="Cidade" value={data.cidade} readOnly />
                    </div>
                    <div className="col-span-1">
                        <InputField label="UF" value={data.uf} readOnly />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button 
                    onClick={onBack}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white/60 font-bold text-[13px] uppercase tracking-wider hover:bg-white/5 transition"
                >
                    Voltar
                </button>
                <button 
                    onClick={onNext}
                    disabled={!canContinue}
                    className="flex-[2] bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-30 disabled:grayscale text-[13px] uppercase tracking-wider flex items-center justify-center gap-2"
                >
                    Próximo Passo <MapPin className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function InputField({ label, ...props }: any) {
    return (
        <div className="space-y-1.5 opacity-90">
            <label className="text-white/60 text-[11px] font-black uppercase tracking-widest ml-1">{label}</label>
            <input 
                {...props}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white/90 placeholder:text-white/20 text-sm outline-none transition ${props.readOnly ? 'bg-black/20 cursor-not-allowed border-transparent text-white/40' : 'focus:border-[#D4AF37] focus:bg-white/10'}`}
            />
        </div>
    )
}
