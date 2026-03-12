'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, MapPin, ExternalLink, CreditCard, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useCart } from '@/hooks/useCart'
import { formatCurrency, formatDistance } from '@/lib/utils/masks'
import { cn } from '@/lib/utils'

export default function CestaPage() {
    const router = useRouter()
    const { porFarmacia, total, count, adicionar, atualizarQuantidade, remover, limpar } = useCart()

    // Efeito para popular a cesta com mocks variados para visualização
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
                whatsapp: '5511999999999',
                priceVariation: 'down',
                isCheapest: true
            })
            adicionar({
                id: 'med_002',
                nome: 'Dipirona Sódica 500mg',
                principio_ativo: 'Dipirona',
                concentracao: '500mg',
                farmacia_id: 'farm_002',
                farmacia_nome: 'Pague Menos - Paulista',
                preco_unitario: 14.50,
                quantidade: 2,
                distancia_km: 1.2,
                whatsapp: '5511999999999',
                priceVariation: 'up'
            })
        }
    }, [count, adicionar])

    const farmaciasIds = Object.keys(porFarmacia)

    // Glass card class aprimorado para "vidro grosso" e profundidade
    const thickGlass = "bg-white/60 backdrop-blur-[20px] border border-white/40 shadow-[0_20px_50px_rgba(31,62,109,0.15),inset_0_1px_1px_rgba(255,255,255,1)]"

    return (
        <div className="relative min-h-screen overflow-x-hidden pt-1">
            {/* CONTEÚDO (relative z-10 para ficar sobre a névoa global) */}
            <div className="relative z-10 pb-32 flex flex-col font-sans">
                {/* HEADER COM RESUMO OVERLAPPING */}
                <div className="relative mb-16">
                    <Header
                        variant="page"
                        title="Minha Cesta"
                        showBackButton
                        showNotifications
                        userAvatar="/avatar-joce.png"
                        userName="Joce Moreno"
                    />

                    {/* Resumo Overlap Premium */}
                    <div className="absolute left-5 right-5 -bottom-10 z-50">
                        <div className={cn(thickGlass, "rounded-[32px] p-5 flex items-center justify-between")}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(212,175,55,0.3)]">
                                    <ShoppingCart className="w-6 h-6 text-[#1A365D]" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-black text-[#1A365D] leading-none mb-1">{count} item{count !== 1 ? 's' : ''}</p>
                                    <p className="text-[11px] text-[#2D5284]/70 font-medium tracking-tight">Prontos para fechamento</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Subtotal</p>
                                <p className="text-[24px] font-black text-[#1A365D] leading-none tracking-tighter">{formatCurrency(total)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="px-5 space-y-8">
                    {count === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <ShoppingCart className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-[#1A365D] font-black text-[20px]">Sua cesta está vazia</h2>
                            <p className="text-slate-500 text-[14px] mt-2 mb-8 px-10 leading-relaxed font-medium">Ops! Parece que você ainda não selecionou seus medicamentos favoritos.</p>
                            <button
                                onClick={() => router.push('/buscar')}
                                className="bg-[#2D5284] text-white font-black py-4 px-10 rounded-2xl shadow-[0_12px_24px_rgba(45,82,132,0.3)] active:scale-95 transition-all text-sm uppercase tracking-wider"
                            >
                                Quero economizar agora
                            </button>
                        </div>
                    ) : (
                        farmaciasIds.map(fId => {
                            const farm = porFarmacia[fId]
                            return (
                                <section key={fId} className={cn(thickGlass, "rounded-[32px] overflow-hidden transition-all hover:shadow-[0_30px_60px_rgba(31,62,109,0.2)]")}>
                                    {/* Farmácia Header */}
                                    <div className="bg-white/30 px-6 py-5 border-b border-white/40 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                                                <MapPin className="text-[#2D5284] w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-[#1A365D] text-[15px] leading-tight">{farm.farmacia_nome}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] font-bold text-[#2D5284]/60">{formatDistance(farm.distancia_km || 0)} de você</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Preços Atualizados</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[16px] font-black text-[#1A365D] leading-none">{formatCurrency(farm.subtotal)}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Subtotal</p>
                                        </div>
                                    </div>

                                    {/* Itens da Farmácia */}
                                    <div className="p-4 space-y-4">
                                        {farm.itens.map(item => (
                                            <div key={item.id} className="relative bg-white/40 rounded-[22px] p-4 flex gap-4 border border-white/50 group transition-all active:scale-[0.98]">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-black text-[#1A365D] text-[15px] leading-tight group-hover:text-[#2D5284] transition-colors">{item.nome}</p>
                                                            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{item.concentracao} · {item.principio_ativo}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[16px] font-black text-[#1A365D]">{formatCurrency(item.preco_unitario)}</p>
                                                            {item.priceVariation === 'down' && (
                                                                <div className="flex items-center justify-end gap-1 text-emerald-600 text-[10px] font-black">
                                                                    <TrendingDown className="w-3 h-3" /> Preço Baixou!
                                                                </div>
                                                            )}
                                                            {item.priceVariation === 'up' && (
                                                                <div className="flex items-center justify-end gap-1 text-amber-600 text-[10px] font-black">
                                                                    <TrendingUp className="w-3 h-3" /> Preço Subiu
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Alertas Premium */}
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {item.isCheapest ? (
                                                            <div className="bg-emerald-100/80 backdrop-blur-sm border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 ring-1 ring-emerald-400/10">
                                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Melhor preço encontrado!</span>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 ring-1 ring-blue-400/10">
                                                                <Sparkles className="w-3 h-3 text-[#2D5284]" />
                                                                <span className="text-[10px] font-black text-[#2D5284] uppercase tracking-tight">Economize R$ 4,50 em outra farmácia</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Controles de Quantidade */}
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center bg-white/60 p-1 rounded-2xl border border-white shadow-sm">
                                                            <button
                                                                onClick={() => atualizarQuantidade(item.id, fId, item.quantidade - 1)}
                                                                className="w-9 h-9 flex items-center justify-center text-[#2D5284] hover:bg-white rounded-xl transition-all active:scale-90"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-8 text-center text-[15px] font-black text-[#1A365D]">{item.quantidade}</span>
                                                            <button
                                                                onClick={() => atualizarQuantidade(item.id, fId, item.quantidade + 1)}
                                                                className="w-9 h-9 flex items-center justify-center text-[#2D5284] hover:bg-white rounded-xl transition-all active:scale-90"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => remover(item.id, fId)}
                                                            className="w-10 h-10 flex items-center justify-center text-red-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Ações do Bloco Farmácia */}
                                    <div className="p-4 pt-2 bg-gradient-to-t from-white/40 to-transparent grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => window.open(`https://maps.google.com/?q=${farm.farmacia_nome}`, '_blank')}
                                            className="bg-white/80 hover:bg-white border border-white/60 text-[#1A365D] font-black py-3.5 rounded-2xl text-[12px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm"
                                        >
                                            <MapPin className="w-4 h-4" /> Traçar Rota
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://wa.me/${farm.whatsapp}?text=DocZap: Gostaria de reservar meus itens...`, '_blank')}
                                            className="bg-[#25D366] text-white font-black py-3.5 rounded-2xl text-[12px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_8px_16px_rgba(37,211,102,0.25)]"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Enviar p/ DocZap
                                        </button>
                                    </div>
                                </section>
                            )
                        })
                    )}

                    {count > 0 && (
                        <div className="pt-4 pb-12 animate-in slide-in-from-bottom duration-700">
                            <button
                                onClick={() => router.push('/cesta/checkout')}
                                className="w-full bg-gradient-to-br from-[#1F3E6D] to-[#12274A] text-white font-black rounded-[24px] py-5 text-[16px] shadow-[0_20px_40px_rgba(26,54,93,0.4)] flex flex-col items-center justify-center gap-1 hover:scale-[1.02] transition-transform active:scale-95 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30 transform -skew-x-12" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                                    <span className="uppercase tracking-widest">Finalizar Compra</span>
                                </div>
                                <span className="text-[13px] font-bold text-white/50 tracking-normal relative z-10">Pagar {formatCurrency(total)} com cartão ou Pix</span>
                            </button>

                            <div className="mt-8 flex flex-col items-center gap-3">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> Transação Segura via DocMatch Pay
                                </p>
                                <img src="/bandeiras-cartao.png" className="h-6 opacity-30 grayscale" alt="Pagamentos Aceitos" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                        </div>
                    )}
                </main>
                <BottomNav activeTab="cesta" />
            </div>
        </div>
    )
}
