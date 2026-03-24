'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    ArrowLeft, Clock, Search, MapPin, CalendarDays, X, 
    CheckCircle2, ChevronRight, ChevronDown, ChevronLeft,
    TrendingUp, Calendar
} from 'lucide-react'
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] font-sans pb-32 relative">
            <header className="px-5 pt-8 pb-12 relative z-40 bg-[#2D5284] shadow-[0_12px_30px_rgba(45,82,132,0.2)] rounded-b-[36px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-black text-xl tracking-tight uppercase">Minha Agenda</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.1)] active:scale-95 transition-all group"
                        >
                            <Clock className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                            <span className="text-[#D4AF37] font-black text-[11px] uppercase tracking-widest mt-0.5">Expediente</span>
                        </button>
                    </div>
                </div>

                <div className="relative z-10 mt-2">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Visualização do Dia</p>
                    <div className="flex items-center gap-2">
                        <span className="text-white text-3xl font-black">{baseDate.getDate()}</span>
                        <div className="flex flex-col">
                            <span className="text-[#D4AF37] text-[12px] font-black uppercase leading-none">{monthsName[baseDate.getMonth()]}</span>
                            <span className="text-white/80 text-[12px] font-bold leading-none mt-0.5">{formatDayName(baseDate)}</span>
                        </div>
                    </div>
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
                                className={`min-w-[58px] h-14 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer snap-center shrink-0 ${
                                    selected
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
                                    className={`relative rounded-[18px] transition-all overflow-hidden ${
                                        isPast ? 'bg-slate-200/50 grayscale' : 
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
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-end justify-center bg-[#2D5284]/60 backdrop-blur-sm">
                        <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="bg-white w-full rounded-t-[40px] p-6 shadow-2xl h-[70vh] flex flex-col">
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
                                    <p className="text-[#2D5284] font-bold text-[15px]">{MOCK_LOCAIS.find(l=>l.id===selectedLocalId)?.nome}</p>
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
                                <button onClick={()=>setModalPatient(null)} className="flex-1 bg-[#D4AF37] py-4 rounded-xl text-white font-black uppercase text-[12px] tracking-widest shadow-[0_4px_15px_rgba(212,175,55,0.3)] active:scale-95 transition-all">
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
