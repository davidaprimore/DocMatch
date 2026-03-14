'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, ChevronRight, CheckCircle2, XCircle, AlertCircle, Plus } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useAgendamentos } from '@/hooks/useAgendamentos'
import { dateToDisplay } from '@/lib/utils/masks'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const statusConfig = {
    agendada: { label: 'Agendada', bg: 'bg-blue-50', text: 'text-[#2D5284]', icon: Clock },
    confirmada: { label: 'Confirmada', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    realizada: { label: 'Realizada', bg: 'bg-slate-50', text: 'text-slate-600', icon: CheckCircle2 },
    cancelada: { label: 'Cancelada', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
    nao_compareceu: { label: 'Faltou', bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
}

export default function ConsultasPage() {
    const router = useRouter()
    const { agendamentos, isLoading } = useAgendamentos()

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* CONTEÚDO DA PÁGINA (Z-10 para ficar sobre a névoa) */}
            <div className="relative z-10 pb-[112.5px] flex flex-col">
                <Header
                    title="Minhas Consultas"
                    showBackButton
                    showNotifications
                />

                {/* Zona de Ação Estratégica v5.0 - Overlap Header à Direita */}
                <div className="px-5 -mt-10 mb-6 flex justify-end relative z-50">
                    <button
                        onClick={() => router.push('/buscar')}
                        className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] text-[#1A365D] font-black px-7 py-3 rounded-2xl text-[11px] uppercase tracking-widest shadow-[0_10px_25px_rgba(212,175,55,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/40 brightness-110 active:brightness-125"
                    >
                        <Plus className="w-4 h-4" />
                        Agendar Nova Consulta
                    </button>
                </div>

                <main className="px-2.5 space-y-14 relative z-10 pt-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-[#2D5284] animate-spin" />
                            <p className="text-slate-400 text-[12px] mt-4 font-bold uppercase tracking-widest">Carregando consultas...</p>
                        </div>
                    ) : agendamentos.length > 0 ? (
                        agendamentos.map((consulta, index) => {
                            const medico = consulta.medicos
                            const st = statusConfig[consulta.status as keyof typeof statusConfig] || statusConfig.agendada
                            const StatusIcon = st.icon
                            const isFirst = index === 0 && (consulta.status === 'agendada' || consulta.status === 'confirmada')

                            return (
                                <div
                                    key={consulta.id}
                                    className={cn(
                                        "group relative bg-white/40 backdrop-blur-2xl rounded-[32px] p-0.5 shadow-[0_12px_40px_rgba(31,62,109,0.12)] border border-white transition-all duration-500 hover:shadow-[0_24px_54px_rgba(31,62,109,0.18)] cursor-pointer",
                                        isFirst && "ring-2 ring-[#D4AF37]/20"
                                    )}
                                    onClick={() => router.push(`/consultas/${consulta.id}`)}
                                >
                                    {/* Selo do Médico (Avatar) + Status - Solução Elite v5.2 */}
                                    <div className="absolute -top-10 left-4 z-30 flex flex-col items-center gap-2.5">
                                        <div
                                            className="rounded-full overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.22)] border-[4px] border-white ring-8 ring-white/5 bg-white"
                                            style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px' }}
                                        >
                                            <img
                                                src={medico?.foto || 'https://via.placeholder.com/150'}
                                                className="block"
                                                style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                                                alt={medico?.nome || 'Médico'}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(medico?.nome || 'M') + '&background=2D5284&color=fff&size=200';
                                                }}
                                            />
                                        </div>

                                        {/* Status Pill Segue o Avatar v5.10 */}
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/60",
                                            st.bg, st.text
                                        )}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {st.label}
                                        </div>
                                    </div>

                                    {/* Tag Próxima Consulta - Margem Overlay v5.1 */}
                                    {isFirst && (
                                        <div className="absolute -top-3 right-6 z-30 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg animate-pulse uppercase tracking-[0.15em] border border-white/40">
                                            Próxima Consulta
                                        </div>
                                    )}

                                    {/* Efeito Glass Reflection - Isolado para não cortar avatares v5.30 */}
                                    <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                                        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 group-hover:top-[0%] group-hover:left-[0%] transition-all duration-1000 opacity-0 group-hover:opacity-100" />
                                    </div>

                                    {/* Conteúdo v5.3 */}
                                    <div className="relative pt-4">
                                        {/* Bloco de Nome e Especialidade com Recuo Elite Breathe */}
                                        <div className="pl-[132px] pr-5 pt-1">
                                            <h3 className="font-black text-[20px] text-[#1A365D] leading-tight truncate">
                                                {medico?.nome || 'Médico não encontrado'}
                                            </h3>

                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.1em] truncate">
                                                    {medico?.especialidades?.nome || 'Clínica Geral'}
                                                </p>
                                                <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg border border-[#D4AF37]/20">
                                                    <span className="text-[#D4AF37] text-[10px]">★</span>
                                                    <span className="text-[11px] font-black text-[#1A365D]">
                                                        {(medico?.nota || 5.0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Base do Card Alinhada à Esquerda v5.14 */}
                                        <div className="px-6 pb-6 mt-6 flex flex-col">
                                            {/* Pills de Tempo Unificadas (Azul) - Posição v5.18 */}
                                            <div className="flex gap-3 mt-1">
                                                <div className="flex items-center gap-2 text-[12px] text-[#2D5284] font-black bg-[#2D5284]/5 px-4 py-1.5 rounded-full border border-[#2D5284]/10 shadow-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {dateToDisplay(consulta.data_horario.split('T')[0])}
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] text-[#2D5284] font-black bg-[#2D5284]/5 px-4 py-1.5 rounded-full border border-[#2D5284]/10 shadow-sm">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(consulta.data_horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            {/* Localização Minimalista e Legível - Subindo o dobro v5.16 */}
                                            <div className="mt-1 pt-2 border-t border-slate-100/60 flex items-center gap-3.5">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#2D5284] flex-shrink-0 border border-white shadow-sm">
                                                    {consulta.tipo === 'online' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Local</span>
                                                    <span className="text-[14px] text-[#1A365D] font-bold truncate">
                                                        {consulta.tipo === 'online'
                                                            ? 'Sala Virtual DocMatch - Vídeo Chamada'
                                                            : (medico?.endereco?.logradouro
                                                                ? `${medico.endereco.logradouro}, ${medico.endereco.numero}`
                                                                : 'Consultório Particular Presencial')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/60 text-center px-10 mx-2 shadow-2xl">
                            <div className="w-20 h-20 bg-slate-100/50 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white">
                                <Calendar className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-black text-[16px] tracking-tight">Nenhuma consulta encontrada.</p>
                            <p className="text-slate-400 text-[12px] mt-2 font-medium">Agende seu primeiro atendimento agora e tenha o melhor cuidado na palma da mão.</p>
                        </div>
                    )}
                </main>

                <BottomNav />
            </div>
        </div>
    )
}
