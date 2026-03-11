'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Video, Zap, Star, ShieldCheck, Filter, Building2, ChevronLeft, ChevronRight, Slash } from 'lucide-react'
import { medicosMock } from '@/data/mockData'
import { toast } from 'sonner'

type SelectedSlotType = { time: string, price: string, isFast: boolean } | null;

export default function AgendarPage() {
    const router = useRouter()
    const params = useParams()

    const medicoId = params?.id as string || 'med_001'
    const medico = medicosMock.find(m => m.id === medicoId) || medicosMock[0]

    // Locais disponíveis
    const locais = useMemo(() => [
        { id: 'clinic', name: 'Consultório Principal', address: `${medico.endereco_consultorio.logradouro}, ${medico.endereco_consultorio.numero} - ${medico.endereco_consultorio.bairro}, ${medico.endereco_consultorio.cidade}`, icon: Building2 },
        { id: 'tele', name: 'Telemedicina', address: 'Atendimento Online', icon: Video }
    ], [medico])

    const [selectedLocal, setSelectedLocal] = useState(locais[0])

    const todayDate = useMemo(() => new Date(), [])
    const currentHourString = `${todayDate.getHours().toString().padStart(2, '0')}:${todayDate.getMinutes().toString().padStart(2, '0')}`

    const nomesDias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const nomesMesesCompleto = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Renderiza exatamente 10 dias disponíveis do médico
    const nextDays = useMemo(() => {
        const days = [];
        let curDate = new Date(todayDate);
        let iterations = 0;

        while (days.length < 10 && iterations < 90) { // Limitador de segurança
            const medicoAtende = medico.horarios_disponiveis.some(h => h.dia_semana === curDate.getDay());

            if (medicoAtende) {
                const isToday = curDate.toDateString() === todayDate.toDateString();
                const isTomorrow = new Date(todayDate.getTime() + 86400000).toDateString() === curDate.toDateString();

                days.push({
                    dia_semana: curDate.getDay(),
                    label: isToday ? 'Hoje' : isTomorrow ? 'Amanhã' : nomesDias[curDate.getDay()],
                    dateText: `${curDate.getDate()} ${nomesMeses[curDate.getMonth()]}`,
                    fullDate: new Date(curDate)
                });
            }
            curDate.setDate(curDate.getDate() + 1);
            iterations++;
        }
        return days;
    }, [medico, todayDate]);

    const [selectedDay, setSelectedDay] = useState(nextDays.length > 0 ? nextDays[0] : null)
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlotType>(null)
    const [showFullCalendar, setShowFullCalendar] = useState(false)

    // Lógica para Modal do Calendário Mês a Mês
    const [calendarMonthStart, setCalendarMonthStart] = useState(() => {
        return new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
    })

    const prevMonth = () => {
        const nextTarget = new Date(calendarMonthStart.getFullYear(), calendarMonthStart.getMonth() - 1, 1);
        if (nextTarget >= new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)) {
            setCalendarMonthStart(nextTarget)
        }
    }
    const nextMonth = () => setCalendarMonthStart(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

    const calendarDays = useMemo(() => {
        const year = calendarMonthStart.getFullYear();
        const month = calendarMonthStart.getMonth();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayIndex; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
        return days;
    }, [calendarMonthStart]);

    // Filtrar horários ultrapassados se for hoje
    const availableSlots = useMemo(() => {
        const baseSlots = [
            { time: '09:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '10:30', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '14:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '16:30', price: `R$ ${medico.valor_consulta + 50}`, isFast: true },
            { time: '18:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '19:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '21:30', price: `R$ ${medico.valor_consulta}`, isFast: false },
            { time: '22:30', price: `R$ ${medico.valor_consulta}`, isFast: false },
        ]

        if (!selectedDay) return []

        if (selectedDay.label === 'Hoje') {
            return baseSlots.filter(s => s.time >= currentHourString)
        }
        return baseSlots
    }, [medico, selectedDay, currentHourString])

    useEffect(() => {
        // Zera a seleção se trocar de dia ou lugar
        setSelectedSlot(null)
    }, [selectedDay, selectedLocal])

    const handleConfirmar = () => {
        if (!selectedSlot || !selectedDay) return
        toast.success(`Agendado com ${medico.nome} p/ ${selectedDay.dateText} às ${selectedSlot.time} (${selectedLocal.name})!`)
        setSelectedSlot(null)
        setTimeout(() => router.push('/dashboard'), 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            <header className="px-5 pt-4 pb-12 bg-[#2D5284] rounded-b-3xl relative shadow-md z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Agendar Consulta</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')}>
                            <Star strokeWidth={2} className="w-[18px] h-[18px] opacity-0 absolute pointer-events-none" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px] leading-none">Match</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-5 -mt-4 relative z-20 mb-6">
                <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden group">
                    <div className="w-20 h-20 rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden shrink-0 z-10">
                        <img src={medico.foto_url} alt={medico.nome} className="w-full h-full object-cover" />
                    </div>
                    <div className="z-10 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <h2 className="text-[#1A365D] font-bold text-[16px] leading-tight line-clamp-1">{medico.nome}</h2>
                            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium tracking-wide mb-2">{medico.especialidade}</p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-amber-700 text-[12px] font-bold">{medico.avaliacao}</span>
                            </div>
                            <span className="text-slate-300 text-xs">•</span>
                            <p className="text-slate-500 text-[12px] font-medium">{medico.total_avaliacoes} aval.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELEÇÃO DO LOCAL DE ATENDIMENTO */}
            <div className="px-5 mb-8">
                <h3 className="text-[#1A365D] font-bold text-[16px] mb-3">Local de Atendimento</h3>
                <div className="flex flex-col gap-3">
                    {locais.map(local => {
                        const Icon = local.icon;
                        const isSelected = selectedLocal.id === local.id;
                        return (
                            <button
                                key={local.id}
                                onClick={() => setSelectedLocal(local)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${isSelected
                                    ? 'bg-blue-50/60 border-[#2D5284] shadow-sm ring-1 ring-[#2D5284]/10'
                                    : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2D5284]' : 'bg-slate-100'}`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                    <p className={`font-bold text-[14px] ${isSelected ? 'text-[#1A365D]' : 'text-slate-700'}`}>{local.name}</p>
                                    <p className={`text-[12px] ${isSelected ? 'text-[#2D5284]/70' : 'text-slate-500'}`}>{local.address}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* CARROSSEL DE DATAS DISPONÍVEIS */}
            <div className="px-5 mb-8">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-[#1A365D] font-bold text-[16px]">Escolha a Data</h3>
                </div>
                <div className="flex gap-3 pb-2 overflow-x-auto no-scrollbar snap-x">
                    {nextDays.map((dia, idx) => {
                        const isSelected = selectedDay?.dateText === dia.dateText;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(dia)}
                                className={`snap-start shrink-0 flex flex-col items-center justify-center min-w-[75px] h-[90px] rounded-[20px] transition-all border ${isSelected
                                    ? 'bg-[#2D5284] border-[#2D5284] shadow-md shadow-[#2D5284]/20 scale-105'
                                    : 'bg-white border-slate-200 hover:border-slate-300 active:scale-95'
                                    }`}
                            >
                                <span className={`text-[11px] font-semibold mb-1 tracking-wide ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                                    {dia.label}
                                </span>
                                <span className={`text-[18px] font-black leading-none ${isSelected ? 'text-white' : 'text-[#1A365D]'}`}>
                                    {dia.dateText.split(' ')[0]}
                                </span>
                                <span className={`text-[11px] font-medium mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                    {dia.dateText.split(' ')[1]}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-3 flex justify-center">
                    <button
                        onClick={() => setShowFullCalendar(true)}
                        className="flex items-center gap-2 text-[12px] font-bold text-[#2D5284] bg-[#2D5284]/5 px-5 py-2.5 rounded-full border border-[#2D5284]/10 hover:bg-[#2D5284]/10 transition-colors"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Ver Calendário Completo
                    </button>
                </div>
            </div>

            {/* HORÁRIOS FILTRADOS */}
            <div className="px-5 space-y-4 mb-24">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-[#1A365D] font-bold text-[16px]">Horários Disponíveis</h3>
                    <button className="text-[#2D5284] flex items-center gap-1 text-sm font-medium"><Filter className="w-4 h-4" /> Filtro</button>
                </div>

                {availableSlots.length === 0 ? (
                    <div className="bg-slate-100 rounded-2xl p-6 text-center border border-slate-200/60">
                        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 font-medium text-[13px]">Nenhum horário disponível pro resto deste dia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot) => (
                            <button
                                key={slot.time}
                                onClick={() => setSelectedSlot(slot)}
                                className={`relative rounded-[20px] p-4 border transition-all active:scale-95 text-left flex flex-col justify-between h-[115px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${selectedSlot?.time === slot.time
                                    ? 'bg-[#2D5284] border-[#2D5284]'
                                    : slot.isFast
                                        ? 'bg-amber-50/50 border-amber-200 ring-1 ring-amber-100 hover:bg-amber-50'
                                        : 'bg-white border-slate-100 hover:border-[#2D5284]/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${selectedSlot?.time === slot.time ? 'text-white/70' : slot.isFast ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {selectedDay?.label.substring(0, 4)} • {selectedDay?.dateText.split(' ')[0]}
                                        </span>
                                        <span className={`text-2xl font-black ${selectedSlot?.time === slot.time ? 'text-white' : slot.isFast ? 'text-amber-700' : 'text-[#1A365D]'}`}>{slot.time}</span>
                                    </div>
                                    {slot.isFast && <Zap className={`w-5 h-5 ${selectedSlot?.time === slot.time ? 'text-amber-300 fill-amber-300' : 'text-amber-500 fill-amber-500'}`} />}
                                </div>

                                {slot.isFast ? (
                                    <div className={`text-[10px] font-bold px-3 py-1.5 rounded-xl self-start flex items-center justify-center gap-1 mt-2 w-full uppercase shadow-sm ${selectedSlot?.time === slot.time ? 'bg-amber-400 text-amber-900 border-amber-300 shadow-amber-900/10' : 'bg-[#D4AF37] text-white shadow-[#D4AF37]/20'}`}>
                                        <Zap className="w-3.5 h-3.5 fill-current" /> SLOT RÁPIDO
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedSlot?.time === slot.time ? 'bg-emerald-300' : 'bg-emerald-400'}`}></div>
                                        <span className={`text-[12px] font-semibold ${selectedSlot?.time === slot.time ? 'text-emerald-100' : 'text-slate-500'}`}>{slot.price}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Banner Monetização */}
            <div className="px-5 mb-10">
                <div className="bg-gradient-to-br from-[#1A365D] to-[#2D5284] rounded-[24px] p-5 shadow-lg shadow-[#1A365D]/20 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-[14px] leading-tight mb-1">Assine o Prime Match</h4>
                        <p className="text-white/70 text-[11px] leading-snug">Tenha acesso a slots rápidos ilimitados, telemedicina e prioridade máxima 24/7.</p>
                    </div>
                </div>
            </div>

            {/* CONFIRMAÇÃO BOTTOM SHEET */}
            {selectedSlot && selectedDay && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedSlot(null)}></div>
                    <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 pt-4 animate-in slide-in-from-bottom-[100%] duration-300">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

                        <h3 className="text-[#1A365D] font-black text-xl mb-6 text-center">Confirmar Agendamento</h3>

                        <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-4 mb-6 relative overflow-hidden">
                            {selectedSlot.isFast && (
                                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase flex items-center gap-1 z-10">
                                    <Zap className="w-3 h-3 fill-current" /> Slot Rápido
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200/60">
                                <img src={medico.foto_url} alt={medico.nome} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                                <div>
                                    <h4 className="text-[#1A365D] font-bold text-[15px]">{medico.nome}</h4>
                                    <p className="text-slate-500 text-[12px]">{medico.especialidade}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <CalendarIcon className="w-4 h-4 text-[#2D5284]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Data e Horário</span>
                                            <span className="text-[#1A365D] text-[13px] font-bold">{selectedDay.dateText} às {selectedSlot.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Local</span>
                                            <span className="text-[#1A365D] text-[13px] font-bold">{selectedLocal.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Valor</span>
                                            <span className="text-[#1A365D] text-[13px] font-bold">{selectedSlot.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="flex-[0.8] py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 font-bold active:scale-95 transition-all text-[15px]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmar}
                                className="flex-[2] py-3.5 rounded-xl bg-[#2D5284] text-white font-bold shadow-lg shadow-[#2D5284]/30 hover:brightness-110 active:scale-95 transition-all text-[15px]"
                            >
                                Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* FULL CALENDAR Modal */}
            {showFullCalendar && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowFullCalendar(false)}></div>
                    <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 pt-4 animate-in slide-in-from-bottom-[100%] duration-300 h-[85vh] flex flex-col">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>

                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-[#1A365D] font-black text-xl">Selecionar Data</h3>
                            <button onClick={() => setShowFullCalendar(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                        </div>

                        {/* Navigation do Mês Atual */}
                        <div className="flex items-center justify-between mb-6 shrink-0 border-b border-slate-100 pb-4">
                            <button
                                onClick={prevMonth}
                                disabled={calendarMonthStart <= new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)}
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#2D5284] hover:bg-[#2D5284]/5 disabled:opacity-30 disabled:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h4 className="text-[#1A365D] font-bold text-[16px] uppercase tracking-wide">
                                {nomesMesesCompleto[calendarMonthStart.getMonth()]} {calendarMonthStart.getFullYear()}
                            </h4>
                            <button
                                onClick={nextMonth}
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#2D5284] hover:bg-[#2D5284]/5 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Corpo do Calendário Fixo Mês */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-2">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                    <div key={i} className="text-center text-[12px] font-bold text-slate-400">{d}</div>
                                ))}

                                {calendarDays.map((date, idx) => {
                                    if (!date) return <div key={`empty-${idx}`} className="text-center py-2 text-transparent">_</div>;

                                    const dayNum = date.getDate();
                                    const isPast = date.getTime() < new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()).getTime();
                                    const isToday = date.toDateString() === todayDate.toDateString();
                                    const medicoAtende = medico.horarios_disponiveis.some(h => h.dia_semana === date.getDay());
                                    const isDisabled = isPast || !medicoAtende;

                                    return (
                                        <div key={dayNum} className="flex justify-center items-center">
                                            <button
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    // Procure o target em nextDays, se não tiver tem que injetar.
                                                    // Para fins práticos setamos hard set na selection se for válido
                                                    const targetFormat = {
                                                        dia_semana: date.getDay(),
                                                        label: isToday ? 'Hoje' : nomesDias[date.getDay()],
                                                        dateText: `${date.getDate()} ${nomesMeses[date.getMonth()]}`,
                                                        fullDate: date
                                                    }
                                                    setSelectedDay(targetFormat);
                                                    setShowFullCalendar(false);
                                                }}
                                                className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-[15px] transition-all relative ${isToday
                                                    ? 'bg-[#2D5284] text-white shadow-md shadow-[#2D5284]/30 font-bold border-2 border-[#2D5284]'
                                                    : isDisabled
                                                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed font-medium'
                                                        : 'text-[#1A365D] font-bold hover:bg-blue-50 hover:text-[#2D5284] border border-transparent hover:border-blue-100 active:scale-95'
                                                    }`}
                                            >
                                                {isDisabled && !isPast && (
                                                    <Slash className="w-full h-full text-slate-300 absolute inset-0 rotate-12 scale-[0.6] opacity-40 mix-blend-multiply" strokeWidth={1} />
                                                )}
                                                <span className="z-10">{dayNum}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
