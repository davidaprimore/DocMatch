'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Stethoscope } from 'lucide-react'
import { toast } from 'sonner'

export default function RecuperarSenhaPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [enviado, setEnviado] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) { toast.error('Informe seu e-mail'); return }
        setEnviado(true)
        toast.success('E-mail enviado! Verifique sua caixa de entrada.')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] via-[#2D5284] to-[#1A365D] flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Stethoscope className="w-7 h-7 text-[#1A365D]" />
            </div>
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                <button onClick={() => router.back()} className="text-white/60 mb-4 flex items-center gap-1 text-[13px]">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <h2 className="text-white font-bold text-xl mb-1">Recuperar senha</h2>
                <p className="text-white/50 text-[13px] mb-5">Enviaremos um link para redefinir sua senha.</p>

                {!enviado ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white/80 text-xs font-semibold mb-1.5 block">E-mail da conta</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#D4AF37] transition" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-xl py-3.5 hover:brightness-105 transition">
                            Enviar link de recuperação
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-5xl mb-4">📧</div>
                        <p className="text-white font-bold text-[15px] mb-1">E-mail enviado!</p>
                        <p className="text-white/50 text-[13px]">Verifique sua caixa de entrada e clique no link.</p>
                        <button onClick={() => router.push('/login')} className="mt-4 text-[#D4AF37] font-semibold text-[13px] hover:underline">
                            Voltar ao login
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
