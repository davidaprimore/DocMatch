'use client'

import { LayoutGrid, Users, Stethoscope, Store, ShieldAlert, Settings, Bell, Search, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-black tracking-tighter">METRIKA <span className="text-red-600">ADMIN</span></h1>
                    <div className="flex gap-3">
                        <button className="relative w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                            <Bell className="w-5 h-5 text-zinc-400" />
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-black"></span>
                        </button>
                    </div>
                </div>
                <p className="text-zinc-500 text-xs">Visão Geral do Ecossistema DocMatch</p>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Usuários Ativos</p>
                    <p className="text-3xl font-black">12.482</p>
                    <div className="flex items-center gap-1 text-green-500 text-[10px] mt-2 font-bold">
                        <TrendingUp className="w-3 h-3" /> +12% vs last month
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Receitas Validadas</p>
                    <p className="text-3xl font-black">45.091</p>
                    <div className="flex items-center gap-1 text-blue-500 text-[10px] mt-2 font-bold">
                        <TrendingUp className="w-3 h-3" /> +8% vs last month
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest px-2">Painéis de Controle</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Profissionais', icon: Stethoscope, color: 'bg-emerald-500/10 text-emerald-500', sub: '12 pendentes' },
                        { label: 'Farmácias', icon: Store, color: 'bg-blue-500/10 text-blue-500', sub: '246 ativas' },
                        { label: 'LGPD / Dados', icon: ShieldAlert, color: 'bg-amber-500/10 text-amber-500', sub: '0 solicitações' },
                        { label: 'Configurações', icon: Settings, color: 'bg-zinc-800 text-zinc-400', sub: 'Sistema v1.0' },
                    ].map(card => (
                        <button key={card.label} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl text-left hover:bg-zinc-800 transition-all">
                            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3 shadow-inner`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <p className="font-bold text-[13px]">{card.label}</p>
                            <p className="text-zinc-600 text-[9px] mt-0.5">{card.sub}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
