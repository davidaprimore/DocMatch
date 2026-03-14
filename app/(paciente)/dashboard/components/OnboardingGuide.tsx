'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, ArrowRight, X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

interface OnboardingStep {
    title: string
    mission: string
    description: string
    targetId?: string
    position: 'center' | 'bottom' | 'top' | 'left' | 'right'
}

const steps: OnboardingStep[] = [
    {
        title: 'Boas-vindas ao DocMatch! 🚀',
        mission: 'MISSÃO 1: O INÍCIO DA JORNADA',
        description: 'Olá! Sou sua assistente virtual. Vamos fazer um tour rápido para você se tornar um mestre em economizar e cuidar da sua saúde?',
        position: 'center'
    },
    {
        title: 'Sua Central de Comando 📊',
        mission: 'MISSÃO 2: CONHECENDO A BASE',
        description: 'Aqui no Dashboard você tem um resumo de todas as suas atividades: próximas consultas e as últimas receitas emitidas para você.',
        targetId: 'dashboard-summary',
        position: 'bottom'
    },
    {
        title: 'Cofre de Receitas Digitais 🔐',
        mission: 'MISSÃO 3: SEGURANÇA TOTAL',
        description: 'No menu "Minhas Receitas", você acessa todas as suas prescrições. Esqueça papel! Mostre o QR Code na farmácia e pronto.',
        targetId: 'menu-receitas',
        position: 'top'
    },
    {
        title: 'Radar de Economia 💰',
        mission: 'MISSÃO 4: PREÇO BAIXO SEMPRE',
        description: 'Use o "Comparador de Preços" para encontrar a farmácia mais barata perto de você. Sua economia começa aqui!',
        targetId: 'menu-precos',
        position: 'top'
    },
    {
        title: 'Check-up em um Clique 🩺',
        mission: 'MISSÃO 5: ACESSO RÁPIDO',
        description: 'Precisa de um médico? Em "Agendar Consulta" você encontra os melhores especialistas e marca seu horário em segundos.',
        targetId: 'menu-agendar',
        position: 'top'
    },
    {
        title: 'Você é um Paciente Pro! 🏆',
        mission: 'JORNADA CONCLUÍDA',
        description: 'Parabéns! Você concluiu seu treinamento básico. Agora você está pronto para aproveitar o melhor da telemedicina e economia.',
        position: 'center'
    }
]

export function OnboardingGuide() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Verifica se é o primeiro acesso (localStorage para simplicidade imediata, pode ser DB depois)
        const hasSeenGuide = localStorage.getItem('docmatch_onboarding_seen')
        if (!hasSeenGuide) {
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleFinish = () => {
        localStorage.setItem('docmatch_onboarding_seen', 'true')
        setIsVisible(false)
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleFinish()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    if (!isVisible) return null

    const step = steps[currentStep]

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                {/* Backdrop com Blur Progressivo */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={handleFinish}
                />

                {/* Card do Guia */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm bg-gradient-to-b from-[#1A365D] to-[#0A1A2F] rounded-[40px] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                    {/* Header Estilo Game */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 pt-10 text-center space-y-6">
                        {/* Personagem / Ícone */}
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full animate-ping" />
                            <div className="relative w-full h-full rounded-full border-2 border-[#D4AF37] p-1 bg-white/5 overflow-hidden">
                                {currentStep === steps.length - 1 ? (
                                    <div className="w-full h-full flex items-center justify-center bg-[#D4AF37]">
                                        <Trophy className="w-10 h-10 text-[#1A365D]" />
                                    </div>
                                ) : (
                                    <img 
                                        src="/assets/medica-inspiracao.png" 
                                        className="w-full h-full object-cover"
                                        alt="Guia"
                                    />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#1A365D] p-1.5 rounded-lg shadow-lg">
                                <Sparkles className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Conteúdo da Missão */}
                        <div className="space-y-3">
                            <motion.span 
                                key={`mission-${currentStep}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase block"
                            >
                                {step.mission}
                            </motion.span>
                            
                            <motion.h3 
                                key={`title-${currentStep}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-black text-white"
                            >
                                {step.title}
                            </motion.h3>

                            <motion.p 
                                key={`desc-${currentStep}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white/60 text-sm leading-relaxed"
                            >
                                {step.description}
                            </motion.p>
                        </div>

                        {/* Navegação */}
                        <div className="pt-4 flex flex-col gap-3">
                            <button 
                                onClick={nextStep}
                                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition group uppercase tracking-widest text-[11px]"
                            >
                                {currentStep === steps.length - 1 ? 'Começar Jornada!' : 'Próxima Missão'}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex justify-between items-center px-2">
                                <button 
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 disabled:opacity-0"
                                >
                                    <ChevronLeft className="w-3 h-3" /> Anterior
                                </button>
                                
                                <button 
                                    onClick={handleFinish}
                                    className="text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Pular Tutorial
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Badge de Recompensa Final (Mini) */}
                    {currentStep === steps.length - 1 && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-[#D4AF37] shadow-xl"
                        >
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
