'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Phone, Heart, Calendar, Award, Clock } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { medicosMock } from '@/data/mockData'

export default function PerfilMedicoPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const medico = medicosMock.find(m => m.id === params.id) ?? medicosMock[0]

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header com foto */}
            <div className="relative">
                <div className="bg-[#2D5284] h-48 rounded-b-[32px]" />
                <button onClick={() => router.back()} className="absolute top-5 left-5 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button className="absolute top-5 right-5 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-red-400">
                    <Heart className="w-5 h-5 fill-red-400" />
                </button>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <img src={medico.foto_url} className="w-32 h-32 rounded-[28px] object-cover border-4 border-white shadow-xl" alt={medico.nome} />
                    {medico.destaque && (
                        <span className="absolute -top-2 right-0 bg-[#D4AF37] text-[#1A365D] text-[9px] font-black px-2 py-0.5 rounded-full">⭐ DESTAQUE</span>
                    )}
                </div>
            </div>

            <div className="pt-20 px-5">
                {/* Nome e Especialidade */}
                <div className="text-center mb-5">
                    <h1 className="text-[20px] font-black text-[#1A365D]">{medico.nome}</h1>
                    <p className="text-[#2D5284] font-semibold text-[14px]">{medico.especialidade}</p>
                    {medico.subespecialidade && <p className="text-slate-400 text-[12px]">{medico.subespecialidade}</p>}
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{medico.crm}</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { icon: Star, label: 'Avaliação', value: medico.avaliacao.toString(), extra: `${medico.total_avaliacoes} avaliações` },
                        { icon: Clock, label: 'Experiência', value: '10+', extra: 'anos' },
                        { icon: Award, label: 'Consultas', value: '1.5k', extra: 'realizadas' },
                    ].map(({ icon: Icon, label, value, extra }) => (
                        <div key={label} className="bg-white rounded-[16px] p-3 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100">
                            <Icon className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] mx-auto mb-1" />
                            <p className="font-black text-[18px] text-[#1A365D] leading-none">{value}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{extra}</p>
                        </div>
                    ))}
                </div>

                {/* Bio */}
                <div className="bg-white rounded-[20px] p-4 mb-4 shadow-card border border-slate-100">
                    <h3 className="font-bold text-[#1A365D] text-[13px] uppercase tracking-widest mb-2">Sobre</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{medico.bio}</p>
                </div>

                {/* Local */}
                <div className="bg-white rounded-[20px] p-4 mb-4 shadow-card border border-slate-100">
                    <h3 className="font-bold text-[#1A365D] text-[13px] uppercase tracking-widest mb-3">Localização</h3>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#2D5284] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[13px] font-semibold text-slate-800">{medico.endereco_consultorio.logradouro}, {medico.endereco_consultorio.numero}</p>
                            <p className="text-[12px] text-slate-500">{medico.endereco_consultorio.bairro} — {medico.endereco_consultorio.cidade}/{medico.endereco_consultorio.estado}</p>
                        </div>
                    </div>
                </div>

                {/* Planos */}
                <div className="bg-white rounded-[20px] p-4 mb-4 shadow-card border border-slate-100">
                    <h3 className="font-bold text-[#1A365D] text-[13px] uppercase tracking-widest mb-3">Planos Aceitos</h3>
                    <div className="flex flex-wrap gap-2">
                        {medico.planos_saude_aceitos.map(p => (
                            <span key={p.id} className="bg-blue-50 text-[#2D5284] text-[11px] font-semibold px-3 py-1 rounded-full">{p.operadora}</span>
                        ))}
                        <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full">Particular: R$ {medico.valor_consulta_particular}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3 mt-6 mb-6">
                    <button className="flex-1 bg-slate-100 text-[#2D5284] font-bold rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px]">
                        <Phone className="w-5 h-5" /> Contato
                    </button>
                    <button onClick={() => router.push('/agendar')} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
                        <Calendar className="w-5 h-5" /> Agendar
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
