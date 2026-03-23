'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, MapPin, Plus, Edit2, Trash2 } from 'lucide-react'

// Estrutura provisória para representar clínicas/hospitais
interface Unidade {
    id: string
    nome: string
    endereco: string
    cep: string
    cidade: string
    estado: string
    telefone: string
}

export default function UnidadesAtendimentoPage() {
    const router = useRouter()
    
    // Estado inicial simulando a busca do banco
    const [unidades, setUnidades] = useState<Unidade[]>([
        {
            id: '1',
            nome: 'Clínica Vida Bela',
            endereco: 'Av. Paulista, 1000, Sala 45',
            cep: '01310-100',
            cidade: 'São Paulo',
            estado: 'SP',
            telefone: '(11) 99999-9999'
        }
    ])

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            <header className="bg-[#1A365D] px-5 pt-12 pb-6 shadow-md rounded-b-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/10 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
                <h1 className="text-white font-black text-2xl flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#D4AF37]" />
                    Unidades de Atendimento
                </h1>
                <p className="text-white/70 text-[13px] mt-1">Gerencie os locais (clínicas e hospitais) em que você atende.</p>
            </header>

            <main className="px-5 mt-8 space-y-4">
                {unidades.length === 0 ? (
                    <div className="bg-white rounded-[24px] p-8 text-center border border-dashed border-slate-300 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-slate-300" />
                        </div>
                        <h2 className="text-[#1A365D] font-bold text-[16px] mb-2">Nenhuma unidade cadastrada</h2>
                        <p className="text-slate-500 text-[13px] mb-6">Para os pacientes conseguirem encontrar você, cadastre pelo menos um local de atendimento presencial.</p>
                    </div>
                ) : (
                    unidades.map(unidade => (
                        <div key={unidade.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex items-start justify-between">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-[#1A365D] text-[16px] mb-1">{unidade.nome}</h3>
                                <p className="text-slate-500 text-[12px] flex items-start gap-1 mb-1">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>{unidade.endereco}<br/>{unidade.cidade} - {unidade.estado}</span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}

                <button 
                    onClick={() => { /* Abrir modal para nova unidade */ }}
                    className="w-full mt-4 bg-[#D4AF37] text-[#1A365D] font-bold text-[14px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" /> Cadastrar Nova Unidade
                </button>
            </main>
        </div>
    )
}
