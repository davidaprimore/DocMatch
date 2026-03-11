'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronRight, Heart, Bell, Star, Menu as MenuIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { medicosMock } from '@/data/mockData'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
    const router = useRouter()
    const { count } = useCart()
    const [scrolled, setScrolled] = useState(false)

    const medicosSugeridos = [
        { ...medicosMock[0], foto_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop', rating: 4.9, favorito: false },
        { ...medicosMock[3], foto_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop', rating: 4.8, favorito: true },
        { ...medicosMock[4], foto_url: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=150&auto=format&fit=crop', rating: 5.0, favorito: false },
    ]

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-20 font-sans">
            {/* HEADER AZUL PREMIUM */}
            <header className={cn(
                "bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md relative z-20 mb-6 transition-all duration-300",
                scrolled ? "pt-2 pb-10" : "pt-4 pb-12"
            )}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/20 shadow-sm cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/menu')}>
                            <AvatarImage src="https://i.pravatar.cc/150?u=joce" />
                            <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white">JM</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-white/80 text-[11px] font-medium leading-none mb-0.5">Bem-vinda de volta,</span>
                            <span className="text-white text-[15px] font-bold leading-none">Joce Moreno</span>
                        </div>
                    </div>
                    {/* Componente Constante: Logo + Notificações */}
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold border border-[#2D5284]">3</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <button onClick={() => router.push('/menu')} className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                <MenuIcon className="w-5 h-5" />
                            </button>
                            <div className="flex items-center">
                                <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                                <span className="text-[18px] font-bold text-white ml-[1px] leading-none">Match</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BUSCA OVERLAPPING */}
                <div className="absolute left-5 right-5 -bottom-6 z-30">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por especialidade ou sintoma..."
                        className="w-full bg-white border-0 rounded-[16px] py-[14px] flex items-center pr-12 shadow-[0_8px_20px_rgba(0,0,0,0.15)] focus:ring-0 text-[13px] font-medium text-slate-500 outline-none placeholder:text-slate-400"
                        style={{ paddingLeft: '3rem' }}
                        onClick={() => router.push('/buscar')}
                        readOnly
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                </div>
            </header>

            <main className="px-4 pt-5 pb-8 space-y-3">
                {/* Banner Economia */}
                <div className="w-full bg-gradient-to-r from-[#CFAF42] via-[#E2C358] to-[#CFAF42] rounded-full py-[11px] flex items-center justify-center shadow-[0_8px_20px_rgba(207,175,66,0.3),inset_0_-2px_6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.4)] mb-4 px-4 border border-[#E8C55E]/50">
                    <span className="text-[13px] mr-2 filter drop-shadow-sm relative top-[0.5px]">💰</span>
                    <span className="text-[11.5px] font-black text-[#1A365D] tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">ECONOMIA ACUMULADA: R$ 450,00</span>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 mb-10 px-1 pt-2">
                    {[
                        {
                            label: 'Agendar', desc: 'Consulta', href: '/buscar', icon: (
                                <div className="relative w-full h-full flex flex-col items-center justify-center pt-2">
                                    <Image src="/icone-agenda.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform -mt-2.5" alt="Agendar" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2.5">
                                        <span className="text-[14px] font-black text-[#1A365D] leading-none drop-shadow-sm">{new Date().getDate()}</span>
                                        <span className="text-[7.5px] font-bold text-[#1A365D] uppercase leading-none mt-[1px] tracking-widest">{new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                    </div>
                                </div>
                            )
                        },
                        { label: 'Minhas', desc: 'Receitas', href: '/receitas', icon: <Image src="/icone-receitas.png.png" width={48} height={48} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Receitas" /> },
                        { label: 'Comparador', desc: 'de Preços', href: '/comparar-precos', icon: <Image src="/icone-balanca.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Comparador" /> },
                        { label: 'Minha', desc: 'Cesta', href: '/cesta', icon: (
                            <div className="relative">
                                <Image src="/icone-cesta.png.png" width={56} height={56} className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" alt="Cesta" />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#1A365D] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#1A365D] shadow-lg">
                                        {count}
                                    </span>
                                )}
                            </div>
                        ) },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <button
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
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-bold text-[#1A365D] text-[15px]">Agendamentos Pendentes</h3>
                        <button className="text-[11px] font-bold text-[#2D5284] hover:underline" onClick={() => router.push('/consultas')}>Mostrar todos</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 no-scrollbar snap-x snap-mandatory -mx-4 px-4">
                        {[
                            { nome: 'Dr. Lucas Pereira', esp: 'Cardiologista', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop', data: 'Amanhã 10:00' },
                            { nome: 'Dra. Ana Silva', esp: 'Pediatra', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop', data: 'Dia 12 15:30' }
                        ].map((c, i) => (
                            <div key={i} className="min-w-[80%] snap-center bg-gradient-to-b from-white to-[#F8FAFC] rounded-[28px] p-4 flex items-center gap-4 shadow-[0_22px_44px_-12px_rgba(26,54,93,0.12),0_6px_16px_-4px_rgba(26,54,93,0.06),inset_0_2px_6px_rgba(255,255,255,0.9)] border border-white/60">
                                <img src={c.img} className="w-[68px] h-[68px] rounded-[22px] object-cover bg-slate-50 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-slate-100/50" alt={c.nome} />
                                <div className="flex-1">
                                    <h4 className="font-bold text-[14px] text-slate-800 leading-tight">{c.nome}</h4>
                                    <p className="text-[11px] text-slate-500 mt-[2px]">{c.esp}</p>
                                    <p className="text-[12px] font-bold text-[#1A365D] mt-1.5">{c.data}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                            </div>
                        ))}
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

                {/* Médicos Sugeridos */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="font-bold text-[#1A365D] text-[15px]">Médicos Sugeridos para Você</h3>
                        <div className="flex gap-2">
                            <button className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                            </button>
                            <button className="w-7 h-7 rounded-full bg-[#2D5284] shadow-md flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-10 pt-4 no-scrollbar -mx-4 px-5">
                        {medicosSugeridos.map((medico, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[140px] bg-gradient-to-b from-white to-[#F8FAFC] rounded-[28px] p-4 shadow-[0_32px_64px_-12px_rgba(26,54,93,0.28),0_16px_32px_-8px_rgba(26,54,93,0.18),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/80 flex flex-col items-start relative transition-transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => router.push(`/buscar/${medico.id}`)}
                            >
                                <div className="relative mb-3 w-full">
                                    <img src={medico.foto_url} className="w-full aspect-square rounded-[22px] object-cover shadow-[0_12px_24px_-6px_rgba(0,0,0,0.15)] border border-slate-100/50" alt={medico.nome} />
                                    <button className={`absolute -top-2 -right-2 w-[34px] h-[34px] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/60 ${medico.favorito ? 'bg-gradient-to-b from-[#FEF2F2] to-[#FEE2E2]' : 'bg-gradient-to-b from-white to-gray-50'}`}>
                                        <Heart className={`w-[16px] h-[16px] transition-colors ${medico.favorito ? 'fill-[#EF4444] text-[#EF4444]' : 'text-slate-300'}`} />
                                    </button>
                                </div>
                                <p className="text-[13px] font-bold text-left text-[#1A365D] leading-tight w-full truncate">{medico.nome}</p>
                                <p className="text-[10px] text-slate-500 font-medium text-left mt-0.5 w-full truncate">{medico.especialidade}</p>
                                <div className="flex items-center justify-start gap-1 mt-1.5 w-full">
                                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                                    <span className="text-[12px] font-bold text-[#1A365D]">{medico.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    )
}
