'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Plus, Trash2, Building2, Save, Search, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { BottomNavMedico } from '@/components/BottomNavMedico'

interface LocalAtendimento {
    id: string
    nome: string
    tipo: 'consultorio' | 'clinica' | 'hospital' | 'telemedicina'
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    isLoadingCep?: boolean
}

export default function LocaisAtendimentoPage() {
    const router = useRouter()
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
    const TIPO_ESTABELECIMENTO = [
        { value: 'consultorio', label: 'Consultório' },
        { value: 'clinica', label: 'Clínica' },
        { value: 'hospital', label: 'Hospital' },
        { value: 'telemedicina', label: 'Telemedicina' },
    ]
    const [locais, setLocais] = useState<LocalAtendimento[]>([
        { 
            id: '1', 
            nome: 'Clínica Central', 
            tipo: 'clinica', 
            cep: '01310-100',
            logradouro: 'Av. Paulista',
            numero: '1000',
            complemento: 'Cj 52',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            uf: 'SP'
        }
    ])

    const addLocal = () => {
        setLocais(prev => [{
            id: Date.now().toString(),
            nome: '',
            tipo: 'consultorio',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            isLoadingCep: false
        }, ...prev])
    }

    const removeLocal = (id: string) => {
        setLocais(prev => prev.filter(l => l.id !== id))
    }

    const updateLocal = (id: string, updates: Partial<LocalAtendimento>) => {
        setLocais(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    }

    const handleCepSearch = async (id: string, cep: string) => {
        const cleanCep = cep.replace(/\D/g, '')
        updateLocal(id, { cep }) // Update UI quickly
        
        if (cleanCep.length === 8) {
            updateLocal(id, { isLoadingCep: true })
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
                const data = await res.json()
                if (data.erro) {
                    toast.error('CEP não encontrado')
                } else {
                    updateLocal(id, {
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        uf: data.uf,
                    })
                    toast.success('Endereço autocompletado!')
                }
            } catch (err) {
                toast.error('Erro ao buscar CEP')
            } finally {
                updateLocal(id, { isLoadingCep: false })
            }
        }
    }

    const handleSave = () => {
        if (locais.some(l => !l.nome || !l.logradouro || !l.numero)) {
            return toast.error('Preencha o nome, logradouro e número de todos os locais ativos.')
        }
        toast.success('Locais atualizados com sucesso!')
        setTimeout(() => router.back(), 1000)
    }

    return (
        <div className="min-h-screen bg-[#1A365D] pb-32 font-sans relative overflow-x-hidden selection:bg-[#D4AF37]/30">
            {/* Background Animations: Fog */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white rounded-full blur-[140px]" />
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] -right-32 w-[500px] h-[500px] bg-white rounded-full blur-[140px]" />
            </div>

            {/* Header Profiling & Location Core */}
            <header className="px-5 pt-8 pb-8 relative z-40 bg-white/5 backdrop-blur-3xl rounded-b-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-b border-white/10 sticky top-0 z-40">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/20 transition active:scale-90">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button onClick={handleSave} className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-wider shadow-[0_8px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all hover:opacity-90 border border-white/30">
                        <Save className="w-4 h-4" /> Salvar
                    </button>
                </div>
                <h1 className="font-black text-2xl flex items-center gap-2 tracking-tight relative z-10 text-white">
                    <MapPin className="w-7 h-7 text-[#D4AF37]" />
                    Locais de Atendimento
                </h1>
                <p className="text-white/70 font-medium text-[13px] mt-1.5 relative z-10 max-w-[280px]">
                    Cadastre com precisão para guiar seus pacientes na cidade e na farmácia mais próxima.
                </p>
            </header>

            <main className="px-5 mt-6 space-y-6 relative z-10">
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="font-black text-[16px] px-2 tracking-tight drop-shadow-sm text-white">Meus Locais Ativos</h2>
                        <button onClick={addLocal} className="w-10 h-10 bg-[#D4AF37] text-[#1A365D] rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(212,175,55,0.4)] active:scale-90 transition-all hover:opacity-90 font-black border border-white/40">
                            <Plus className="w-5 h-5 stroke-[3px]" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {locais.length === 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50 text-[13px] font-medium text-center py-6 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 border-dashed">Nenhum local cadastrado.</motion.p>
                        )}
                        {locais.map((local, idx) => (
                            <motion.div 
                                key={local.id} 
                                initial={{ opacity: 0, y: 15 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-3xl p-5 sm:p-6 rounded-[28px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-visible"
                            >
                                {/* Decorator Stripe */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />

                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <input 
                                            placeholder="Ex: Consultório Particular" 
                                            value={local.nome} 
                                            onChange={e => updateLocal(local.id, { nome: e.target.value })}
                                            className="bg-transparent text-white font-black text-[20px] placeholder:text-white/30 outline-none w-full tracking-tight"
                                        />
                                    </div>
                                    <button onClick={() => removeLocal(local.id)} className="text-red-400 hover:text-red-300 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors shadow-sm ml-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <div className="space-y-1.5 col-span-2 sm:col-span-1 relative">
                                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest pl-1">Tipo de Estabelecimento</span>
                                        <button type="button" onClick={() => setOpenDropdownId(openDropdownId === local.id ? null : local.id)} className="w-full flex justify-between items-center bg-slate-100/95 backdrop-blur-md border border-slate-300 shadow-sm text-[#1A365D] text-[13px] font-bold rounded-xl pl-4 pr-3 py-3.5 outline-none hover:bg-white transition-all text-left">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                                                <span className="capitalize">{local.tipo}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[#1A365D]/50 transition-transform ${openDropdownId === local.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openDropdownId === local.id && (
                                                <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-[105%] left-0 w-full bg-slate-100/95 backdrop-blur-3xl border border-slate-300 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50">
                                                    {TIPO_ESTABELECIMENTO.map(t => (
                                                        <button key={t.value} type="button" onClick={() => { updateLocal(local.id, { tipo: t.value as any }); setOpenDropdownId(null) }} className={`w-full text-left px-4 py-3 transition-colors border-b last:border-0 border-slate-200 flex items-center justify-between ${local.tipo === t.value ? 'bg-[#1A365D] text-[#D4AF37] font-black' : 'text-[#1A365D] font-bold hover:bg-[#1A365D] hover:text-[#D4AF37]'}`}>
                                                            {t.label}
                                                            {local.tipo === t.value && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                        <div className="flex justify-between items-end pl-1 pr-1">
                                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">CEP</span>
                                            {local.isLoadingCep && <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />}
                                        </div>
                                        <div className="relative flex items-center">
                                            <input 
                                                placeholder="00000-000" 
                                                value={local.cep} 
                                                onChange={e => handleCepSearch(local.id, e.target.value)}
                                                maxLength={9}
                                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[14px] font-black rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/30 tracking-widest" 
                                            />
                                            <Search className="w-4 h-4 text-white/40 absolute right-3 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 col-span-2">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest pl-1">Endereço (Rua/Av)</span>
                                            <input value={local.logradouro} readOnly className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/90 outline-none opacity-60 cursor-not-allowed" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest pl-1">Número</span>
                                            <input value={local.numero} onChange={e => updateLocal(local.id, { numero: e.target.value })} placeholder="Ex: 123" className="w-full bg-white/10 border border-white/20 shadow-sm rounded-xl px-4 py-3.5 text-white/90 placeholder:text-white/20 outline-none focus:border-[#D4AF37]" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 col-span-2">
                                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest pl-1">Nome de Exibição</span>
                                        <input 
                                            placeholder="Ex: Consultório Particular" 
                                            value={local.nome} 
                                            onChange={e => updateLocal(local.id, { nome: e.target.value })}
                                            className="w-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 shadow-sm text-white text-[14px] font-black rounded-xl px-4 py-3.5 outline-none focus:border-[#D4AF37] placeholder:text-white/30" 
                                        />
                                    </div>

                                    <div className="space-y-1.5 col-span-2">
                                        <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest pl-1">Compl.</span>
                                        <input 
                                            placeholder="Sala 10" 
                                            value={local.complemento} 
                                            onChange={e => updateLocal(local.id, { complemento: e.target.value })}
                                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[13px] font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/30" 
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest pl-1">Bairro</span>
                                        <input 
                                            placeholder="Bairro" 
                                            value={local.bairro} 
                                            onChange={e => updateLocal(local.id, { bairro: e.target.value })}
                                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[13px] font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/30 opacity-70" 
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 flex gap-2">
                                        <div className="flex-1 space-y-1.5">
                                            <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest pl-1">Cidade</span>
                                            <input 
                                                placeholder="Cidade" 
                                                value={local.cidade} 
                                                onChange={e => updateLocal(local.id, { cidade: e.target.value })}
                                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[13px] font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/30 opacity-70" 
                                            />
                                        </div>
                                        <div className="w-[70px] space-y-1.5">
                                            <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest pl-1">UF</span>
                                            <input 
                                                placeholder="XX" 
                                                value={local.uf} 
                                                maxLength={2}
                                                onChange={e => updateLocal(local.id, { uf: e.target.value.toUpperCase() })}
                                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[13px] font-black rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/30 text-center opacity-70" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.section>
            </main>

            <BottomNavMedico />
        </div>
    )
}
