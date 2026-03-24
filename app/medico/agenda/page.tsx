'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Clock, Search, MapPin, CalendarDays, X,
    CheckCircle2, ChevronRight, ChevronDown, ChevronLeft,
    TrendingUp, Calendar, AlertCircle, CalendarX2, Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { BottomNavMedico } from '@/components/BottomNavMedico'
import { useAuth } from '@/hooks/useAuth'

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
    { id: '107', time: '11:00', status: 'livre' },
    { id: '108', time: '11:30', status: 'agendado', patientName: 'Beatriz Costa', classes: 'retorno' },
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
    const { user } = useAuth()
    const [selectedLocalId, setSelectedLocalId] = useState<string>(MOCK_LOCAIS[0].id)
    const [isLocalDropdownOpen, setIsLocalDropdownOpen] = useState(false)
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

    // Date Logic
    const [baseDate, setBaseDate] = useState(new Date())

    const generateCarouselDays = useCallback((base: Date) => {
        const days = []
        for (let i = -1; i <= 4; i++) {
            const d = new Date(base)
            d.setDate(base.getDate() + i)
            days.push(d)
        }
        return days
    }, [])

    const carouselDays = generateCarouselDays(baseDate)
    const formatDayName = (d: Date) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()]
    const monthsName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const handlePrevDay = () => setBaseDate(prev => new Date(prev.getTime() - 86400000))
    const handleNextDay = () => setBaseDate(prev => new Date(prev.getTime() + 86400000))

    const isBeforeToday = (d: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const check = new Date(d)
        check.setHours(0, 0, 0, 0)
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

    // Pega a agenda do local atual
    const [slotsCorrentes, setSlotsCorrentes] = useState<Record<string, TimeSlot[]>>(MAPA_AGENDAS)
    const [pendingSlotAction, setPendingSlotAction] = useState<string | null>(null)
    const [modalPatient, setModalPatient] = useState<TimeSlot | null>(null)

    const slots = slotsCorrentes[selectedLocalId] || []

    // Metrics calculation
    const totalSlots = slots.length
    const bookedSlots = slots.filter(s => s.status === 'agendado').length
    const occupancyRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0

    const handleSlotUpdate = (slotId: string, novoStatus: SlotStatus) => {
        setSlotsCorrentes(prev => {
            const copia = { ...prev }
            copia[selectedLocalId] = copia[selectedLocalId].map(s => s.id === slotId ? { ...s, status: novoStatus } : s)
            return copia
        })
        setPendingSlotAction(null)
    }

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.isPast || isPassadoLinear(slot.time)) return
        if (slot.status === 'agendado') {
            setModalPatient(slot)
            return
        }

        if (pendingSlotAction === slot.id) {
            handleSlotUpdate(slot.id, slot.status === 'livre' ? 'bloqueado' : 'livre')
        } else {
            setPendingSlotAction(slot.id)
            setTimeout(() => {
                setPendingSlotAction((prev) => prev === slot.id ? null : prev)
            }, 4000)
        }
    }

    // Estados para o Calendário Dinâmico e Bloqueio
    const [calendarViewDate, setCalendarViewDate] = useState(new Date())
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
    const [rangeStart, setRangeStart] = useState<Date | null>(null)
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
    const [isBlockingMode, setIsBlockingMode] = useState(false)
    const [calendarAlert, setCalendarAlert] = useState<{ title: string, message: string, type: 'error' | 'confirm', onConfirm?: () => void } | null>(null)
    const [isExpedienteModalOpen, setIsExpedienteModalOpen] = useState(false)

    // Helper para gerar dias do mês no calendário
    const getDaysInMonth = (year: number, month: number) => {
        const date = new Date(year, month + 1, 0)
        return date.getDate()
    }
    const getFirstDayOfMonth = (year: number, month: number) => {
        const date = new Date(year, month, 1)
        return date.getDay()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] font-sans pb-32 relative text-[#1A365D]">
            {/* Componentes de Modal Extraídos para Performance */}
            <CustomCalendarModal 
                isOpen={isCalendarModalOpen}
                viewDate={calendarViewDate}
                setViewDate={setCalendarViewDate}
                baseDate={baseDate}
                setBaseDate={setBaseDate}
                onClose={() => {
                    setIsCalendarModalOpen(false)
                    setIsBlockingMode(false)
                    setRangeStart(null)
                    setRangeEnd(null)
                }}
                isBlockingMode={isBlockingMode}
                setIsBlockingMode={setIsBlockingMode}
                rangeStart={rangeStart}
                setRangeStart={setRangeStart}
                rangeEnd={rangeEnd}
                setRangeEnd={setRangeEnd}
                alert={calendarAlert}
                setAlert={setCalendarAlert}
                showMonthYearPicker={showMonthYearPicker}
                setShowMonthYearPicker={setShowMonthYearPicker}
                selectedLocalId={selectedLocalId}
                slotsCorrentes={slotsCorrentes}
            />

            <WorkScheduleModal 
                isOpen={isExpedienteModalOpen}
                onClose={() => setIsExpedienteModalOpen(false)}
            />

            <header className="px-5 pt-4 pb-12 relative z-40 bg-[#2D5284] shadow-[0_12px_30px_rgba(45,82,132,0.2)] rounded-b-[36px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                            <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <h1 className="text-white font-black text-lg tracking-tight uppercase">Minha Agenda</h1>
                    </div>
                    <div>
                        <h1 className="text-white font-black text-[16px] tracking-tight flex items-center gap-1 uppercase">
                            Doc<span className="text-[#D4AF37]">Match</span>
                        </h1>
                    </div>
                </div>

                <div className="relative z-10 mt-2 flex justify-between items-end">
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Visualização do Dia</p>
                        <div className="flex items-center gap-2">
                            <span className="text-white text-3xl font-black">{baseDate.getDate()}</span>
                            <div className="flex flex-col">
                                <span className="text-[#D4AF37] text-[12px] font-black uppercase leading-none">{monthsName[baseDate.getMonth()]}</span>
                                <span className="text-white/80 text-[12px] font-bold leading-none mt-0.5">{formatDayName(baseDate)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsExpedienteModalOpen(true)}
                        className="bg-[#D4AF37] px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_8px_25px_rgba(212,175,55,0.3)] active:scale-95 transition-all group border border-[#D4AF37] mb-0.5"
                    >
                        <Clock className="w-3.5 h-3.5 text-[#2D5284]" />
                        <span className="text-[#2D5284] font-black text-[10px] uppercase tracking-widest mt-0.5">Expediente</span>
                    </button>
                </div>
            </header>

            <main className="px-4 -mt-8 relative z-50 space-y-4">
                {/* Seletor de Unidade Overlapping */}
                <div className="relative">
                    <button
                        onClick={() => setIsLocalDropdownOpen(!isLocalDropdownOpen)}
                        className="w-full flex justify-between items-center bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(31,62,109,0.12)] text-[#2D5284] font-black text-[15px] px-5 py-4 rounded-[24px] outline-none transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[#D4AF37]" />
                            <span className="tracking-tight">{MOCK_LOCAIS.find(l => l.id === selectedLocalId)?.nome}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-[#2D5284]/40 transition-transform ${isLocalDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isLocalDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-[105%] left-0 w-full bg-white/95 backdrop-blur-xl border border-white/20 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[60]"
                            >
                                {MOCK_LOCAIS.map(l => (
                                    <button
                                        key={l.id}
                                        onClick={() => { setSelectedLocalId(l.id); setIsLocalDropdownOpen(false) }}
                                        className={`w-full text-left px-5 py-5 transition-colors border-b last:border-0 border-slate-100 flex items-center justify-between
                                            ${selectedLocalId === l.id ? 'bg-[#2D5284]/5' : 'hover:bg-slate-50'}`
                                        }
                                    >
                                        <span className={`text-[15px] ${selectedLocalId === l.id ? 'text-[#2D5284] font-black' : 'text-slate-500 font-bold'}`}>
                                            {l.nome}
                                        </span>
                                        {selectedLocalId === l.id && <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Termômetro de Ocupação - Metric Glass Style */}
                <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(31,62,109,0.08)] rounded-[24px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <p className="text-[#2D5284] font-black text-[14px] leading-tight">Sucesso da Agenda</p>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{bookedSlots}/{totalSlots} Consultas hoje</p>
                        </div>
                    </div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={150.8} strokeDashoffset={150.8 - (150.8 * occupancyRate) / 100} className="text-[#D4AF37] transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-[11px] font-black text-[#2D5284]">{occupancyRate}%</span>
                    </div>
                </div>

                {/* Carrossel de Datas Compacto */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
                    <button onClick={() => setIsCalendarModalOpen(true)} className="min-w-[48px] h-14 bg-white/70 backdrop-blur-md border border-white/80 shadow-sm rounded-2xl flex items-center justify-center text-[#2D5284] active:scale-90 transition-all shrink-0">
                        <Calendar className="w-5 h-5" />
                    </button>
                    {carouselDays.map((d, idx) => {
                        const selected = isSameDate(d, baseDate)
                        const before = isBeforeToday(d) && !isSameDate(d, new Date())
                        return (
                            <motion.div
                                key={d.getTime()}
                                onClick={() => setBaseDate(d)}
                                whileTap={{ scale: 0.95 }}
                                className={`min-w-[58px] h-14 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer snap-center shrink-0 ${selected
                                    ? 'bg-[#2D5284] border-[#2D5284] shadow-[0_8px_20px_rgba(45,82,132,0.3)]'
                                    : 'bg-white/70 backdrop-blur-md border-white/80 shadow-sm'
                                    } ${before ? 'opacity-40 grayscale' : ''}`}
                            >
                                <span className={`text-[9px] font-black uppercase ${selected ? 'text-white/60' : 'text-slate-400'}`}>
                                    {formatDayName(d)}
                                </span>
                                <span className={`text-[17px] font-black leading-none mt-1 ${selected ? 'text-white' : 'text-[#2D5284]'}`}>{d.getDate()}</span>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Listagem da Agenda - Alta Densidade */}
                <div className="pt-2 space-y-1">
                    <div className="flex justify-between items-center px-2 mb-2">
                        <h2 className="text-[#2D5284] font-black text-[13px] uppercase tracking-widest">Horários</h2>
                        <button className="text-[#D4AF37] text-[11px] font-black uppercase flex items-center gap-1">
                            <Search className="w-3 h-3" /> Filtrar
                        </button>
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {slots.map((slot) => {
                            const isPending = pendingSlotAction === slot.id
                            const isPast = slot.isPast || isPassadoLinear(slot.time)

                            // Cores de classificação
                            let typeColor = 'transparent'
                            let label = ''
                            if (slot.classes === 'urgencia') { typeColor = '#D4AF37'; label = 'Urgência' }
                            else if (slot.classes === 'primeira') { typeColor = '#4ADE80'; label = '1ª Vez' }
                            else if (slot.classes === 'retorno') { typeColor = '#60A5FA'; label = 'Retorno' }

                            return (
                                <motion.div
                                    key={slot.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`relative rounded-[18px] transition-all overflow-hidden ${isPast ? 'bg-slate-200/50 grayscale' :
                                        slot.status === 'bloqueado' ? 'bg-red-50 border border-red-100' :
                                            'bg-white/80 border border-white shadow-sm'
                                        } ${isPending ? 'ring-2 ring-[#D4AF37] scale-[0.98]' : ''}`}
                                >
                                    <div className="flex items-center px-4 py-3 min-h-[64px]">
                                        <div className="w-12 border-r border-slate-100 mr-4 shrink-0">
                                            <span className={`font-black text-[15px] ${isPast ? 'text-slate-400' : 'text-[#2D5284]'}`}>
                                                {slot.time}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {slot.status === 'agendado' && (
                                                <div className="flex justify-between items-center">
                                                    <div className="min-w-0">
                                                        <h3 className="text-[#2D5284] font-black text-[14px] truncate leading-tight">{slot.patientName}</h3>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: typeColor }} />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                                </div>
                                            )}

                                            {slot.status === 'livre' && !isPending && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-300 font-bold text-[13px] tracking-tight">Horário Disponível</span>
                                                    <button className="text-[10px] font-black text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-1 rounded-lg">Bloquear</button>
                                                </div>
                                            )}

                                            {slot.status === 'bloqueado' && !isPending && (
                                                <div className="flex items-center gap-2">
                                                    <X className="w-3.5 h-3.5 text-red-400" />
                                                    <span className="text-red-400 font-bold text-[13px]">Bloqueio Manual</span>
                                                </div>
                                            )}

                                            {isPending && (
                                                <div className="flex items-center justify-between text-[#D4AF37] font-black text-[11px] uppercase tracking-wider animate-pulse">
                                                    <span>Confirmar {slot.status === 'livre' ? 'Bloqueio' : 'Liberar'}?</span>
                                                    <div className="flex gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Barra Inferior de Destaque para Agendados */}
                                    {slot.status === 'agendado' && !isPast && (
                                        <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ backgroundColor: typeColor }} />
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal de Detalhes do Paciente */}
            <AnimatePresence>
                {modalPatient && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-[#2D5284]/60 backdrop-blur-sm">
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[40px] p-6 shadow-2xl h-[70vh] flex flex-col">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Prontuário Rápido</span>
                                    <h2 className="text-[#2D5284] font-black text-2xl leading-tight">{modalPatient.patientName}</h2>
                                    <p className="text-slate-400 font-bold text-[13px] mt-1 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> {modalPatient.time} • {modalPatient.classes === 'urgencia' ? 'Prioridade Máxima' : 'Agendamento Confirmado'}
                                    </p>
                                </div>
                                <button onClick={() => setModalPatient(null)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Status da Consulta</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${modalPatient.classes === 'urgencia' ? 'bg-[#D4AF37]' : 'bg-green-500'}`} />
                                        <span className="text-[#2D5284] font-bold text-[15px]">{modalPatient.classes === 'urgencia' ? 'Urgência Médica' : 'Comparecimento Aguardado'}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Local de Atendimento</span>
                                    <p className="text-[#2D5284] font-bold text-[15px]">{MOCK_LOCAIS.find(l => l.id === selectedLocalId)?.nome}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Histórico Recente</span>
                                    <p className="text-slate-500 text-[13px] mt-1 leading-relaxed italic">"Paciente relatando dores moderadas nas articulações durante a última semana. Solicitado check-up completo."</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 bg-[#2D5284] py-4 rounded-xl text-white font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all">
                                    Exame/Histórico
                                </button>
                                <button onClick={() => setModalPatient(null)} className="flex-1 bg-[#D4AF37] py-4 rounded-xl text-white font-black uppercase text-[12px] tracking-widest shadow-[0_4px_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all">
                                    Atender Agora
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNavMedico />
        </div>
    )
}

// --- Componentes Auxiliares (Fora do AgendaDoDiaPage para Performance) ---

interface CalendarModalProps {
    isOpen: boolean
    viewDate: Date
    setViewDate: (d: Date) => void
    baseDate: Date
    setBaseDate: (d: Date) => void
    onClose: () => void
    isBlockingMode: boolean
    setIsBlockingMode: (b: boolean) => void
    rangeStart: Date | null
    setRangeStart: (d: Date | null) => void
    rangeEnd: Date | null
    setRangeEnd: (d: Date | null) => void
    alert: any
    setAlert: (a: any) => void
    showMonthYearPicker: boolean
    setShowMonthYearPicker: (b: boolean) => void
    selectedLocalId: string
    slotsCorrentes: any
}

const CustomCalendarModal = ({ 
    isOpen, viewDate, setViewDate, baseDate, setBaseDate, onClose, 
    isBlockingMode, setIsBlockingMode, rangeStart, setRangeStart, 
    rangeEnd, setRangeEnd, alert, setAlert, showMonthYearPicker, 
    setShowMonthYearPicker, selectedLocalId, slotsCorrentes 
}: CalendarModalProps) => {
    
    const viewYear = viewDate.getFullYear()
    const viewMonth = viewDate.getMonth()
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    const monthsName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const isPastMonth = viewYear < currentYear || (viewYear === currentYear && viewMonth < currentMonth)
    
    // Helpers internos (pode mover para fora se quiser)
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()
    const isSameDate = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

    const daysCount = getDaysInMonth(viewYear, viewMonth)
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
    const days = Array.from({ length: daysCount }, (_, i) => i + 1)
    const blanks = Array.from({ length: firstDay }, (_, i) => i)

    const handlePrevMonth = () => { if (!isPastMonth) setViewDate(new Date(viewYear, viewMonth - 1, 1)) }
    const handleNextMonth = () => { setViewDate(new Date(viewYear, viewMonth + 1, 1)) }

    const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

    const handleGoToday = () => {
        const agora = new Date()
        setViewDate(agora)
        if (!isBlockingMode) {
            setBaseDate(agora)
            onClose()
        }
    }

    const handleDayClick = (d: number) => {
        const selectedDate = new Date(viewYear, viewMonth, d)
        if (!isBlockingMode) {
            setBaseDate(selectedDate)
            onClose()
            return
        }
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(selectedDate)
            setRangeEnd(null)
        } else {
            if (selectedDate < rangeStart) setRangeStart(selectedDate)
            else setRangeEnd(selectedDate)
        }
    }

    const isInRange = (d: number) => {
        if (!rangeStart || !rangeEnd) return false
        const check = new Date(viewYear, viewMonth, d)
        return check > rangeStart && check < rangeEnd
    }

    const handleBlockAction = (type: 'dia' | 'periodo') => {
        const targetDays = type === 'dia' ? (rangeStart ? [rangeStart] : []) : []
        if (type === 'periodo' && rangeStart && rangeEnd) {
            let curr = new Date(rangeStart)
            while (curr <= rangeEnd) {
                targetDays.push(new Date(curr))
                curr.setDate(curr.getDate() + 1)
            }
        }
        if (targetDays.length === 0) return

        const daySlots = slotsCorrentes[selectedLocalId] || []
        const hasAppointments = targetDays.some(date => {
            return daySlots.some((s: any) => s.status === 'agendado')
        })

        if (hasAppointments) {
            setAlert({
                title: "Atenção: Conflito de Agenda",
                message: "Não é possível bloquear este período pois já existem consultas agendadas.",
                type: 'error'
            })
            return
        }

        setAlert({
            title: "Confirmar Bloqueio",
            message: `Deseja realmente bloquear o ${type === 'dia' ? 'dia' : 'período'} selecionado?`,
            type: 'confirm',
            onConfirm: () => { setAlert(null); onClose() }
        })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A365D]/80 backdrop-blur-md px-4"
                onClick={() => { if (!alert) onClose() }}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} 
                    className="bg-[#2D5284] w-full max-w-sm rounded-[32px] p-6 shadow-[0_12px_60px_rgba(0,0,0,0.6)] border border-white/20 relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AnimatePresence>
                        {alert && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className={`absolute inset-0 z-[120] flex items-center justify-center p-8 ${alert.type === 'error' ? 'bg-[#FEFCE8]' : 'bg-[#F8FAFC]'}`}
                            >
                                <div className={`text-center w-full ${alert.type === 'error' ? 'border-2 border-[#D4AF37]/50 p-6 rounded-[32px]' : ''}`}>
                                    <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
                                        {alert.type === 'error' ? <AlertCircle className="w-7 h-7" /> : <CalendarDays className="w-7 h-7" />}
                                    </div>
                                    <h4 className="text-[#1A365D] font-black text-lg mb-2 tracking-tight">{alert.title}</h4>
                                    <p className="text-slate-500 text-[13px] leading-relaxed mb-8 px-4 font-medium">{alert.message}</p>
                                    <div className="flex flex-col gap-3">
                                        {alert.type === 'confirm' ? (
                                            <>
                                                <button onClick={alert.onConfirm} className="w-full py-3.5 bg-[#D4AF37] rounded-xl text-[#1A365D] font-black uppercase text-[11px] tracking-widest active:scale-95 shadow-md">Confirmar</button>
                                                <button onClick={() => setAlert(null)} className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold uppercase text-[10px] tracking-widest active:scale-95">Voltar</button>
                                            </>
                                        ) : (
                                            <button onClick={() => setAlert(null)} className="w-full py-3.5 bg-[#1A365D] rounded-xl text-white font-black uppercase text-[11px] tracking-widest active:scale-95">Entendido</button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header do Calendário */}
                    <div className="relative flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={handlePrevMonth} disabled={isPastMonth}
                                className={`p-2 rounded-xl text-white transition-all ${isPastMonth ? 'opacity-10' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleGoToday}
                                className="h-7 px-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] font-black text-[9px] uppercase tracking-widest active:scale-90 transition-all focus:outline-none"
                            >
                                Hoje
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setShowMonthYearPicker(true)}
                            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group active:scale-95 transition-transform"
                        >
                            <h3 className="font-black text-white text-[15px] group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none whitespace-nowrap">
                                {monthsName[viewMonth]} <span className="text-white/40">{viewYear}</span>
                            </h3>
                        </button>

                        <button onClick={handleNextMonth} className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                        <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {blanks.map(i => <div key={`empty-${i}`} />)}
                        {days.map(d => {
                            const checkDate = new Date(viewYear, viewMonth, d)
                            const isSelected = isSameDate(checkDate, baseDate)
                            const isDayPast = viewYear === currentYear && viewMonth === currentMonth && d < today.getDate()
                            const isStart = rangeStart && isSameDate(checkDate, rangeStart)
                            const isEnd = rangeEnd && isSameDate(checkDate, rangeEnd)
                            const inRange = isInRange(d)
                            return (
                                <button
                                    key={d} disabled={isDayPast} onClick={() => handleDayClick(d)}
                                    className={`h-9 rounded-full text-[13px] font-bold flex items-center justify-center transition-all relative
                                        ${isSelected ? 'border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]' : ''}
                                        ${isStart || isEnd ? 'bg-[#D4AF37] text-[#2D5284] z-10 scale-105' : inRange ? 'bg-[#D4AF37]/20 text-white' : 'text-white/80 hover:bg-white/10 active:scale-90'}
                                        ${isDayPast ? 'opacity-10 grayscale pointer-events-none' : ''}`}
                                >
                                    {d}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-8">
                        {!isBlockingMode ? (
                            <button 
                                onClick={() => { setIsBlockingMode(true); setRangeStart(null); setRangeEnd(null) }}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <TrendingUp className="w-4 h-4 opacity-50" /> Gerenciar Bloqueios
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <button onClick={() => handleBlockAction('dia')} disabled={!rangeStart} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-20">Bloquear Dia</button>
                                    <button onClick={() => handleBlockAction('periodo')} disabled={!rangeStart || !rangeEnd} className="flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-[#D4AF37] font-black uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-20">Bloquear Período</button>
                                </div>
                                <button onClick={onClose} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-black uppercase text-[9px] tracking-widest active:scale-95">Cancelar Bloqueio</button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

const WorkScheduleModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [selectedLocation, setSelectedLocation] = useState('1')
    
    // Estados complexos vindos da versão "perfeita"
    const [duration, setDuration] = useState('30')
    const [availability, setAvailability] = useState<Record<string, {id: string, start: string, end: string}[]>>({
        'Segunda': [{ id: '1', start: '08:00', end: '12:00' }, { id: '2', start: '13:00', end: '18:00' }],
        'Terça': [{ id: '3', start: '08:00', end: '12:00' }],
        'Quarta': [{ id: '4', start: '08:00', end: '12:00' }, { id: '5', start: '13:00', end: '18:00' }],
        'Quinta': [{ id: '6', start: '08:00', end: '12:00' }],
        'Sexta': [{ id: '7', start: '08:00', end: '18:00' }],
        'Sábado': [],
        'Domingo': []
    })
    
    const [blocks, setBlocks] = useState([
        { id: 'b1', title: 'Feriado Municipal', type: 'dia', startDate: '2024-04-12' }
    ])

    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1A365D]/95 backdrop-blur-xl px-4 overflow-y-auto pt-20 pb-10"
                onClick={onClose}
            >
                {/* Fog Animations de Fundo para Estética Glass */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
                    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white rounded-full blur-[120px]" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/20 rounded-full blur-[120px]" />
                </div>

                <motion.div 
                    initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} 
                    className="bg-white/5 w-full max-w-2xl rounded-[48px] shadow-[0_25px_100px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Premium do Modal */}
                    <div className="p-10 pb-6 relative">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.25em]">Painel de Gestão</p>
                                </div>
                                <h3 className="text-white text-3xl font-black tracking-tight leading-none">Configuração de <span className="text-[#D4AF37]">Expediente</span></h3>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Seletor de Local Customizado */}
                        <div className="flex gap-2 p-2 bg-black/20 rounded-[24px] border border-white/5 shadow-inner">
                            {MOCK_LOCAIS.map(l => (
                                <button 
                                    key={l.id} 
                                    onClick={() => setSelectedLocation(l.id)}
                                    className={`flex-1 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${selectedLocation === l.id ? 'bg-white text-[#1A365D] shadow-lg scale-[1.02]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    {l.nome}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conteúdo Scrollável */}
                    <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-10 max-h-[65vh] no-scrollbar">
                        
                        {/* Seção: Duração */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <Clock className="w-5 h-5 text-[#D4AF37]" />
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Duração da Consulta</h4>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {['15', '30', '45', '60'].map(dur => (
                                    <button 
                                        key={dur} 
                                        onClick={() => setDuration(dur)}
                                        className={`py-5 rounded-2xl border transition-all flex flex-col items-center justify-center ${duration === dur ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <span className={`text-xl font-black ${duration === dur ? 'text-[#1A365D]' : 'text-white'}`}>{dur}</span>
                                        <span className={`text-[9px] uppercase font-bold tracking-widest ${duration === dur ? 'text-[#1A365D]/60' : 'text-white/40'}`}>Min</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Seção: Grade Semanal */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">Grade de Atendimento</h4>
                            </div>
                            
                            <div className="space-y-4">
                                {diasSemana.map(day => (
                                    <div key={day} className="p-6 bg-white/5 border border-white/10 rounded-[32px] transition-all hover:bg-white/[0.07] group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase transition-all ${availability[day].length > 0 ? 'bg-[#D4AF37] text-[#1A365D] shadow-[0_4px_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 text-white/20'}`}>
                                                    {day.substring(0, 3)}
                                                </div>
                                                <div>
                                                    <h5 className="text-white font-bold text-base">{day}</h5>
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                                        {availability[day].length > 0 ? `${availability[day].length} Faixas Definidas` : 'Folga / Sem Atendimento'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={availability[day].length > 0} onChange={() => {}} />
                                                <div className="w-14 h-8 bg-white/10 rounded-full peer peer-checked:after:translate-x-[24px] peer-checked:after:bg-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#D4AF37] shadow-inner"></div>
                                            </label>
                                        </div>

                                        {availability[day].length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                                {availability[day].map((slot, idx) => (
                                                    <div key={slot.id} className="flex items-center gap-3">
                                                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                                            <span className="text-white font-black text-sm">{slot.start}</span>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <span className="text-white font-black text-sm">{slot.end}</span>
                                                        </div>
                                                        <button className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button className="w-full py-4 bg-white/5 border border-white/10 border-dashed rounded-2xl text-[10px] font-black text-[#D4AF37] hover:bg-white/10 uppercase tracking-[0.2em] transition-all">
                                                    + Adicionar Período
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Seção: Regas de Bloqueio */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <CalendarX2 className="w-5 h-5 text-red-500" />
                                <h4 className="text-white font-black text-sm uppercase tracking-widest text-red-500/80">Exceções e Bloqueios</h4>
                            </div>
                            
                            <div className="space-y-4">
                                {blocks.map(block => (
                                    <div key={block.id} className="p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
                                                <CalendarX2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-bold text-sm">{block.title}</h5>
                                                <p className="text-red-400/50 text-[10px] font-black uppercase tracking-widest">{block.startDate}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-white/20 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-4 bg-red-500/10 border border-red-500/20 border-dashed rounded-2xl text-[10px] font-black text-red-400 hover:bg-red-500/20 uppercase tracking-[0.2em] transition-all">
                                    + Adicionar Bloqueio Rápido
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-10 pt-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
                        <button 
                            onClick={() => {
                                toast.success('Expediente atualizado com sucesso!', {
                                    style: { background: '#1A365D', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                                })
                                onClose()
                            }}
                            className="w-full py-5 bg-[#D4AF37] text-[#1A365D] rounded-[24px] font-black uppercase text-[12px] tracking-widest active:scale-[0.98] transition-all shadow-[0_15px_40px_rgba(212,175,55,0.3)] hover:brightness-110"
                        >
                            Confirmar e Salvar Expediente
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
