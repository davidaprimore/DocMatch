'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Search, MapPin, CalendarDays, X, CheckCircle2, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react'
import { BottomNavMedico } from '@/components/BottomNavMedico'

type SlotStatus = 'livre' | 'agendado' | 'bloqueado'
type AgendamentoClass = 'primeira' | 'retorno' | 'urgencia' | null

interface TimeSlot {
    id: string
    time: string
    status: SlotStatus
    patientName?: string
    classes?: AgendamentoClass
    isPast?: boolean
}

// Mocks Dependentes de Localização
const MOCK_LOCAIS = [
    { id: '1', nome: 'Clínica Central' },
    { id: '2', nome: 'Consultório Flamboyant' }
]

const AGENDA_LOCAL_1: TimeSlot[] = [
    { id: '101', time: '08:00', status: 'agendado', patientName: 'Maria Silva', classes: 'primeira', isPast: true },
    { id: '102', time: '08:30', status: 'livre', isPast: true },
    { id: '103', time: '09:00', status: 'agendado', patientName: 'João Souza', classes: 'retorno' },
    { id: '104', time: '09:30', status: 'bloqueado' },
    { id: '105', time: '10:00', status: 'agendado', patientName: 'Carlos Mendonça', classes: 'urgencia' },
    { id: '106', time: '10:30', status: 'livre' },
]

const AGENDA_LOCAL_2: TimeSlot[] = [
    { id: '201', time: '13:00', status: 'agendado', patientName: 'Fernanda Lima', classes: 'urgencia' },
    { id: '202', time: '13:30', status: 'agendado', patientName: 'Pedro Antunes', classes: 'primeira' },
    { id: '203', time: '14:00', status: 'livre' },
    { id: '204', time: '14:30', status: 'livre' },
    { id: '205', time: '15:00', status: 'bloqueado' },
]

const MAPA_AGENDAS: Record<string, TimeSlot[]> = {
    '1': AGENDA_LOCAL_1,
    '2': AGENDA_LOCAL_2
}

