'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Pill, ShoppingCart, Info, ChevronRight, Download, Share2, Calendar } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { receitaMock, medicosMock } from '@/data/mockData'
import { dateToDisplay } from '@/lib/utils/masks'

// Mapa de medicamentos comerciais → genéricos correspondentes
const genericosMap: Record<string, { nome: string; concentracao: string; obs?: string }[]> = {
    'Dipirona Sódica 500mg': [
        { nome: 'Dipirona Sódica (Genérico)', concentracao: '500mg', obs: 'Equivalente terapêutico idêntico' },
        { nome: 'Novalgina 500mg', concentracao: '500mg', obs: 'Referência comercial' },
    ],
    'Amoxicilina 500mg': [
        { nome: 'Amoxicilina (Genérico)', concentracao: '500mg', obs: 'Mesmo princípio ativo — bioequivalente' },
        { nome: 'Amoxil 500mg', concentracao: '500mg', obs: 'Referência de marca' },
    ],
    'Omeprazol 20mg': [
        { nome: 'Omeprazol (Genérico)', concentracao: '20mg', obs: 'Bioequivalente aprovado pela ANVISA' },
        { nome: 'Peprazol 20mg', concentracao: '20mg', obs: 'Versão similar' },
    ],
}

// QR Code SVG simples — padrão de módulos preto/branco
const QRCodeDisplay = ({ code }: { code: string }) => {
    // Padrão fixo de módulos 17x17 para visual de QRCode (decorativo premium)
    const pattern = [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    ]
    const size = 7
    return (
        <svg width={17 * size} height={17 * size} viewBox={`0 0 ${17 * size} ${17 * size}`} xmlns="http://www.w3.org/2000/svg">
            {pattern.map((row, r) =>
                row.map((cell, c) =>
                    cell ? (
                        <rect key={`${r}-${c}`} x={c * size} y={r * size} width={size} height={size} fill="#1A365D" rx="1" />
                    ) : null
                )
            )}
        </svg>
    )
}

const glassCard = `bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_32px_rgba(31,62,109,0.10),0_2px_8px_rgba(31,62,109,0.05),inset_0_1px_2px_rgba(255,255,255,0.95)]`

export default function ReceitaDetalhePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const medico = medicosMock.find(m => m.id === receitaMock.medico_id) ?? medicosMock[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-28 font-sans">

            {/* HEADER — padrão pt-4 pb-12 */}
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
            </header>

            <div className="px-5 -mt-5 space-y-4">

                {/* Status badge + validade */}
                <div className={`${glassCard} rounded-2xl px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-700 font-bold text-[13px]">Receita Ativa</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[12px]">
                        <Calendar className="w-3.5 h-3.5" />
                        Válida até {dateToDisplay(receitaMock.validade)}
                    </div>
                </div>

                {/* Médico prescritor */}
                <div className={`${glassCard} rounded-[22px] p-4 flex items-center gap-4`}>
                    <img src={medico.foto_url} className="w-14 h-14 rounded-[16px] object-cover border-2 border-white shadow-[0_4px_12px_rgba(45,82,132,0.18)]" alt={medico.nome} />
                    <div className="flex-1">
                        <p className="font-black text-[15px] text-[#1A365D] leading-tight">{medico.nome}</p>
                        <p className="text-[13px] text-[#2D5284] font-semibold">{medico.especialidade}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{medico.crm}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-700 text-[10px] font-bold">Verificado</span>
                    </div>
                </div>

                {/* QR Code + Código de Validação — estilo pergaminho premium */}
                <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                    {/* Faixa dourada superior */}
                    <div className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-4 py-2.5 flex items-center justify-between">
                        <p className="text-white/80 text-[11px] font-semibold tracking-wider uppercase">Código de Validação</p>
                        <div className="flex gap-2">
                            <button className="text-white/60 hover:text-white transition-colors" aria-label="Compartilhar">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="text-white/60 hover:text-white transition-colors" aria-label="Baixar">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {/* QR Code centralizado */}
                    <div className="p-6 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(26,54,93,0.12)] border border-slate-100/60 mb-4">
                            <QRCodeDisplay code={receitaMock.qr_code} />
                        </div>
                        {/* Código alfanumérico abaixo do QR */}
                        <div className="bg-[#F0F4F8] border border-slate-200/80 rounded-xl px-5 py-2.5 text-center">
                            <p className="text-[22px] font-black text-[#1A365D] tracking-[0.2em] font-mono">
                                {receitaMock.qr_code.replace('DOCMATCH-REC-', '').replace('-20240310', '')}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">Apresente este código na farmácia</p>
                        </div>
                    </div>
                </div>

                {/* Medicamentos — com genéricos embutidos */}
                <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                    <div className="px-4 pt-4 pb-3 flex items-center gap-2 border-b border-slate-100/80">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <h3 className="font-bold text-[#1A365D] text-[14px]">Medicamentos Prescritos</h3>
                        <span className="ml-auto bg-blue-50 text-[#2D5284] text-[11px] font-bold px-2 py-0.5 rounded-full">{receitaMock.medicamentos.length}</span>
                    </div>

                    <div className="divide-y divide-slate-100/80">
                        {receitaMock.medicamentos.map((med, i) => {
                            const genericos = genericosMap[med.nome] ?? []
                            return (
                                <div key={i} className="p-4">
                                    {/* Medicamento prescrito */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-[#2D5284]/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Pill className="w-4 h-4 text-[#2D5284]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[14px] text-[#1A365D] leading-tight">{med.nome}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{med.principio_ativo} · {med.concentracao} · {med.forma_farmaceutica}</p>
                                            </div>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">{med.quantidade} un.</span>
                                    </div>

                                    {/* Posologia */}
                                    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-xl px-3 py-2.5 mb-3 border border-blue-100/60">
                                        <p className="text-[12px] text-[#2D5284] font-semibold leading-relaxed">{med.posologia}</p>
                                        {med.uso_continuo && (
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                                <p className="text-[11px] text-amber-700 font-bold">Uso contínuo</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Seção de genéricos — claramente separada */}
                                    {genericos.length > 0 && (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 overflow-hidden">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/70">
                                                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <p className="text-[11px] text-slate-500 font-semibold">Opções de genérico — alternativas ao prescrito</p>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {genericos.map((gen, j) => (
                                                    <div key={j} className="px-3 py-2.5 flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-[12px] font-bold text-slate-700">{gen.nome}</p>
                                                            {gen.obs && <p className="text-[10px] text-slate-400 mt-0.5">{gen.obs}</p>}
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">{gen.concentracao}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Observações do médico */}
                {receitaMock.observacoes && (
                    <div className={`${glassCard} rounded-[22px] overflow-hidden`}>
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 pt-4 pb-3 border-b border-amber-100/80">
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
