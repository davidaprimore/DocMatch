'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    ArrowLeft, Heart, Calendar, MapPin, Phone, ShieldCheck,
    Star, Clock4, Stethoscope, GraduationCap, CheckCircle2,
    MessageCircle, Building2, Video, Send
} from 'lucide-react'
import { medicosMock } from '@/data/mockData'
import { Header } from '@/components/Header'

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
        <div className="relative min-h-screen overflow-x-hidden pt-1">
            {/* CONTEÚDO (relative z-10 para ficar sobre a névoa global) */}
            <div className="relative z-10 pb-20 flex flex-col font-sans">
                {/* Header Padronizado */}
                <Header 
                    variant="page" 
                    title={medico.nome} 
                    showBackButton 
                    showNotifications 
                    userAvatar="/avatar-joce.png" 
                    userName="Joce Moreno"
                />

            {/* CARD DO MÉDICO — Clean & Premium */}
            <div className="px-5 -mt-5 relative z-20 mb-5">
                <div className={`${glassCard} rounded-[24px] p-5`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="w-[82px] h-[82px] rounded-[22px] overflow-hidden border-2 border-[#D4AF37]/20 shadow-lg">
                                <img src={medico.foto_url} alt={`Foto de ${medico.nome}`} className="w-full h-full object-cover" />
                            </div>
                            {medico.destaque && (
                                <div className="absolute -top-2 -left-2 bg-[#D4AF37] text-[#1A365D] text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                                    ⭐ Top
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <h2 className="text-[#1A365D] font-bold text-[17px] leading-tight truncate">{medico.nome}</h2>
                                <ShieldCheck className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
                            </div>
                            <p className="text-slate-500 text-[13px] font-medium mb-2">{medico.especialidade}</p>
                            <div className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 border border-emerald-500/20">
                                <ShieldCheck className="w-3 h-3" /> Verificado CRM
                            </div>
                        </div>

                        <button
                            onClick={() => setFavorito(!favorito)}
                            className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all border border-slate-100"
                        >
                            <Heart className={`w-5 h-5 transition-colors ${favorito ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-[#1A365D] font-bold text-[14px]">{medico.avaliacao}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Nota</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100 mx-2" />
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[#1A365D] font-bold text-[14px]">{medico.total_avaliacoes}</span>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avaliações</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100 mx-2" />
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-[#1A365D] font-bold text-[14px]">{medico.experiencia ? medico.experiencia.split(' ')[0] : '0'}+ anos</span>
                            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Exp.</span>
                        </div>
                    </div>
                </div>
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
                            <p className="text-[13px] text-[#1A365D] font-semibold leading-snug">{medico.experiencia || 'Experiência verificada'}</p>
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

            {/* ── REDES SOCIAIS & CONTATO ── (Bottom Section) */}
            {medico.sociais && (Object.keys(medico.sociais).length > 0) && (
                <div className="px-5 mb-8 pb-32"> {/* Added padding to not be covered by fixed CTA */}
                    <h3 className="text-[#1A365D] font-bold text-[15px] mb-4 text-center">Conecte-se com {medico.nome.split(' ')[0]}</h3>
                    <div className="flex justify-center gap-4">
                        {medico.sociais.instagram && (
                            <button onClick={() => window.open(medico.sociais?.instagram, '_blank')} className="bg-gradient-to-tr from-[#F58529] via-[#D10869] to-[#8134AF] p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </button>
                        )}
                        {medico.sociais.telegram && (
                            <button onClick={() => window.open(medico.sociais?.telegram, '_blank')} className="bg-[#0088cc] p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.225-5.32 2.37-10.348 4.632-13.06 5.87-14.471 6.544-14.777 6.94-.367.476-.388 1.135-.053 1.633.284.423.834.708 1.954 1.042.8.238 1.905.518 2.66.67l1.7.34 2.115 6.46c.304.93.94 1.583 1.694 1.638.74.053 1.46-.356 1.906-1.077.202-.325.337-.624.584-1.127.23-.466.574-1.155 1.693-2.272l5.77 4.246c.6.438 1.168.613 1.695.534.52-.08.91-.424 1.144-1.043.235-.624 9.112-21.783 9.385-22.51.274-.728.164-1.393-.207-1.848-.37-.455-1.018-.707-1.6-.702zm-12.27 13.626s.013-.01.014-.01l-.105.474-.182.818c-.144.654-.3.943-.496 1.196l-.01.015c-.21.274-.32.324-.44.25-.133-.082-.366-.525-.366-.525l-1.92-5.86 1.83.364 1.688 3.282z"/></svg>
                            </button>
                        )}
                        {medico.sociais.facebook && (
                            <button onClick={() => window.open(medico.sociais?.facebook, '_blank')} className="bg-[#1877F2] p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </button>
                        )}
                        {medico.sociais.site && (
                            <button onClick={() => window.open(medico.sociais?.site, '_blank')} className="bg-white border border-slate-200 text-[#2D5284] p-3 rounded-2xl shadow-lg active:scale-90 transition-all">
                                <Building2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            )}

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
                        onClick={() => {
                            // Dra. Ana Silva tem id '2' no conversasMock.
                            // Qualquer médico: tenta mapear pelo nome ou usa query medicoId
                            router.push(`/mensagens?chat=2`)
                        }}
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
        </div>
    )
}
