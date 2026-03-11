'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, ShoppingCart, TrendingDown, ExternalLink } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { comparacaoPrecosMock, receitaMock } from '@/data/mockData'
import { formatCurrency, formatDistance } from '@/lib/utils/masks'

export default function CompararPrecosPage() {
    const router = useRouter()
    const resultados = [...comparacaoPrecosMock].sort((a, b) => a.preco_total_cesta - b.preco_total_cesta)
    const maisBarato = resultados[0]
    const maisCaro = resultados[resultados.length - 1]
    const economia = maisCaro.preco_total_cesta - maisBarato.preco_total_cesta

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Comparador de Preços</h1>
                </div>
                <p className="text-white/60 text-[12px]">{receitaMock.medicamentos.length} medicamentos da sua receita</p>
            </header>

            <div className="px-4 mb-4">
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-[20px] p-4 border border-[#D4AF37]/30 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-5 h-5 text-[#1A365D]" />
                    </div>
                    <div>
                        <p className="font-black text-[#1A365D] text-[15px]">Economize até {formatCurrency(economia)}</p>
                        <p className="text-[11px] text-slate-600">comprando na farmácia mais barata vs. mais cara</p>
                    </div>
                </div>
            </div>

            <main className="px-4 space-y-4">
                {resultados.map((resultado, i) => {
                    const isMaisBarato = i === 0
                    return (
                        <div key={resultado.farmacia.id} className={`bg-white rounded-[20px] p-4 border shadow-card ${isMaisBarato ? 'border-[#D4AF37]/40' : 'border-slate-100'}`}>
                            {isMaisBarato && (
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">Melhor Preço</span>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-[15px] text-slate-800">{resultado.farmacia.nome}</h3>
                                    {resultado.distancia_km && (
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {formatDistance(resultado.distancia_km)}
                                            {resultado.tempo_entrega && <span>· {resultado.tempo_entrega}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-[20px] text-[#1A365D]">{formatCurrency(resultado.preco_total_cesta)}</p>
                                    {resultado.economia_vs_mais_caro > 0 && (
                                        <span className="text-green-600 text-[11px] font-bold">-{formatCurrency(resultado.economia_vs_mais_caro)}</span>
                                    )}
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
                                <button className="flex-1 bg-[#2D5284]/10 text-[#2D5284] font-bold rounded-xl py-2.5 text-[12px] flex items-center justify-center gap-1">
                                    <ExternalLink className="w-3.5 h-3.5" /> Ver site
                                </button>
                                <button className="flex-1 bg-[#2D5284] text-white font-bold rounded-xl py-2.5 text-[12px] flex items-center justify-center gap-1">
                                    <ShoppingCart className="w-3.5 h-3.5" /> Comprar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </main>
            <BottomNav />
        </div>
    )
}
