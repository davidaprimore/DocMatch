'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MapPin, Star } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { medicosMock } from '@/data/mockData'

export default function FavoritosPage() {
    const router = useRouter()
    const favoritos = medicosMock.filter(m => ['med_001', 'med_005'].includes(m.id))

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-5 pb-10 rounded-b-3xl shadow-md z-20 mb-5">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Médicos Favoritos</h1>
                </div>
            </header>
            <main className="px-4 space-y-3">
                {favoritos.map(m => (
                    <div key={m.id} className="bg-white rounded-[20px] p-4 shadow-card border border-slate-100" onClick={() => router.push(`/buscar/${m.id}`)}>
                        <div className="flex gap-4 items-start">
                            <img src={m.foto_url} className="w-[72px] h-[72px] rounded-[20px] object-cover border border-slate-100" alt={m.nome} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-bold text-[15px] text-slate-800">{m.nome}</h3>
                                        <p className="text-[12px] text-[#2D5284] font-medium">{m.especialidade}</p>
                                    </div>
                                    <button><Heart className="w-5 h-5 fill-red-500 text-red-500" /></button>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" /> <b className="text-slate-700">{m.avaliacao}</b></span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.endereco_consultorio.bairro}</span>
                                </div>
                                <button onClick={e => { e.stopPropagation(); router.push('/agendar') }} className="mt-3 bg-[#2D5284] text-white text-[11px] font-bold px-4 py-1.5 rounded-xl">Agendar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <BottomNav />
        </div>
    )
}
