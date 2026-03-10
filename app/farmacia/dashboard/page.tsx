'use client'

import { useRouter } from 'next/navigation'
import { Store, Package, Users, BarChart3, Settings, LogOut, ChevronRight, Plus } from 'lucide-react'

export default function DashboardFarmaciaPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0F172A] pb-24 text-white">
            <header className="px-5 pt-12 pb-8 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px]">Farmácia Parceira</p>
                            <h1 className="text-white font-black text-[18px]">DrogaRaia Unidade 04</h1>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <Settings className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                        <Package className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-2xl font-black">1.240</p>
                        <p className="text-slate-500 text-[10px]">SKUs Ativos</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                        <BarChart3 className="w-5 h-5 text-green-400 mb-2" />
                        <p className="text-2xl font-black">84%</p>
                        <p className="text-slate-500 text-[10px]">Taxa de Conversão</p>
                    </div>
                </div>
            </header>

            <div className="px-5 space-y-4">
                <h2 className="text-slate-300 font-bold text-[14px] uppercase tracking-wider px-1">Gestão de Inventário</h2>

                <div className="bg-slate-800/40 rounded-3xl border border-white/5 divide-y divide-white/5">
                    <button onClick={() => router.push('/farmacia/inventario')} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-blue-400" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Meus Produtos</p>
                                <p className="text-slate-500 text-[10px]">Gerenciar preços e estoque</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>

                    <button onClick={() => router.push('/farmacia/inventario/importar')} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center"><Plus className="w-5 h-5 text-purple-400" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Importar Planilha</p>
                                <p className="text-slate-500 text-[10px]">Sincronizar preços via CSV</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                <button className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-8 opacity-50">
                    <LogOut className="w-4 h-4" /> Sair do Painel
                </button>
            </div>
        </div>
    )
}
