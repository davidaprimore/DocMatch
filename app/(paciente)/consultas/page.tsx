'use client'

import { useState, useMemo } from 'react'
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
    const [filtroAtivo, setFiltroAtivo] = useState('todas')

    const filtros = [
        { id: 'todas', label: 'Todas', icon: Calendar },
        { id: 'agendada', label: 'Agendadas', icon: Clock },
        { id: 'realizada', label: 'Realizadas', icon: CheckCircle2 },
        { id: 'cancelada', label: 'Canceladas', icon: XCircle },
    ]

    // Lógica Avançada de Filtragem
    const agendamentosFiltrados = useMemo(() => {
        if (!agendamentos) return []

        // 1. Identificar IDs que foram remarcados (não devem aparecer como item principal se já existe um novo)
        const idsRemarcadosAnteriores = agendamentos
            .map(a => a.id_agendamento_anterior)
            .filter(Boolean)

        return agendamentos.filter(consulta => {
            // Ocultar se esta consulta foi a "origem" de uma remarcação ativa na lista
            if (idsRemarcadosAnteriores.includes(consulta.id)) return false

            // Filtro por Status
            if (filtroAtivo === 'todas') return true
            if (filtroAtivo === 'agendada') return ['agendada', 'confirmada', 'pendente'].includes(consulta.status)
            return consulta.status === filtroAtivo
        })
    }, [agendamentos, filtroAtivo])

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <div className="relative z-10 pb-[112.5px] flex flex-col">
                <Header
                    title="Minhas Consultas"
                    showBackButton
                    showNotifications
                />

                {/* Zona de Ação e Filtros v6.0 */}
                <div className="px-5 -mt-10 mb-6 relative z-50 flex flex-col gap-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => router.push('/buscar')}
                            className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] text-[#1A365D] font-black px-7 py-3 rounded-2xl text-[11px] uppercase tracking-widest shadow-[0_10px_25px_rgba(212,175,55,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/40 brightness-110 active:brightness-125"
                        >
                            <Plus className="w-4 h-4" />
                            Agendar Nova Consulta
                        </button>
                    </div>

                    {/* Chips de Filtro Criativos */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                        {filtros.map((f) => {
                            const Icon = f.icon
                            const isSelected = filtroAtivo === f.id
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setFiltroAtivo(f.id)}
                                    className={cn(
                                        "flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 border",
                                        isSelected 
                                            ? "bg-[#2D5284] text-white border-[#2D5284] shadow-lg shadow-blue-900/20 scale-105" 
                                            : "bg-white/60 backdrop-blur-md text-[#2D5284] border-white/80 hover:bg-white/80"
                                    )}
                                >
                                    <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-[#2D5284]")} />
                                    {f.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <main className="px-2.5 space-y-14 relative z-10 pt-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-[#2D5284] animate-spin" />
                            <p className="text-slate-400 text-[12px] mt-4 font-bold uppercase tracking-widest">Carregando consultas...</p>
                        </div>
                    ) : agendamentosFiltrados.length > 0 ? (
                        agendamentosFiltrados.map((consulta, index) => {
                            const medico = consulta.medicos
                            const st = statusConfig[consulta.status as keyof typeof statusConfig] || statusConfig.agendada
                            const StatusIcon = st.icon
                            const isFirst = index === 0 && (['agendada', 'confirmada', 'pendente'].includes(consulta.status))
                            const isRemarcada = !!consulta.id_agendamento_anterior

                            return (
                                <div
                                    key={consulta.id}
                                    className={cn(
                                        "group relative bg-white/40 backdrop-blur-2xl rounded-[32px] p-0.5 shadow-[0_12px_40px_rgba(31,62,109,0.12)] border border-white transition-all duration-500 hover:shadow-[0_24px_54px_rgba(31,62,109,0.18)] cursor-pointer",
                                        isFirst && "ring-2 ring-[#D4AF37]/20"
                                    )}
                                    onClick={() => router.push(`/consultas/${consulta.id}`)}
                                >
                                    {/* Selo do Médico (Avatar) + Status */}
                                    <div className="absolute -top-10 left-4 z-30 flex flex-col items-center gap-2.5">
                                        <div
                                            className="relative rounded-full overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.22)] border-[4px] border-white ring-8 ring-white/5 bg-white"
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

                                        {/* Status Pill Segue o Avatar */}
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/60",
                                            st.bg, st.text
                                        )}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {st.label}
                                        </div>
                                    </div>

                                    {/* Tag Próxima Consulta ou Countdown CTA */}
                                    <div className="absolute -top-4 right-6 z-30 flex flex-col items-end gap-2">
                                        {(() => {
                                            const agora = new Date()
                                            const dataConsulta = new Date(consulta.data_horario)
                                            const diffMs = dataConsulta.getTime() - agora.getTime()
                                            const diffHours = diffMs / (1000 * 60 * 60)
                                            const diffDays = Math.ceil(diffHours / 24)

                                            if (diffMs > 0 && diffHours <= 72 && (['agendada', 'confirmada', 'pendente'].includes(consulta.status))) {
                                                let texto = ''
                                                let color = 'from-amber-500 to-amber-600'
                                                
                                                if (diffHours > 48) {
                                                    texto = `Consulta em 3 dias`
                                                } else if (diffHours > 24) {
                                                    texto = `Consulta em 2 dias`
                                                } else {
                                                    const h = Math.floor(diffHours)
                                                    const m = Math.floor((diffHours - h) * 60)
                                                    texto = `Faltam ${h}h ${m}min`
                                                    color = 'from-red-500 to-red-600 animate-pulse'
                                                }

                                                return (
                                                    <div className={cn(
                                                        "bg-gradient-to-r text-white text-[9px] font-black px-5 py-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.2)] uppercase tracking-[0.12em] border border-white/40 flex items-center gap-2",
                                                        color
                                                    )}>
                                                        <Clock className="w-3 h-3" />
                                                        {texto}
                                                    </div>
                                                )
                                            }

                                            if (isFirst) {
                                                return (
                                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-5 py-2 rounded-full shadow-[0_8px_25px_rgba(239,68,68,0.4)] animate-bounce uppercase tracking-[0.15em] border border-white/40 flex items-center gap-2">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        Atenção: Próxima Consulta!
                                                    </div>
                                                )
                                            }

                                            return null
                                        })()}
                                    </div>

                                    {/* Efeito Glass Reflection */}
                                    <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                                        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 group-hover:top-[0%] group-hover:left-[0%] transition-all duration-1000 opacity-0 group-hover:opacity-100" />
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="relative pt-4">
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

                                        <div className="px-6 pb-6 mt-6 flex flex-col">
                                            <div className="flex gap-3 mt-1">
                                                <div className="flex items-center gap-2 text-[12px] text-[#2D5284] font-black bg-[#2D5284]/5 px-4 py-1.5 rounded-full border border-[#2D5284]/10 shadow-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {dateToDisplay(consulta.data_horario.split('T')[0])}
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] text-[#2D5284] font-black bg-[#2D5284]/5 px-4 py-1.5 rounded-full border border-[#2D5284]/10 shadow-sm">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(consulta.data_horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>

                                                {isRemarcada && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black bg-[#D4AF37]/10 text-[#B8860B] px-3 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-sm uppercase tracking-wider">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        Remarcada
                                                    </div>
                                                )}
                                            </div>

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

