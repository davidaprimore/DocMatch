'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard, href: '/profissional/dashboard' },
    { id: 'consultas', label: 'Consultas', icon: Calendar, href: '/profissional/consultas' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/profissional/pacientes' },
    { id: 'receitas', label: 'Receitas', icon: FileText, href: '/profissional/receitas' },
    { id: 'config', label: 'Config.', icon: Settings, href: '/profissional/configuracoes' },
]

export function BottomNavProfissional() {
    const pathname = usePathname()
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1A365D]/95 backdrop-blur-md border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] z-50">
            <div className="max-w-lg mx-auto px-2">
                <div className="flex items-center justify-around h-[70px] pb-1">
                    {menuItems.map(item => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                            <Link key={item.id} href={item.href}
                                className={cn('flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300',
                                    isActive ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-white/50 hover:text-white/70')}>
                                <item.icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
