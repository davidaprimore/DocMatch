'use client'

import { useRouter } from 'next/navigation'
import {
    User, CreditCard, Settings, ShieldCheck, HelpCircle,
    LogOut, ChevronRight, Bell, Heart, Share2, Star,
    LayoutDashboard, Apple, Info, FileText
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'

const menuSections = [
    {
        title: 'Minha Conta',
        items: [
            { id: 'perfil', label: 'Editar Perfil', icon: User, href: '/perfil', color: 'text-blue-500' },
            { id: 'planos', label: 'Meu Plano & Assinatura', icon: CreditCard, href: '/planos', color: 'text-amber-500', badge: 'PRIME' },
            { id: 'notificacoes', label: 'Notificações', icon: Bell, href: '/notificacoes', color: 'text-rose-500' },
            { id: 'favoritos', label: 'Médicos Favoritos', icon: Heart, href: '/favoritos', color: 'text-red-500' },
        ]
    },
    {
        title: 'Segurança & Suporte',
        items: [
            { id: 'lgpd', label: 'Privacidade (LGPD)', icon: ShieldCheck, href: '/perfil/lgpd', color: 'text-emerald-500' },
            { id: 'config', label: 'Configurações', icon: Settings, href: '/configuracoes', color: 'text-slate-500' },
            { id: 'ajuda', label: 'Central de Ajuda', icon: HelpCircle, href: '/ajuda', color: 'text-indigo-500' },
            { id: 'termos', label: 'Termos de Uso', icon: FileText, href: '/termos', color: 'text-slate-400' },
        ]
    },
    {
        title: 'DocMatch',
        items: [
            { id: 'sobre', label: 'Sobre o App', icon: Info, href: '/sobre', color: 'text-blue-400' },
            { id: 'avaliar', label: 'Avaliar na App Store', icon: Star, href: '#', color: 'text-yellow-500' },
            { id: 'indicar', label: 'Indicar para um Amigo', icon: Share2, href: '#', color: 'text-purple-500' },
        ]
    }
]

export default function MenuPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header / Perfil */}
            <header className="bg-[#1A365D] pt-12 pb-10 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                        <Avatar className="w-24 h-24 border-4 border-[#1A365D] relative shadow-2xl">
                            <AvatarImage src="https://i.pravatar.cc/150?u=joce" />
                            <AvatarFallback>JM</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-[#D4AF37] text-[#1A365D] p-1.5 rounded-full border-2 border-[#1A365D] shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                        </div>
                    </div>

                    <h1 className="text-white font-black text-2xl mt-4 leading-tight">Joce Moreno</h1>
                    <p className="text-white/40 text-sm font-medium">joce.moreno@email.com</p>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => router.push('/planos')}
                            className="bg-[#D4AF37] text-[#1A365D] font-black px-6 py-2 rounded-full text-[12px] shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all"
                        >
                            DOCMATCH PRIME
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu Sections */}
            <main className="px-5 mt-8 space-y-8">
                {menuSections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h2 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] px-2">{section.title}</h2>
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                            {section.items.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => item.href !== '#' && router.push(item.href)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-none active:bg-slate-100 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform ${item.color}`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-[14px]">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge && (
                                            <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black px-2 py-1 rounded-lg">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-red-50 text-red-500 font-black p-5 rounded-[32px] border border-red-100 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm hover:bg-red-100"
                >
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                </button>

                <div className="text-center pb-10">
                    <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">DocMatch v2.5 • Criado com ❤️</p>
                </div>
            </main>

            <BottomNav activeTab="menu" />
        </div>
    )
}
