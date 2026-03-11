'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    ArrowLeft, Heart, Calendar, MapPin, Phone, ShieldCheck,
    Star, Clock4, Stethoscope, GraduationCap, CheckCircle2,
    MessageCircle, Building2, Video, Send
} from 'lucide-react'
import { medicosMock } from '@/data/mockData'

// Logos dos planos de saúde — usando texto estilizado com cores reais das marcas
const PlanLogo = ({ operadora }: { operadora: string }) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
        'Unimed': { bg: '#00a550', text: '#fff', label: 'Unimed' },
        'Amil': { bg: '#e30613', text: '#fff', label: 'Amil' },
        'Bradesco': { bg: '#cc092f', text: '#fff', label: 'Bradesco' },
        'SulAmérica': { bg: '#005baa', text: '#fff', label: 'Sul' },
        'Hapvida': { bg: '#00a1e0', text: '#fff', label: 'Hapvida' },
        'NotreDame': { bg: '#2b4d9b', text: '#fff', label: 'Notre' },
    }
    const s = styles[operadora]
    if (!s) return (
        <span className="bg-blue-50/90 text-[#2D5284] text-[11px] font-bold px-3 py-1.5 rounded-xl border border-blue-100">
            {operadora}
        </span>
    )
    return (
        <div className="flex items-center gap-1.5 bg-white/90 border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-sm">
            <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-[7px] font-black leading-none shrink-0"
                style={{ backgroundColor: s.bg, color: s.text }}
            >
                {s.label.substring(0, 3).toUpperCase()}
            </div>
            <span className="text-[12px] font-bold text-slate-700">{operadora}</span>
        </div>
    )
}

