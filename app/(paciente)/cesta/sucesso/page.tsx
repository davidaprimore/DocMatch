'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react'

export default function SucessoPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-[24px] font-black text-[#1A365D] mb-2">Pedido Realizado!</h1>
            <p className="text-slate-500 text-[15px] mb-10">
                Seu pedido foi enviado para as farmácias e em breve você receberá as atualizações.
            </p>

            <div className="w-full space-y-3">
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-[#2D5284] text-white font-black rounded-2xl py-4 text-[14px] shadow-md flex items-center justify-center gap-2"
                >
                    Voltar para o Início
                </button>
                
                <button 
                    onClick={() => router.push('/consultas')}
                    className="w-full bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl py-4 text-[14px] flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" /> Ver meus pedidos
                </button>
            </div>

            <div className="mt-12 p-4 bg-blue-50 rounded-2xl flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[18px]">💡</span>
                </div>
                <p className="text-[12px] text-[#2D5284] font-medium leading-tight">
                    Você economizou <span className="font-bold">R$ 18,40</span> nesta compra usando o Comparador DocMatch!
                </p>
            </div>
        </div>
    )
}
