'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import {
    ArrowLeft, ShieldCheck, ShoppingCart, ChevronRight,
    Download, Share2, Calendar, Zap, ChevronDown
} from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'
import { generateReceitaCode, formatReceitaCode, generateQRData } from '@/lib/utils/receitaCode'

// Mapa de medicamentos comerciais → genéricos correspondentes
const genericosMap: Record<string, { nome: string; concentracao: string; obs: string }[]> = {
    'Dipirona Sódica 500mg': [
        { nome: 'Dipirona Sódica (Genérico)', concentracao: '500mg', obs: 'Bioequivalente aprovado pela ANVISA' },
        { nome: 'Novalgina 500mg', concentracao: '500mg', obs: 'Medicamento de referência' },
    ],
    'Amoxicilina 500mg': [
        { nome: 'Amoxicilina (Genérico)', concentracao: '500mg', obs: 'Mesmo princípio ativo — bioequivalente' },
        { nome: 'Amoxil 500mg', concentracao: '500mg', obs: 'Medicamento de referência' },
    ],
    'Omeprazol 20mg': [
        { nome: 'Omeprazol (Genérico)', concentracao: '20mg', obs: 'Bioequivalente aprovado pela ANVISA' },
        { nome: 'Peprazol 20mg', concentracao: '20mg', obs: 'Medicamento similar' },
    ],
}

