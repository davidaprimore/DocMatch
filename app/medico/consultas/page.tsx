'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, Search, ChevronRight, Filter } from 'lucide-react'
import { consultasMock } from '@/data/mockData'
import { datetimeToDisplay } from '@/lib/utils/masks'

export default function ConsultasMedicoPage() {
    const router = useRouter()
    const [filtro, setFiltro] = useState('todas')

    const filtered = consultasMock.filter(c => {
        if (filtro === 'todas') return true
        return c.status === filtro
    })

    return (
        <div className="bg-[#0F2240] pb-[112.5px]">
            <header className="px-5 pt-10 pb-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                        <h1 className="text-white font-bold text-[18px]">Minha Agenda</h1>
                    </div>
                    <button className="text-white/40"><Filter className="w-5 h-5" /></button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['todas', 'agendada', 'confirmada', 'cancelada'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${filtro === f ? 'bg-[#D4AF37] text-[#1A365D]' : 'bg-white/10 text-white/40 border border-white/5'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}s
                        </button>
                    ))}
                </div>
            </header>

            <div className="px-5 space-y-3">
                {filtered.map(c => (
                    <div key={c.id} onClick={() => router.push(`/medico/consultas/${c.id}`)} className="bg-white/10 rounded-[20px] p-4 border border-white/10 flex items-center gap-4 transition-active active:scale-95">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                            <span className="text-[10px] text-white/50 uppercase font-bold">{c.data.split('-')[1] === '03' ? 'MAR' : 'ABR'}</span>
                            <span className="text-[18px] text-white font-black leading-none">{c.data.split('-')[2]}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-white font-bold text-[14px]">Paciente #{c.paciente_id.slice(-4)}</p>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${c.status === 'agendada' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : c.status === 'confirmada' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {c.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-white/40 text-[11px]">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.horario}</span>
                                <span className="flex items-center gap-1">
                                    {c.tipo === 'online' ? <><Video className="w-3 h-3" /> Teleconsulta</> : <><MapPin className="w-3 h-3" /> Presencial</>}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 text-[14px]">Nenhuma consulta encontrada.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
