'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useUI } from '@/providers/UIProvider'

export function LoadingOverlay() {
    const { isLoadingGlobal } = useUI()
    const [showOverlay, setShowOverlay] = useState(false)
    const [message, setMessage] = useState('Carregando')
    const [dots, setDots] = useState('')

    useEffect(() => {
        let timer05: NodeJS.Timeout
        let timer4: NodeJS.Timeout
        let dotsInterval: NodeJS.Timeout

        if (isLoadingGlobal) {
            // Só mostra após 0.5s
            timer05 = setTimeout(() => {
                setShowOverlay(true)
            }, 500)

            // Muda mensagem após 4s
            timer4 = setTimeout(() => {
                setMessage('Só mais um pouco')
            }, 4000)

            // Animação dos pontinhos
            dotsInterval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.')
            }, 500)
        } else {
            setShowOverlay(false)
            setMessage('Carregando')
            setDots('')
        }

        return () => {
            clearTimeout(timer05)
            clearTimeout(timer4)
            clearInterval(dotsInterval)
        }
    }, [isLoadingGlobal])

    return (
        <AnimatePresence>
            {showOverlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md"
                >
                    <div className="bg-white/90 p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-6 border border-white/50 scale-110">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#D4AF37]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-black text-[#1A365D] uppercase tracking-tighter">DM</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[#1A365D] font-black text-[15px] uppercase tracking-widest min-w-[140px] text-center">
                                {message}{dots}
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                DocMatch PRO
                            </span>
                        </div>
                    </div>

                    {/* Simulação para demonstração (só aparece se estiver demorando muito) */}
                    {message === 'Só mais um pouco' && (
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-white/80 font-medium text-[12px] bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            Verificando sua conexão...
                        </motion.p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
