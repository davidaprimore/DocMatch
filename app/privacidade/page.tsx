'use call'

import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, ChevronRight } from 'lucide-react'

export default function PolíticaPrivacidadePage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            <header className="bg-white px-5 py-10 shadow-sm border-b border-slate-200">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 text-xs mb-4">
                    <ArrowLeft className="w-4 h-4" /> Voltar para o Início
                </Link>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Política de <span className="text-blue-600">Privacidade</span></h1>
                <p className="text-slate-400 text-xs mt-1">Atualizado em 10 de Março de 2026 · DocMatch LGPD Core</p>
            </header>

            <div className="px-5 py-8 space-y-8 max-w-2xl mx-auto">
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-600">
                        <ShieldCheck className="w-5 h-5" />
                        <h2 className="font-bold text-[15px]">Nossa Missão com Seus Dados</h2>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        No DocMatch, tratamos sua saúde com a máxima seriedade. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais em total conformidade com a **Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)**.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm">Seus Direitos (Art. 18 LGPD)</h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-slate-600 text-xs">
                            <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                            <span>Confirmação da existência de tratamento de dados.</span>
                        </li>
                        <li className="flex gap-3 text-slate-600 text-xs">
                            <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                            <span>Acesso facilitado aos dados e portabilidade (Art. 20).</span>
                        </li>
                        <li className="flex gap-3 text-slate-600 text-xs">
                            <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                            <span>Eliminação de dados pessoais desnecessários ou excessivos.</span>
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-[15px]">Quais dados coletamos?</h3>
                    <div className="grid gap-3">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                            <User className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="font-bold text-xs text-slate-700">Dados Cadastrais</p>
                                <p className="text-[11px] text-slate-500">Nome, CPF, Data de Nascimento, E-mail e Telefone.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                            <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="font-bold text-xs text-slate-700">Dados Sensíveis de Saúde</p>
                                <p className="text-[11px] text-slate-500">Receitas médicas, histórico de consultas e anamnese digital.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-[11px]">Dúvidas sobre privacidade? <span className="text-blue-600 font-bold">dpo@docmatch.com.br</span></p>
                </div>
            </div>
        </div>
    )
}

import { User } from 'lucide-react'
