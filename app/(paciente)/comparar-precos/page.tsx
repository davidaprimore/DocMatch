'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, ShoppingCart, TrendingDown, ExternalLink, Filter, Menu as MenuIcon } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { comparacaoPrecosMock, receitaMock } from '@/data/mockData'
import { formatCurrency, formatDistance } from '@/lib/utils/masks'
import { useCart } from '@/hooks/useCart'
import { useReceitas } from '@/hooks/useReceitas'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type OrderBy = 'preco' | 'distancia' | 'cobertura'

export default function CompararPrecosPage() {
    const router = useRouter()
    const { adicionar } = useCart()
    const { receitas, isLoading: isLoadingReceitas } = useReceitas()
    const [loading, setLoading] = useState(true)
    const [orderBy, setOrderBy] = useState<OrderBy>('preco')

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    const resultados = [...comparacaoPrecosMock].sort((a, b) => {
        if (orderBy === 'preco') return a.preco_total_cesta - b.preco_total_cesta
        if (orderBy === 'distancia') return (a.distancia_km || 999) - (b.distancia_km || 999)
        return b.medicamentos.length - a.medicamentos.length
    })

    const maisBarato = resultados[0]
    const maisCaro = resultados[resultados.length - 1]
    const economia = maisCaro.preco_total_cesta - maisBarato.preco_total_cesta

    const handleAdicionarCesta = (resultado: typeof maisBarato) => {
        resultado.medicamentos.forEach(item => {
            adicionar({
                id: item.medicamento.id,
                nome: item.medicamento.nome,
                principio_ativo: item.medicamento.principio_ativo,
                concentracao: item.medicamento.concentracao,
                farmacia_id: resultado.farmacia.id,
                farmacia_nome: resultado.farmacia.nome,
                preco_unitario: item.preco_unitario,
                distancia_km: resultado.distancia_km,
                farmacia_lat: resultado.farmacia.endereco.latitude,
                farmacia_lng: resultado.farmacia.endereco.longitude,
            })
        })
        toast.success(`Itens da ${resultado.farmacia.nome} adicionados à cesta!`)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md mb-5 relative">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Comparador de Preços</h1>
                    </div>
                    <button onClick={() => router.push('/menu')} className="text-white p-2 rounded-full hover:bg-white/10">
                        <MenuIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-[#D4AF37] text-[13px]">{receitaMock.medicamentos.length} medicamentos da sua receita</p>

                {/* Filtros Overlap */}
                <div className="absolute left-5 right-5 -bottom-5 z-30">
                    <div className="bg-white rounded-2xl p-1 shadow-card border border-white/60 flex gap-1">
                        {(['preco', 'distancia', 'cobertura'] as OrderBy[]).map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setOrderBy(opt)}
                                className={cn(
                                    "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                    orderBy === opt ? "bg-[#2D5284] text-white shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {opt === 'preco' ? 'Melhor Preço' : opt === 'distancia' ? 'Mais Perto' : 'Mais Itens'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="px-4 mt-8 space-y-4">
                {isLoadingReceitas ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Carregando comparador...</p>
                    </div>
                ) : receitas.length === 0 ? (
                    <div className="w-full bg-white/40 rounded-[28px] p-10 text-center border border-dashed border-slate-300 mt-10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <ShoppingCart className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-[15px] text-slate-600 font-bold mb-2">Nenhuma receita encontrada</p>
                        <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">Você precisa de uma prescrição médica digital para comparar preços de medicamentos.</p>
                        <button onClick={() => router.push('/buscar')} className="bg-[#1A365D] text-white px-6 py-3 rounded-xl font-bold text-[13px] shadow-md hover:bg-[#2D5284] transition-colors w-full">
                            Buscar Especialistas
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Banner Economia */}
                        {!loading && (
                    <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-[20px] p-4 border border-[#D4AF37]/30 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="w-5 h-5 text-[#1A365D]" />
                        </div>
                        <div>
                            <p className="font-black text-[#1A365D] text-[15px]">Economize até {formatCurrency(economia)}</p>
                            <p className="text-[11px] text-slate-600">comprando na farmácia recomendada</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    // Skeleton
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
                            <div className="h-20 bg-slate-50 rounded mb-4" />
                            <div className="h-10 bg-slate-100 rounded" />
                        </div>
                    ))
                ) : (
                    resultados.map((resultado, i) => {
                        const isMaisBarato = i === 0 && orderBy === 'preco'
                        const cobertura = `${resultado.medicamentos.length}/${receitaMock.medicamentos.length}`

                        return (
                            <div key={resultado.farmacia.id} className={cn(
                                "bg-white rounded-[20px] p-4 border shadow-card transition-all active:scale-[0.99]",
                                isMaisBarato ? "border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20" : "border-slate-100"
                            )}>
                                {isMaisBarato && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">Melhor Preço</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="font-bold text-[15px] text-slate-800 truncate">{resultado.farmacia.nome}</h3>
                                        {resultado.distancia_km && (
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {formatDistance(resultado.distancia_km)}
                                                {resultado.tempo_entrega && <span>· {resultado.tempo_entrega}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-black text-[20px] text-[#1A365D]">{formatCurrency(resultado.preco_total_cesta)}</p>
                                        <div className="flex flex-col items-end">
                                            {resultado.economia_vs_mais_caro > 0 && orderBy === 'preco' && (
                                                <span className="text-green-600 text-[11px] font-bold">-{formatCurrency(resultado.economia_vs_mais_caro)}</span>
                                            )}
                                            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md mt-1">
                                                Cobertura: {cobertura}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                                    {resultado.medicamentos.map(item => (
                                        <div key={item.medicamento.id} className="flex justify-between text-[12px]">
                                            <span className="text-slate-600 truncate flex-1 mr-2">{item.medicamento.nome}</span>
                                            <div className="flex gap-2 flex-shrink-0">
                                                {item.medicamento.preco_promocional && (
                                                    <span className="text-slate-400 line-through">{formatCurrency(item.medicamento.preco)}</span>
                                                )}
                                                <span className="font-bold text-[#1A365D]">{formatCurrency(item.preco_unitario)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => window.open(`https://maps.google.com/?q=${resultado.farmacia.nome}`, '_blank')}
                                        className="bg-slate-50 text-slate-600 font-bold rounded-xl py-2.5 px-3 text-[12px] flex items-center justify-center gap-1 hover:bg-slate-100"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://wa.me/5511999999999?text=Olá, vi o preço na DocMatch e gostaria de encomendar...`, '_blank')}
                                        className="bg-[#25D366]/10 text-[#25D366] font-bold rounded-xl py-2.5 px-3 text-[12px] flex items-center justify-center gap-1 hover:bg-[#25D366]/20"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleAdicionarCesta(resultado)}
                                        className="flex-1 bg-[#2D5284] text-white font-bold rounded-xl py-2.5 text-[12px] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" /> Adicionar à Cesta
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
                    </>
                )}
            </main>
            <BottomNav activeTab="buscar" />
        </div>
    )
}
