'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Smartphone, Mail, Stethoscope } from 'lucide-react'

export default function VerificarEmailPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] to-[#0F2240] flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                <Mail className="w-10 h-10 text-[#D4AF37]" />
            </div>

            <h1 className="text-2xl font-black mb-2">Verifique seu e-mail</h1>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-xs mb-8">
                Enviamos um link de confirmação para sua caixa de entrada. Por favor, clique no link para ativar sua conta.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm mb-8">
                <div className="flex items-center gap-3 mb-4 text-left">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-[#D4AF37]" /></div>
                    <div>
                        <p className="font-bold text-xs">E-mail reenviado</p>
                        <p className="text-white/30 text-[10px]">Não recebeu? Verifique a caixa de spam.</p>
                    </div>
                </div>
                <button className="w-full bg-[#D4AF37] text-[#1A365D] font-black py-3 rounded-xl hover:brightness-110 transition-all">
                    REENVIAR E-MAIL
                </button>
            </div>

            <button onClick={() => router.push('/login')} className="text-white/40 text-xs hover:text-white transition-all underline">
                Voltar para o Login
            </button>
        </div>
    )
}
