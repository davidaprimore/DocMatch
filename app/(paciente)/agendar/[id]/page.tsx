"use client"

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDialog } from '@/components/ui/CustomDialog'
import { Building2, Video, Star, ShieldCheck, MapPin, Calendar as CalendarIcon, Filter, Clock, Zap, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useConfetti } from '@/hooks/useConfetti'
import { cn } from '@/lib/utils'

type SelectedSlotType = { time: string, price: string, isFast: boolean } | null;
type DayInfo = { dia_semana: number; label: string; dateText: string; fullDate: Date; };

export default function AgendarPage() {
    const router = useRouter()
    const { showDialog } = useDialog()
    const params = useParams()
    const { user } = useAuth()
    
    const [medico, setMedico] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        async function fetchMedico() {
            try {
                const { data, error } = await supabase
                    .from('medicos')
                    .select('*, especialidade:especialidades(*)')
                    .eq('id', params?.id)
                    .single()

                if (error) throw error
                setMedico(data)
            } catch (err) {
                console.error('Erro ao buscar médico:', err)
            } finally {
                setIsLoading(false)
            }
        }
        if (params?.id) fetchMedico()
    }, [params?.id])

    const todayDate = useMemo(() => new Date(), [])
    const currentHourString = `${todayDate.getHours().toString().padStart(2, '0')}:${todayDate.getMinutes().toString().padStart(2, '0')}`

    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const nomesMesesCompleto = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Locais disponíveis — monta incluindo o segundo consultório, se existir
    const locais = useMemo(() => {
        if (!medico) return []
        const list = [
            {
                id: 'clinic1',
                name: 'Consultório Principal',
                address: medico.endereco?.logradouro ? `${medico.endereco.logradouro}, ${medico.endereco.numero}` : 'Endereço não informado',
                icon: Building2,
                horarios: [
                    { dia_semana: 1, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                    { dia_semana: 2, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                    { dia_semana: 3, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                    { dia_semana: 4, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                    { dia_semana: 5, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                ],
            }
        ]
        list.push({
            id: 'tele',
            name: 'Telemedicina',
            address: 'Atendimento Online',
            icon: Video,
            horarios: [
                { dia_semana: 1, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                { dia_semana: 2, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                { dia_semana: 3, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                { dia_semana: 4, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
                { dia_semana: 5, slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'] },
            ],
        })
        return list
    }, [medico])

    const [selectedLocal, setSelectedLocal] = useState(locais[0])

    // Ao trocar local, atualiza qual horarios usar
    const horariosLocal = selectedLocal?.horarios || []

    // Gera 10 próximos dias disponíveis para o local selecionado
    const nextDays = useMemo((): DayInfo[] => {
        const days: DayInfo[] = [];
        let curDate = new Date(todayDate);
        let iters = 0;
        while (days.length < 10 && iters < 90) {
            const atende = horariosLocal.some((h: any) => h.dia_semana === curDate.getDay());
            if (atende) {
                const isToday = curDate.toDateString() === todayDate.toDateString();
                const tomorrow = new Date(todayDate); tomorrow.setDate(todayDate.getDate() + 1);
                const isTomorrow = curDate.toDateString() === tomorrow.toDateString();
                days.push({
                    dia_semana: curDate.getDay(),
                    label: isToday ? 'Hoje' : isTomorrow ? 'Amanhã' : nomesDias[curDate.getDay()],
                    dateText: `${curDate.getDate()} ${nomesMeses[curDate.getMonth()]}`,
                    fullDate: new Date(curDate),
                });
            }
            curDate.setDate(curDate.getDate() + 1);
            iters++;
        }
        return days;
    }, [horariosLocal, todayDate]);

    const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)

    // Atualiza dia selecionado quando o local muda
    useEffect(() => {
        setSelectedDay(nextDays.length > 0 ? nextDays[0] : null)
        setSelectedSlot(null)
    }, [selectedLocal, nextDays])

    const [selectedSlot, setSelectedSlot] = useState<SelectedSlotType>(null)
    const [showFullCalendar, setShowFullCalendar] = useState(false)
    const [calendarMonthStart, setCalendarMonthStart] = useState(() => new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))

    const prevMonth = () => {
        const minMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
        const target = new Date(calendarMonthStart.getFullYear(), calendarMonthStart.getMonth() - 1, 1)
        if (target >= minMonth) setCalendarMonthStart(target)
    }
    const nextMonth = () => setCalendarMonthStart(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

    const calendarDays = useMemo(() => {
        const year = calendarMonthStart.getFullYear()
        const month = calendarMonthStart.getMonth()
        const firstDayIdx = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days: (Date | null)[] = []
        for (let i = 0; i < firstDayIdx; i++) days.push(null)
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
        return days
    }, [calendarMonthStart])

    const allSlots = medico ? [
        { time: '08:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '09:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '10:30', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '14:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '16:30', price: `R$ ${medico.valor_consulta + 50}`, isFast: true },
        { time: '18:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '19:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
    ] : []

    const availableSlots = useMemo(() => {
        if (!selectedDay) return []
        if (selectedDay.label === 'Hoje') return allSlots.filter(s => s.time > currentHourString)
        return allSlots
    }, [selectedDay, currentHourString, allSlots])

    const { trackEvent } = useAnalytics()
    const { fireCelebration } = useConfetti()

    useEffect(() => {
        if (medico) {
            trackEvent('view_doctor_profile', { medico_id: medico.id, medico_nome: medico.nome })
        }
    }, [medico, trackEvent])

    const handleConfirmar = async () => {
        if (!selectedSlot || !selectedDay || !medico || isSaving) return
        
        setIsSaving(true)
        try {
            // Prepara a data combinada
            const [hours, minutes] = selectedSlot.time.split(':')
            const appointmentDate = new Date(selectedDay.fullDate)
            appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

            const { error } = await supabase
                .from('agendamentos')
                .insert({
                    paciente_id: user?.id,
                    medico_id: medico.id,
                    data_horario: appointmentDate.toISOString(),
                    status: 'pendente'
                })

            if (error) throw error

            // Tracking de conversão
            trackEvent('complete_booking', {
                medico_id: medico.id,
                valor: selectedSlot.price,
                modalidade: selectedLocal.name
            })

            // Efeito Visual de Sucesso
            fireCelebration()

            showDialog({
                title: 'Consulta Agendada!',
                message: `Tudo certo! Seu atendimento com ${medico.nome} foi confirmado para ${selectedDay.dateText} às ${selectedSlot.time} (${selectedLocal.name}).`,
                type: 'success',
                onConfirm: () => router.push('/consultas')
            })
            
            setSelectedSlot(null)
        } catch (err) {
            console.error('Erro ao agendar:', err)
            showDialog({
                title: 'Erro ao Agendar',
                message: 'Não foi possível confirmar seu agendamento. Por favor, tente novamente.',
                type: 'error'
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Glass card class reutilizável
    const glassCard = `bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)]`

    if (isLoading || !medico) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2D5284] animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-20 font-sans">
            {/* HEADER PADRONIZADO */}
            <Header showBackButton showNotifications userAvatar={user?.foto || undefined} userName={user?.nome || 'DocMatch'}>
                <h1 className="text-white font-bold text-[18px]">Agendar Consulta</h1>
            </Header>

            {/* CARD DO MÉDICO — Glass */}
            <div className="px-5 -mt-5 relative z-20 mb-5">
                <div className={`${glassCard} rounded-[24px] p-4 flex items-center gap-4`}>
                    <div className="w-[68px] h-[68px] rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden shrink-0 shadow-md">
                        <img src={medico.foto} alt={`Foto de perfil de ${medico.nome}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h2 className="text-[#1A365D] font-bold text-[15px] leading-tight truncate">{medico.nome}</h2>
                            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        </div>
                        <p className="text-slate-500 text-[12px] font-medium mb-1.5">{medico.especialidade?.nome}</p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" aria-hidden="true" />
                                <span className="text-amber-700 text-[11px] font-bold">{medico.avaliacao || '5.0'}</span>
                            </div>
                            <span className="text-slate-300 text-xs">•</span>
                            <p className="text-slate-500 text-[11px]">{medico.total_avaliacoes || '0'} avaliações</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELEÇÃO DO LOCAL */}
            <div className="px-5 mb-5">
                <h3 className="text-[#1A365D] font-bold text-[15px] mb-3 px-1">Local de Atendimento</h3>
                <div className="flex flex-col gap-2.5">
                    {locais.map(local => {
                        const Icon = local.icon
                        const isSelected = selectedLocal?.id === local.id
                        return (
                            <button
                                key={local.id}
                                onClick={() => setSelectedLocal(local)}
                                aria-pressed={isSelected}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${isSelected
                                    ? `${glassCard} border-[#2D5284]/40 ring-2 ring-[#2D5284]/15 shadow-[0_8px_24px_rgba(45,82,132,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)]`
                                    : 'bg-white/50 border-white/60 backdrop-blur-sm hover:bg-white/70 shadow-[0_2px_8px_rgba(31,62,109,0.06)]'
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2D5284] shadow-[0_4px_12px_rgba(45,82,132,0.4)]' : 'bg-slate-100'}`}>
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`font-bold text-[13px] leading-tight ${isSelected ? 'text-[#1A365D]' : 'text-slate-600'}`}>{local.name}</p>
                                    <p className={`text-[11px] truncate ${isSelected ? 'text-[#2D5284]/70' : 'text-slate-400'}`}>{local.address}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* CARROSSEL DE DATAS */}
            <div className="px-5 mb-5">
                <h3 className="text-[#1A365D] font-bold text-[15px] mb-3 px-1">Próximas datas disponíveis</h3>
                <div className="flex gap-2.5 pb-2 overflow-x-auto no-scrollbar snap-x" role="listbox" aria-label="Selecionar data">
                    {nextDays.map((dia, idx) => {
                        const isSelected = selectedDay?.dateText === dia.dateText
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(dia)}
                                role="option"
                                aria-selected={isSelected}
                                className={`snap-start shrink-0 flex flex-col items-center justify-center min-w-[68px] h-[84px] rounded-[18px] transition-all ${isSelected
                                    ? 'bg-[#2D5284] shadow-[0_8px_24px_rgba(45,82,132,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] scale-105 border border-[#2D5284]'
                                    : `${glassCard} hover:scale-[1.03] active:scale-95`
                                    }`}
                            >
                                <span className={`text-[10px] font-bold mb-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{dia.label}</span>
                                <span className={`text-[20px] font-black leading-none ${isSelected ? 'text-white' : 'text-[#1A365D]'}`}>{dia.dateText.split(' ')[0]}</span>
                                <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>{dia.dateText.split(' ')[1]}</span>
                            </button>
                        )
                    })}
                </div>
                <div className="mt-3 flex justify-center">
                    <button
                        onClick={() => setShowFullCalendar(true)}
                        className="flex items-center gap-2 text-[12px] font-bold text-[#2D5284] bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full border border-white/80 shadow-sm hover:bg-white/80 transition-colors"
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Ver Calendário Completo
                    </button>
                </div>
            </div>

            {/* HORÁRIOS — Grid Compacto */}
            <div className="px-5 mb-10">
                <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="text-[#1A365D] font-bold text-[15px]">Horários Disponíveis</h3>
                    <button className="text-[#2D5284] flex items-center gap-1 text-[12px] font-semibold" aria-label="Filtrar horários">
                        <Filter className="w-3.5 h-3.5" /> Filtro
                    </button>
                </div>

                {availableSlots.length === 0 ? (
                    <div className={`${glassCard} rounded-2xl p-5 text-center`}>
                        <Clock className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 font-medium text-[13px]">Nenhum horário disponível.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => {
                            const isSelected = selectedSlot?.time === slot.time
                            return (
                                <button
                                    key={slot.time}
                                    onClick={() => setSelectedSlot(slot)}
                                    aria-pressed={isSelected}
                                    className={`relative rounded-2xl px-3 py-3 border transition-all active:scale-95 text-left flex flex-col justify-between min-h-[86px]
                                        ${isSelected
                                            ? 'bg-[#2D5284] border-[#2D5284] shadow-[0_8px_20px_rgba(45,82,132,0.35),inset_0_1px_2px_rgba(255,255,255,0.15)]'
                                            : slot.isFast
                                                ? 'bg-amber-50/80 border-amber-200/80 backdrop-blur-sm shadow-[0_4px_16px_rgba(217,119,6,0.10),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.15)]'
                                                : `${glassCard} hover:shadow-[0_8px_28px_rgba(31,62,109,0.14)]`
                                        }`}
                                >
                                    {slot.isFast && !isSelected && (
                                        <Zap className="absolute top-2 right-2 w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                                    )}
                                    <div>
                                        <span className={`text-[9px] font-semibold block mb-0.5 ${isSelected ? 'text-white/60' : slot.isFast ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {selectedDay?.label === 'Hoje' ? 'Hoje' : selectedDay?.label === 'Amanhã' ? 'Amanhã' : selectedDay?.label}
                                        </span>
                                        <span className={`text-[19px] font-black leading-none block ${isSelected ? 'text-white' : slot.isFast ? 'text-amber-700' : 'text-[#1A365D]'}`}>
                                            {slot.time}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${slot.isFast && !isSelected ? 'bg-amber-500 rounded-lg px-1.5 py-0.5' : ''}`}>
                                        {slot.isFast && !isSelected
                                            ? <span className="text-white text-[9px] font-black uppercase tracking-wide flex items-center gap-0.5"><Zap className="w-2.5 h-2.5 fill-white" />Rápido</span>
                                            : <>
                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-300' : 'bg-emerald-400'}`}></div>
                                                <span className={`text-[10px] font-semibold ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>{slot.price}</span>
                                            </>
                                        }
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Redes Sociais & Contato */}
            <div className="px-5 mb-8">
                <div className={`${glassCard} rounded-[24px] p-5`}>
                    <h3 className="text-[#1A365D] font-black text-[14px] mb-4 uppercase tracking-wider">Redes Sociais & Contato</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { icon: 'instagram', url: medico.sociais?.instagram, label: 'Instagram', color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                            { icon: 'telegram', url: medico.sociais?.telegram, label: 'Telegram', color: 'bg-[#229ED9]' },
                            { icon: 'facebook', url: medico.sociais?.facebook, label: 'Facebook', color: 'bg-[#1877F2]' },
                            { icon: 'x', url: '#', label: 'X (Twitter)', color: 'bg-black' },
                        ].map((soc, i: number) => (
                            <button 
                                key={i}
                                onClick={() => soc.url && soc.url !== '#' && window.open(soc.url, '_blank')}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-90",
                                    soc.color
                                )}>
                                    {soc.icon === 'instagram' && <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771-4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                                    {soc.icon === 'telegram' && <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>}
                                    {soc.icon === 'facebook' && <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                                    {soc.icon === 'x' && <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>}
                                </div>
                                <span className="text-[10px] font-bold text-[#1A365D]/60 uppercase tracking-tight">{soc.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONFIRMAÇÃO BOTTOM SHEET */}
            {selectedSlot && selectedDay && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40" onClick={() => setSelectedSlot(null)} />
                    <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] shadow-[0_-16px_48_rgba(0,0,0,0.12)] z-50 p-6 pt-4 animate-in slide-in-from-bottom-[100%] duration-300">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
                        <h3 className="text-[#1A365D] font-black text-xl mb-5 text-center">Confirmar Agendamento</h3>

                        <div className={`${glassCard} rounded-[20px] p-4 mb-5 relative overflow-hidden`}>
                            {selectedSlot.isFast && (
                                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-current" /> Slot Rápido
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/60">
                                <img src={medico.foto} alt={medico.nome} className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0" />
                                <div>
                                    <h4 className="text-[#1A365D] font-bold text-[14px]">{medico.nome}</h4>
                                    <p className="text-slate-500 text-[12px]">{medico.especialidade?.nome}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { icon: CalendarIcon, label: 'Data e Horário', value: `${selectedDay.dateText} às ${selectedSlot.time}`, color: 'bg-blue-50' },
                                    { icon: MapPin, label: 'Local', value: selectedLocal.name, color: 'bg-indigo-50' },
                                    { icon: ShieldCheck, label: 'Valor', value: selectedSlot.price, color: 'bg-amber-50' },
                                ].map(({ icon: Icon, label, value, color }) => (
                                    <div key={label} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shrink-0`}>
                                            <Icon className="w-4 h-4 text-[#2D5284]" />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide block">{label}</span>
                                            <span className="text-[#1A365D] text-[13px] font-bold">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSelectedSlot(null)} className="flex-[0.8] py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 font-bold active:scale-95 transition-all text-[14px]">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmar} className="flex-[2] py-3.5 rounded-xl bg-[#2D5284] text-white font-bold shadow-[0_8px_24px_rgba(45,82,132,0.4)] hover:brightness-110 active:scale-95 transition-all text-[14px]">
                                Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* FULL CALENDAR MODAL */}
            {showFullCalendar && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40" onClick={() => setShowFullCalendar(false)} />
                    <div
                        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-16px_48_rgba(0,0,0,0.12)] z-50 p-5 pt-4 animate-in slide-in-from-bottom-[100%] duration-300 h-[85vh] flex flex-col"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 shrink-0" />

                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="text-[#1A365D] font-black text-xl">Selecionar Data</h3>
                            <button onClick={() => setShowFullCalendar(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors" aria-label="Fechar calendário">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Controle Mês */}
                        <div className="flex items-center justify-between mb-5 shrink-0 bg-slate-50 rounded-2xl px-4 py-3">
                            <button
                                onClick={prevMonth}
                                disabled={calendarMonthStart <= new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[#2D5284] hover:bg-[#2D5284]/10 disabled:opacity-30 disabled:bg-transparent transition-colors"
                                aria-label="Mês anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h4 className="text-[#1A365D] font-bold text-[15px]">
                                {nomesMesesCompleto[calendarMonthStart.getMonth()]} {calendarMonthStart.getFullYear()}
                            </h4>
                            <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center text-[#2D5284] hover:bg-[#2D5284]/10 transition-colors" aria-label="Próximo mês">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* grid dias */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-1">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                    <div key={i} className="text-center text-[11px] font-bold text-slate-400 pb-2">{d}</div>
                                ))}

                                {calendarDays.map((date, idx) => {
                                    if (!date) return <div key={`e${idx}`} />

                                    const dayNum = date.getDate()
                                    const today0 = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
                                    const isPast = date.getTime() < today0.getTime()
                                    const isToday = date.toDateString() === todayDate.toDateString()
                                    const atende = (horariosLocal as any[]).some((h: any) => h.dia_semana === date.getDay())
                                    const isUnavailable = !atende || isPast

                                    return (
                                        <div key={dayNum} className="flex justify-center items-center py-0.5">
                                            <button
                                                disabled={isUnavailable}
                                                onClick={() => {
                                                    const target: DayInfo = {
                                                        dia_semana: date.getDay(),
                                                        label: isToday ? 'Hoje' : nomesDias[date.getDay()],
                                                        dateText: `${dayNum} ${nomesMeses[date.getMonth()]}`,
                                                        fullDate: date,
                                                    }
                                                    setSelectedDay(target)
                                                    setShowFullCalendar(false)
                                                }}
                                                aria-label={isUnavailable ? `${dayNum} - indisponível` : `Selecionar ${dayNum}`}
                                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-[14px] transition-all relative overflow-hidden
                                                    ${isToday
                                                        ? 'bg-[#2D5284] text-white font-bold shadow-[0_4px_12px_rgba(45,82,132,0.40)]'
                                                        : isUnavailable
                                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                            : 'text-[#1A365D] font-bold hover:bg-blue-50 hover:text-[#2D5284] active:scale-95'
                                                    }`}
                                            >
                                                {isUnavailable && !isToday && (
                                                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
                                                            <line x1="10" y1="30" x2="30" y2="10" stroke={isPast ? '#CBD5E1' : '#F59E0B'} strokeWidth="0.8" strokeLinecap="round" />
                                                        </svg>
                                                    </span>
                                                )}
                                                <span className={`relative z-10 font-semibold text-[13px] ${isUnavailable && !isToday ? (isPast ? 'text-slate-300' : 'text-slate-500') : ''}`}>{dayNum}</span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
