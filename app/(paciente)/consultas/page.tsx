'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
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
            <header className="bg-[#2D5284] px-5 pt-5 pb-10 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Minhas Consultas</h1>
                </div>
            </header>

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
                        <div key={consulta.id} className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100 cursor-pointer"
                            onClick={() => router.push(`/consultas/${consulta.id}`)}>
                            <div className="flex gap-4 items-start">
                                <img src={medico?.foto_url} className="w-14 h-14 rounded-[14px] object-cover border border-slate-100 flex-shrink-0" alt={medico?.nome} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[14px] text-slate-800">{medico?.nome}</p>
                                            <p className="text-[12px] text-[#2D5284]">{medico?.especialidade}</p>
                                        </div>
                                        <span className={`${st.bg} ${st.text} flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0`}>
                                            <StatusIcon className="w-3 h-3" /> {st.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateToDisplay(consulta.data)}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {consulta.horario}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                        {consulta.tipo === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                        {consulta.tipo === 'online' ? 'Teleconsulta' : medico?.endereco_consultorio.bairro + ', ' + medico?.endereco_consultorio.estado}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                            </div>
                        </div>
                    )
                })}
            </main>

            <div className="px-4 mt-4">
                <button onClick={() => router.push('/agendar')} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
                    + Agendar Nova Consulta
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
