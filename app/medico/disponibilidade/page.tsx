'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Calendar as CalendarIcon, Save, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo'

interface TimeSlot {
    start: string
    end: string
}

export default function DisponibilidadeMedicoPage() {
    const router = useRouter()
    const [duration, setDuration] = useState('30') // duração padrão da consulta
    const [availability, setAvailability] = useState<Record<DayOfWeek, TimeSlot[]>>({
        Segunda: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        Terça: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        Quarta: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        Quinta: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        Sexta: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        Sábado: [],
        Domingo: []
    })

    const days: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

    const handleSave = () => {
        // Futura integração Supabase para salvar as configurações na tabela de perfil do médico ou `disponibilidade`
        toast.success('Disponibilidade salva com sucesso!')
        setTimeout(() => router.back(), 1000)
    }

    const addTimeSlot = (day: DayOfWeek) => {
        setAvailability(prev => ({
            ...prev,
            [day]: [...prev[day], { start: '00:00', end: '00:00' }]
        }))
    }

    const updateTimeSlot = (day: DayOfWeek, index: number, field: keyof TimeSlot, value: string) => {
        const newDaySlots = [...availability[day]]
        newDaySlots[index] = { ...newDaySlots[index], [field]: value }
        setAvailability(prev => ({ ...prev, [day]: newDaySlots }))
    }

    const removeTimeSlot = (day: DayOfWeek, index: number) => {
        const newDaySlots = availability[day].filter((_, i) => i !== index)
        setAvailability(prev => ({ ...prev, [day]: newDaySlots }))
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            <header className="bg-[#1A365D] px-5 pt-12 pb-6 shadow-md rounded-b-3xl">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/10 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleSave} className="bg-[#D4AF37] text-[#1A365D] flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm active:scale-95 transition-transform">
                        <Save className="w-4 h-4" /> Salvar
                    </button>
                </div>
                <h1 className="text-white font-black text-2xl flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
                    Sua Disponibilidade
                </h1>
                <p className="text-white/70 text-[13px] mt-1">Configure os dias e horários para agendamento online.</p>
            </header>

            <main className="px-5 mt-6 space-y-6">
                {/* Duração da Consulta */}
                <section className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="bg-[#1A365D]/10 p-2 rounded-xl">
                            <Clock className="w-5 h-5 text-[#1A365D]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#1A365D] text-[15px]">Duração da Consulta</h2>
                            <p className="text-slate-500 text-[11px]">Tempo médio por paciente</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['15', '30', '45', '60'].map(dur => (
                            <button
                                key={dur}
                                onClick={() => setDuration(dur)}
                                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${duration === dur ? 'bg-[#1A365D] text-white shadow-md' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                            >
                                {dur} min
                            </button>
                        ))}
                    </div>
                </section>

                {/* Dias da Semana */}
                <section className="space-y-4">
                    <h2 className="font-bold text-[#1A365D] text-[15px] px-1">Horários por Dia</h2>
                    
                    {days.map(day => (
                        <div key={day} className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-slate-700">{day}</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={availability[day].length > 0} onChange={(e) => {
                                        if (e.target.checked) addTimeSlot(day)
                                        else setAvailability(prev => ({ ...prev, [day]: [] }))
                                    }} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                </label>
                            </div>

                            {availability[day].length > 0 && (
                                <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                                    {availability[day].map((slot, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={slot.start}
                                                onChange={(e) => updateTimeSlot(day, idx, 'start', e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20"
                                            />
                                            <span className="text-slate-400 font-bold">até</span>
                                            <input
                                                type="time"
                                                value={slot.end}
                                                onChange={(e) => updateTimeSlot(day, idx, 'end', e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20"
                                            />
                                            <button onClick={() => removeTimeSlot(day, idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addTimeSlot(day)} className="w-full py-2.5 mt-2 rounded-xl text-[12px] font-bold text-[#2D5284] bg-[#2D5284]/10 hover:bg-[#2D5284]/20 flex items-center justify-center gap-1.5 transition-colors">
                                        <Plus className="w-4 h-4" /> Adicionar Horário
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}
