'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, MapPin, ExternalLink, CreditCard } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDistance } from '@/lib/utils/masks'

export default function CestaPage() {
    const router = useRouter()
    const { porFarmacia, total, count, adicionar, atualizarQuantidade, remover, limpar } = useCart()

    // Efeito para popular a cesta com mocks para visualização (conforme pedido pelo usuário)
    useEffect(() => {
        if (count === 0) {
            adicionar({
                id: 'med_001',
                nome: 'Amoxicilina 500mg',
                principio_ativo: 'Amoxicilina',
                concentracao: '500mg',
                farmacia_id: 'farm_001',
                farmacia_nome: 'Droga Raia - Augusta',
                preco_unitario: 24.90,
                quantidade: 1,
                distancia_km: 0.8,
                whatsapp: '5511999999999'
            })
            adicionar({
                id: 'med_002',
                nome: 'Dipirona Sódica 500mg',
                principio_ativo: 'Dipirona',
                concentracao: '500mg',
                farmacia_id: 'farm_001',
                farmacia_nome: 'Droga Raia - Augusta',
                preco_unitario: 12.50,
                quantidade: 2,
                distancia_km: 0.8,
                whatsapp: '5511999999999'
            })
        }
    }, [count, adicionar])

    const farmaciasIds = Object.keys(porFarmacia)

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32">
            {/* Header Padronizado */}
            <Header showBackButton showNotifications>
                <h1 className="text-white font-bold text-[18px]">Minha Cesta</h1>
            </Header>

            {/* Resumo Overlap (Fixo abaixo do header) */}
            <div className="px-5 -mt-12 mb-8 relative z-30">
                <div className="bg-white rounded-[20px] p-4 shadow-card border border-white/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#1A365D]">{count} item{count !== 1 ? 's' : ''}</p>
                            <p className="text-[11px] text-slate-400">Prontos para compra</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-slate-400 font-medium uppercase">Total</p>
                        <p className="text-[20px] font-black text-[#1A365D]">{formatCurrency(total)}</p>
                    </div>
                </div>
            </div>

            <main className="px-5 pt-8 space-y-6">
                {count === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-slate-800 font-bold text-[18px]">Sua cesta está vazia</h2>
                        <p className="text-slate-500 text-[13px] mt-2 mb-8 px-10">Você ainda não adicionou nenhum medicamento à sua cesta.</p>
                        <button 
                            onClick={() => router.push('/buscar')}
                            className="bg-[#2D5284] text-white font-bold py-3 px-8 rounded-2xl shadow-lg active:scale-95 transition-all"
                        >
                            Buscar Medicamentos
                        </button>
                    </div>
                ) : (
                    farmaciasIds.map(fId => {
                        const farm = porFarmacia[fId]
                        return (
                            <section key={fId} className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm">
                                {/* Farmácia Header */}
                                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-[#1A365D] text-[15px]">{farm.farmacia_nome}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {farm.distancia_km && (
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {formatDistance(farm.distancia_km)}
                                                    </span>
                                                )}
                                                <span className="text-slate-300">·</span>
                                                <span className="text-[11px] font-bold text-emerald-600 uppercase">Aberta</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-black text-[#1A365D]">{formatCurrency(farm.subtotal)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Itens */}
                                <div className="p-2 space-y-1">
                                    {farm.itens.map(item => (
                                        <div key={item.id} className="flex p-3 gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 text-[14px] truncate">{item.nome}</p>
                                                <p className="text-[11px] text-slate-400">{item.concentracao} · {item.principio_ativo}</p>
                                                <p className="text-[13px] font-bold text-[#2D5284] mt-1">{formatCurrency(item.preco_unitario)}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                                    <button 
                                                        onClick={() => atualizarQuantidade(item.id, fId, item.quantidade - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#2D5284] active:scale-90"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-6 text-center text-[13px] font-black text-[#1A365D]">{item.quantidade}</span>
                                                    <button 
                                                        onClick={() => atualizarQuantidade(item.id, fId, item.quantidade + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#2D5284] active:scale-90"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => remover(item.id, fId)}
                                                    className="w-10 h-10 flex items-center justify-center text-red-200 hover:text-red-500 active:scale-90"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Ações da Farmácia */}
                                <div className="p-4 bg-slate-50/30 grid grid-cols-2 gap-3 border-t border-slate-50">
                                    <button 
                                        onClick={() => window.open(`https://maps.google.com/?q=${farm.farmacia_nome}`, '_blank')}
                                        className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-[12px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                                    >
                                        <MapPin className="w-4 h-4" /> Rota
                                    </button>
                                    <button 
                                        onClick={() => window.open(`https://wa.me/5511999999999?text=Olá, gostaria de encomendar os itens da minha cesta DocMatch: ${farm.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}`, '_blank')}
                                        className="bg-[#25D366] text-white font-bold py-2.5 rounded-xl text-[12px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" /> WhatsApp
                                    </button>
                                </div>
                            </section>
                        )
                    })
                )}

                {count > 0 && (
                    <div className="px-5 mt-8 mb-12">
                        <button 
                            onClick={() => router.push('/cesta/checkout')}
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 text-[14px] shadow-[0_4px_16px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                        >
                            <CreditCard className="w-5 h-5" />
                            Finalizar Compra ({formatCurrency(total)})
                        </button>
                    </div>
                )}
            </main>

            <BottomNav activeTab="cesta" />
        </div>
    )
}
