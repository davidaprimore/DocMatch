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
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
            <div className="max-w-lg mx-auto px-2">
                <div className="flex items-center justify-around h-[70px] pb-1">
                    {menuItems.map((item) => {
                        const isActive = getActive(item.id, item.href)
                        const isCesta = item.id === 'cesta'

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300 relative',
                                    isActive
                                        ? 'text-[#2D5284] bg-[#2D5284]/10 shadow-inner'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                                )}
                            >
                                <div className="relative">
                                    <item.icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                                    {isCesta && count > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-[#1A365D] text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                                            {count}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
