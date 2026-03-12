'use call'

import Link from 'next/link'
import { ArrowLeft, Scale, Gavel, FileText, CheckCircle } from 'lucide-react'

export default function TermosUsoPage() {
    return (
        <div className="min-h-screen bg-white pb-10">
            <header className="bg-slate-900 px-5 py-12 text-white">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 text-xs mb-4">
                    <ArrowLeft className="w-4 h-4" /> Home
                </Link>
                <h1 className="text-2xl font-black tracking-tight">Termos de <span className="text-[#D4AF37]">Uso</span></h1>
                <p className="text-slate-500 text-xs mt-1">DocMatch Platform · Termos de Serviço v2.1</p>
            </header>

            <div className="px-5 py-8 space-y-8 max-w-2xl mx-auto">
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-800">
                        <Scale className="w-5 h-5 text-[#D4AF37]" />
                        <h2 className="font-black text-[15px] uppercase">1. Aceite dos Termos</h2>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Ao acessar a plataforma DocMatch, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
                    </p>
                </section>

                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-800">
                        <Gavel className="w-5 h-5 text-[#D4AF37]" />
                        <h2 className="font-black text-[15px] uppercase">2. Uso de Licença</h2>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        É concedida permissão para baixar temporariamente uma cópia dos materiais na DocMatch, apenas para visualização pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.
                    </p>
                </section>

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 italic">
                    <p className="text-slate-500 text-xs leading-relaxed">
                        "O DocMatch não substitui o aconselhamento médico profissional. Sempre procure a orientação de seu médico ou outro profissional de saúde qualificado."
                    </p>
                </div>

                <div className="pt-8 text-center">
                    <p className="text-slate-400 text-[10px]">DocMatch Tecnologia em Saúde LTDA · CNPJ 00.000.000/0001-00</p>
                </div>
            </div>
        </div>
    )
}
