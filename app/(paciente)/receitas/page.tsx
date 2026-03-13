'use client'
 
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft, FileText, ChevronRight, Download, Share2,
    Clock, ShieldCheck, Stethoscope, Menu as MenuIcon
} from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useReceitas } from '@/hooks/useReceitas'
import { dateRelative, dateToDisplay } from '@/lib/utils/masks'
 
const statusConfig = {
    ativa: { label: 'Ativa', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    utilizada: { label: 'Dispensada', bg: 'bg-blue-50', text: 'text-[#2D5284]', dot: 'bg-[#2D5284]' },
    vencida: { label: 'Vencida', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
    cancelada: { label: 'Cancelada', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-300' },
}
 
const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`
 
export default function ReceitasPage() {
    const router = useRouter()
    const { receitas, isLoading } = useReceitas()
 
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] font-sans">
 
            <Header title="Minhas Receitas" showBackButton showNotifications />
 
            {/* Card overlapping */}
            <div className="px-5 -mt-10 relative z-[60] mb-8">
                <div className={`${glassCard} rounded-2xl px-4 py-4 flex items-center justify-between shadow-card`}>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <p className="text-[14px] font-bold text-[#1A365D]">
                            {isLoading ? 'Carregando...' : `${receitas.length} receitas no histórico`}
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Assinadas digitalmente</p>
                </div>
            </div>
 
            <main className="px-5 pt-10 pb-24 space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-white/40 animate-pulse rounded-[22px]" />
                    ))
                ) : receitas.length > 0 ? (
                    receitas.map(receita => {
                        const medico = receita.medicos
                        const st = statusConfig[receita.status as keyof typeof statusConfig] || statusConfig.ativa
 
                        return (
                            <div
                                key={receita.id}
                                onClick={() => router.push(`/receitas/${receita.id}`)}
                                className={`${glassCard} rounded-[22px] w-full text-left overflow-hidden active:scale-[0.99] transition-transform cursor-pointer`}
                            >
                                <div className="flex items-center justify-between px-4 pt-4 pb-3 gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {medico?.foto ? (
                                            <img
                                                src={medico.foto}
                                                alt={medico.nome}
                                                className="w-11 h-11 rounded-[14px] object-cover border-2 border-white shadow-sm shrink-0"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#2D5284]/15 to-[#1A365D]/10 flex items-center justify-center border border-[#2D5284]/10 shrink-0">
                                                <Stethoscope className="w-5 h-5 text-[#2D5284]" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-bold text-[13px] text-[#1A365D] leading-tight truncate">{medico?.nome ?? 'Médico'}</p>
                                            <p className="text-[11px] text-slate-400 font-medium truncate">{medico?.especialidades?.nome}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${st.bg} px-3 py-1.5 rounded-full shrink-0`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                        <span className={`${st.text} text-[11px] font-bold`}>{st.label}</span>
                                    </div>
                                </div>
 
                                <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mb-2.5" />
 
                                <div className="px-4 pb-3 space-y-1.5">
                                    {receita.medicamentos?.slice(0, 2).map((med: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                                            <p className="text-[12px] text-slate-700 font-semibold truncate">
                                                {med.nome}
                                                <span className="text-slate-400 font-normal"> · {med.concentracao}</span>
                                            </p>
                                        </div>
                                    ))}
                                    {receita.medicamentos?.length > 2 && (
                                        <p className="text-[11px] text-slate-400 pl-4">
                                            +{receita.medicamentos.length - 2} medicamento{receita.medicamentos.length - 2 > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
 
                                <div className="flex justify-between items-center px-4 pt-2 pb-3.5 border-t border-slate-100/80">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{dateRelative(receita.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {receita.status === 'ativa' && (
                                            <>
                                                <button
                                                    className="text-[#2D5284] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                    onClick={e => { e.stopPropagation(); }}
                                                    aria-label="Compartilhar"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-[#2D5284] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                    onClick={e => { e.stopPropagation(); }}
                                                    aria-label="Baixar"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="w-full bg-white/40 rounded-[28px] p-10 text-center border border-dashed border-slate-300">
                        <p className="text-[14px] text-slate-500 font-medium">Você ainda não possui receitas</p>
                        <button onClick={() => router.push('/buscar')} className="mt-4 text-[13px] font-bold text-[#1A365D] hover:underline">Encontrar um médico</button>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    )
}
