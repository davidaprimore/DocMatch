'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Menu, X, LogOut, User, Settings, HelpCircle, ChevronRight, LayoutDashboard, FileCheck, Shield, Phone, MessageSquare, Handshake, Info, Globe, Star, BadgeCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUI } from '@/providers/UIProvider'

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
    const { user } = useAuth()
    const { isMenuOpen, setIsMenuOpen } = useUI()
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    // Lógica para logos condicionais
    const isMessages = title === 'Mensagens' || title === 'DocZap' || className?.includes('doczap')
    const isDashboard = variant === 'dashboard'

    // Menu component extracted for Portal usage
    const SideMenu = (
        <AnimatePresence>
            {isMenuOpen && (
                <>
                    {/* Overlay invisível apenas para capturar cliques de fechamento (o fundo real está no ClientLayout) */}
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.6 }}
                        className="fixed right-0 top-0 bottom-0 w-[75vw] z-[9999] flex flex-col pt-16 pb-8 px-8 overflow-hidden text-left items-start"
                    >
                        {/* Header do Menu Integrado - Avatar à Esquerda */}
                        <div className="flex items-center gap-4 mb-10 px-2 w-full">
                            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-1 shadow-[0_0_15px_rgba(212,175,55,0.3)] flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-white/5 overflow-hidden flex items-center justify-center backdrop-blur-sm">
                                    {user?.foto ? (
                                        <img src={user.foto} className="w-full h-full object-cover" alt={user.nome} />
                                    ) : (
                                        <span className="text-white font-black text-xl">{user?.nome?.substring(0, 2).toUpperCase() || 'DM'}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-[18px] font-black text-[#F8FAFC] shadow-slate-900/20 drop-shadow-sm leading-tight mb-1">{user?.nome || 'Usuário'}</h4>
                                <div className="flex items-center justify-start gap-2">
                                    <span className="text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full uppercase tracking-widest bg-[#D4AF37]/10">
                                        PRO {user?.plano_nome || 'Max'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Links Estilo Minimalista Gelo/Dourado */}
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 w-full">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-[#D4AF37]/60 uppercase tracking-[0.3em] mr-2">Principal</p>
                                <div className="grid gap-2">
                                    <MinimalLink icon={User} label="Meu Perfil" href="/perfil" onClick={() => setIsMenuOpen(false)} />
                                    <MinimalLink icon={Bell} label="Notificações" href="/notificacoes" onClick={() => setIsMenuOpen(false)} />
                                    <MinimalLink icon={FileCheck} label="Consultas" href="/consultas" onClick={() => setIsMenuOpen(false)} />
                                    <MinimalLink icon={Settings} label="Ajustes" href="/configuracoes" onClick={() => setIsMenuOpen(false)} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-[#D4AF37]/60 uppercase tracking-[0.3em] mr-2">Suporte</p>
                                <div className="grid gap-2">
                                    <MinimalLink icon={Phone} label="Central DocMatch" href="/contato" onClick={() => setIsMenuOpen(false)} />
                                    <MinimalLink icon={Shield} label="Segurança & LGPD" href="/privacidade" onClick={() => setIsMenuOpen(false)} />
                                    <MinimalLink icon={Info} label="Institucional" href="/sobre" onClick={() => setIsMenuOpen(false)} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Minimalista */}
                        <div className="mt-auto space-y-6 pt-6 border-t border-white/5 w-full">
                            <button
                                onClick={() => { setIsMenuOpen(false); router.push('/'); }}
                                className="flex flex-row-reverse items-center gap-3 text-[#F8FAFC]/50 hover:text-white transition-colors px-2 font-bold text-[14px] ml-auto"
                            >
                                <LogOut className="w-5 h-5" />
                                Encerrar Sessão
                            </button>
                            
                            <div className="opacity-30 px-2 text-right">
                                <p className="text-[10px] font-black text-white tracking-[0.2em]">DOCMATCH v1.6.0</p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    return (
        <header className={cn(
            "bg-[#2D5284] px-3 pt-5 pb-8 rounded-b-[32px] shadow-lg relative mb-6 transition-all duration-300 z-50",
            className
        )}>
            <div className="flex justify-between items-center h-12">
                {/* Lado Esquerdo: Identidade / Título / DocZap */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {isDashboard ? (
                        <div
                            className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-all"
                            onClick={onAvatarClick}
                        >
                            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-sm bg-white/10 flex items-center justify-center">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-[14px] font-black uppercase tracking-widest leading-none">
                                        {userName?.substring(0, 2) || 'DM'}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white/60 text-[10px] font-medium leading-none">Olá,</span>
                                <span className="text-white text-[16px] font-bold leading-tight capitalize truncate">{userName || 'Bem-vindo'}</span>
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

            {/* Renderizar Menu via Portal no final do body */}
            {mounted && createPortal(SideMenu, document.body)}
        </header>
    )
}

function MinimalLink({ icon: Icon, label, href, onClick }: any) {
    const router = useRouter()
    return (
        <button
            onClick={() => { onClick(); router.push(href); }}
            className="w-full flex flex-row-reverse items-center gap-4 px-2 py-3 rounded-2xl hover:bg-white/5 transition-all group text-right"
        >
            <div className="w-10 h-10 flex items-center justify-center transition-all">
                <Icon className="w-6 h-6 text-[#F8FAFC]/50 group-hover:text-[#D4AF37] transition-colors" />
            </div>
            <span className="text-[16px] font-bold text-[#F8FAFC]/90 drop-shadow-[0_2px_4px_rgba(30,41,59,0.5)] group-hover:text-white leading-none transition-colors">{label}</span>
            <ChevronRight className="w-4 h-4 text-[#F8FAFC]/10 mr-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 group-hover:text-[#D4AF37] rotate-180" />
        </button>
    )
}