// Ícone SVG elegante de cápsula — desenhado à mão
const CapsuleIcon = ({ className = 'w-4 h-4', color = 'currentColor' }: { className?: string; color?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="8" width="20" height="8" rx="4" stroke={color} strokeWidth="1.5" />
        <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="1.5" />
        <rect x="2" y="8" width="10" height="8" rx="4" fill={color} fillOpacity="0.15" />
    </svg>
)

const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`

// Card de medicamento individual com toggle de genérico
function MedicamentoCard({ med }: { med: typeof receitaMock.medicamentos[0] }) {
    const [showGenericos, setShowGenericos] = useState(false)
    const genericos = genericosMap[med.nome] ?? []

    return (
        <div className="p-4">
            {/* Medicamento exatamente como prescrito */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-[#2D5284]/8 border border-[#2D5284]/12 flex items-center justify-center shrink-0 mt-0.5">
                        <CapsuleIcon className="w-5 h-5" color="#2D5284" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-[14px] text-[#1A365D] leading-tight">{med.nome}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{med.principio_ativo} · {med.concentracao} · {med.forma_farmaceutica}</p>
                    </div>
                </div>
                <span className="bg-[#2D5284]/8 text-[#2D5284] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 border border-[#2D5284]/12">
                    {med.quantidade} un.
                </span>
            </div>

            {/* Posologia — destaque azul */}
            <div className="bg-gradient-to-r from-blue-50/80 to-slate-50/60 rounded-xl px-3 py-2.5 mb-3 border border-blue-100/60">
                <p className="text-[12px] text-[#2D5284] font-semibold leading-relaxed">{med.posologia}</p>
                {med.uso_continuo && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <p className="text-[11px] text-amber-700 font-bold">Uso contínuo</p>
                    </div>
                )}
            </div>

            {/* Botão para revelar genéricos */}
            {genericos.length > 0 && (
                <>
                    <button
                        onClick={() => setShowGenericos(!showGenericos)}
                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded-xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                            <span className="text-[12px] text-slate-500 font-semibold">Ver opções de genérico</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showGenericos ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Genéricos expandíveis */}
                    {showGenericos && (
                        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden">
                            <div className="px-3 py-1.5 bg-slate-100/70">
                                <p className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">Alternativas genéricas ao prescrito</p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {genericos.map((gen, j) => (
                                    <div key={j} className="px-3 py-2.5 flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2">
                                            <CapsuleIcon className="w-4 h-4 mt-0.5 shrink-0" color="#64748b" />
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-700">{gen.nome}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{gen.obs}</p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">{gen.concentracao}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default function ReceitaDetalhePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const receitaId = params?.id ?? receitaMock.id
    const medico = medicosMock.find(m => m.id === receitaMock.medico_id) ?? medicosMock[0]

    // Geração determinística do código e QRData com base no ID da receita
    const receitaCode = generateReceitaCode(receitaId)
    const receitaCodeFormatted = formatReceitaCode(receitaCode)
    const qrData = generateQRData(receitaId, medico.id)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-28 font-sans">

            {/* HEADER — padrão pt-4 pb-12, com card overlapping */}
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-[0_8px_24px_rgba(45,82,132,0.35)] relative z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95" aria-label="Voltar">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Receita Digital</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')} aria-label="Notificações">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px]">Match</span>
                        </div>
                    </div>
                </div>

                {/* Card de status overlapping — metade no azul, metade fora */}
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

            {/* Espaço para o card overlapping */}
            <div className="mt-12 px-5 space-y-4">

                {/* Médico prescritor */}
                <div className={`${glassCard} rounded-[22px] p-4 flex items-center gap-4`}>
                    <img src={medico.foto_url} className="w-14 h-14 rounded-[16px] object-cover border-2 border-white shadow-[0_4px_12px_rgba(45,82,132,0.18)]" alt={medico.nome} />
                    <div className="flex-1">
                        <p className="font-black text-[15px] text-[#1A365D] leading-tight">{medico.nome}</p>
                        <p className="text-[13px] text-[#2D5284] font-semibold">{medico.especialidade}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{medico.crm}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-700 text-[10px] font-bold">Verificado</span>
                    </div>
                </div>

                {/* QRCode Real + Código */}
                <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                    {/* Barra superior */}
                    <div className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-4 py-2.5 flex items-center justify-between">
                        <p className="text-white/80 text-[11px] font-semibold tracking-wider uppercase">Código de Validação — Farmácia</p>
                        <div className="flex gap-3">
                            <button className="text-white/60 hover:text-white transition-colors" aria-label="Compartilhar"><Share2 className="w-4 h-4" /></button>
                            <button className="text-white/60 hover:text-white transition-colors" aria-label="Baixar"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* QRCode e Código — layout horizontal compacto */}
                    <div className="p-5 flex items-center gap-5">
                        {/* QRCode real - qrcode.react */}
                        <div className="bg-white rounded-2xl p-3 shadow-[0_4px_16px_rgba(26,54,93,0.10)] border border-slate-100/60 shrink-0">
                            <QRCodeSVG
                                value={qrData}
                                size={120}
                                level="M"
                                fgColor="#1A365D"
                                bgColor="#FFFFFF"
                                includeMargin={false}
                            />
                        </div>

                        {/* Código formatado */}
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mb-2">Código único</p>
                            <div className="bg-[#EEF2F7] rounded-xl px-3 py-2.5 border border-slate-200/60">
                                <p className="text-[20px] font-black text-[#1A365D] tracking-[0.22em] font-mono leading-none">
                                    {receitaCodeFormatted}
                                </p>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 leading-snug">
                                Apresente o QRCode ou este código na farmácia
                            </p>
                        </div>
                    </div>
                </div>

                {/* Medicamentos — prescrição original primeiro, genérico por toggle */}
                <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                    <div className="px-4 pt-4 pb-3 flex items-center gap-2 border-b border-slate-100/80">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                            <CapsuleIcon className="w-4 h-4" color="#D4AF37" />
                        </div>
                        <h3 className="font-bold text-[#1A365D] text-[14px]">Medicamentos Prescritos</h3>
                        <span className="ml-auto bg-blue-50 text-[#2D5284] text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">{receitaMock.medicamentos.length}</span>
                    </div>

                    <div className="divide-y divide-slate-100/80">
                        {receitaMock.medicamentos.map((med, i) => (
                            <MedicamentoCard key={i} med={med} />
                        ))}
                    </div>
                </div>

                {/* Observações do médico */}
                {receitaMock.observacoes && (
                    <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                        <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/60 px-4 py-3 border-b border-amber-100/60">
                            <p className="font-bold text-amber-800 text-[13px]">Observações do Médico</p>
                        </div>
                        <div className="px-4 py-3">
                            <p className="text-[13px] text-slate-600 leading-relaxed">{receitaMock.observacoes}</p>
                        </div>
                    </div>
                )}

                {/* Botão comparar preços */}
                <button
                    onClick={() => router.push('/comparar-precos')}
                    className="w-full bg-gradient-to-r from-[#CFAF42] via-[#E2C358] to-[#CFAF42] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2.5 text-[14px] shadow-[0_8px_24px_rgba(207,175,66,0.35),inset_0_-2px_6px_rgba(0,0,0,0.10),inset_0_2px_4px_rgba(255,255,255,0.35)] hover:brightness-105 active:scale-[0.98] transition-all border border-[#E8C55E]/50"
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
