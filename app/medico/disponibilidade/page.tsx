'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Calendar as CalendarIcon, Save, Plus, Trash2, CalendarX2, MapPin, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { BottomNavMedico } from '@/components/BottomNavMedico'
import { cn } from '@/lib/utils'

type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo'

interface TimeSlot { id: string; start: string; end: string }
interface BlockException { id: string; type: 'dia' | 'horario' | 'periodo'; startDate: string; endDate?: string; startTime?: string; endTime?: string; title: string }
interface ConfiguracaoLocal { duration: string; availability: Record<DayOfWeek, TimeSlot[]>; blocks: BlockException[] }

const MOCK_LOCAIS = [
    { id: '1', nome: 'Clínica Central' },
    { id: '2', nome: 'Consultório Flamboyant' }
]

const DEFAULT_AVAILABILITY: Record<DayOfWeek, TimeSlot[]> = { Segunda: [], Terça: [], Quarta: [], Quinta: [], Sexta: [], Sábado: [], Domingo: [] }

export default function DisponibilidadeMedicoPage() {
    const router = useRouter()
    
    const [selectedLocalId, setSelectedLocalId] = useState<string>(MOCK_LOCAIS[0].id)
    const [isLocalDropdownOpen, setIsLocalDropdownOpen] = useState(false)

    const [configPorLocal, setConfigPorLocal] = useState<Record<string, ConfiguracaoLocal>>({
        '1': { duration: '30', availability: JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY)), blocks: [] },
        '2': { duration: '45', availability: JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY)), blocks: [] }
    })

    const days: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    const localConfig = configPorLocal[selectedLocalId] || { duration: '30', availability: DEFAULT_AVAILABILITY, blocks: [] }

    const updateLocalConfig = (updates: Partial<ConfiguracaoLocal>) => setConfigPorLocal(prev => ({ ...prev, [selectedLocalId]: { ...prev[selectedLocalId], ...updates } }))
    const setDuration = (duration: string) => updateLocalConfig({ duration })

    const addTimeSlot = (day: DayOfWeek) => updateLocalConfig({ availability: { ...localConfig.availability, [day]: [...localConfig.availability[day], { id: Date.now().toString(), start: '08:00', end: '12:00' }] } })
    const updateTimeSlot = (day: DayOfWeek, id: string, field: 'start' | 'end', value: string) => updateLocalConfig({ availability: { ...localConfig.availability, [day]: localConfig.availability[day].map(s => s.id === id ? { ...s, [field]: value } : s) } })
    const removeTimeSlot = (day: DayOfWeek, id: string) => updateLocalConfig({ availability: { ...localConfig.availability, [day]: localConfig.availability[day].filter(s => s.id !== id) } })

    const addBlock = () => updateLocalConfig({ blocks: [{ id: Date.now().toString(), type: 'dia', startDate: new Date().toISOString().split('T')[0], title: '' }, ...localConfig.blocks] })
    const updateBlock = (id: string, updates: Partial<BlockException>) => updateLocalConfig({ blocks: localConfig.blocks.map(b => b.id === id ? { ...b, ...updates } : b) })
    const removeBlock = (id: string) => updateLocalConfig({ blocks: localConfig.blocks.filter(b => b.id !== id) })

    const checkConflitosGlobais = () => {
        const getHorasMinutos = (time: string) => { 
            if (!time) return 0;
            const [h, m] = time.split(':').map(Number); 
            return h * 60 + (m || 0);
        }
        for (const dia of days) {
            const allSlotsInDay: { localName: string; start: number; end: number; timeStr: string }[] = []
            for (const [localId, config] of Object.entries(configPorLocal)) {
                const localName = MOCK_LOCAIS.find(l => l.id === localId)?.nome || 'Local'
                for (const slot of config.availability[dia]) {
                    if (slot.start && slot.end) {
                        allSlotsInDay.push({ localName, start: getHorasMinutos(slot.start), end: getHorasMinutos(slot.end), timeStr: `${slot.start} às ${slot.end}` })
                    }
                }
            }
            const validSlots = allSlotsInDay.filter(s => s.start < s.end);
            validSlots.sort((a, b) => a.start - b.start)
            for (let i = 0; i < validSlots.length - 1; i++) {
                if (validSlots[i].end > validSlots[i + 1].start) {
                    if (validSlots[i].localName !== validSlots[i + 1].localName) {
                        return `⚠️ Conflito Detectado: Você tem expediente na "${validSlots[i].localName}" na ${dia} (${validSlots[i].timeStr}). Ajuste a sobreposição para salvar.`
                    } else {
                        return `⚠️ Sobreposição: Na ${dia}, os horários se cruzam dentro do(a) "${validSlots[i].localName}".`
                    }
                }
            }
        }
        return null
    }

    const currentConflictErr = checkConflitosGlobais();

    const handleSave = () => {
        if (currentConflictErr) return toast.error(currentConflictErr, { duration: 6000 })
        toast.success('Disponibilidade salva!')
        setTimeout(() => router.back(), 1000)
    }

    return (
        <div className="min-h-screen bg-[#1A365D] pb-32 font-sans relative overflow-x-hidden selection:bg-[#D4AF37]/30">
            {/* Fog Animations - Reduzidos p/ elegância */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white rounded-full blur-[140px]" />
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] -right-32 w-[500px] h-[500px] bg-white rounded-full blur-[140px]" />
            </div>

            <header className="bg-white/5 backdrop-blur-3xl px-5 pt-12 pb-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-b-[40px] border-b border-white/10 sticky top-0 z-40 relative">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <button onClick={() => router.back()} className="text-white p-2 -ml-2 rounded-full hover:bg-white/20 transition active:scale-90">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!!currentConflictErr}
                        className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all border", 
                            currentConflictErr 
                                ? "bg-slate-500/20 text-white/30 border-white/10 cursor-not-allowed" 
                                : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] shadow-[0_8px_20px_rgba(212,175,55,0.4)] hover:opacity-90 border-white/30 active:scale-95"
                        )}>
                        <Save className="w-4 h-4" /> Salvar
                    </button>
                </div>
                <h1 className="text-white font-black text-2xl flex items-center gap-2 tracking-tight relative z-10">
                    <CalendarIcon className="w-7 h-7 text-[#D4AF37]" />
                    Gestão de Agenda
                </h1>
                <p className="text-white/70 font-medium text-[13px] mt-1 relative z-10 leading-relaxed max-w-[280px]">
                    Configure dias e horários únicos para cada consultório logado nesse sistema.
                </p>
                
                <div className="mt-6 relative z-30">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-[11px] uppercase tracking-[0.15em] font-black text-white/50">Atendendo em</span>
                    </div>
                    
                    {/* CUSTOM DROPDOWN (Replaces Select Feio) */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsLocalDropdownOpen(!isLocalDropdownOpen)}
                            className="w-full flex justify-between items-center bg-slate-100/95 backdrop-blur-3xl border border-slate-300 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-[#1A365D] font-black text-[16px] px-5 py-4 rounded-2xl outline-none hover:bg-white transition-all active:scale-95"
                        >
                            <span>{MOCK_LOCAIS.find(l => l.id === selectedLocalId)?.nome || 'Selecione um local'}</span>
                            <ChevronDown className={`w-5 h-5 text-[#1A365D]/50 transition-transform ${isLocalDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isLocalDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }} 
                                    className="absolute top-[105%] left-0 w-full bg-slate-100/95 backdrop-blur-3xl border border-slate-300 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                >
                                    {MOCK_LOCAIS.map(l => (
                                        <button 
                                            key={l.id} 
                                            onClick={() => { setSelectedLocalId(l.id); setIsLocalDropdownOpen(false) }} 
                                            className={`w-full text-left px-5 py-4 transition-colors border-b last:border-0 border-slate-200 flex items-center justify-between
                                                ${selectedLocalId === l.id ? 'bg-[#1A365D]' : 'hover:bg-[#1A365D] hover:text-[#D4AF37]'}`
                                            }
                                        >
                                            <span className={`text-[15px] ${selectedLocalId === l.id ? 'text-[#D4AF37] font-black' : 'text-[#1A365D] font-bold'}`}>
                                                {l.nome}
                                            </span>
                                            {selectedLocalId === l.id && <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {currentConflictErr && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-[0_4px_20px_rgba(239,68,68,0.15)] relative z-30">
                            <CalendarX2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-300 text-[13px] font-medium leading-relaxed">{currentConflictErr}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="px-5 mt-6 space-y-6 relative z-10">
                {/* SEÇÃO 2: DURAÇÃO DE CONSULTA */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] space-y-4">
                    <div className="flex items-center gap-3 w-full border-b border-white/10 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-[16px]">Duração da Consulta</h3>
                            <p className="text-white/50 text-[11px] font-medium leading-tight">Tempo médio que você leva para atender 1 paciente</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 relative z-0 mt-2">
                        {['15', '30', '45', '60'].map(dur => (
                            <button 
                                key={dur} 
                                onClick={() => setDuration(dur)}
                                className={`py-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center
                                    ${localConfig.duration === dur 
                                        ? 'bg-[#1A365D] border-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.4)]' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-95'
                                    }`}
                            >
                                <span className={`text-[15px] font-black leading-none ${localConfig.duration === dur ? 'text-[#D4AF37]' : 'text-white'}`}>{dur}</span>
                                <span className={`text-[9px] uppercase font-bold tracking-widest mt-1 ${localConfig.duration === dur ? 'text-[#D4AF37]/70' : 'text-white/40'}`}>Min</span>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* UX Simplificada: Bloqueios */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 p-2.5 rounded-2xl shadow-sm border border-white/10">
                                <CalendarX2 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h2 className="font-black text-white text-[16px] tracking-tight">Regras de Bloqueio</h2>
                                <p className="text-white/50 font-medium text-[11px] leading-tight max-w-[150px]">Férias, Feriados ou impedimentos</p>
                            </div>
                        </div>
                        <button onClick={addBlock} className="px-5 h-10 bg-white/10 border border-white/30 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all shadow-sm active:scale-90">
                            Novo
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {localConfig.blocks.length === 0 && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-[12px] font-medium text-center py-5 bg-white/5 rounded-2xl border border-white/10 border-dashed">Toda agenda liberada por padrão.</motion.p>
                            )}
                            {localConfig.blocks.map(block => (
                                <motion.div key={block.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/3" />
                                    
                                    <div className="flex bg-white/5 rounded-lg border border-white/10 p-1 shadow-inner relative z-10">
                                        <button onClick={() => updateBlock(block.id, { type: 'dia' })} className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition", block.type === 'dia' ? "bg-white/20 text-white shadow" : "text-white/50 hover:text-white")}>Dia</button>
                                        <button onClick={() => updateBlock(block.id, { type: 'horario' })} className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition", block.type === 'horario' ? "bg-white/20 text-white shadow" : "text-white/50 hover:text-white")}>Horas</button>
                                        <button onClick={() => updateBlock(block.id, { type: 'periodo' })} className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition", block.type === 'periodo' ? "bg-white/20 text-white shadow" : "text-white/50 hover:text-white")}>Período</button>
                                    </div>

                                    <div className="flex gap-2 relative z-10">
                                        <input placeholder="Título (ex. Feriado)" value={block.title} onChange={e => updateBlock(block.id, { title: e.target.value })} className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-bold text-[13px] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#D4AF37]/50" />
                                        <button onClick={() => removeBlock(block.id)} className="w-9 h-9 flex items-center justify-center bg-red-400/20 text-red-400 rounded-lg shrink-0 hover:bg-red-400/30 transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[9px] uppercase font-bold text-white/50 ml-1">{block.type === 'periodo' ? 'Início' : 'Data Única'}</span>
                                            <input type="date" value={block.startDate} onChange={e => updateBlock(block.id, { startDate: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white text-[13px] font-medium rounded-lg px-2 py-2.5 outline-none [color-scheme:dark]" />
                                        </div>
                                        {block.type === 'periodo' && (
                                            <div className="space-y-1">
                                                <span className="text-[9px] uppercase font-bold text-white/50 ml-1">Fim do Recesso</span>
                                                <input type="date" value={block.endDate || ''} onChange={e => updateBlock(block.id, { endDate: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white text-[13px] font-medium rounded-lg px-2 py-2.5 outline-none [color-scheme:dark]" />
                                            </div>
                                        )}
                                        {block.type === 'horario' && (
                                            <>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] uppercase font-bold text-white/50 ml-1">De (Hora)</span>
                                                    <input type="time" value={block.startTime || ''} onChange={e => updateBlock(block.id, { startTime: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white text-[13px] font-black rounded-lg px-2 py-2.5 outline-none [color-scheme:dark]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] uppercase font-bold text-white/50 ml-1">Ate (Hora)</span>
                                                    <input type="time" value={block.endTime || ''} onChange={e => updateBlock(block.id, { endTime: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white text-[13px] font-black rounded-lg px-2 py-2.5 outline-none [color-scheme:dark]" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Grade Semanal */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    <h2 className="font-black text-white text-[16px] px-2 tracking-tight">Grade de Atendimento Base</h2>
                    
                    {days.map(day => (
                        <div key={`${selectedLocalId}-${day}`} className="bg-white/10 backdrop-blur-3xl rounded-[28px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 hover:border-white/30 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-black text-white text-[15px]">{day}</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={localConfig.availability[day].length > 0} onChange={(e) => {
                                        if (e.target.checked) addTimeSlot(day)
                                        else updateLocalConfig({ availability: { ...localConfig.availability, [day]: [] } })
                                    }} />
                                    <div className="w-12 h-6.5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-[#1A365D]/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37] shadow-inner"></div>
                                </label>
                            </div>

                            <AnimatePresence>
                                {localConfig.availability[day].length > 0 && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-3 pt-3 border-t border-white/20">
                                        {localConfig.availability[day].map((slot) => (
                                            <div key={slot.id} className="flex items-center gap-2">
                                                <input type="time" value={slot.start} onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)} className="flex-1 bg-white/10 border border-white/20 shadow-sm text-white text-[14px] font-black rounded-xl px-2 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 text-center [color-scheme:dark]" />
                                                <span className="text-white/40 font-black text-[10px] uppercase">até</span>
                                                <input type="time" value={slot.end} onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)} className="flex-1 bg-white/10 border border-white/20 shadow-sm text-white text-[14px] font-black rounded-xl px-2 py-3 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 text-center [color-scheme:dark]" />
                                                <button onClick={() => removeTimeSlot(day, slot.id)} className="p-3 text-white/40 hover:text-red-400 bg-white/10 hover:bg-red-400/20 rounded-xl transition-colors border border-transparent shadow-sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => addTimeSlot(day)} className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[11px] font-black text-[#D4AF37] hover:bg-[#D4AF37]/20 flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest mt-2 shadow-sm">
                                            <Plus className="w-3 h-3 stroke-[3px]" /> Adicionar Faixa
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.section>
            </main>

            <BottomNavMedico />
        </div>
    )
}
