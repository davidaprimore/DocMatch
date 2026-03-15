'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Heart, SlidersHorizontal, Filter, Navigation } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { medicosMock, especialidadesMock } from '@/data/mockData'
import { calculateDistance, formatDistance, Coordinates } from '@/lib/geoUtils'
import debounce from 'lodash/debounce'
import DOMPurify from 'dompurify'

export default function BuscarPage() {
    const router = useRouter()
    const [busca, setBusca] = useState('')
    const [displayBusca, setDisplayBusca] = useState('')
    const [filtroEsp, setFiltroEsp] = useState('')
    const [raioKm, setRaioKm] = useState<number>(50) // Raio padrão 50km
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [favoritos, setFavoritos] = useState<string[]>(['med_001', 'med_005'])
    const [showFilters, setShowFilters] = useState(false)

    // Debounce de busca para performance e sanitização para segurança
    const debouncedSetBusca = useCallback(
        debounce((valor: string) => {
            const sanitized = DOMPurify.sanitize(valor)
            setBusca(sanitized)
        }, 300),
        []
    )

    const handleBuscaChange = (valor: string) => {
        setDisplayBusca(valor)
        debouncedSetBusca(valor)
    }

    // Pegar localização do usuário
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                },
                (error) => {
                    console.error('Erro ao obter localização:', error)
                    // Fallback para localização padrão (São Paulo - centro) se/quando negado
                    setUserCoords({ latitude: -23.5505, longitude: -46.6333 })
                }
            )
        }
    }, [])

    const medicosFiltrados = useMemo(() => {
        return (medicosMock as any[]).filter((m: any) => {
            const matchBusca = !busca || 
                m.nome.toLowerCase().includes(busca.toLowerCase()) || 
                m.especialidade.toLowerCase().includes(busca.toLowerCase())
            
            const matchEsp = !filtroEsp || m.especialidade === filtroEsp

            // Lógica de Proximidade
            if (userCoords && m.endereco_consultorio.latitude && m.endereco_consultorio.longitude) {
                const docCoords = {
                    latitude: m.endereco_consultorio.latitude,
                    longitude: m.endereco_consultorio.longitude
                }
                const distancia = calculateDistance(userCoords, docCoords)
                
                // Filtro de Raio
                const matchRaio = distancia <= raioKm
                return matchBusca && matchEsp && matchRaio
            }

            return matchBusca && matchEsp
        }).map((m: any) => {
            // Adiciona distância calculada ao objeto para exibição
            let distancia = null
            if (userCoords && m.endereco_consultorio.latitude && m.endereco_consultorio.longitude) {
                distancia = calculateDistance(userCoords, {
                    latitude: m.endereco_consultorio.latitude,
                    longitude: m.endereco_consultorio.longitude
                })
            }
            return { ...m, distanciaCalculada: distancia }
        }).sort((a: any, b: any) => (a.distanciaCalculada || 9999) - (b.distanciaCalculada || 9999)) // Ordenar por proximidade
    }, [busca, filtroEsp, raioKm, userCoords])

    const toggleFavorito = (id: string) =>
        setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* CONTEÚDO (relative z-10 para ficar sobre a névoa global) */}
            <div className="relative z-10 pb-24 flex flex-col font-sans">
                {/* HEADER AZUL PREMIUM PADRONIZADO */}
                <div className="relative mb-12">
                    <Header title="Buscar Profissionais" showBackButton showNotifications className="mb-0" />

                    {/* BARRA DE BUSCA E FILTRO OVERLAPPING */}
                    <div className="absolute left-5 right-5 -bottom-6 z-50 flex flex-col gap-3 group">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text" value={displayBusca} onChange={e => handleBuscaChange(e.target.value)}
                                    placeholder="Especialidade, nome ou sintoma..."
                                    className="w-full bg-white rounded-[16px] py-[14px] pr-4 shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-[13px] font-medium text-slate-600 outline-none placeholder:text-slate-400"
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all ${showFilters ? 'bg-[#2D5284] text-white' : 'bg-white text-[#2D5284]'}`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                {/* PAINEL DE FILTRO DE RAIO (ESTILO TINDER) */}
                {showFilters && (
                    <div className="bg-white rounded-[24px] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#2D5284]" />
                                    Distância Máxima
                                </h4>
                                <p className="text-[11px] text-slate-400 font-medium">Busca estilo Tinder</p>
                            </div>
                            <span className="text-[15px] font-black text-[#2D5284] bg-[#2D5284]/5 px-4 py-2 rounded-2xl border border-[#2D5284]/10">
                                {raioKm >= 1000 ? 'Brasil Inteiro' : `${raioKm} km`}
                            </span>
                        </div>
                        
                        <div className="relative h-10 flex items-center px-2">
                            <input 
                                type="range" min="1" max="1000" step="5"
                                value={raioKm} onChange={e => setRaioKm(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2D5284] z-10"
                            />
                            {/* Pontos de referência no slider */}
                            <div className="absolute inset-x-0 h-1.5 flex justify-between px-2 pointer-events-none">
                                {[0, 250, 500, 750, 1000].map(pt => (
                                    <div key={pt} className="w-1 h-1 bg-slate-300 rounded-full mt-[2px]" />
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-3 px-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Vizinho (1km)</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nacional (1000km)</span>
                        </div>

                        {/* DICA DE GPS (GUIA RÁPIDO) */}
                        <div className="mt-6 p-4 bg-emerald-50 rounded-[20px] border border-emerald-100/50 flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                                <span className="text-xl">📍</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11.5px] font-bold text-emerald-800 leading-tight">Como ativar localização real?</p>
                                <p className="text-[10px] text-emerald-600/80 mt-1">Clique no cadeado <span className="font-black">🔒</span> ao lado da URL {'>'} Configurações {'>'} Localização {'>'} Permitir.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CHIPS DE ESPECIALIDADES */}
            <div className="px-4 pb-3 mt-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button onClick={() => setFiltroEsp('')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border transition-all ${!filtroEsp ? 'bg-[#2D5284] text-white border-[#2D5284]' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                        🚀 Todos
                    </button>
                    {especialidadesMock.slice(0, 10).map(esp => (
                        <button key={esp} onClick={() => setFiltroEsp(esp === filtroEsp ? '' : esp)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border transition-all whitespace-nowrap ${filtroEsp === esp ? 'bg-[#2D5284] text-white border-[#2D5284]' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                            {esp}
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTAGEM DE MÉDICOS */}
            <main className="px-4 space-y-3">
                <div className="flex justify-between items-center px-1 mb-1">
                    <p className="text-[12px] text-slate-500 font-bold">{medicosFiltrados.length} profissionais encontrados</p>
                    {userCoords && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            GPS Ativo
                        </span>
                    )}
                </div>

                {medicosFiltrados.length > 0 ? medicosFiltrados.map(m => (
                    <div key={m.id} className="bg-white rounded-[24px] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98] group"
                        onClick={() => router.push(`/buscar/${m.id}`)}>
                        <div className="flex gap-4">
                            <div className="relative">
                                <div className="w-[72px] h-[72px] rounded-[22px] overflow-hidden border-2 border-white shadow-md">
                                    <img src={m.foto_url} className="w-full h-full object-cover" alt={m.nome} />
                                </div>
                                {m.destaque && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-[#D4AF37] to-[#F1D279] text-[#1A365D] text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm ring-2 ring-white">DESTAQUE</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[15px] text-slate-800 truncate group-hover:text-[#2D5284] transition-colors">{m.nome}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-[12px] text-[#2D5284] font-bold">{m.especialidade}</p>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            {m.distanciaCalculada !== null && (
                                                <span className="text-[11px] text-emerald-600 font-black">{formatDistance(m.distanciaCalculada)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={e => { e.stopPropagation(); toggleFavorito(m.id) }} className="ml-2 flex-shrink-0 p-1.5 bg-slate-50 rounded-full">
                                        <Heart className={`w-4 h-4 transition-all ${favoritos.includes(m.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300'}`} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {m.avaliacao}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium italic"><MapPin className="w-3 h-3 text-[#2D5284]" /> {m.endereco_consultorio.bairro}{m.endereco_consultorio.cidade !== 'São Paulo' ? `, ${m.endereco_consultorio.cidade}` : ''}</span>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">A partir de</span>
                                        <span className="text-[16px] font-black text-[#2D5284]">R$ {m.valor_consulta.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); router.push(`/agendar/${m.id}`) }} 
                                        className="bg-gradient-to-r from-[#2D5284] to-[#3a69a8] text-white text-[11px] font-black px-5 py-2.5 rounded-[14px] shadow-lg shadow-blue-900/10 hover:brightness-110 transition active:scale-95 flex items-center gap-2"
                                    >
                                        Agendar <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Navigation className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-[16px] font-bold text-slate-700">Nenhum médico nesta área</h3>
                        <p className="text-[13px] text-slate-400 mt-2">Tente aumentar o raio de pesquisa para encontrar mais profissionais.</p>
                        <button 
                            onClick={() => setRaioKm(1000)}
                            className="mt-6 text-[12px] font-bold text-[#2D5284] underline underline-offset-4"
                        >
                            Ver todos no Brasil
                        </button>
                    </div>
                )}
                
                <div className="py-4 text-center">
                    <p className="text-[11px] text-slate-400 font-medium">Habilite o GPS para resultados mais precisos.</p>
                </div>
            </main>
            <BottomNav />
            </div>
        </div>
    </div>
)
}