export default function AgendaDoDiaPage() {
    const router = useRouter()
    const [selectedLocalId, setSelectedLocalId] = useState<string>(MOCK_LOCAIS[0].id)
    const [isLocalDropdownOpen, setIsLocalDropdownOpen] = useState(false)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
    
    // Date Logic
    const [baseDate, setBaseDate] = useState(new Date())
    
    const generateCarouselDays = (base: Date) => {
        const days = []
        for (let i = -1; i <= 4; i++) {
            const d = new Date(base)
            d.setDate(base.getDate() + i)
            days.push(d)
        }
        return days
    }
    
    const carouselDays = generateCarouselDays(baseDate)
    const formatDayName = (d: Date) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()]
    const monthsName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    const handlePrevDay = () => setBaseDate(prev => new Date(prev.getTime() - 86400000))
    const handleNextDay = () => setBaseDate(prev => new Date(prev.getTime() + 86400000))
    
    const isBeforeToday = (d: Date) => {
        const today = new Date()
        today.setHours(0,0,0,0)
        const check = new Date(d)
        check.setHours(0,0,0,0)
        return check.getTime() < today.getTime()
    }
    const isSameDate = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    
    const isPassadoLinear = (timeStr: string) => {
        const today = new Date()
        if (isBeforeToday(baseDate)) return true
        if (!isSameDate(baseDate, today)) return false
        const [h, m] = timeStr.split(':').map(Number)
        return (h < today.getHours()) || (h === today.getHours() && m < today.getMinutes())
    }

    // Pega a agenda do local atual, mantendo estado próprio para manipulação (bloqueios)
    const [slotsCorrentes, setSlotsCorrentes] = useState<Record<string, TimeSlot[]>>(MAPA_AGENDAS)
    
    // Estado de Interação dos slots (UX do duplo clique ou clique unico)
    const [pendingSlotAction, setPendingSlotAction] = useState<string | null>(null)
    const [modalPatient, setModalPatient] = useState<TimeSlot | null>(null)

    const slots = slotsCorrentes[selectedLocalId] || []

    const handleSlotUpdate = (slotId: string, novoStatus: SlotStatus) => {
        setSlotsCorrentes(prev => {
            const copia = { ...prev }
            copia[selectedLocalId] = copia[selectedLocalId].map(s => s.id === slotId ? { ...s, status: novoStatus } : s)
            return copia
        })
        setPendingSlotAction(null)
    }

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.isPast) return
        if (slot.status === 'agendado') {
            setModalPatient(slot)
            return
        }

        // UX: Clique único pede confirmação. Segundo clique realiza ação.
        // Simulando duplo clique/confirmação nativa
        if (pendingSlotAction === slot.id) {
            handleSlotUpdate(slot.id, slot.status === 'livre' ? 'bloqueado' : 'livre')
        } else {
            setPendingSlotAction(slot.id)
            // Auto limpa pending status após 4 segundos se não confirmar
            setTimeout(() => {
                setPendingSlotAction((prev) => prev === slot.id ? null : prev)
            }, 4000)
        }
    }

    // Modal de Calendário Muito Mais Premium e Nativo
    const CustomCalendarModal = () => {
        const daysInMonth = Array.from({length: 31}, (_, i) => i + 1)
        return (
            <AnimatePresence>
                {isCalendarModalOpen && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A365D]/80 backdrop-blur-md px-4">
                        <motion.div initial={{scale:0.9, y:30}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-[#1A365D] w-full max-w-sm rounded-[32px] p-6 shadow-[0_12px_60px_rgba(0,0,0,0.6)] border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <button className="p-2 bg-white/5 rounded-xl text-white/50 hover:bg-white/10"><ChevronLeft className="w-5 h-5"/></button>
                                <h3 className="font-black text-white text-[16px]">Março 2026</h3>
                                <button className="p-2 bg-white/5 rounded-xl text-white/50 hover:bg-white/10"><ChevronRight className="w-5 h-5"/></button>
                            </div>
                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center">
                                {Array.from({length: 2}).map((_,i) => <div key={`empty-${i}`} />)}
                                {daysInMonth.map(d => (
                                    <button 
                                        key={d}
                                        onClick={() => { 
                                            const novo = new Date(baseDate)
                                            novo.setDate(d)
                                            setBaseDate(novo)
                                            setIsCalendarModalOpen(false) 
                                        }}
                                        className={`h-10 rounded-full text-[14px] font-bold flex items-center justify-center transition-all 
                                            ${d === baseDate.getDate() ? 'bg-[#D4AF37] text-[#1A365D] shadow-[0_4px_15px_rgba(212,175,55,0.4)]' : 'text-white/80 hover:bg-white/10 active:scale-90'}
                                            ${d < new Date().getDate() ? 'opacity-30 pointer-events-none' : ''}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setIsCalendarModalOpen(false)} className="w-full mt-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-black uppercase text-[12px] tracking-widest active:scale-95 transition-transform">
                                Fechar Calendário
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }

    return (
        <div className="min-h-screen bg-[#1A365D] font-sans pb-32 text-white relative selection:bg-[#D4AF37]/30">
            {/* Background Animations: Reduzido para sutileza e elegância (voltar pra opacity suave) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white rounded-full blur-[140px]" />
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] -right-32 w-[500px] h-[500px] bg-white rounded-full blur-[140px]" />
            </div>

            <CustomCalendarModal />

            {/* HEADER INTERATIVO: Redução do white/20 para white/5 ou 10 */}
            <header className="px-5 pt-8 pb-6 relative z-30 bg-white/5 backdrop-blur-3xl rounded-b-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border-b border-white/10 sticky top-0">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/20 transition active:scale-90">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => setIsCalendarModalOpen(true)} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white relative hover:bg-white/20 transition-all shadow-sm active:scale-90 shrink-0">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
                
                <h1 className="text-[26px] font-black mb-6 leading-tight tracking-tight mt-6">
                    Agenda Interativa
                </h1>

                <div className="relative mb-6">
                    <button 
                        onClick={() => setIsLocalDropdownOpen(!isLocalDropdownOpen)}
                        className="w-full flex justify-between items-center bg-slate-100/95 backdrop-blur-3xl border border-slate-300 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-[#1A365D] font-black text-[15px] px-5 py-3.5 rounded-2xl outline-none hover:bg-white transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-[#D4AF37]" />
                           <span>{MOCK_LOCAIS.find(l => l.id === selectedLocalId)?.nome}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-[#1A365D]/50 transition-transform ${isLocalDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isLocalDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }} 
                                className="absolute top-[105%] left-0 w-full bg-slate-100/95 backdrop-blur-3xl border border-slate-300 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50"
                            >
                                {MOCK_LOCAIS.map(l => (
                                    <button 
                                        key={l.id} 
                                        onClick={() => { setSelectedLocalId(l.id); setIsLocalDropdownOpen(false) }} 
                                        className={`w-full text-left px-5 py-4 transition-colors border-b last:border-0 border-slate-200 flex items-center justify-between
                                            ${selectedLocalId === l.id ? 'bg-[#1A365D]' : 'hover:bg-[#1A365D] hover:text-[#D4AF37]'}`
                                        }
                                    >
                                        <span className={`text-[15px] ${selectedLocalId === l.id ? 'text-[#D4AF37] font-black' : 'text-[#1A365D] font-bold'}`}>
                                            {l.nome}
                                        </span>
                                        {selectedLocalId === l.id && <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Carrossel Inteligente - Impede passado */}
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevDay} className="p-1 disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-white/50 hover:text-white" /></button>
                        <div className="text-center">
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] block mb-0.5">Visão do Dia</span>
                            <span className="text-white text-[13px] font-black uppercase">{formatDayName(baseDate)}., {baseDate.getDate()} de {monthsName[baseDate.getMonth()].substring(0,3)}</span>
                        </div>
                        <button onClick={handleNextDay} className="p-1"><ChevronRight className="w-4 h-4 text-white hover:text-[#D4AF37]" /></button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto min-w-full pb-2 snap-x hide-scrollbar">
                        {carouselDays.map(d => {
                            const selected = isSameDate(d, baseDate)
                            const before = isBeforeToday(d) && !isSameDate(d, new Date())
                            return (
                                <div onClick={() => setBaseDate(d)} key={d.getTime()} className={`min-w-[55px] h-[75px] rounded-2xl flex flex-col items-center justify-center snap-center shrink-0 border transition-all cursor-pointer ${
                                    selected
                                        ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] border-transparent shadow-[0_8px_20px_rgba(212,175,55,0.4)]' 
                                        : before 
                                            ? 'bg-white/5 border-white/5 opacity-50' 
                                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                                }`}>
                                    <span className={`text-[10px] font-black uppercase ${selected ? 'text-[#1A365D]' : 'text-white/60'}`}>
                                        {formatDayName(d)}
                                    </span>
                                    <span className={`text-[20px] font-black mt-1 ${selected ? 'text-[#1A365D]' : 'text-white'}`}>{d.getDate()}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </header>

            {/* Listagem da Agenda */}
            <main className="px-5 mt-8 space-y-4 relative z-10">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h2 className="text-white font-black text-lg tracking-tight">Faixas de Horários</h2>
                    <span className="text-white/40 font-black text-[9px] uppercase tracking-widest text-right leading-tight w-[100px]">Toque em horários vazios p/ Bloquear</span>
                </div>

                <AnimatePresence mode='popLayout'>
                    {slots.map((slot) => {
                        const isPending = pendingSlotAction === slot.id
                        const pastTime = slot.isPast || isPassadoLinear(slot.time)
                        
                        let cardStyle = "bg-white/5 border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-white/10"
                        if (pastTime) cardStyle = "bg-white/5 border-white/5 opacity-50 saturate-0"
                        else if (slot.status === 'bloqueado') cardStyle = "bg-red-500/10 border-red-500/20 shadow-none hover:bg-red-500/10"
                        
                        // Barra Lateral Classificatória
                        let colorBar = 'bg-transparent'
                        if (slot.classes === 'urgencia') colorBar = 'bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]'
                        else if (slot.classes === 'primeira') colorBar = 'bg-[#4ade80] shadow-[0_0_15px_#4ade80]'
                        else if (slot.classes === 'retorno') colorBar = 'bg-[#60a5fa] shadow-[0_0_15px_#60a5fa]'

                        return (
                            <motion.div 
                                key={slot.id} 
                                layout
                                initial={{ opacity: 0, y: 15 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => {if (!pastTime) handleSlotClick(slot)}}
                                className={`relative overflow-hidden backdrop-blur-3xl rounded-[24px] border transition-all cursor-pointer ${cardStyle} ${isPending ? 'ring-2 ring-[#D4AF37]/50 scale-[0.98]' : ''}`}
                            >
                                {/* Barra Coloriateral */}
                                <div className={`absolute top-4 bottom-4 left-4 w-1.5 rounded-full ${colorBar} opacity-80`} />

                                <div className="flex items-center p-4 pl-8 pr-4 min-h-[72px]">
                                    <div className="w-14 border-r border-white/10 pr-3 shrink-0">
                                        <span className={`font-black text-[15px] ${slot.status === 'bloqueado' ? 'text-red-400/80' : 'text-white'}`}>{slot.time}</span>
                                    </div>
                                    
                                    <div className="flex-1 pl-3 flex flex-col justify-center min-h-full">
                                        {slot.status === 'livre' && !isPending && (
                                            <div className="flex items-center gap-1.5 text-white/50">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="font-bold text-[12px]">Tempo Livre</span>
                                            </div>
                                        )}
                                        
                                        {slot.status === 'agendado' && (
                                            <>
                                                <span className="text-white font-black text-[14px] leading-tight mb-0.5">{slot.patientName}</span>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className={`w-3 h-3 ${slot.classes==='urgencia'?'text-[#D4AF37]':slot.classes==='primeira'?'text-[#4ade80]':'text-[#60a5fa]'}`} />
                                                    <span className="text-white/70 font-bold text-[10px] uppercase tracking-wide">
                                                        {slot.classes}
                                                    </span>
                                                    {slot.classes === 'urgencia' && <span className="text-[12px]">⚡</span>}
                                                </div>
                                            </>
                                        )}

                                        {slot.status === 'bloqueado' && !isPending && (
                                            <div className="flex items-center gap-2 text-red-400">
                                                <X className="w-4 h-4" />
                                                <span className="font-bold text-[14px]">Bloqueado Manualmente</span>
                                            </div>
                                        )}

                                        {isPending && (
                                            <div className="flex items-center justify-between animate-pulse">
                                                <span className="text-[#D4AF37] font-black text-[12px] uppercase tracking-wider">Toque novamente p/ {slot.status === 'livre' ? 'Bloquear' : 'Desbloquear'}</span>
                                                <button onClick={(e) => { e.stopPropagation(); setPendingSlotAction(null) }} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </main>

            {/* Modal de Detalhes do Paciente (Oculto p/ simplificação, ativo quando modalPatient !== null) */}
            <AnimatePresence>
                {modalPatient && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-end justify-center bg-[#1A365D]/80 backdrop-blur-md">
                        <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="bg-white/10 backdrop-blur-3xl w-full rounded-t-[40px] border-t border-white/20 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] h-[60vh] flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                        Consulta Agendada • {modalPatient.time}
                                    </div>
                                    <h2 className="text-white font-black text-3xl">{modalPatient.patientName}</h2>
                                </div>
                                <button onClick={() => setModalPatient(null)} className="p-3 bg-white/5 rounded-2xl text-white/50 hover:bg-white/10 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                    <span className="text-white/40 text-[11px] font-black uppercase tracking-widest block mb-1">Motivo / Tipo</span>
                                    <span className="text-white font-bold text-[15px] capitalize">{modalPatient.classes}</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                    <span className="text-white/40 text-[11px] font-black uppercase tracking-widest block mb-1">Local</span>
                                    <span className="text-white font-bold text-[15px]">{MOCK_LOCAIS.find(l=>l.id===selectedLocalId)?.nome}</span>
                                </div>
                            </div>

                            <button onClick={()=>setModalPatient(null)} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] py-5 rounded-2xl text-[#1A365D] font-black uppercase text-[13px] tracking-widest shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-95 transition-all">
                                Fechar Prontuário Rádpido
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNavMedico />
        </div>
    )
}
