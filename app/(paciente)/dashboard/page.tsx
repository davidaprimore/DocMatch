'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronRight, Heart, Bell, Star, Menu as MenuIcon, Flame, BadgeCheck, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { Header } from '@/components/Header'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useAgendamentos } from '@/hooks/useAgendamentos'
import { useMedicos } from '@/hooks/useMedicos'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { count } = useCart()
    const { user } = useAuth()
    const { medicos, isLoading: isLoadingMedicos } = useMedicos()
    const { agendamentos, isLoading: isLoadingAgendas } = useAgendamentos()

    // Filtra médicos sugeridos/destaque do banco
    const medicosSugeridos = medicos.slice(0, 5)

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC]">
            {/* CONTEÚDO */}
            <div className="relative z-10 pb-20 flex flex-col font-sans">
                {/* HEADER AZUL PREMIUM PADRONIZADO */}
                <div className="relative mb-2">
                    <Header
                        variant="dashboard"
                        userAvatar={user?.foto || undefined}
                        userName={user?.nome?.split(' ')[0] ?? t('welcome')}
                        showNotifications={true}
                        onAvatarClick={() => router.push('/menu')}
                    />

                    {/* BUSCA OVERLAPPING */}
                    <div id="search-bar-tour" className="absolute left-5 right-5 -bottom-0 z-50">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className="w-full bg-white border-0 rounded-[16px] py-[14px] flex items-center pr-12 shadow-[0_8px_20px_rgba(0,0,0,0.15)] focus:ring-0 text-[13px] font-medium text-slate-500 outline-none placeholder:text-slate-400"
                            style={{ paddingLeft: '3rem' }}
                            onClick={() => router.push('/buscar')}
                            readOnly
                        />
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                    </div>
                </div>


                <main className="px-4 pt-2 pb-8 space-y-3">
                    {/* Banner Economia */}
                    <div id="economy-tour" className="w-full bg-gradient-to-r from-[#CFAF42] via-[#E2C358] to-[#CFAF42] rounded-full py-[11px] flex items-center justify-center shadow-[0_8px_20px_rgba(207,175,66,0.3),inset_0_-2px_6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.4)] mb-4 px-4 border border-[#E8C55E]/50">
                        <span className="text-[13px] mr-2 filter drop-shadow-sm relative top-[0.5px]">💰</span>
                        <span className="text-[11.5px] font-black text-[#1A365D] tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">{t('economy_banner', { valor: 'R$ 0,00' })}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-3 mb-10 px-1 pt-1">
                        {[
                            {
                                label: 'Agendar', desc: 'Consulta', href: '/buscar', icon: (
                                    <div className="relative w-full h-full flex flex-col items-center justify-center pt-1">
                                        <Image src="/icone-agenda.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform -mt-2.5" alt="Agendar" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                            <span className="text-[18px] font-black text-[#1A365D] leading-none drop-shadow-sm">{new Date().getDate()}</span>
                                            <span className="text-[9px] font-bold text-[#1A365D] uppercase leading-none mt-[1px] tracking-widest">{new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                        </div>
                                    </div>
                                )
                            },
                            { label: 'Minhas', desc: 'Receitas', href: '/receitas', icon: <Image src="/icone-receitas.png.png" width={48} height={48} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Receitas" /> },
                            { label: 'Comparador', desc: 'de Preços', href: '/comparar-precos', icon: <Image src="/icone-balanca.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Comparador" /> },
                            {
                                label: 'Minha', desc: 'Cesta', href: '/cesta', icon: (
                                    <div className="relative">
                                        <Image src="/icone-cesta.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Cesta" />
                                        {count > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#1A365D] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#1A365D] shadow-lg">
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                )
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <button
                                    id={item.label === 'Minhas' ? 'recipes-tour' : item.label === 'Comparador' ? 'comparator-tour' : undefined}
                                    onClick={() => router.push(item.href)}
                                    className="w-[72px] h-[72px] rounded-[24px] bg-gradient-to-br from-[#1F3E6D] to-[#12274A] flex items-center justify-center mb-3 shadow-[0_16px_32px_-8px_rgba(26,54,93,0.5),0_8px_16px_-4px_rgba(26,54,93,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)] ring-1 ring-white/10 transition-transform duration-300 transform hover:scale-110 relative"
                                >
                                    {item.icon}
                                </button>
                                <span className="text-[11px] font-bold text-center leading-tight truncate w-full text-slate-800">{item.label}</span>
                                <span className="text-[10px] font-medium text-center leading-tight truncate w-full text-slate-500 mt-[2px]">{item.desc}</span>
                            </div>
                        ))}
                    </div>

                    {/* Agendamentos Pendentes */}
                    <section className="mb-8">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-[#1A365D] text-[15px]">Agendamentos Pendentes</h3>
                            <button className="text-[11px] font-bold text-[#2D5284] hover:underline" onClick={() => router.push('/consultas')}>Mostrar todos</button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory -mx-4 px-4">
                            {isLoadingAgendas ? (
                                <div className="w-full h-24 bg-white/50 animate-pulse rounded-[28px]" />
                            ) : agendamentos.length > 0 ? (
                                agendamentos.map((c, i) => (
                                    <div key={i} className="min-w-[80%] snap-center bg-gradient-to-b from-white to-[#F8FAFC] rounded-[28px] p-4 flex items-center gap-4 shadow-[0_22px_44px_-12px_rgba(26,54,93,0.12),0_6px_16px_-4px_rgba(26,54,93,0.06),inset_0_2px_6px_rgba(255,255,255,0.9)] border border-white/60">
                                        <img src={c.medicos?.foto || '/avatar-medico-1.png'} className="w-[68px] h-[68px] rounded-[22px] object-cover bg-slate-50 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-slate-100/50" alt={c.medicos?.nome} />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[14px] text-slate-800 leading-tight">{c.medicos?.nome}</h4>
                                            <p className="text-[11px] text-slate-500 mt-[2px]">{c.medicos?.especialidades?.nome}</p>
                                            <p className="text-[12px] font-bold text-[#1A365D] mt-1.5">{new Date(c.data_horario).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full bg-white/40 rounded-[28px] p-6 text-center border border-dashed border-slate-300">
                                    <p className="text-[12px] text-slate-500 font-medium">Nenhum agendamento pendente</p>
                                    <button onClick={() => router.push('/buscar')} className="mt-2 text-[11px] font-bold text-[#1A365D] hover:underline">Agendar agora</button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Banner Premium */}
                    <div className="mb-6 relative w-full h-24 rounded-2xl overflow-hidden shadow-lg border border-[hsl(45,80%,47%)]/30 flex items-center justify-between px-5 bg-gradient-to-r from-[#1A365D] via-[#2A4365] to-[#1A365D]">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#8C7326]"></div>
                        <div className="flex-1 ml-3">
                            <h3 className="text-[13px] font-black text-white leading-tight uppercase tracking-tight">Faça o Upgrade para o<br /><span className="text-[#D4AF37]">DocMatch Premium!</span></h3>
                            <p className="text-[9px] text-gray-300 mt-1 block">✓ Agendamentos Prioritários &nbsp; ✓ Descontos</p>
                        </div>
                        <button onClick={() => router.push('/planos')} className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full py-2 px-4 shadow-[0_4px_10px_rgba(212,175,55,0.3)]">
                            <span className="block text-[10px] font-black text-[#1A365D] uppercase text-center leading-none">Assine Agora!</span>
                            <span className="block text-[8px] font-medium text-[#1A365D] text-center mt-0.5">R$ 39,90/Mês</span>
                        </button>
                    </div>

                    {/* Médicos Sugeridos (Reais do Supabase) */}
                    <section>
                        <div className="flex items-center justify-between mb-0 px-1">
                            <h3 className="font-extrabold text-[#1A365D] text-[15px] flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                Médicos Sugeridos
                            </h3>
                            <div className="flex gap-2">
                                <button className="text-[11px] font-bold text-[#D4AF37] hover:underline" onClick={() => router.push('/buscar')}>VER TODOS</button>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-10 pt-4 no-scrollbar -mx-4 px-5">
                            {isLoadingMedicos ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex-shrink-0 w-[140px] h-[200px] bg-white rounded-[28px] animate-pulse border border-slate-100" />
                                ))
                            ) : medicosSugeridos.map((medico, index) => (
                                <div
                                    key={medico.id}
                                    className="flex-shrink-0 w-[150px] bg-gradient-to-b from-white to-[#F8FAFC] rounded-[28px] p-3 shadow-[0_32px_64px_-12px_rgba(26,54,93,0.15),0_16px_32px_-8px_rgba(26,54,93,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/80 flex flex-col items-start relative transition-transform hover:-translate-y-1 cursor-pointer"
                                    onClick={() => router.push(`/buscar/${medico.id}`)}
                                >
                                    <div className="relative mb-3 w-full">
                                        <img src={medico.foto || '/avatar-medico-1.png'} className="w-full aspect-square rounded-[22px] object-cover shadow-sm border border-slate-100/50" alt={medico.nome} />
                                        <button className="absolute -top-1.5 -right-1.5 w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100">
                                            <Heart className="w-[14px] h-[14px] text-slate-300" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <BadgeCheck className="w-3 h-3 text-[#4F46E5]" />
                                        <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-wider">{medico.especialidade?.nome ?? 'Clínico'}</span>
                                    </div>
                                    <p className="text-[12px] font-black text-left text-[#1A365D] leading-tight w-full truncate">{medico.nome}</p>
                                    <div className="flex items-center justify-between mt-2 w-full">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                                            <span className="text-[11px] font-bold text-[#1A365D]">{medico.nota.toFixed(1)}</span>
                                        </div>
                                        <Clock className="w-3 h-3 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <BottomNav />
            </div>
        </div>
    )
}
