'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, ChevronRight, Download, Share2, Clock } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateToDisplay, dateRelative } from '@/lib/utils/masks'

const mockReceitas = [
    { ...receitaMock, id: 'rec_001', status: 'ativa' as const },
    { ...receitaMock, id: 'rec_002', status: 'utilizada' as const, data_emissao: '2025-01-15T10:00:00Z' },
    { ...receitaMock, id: 'rec_003', status: 'vencida' as const, data_emissao: '2024-11-01T10:00:00Z' },
]

const statusConfig = {
    ativa: { label: 'Ativa', bg: 'bg-green-50', text: 'text-green-700' },
    utilizada: { label: 'Dispensada', bg: 'bg-blue-50', text: 'text-[#2D5284]' },
    vencida: { label: 'Vencida', bg: 'bg-red-50', text: 'text-red-600' },
    cancelada: { label: 'Cancelada', bg: 'bg-slate-50', text: 'text-slate-500' },
}

export default function ReceitasPage() {
    const router = useRouter()
    const medicoMap = Object.fromEntries(medicosMock.map(m => [m.id, m]))

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-5 pb-10 rounded-b-3xl shadow-md relative z-20 mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Minhas Receitas</h1>
                </div>
                <p className="text-white/60 text-[12px]">{mockReceitas.length} receitas no seu histórico</p>
            </header>

            <main className="px-4 space-y-3">
                {mockReceitas.map(receita => {
                    const medico = medicoMap[receita.medico_id]
                    const st = statusConfig[receita.status]
                    return (
                        <div key={receita.id} className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100"
                            onClick={() => router.push(`/receitas/${receita.id}`)}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[12px] bg-[#2D5284]/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-[#2D5284]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13px] text-slate-800">{medico?.nome ?? 'Médico'}</p>
                                        <p className="text-[11px] text-slate-500">{medico?.especialidade}</p>
                                    </div>
                                </div>
                                <span className={`${st.bg} ${st.text} text-[10px] font-bold px-2.5 py-1 rounded-full`}>{st.label}</span>
                            </div>

                            <div className="border-t border-slate-100 pt-3">
                                {receita.medicamentos.slice(0, 2).map((med, i) => (
                                    <p key={i} className="text-[12px] text-slate-600 truncate">• {med.nome} — {med.concentracao}</p>
                                ))}
                                {receita.medicamentos.length > 2 && (
                                    <p className="text-[11px] text-slate-400 mt-1">+{receita.medicamentos.length - 2} medicamentos</p>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    {dateRelative(receita.data_emissao)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {receita.status === 'ativa' && (
                                        <>
                                            <button className="text-[#2D5284]" onClick={e => e.stopPropagation()}>
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-[#2D5284]" onClick={e => e.stopPropagation()}>
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
            <BottomNav />
        </div>
    )
}
