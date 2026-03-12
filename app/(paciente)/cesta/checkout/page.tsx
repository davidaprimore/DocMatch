'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils/masks'
import { CreditCard, Truck, MapPin, ChevronRight } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const { total, count, limpar } = useCart()

    const handleFinalizar = () => {
        // Simulação de finalização
        limpar()
        router.push('/cesta/sucesso')
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <Header title="Finalizar Compra" showBackButton />

            <main className="px-5 -mt-8 space-y-4 relative z-30">
                {/* Endereço */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden shadow-sm">
                        <img src="/avatar-sophie.png" alt="Sophie" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] text-slate-400 font-bold uppercase">Entregar em</p>
                        <p className="text-[14px] font-bold text-slate-800">Sophie</p>
                        <p className="text-[12px] text-slate-500">Rua Augusta, 500 - Apto 82</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </section>

                {/* Pagamento */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                    <p className="text-[11px] text-slate-400 font-bold uppercase">Forma de Pagamento</p>
                    
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-bold text-slate-800">Cartão de Crédito</p>
                            <p className="text-[12px] text-slate-500">**** **** **** 1234</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                    </div>

                    <button className="w-full py-3 text-[13px] font-bold text-[#2D5284] border border-dashed border-blue-200 rounded-xl">
                        + Adicionar novo cartão
                    </button>
                </section>

                {/* Resumo */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                    <p className="text-[11px] text-slate-400 font-bold uppercase">Resumo do Pedido</p>
                    
                    <div className="flex justify-between text-[14px]">
                        <span className="text-slate-500">Subtotal ({count} itens)</span>
                        <span className="font-bold text-slate-800">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                        <span className="text-slate-500">Frete</span>
                        <span className="font-bold text-green-600">Grátis</span>
                    </div>
                    <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[15px] font-bold text-[#1A365D]">Total a Pagar</span>
                        <span className="text-[20px] font-black text-[#D4AF37]">{formatCurrency(total)}</span>
                    </div>
                </section>

                <div className="pt-4">
                    <button 
                        onClick={handleFinalizar}
                        className="w-full bg-[#2D5284] text-white font-black rounded-2xl py-5 text-[15px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                        Confirmar e Pagar
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-4 px-6">
                        Ao confirmar, você concorda com nossos termos de uso e políticas de privacidade.
                    </p>
                </div>
            </main>
        </div>
    )
}
