'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '@/providers/UIProvider'

export function LoadingOverlay() {
    const { isLoadingGlobal } = useUI()
    const [showOverlay, setShowOverlay] = useState(false)
    const [message, setMessage] = useState('Carregando')

    useEffect(() => {
        let timer05: NodeJS.Timeout
        let timer4: NodeJS.Timeout

        if (isLoadingGlobal) {
            timer05 = setTimeout(() => setShowOverlay(true), 500)
            timer4 = setTimeout(() => setMessage('Só mais um pouco'), 4000)
        } else {
            setShowOverlay(false)
            setMessage('Carregando')
        }

        return () => {
            clearTimeout(timer05)
            clearTimeout(timer4)
        }
    }, [isLoadingGlobal])

    return (
        <AnimatePresence>
            {showOverlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#1A365D]/40 backdrop-blur-xl"
                >
                    <div className="relative flex flex-col items-center gap-12 scale-110">
                        {/* Imagem do Coração 3D com Pulsação */}
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.15, 1],
                                    filter: ["drop-shadow(0 0 10px rgba(212,175,55,0.3))", "drop-shadow(0 0 30px rgba(212,175,55,0.6))", "drop-shadow(0 0 10px rgba(212,175,55,0.3))"]
                                }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img 
                                    src="/medical_loading_pulse.png" 
                                    className="w-32 h-32 object-contain" 
                                    alt="Carregando..." 
                                    onError={(e) => {
                                        // Fallback se a imagem demorar a processar
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </motion.div>

                            {/* Círculos de pulso em volta */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "easeOut" }}
                                    className="absolute border-2 border-[#D4AF37]/30 rounded-full w-24 h-24"
                                />
                            ))}
                        </div>

                        {/* Linha de ECG Animada (SVG) */}
                        <div className="absolute top-[60%] w-64 h-20 opacity-40">
                            <svg viewBox="0 0 100 20" className="w-full h-full">
                                <motion.path
                                    d="M 0 10 L 10 10 L 15 2 L 20 18 L 25 10 L 40 10 L 45 2 L 50 18 L 55 10 L 75 10 L 80 2 L 85 18 L 90 10 L 100 10"
                                    fill="none"
                                    stroke="#D4AF37"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                            </svg>
                        </div>
                        
                        {/* Texto Premium */}
                        <div className="flex flex-col items-center gap-2">
                            <motion.span 
                                key={message}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white font-black text-[18px] uppercase tracking-[0.4em] text-center"
                            >
                                {message}
                            </motion.span>
                            <div className="h-1 w-12 bg-[#D4AF37] rounded-full animate-pulse" />
                            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                                DocMatch Digital Health
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
