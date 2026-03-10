'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, Search, ChevronRight, Zap, Star, ShieldCheck, Filter } from 'lucide-react'
import { medicosMock } from '@/data/mockData'
import { toast } from 'sonner'

export default function AgendarPage() {
    const router = useRouter()
    const [selectedDay, setSelectedDay] = useState('HOJE')

    const dias = [
        { label: 'HOJE', date: '10 Mar' },
        { label: 'QUI', date: '11 Mar' },
        { label: 'SEX', date: '12 Mar' },
        { label: 'SÁB', date: '13 Mar' },
        { label: 'DOM', date: '14 Mar' },
        { label: 'SEG', date: '15 Mar' },
    ]

    const slots = [
        { time: '09:00', price: 'R$ 250', isFast: false },
        { time: '10:30', price: 'R$ 250', isFast: false },
        { time: '14:00', price: 'R$ 250', isFast: false },
        { time: '16:30', price: 'R$ 290', isFast: true }, // Slot Rápido Premium
        { time: '19:00', price: 'R$ 250', isFast: false },
    ]

    const handleAgendar = (time: string) => {
        toast.success(`Consulta agendada para às ${time}!`)
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-20">
            <header className="px-5 pt-12 pb-6 relative">
                <button onClick={() => router.back()} className="absolute left-5 top-12 text-white bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-white font-black text-xl text-center mt-4">Agendar <span className="text-[#D4AF37]">Consulta</span></h1>
            </header>

            {/* Perfil do Médico Selecionado (Resumo) */}
            <div className="px-5 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all"></div>
                    <div className="w-20 h-20 rounded-3xl border-2 border-[#D4AF37] overflow-hidden shadow-2xl z-10">
                        <img src={medicosMock[0].foto_url} alt={medicosMock[0].nome} className="w-full h-full object-cover" />
                    </div>
                    <div className="z-10 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <h2 className="text-white font-black text-[16px] leading-tight">{medicosMock[0].nome}</h2>
                            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider">{medicosMock[0].especialidade}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-white/80 text-[12px] font-black">{medicosMock[0].nota}</span>
                            </div>
                            <div className="h-3 w-[1px] bg-white/10"></div>
                            <p className="text-white/40 text-[11px] font-medium">{medicosMock[0].total_avaliacoes} avaliações</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seletor de Datas */}
            <div className="px-5 mb-8 overflow-x-auto">
                <div className="flex gap-3 pb-2 scrollbar-hide">
                    {dias.map((dia) => (
                        <button
                            key={dia.label}
                            onClick={() => setSelectedDay(dia.label)}
                            className={`flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-[24px] border transition-all ${selectedDay === dia.label
                                    ? 'bg-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105'
                                    : 'bg-white/5 border-white/5 text-white/40 active:scale-95'
                                }`}
                        >
                            <span className={`text-[10px] font-black tracking-widest ${selectedDay === dia.label ? 'text-[#1A365D]' : 'text-white/30'}`}>{dia.label}</span>
                            <span className={`text-[16px] font-black mt-1 ${selectedDay === dia.label ? 'text-[#1A365D]' : 'text-white'}`}>{dia.date}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Seletor de Horários com Slot Rápido */}
            <div className="px-5 space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-white font-black text-lg">Horários Disponíveis</h3>
                    <button className="text-white/30"><Filter className="w-5 h-5" /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {slots.map((slot) => (
                        <button
                            key={slot.time}
                            onClick={() => handleAgendar(slot.time)}
                            className={`relative rounded-3xl p-5 border transition-all active:scale-95 text-left flex flex-col justify-between h-[120px] ${slot.isFast
                                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/20'
                                    : 'bg-white/5 border-white/5 hover:border-white/10 active:bg-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{selectedDay}</span>
                                    <span className={`text-2xl font-black ${slot.isFast ? 'text-white' : 'text-white/90'}`}>{slot.time}</span>
                                </div>
                                {slot.isFast && <Zap className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />}
                            </div>

                            {slot.isFast ? (
                                <div className="bg-[#D4AF37] text-[#1A365D] text-[9px] font-black px-3 py-1.5 rounded-xl self-start flex items-center justify-center gap-1 mt-2 w-full uppercase">
                                    <Zap className="w-3 h-3 fill-current" /> SLOT RÁPIDO
                                </div>
                            ) : (
                                <div className="text-white/30 text-[11px] font-bold mt-2">
                                    {slot.price}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer / CTA para Prime */}
            <div className="px-5 mt-10">
                <div className="bg-gradient-to-br from-[#1A365D] to-[#0F2240] border border-[#D4AF37]/20 rounded-[32px] p-6 text-center space-y-4">
                    <Zap className="w-10 h-10 text-[#D4AF37] mx-auto animate-pulse" />
                    <h4 className="text-white font-black text-lg">Precisa de urgência?</h4>
                    <p className="text-white/40 text-[12px] leading-relaxed">Assine o **DocMatch Prime** para ter acesso exclusivo a Slots Rápidos e ser atendido ainda hoje!</p>
                    <button
                        onClick={() => router.push('/planos')}
                        className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-black px-8 py-3 rounded-2xl text-[12px] hover:bg-[#D4AF37] hover:text-[#1A365D] transition-all"
                    >
                        CONHECER PLANOS PRIME
                    </button>
                </div>
            </div>
        </div>
    )
}
