'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import {
    ArrowLeft, ShieldCheck, ShoppingCart, ChevronRight,
    Download, Share2, Calendar, Clock, Leaf
} from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'
import { generateReceitaCode, formatReceitaCode, generateQRData } from '@/lib/utils/receitaCode'

// Base de genéricos por medicamento
const genericosBase: Record<string, { nome: string; concentracao: string; forma: string; posologia: string; obs: string }[]> = {
    'Dipirona Sódica 500mg': [
        { nome: 'Dipirona Sódica', concentracao: '500mg', forma: 'Comprimido', posologia: '1 comprimido a cada 12 horas, em caso de dor ou febre', obs: 'Bioequivalente aprovado pela ANVISA · Mesmo princípio ativo' },
    ],
    'Amoxicilina 500mg': [
        { nome: 'Amoxicilina', concentracao: '500mg', forma: 'Cápsula', posologia: '1 cápsula a cada 8 horas por 7 dias', obs: 'Bioequivalente aprovado pela ANVISA · Sem diferença terapêutica clínica' },
    ],
    'Omeprazol 20mg': [
        { nome: 'Omeprazol', concentracao: '20mg', forma: 'Cápsula', posologia: '1 cápsula antes do café da manhã', obs: 'Bioequivalente aprovado pela ANVISA · Mesma eficácia clínica comprovada' },
    ],
}

