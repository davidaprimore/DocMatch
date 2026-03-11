'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, CheckCircle2, XCircle, AlertCircle, CreditCard, MessageCircle, MoreVertical, Stethoscope } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { consultasMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'
import { toast } from 'sonner'
import Image from 'next/image'

const statusConfig = {
    agendada: { label: 'Agendada', bg: 'bg-blue-50', text: 'text-[#2D5284]', icon: Clock },
    confirmada: { label: 'Confirmada', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    realizada: { label: 'Realizada', bg: 'bg-slate-50', text: 'text-slate-600', icon: CheckCircle2 },
    cancelada: { label: 'Cancelada', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
    nao_compareceu: { label: 'Faltou', bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
}

export default function ConsultaDetalhesPage({ params }: { params: { id: string } }) {
    const router = useRouter()

    // Identificar a Consulta Dinamicamente
    const consulta = consultasMock.find((c: any) => c.id === params.id)

    if (!consulta) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-5">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-[#1A365D]">Consulta não encontrada</h1>
                <p className="text-slate-500 text-center mt-2 mb-6">A consulta que você tentou acessar não existe ou foi removida.</p>
                <button onClick={() => router.push('/consultas')} className="bg-[#2D5284] text-white font-bold py-3 px-6 rounded-2xl w-full">Voltar para Minhas Consultas</button>
            </div>
        )
    }

    const medico = medicosMock.find((m: any) => m.id === consulta.medico_id)
    const st = statusConfig[consulta.status as keyof typeof statusConfig] || statusConfig.agendada
    const StatusIcon = st.icon

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <header className="bg-[#2D5284] px-5 pt-5 pb-8 rounded-b-3xl shadow-md z-20 mb-6 relative">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Detalhes da Consulta</h1>
                    </div>
                </div>
            </header>

            <main className="px-5 space-y-4 -mt-4">

                {/* 1. Status Banner */}
                <div className={`rounded-2xl p-4 flex items-center justify-between shadow-sm border ${st.bg} border-white/50`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                            <StatusIcon className={`w-5 h-5 ${st.text}`} />
                        </div>
                        <div>
                            <p className="text-[12px] text-slate-500 font-medium uppercase tracking-wide">Status</p>
                            <p className={`font-black text-[16px] ${st.text}`}>{st.label}</p>
                        </div>
                    </div>
                    {consulta.status === 'agendada' && (
                        <span className="bg-white/60 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                            Próxima
                        </span>
                    )}
                </div>

                {/* 2. Doutor Info */}
                <div
                    onClick={() => router.push(`/buscar/${medico?.id}`)}
                    className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                >
                    <img src={medico?.foto_url} alt={medico?.nome} className="w-16 h-16 rounded-[16px] object-cover ring-2 ring-slate-50" />
                    <div className="flex-1">
                        <h2 className="font-bold text-[16px] text-slate-800 leading-tight">{medico?.nome}</h2>
                        <p className="text-[13px] text-[#2D5284] font-medium">{medico?.especialidade}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{medico?.crm}</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 transform rotate-180" />
                </div>

                {/* 3. Data & Hora */}
                <div className="bg-white rounded-[20px] p-5 shadow-card border border-slate-100 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#2D5284]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 font-medium uppercase">Data</p>
                            <p className="font-bold text-slate-800 text-[14px]">{dateToDisplay(consulta.data)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 border-l border-slate-100 pl-4">
                        <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-[#2D5284]" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 font-medium uppercase">Horário</p>
                            <p className="font-bold text-slate-800 text-[14px]">{consulta.horario}</p>
                        </div>
                    </div>
                </div>

                {/* 4. Localização / Telemedicina */}
                <div className="bg-white rounded-[20px] p-5 shadow-card border border-slate-100">
                    <h3 className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-3">Local do Atendimento</h3>
                    <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${consulta.tipo === 'online' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-[#2D5284]'}`}>
                            {consulta.tipo === 'online' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            {consulta.tipo === 'online' ? (
                                <>
                                    <p className="font-bold text-slate-800 text-[15px]">Teleconsulta (Via DocMatch)</p>
                                    <p className="text-[12px] text-slate-500 leading-relaxed mt-1">O link para a sala de vídeo será habilitado 10 minutos antes do horário agendado.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-bold text-slate-800 text-[15px]">{medico?.endereco_consultorio.logradouro}, {medico?.endereco_consultorio.numero}</p>
                                    <p className="text-[12px] text-slate-500 mt-1">{medico?.endereco_consultorio.bairro} — {medico?.endereco_consultorio.cidade}/{medico?.endereco_consultorio.estado}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 5. Resumo do Pagamento */}
                <div className="bg-white rounded-[20px] p-5 shadow-card border border-slate-100 flex flex-col gap-3">
                    <h3 className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-1">Resumo Financeiro</h3>
                    <div className="flex justify-between items-center text-[14px]">
                        <span className="text-slate-600 font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> Valor da Consulta</span>
                        <span className="font-black text-slate-800">R$ {consulta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {consulta.plano_saude_utilizado && (
                        <div className="flex justify-between items-center text-[12px] pt-2 border-t border-slate-100">
                            <span className="text-slate-500">Convênio</span>
                            <span className="font-semibold text-[#2D5284] bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{consulta.plano_saude_utilizado.operadora}</span>
                        </div>
                    )}
                </div>
            </main>

            {/* Fixo Inferior: Action Panel Integrado */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                {consulta.status === 'agendada' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/mensagens')}
                            className="bg-slate-100 text-[#2D5284] font-bold rounded-2xl p-4 flex items-center justify-center shrink-0 w-14 hover:bg-slate-200 transition-colors"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        {consulta.tipo === 'online' ? (
                            <button className="flex-1 bg-[#2D5284] text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-md hover:brightness-110 transition-all">
                                <Video className="w-5 h-5" /> Iniciar Videochamada
                            </button>
                        ) : (
                            <button className="flex-1 bg-[#2D5284] text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-md hover:brightness-110 transition-all">
                                <MapPin className="w-5 h-5" /> Rota para o Local
                            </button>
                        )}
                    </div>
                )}

                {consulta.status === 'realizada' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push(`/agendar/${medico?.id}`)}
                            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"
                        >
                            <Calendar className="w-5 h-5" /> Agendar Retorno
                        </button>
                        <button
                            onClick={() => toast.info('Redirecionando para avaliação...')}
                            className="bg-slate-100 text-[#2D5284] font-bold rounded-2xl px-6 py-4 flex items-center justify-center shrink-0 text-[13px] hover:bg-slate-200 transition-colors"
                        >
                            Avaliar
                        </button>
                    </div>
                )}

                {consulta.status === 'cancelada' && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => router.push(`/buscar/${medico?.id}`)}
                            className="w-full bg-slate-800 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] shadow-md hover:brightness-110 transition-all"
                        >
                            <Stethoscope className="w-5 h-5 opacity-80" /> Ver Perfil do Médico
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
