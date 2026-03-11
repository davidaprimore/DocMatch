'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { consultasMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'

const statusConfig = {
    agendada: { label: 'Agendada', bg: 'bg-blue-50', text: 'text-[#2D5284]', icon: Clock },
    confirmada: { label: 'Confirmada', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    realizada: { label: 'Realizada', bg: 'bg-slate-50', text: 'text-slate-600', icon: CheckCircle2 },
    cancelada: { label: 'Cancelada', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
    nao_compareceu: { label: 'Faltou', bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
}

export default function ConsultasPage() {
    const router = useRouter()
    const medicoMap = Object.fromEntries(medicosMock.map(m => [m.id, m]))

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <Header title="Minhas Consultas" showBackButton showNotifications />

            <div className="px-4 mb-4 flex gap-2">
                {['Todas', 'Agendadas', 'Realizadas', 'Canceladas'].map((f, i) => (
                    <button key={f} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${i === 0 ? 'bg-[#2D5284] text-white border-[#2D5284]' : 'bg-white text-slate-600 border-slate-200'}`}>
                        {f}
                    </button>
                ))}
            </div>

            <main className="px-4 space-y-3">
                {consultasMock.map(consulta => {
                    const medico = medicoMap[consulta.medico_id]
                    const st = statusConfig[consulta.status]
                    const StatusIcon = st.icon
                    return (
                        <div key={consulta.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-50 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/consultas/${consulta.id}`)}>
                            <div className="flex gap-4 items-center">
                                <img src={medico?.foto_url} className="w-14 h-14 rounded-[18px] object-cover shadow-sm border border-slate-100 flex-shrink-0" alt={medico?.nome} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-[15px] text-slate-800 truncate">{medico?.nome}</p>
                                        <span className={`${st.bg} ${st.text} flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0 uppercase tracking-tight`}>
                                            <StatusIcon className="w-3 h-3" /> {st.label}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-medium text-[#2D5284]">{medico?.especialidade}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    {dateToDisplay(consulta.data)}
                                </div>
                                <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    {consulta.horario}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50/50 p-2.5 rounded-xl">
                                <div className="flex items-center gap-2 font-medium">
                                    {consulta.tipo === 'online' ? <Video className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-red-300" />}
                                    {consulta.tipo === 'online' ? 'Teleconsulta Online' : `${medico?.endereco_consultorio.bairro}, ${medico?.endereco_consultorio.estado}`}
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </div>
                    )
                })}
            </main>

            <div className="px-4 mt-4">
                <button onClick={() => router.push('/buscar')} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform">
                    + Agendar Nova Consulta
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