const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`
const goldCard = `bg-gradient-to-br from-[#F9F0D4] to-[#FBF6E4] border border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(212,175,55,0.15),0_2px_8px_rgba(212,175,55,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)]`

// Tab styles
const tabActive = `flex-1 py-2.5 font-bold text-[13px] text-[#1A365D] bg-white rounded-xl shadow-sm transition-all`
const tabInactive = `flex-1 py-2.5 font-medium text-[13px] text-slate-400 transition-all`

// Row de medicamento — receita original 
function MedRowOriginal({ med, isLast }: { med: typeof receitaMock.medicamentos[0]; isLast: boolean }) {
    return (
        <div className={`px-4 py-4 ${!isLast ? 'border-b border-slate-100/80' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#2D5284]/8 flex items-center justify-center shrink-0 border border-[#2D5284]/10">
                        <ShieldCheck className="w-4 h-4 text-[#2D5284]" />
                    </div>
                    <div>
                        <p className="font-bold text-[14px] text-[#1A365D] leading-snug">{med.nome}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{med.principio_ativo} · {med.concentracao} · {med.forma_farmaceutica}</p>
                    </div>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-[#2D5284] bg-[#2D5284]/8 border border-[#2D5284]/12 px-2.5 py-1 rounded-full">
                    {med.quantidade} un.
                </span>
            </div>

            {/* Posologia em destaque */}
            <div className="ml-11 space-y-1.5">
                <div className="bg-gradient-to-r from-[#2D5284]/6 to-[#1A365D]/4 rounded-xl px-3 py-2.5 border-l-2 border-[#2D5284]/40">
                    <p className="text-[12px] text-[#1A365D] font-semibold leading-relaxed">{med.posologia}</p>
                </div>
                {med.uso_continuo && (
                    <div className="flex items-center gap-1.5 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                        <p className="text-[11px] text-[#B8860B] font-bold">Uso contínuo — não interromper sem orientação médica</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Row de medicamento — genérico
function MedRowGenerico({ med, generico, isLast }: { med: typeof receitaMock.medicamentos[0]; generico: ReturnType<typeof genericosBase['']>[0] | undefined; isLast: boolean }) {
    if (!generico) return null
    return (
        <div className={`px-4 py-4 ${!isLast ? 'border-b border-[#D4AF37]/15' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0 border border-[#D4AF37]/25">
                        <Leaf className="w-4 h-4 text-[#B8860B]" />
                    </div>
                    <div>
                        <p className="font-bold text-[14px] text-[#7A5C00] leading-snug">{generico.nome} <span className="text-[11px] font-normal text-[#B8860B]/80"> · Genérico</span></p>
                        <p className="text-[11px] text-[#B8860B]/70 mt-0.5">{generico.concentracao} · {generico.forma}</p>
                    </div>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-[#B8860B] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-1 rounded-full">
                    {med.quantidade} un.
                </span>
            </div>

            <div className="ml-11 space-y-1.5">
                <div className="bg-[#D4AF37]/8 rounded-xl px-3 py-2.5 border-l-2 border-[#D4AF37]/50">
                    <p className="text-[12px] text-[#7A5C00] font-semibold leading-relaxed">{generico.posologia}</p>
                </div>
                <div className="flex items-start gap-1.5 px-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-500 leading-snug">{generico.obs}</p>
                </div>
            </div>
        </div>
    )
}

export default function ReceitaDetalhePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'original' | 'generico'>('original')

    const receitaId = params?.id ?? receitaMock.id
    const medico = medicosMock.find(m => m.id === receitaMock.medico_id) ?? medicosMock[0]

    const receitaCode = generateReceitaCode(receitaId)
    const receitaCodeFormatted = formatReceitaCode(receitaCode)
    const qrData = generateQRData(receitaId, medico.id)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-28 font-sans">

            {/* HEADER */}
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-[0_8px_24px_rgba(45,82,132,0.35)] relative z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95" aria-label="Voltar">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Receita Digital</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-white" onClick={() => router.push('/notificacoes')} aria-label="Notificações">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px]">Match</span>
                        </div>
                    </div>
                </div>

                {/* Card de status overlapping */}
                <div className="absolute left-5 right-5 -bottom-[28px] z-30">
                    <div className={`${glassCard} rounded-2xl px-4 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-emerald-700 font-bold text-[13px]">Receita Ativa</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[12px]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Válida até {dateToDisplay(receitaMock.validade)}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mt-12 px-5 space-y-4">

                {/* Médico */}
                <div className={`${glassCard} rounded-[22px] p-4 flex items-center gap-4`}>
                    <img src={medico.foto_url} className="w-14 h-14 rounded-[16px] object-cover border-2 border-white shadow-[0_4px_12px_rgba(45,82,132,0.18)]" alt={medico.nome} />
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-[15px] text-[#1A365D] leading-tight">{medico.nome}</p>
                        <p className="text-[13px] text-[#2D5284] font-semibold">{medico.especialidade}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{medico.crm}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-700 text-[10px] font-bold">CRM Verificado</span>
                    </div>
                </div>

                {/* ── QRCode + Código Dourado ── */}
                <div className={`${goldCard} rounded-[22px] overflow-hidden`}>
                    {/* Barra dourada */}
                    <div className="bg-gradient-to-r from-[#C9A227] to-[#E2C84A] px-4 py-2.5 flex items-center justify-between">
                        <p className="text-[#7A5C00] text-[11px] font-black tracking-wider uppercase">Código de Validação — Farmácia</p>
                        <div className="flex gap-3">
                            <button className="text-[#7A5C00]/70 hover:text-[#7A5C00] transition-colors" aria-label="Compartilhar"><Share2 className="w-4 h-4" /></button>
                            <button className="text-[#7A5C00]/70 hover:text-[#7A5C00] transition-colors" aria-label="Baixar"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* QRCode lado a lado com código */}
                    <div className="p-5 flex items-center gap-5">
                        {/* QRCode dourado */}
                        <div className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(212,175,55,0.20)] border border-[#D4AF37]/20 shrink-0">
                            <QRCodeSVG
                                value={qrData}
                                size={110}
                                level="M"
                                fgColor="#7A5C00"
                                bgColor="#FFFFFF"
                                includeMargin={false}
                            />
                        </div>

                        {/* Código */}
                        <div className="flex-1">
                            <p className="text-[10px] text-[#B8860B]/70 font-black tracking-[0.2em] uppercase mb-2">Código único</p>
                            <div className="bg-[#D4AF37]/10 rounded-xl px-3 py-2.5 border border-[#D4AF37]/30 mb-2">
                                <p className="text-[21px] font-black text-[#7A5C00] tracking-[0.20em] font-mono leading-none">
                                    {receitaCodeFormatted}
                                </p>
                            </div>
                            <p className="text-[10px] text-[#B8860B]/60 leading-snug">
                                Apresente o QRCode<br />ou este código na farmácia
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Abas: Original / Genérico ── */}
                <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                    {/* Seleção de abas */}
                    <div className="px-3 pt-3 pb-0">
                        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                            <button onClick={() => setActiveTab('original')} className={activeTab === 'original' ? tabActive : tabInactive}>
                                📋 Receita Original
                            </button>
                            <button onClick={() => setActiveTab('generico')} className={activeTab === 'generico' ? tabActive : tabInactive}>
                                🌿 Opção Genérica
                            </button>
                        </div>
                    </div>

                    {/* Aba original */}
                    {activeTab === 'original' && (
                        <>
                            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                <div className="w-1 h-5 rounded-full bg-[#2D5284]" />
                                <p className="font-bold text-[#1A365D] text-[13px]">Exatamente como prescrito pelo médico</p>
                            </div>
                            <div className="divide-y divide-slate-100/80 pb-2">
                                {receitaMock.medicamentos.map((med, i) => (
                                    <MedRowOriginal key={i} med={med} isLast={i === receitaMock.medicamentos.length - 1} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Aba genérico */}
                    {activeTab === 'generico' && (
                        <>
                            <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                <div className="w-1 h-5 rounded-full bg-[#D4AF37]" />
                                <p className="font-bold text-[#7A5C00] text-[13px]">Equivalentes genéricos — mesma eficácia</p>
                            </div>
                            <div className="mx-4 mb-3 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                                <p className="text-[11px] text-amber-700 leading-relaxed">
                                    ⚠️ Os genéricos abaixo são equivalentes terapêuticos aprovados pela ANVISA. Sempre consulte seu farmacêutico antes de substituir. A decisão final é do paciente.
                                </p>
                            </div>
                            <div className="divide-y divide-[#D4AF37]/10 pb-2">
                                {receitaMock.medicamentos.map((med, i) => {
                                    const key = med.nome
                                    const gen = genericosBase[key]?.[0]
                                    return (
                                        <MedRowGenerico key={i} med={med} generico={gen} isLast={i === receitaMock.medicamentos.length - 1} />
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Observações do médico */}
                {receitaMock.observacoes && (
                    <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <p className="font-bold text-[#1A365D] text-[13px]">Observações do Médico</p>
                        </div>
                        <div className="px-4 pb-4">
                            <div className="bg-amber-50/60 rounded-xl px-3 py-3 border border-amber-100/80">
                                <p className="text-[13px] text-slate-700 leading-relaxed">{receitaMock.observacoes}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={() => router.push('/comparar-precos')}
                    className="w-full bg-gradient-to-r from-[#CFAF42] via-[#E2C358] to-[#CFAF42] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2.5 text-[14px] shadow-[0_8px_24px_rgba(207,175,66,0.35)] hover:brightness-105 active:scale-[0.98] transition-all border border-[#E8C55E]/50"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Comparar Preços nas Farmácias
                    <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
