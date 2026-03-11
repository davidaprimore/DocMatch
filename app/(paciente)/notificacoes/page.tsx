'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Calendar, FileText, Tag, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { dateRelative } from '@/lib/utils/masks'

const mockNotificacoes = [
    { id: '1', tipo: 'lembrete_consulta', titulo: 'Consulta amanhã às 10:00', corpo: 'Dr. Lucas Pereira — Cardiologista, consultório Barra', lida: false, enviada_em: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', tipo: 'receita_emitida', titulo: 'Nova receita disponível', corpo: 'Dra. Ana Silva emitiu uma receita digital para você.', lida: false, enviada_em: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', tipo: 'preco_alerta', titulo: '💊 Amoxicilina 30% mais barata!', corpo: 'Pague Menos do Bairro X está com promoção. Economize R$ 8,90 vs ontem.', lida: true, enviada_em: new Date(Date.now() - 86400000).toISOString() },
    { id: '4', tipo: 'plano_vencendo', titulo: 'Seu plano Plus vence em 3 dias', corpo: 'Renove agora com 10% de desconto e continue com histórico ilimitado.', lida: true, enviada_em: new Date(Date.now() - 172800000).toISOString() },
    { id: '5', tipo: 'avaliacao', titulo: 'Como foi sua consulta?', corpo: 'Avalie sua experiência com a Dra. Fernanda Lima e ajude outros pacientes.', lida: true, enviada_em: new Date(Date.now() - 259200000).toISOString() },
]

const tipoConfig: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
    lembrete_consulta: { icon: Calendar, bg: 'bg-blue-100', color: 'text-[#2D5284]' },
    receita_emitida: { icon: FileText, bg: 'bg-green-100', color: 'text-green-700' },
    preco_alerta: { icon: Tag, bg: 'bg-amber-100', color: 'text-amber-700' },
    plano_vencendo: { icon: AlertCircle, bg: 'bg-orange-100', color: 'text-orange-700' },
    avaliacao: { icon: CheckCircle2, bg: 'bg-purple-100', color: 'text-purple-700' },
}

export default function NotificacoesPage() {
    const router = useRouter()
    const naoLidas = mockNotificacoes.filter(n => !n.lida).length

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                        <h1 className="text-white font-bold text-[18px]">Notificações</h1>
                    </div>
                    {naoLidas > 0 && <span className="bg-[#D4AF37] text-[#1A365D] text-[11px] font-black px-2.5 py-1 rounded-full">{naoLidas} novas</span>}
                </div>
            </header>

            <main className="px-4 space-y-2">
                {mockNotificacoes.map(n => {
                    const cfg = tipoConfig[n.tipo] ?? { icon: Info, bg: 'bg-slate-100', color: 'text-slate-600' }
                    const Icon = cfg.icon
                    return (
                        <div key={n.id} className={`bg-white rounded-[20px] p-4 shadow-card border transition-colors ${!n.lida ? 'border-[#2D5284]/20 bg-blue-50/40' : 'border-slate-100'}`}>
                            <div className="flex gap-3">
                                <div className={`w-10 h-10 rounded-[12px] ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className={`font-bold text-[13px] ${!n.lida ? 'text-[#1A365D]' : 'text-slate-700'}`}>{n.titulo}</p>
                                        {!n.lida && <div className="w-2 h-2 bg-[#2D5284] rounded-full flex-shrink-0 mt-1 ml-2" />}
                                    </div>
                                    <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{n.corpo}</p>
                                    <p className="text-[10px] text-slate-400 mt-1.5">{dateRelative(n.enviada_em)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
            <BottomNav />
        </div>
    )
}
