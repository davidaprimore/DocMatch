'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Pill, ShoppingCart, ChevronRight } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'

export default function ReceitaDetalhePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const medico = medicosMock.find(m => m.id === receitaMock.medico_id) ?? medicosMock[0]

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-5 pb-8 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Receita Digital</h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-400/20 text-green-300 text-[11px] font-bold px-2.5 py-1 rounded-full">✓ Ativa</span>
                    <span className="text-white/50 text-[11px]">Válida até {dateToDisplay(receitaMock.validade)}</span>
                </div>
            </header>

            <div className="px-4 space-y-4">
                {/* Médico */}
                <div className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100 flex items-center gap-4">
                    <img src={medico.foto_url} className="w-14 h-14 rounded-[14px] object-cover" alt={medico.nome} />
                    <div>
                        <p className="font-bold text-[15px] text-[#1A365D]">{medico.nome}</p>
                        <p className="text-[12px] text-[#2D5284]">{medico.especialidade}</p>
                        <p className="text-[11px] text-slate-400">{medico.crm}</p>
                    </div>
                </div>

                {/* Código de Validação */}
                <div className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] rounded-[20px] p-4 text-center">
                    <p className="text-white/60 text-[11px] uppercase tracking-widest mb-1">Código de Validação (Farmácia)</p>
                    <p className="text-white text-[28px] font-black tracking-[0.15em]">DMX7K2P9</p>
                    <p className="text-white/40 text-[10px] mt-1">Apresente este código na farmácia</p>
                </div>

                {/* Medicamentos */}
                <div className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100">
                    <h3 className="font-bold text-[#1A365D] text-[13px] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-[#D4AF37]" /> Medicamentos
                    </h3>
                    <div className="space-y-4">
                        {receitaMock.medicamentos.map((med, i) => (
                            <div key={i} className={`${i > 0 ? 'border-t border-slate-100 pt-4' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-[14px] text-slate-800">{med.nome}</p>
                                        <p className="text-[11px] text-slate-400">{med.principio_ativo} • {med.concentracao} • {med.forma_farmaceutica}</p>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{med.quantidade} un.</span>
                                </div>
                                <div className="mt-2 bg-blue-50 rounded-xl px-3 py-2">
                                    <p className="text-[12px] text-[#2D5284] font-medium">{med.posologia}</p>
                                    {med.uso_continuo && <p className="text-[10px] text-[#D4AF37] font-bold mt-0.5">⚠️ Uso contínuo</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {receitaMock.observacoes && (
                    <div className="bg-amber-50 rounded-[20px] p-4 border border-amber-200">
                        <p className="font-bold text-amber-800 text-[12px] uppercase tracking-widest mb-1">Observações do Médico</p>
                        <p className="text-[13px] text-amber-700 leading-relaxed">{receitaMock.observacoes}</p>
                    </div>
                )}

                <button onClick={() => router.push('/comparar-precos')}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
                    <ShoppingCart className="w-5 h-5" /> Comparar Preços nas Farmácias
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
