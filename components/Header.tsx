'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Menu, X, LogOut, User, Settings, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
    onAvatarClick
}: HeaderProps) {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className={cn(
            "bg-[#2D5284] px-5 pt-3 pb-8 rounded-b-[32px] shadow-md relative z-10 mb-6",
            className
        )}>
            {/* Linha Superior: Back Button/Avatar e Logo */}
            <div className="flex justify-between items-start -mb-1">
                <div className="flex items-center gap-3">
                    {variant === 'page' && showBackButton && (
                        <button 
                            onClick={onBack || (() => router.back())} 
                            className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95 mt-1"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    {variant === 'dashboard' && userAvatar && (
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={onAvatarClick}>
                            <div className="w-14 h-14 rounded-2xl border-2 border-white/20 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col mt-1">
                                <span className="text-white/80 text-[11px] font-medium leading-none mb-0.5 whitespace-nowrap">Olá,</span>
                                <span className="text-white text-[15px] font-bold leading-none whitespace-nowrap">{userName}</span>
                            </div>
                        </div>
                    )}
                    
                    {variant === 'page' && title && (
                        <h1 className="text-white font-bold text-[18px] mt-2 ml-1">{title}</h1>
                    )}
                    {variant === 'page' && !title && children && (
                        <div className="mt-2">{children}</div>
                    )}
                </div>
                
                {/* Lado Direito: Logo e Ícones abaixo dele */}
                <div className="flex flex-col items-end">
                    {/* Logo DocMatch/Zap */}
                    <div className="flex items-center cursor-pointer mb-1" onClick={() => router.push('/dashboard')}>
                        <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                        <span className="text-[18px] font-bold text-white ml-[1px] leading-none">
                            {(title === 'DocZap' || title === 'Mensagens' || className?.includes('doczap')) ? 'Zap' : 'Match'}
                        </span>
                    </div>

                    {/* Ícones (Sino e Menu) - Alinhados à direita do DocMatch e mais próximos */}
                    <div className="flex items-center gap-3 pr-1 -mt-1">
                        {showNotifications && (
                            <button 
                                className="relative text-white hover:text-gray-200 transition-colors p-1" 
                                onClick={() => router.push('/notificacoes')}
                            >
                                <Bell className="w-5 h-5 text-white shadow-sm" />
                                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold border border-[#2D5284] shadow-sm">3</span>
                            </button>
                        )}
                        
                        <button 
                            className="text-white hover:text-gray-200 transition-colors p-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6 text-white shadow-sm" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Suspenso Elegante (Sanduíche) */}
            {isMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-[#0F2240]/40 backdrop-blur-sm z-[60]" 
                        onClick={() => setIsMenuOpen(false)} 
                    />
                    <div className="absolute right-5 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl py-3 z-[70] border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="px-4 py-2 border-b border-slate-100 mb-2 flex justify-between items-center">
                            <span className="text-[12px] font-black text-[#1A365D] uppercase tracking-wider">DocMatch Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <nav className="space-y-1 px-2">
                            {[
                                { icon: User, label: 'Meu Perfil', href: '/perfil' },
                                { icon: Bell, label: 'Notificações', href: '/notificacoes' },
                                { icon: Settings, label: 'Configurações', href: '/configuracoes' },
                                { icon: HelpCircle, label: 'Ajuda', href: '/ajuda' },
                                { icon: LogOut, label: 'Sair', href: '/', color: 'text-red-500' }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        router.push(item.href)
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2D5284]/10 transition-colors text-left",
                                        item.color || "text-[#1A365D]"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-[14px] font-bold">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </>
            )}
        </header>
    )
}
