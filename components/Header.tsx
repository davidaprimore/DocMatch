'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
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

    return (
        <header className={cn(
            "bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-[32px] shadow-md relative z-20 mb-6",
            className
        )}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <button 
                            onClick={onBack || (() => router.back())} 
                            className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    {userAvatar && (
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={onAvatarClick}>
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/80 text-[11px] font-medium leading-none mb-0.5 whitespace-nowrap">Bem-vinda,</span>
                                <span className="text-white text-[15px] font-bold leading-none whitespace-nowrap">{userName}</span>
                            </div>
                        </div>
                    )}

                    {title && <h1 className="text-white font-bold text-[18px]">{title}</h1>}
                    {!title && !userAvatar && children}
                </div>

                <div className="flex items-center gap-4">
                    {showNotifications && (
                        <button 
                            className="relative text-white hover:text-gray-200 transition-colors" 
                            onClick={() => router.push('/notificacoes')}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold border border-[#2D5284]">3</span>
                        </button>
                    )}
                    <div className="flex items-center" onClick={() => router.push('/dashboard')}>
                        <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                        <span className="text-[18px] font-bold text-white ml-[1px] leading-none">Match</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
