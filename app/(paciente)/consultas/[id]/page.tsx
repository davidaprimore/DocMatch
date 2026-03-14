'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Video, CheckCircle2, XCircle, AlertCircle, CreditCard, MessageCircle, MoreVertical, Stethoscope, RefreshCcw, Trash2 } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { dateToDisplay } from '@/lib/utils/masks'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAgendamento } from '@/hooks/useAgendamento'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useDialog } from '@/components/ui/CustomDialog'

const statusConfig = {
    pendente: { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock },
    agendada: { label: 'Agendada', bg: 'bg-blue-50', text: 'text-[#2D5284]', icon: Clock },
    confirmada: { label: 'Confirmada', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    realizada: { label: 'Realizada', bg: 'bg-slate-50', text: 'text-slate-600', icon: CheckCircle2 },
    cancelada: { label: 'Cancelada', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
    nao_compareceu: { label: 'Faltou', bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
}

export default function ConsultaDetalhesPage() {
    const router = useRouter()
    const params = useParams()
    const { showDialog } = useDialog()
    const consultaId = params?.id as string
    const { agendamento, isLoading, error, setAgendamento } = useAgendamento(consultaId)
    const [isActionLoading, setIsActionLoading] = useState(false)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-5">
                <Loader2 className="w-10 h-10 text-[#2D5284] animate-spin" />
                <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-[12px]">Carregando detalhes...</p>
            </div>
        )
    }

    if (error || !agendamento) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-5 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-[#1A365D]">Consulta não encontrada</h1>
                <p className="text-slate-500 mt-2 mb-6">{error || 'A consulta que você tentou acessar não existe ou foi removida.'}</p>
                <button onClick={() => router.push('/consultas')} className="bg-[#2D5284] text-white font-bold py-3 px-6 rounded-2xl w-full">Voltar para Minhas Consultas</button>
            </div>
        )
    }

    const medico = agendamento.medicos
    const st = statusConfig[agendamento.status as keyof typeof statusConfig] || statusConfig.agendada
    const StatusIcon = st.icon

    const handleCancelar = async () => {
        const dataConsulta = new Date(agendamento.data_horario)
        const agora = new Date()
        const diffHoras = (dataConsulta.getTime() - agora.getTime()) / (1000 * 60 * 60)
        const ehReembolsavel = diffHoras >= 48

        showDialog({
            title: 'Cancelar Consulta?',
            message: ehReembolsavel 
                ? 'Deseja realmente cancelar sua consulta? Como falta mais de 48h, você terá direito ao reembolso integral.'
                : 'Atenção: Cancelamentos feitos com menos de 48h de antecedência não possuem direito a reembolso. Deseja continuar?',
            type: 'confirm',
            onConfirm: async () => {
                setIsActionLoading(true)
                try {
                    const { error } = await supabase
                        .from('agendamentos')
                        .update({ 
                            status: 'cancelada',
                            cancelado_at: new Date().toISOString(),
                            reembolsavel: ehReembolsavel
                        })
                        .eq('id', agendamento.id)

                    if (error) throw error
                    
                    setAgendamento({ ...agendamento, status: 'cancelada' })
                    toast.success('Consulta cancelada com sucesso.')
                } catch (err) {
                    console.error(err)
                    toast.error('Erro ao cancelar consulta.')
                } finally {
                    setIsActionLoading(false)
                }
            }
        })
    }

    const handleRemarcar = () => {
        const dataConsulta = new Date(agendamento.data_horario)
        const agora = new Date()
        const diffHoras = (dataConsulta.getTime() - agora.getTime()) / (1000 * 60 * 60)

        if (diffHoras < 24) {
            toast.error('Remarcações só são permitidas com até 24h de antecedência.')
            return
        }

        router.push(`/agendar/${medico.id}?rescheduleId=${agendamento.id}`)
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden pt-1">
            <div className="relative z-10 pb-24 flex flex-col font-sans">
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
                        <div className="flex flex-col items-end gap-2">
                            {(agendamento.status === 'agendada' || agendamento.status === 'confirmada' || agendamento.status === 'pendente') && (
                                <span className="bg-white/60 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    Ativa
                                </span>
                            )}
                            {(() => {
                                const agora = new Date()
                                const dataConsulta = new Date(agendamento.data_horario)
                                const diffMs = dataConsulta.getTime() - agora.getTime()
                                const diffHours = diffMs / (1000 * 60 * 60)
                                if (diffMs > 0 && diffHours <= 72 && (['agendada', 'confirmada', 'pendente'].includes(agendamento.status))) {
                                    let texto = ''
                                    let color = 'from-amber-500 to-amber-600'
                                    if (diffHours > 48) texto = `Em 3 dias`
                                    else if (diffHours > 24) texto = `Em 2 dias`
                                    else {
                                        const h = Math.floor(diffHours)
                                        const m = Math.floor((diffHours - h) * 60)
                                        texto = `Faltam ${h}h ${m}m`
                                        color = 'from-red-500 to-red-600 animate-pulse'
                                    }
                                    return (
                                        <div className={cn(
                                            "bg-gradient-to-r text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest border border-white/20 flex items-center gap-1.5",
                                            color
                                        )}>
                                            <Clock className="w-3 h-3" />
                                            {texto}
                                        </div>
                                    )
                                }
                                return null
                            })()}
                        </div>
                    </div>

                    {/* 2. Doutor Info */}
                    <div
                        onClick={() => router.push(`/buscar/${medico?.id}`)}
                        className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                    >
                        <img 
                            src={medico?.foto || 'https://via.placeholder.com/150'} 
                            alt={medico?.nome} 
                            className="w-16 h-16 rounded-[16px] object-cover ring-2 ring-slate-50" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(medico?.nome || 'M') + '&background=2D5284&color=fff&size=200';
                            }}
                        />
                        <div className="flex-1">
                            <h2 className="font-bold text-[16px] text-slate-800 leading-tight">{medico?.nome}</h2>
                            <p className="text-[13px] text-[#2D5284] font-medium">{medico?.especialidades?.nome || 'Médico'}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">CRM: {medico?.crm}</p>
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
                                <p className="font-bold text-slate-800 text-[14px]">{dateToDisplay(agendamento.data_horario.split('T')[0])}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 border-l border-slate-100 pl-4">
                            <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-[#2D5284]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-medium uppercase">Horário</p>
                                <p className="font-bold text-slate-800 text-[14px]">
                                    {new Date(agendamento.data_horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Localização / Telemedicina */}
                    <div className="bg-white rounded-[20px] p-5 shadow-card border border-slate-100">
                        <h3 className="text-[12px] text-slate-500 font-bold uppercase tracking-wider mb-3">Local do Atendimento</h3>
                        <div className="flex gap-4 items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${agendamento.tipo === 'online' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-[#2D5284]'}`}>
                                {agendamento.tipo === 'online' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                {agendamento.tipo === 'online' ? (
                                    <>
                                        <p className="font-bold text-slate-800 text-[15px]">Teleconsulta (Via DocMatch)</p>
                                        <p className="text-[12px] text-slate-500 leading-relaxed mt-1">O link para a sala de vídeo será habilitado 10 minutos antes do horário agendado.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-slate-800 text-[15px]">
                                            {medico?.endereco?.logradouro ? `${medico.endereco.logradouro}, ${medico.endereco.numero}` : 'Consultório Particular'}
                                        </p>
                                        <p className="text-[12px] text-slate-500 mt-1">{medico?.endereco?.bairro || ''} {medico?.endereco?.cidade ? `— ${medico.endereco.cidade}` : ''}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 5. Ações de Gestão (Remarcar/Cancelar) - Somente se não realizada/cancelada */}
                    {(agendamento.status === 'agendada' || agendamento.status === 'confirmada' || agendamento.status === 'pendente') && (
                        <div className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100 flex gap-3">
                            <button 
                                onClick={handleRemarcar}
                                className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors gap-1"
                            >
                                <RefreshCcw className="w-5 h-5 text-[#2D5284]" />
                                <span className="text-[11px] font-bold text-[#1A365D]">Remarcar</span>
                            </button>
                            <button 
                                onClick={handleCancelar}
                                className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl border border-red-100 hover:bg-red-50 transition-colors gap-1"
                            >
                                <Trash2 className="w-5 h-5 text-red-500" />
                                <span className="text-[11px] font-bold text-red-600">Cancelar</span>
                            </button>
                        </div>
                    )}
                </main>

            </div>
            <BottomNav />
        </div>
    )
}
