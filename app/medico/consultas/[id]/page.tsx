'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, MapPin, Video, User, Phone, Clipboard, FileText, CheckCircle, ChevronRight } from 'lucide-react'
import { consultasMock } from '@/data/mockData'
import { toast } from 'sonner'

export default function DetalheConsultaMedicoPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    // No Next.js 15, params pode ser uma promise ou objeto dependendo do setup, aqui usamos como objeto sync para simplicidade mock
    const consulta = consultasMock.find(c => c.id === params.id) || consultasMock[0]

    const handleFinalizar = () => {
        toast.success('Consulta finalizada! Prontuário salvo.')
        router.push('/medico/receitas/nova')
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-24">
            <header className="px-5 pt-10 pb-10 bg-[#1A365D] rounded-b-[40px] shadow-2xl relative">
                <button onClick={() => router.back()} className="absolute top-10 left-5 text-white bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="text-center mt-6">
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-1">Detalhes do Agendamento</p>
                    <h1 className="text-white font-black text-[24px]">Consulta #{consulta.id.slice(-4)}</h1>
                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-2 ${consulta.status === 'confirmada' ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-[#1A365D]'}`}>
                        {consulta.status.toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="px-5 -mt-8 space-y-4">
                {/* Card do Paciente */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-5 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/30">
                            <User className="w-7 h-7 text-[#D4AF37]" />
                        </div>
                        <div>
                            <p className="text-white font-black text-[16px]">Paciente #{consulta.paciente_id.slice(-6)}</p>
                            <p className="text-white/40 text-[11px]">ID Verificado · Convênio Ativo</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5">
                            <Clock className="w-4 h-4 text-[#D4AF37] mb-1" />
                            <span className="text-white font-bold text-[12px]">{consulta.horario}</span>
                            <span className="text-white/30 text-[9px] uppercase">Horário</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5">
                            {consulta.tipo === 'online' ? <Video className="w-4 h-4 text-blue-400 mb-1" /> : <MapPin className="w-4 h-4 text-green-400 mb-1" />}
                            <span className="text-white font-bold text-[12px]">{consulta.tipo === 'online' ? 'Vídeo' : 'Clínica'}</span>
                            <span className="text-white/30 text-[9px] uppercase">Tipo</span>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                    <button onClick={() => router.push('/medico/receitas/nova')} className="w-full bg-white/5 border border-white/10 h-16 rounded-[24px] flex items-center justify-between px-6 transition-active active:scale-95">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#D4AF37]" />
                            <span className="text-white font-bold text-[14px]">Emitir Receita Digital</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20" />
                    </button>

                    <button className="w-full bg-white/5 border border-white/10 h-16 rounded-[24px] flex items-center justify-between px-6 transition-active active:scale-95">
                        <div className="flex items-center gap-3">
                            <Clipboard className="w-5 h-5 text-white/40" />
                            <span className="text-white font-bold text-[14px]">Ver Prontuário</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20" />
                    </button>
                </div>
            </div>

            <div className="fixed bottom-6 left-5 right-5">
                <button onClick={handleFinalizar} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-[0_12px_24px_rgba(22,163,74,0.3)] transition-active active:scale-95 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> FINALIZAR CONSULTA
                </button>
            </div>
        </div>
    )
}
