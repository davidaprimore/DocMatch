'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, ChevronRight, Download, Share2, Clock, ShieldCheck, Pill } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateRelative } from '@/lib/utils/masks'

const mockReceitas = [
    { ...receitaMock, id: 'rec_001', status: 'ativa' as const },
    { ...receitaMock, id: 'rec_002', status: 'utilizada' as const, data_emissao: '2025-01-15T10:00:00Z' },
    { ...receitaMock, id: 'rec_003', status: 'vencida' as const, data_emissao: '2024-11-01T10:00:00Z' },
]

const statusConfig = {
    ativa: { label: 'Ativa', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    utilizada: { label: 'Dispensada', bg: 'bg-blue-50', text: 'text-[#2D5284]', dot: 'bg-[#2D5284]' },
    vencida: { label: 'Vencida', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
    cancelada: { label: 'Cancelada', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-300' },
}

const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`

export default function ReceitasPage() {
    const router = useRouter()
    const medicoMap = Object.fromEntries(medicosMock.map(m => [m.id, m]))

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-24 font-sans">
            {/* HEADER — padrão pt-4 pb-12 */}
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-[0_8px_24px_rgba(45,82,132,0.35)] relative z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95" aria-label="Voltar">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Minhas Receitas</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')} aria-label="Notificações">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px]">Match</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subtítulo flutuante */}
            <div className="px-5 -mt-5 mb-5">
                <div className={`${glassCard} rounded-2xl px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <p className="text-[13px] font-semibold text-[#1A365D]">{mockReceitas.length} receitas no histórico</p>
                    </div>
                    <p className="text-[11px] text-slate-400">Assinadas digitalmente</p>
                </div>
            </div>

            <main className="px-5 space-y-4">
                {mockReceitas.map(receita => {
                    const medico = medicoMap[receita.medico_id]
                    const st = statusConfig[receita.status]
                    return (
                        <button
                            key={receita.id}
                            onClick={() => router.push(`/receitas/${receita.id}`)}
                            className={`${glassCard} rounded-[24px] w-full text-left overflow-hidden active:scale-[0.99] transition-transform`}
                        >
                            {/* Cabeçalho do card */}
                            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#2D5284]/15 to-[#1A365D]/10 flex items-center justify-center border border-[#2D5284]/10">
                                        <FileText className="w-5 h-5 text-[#2D5284]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13px] text-[#1A365D] leading-tight">{medico?.nome ?? 'Médico'}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">{medico?.especialidade}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 ${st.bg} px-3 py-1.5 rounded-full`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    <span className={`${st.text} text-[11px] font-bold`}>{st.label}</span>
                                </div>
                            </div>

                            {/* Divisor elegante dourado */}
                            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

                            {/* Medicamentos */}
                            <div className="px-4 py-3 space-y-1">
                                {receita.medicamentos.slice(0, 2).map((med, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Pill className="w-3 h-3 text-[#D4AF37] shrink-0" />
                                        <p className="text-[12px] text-slate-600 truncate font-medium">{med.nome} <span className="text-slate-400 font-normal">— {med.concentracao}</span></p>
                                    </div>
                                ))}
                                {receita.medicamentos.length > 2 && (
                                    <p className="text-[11px] text-slate-400 pl-5">+{receita.medicamentos.length - 2} medicamentos</p>
                                )}
                            </div>

                            {/* Rodapé do card */}
                            <div className="flex justify-between items-center px-4 pb-4 pt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{dateRelative(receita.data_emissao)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {receita.status === 'ativa' && (
                                        <>
                                            <button className="text-[#2D5284] p-1.5 rounded-lg hover:bg-blue-50 transition-colors" onClick={e => e.stopPropagation()} aria-label="Compartilhar">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-[#2D5284] p-1.5 rounded-lg hover:bg-blue-50 transition-colors" onClick={e => e.stopPropagation()} aria-label="Baixar">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </main>
            <BottomNav />
        </div>
    )
}
