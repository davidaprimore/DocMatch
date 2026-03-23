'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, PlusSquare, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home, href: '/medico/dashboard' },
    { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/medico/agenda' },
    { id: 'receita', label: 'Receita', icon: PlusSquare, href: '/medico/receitas/nova' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/medico/pacientes' },
    { id: 'perfil', label: 'Perfil', icon: Settings, href: '/medico/perfil' },
]

export function BottomNavMedico() {
    const pathname = usePathname()

    // Ocultar a NavBar inteira em rotas flow completas se necessário
    if (pathname?.includes('/receitas/nova')) return null

    const getActive = (itemHref: string) => {
        return pathname === itemHref || pathname?.startsWith(itemHref + '/')
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-50">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex items-center justify-between h-[75px] pb-1">
                    {menuItems.map((item) => {
                        const isActive = getActive(item.href)

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
