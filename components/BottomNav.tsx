'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, MessageSquare, Calendar, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

interface BottomNavProps {
    activeTab?: 'inicio' | 'buscar' | 'mensagens' | 'consultas' | 'cesta'
}

const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home, href: '/dashboard' },
    { id: 'buscar', label: 'Buscar', icon: Search, href: '/buscar' },
    { id: 'mensagens', label: 'Mensagens', icon: MessageSquare, href: '/mensagens' },
    { id: 'consultas', label: 'Consultas', icon: Calendar, href: '/consultas' },
    { id: 'cesta', label: 'Cesta', icon: ShoppingCart, href: '/cesta' },
]

export function BottomNav({ activeTab }: BottomNavProps) {
    const pathname = usePathname()
    const { count } = useCart()

    const getActive = (itemId: string, itemHref: string) => {
        if (activeTab) return activeTab === itemId
        return pathname === itemHref || pathname?.startsWith(itemHref + '/')
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-50">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex items-center justify-between h-[75px] pb-1">
                    {menuItems.map((item) => {
                        const isActive = getActive(item.id, item.href)
                        const isCesta = item.id === 'cesta'

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-2xl transition-all duration-300 relative min-w-[64px]',
                                    isActive
                                        ? 'text-[#2D5284] scale-105'
                                        : 'text-slate-500 hover:text-[#2D5284]'
                                )}
                            >
                                <div className="relative">
                                    <item.icon 
                                        strokeWidth={isActive ? 2.8 : 2.2}
                                        className={cn(
                                            'w-6 h-6 transition-all duration-300',
                                            isActive 
                                                ? 'text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]' 
                                                : 'text-[#D4AF37]/80'
                                        )} 
                                    />
                                    {isCesta && count > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-[#1A365D] text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                            {count}
                                        </span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold tracking-tight transition-colors",
                                    isActive ? "text-[#2D5284]" : "text-slate-500"
                                )}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <span className="absolute -bottom-1 w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
