'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Menu, X, LogOut, User, Settings, HelpCircle, ChevronRight, LayoutDashboard, FileCheck, Shield, Phone, MessageSquare, Handshake, Info, Globe } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
    variant?: 'dashboard' | 'page'
    title?: string
    showBackButton?: boolean
    showNotifications?: boolean
    onBack?: () => void
    className?: string
    children?: React.ReactNode
    userAvatar?: string
    userName?: string
    onAvatarClick?: () => void
    rightAction?: React.ReactNode
}

export function Header({
    variant = 'page',
    title,
    showBackButton = false,
    showNotifications = true,
    onBack,
    className,
    children,
    userAvatar,
    userName,
    onAvatarClick,
    rightAction
}: HeaderProps) {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Lógica para logos condicionais
    const isMessages = title === 'Mensagens' || title === 'DocZap' || className?.includes('doczap')
    const isDashboard = variant === 'dashboard'

    return (
        <header className={cn(
            "bg-[#2D5284] px-3 pt-5 pb-8 rounded-b-[32px] shadow-lg relative mb-6 transition-all duration-300",
            className
        )}>
            <div className="flex justify-between items-center h-12">
                {/* Lado Esquerdo: Identidade / Título / DocZap */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {isDashboard && userAvatar ? (
                        <div
                            className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-all"
                            onClick={onAvatarClick}
                        >
                            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-sm">
                                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white/60 text-[10px] font-medium leading-none">Olá,</span>
                                <span className="text-white text-[16px] font-bold leading-tight capitalize truncate">{userName?.split(' ')[0]}</span>
                            </div>
                        </div>
                    ) : isMessages ? (
                        <div className="flex items-center gap-2">
                            {showBackButton && (
                                <button onClick={onBack || (() => router.back())} className="text-white p-1.5 -ml-1 rounded-full hover:bg-white/10 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div className="flex items-center cursor-default select-none animate-in fade-in slide-in-from-left-4 duration-500">
                                <span className="text-[17px] font-black text-[#D4AF37] tracking-tighter">Doc</span>
                                <span className="text-[17px] font-black text-white ml-[1px] tracking-tighter">Zap</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-3 duration-300 overflow-hidden">
                            {showBackButton && (
                                <button
                                    onClick={onBack || (() => router.back())}
                                    className="text-white hover:bg-white/10 p-1.5 -ml-1 rounded-full transition-colors flex-shrink-0"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            {title && <h1 className="text-white font-black text-[16px] tracking-tight truncate">{title}</h1>}
                            {!title && children && children}
                        </div>
                    )}
                </div>

                {/* Lado Direito: Logo (Dash) e Ações */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Exibir DocMatch APENAS no Dashboard no lado direito */}
                    {isDashboard && (
                        <div
                            className="flex items-center cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity mr-2"
                            onClick={() => router.push('/dashboard')}
                        >
                            <span className="text-[15px] font-black text-[#D4AF37] tracking-tighter">Doc</span>
                            <span className="text-[15px] font-black text-white ml-[1px] tracking-tighter">Match</span>
                        </div>
                    )}

                    {/* Ação Customizada (Nova Consulta no Header) */}
                    {rightAction && (
                        <div className="flex items-center">
                            {rightAction}
                        </div>
                    )}

                    {/* Ícones de Ação Slim */}
                    <div className={cn(
                        "flex items-center gap-0.5 pl-2",
                        (isDashboard || rightAction) && "border-l border-white/10"
                    )}>
                        {showNotifications && (
                            <button
                                className="relative text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                                onClick={() => router.push('/notificacoes')}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white/20" />
                            </button>
                        )}

                        <button
                            className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-5.5 h-5.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Lateral Expandido e Sofisticado (Z-INDEX DAVID: z-1000/1001 agora para cobrir tudo) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[1000]"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 35, stiffness: 400, mass: 0.5 }}
                            className="fixed right-4 top-4 bottom-4 w-[280px] bg-gradient-to-r from-[#F8FAFC] to-[#EFF6FF] z-[1001] shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-[32px] overflow-hidden flex flex-col border border-white/50"
                        >
                            {/* Header Interno do Menu */}
                            <div className="p-6 pb-4 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2D5284] to-[#1A365D] flex items-center justify-center shadow-md">
                                        <LayoutDashboard className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-[#2D5284] leading-none tracking-tight">CENTRAL</span>
                                        <span className="text-[10px] font-bold text-slate-400 leading-none mt-0.5 tracking-[0.1em]">DOCMATCH</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                                >
                                    <X className="w-4.5 h-4.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                            </div>

                            {/* Conteúdo com Scroll */}
                            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 no-scrollbar">
                                {/* Seção: Usuário */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mb-2">Conta</p>
                                    <div className="space-y-0.5">
                                        {[
                                            { icon: User, label: 'Meu Perfil', href: '/perfil' },
                                            { icon: Bell, label: 'Notificações', href: '/notificacoes' },
                                            { icon: Settings, label: 'Configurações', href: '/configuracoes' },
                                        ].map((item, i) => <MenuLink key={i} {...item} onClick={() => setIsMenuOpen(false)} />)}
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-100 mx-4" /> {/* Divisor Suave */}

                                {/* Seção: Comercial & Suporte */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mb-2">Comercial</p>
                                    <div className="space-y-0.5">
                                        {[
                                            { icon: Phone, label: 'Central de Vendas', href: '/comercial' },
                                            { icon: Handshake, label: 'Seja um Parceiro', href: '/parcerias' },
                                            { icon: MessageSquare, label: 'Ouvidoria', href: '/ouvidoria' },
                                        ].map((item, i) => <MenuLink key={i} {...item} onClick={() => setIsMenuOpen(false)} />)}
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-100 mx-4" /> {/* Divisor Suave */}

                                {/* Seção: Jurídico & Info */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mb-2">Jurídico</p>
                                    <div className="space-y-0.5">
                                        {[
                                            { icon: FileCheck, label: 'Termos de Uso', href: '/termos' },
                                            { icon: Shield, label: 'Privacidade (LGPD)', href: '/privacidade' },
                                            { icon: Info, label: 'Sobre o App', href: '/sobre' },
                                            { icon: Globe, label: 'Idiomas', href: '/idiomas' },
                                        ].map((item, i) => <MenuLink key={i} {...item} onClick={() => setIsMenuOpen(false)} />)}
                                    </div>
                                </div>
                            </div>

                            {/* Footer do Menu Premium */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
                                <button
                                    onClick={() => { setIsMenuOpen(false); router.push('/'); }}
                                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-[#FEE2E2] text-[#EF4444] hover:bg-[#FECACA] transition-all font-black text-[12px] uppercase tracking-wider shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Encerrar Sessão
                                </button>
                                <div className="text-center opacity-40">
                                    <p className="text-[11px] font-black text-[#2D5284] tracking-tighter grayscale">DOCMATCH <span className="text-amber-600">PRO</span></p>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1 tracking-[0.2em]">VERSION 1.6.0</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

function MenuLink({ icon: Icon, label, href, onClick }: any) {
    const router = useRouter()
    return (
        <button
            onClick={() => { onClick(); router.push(href); }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#2D5284]/5 transition-all group text-left"
        >
            <div className="w-8.5 h-8.5 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-[#2D5284] transition-all group-hover:shadow-blue-900/10">
                <Icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[14px] font-bold text-slate-600 group-hover:text-[#2D5284] leading-none transition-colors">{label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-200 ml-auto opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
        </button>
    )
}
