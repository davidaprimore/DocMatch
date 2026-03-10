'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Search, Plus, Filter, Download, ExternalLink } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const mockReceitasEmitidas = [
    { id: 'REC-001', paciente: 'João Silva', data: '2025-03-10', tipo: 'branca', meds: ['Amoxicilina 500mg', 'Paracetamol 750mg'] },
    { id: 'REC-002', paciente: 'Maria Souza', data: '2025-03-09', tipo: 'azul', meds: ['Clonazepam 2mg'] },
    { id: 'REC-003', paciente: 'Pedro Santos', data: '2025-03-05', tipo: 'especial', meds: ['Azitromicina 500mg'] },
]

export default function ReceitasMedicoPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0F2240] pb-20">
            <header className="px-5 pt-10 pb-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                        <h1 className="text-white font-bold text-[18px]">Histórico de Receitas</h1>
                    </div>
                    <button onClick={() => router.push('/medico/receitas/nova')} className="bg-[#D4AF37] text-[#1A365D] p-2 rounded-xl transition-active active:scale-90">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                        placeholder="Buscar por paciente ou med..."
                        className="w-full bg-white/10 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-[13px] placeholder:text-white/30 outline-none focus:border-[#D4AF37]/50 transition-all shadow-lg"
                    />
                </div>
            </header>

            <div className="px-5 space-y-3">
                {mockReceitasEmitidas.map(r => (
                    <div key={r.id} className="bg-white/10 rounded-[20px] p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase mb-1 inline-block ${r.tipo === 'branca' ? 'bg-white/10 text-white border-white/20' : r.tipo === 'azul' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                    RECEITA {r.tipo.toUpperCase()}
                                </span>
                                <p className="text-white font-bold text-[14px]">{r.paciente}</p>
                                <p className="text-white/40 text-[10px]">Emitida em {r.data.split('-').reverse().join('/')}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><Download className="w-4 h-4" /></button>
                                <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><ExternalLink className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 mt-2">
                            <p className="text-white/30 text-[9px] uppercase font-black mb-1.5 tracking-wider">Medicamentos</p>
                            <div className="flex flex-wrap gap-1.5">
                                {r.meds.map(m => (
                                    <span key={m} className="bg-white/5 border border-white/10 text-white/60 text-[10px] px-2 py-1 rounded-lg">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