export default function PerfilMedicoPage() {
    const router = useRouter()
    const params = useParams()
    const medico = medicosMock.find(m => m.id === (params?.id as string)) ?? medicosMock[0]
    const medicoAny = medico as any
    const [favorito, setFavorito] = useState(false)
    const [abaAtiva, setAbaAtiva] = useState<'sobre' | 'avaliacoes' | 'locais'>('sobre')

    const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`
    const glassCardAzul = `bg-[#2D5284]/5 backdrop-blur-sm border border-[#2D5284]/10 shadow-[0_4px_16px_rgba(45,82,132,0.08)]`

    const reviews = [
        { nome: 'Mariana Costa', nota: 5, texto: 'Profissional incrível! Me atendeu com muita atenção e resolveu meu problema rapidamente.', data: 'Mar 2026' },
        { nome: 'Carlos Alves', nota: 5, texto: 'Excelente médica. Muito didática na explicação do tratamento. Super recomendo!', data: 'Fev 2026' },
        { nome: 'Patrícia Lima', nota: 4, texto: 'Ótima consulta, consultório bem equipado e atendimento pontual.', data: 'Jan 2026' },
    ]

    // Locais com detalhes dourados
    const locais = [
        {
            icon: Building2,
            name: 'Consultório Principal',
            sub: `${medico.endereco_consultorio.logradouro}, ${medico.endereco_consultorio.numero}`,
            detail: `${medico.endereco_consultorio.bairro} — ${medico.endereco_consultorio.cidade}/${medico.endereco_consultorio.estado}`,
            days: 'Seg · Qua · Sex',
            cor: '#2D5284',
        },
        ...(medicoAny.endereco_consultorio_2 ? [{
            icon: Building2,
            name: `Clínica ${medicoAny.endereco_consultorio_2.complemento?.split(' - ')[1] || medicoAny.endereco_consultorio_2.bairro}`,
            sub: `${medicoAny.endereco_consultorio_2.logradouro}, ${medicoAny.endereco_consultorio_2.numero}`,
            detail: `${medicoAny.endereco_consultorio_2.bairro} — ${medicoAny.endereco_consultorio_2.cidade}/${medicoAny.endereco_consultorio_2.estado}`,
            days: 'Ter · Qui · Sáb',
            cor: '#D4AF37',
        }] : []),
        {
            icon: Video,
            name: 'Telemedicina',
            sub: 'Atendimento Online',
            detail: 'Videochamada via DocMatch',
            days: 'Qualquer dia disponível',
            cor: '#2D5284',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-32 font-sans">

            {/* ── HEADER COMPACTO (igual ao dashboard) ── */}
            <header className="bg-[#2D5284] px-5 pt-4 pb-16 rounded-b-3xl shadow-[0_8px_24px_rgba(45,82,132,0.35)] relative z-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative text-white hover:text-gray-200 transition-colors"
                            onClick={() => router.push('/notificacoes')}
                            aria-label="Notificações"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px]">Match</span>
                        </div>
                    </div>
                </div>

                {/* Foto overlapping — centralizada sobre o header */}
                <div className="absolute -bottom-[56px] left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                        {/* Foto */}
                        <div className="w-[108px] h-[108px] rounded-[26px] overflow-hidden border-4 border-white shadow-[0_12px_32px_rgba(45,82,132,0.28)]">
                            <img src={medico.foto_url} alt={`Foto de ${medico.nome}`} className="w-full h-full object-cover" />
                        </div>

                        {/* Badge TOP — canto superior esquerdo */}
                        {medico.destaque && (
                            <div className="absolute -top-2 -left-2 bg-[#D4AF37] text-[#1A365D] text-[8px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                                ⭐ Top
                            </div>
                        )}

                        {/* Badge CRM — abaixo da foto centralizado */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8.5px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3 fill-white stroke-none" /> Verificado CRM
                        </div>

                        {/* Botão favoritar — canto superior direito */}
                        <button
                            onClick={() => setFavorito(!favorito)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform active:scale-90"
                            aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <Heart className={`w-4 h-4 transition-colors ${favorito ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── NOME + ESPECIALIDADE ── */}
            <div className="pt-[72px] px-5 text-center mb-5">
                <h1 className="text-[20px] font-black text-[#1A365D] mb-0.5">{medico.nome}</h1>
                <p className="text-[#2D5284] font-bold text-[14px]">{medico.especialidade}</p>
                {medico.subespecialidade && <p className="text-slate-400 text-[12px] mt-0.5">{medico.subespecialidade}</p>}
                <p className="text-[10px] text-slate-400 font-semibold mt-1 tracking-wide">{medico.crm}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(medico.avaliacao) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                    <span className="text-slate-600 text-[12px] font-bold ml-1">{medico.avaliacao}</span>
                    <span className="text-slate-400 text-[11px]">({medico.total_avaliacoes})</span>
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="px-5 grid grid-cols-3 gap-3 mb-5">
                {[
                    { icon: <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /></div>, value: medico.avaliacao.toString(), sub: `${medico.total_avaliacoes} aval.` },
                    { icon: <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5"><Clock4 className="w-4 h-4 text-[#2D5284]" strokeWidth={2} /></div>, value: '10+', sub: 'anos' },
                    { icon: <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1.5"><Stethoscope className="w-4 h-4 text-emerald-500" strokeWidth={1.8} /></div>, value: '1,5k', sub: 'realizadas' },
                ].map((s, idx) => (
                    <div key={idx} className={`${glassCard} rounded-[20px] p-3 flex flex-col items-center text-center`}>
                        {s.icon}
                        <p className="font-black text-[18px] text-[#1A365D] leading-none">{s.value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── ABAS ── */}
            <div className="px-5 mb-4">
                <div className={`${glassCard} rounded-[18px] p-1 flex gap-1`}>
                    {(['sobre', 'avaliacoes', 'locais'] as const).map(aba => (
                        <button
                            key={aba}
                            onClick={() => setAbaAtiva(aba)}
                            className={`flex-1 py-2 rounded-[14px] text-[12px] font-bold capitalize transition-all ${abaAtiva === aba ? 'bg-[#2D5284] text-white shadow-[0_4px_12px_rgba(45,82,132,0.30)]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {aba === 'sobre' ? 'Sobre' : aba === 'avaliacoes' ? 'Avaliações' : 'Locais'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CONTEÚDO DAS ABAS ── */}
            <div className="px-5 space-y-4">
                {abaAtiva === 'sobre' && (
                    <>
                        {/* Bio */}
                        <div className={`${glassCard} rounded-[22px] p-5`}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-[#2D5284]/10 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-[#2D5284]" />
                                </div>
                                <h2 className="text-[#1A365D] font-bold text-[14px]">Sobre</h2>
                            </div>
                            <p className="text-[13px] text-slate-600 leading-relaxed">{medico.bio}</p>
                        </div>

                        {/* Formação */}
                        {(medico.formacao ?? []).length > 0 && (
                            <div className={`${glassCard} rounded-[22px] p-5`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <h2 className="text-[#1A365D] font-bold text-[14px]">Formação</h2>
                                </div>
                                <div className="space-y-2.5">
                                    {(medico.formacao ?? []).map((f, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <p className="text-[13px] text-slate-600">{f}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experiência */}
                        <div className={`${glassCardAzul} rounded-[22px] p-4 flex items-center gap-3`}>
                            <div className="w-10 h-10 rounded-2xl bg-[#2D5284]/10 flex items-center justify-center shrink-0">
                                <Clock4 className="w-5 h-5 text-[#2D5284]" />
                            </div>
                            <p className="text-[13px] text-[#1A365D] font-semibold leading-snug">{medico.experiencia}</p>
                        </div>

                        {/* Convênios com logos */}
                        <div className={`${glassCard} rounded-[22px] p-5`}>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                                <h2 className="text-[#1A365D] font-bold text-[14px]">Convênios Aceitos</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medico.planos_saude_aceitos.map(p => (
                                    <PlanLogo key={p.id} operadora={p.operadora} />
                                ))}
                                <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border border-[#D4AF37]/40 bg-gradient-to-r from-[#FEFCE8] to-[#FFF9E6] shadow-sm">
                                    <div className="w-5 h-5 rounded-md bg-[#D4AF37] flex items-center justify-center text-[7px] font-black text-[#1A365D]">R$</div>
                                    <span className="text-[12px] font-bold text-amber-700">Particular · R$ {medico.valor_consulta_particular}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {abaAtiva === 'avaliacoes' && (
                    <>
                        <div className={`${glassCard} rounded-[22px] p-5 flex items-center gap-5`}>
                            <div className="text-center shrink-0">
                                <p className="text-[48px] font-black text-[#1A365D] leading-none">{medico.avaliacao}</p>
                                <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(medico.avaliacao) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">{medico.total_avaliacoes} avaliações</p>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const pct = star === 5 ? 74 : star === 4 ? 20 : star === 3 ? 4 : star === 2 ? 1 : 1
                                    return (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-bold w-3">{star}</span>
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-[10px] text-slate-400 w-6 text-right">{pct}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {reviews.map((r, i) => (
                            <div key={i} className={`${glassCard} rounded-[22px] p-4`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-[#1A365D] text-[13px]">{r.nome}</p>
                                        <p className="text-slate-400 text-[11px]">{r.data}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(j => (
                                            <Star key={j} className={`w-3 h-3 ${j <= r.nota ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-600 leading-relaxed">{r.texto}</p>
                            </div>
                        ))}
                    </>
                )}

                {abaAtiva === 'locais' && (
                    <>
                        {locais.map((local, i) => {
                            const Icon = local.icon
                            const isOuro = local.cor === '#D4AF37'
                            return (
                                <div key={i} className={`${glassCard} rounded-[22px] overflow-hidden`}>
                                    {/* Topo colorido dourado ou azul */}
                                    <div
                                        className="px-4 py-3 flex items-center gap-3"
                                        style={{ background: isOuro ? 'linear-gradient(135deg,#FFF8DC,#FEF3C7)' : 'linear-gradient(135deg,#EFF6FF,#DBEAFE)' }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                                            style={{ backgroundColor: local.cor + '20' }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: local.cor }} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[14px]" style={{ color: local.cor === '#D4AF37' ? '#92400E' : '#1A365D' }}>{local.name}</p>
                                            <p className="text-slate-500 text-[12px]">{local.sub}</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                            <p className="text-[12px] text-slate-500">{local.detail}</p>
                                        </div>
                                        <div
                                            className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                                            style={{ backgroundColor: local.cor + '12' }}
                                        >
                                            <Clock4 className="w-3.5 h-3.5 shrink-0" style={{ color: local.cor }} />
                                            <p className="text-[12px] font-semibold" style={{ color: local.cor === '#D4AF37' ? '#92400E' : '#1E3A5F' }}>{local.days}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>

            {/* ── CTA FIXO INFERIOR — 3 botões ── */}
            <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white/85 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_24px_rgba(31,62,109,0.08)] z-30">
                <div className="flex gap-2.5 items-center">
                    {/* Ligar */}
                    <button
                        className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 hover:bg-slate-200 transition-colors active:scale-95"
                        aria-label="Ligar para consultório"
                    >
                        <Phone className="w-4.5 h-4.5 text-[#2D5284]" />
                    </button>

                    {/* Mensagem */}
                    <button
                        className="w-11 h-11 rounded-2xl bg-[#2D5284]/10 flex items-center justify-center shrink-0 hover:bg-[#2D5284]/20 transition-colors active:scale-95"
                        aria-label="Enviar mensagem"
                    >
                        <Send className="w-4 h-4 text-[#2D5284]" />
                    </button>

                    {/* Agendar — Dourado, compacto */}
                    <button
                        onClick={() => router.push(`/agendar/${medico.id}`)}
                        className="flex-1 bg-gradient-to-r from-[#CFAF42] via-[#E2C358] to-[#CFAF42] text-[#1A365D] font-black rounded-2xl py-3 flex items-center justify-center gap-2 text-[14px] shadow-[0_8px_24px_rgba(207,175,66,0.40),inset_0_-2px_6px_rgba(0,0,0,0.10),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:brightness-105 active:scale-95 transition-all border border-[#E8C55E]/50"
                    >
                        <Calendar className="w-4.5 h-4.5" />
                        Agendar Consulta
                    </button>
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                    A partir de <strong className="text-[#1A365D]">R$ {medico.valor_consulta}</strong> · Telemedicina disponível
                </p>
            </div>
        </div>
    )
}
