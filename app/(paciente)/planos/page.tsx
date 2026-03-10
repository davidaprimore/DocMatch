'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Zap, Star, ShieldCheck, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

const planosPaciente = [
    {
        id: 'free',
        nome: 'DocMatch Free',
        preco: 'R$ 0',
        descricao: 'Busca e agendamento básico para sua saúde.',
        recursos: ['Busca de médicos', 'Agendamento básico', 'Receitas digitais'],
        cor: 'border-white/10 bg-white/5',
        buttonLabel: 'PLANO ATUAL',
        disabled: true
    },
    {
        id: 'plus',
        nome: 'DocMatch Plus',
        preco: 'R$ 14,90',
        periodo: '/mês',
        descricao: 'Descontos exclusivos e prioridade em listas.',
        recursos: ['Tudo do Free', 'Descontos em farmácias', 'Prioridade em listas de espera'],
        cor: 'border-blue-500/30 bg-blue-500/5',
        buttonLabel: 'ASSINAR PLUS',
        popular: true
    },
    {
        id: 'prime',
        nome: 'DocMatch Prime',
        preco: 'R$ 29,90',
        periodo: '/mês',
        descricao: 'O máximo em agilidade e telemedicina.',
        recursos: ['Tudo do Plus', 'Acesso a Slots Rápidos ⚡', 'Teleconsultas com valor reduzido'],
        cor: 'border-[#D4AF37]/30 bg-[#D4AF37]/5',
        buttonLabel: 'ASSINAR PRIME',
        destaque: true
    }
]

export default function PlanosPacientePage() {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleAssinar = (id: string) => {
        setLoading(id)
        setTimeout(() => {
            setLoading(null)
            toast.success('Assinatura processada com sucesso!')
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-10">
            <header className="px-5 pt-12 pb-8 text-center relative">
                <button onClick={() => router.back()} className="absolute left-5 top-12 text-white bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-white font-black text-2xl mb-1 mt-4">Escolha seu <span className="text-[#D4AF37]">Plano</span></h1>
                <p className="text-white/40 text-[13px]">Potencialize sua experiência no DocMatch</p>
            </header>

            <div className="px-5 space-y-4">
                {planosPaciente.map((plano) => (
                    <div key={plano.id} className={`relative rounded-[32px] border p-6 overflow-hidden transition-all ${plano.cor} ${plano.destaque ? 'shadow-[0_0_30px_rgba(212,175,55,0.15)]' : ''}`}>
                        {plano.popular && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                                MAIS POPULAR
                            </div>
                        )}
                        {plano.destaque && (
                            <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1A365D] text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                                MELHOR ESCOLHA
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-white font-black text-lg flex items-center gap-2">
                                {plano.nome}
                                {plano.id === 'prime' && <Zap className="w-4 h-4 text-[#D4AF37]" />}
                            </h3>
                            <div className="flex items-baseline mt-2">
                                <span className="text-white font-black text-3xl">{plano.preco}</span>
                                {plano.periodo && <span className="text-white/30 text-sm ml-1">{plano.periodo}</span>}
                            </div>
                            <p className="text-white/40 text-[12px] mt-2">{plano.descricao}</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {plano.recursos.map((recurso, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plano.id === 'prime' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/10 text-white/40'}`}>
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-white/80 text-[13px]">{recurso}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleAssinar(plano.id)}
                            disabled={plano.disabled || loading !== null}
                            className={`w-full py-4 rounded-2xl font-black text-[13px] transition-active active:scale-95 flex items-center justify-center gap-2 ${plano.id === 'prime'
                                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] shadow-lg shadow-[#D4AF37]/20'
                                    : plano.id === 'plus'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/5 text-white/20 border border-white/5'
                                }`}
                        >
                            {loading === plano.id ? (
                                'PROCESSANDO...'
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4" />
                                    {plano.buttonLabel}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-5 mt-6 text-center">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                    <p className="text-white font-bold text-sm mb-1">Garantia de Satisfação</p>
                    <p className="text-white/30 text-[11px] leading-relaxed">Assine com tranquilidade. Você pode cancelar sua assinatura a qualquer momento diretamente nas configurações.</p>
                </div>
            </div>
        </div>
    )
}
