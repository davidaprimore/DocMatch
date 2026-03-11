'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Heart, SlidersHorizontal, Filter } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { medicosMock, especialidadesMock } from '@/data/mockData'

export default function BuscarPage() {
    const router = useRouter()
    const [busca, setBusca] = useState('')
    const [filtroEsp, setFiltroEsp] = useState('')
    const [favoritos, setFavoritos] = useState<string[]>(['med_001', 'med_005'])

    const medicosFiltrados = medicosMock.filter(m => {
        const matchBusca = !busca || m.nome.toLowerCase().includes(busca.toLowerCase()) || m.especialidade.toLowerCase().includes(busca.toLowerCase())
        const matchEsp = !filtroEsp || m.especialidade === filtroEsp
        return matchBusca && matchEsp
    })

    const toggleFavorito = (id: string) =>
        setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md relative z-20 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-95">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-white font-bold text-[18px]">Buscar Profissionais</h1>
                    </div>
                    {/* Componente Constante: Logo + Notificações */}
                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors" onClick={() => router.push('/notificacoes')}>
                            <Star strokeWidth={2} className="w-[18px] h-[18px] opacity-0 absolute pointer-events-none" />{/* Spacer Ghost para manter alinhamento se trocar de icon*/}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
                        </button>
                        <div className="flex items-center">
                            <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
                            <span className="text-[18px] font-bold text-white ml-[1px] leading-none">Match</span>
                        </div>
                    </div>
                </div>
                <div className="absolute left-5 right-5 -bottom-6 z-30 flex gap-2">
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text" value={busca} onChange={e => setBusca(e.target.value)}
                            placeholder="Especialidade, nome ou sintoma..."
                            className="w-full bg-white rounded-[16px] py-[14px] pr-4 shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-[13px] font-medium text-slate-600 outline-none placeholder:text-slate-400"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                    <button className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-[#2D5284] flex-shrink-0">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="px-4 pt-4 pb-3">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button onClick={() => setFiltroEsp('')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors ${!filtroEsp ? 'bg-[#2D5284] text-white border-[#2D5284]' : 'bg-white text-slate-600 border-slate-200'}`}>
                        Todos
                    </button>
                    {especialidadesMock.slice(0, 10).map(esp => (
                        <button key={esp} onClick={() => setFiltroEsp(esp === filtroEsp ? '' : esp)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors whitespace-nowrap ${filtroEsp === esp ? 'bg-[#2D5284] text-white border-[#2D5284]' : 'bg-white text-slate-600 border-slate-200'}`}>
                            {esp}
                        </button>
                    ))}
                </div>
            </div>

            <main className="px-4 space-y-3">
                <p className="text-[12px] text-slate-500 font-medium px-1">{medicosFiltrados.length} profissionais encontrados</p>
                {medicosFiltrados.map(m => (
                    <div key={m.id} className="bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-100"
                        onClick={() => router.push(`/buscar/${m.id}`)}>
                        <div className="flex gap-4">
                            <div className="relative">
                                <img src={m.foto_url} className="w-[72px] h-[72px] rounded-[20px] object-cover border border-slate-100" alt={m.nome} />
                                {m.destaque && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#1A365D] text-[8px] font-black px-1.5 py-0.5 rounded-full">DESTAQUE</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[15px] text-slate-800 truncate">{m.nome}</h3>
                                        <p className="text-[12px] text-[#2D5284] font-medium">{m.especialidade}</p>
                                        {m.subespecialidade && <p className="text-[10px] text-slate-400">{m.subespecialidade}</p>}
                                    </div>
                                    <button onClick={e => { e.stopPropagation(); toggleFavorito(m.id) }} className="ml-2 flex-shrink-0">
                                        <Heart className={`w-5 h-5 transition-colors ${favoritos.includes(m.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" /> <b className="text-slate-700">{m.avaliacao}</b> ({m.total_avaliacoes})</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.endereco_consultorio.bairro}, {m.endereco_consultorio.estado}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2.5">
                                    <span className="text-[13px] font-bold text-[#2D5284]">R$ {m.valor_consulta.toLocaleString('pt-BR')}</span>
                                    <button onClick={(e) => { e.stopPropagation(); router.push(`/agendar/${m.id}`) }} className="bg-[#2D5284] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl shadow-sm hover:brightness-110 transition">
                                        Agendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <BottomNav />
        </div>
    )
}
