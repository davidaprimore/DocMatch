'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Heart, Trash2, Download, Table, FileJson, Share2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LGPDPatientPage() {
    const router = useRouter()

    const handleExportJSON = () => {
        toast.success('Extração de dados Art. 20 (Portabilidade) iniciada. Formato .json em processamento.')
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-white px-5 pt-12 pb-8 border-b border-slate-100">
                <button onClick={() => router.back()} className="text-slate-400 mb-4 bg-slate-50 p-2 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-black text-slate-800">Seus Dados & Privacidade</h1>
                </div>
                <p className="text-slate-400 text-xs">Gerencie sua privacidade conforme a lei brasileira (LGPD).</p>
            </header>

            <div className="p-5 space-y-6">
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-[15px] mb-4">Exportar Informações</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleExportJSON} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center transition-active active:scale-95 group">
                            <FileJson className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-[11px] text-slate-700">JSON API</span>
                        </button>
                        <button className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center transition-active active:scale-95 group">
                            <Table className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-[11px] text-slate-700">PDF Relatório</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 text-center">O arquivo conterá seu histórico médico, receitas e dados cadastrais.</p>
                </section>

                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-[15px] mb-4">Gerenciar Consentimentos</h3>
                    <div className="space-y-4">
                        {[
                            { id: 'marketing', label: 'E-mails Promocionais', desc: 'Receber novidades e ofertas de farmácias.' },
                            { id: 'share', label: 'Compartilhamento de Perfil', desc: 'Permitir que médicos vejam seu histórico completo.' },
                            { id: 'tracking', label: 'Melhoria de Produto', desc: 'Coleta de dados anônimos para otimização da interface.' },
                        ].map(c => (
                            <div key={c.id} className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-bold text-xs text-slate-700">{c.label}</p>
                                    <p className="text-[10px] text-slate-400 leading-tight">{c.desc}</p>
                                </div>
                                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1 flex-shrink-0">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> SOLICITAR EXCLUSÃO DE CONTA
                </button>
            </div>
        </div>
    )
}
