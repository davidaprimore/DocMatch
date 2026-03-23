'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MapPin, Users, Star, MessageSquare, CalendarClock, ChevronRight, Calendar as CalendarIcon, Clock, Download, X, TrendingUp } from 'lucide-react'
import { BottomNavMedico } from '@/components/BottomNavMedico'
import { useState, useEffect } from 'react'

export default function MedicoDashboardPage() {
    const router = useRouter()
    const userName = "Joanna"
    const [isSplashing, setIsSplashing] = useState(true)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showInstallBanner, setShowInstallBanner] = useState(false)

    useEffect(() => {
        // Splash logic
        const hasSplashed = sessionStorage.getItem('docmatch_splashed')
        if (hasSplashed) {
            setIsSplashing(false)
        } else {
            const timer = setTimeout(() => {
                setIsSplashing(false)
                sessionStorage.setItem('docmatch_splashed', 'true')
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        // PWA Install Prompt logic
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowInstallBanner(true)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setDeferredPrompt(null)
            setShowInstallBanner(false)
        }
    }

    const MOCK_JORNADA_HOJE = [
        { id: '1', nome: 'Clínica Central', horario: '08:00 - 12:00' },
        { id: '2', nome: 'Consultório Flamboyant', horario: '14:00 - 18:00' }
    ]

    const StatMicroCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
        <div className="bg-white p-5 rounded-[24px] flex items-center gap-4 shadow-[0_8px_30px_rgba(45,82,132,0.05)] border border-white hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center">
                <p className="font-bold text-[#2D5284] text-[20px] leading-tight mb-0.5">{value}</p>
                <p className="text-[#2D5284]/60 text-[11px] font-medium leading-none">{label}</p>
            </div>
        </div>
    )

    return (
        <>
            <AnimatePresence>
                {isSplashing && (
                    <motion.div 
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#1A365D] to-[#2D5284] flex flex-col items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-32 h-32 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 relative border-4 border-white/10">
                                <Image src="/icon-512.png" alt="DocMatch Loading" fill className="object-cover" />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Doc<span className="text-[#D4AF37]">Match</span></h1>
                            <p className="text-[#D4AF37]/80 text-[11px] mt-3 font-black tracking-widest uppercase">Carregando Painel</p>

                            <div className="w-48 h-1 bg-white/10 rounded-full mt-10 overflow-hidden">
                                <motion.div 
                                    initial={{ width: "0%" }} 
                                    animate={{ width: "100%" }} 
                                    transition={{ duration: 2, ease: "easeInOut" }} 
                                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF1B8]" 
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`min-h-screen bg-[#F8F6F0] pb-32 font-sans relative overflow-x-hidden selection:bg-[#2D5284]/30 ${isSplashing ? 'pointer-events-none' : ''}`}>
                {/* Background Decor */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
                    <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-[#2D5284]/5 rounded-full blur-[120px]" />
                </div>

            {/* Trial Banner */}
            <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] py-2 px-4 flex items-center justify-between shadow-[0_4px_15px_rgba(212,175,55,0.2)] relative z-50">
                <div className="flex items-center gap-2">
                    <CalendarClock className="w-3.5 h-3.5 text-[#2D5284]" />
                    <span className="text-[#2D5284] font-black text-[10px] sm:text-[10px] uppercase tracking-widest mt-0.5">Plano Basic - Degustação: 24 dias restantes</span>
                </div>
                <button className="bg-[#2D5284] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full hover:bg-white hover:text-[#2D5284] transition-colors shadow-sm">Upgrade</button>
            </motion.div>

            {/* Header Profiling & Location Core */}
            <header className="px-5 pt-5 pb-6 relative z-40 bg-[#2D5284] shadow-[0_12px_30px_rgba(45,82,132,0.2)] rounded-b-[36px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[18px] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-lg font-black text-white shadow-inner">
                            {userName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-white font-black text-[22px] tracking-tight leading-tight">Olá, {userName}</h1>
                            <p className="text-white/50 font-medium text-[12px] mt-0.5 max-w-[200px] leading-snug">Centro Operacional</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-[14px] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white relative hover:bg-white/10 transition-all shadow-sm active:scale-90 shrink-0">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full border-2 border-[#1A365D]" />
                    </button>
                </div>

                {/* Resumo Espacial do Dia (Jornada) */}
                <div className="mt-3 border-t border-white/10 pt-4 px-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Jornada do Dia
                    </span>
                    {/* <p className="text-white text-[13px] font-bold leading-snug mb-3">
                        Hoje você atende em:
                    </p> */}

                    <div className="flex flex-wrap gap-2">
                        {MOCK_JORNADA_HOJE.map((local: any, index: number) => {
                            const total = MOCK_JORNADA_HOJE.length;
                            let cardClass = "w-full";
                            if (total === 2 || total === 4) cardClass = "w-[calc(50%-0.25rem)]";
                            else if (total === 3) cardClass = "w-[calc(33.333%-0.35rem)]";
                            else if (total === 5) {
                                cardClass = index < 2 ? "w-[calc(50%-0.25rem)]" : "w-[calc(33.333%-0.35rem)]";
                            } else if (total > 5) {
                                cardClass = "w-[calc(33.333%-0.35rem)]";
                            }

                            return (
                                <button key={local.id} onClick={() => router.push('/medico/agenda')} className={`bg-white/10 border border-white/20 py-2.5 px-2 rounded-xl flex flex-col items-center justify-center hover:bg-white/20 transition-all active:scale-95 text-center relative overflow-hidden group ${cardClass}`}>
                                    <span className="text-white font-bold text-[13px] leading-tight line-clamp-1 w-full relative z-10">{local.nome}</span>
                                    <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest leading-none mt-1.5 relative z-10">{local.horario}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </header>

            <main className="px-5 mt-4 space-y-4 relative z-10">
                {/* 0. Banner de Instalação PWA */}
                {showInstallBanner && (
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-4 rounded-[24px] shadow-[0_10px_25px_rgba(45,82,132,0.1)] border border-[#D4AF37]/20 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#2D5284] flex items-center justify-center shadow-lg shrink-0">
                                <Download className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h3 className="text-[#2D5284] font-bold text-[14px]">Instalar DocMatch</h3>
                                <p className="text-[#8BA0B8] text-[11px] leading-tight mt-0.5">Acesse como um app nativo na sua tela inicial.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleInstallClick}
                                className="bg-[#D4AF37] text-[#2D5284] px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                            >
                                Instalar
                            </button>
                            <button 
                                onClick={() => setShowInstallBanner(false)}
                                className="p-2 text-[#8BA0B8] hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.section>
                )}

                {/* 1. Destaque: PRÓXIMO PACIENTE (OFFICIAL BLUE) */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative group cursor-pointer" onClick={() => router.push('/medico/agenda')}>
                    <div className="bg-[#2D5284] p-5 rounded-[24px] shadow-[0_15px_30px_rgba(45,82,132,0.2)] overflow-hidden relative z-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center gap-2 text-[#D4AF37] mb-3">
                            <Clock className="w-4 h-4" />
                            <span className="text-[12px] uppercase font-bold tracking-widest mt-0.5">Próximo Paciente • 10:30</span>
                        </div>
                        
                        <div className="mb-4 relative z-10">
                            <h2 className="text-white font-black text-2xl tracking-tight mb-2">Carlos Silva</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Primeira Consulta</span>
                                <span className="text-white/80 text-[12px] font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-white/50" /> Clínica Central</span>
                            </div>
                        </div>

                        <button className="w-full bg-[#D4AF37] text-[#2D5284] py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-widest shadow-[0_8px_20px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10">
                            Preparar Prontuário <ChevronRight className="w-4 h-4 mt-0.5 text-[#2D5284]/80" />
                        </button>
                    </div>
                </motion.section>

                {/* 1.5. Métrica de Sucesso Comercial / Ocupação */}
                <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
                    <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgba(45,82,132,0.06)] border border-slate-50 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-[100px] pointer-events-none" />
                        
                        <div className="flex justify-between items-end mb-4 relative z-10">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <TrendingUp className="w-4 h-4 text-[#D4AF37]" strokeWidth={2.5} />
                                    <h3 className="text-[#2D5284] text-[11px] font-black uppercase tracking-widest">Sucesso da Agenda</h3>
                                </div>
                                <p className="text-[#8BA0B8] font-medium text-[12px] leading-snug max-w-[200px]">Pacientes agendados hoje pelo <strong className="text-[#2D5284]">DocMatch</strong>.</p>
                            </div>
                            <div className="text-right flex items-end">
                                <span className="text-[#2D5284] font-black text-4xl leading-none">8</span>
                                <span className="text-[#8BA0B8] font-bold text-sm mb-1 ml-0.5">/10</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-[#F4F7FA] rounded-full overflow-hidden relative z-10">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: "80%" }} 
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between items-center mt-3 relative z-10">
                            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">Em Alta 🔥</span>
                            <span className="text-[#2D5284] text-[11px] font-black">80% Ocupada</span>
                        </div>
                    </div>
                </motion.section>

                {/* 2. TIMELINE DO DIA (Agenda Consolidada) */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/10 p-6 rounded-[32px] shadow-[0_8px_30px_rgba(32,45,64,0.04)] border border-[#D4AF37] relative z-10 w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[#2D5284]/50 flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-[#2D5284]" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-[#2D5284] font-bold text-[18px] leading-tight mb-1">Agenda do Dia</h2>
                                <p className="text-[#8BA0B8] text-[10px] font-bold uppercase tracking-widest leading-none">Visão Unificada</p>
                            </div>
                        </div>
                        <button onClick={() => router.push('/medico/agenda')} className="text-[#2D5284] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-[#2D5284] transition-colors">
                            Ver tudo <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Status: Concluído / Passado */}
                        <div className="flex items-stretch bg-[#F4F7FA] p-3.5 rounded-[20px] border-l border-t border-b border-r border-[#2D5284]/20">
                            <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-[#2D5284]/20 pr-4">
                                <span className="text-[#8BA0B8] font-bold text-[16px]">09:00</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center pl-4">
                                <span className="text-[#647C9A] font-bold text-[15px] leading-tight mb-1.5">Maria Souza</span>
                                <span className="text-[#8BA0B8] text-[12px] font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Clínica Central</span>
                            </div>
                        </div>

                        {/* Status: Agora */}
                        <div className="flex items-stretch bg-white p-3.5 rounded-[20px] shadow-[0_8px_25px_rgba(45,82,132,0.08)] relative overflow-hidden border-l border-t border-b border-r border-[#D4AF37]/70">
                            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#D4AF37] rounded-l-[20px]" />
                            <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-[#D4AF37] pr-4 pl-1">
                                <span className="text-[#2D5284] font-bold text-[16px]">10:30</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center pl-4">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className="text-[#2D5284] font-bold text-[15px] leading-tight">Carlos Silva</span>
                                    <span className="text-[#D4AF37] border border-[#D4AF37]/70 bg-[#D4AF37]/10 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">Agora</span>
                                </div>
                                <span className="text-[#8BA0B8] text-[12px] font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Clínica Central</span>
                            </div>
                        </div>

                        {/* Status: Futuro e outro local */}
                        <div className="flex items-stretch bg-[#F4F7FA] p-3.5 rounded-[20px] border-l border-t border-b border-r border-[#2D5284]/50">
                            <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-[#2D5284]/50 pr-4">
                                <span className="text-[#2D5284] font-bold text-[16px]">14:00</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center pl-4">
                                <span className="text-[#2D5284] font-bold text-[15px] leading-tight mb-1.5">Fernanda Lima</span>
                                <span className="text-[#8BA0B8] text-[12px] font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Consultório Flamboyant</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 3. ESTATÍSTICAS REBAIXADAS (Menor Proeminência) */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3 pb-8 mt-1">
                    <StatMicroCard icon={Users} value="124" label="Pacientes Ativos" />
                    <StatMicroCard icon={Star} value="4.9" label="Avaliação Média" />
                    <StatMicroCard icon={MessageSquare} value="2" label="Mensagens" />
                    <StatMicroCard icon={CalendarClock} value="8" label="Pacientes Hoje" />
                </motion.section>

            </main>

            <BottomNavMedico />
            </div>
        </>
    )
}
