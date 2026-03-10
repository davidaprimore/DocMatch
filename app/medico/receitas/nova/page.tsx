'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Plus, Trash2, FileText, User } from 'lucide-react'
import { toast } from 'sonner'

const tiposReceita = [
    { id: 'branca', label: 'Branca', desc: 'Medicamentos genéricos, OTC', cor: 'bg-white border-slate-300 text-slate-700' },
    { id: 'azul', label: 'Azul (B)', desc: 'Psicotrópicos Notificação B', cor: 'bg-blue-50 border-blue-400 text-blue-700' },
    { id: 'amarela', label: 'Amarela (A)', desc: 'Entorpecentes / Psicotrópicos A', cor: 'bg-yellow-50 border-yellow-400 text-yellow-700' },
    { id: 'especial', label: 'Especial 2 vias', desc: 'Antimicrobianos RENAME', cor: 'bg-red-50 border-red-400 text-red-700' },
]

export default function EmitirReceitaMedicoPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [tipoReceita, setTipoReceita] = useState('branca')
    const [meds, setMeds] = useState([{ nome: '', conc: '', posol: '', qtd: 1 }])

    const addMed = () => setMeds(p => [...p, { nome: '', conc: '', posol: '', qtd: 1 }])
    const rmMed = (i: number) => setMeds(p => p.filter((_, idx) => idx !== i))
    const upMed = (i: number, f: string, v: string | number) =>
        setMeds(p => p.map((m, idx) => idx === i ? { ...m, [f]: v } : m))

    const handleEmitir = () => {
        toast.success('Receita emitida! QR Code gerado.')
        router.push('/medico/dashboard')
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-20 font-sans">
            <header className="px-5 pt-10 pb-5">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Emitir Receita Digital</h1>
                </div>
                <div className="flex gap-2">
                    {['Paciente', 'Tipo', 'Medicamentos', 'Revisão'].map((s, i) => (
                        <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${i + 1 <= step ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                    ))}
                </div>
            </header>

            <div className="px-5 space-y-4">
                {step === 1 && (
                    <>
                        <h2 className="text-white font-bold text-[15px] flex items-center gap-2"><User className="w-4 h-4 text-[#D4AF37]" /> Selecionar Paciente</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                            <input placeholder="Nome, CPF ou e-mail..." className="w-full bg-white/10 border border-white/10 rounded-xl pl-11 py-3 text-white text-[13px] placeholder:text-white/30 outline-none" />
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-[#D4AF37]/30">
                            <p className="text-white font-bold">João Silva · pac_001</p>
                            <p className="text-white/50 text-[12px]">CPF: 123.456.789-00 · Unimed Nacional</p>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3.5">Continuar →</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-white font-bold text-[15px]">Tipo de Receita</h2>
                        {tiposReceita.map(t => (
                            <button key={t.id} onClick={() => setTipoReceita(t.id)} className={`w-full border rounded-xl p-4 text-left transition-all ${tipoReceita === t.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-white/5'}`}>
                                <span className={`inline-block border text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${t.cor}`}>{t.label}</span>
                                <p className="text-white/50 text-[12px]">{t.desc}</p>
                            </button>
                        ))}
                        <div className="flex gap-3"><button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white font-bold rounded-xl py-3">← Voltar</button><button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3">Continuar →</button></div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h2 className="text-white font-bold text-[15px]">Medicamentos</h2>
                        {meds.map((m, i) => (
                            <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2">
                                <div className="flex justify-between"><span className="text-[#D4AF37] text-[11px] font-bold">Medicamento {i + 1}</span>{i > 0 && <button onClick={() => rmMed(i)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>}</div>
                                {[{ f: 'nome', p: 'Nome' }, { f: 'conc', p: 'Concentração' }, { f: 'posol', p: 'Posologia' }].map(({ f, p }) => (
                                    <input key={f} value={m[f as keyof typeof m] as string} onChange={e => upMed(i, f, e.target.value)} placeholder={p} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[12px] placeholder:text-white/30 outline-none" />
                                ))}
                            </div>
                        ))}
                        <button onClick={addMed} className="w-full border border-dashed border-white/20 text-white/50 rounded-xl py-3 flex items-center justify-center gap-2 text-[12px]"><Plus className="w-4 h-4" /> Adicionar</button>
                        <div className="flex gap-3"><button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white font-bold rounded-xl py-3">← Voltar</button><button onClick={() => setStep(4)} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3">Revisar →</button></div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <h2 className="text-white font-bold text-[15px]">Revisão Final</h2>
                        <div className="bg-white/10 rounded-xl p-4 border border-[#D4AF37]/20 space-y-2 text-[13px]">
                            <div className="flex justify-between"><span className="text-white/50">Paciente:</span><span className="text-white font-semibold">João Silva</span></div>
                            <div className="flex justify-between"><span className="text-white/50">Tipo:</span><span className="text-white font-semibold capitalize">{tipoReceita}</span></div>
                            <div className="flex justify-between"><span className="text-white/50">Medicamentos:</span><span className="text-white font-semibold">{meds.length}</span></div>
                        </div>
                        <div className="flex gap-3"><button onClick={() => setStep(3)} className="flex-1 border border-white/20 text-white font-bold rounded-xl py-3">← Voltar</button><button onClick={handleEmitir} className="flex-1 bg-green-600 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> Emitir</button></div>
                    </>
                )}
            </div>
        </div>
    )
}
