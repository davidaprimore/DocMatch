'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, Search, ChevronRight, Zap, Star, ShieldCheck, Filter, Info } from 'lucide-react'
import { medicosMock } from '@/data/mockData'
import { toast } from 'sonner'

type SelectedSlotType = { time: string, price: string, isFast: boolean } | null;

export default function AgendarPage() {
    const router = useRouter()
    const params = useParams()

    // Captura da Rota Dinâmica
    const medicoId = params?.id as string || 'med_001'
    const medico = medicosMock.find(m => m.id === medicoId) || medicosMock[0]

    // Gerador de Calendário Dinâmico (Próximos 14 dias)
    const nextDays = useMemo(() => {
        const days = [];
        const today = new Date('2026-03-10T12:00:00Z'); // Travado no presente mockup para manter a consistência com 'HOJE'

        const nomesDias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
        const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                dia_semana: date.getDay(), // 0-6
                label: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : nomesDias[date.getDay()],
                dateText: `${date.getDate()} ${nomesMeses[date.getMonth()]}`,
                fullDate: date
            });
        }
        return days;
    }, []);

    const [selectedDay, setSelectedDay] = useState(nextDays[0])
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlotType>(null)
    const [showFullCalendar, setShowFullCalendar] = useState(false)

    // Slots baseados na disponibilidade mock
    const slots = [
        { time: '09:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '10:30', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '14:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
        { time: '16:30', price: `R$ ${medico.valor_consulta + 50}`, isFast: true }, // Slot Rápido Premium simulado (+ urgência)
        { time: '19:00', price: `R$ ${medico.valor_consulta}`, isFast: false },
    ]

    const handleConfirmar = () => {
        if (!selectedSlot) return
        toast.success(`Consulta com ${medico.nome} confirmada para ${selectedDay.dateText} às ${selectedSlot.time}!`)
        setSelectedSlot(null)
        setTimeout(() => router.push('/dashboard'), 1500)
    }

    return (
        // Regra Frontend 1: Background em Slate-50
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Regra Frontend 2: Header Azul Corporativo e Arredondado */}
            <header className="px-5 pt-4 pb-12 bg-[#2D5284] rounded-b-3xl relative shadow-md z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Agendar Consulta</h1>
                    </div>
                    {/* Componente Constante: Logo + Notificações */}
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')}>
                            <Star strokeWidth={2} className="w-[18px] h-[18px] opacity-0 absolute pointer-events-none" />{/* Spacer Ghost para manter alinhamento se trocar de icon*/}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[16px] font-bold text-[#D4AF37]">D</span>
                            <span className="text-[16px] font-bold text-white leading-none">M</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Perfil Exato do Médico Selecionado */}
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

            {/* Calendário Dinâmico Scrollable */}
            <div className="px-5 mb-8">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-[#1A365D] font-bold text-[16px]">Escolha a Data</h3>
                </div>
                <div className="flex gap-3 pb-2 overflow-x-auto no-scrollbar snap-x">
                    {nextDays.map((dia, idx) => {
                        // Verifica se o médico atende neste dia da semana (Base Mockada)
                        const medicoAtende = medico.horarios_disponiveis.some(h => h.dia_semana === dia.dia_semana);

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(dia)}
                                disabled={!medicoAtende}
                                className={`snap-start shrink-0 flex flex-col items-center justify-center min-w-[75px] h-[90px] rounded-[20px] transition-all border ${selectedDay.label === dia.label
                                    ? 'bg-[#2D5284] border-[#2D5284] shadow-md shadow-[#2D5284]/20 scale-105'
                                    : medicoAtende
                                        ? 'bg-white border-slate-200 hover:border-slate-300 active:scale-95'
                                        : 'bg-[#F1F5F9] border-slate-100 opacity-60 cursor-not-allowed'
                                    }`}
                            >
                                <span className={`text-[11px] font-semibold mb-1 tracking-wide ${selectedDay.label === dia.label ? 'text-white/90' : medicoAtende ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {dia.label}
                                </span>
                                <span className={`text-[18px] font-black leading-none ${selectedDay.label === dia.label ? 'text-white' : medicoAtende ? 'text-[#1A365D]' : 'text-slate-400'}`}>
                                    {dia.dateText.split(' ')[0]}
                                </span>
                                <span className={`text-[11px] font-medium mt-1 ${selectedDay.label === dia.label ? 'text-white/80' : medicoAtende ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {dia.dateText.split(' ')[1]}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Disparador do Calendário Mensal Expandido (Estilo Airbnb) */}
                <div className="mt-3 flex justify-center">
                    <button
                        onClick={() => setShowFullCalendar(true)}
                        className="flex items-center gap-2 text-[12px] font-bold text-[#2D5284] bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        Ver Calendário Completo
                    </button>
                </div>
            </div>

            {/* Componente Modular de Horários Disponíveis */}
            <div className="px-5 space-y-4 mb-24">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-[#1A365D] font-bold text-[16px]">Horários Disponíveis</h3>
                    <button className="text-[#2D5284] flex items-center gap-1 text-sm font-medium"><Filter className="w-4 h-4" /> Filtro</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => (
                        <button
                            key={slot.time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`relative rounded-[20px] p-4 border transition-all active:scale-95 text-left flex flex-col justify-between h-[115px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${slot.isFast
                                ? 'bg-amber-50/50 border-amber-200 ring-1 ring-amber-100 hover:bg-amber-50'
                                : 'bg-white border-slate-100 hover:border-[#2D5284]/30'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${slot.isFast ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {selectedDay.label.substring(0, 4)} • {selectedDay.dateText.split(' ')[0]}
                                    </span>
                                    <span className={`text-2xl font-black ${slot.isFast ? 'text-amber-700' : 'text-[#1A365D]'}`}>{slot.time}</span>
                                </div>
                                {slot.isFast && <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
                            </div>

                            {slot.isFast ? (
                                <div className="bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl self-start flex items-center justify-center gap-1 mt-2 w-full uppercase shadow-sm shadow-[#D4AF37]/20">
                                    <Zap className="w-3.5 h-3.5 fill-current" /> SLOT RÁPIDO
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-slate-500 text-[12px] font-semibold">{slot.price}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Banner de Monetização (Rodapé) - Padrão Metric */}
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

            {/* Bottom Sheet Modal de Confirmação */}
            {selectedSlot && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedSlot(null)}></div>
                    <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 animate-in slide-in-from-bottom-[100%] duration-300">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

                        <h3 className="text-[#1A365D] font-black text-xl mb-6 text-center">Confirmar Agendamento</h3>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 relative overflow-hidden">
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

                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-[#2D5284]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Data</span>
                                        <span className="text-[#1A365D] text-[13px] font-bold">{selectedDay.dateText} ({selectedDay.label})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-[#2D5284]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Horário</span>
                                        <span className="text-[#1A365D] text-[13px] font-bold">{selectedSlot.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Valor da Consulta</span>
                                        <span className="text-[#1A365D] text-[13px] font-bold">{selectedSlot.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 font-bold active:scale-95 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmar}
                                className="flex-[2] py-3.5 rounded-xl bg-[#D4AF37] text-white font-black shadow-lg shadow-[#D4AF37]/30 hover:brightness-110 active:scale-95 transition-all"
                            >
                                Concluir Agendamento
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Sheet do Calendário Mensal Completo (Estilo Airbnb) */}
            {showFullCalendar && (
                <>
                    <div className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowFullCalendar(false)}></div>
                    <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-6 pt-4 animate-in slide-in-from-bottom-[100%] duration-300 h-[85vh] flex flex-col">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>

                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-[#1A365D] font-black text-xl">Selecionar Data</h3>
                            <button onClick={() => setShowFullCalendar(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                        </div>

                        {/* Corpo do Calendário Fixo Mês Março (Demonstrativo UI) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="mb-8">
                                <h4 className="text-slate-800 font-bold mb-4 ml-1">Março 2026</h4>
                                <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-2">
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                        <div key={i} className="text-center text-[11px] font-bold text-slate-400">{d}</div>
                                    ))}

                                    {/* Grid de Dias (Exemplo Fixo) */}
                                    {/* Offset para começar no dom/seg correto */}
                                    <div className="text-center py-2 text-transparent">_</div>
                                    <div className="text-center py-2 text-transparent">_</div>
                                    <div className="text-center py-2 text-transparent">_</div>
                                    <div className="text-center py-2 text-transparent">_</div>
                                    <div className="text-center py-2 text-transparent">_</div>
                                    <div className="text-center py-2 text-transparent">_</div>

                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                        const isPast = day < 10;
                                        const isToday = day === 10;
                                        const isUnavailable = !medico.horarios_disponiveis.some(h => h.dia_semana === ((day + 6) % 7)); // Simulação simples baseada no mock

                                        const isDisabled = isPast || isUnavailable;

                                        return (
                                            <div key={day} className="flex justify-center items-center">
                                                <button
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        const targetDia = nextDays.find(d => d.dateText.startsWith(day.toString()));
                                                        if (targetDia) setSelectedDay(targetDia);
                                                        setShowFullCalendar(false);
                                                    }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold transition-all relative ${isToday ? 'bg-[#2D5284] text-white shadow-md' :
                                                        isDisabled ? 'text-slate-300 line-through decoration-slate-300 opacity-50 cursor-not-allowed' :
                                                            'text-slate-700 hover:bg-slate-100 active:scale-95'
                                                        }`}
                                                >
                                                    {day}
                                                    {isToday && <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></span>}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-slate-800 font-bold mb-4 ml-1">Abril 2026</h4>
                                <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-2">
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                        <div key={i} className="text-center text-[11px] font-bold text-slate-400">{d}</div>
                                    ))}
                                    {/* Mais grid para scroll - Exemplo vazio pra UI */}
                                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => (
                                        <div key={`abr${day}`} className="flex justify-center items-center">
                                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-slate-700 hover:bg-slate-100">
                                                {day}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

