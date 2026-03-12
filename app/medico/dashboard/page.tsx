'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users, Calendar, Clock, ArrowUpRight, TrendingUp,
    MessageSquare, Star, Bell, Search, Plus, Zap, ShieldCheck,
    ChevronRight, LayoutDashboard, UserSquare2, History, Settings
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardMedicoPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [trialDays, setTrialDays] = useState(24) // Mock de dias restantes
    const [isPremium, setIsPremium] = useState(false)

    const stats = [
        { label: 'Pacientes', value: '124', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Consultas Hoje', value: '8', icon: Calendar, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
        { label: 'Nota Média', value: '4.9', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Mensagens', value: '12', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ]

    return (
        <div className="min-h-screen bg-[#0F2240] pb-32">
            {/* Trial Banner */}
            {!isPremium && (
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-5 py-3 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1A365D]" />
                        <p className="text-[#1A365D] text-[11px] font-bold">
                            Degustação Basic: <span className="font-black">{trialDays} dias restantes</span>
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/medico/planos')}
                        className="bg-[#1A365D] text-white text-[10px] font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-lg"
                    >
                        UPGRADE PREMIUM
                    </button>
                </div>
            )}

            <header className="px-5 pt-8 pb-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl border-2 border-[#D4AF37] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" alt="Doctor" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-white font-black text-xl leading-none">Olá, Dr. David</h1>
                                {isPremium && <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />}
                            </div>
                            <p className="text-white/40 text-[12px] mt-1.5">Boa tarde! Você tem <span className="text-[#D4AF37] font-bold">8 consultas</span> hoje.</p>
                        </div>
                    </div>
                    <button className="relative p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                        <Bell className="w-5 h-5 text-white/50" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0F2240]"></span>
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all group">
                            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-white font-black text-2xl">{stat.value}</p>
                            <p className="text-white/30 text-[11px] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Premium Feature: Slot Rápido CTAs */}
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-3xl p-6 mb-8 relative overflow-hidden group">
                    <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-[#D4AF37]/10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                            <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.2em]">Recurso Premium</span>
                        </div>
                        <h3 className="text-white font-black text-lg mb-2">Slots Rápidos ⚡</h3>
                        <p className="text-white/50 text-[12px] leading-relaxed mb-4">
                            Aumente sua visibilidade marcando horários de hoje como "Urgência". Pacientes buscam por rapidez!
                        </p>
                        <button
                            onClick={() => router.push('/medico/agenda')}
                            className="bg-[#D4AF37] text-[#1A365D] font-black px-6 py-3 rounded-2xl text-[12px] shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all"
                        >
                            CRIAR SLOT RÁPIDO
                        </button>
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-white font-black text-lg">Agenda de Hoje</h2>
                        <button onClick={() => router.push('/medico/agenda')} className="text-[#D4AF37] text-[11px] font-black uppercase tracking-wider">Ver Tudo</button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { time: '14:30', name: 'Ricardo Santos', type: 'Presencial', status: 'confirmada' },
                            { time: '15:15', name: 'Juliana Lima', type: 'Teleconsulta', status: 'agendada' },
                            { time: '16:00', name: 'Carlos Mendes', type: 'Presencial', status: 'agendada', isFast: true },
                        ].map((appt, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[28px] p-4 flex items-center gap-4 group hover:bg-white/10 transition-all active:scale-95">
                                <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl w-14 h-14 border border-white/5 font-black">
                                    <span className="text-white text-[14px]">{appt.time}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-bold text-[14px]">{appt.name}</p>
                                        {appt.isFast && (
                                            <div className="bg-[#D4AF37] text-[#1A365D] text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                                                <Zap className="w-2 h-2 fill-current" /> SLOT RÁPIDO
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white/30 text-[11px] mt-0.5">{appt.type}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>
            </header>

            {/* Bottom Navigation Médico */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#1A365D]/90 backdrop-blur-2xl border-t border-white/10 px-8 py-5 flex justify-between items-center z-40 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                <button onClick={() => router.push('/medico/dashboard')} className="flex flex-col items-center gap-1.5 text-[#D4AF37]">
                    <LayoutDashboard className="w-6 h-6 stroke-[2.5px]" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Home</span>
                </button>
                <button onClick={() => router.push('/medico/agenda')} className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white transition-all">
                    <Calendar className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Agenda</span>
                </button>
                <div className="relative -top-10">
                    <button onClick={() => router.push('/medico/receitas/nova')} className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-[24px] flex items-center justify-center shadow-[0_12px_24px_rgba(212,175,55,0.4)] border-4 border-[#1A365D] active:scale-90 transition-all">
                        <Plus className="w-8 h-8 text-[#1A365D] stroke-[3px]" />
                    </button>
                </div>
                <button onClick={() => router.push('/medico/pacientes')} className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white transition-all">
                    <UserSquare2 className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Pacientes</span>
                </button>
                <button onClick={() => router.push('/medico/perfil')} className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white transition-all">
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Perfil</span>
                </button>
            </nav>
        </div>
    )
}
