'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Shield, Eye, Moon, Globe, ChevronRight, LogOut } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ConfiguracoesPage() {
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        toast.success('Você saiu da conta.')
        router.push('/login')
    }

    const sections = [
        {
            title: 'Notificações',
            icon: Bell,
            items: [
                { label: 'Lembretes de consulta', desc: 'Receber lembretes antes das consultas', toggle: true, value: true },
                { label: 'Alertas de preço', desc: 'Notificar quando medicamentos ficarem mais baratos', toggle: true, value: true },
                { label: 'Novidades do DocMatch', desc: 'Informativos e dicas de saúde', toggle: true, value: false },
            ]
        },
        {
            title: 'Privacidade (LGPD)',
            icon: Shield,
            items: [
                { label: 'Ver meus dados', desc: 'Relatório completo dos dados armazenados', href: '/perfil' },
                { label: 'Exportar dados', desc: 'Baixar seus dados em formato JSON (Art. 20)', href: '/perfil' },
                { label: 'Política de Privacidade', desc: 'Leia como tratamos seus dados', href: '/privacidade' },
                { label: 'Termos de Uso', desc: 'Regras e condições do serviço', href: '/termos' },
            ]
        },
        {
            title: 'Aparência',
            icon: Eye,
            items: [
                { label: 'Modo escuro', desc: 'Alternar tema claro/escuro', toggle: true, value: false },
            ]
        },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Configurações</h1>
                </div>
            </header>

            <div className="px-4 space-y-4">
                {sections.map(section => (
                    <div key={section.title} className="bg-white rounded-[20px] shadow-card border border-slate-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                            <section.icon className="w-4 h-4 text-[#2D5284]" />
                            <h3 className="font-bold text-[13px] text-[#1A365D] uppercase tracking-widest">{section.title}</h3>
                        </div>
                        {section.items.map((item, i) => (
                            <div key={i} className="border-b border-slate-50 last:border-0">
                                {'href' in item ? (
                                    <Link href={item.href!} className="flex items-center gap-4 px-4 py-3.5 text-left w-full">
                                        <div className="flex-1">
                                            <p className="text-[13px] font-semibold text-slate-700">{item.label}</p>
                                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-200" />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="flex-1">
                                            <p className="text-[13px] font-semibold text-slate-700">{item.label}</p>
                                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                                        </div>
                                        <button className={`w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-[#2D5284]' : 'bg-slate-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${item.value ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                <button onClick={handleLogout} className="w-full bg-red-50 border border-red-100 text-red-600 font-bold rounded-2xl py-4 flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Sair da Conta
                </button>

                <p className="text-center text-slate-300 text-[11px] pb-2">DocMatch v1.0 · Todos os direitos reservados</p>
            </div>
            <BottomNav />
        </div>
    )
}
