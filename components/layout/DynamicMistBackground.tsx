'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function DynamicMistBackground() {
    const pathname = usePathname()

    // Não exibir no DocZap (conversa ativa)
    if (pathname?.includes('/doczap/')) return null

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#E7F0FD]">
            {/* 
                OTIMIZAÇÃO ANDROID (FIX FLICKERING):
                - will-change: transform
                - backface-visibility: hidden
                - translateZ(0) via Framer Motion transformTemplate ou CSS direto
            */}
            
            {/* Camada 1: Névoa Base Suave */}
            <motion.div
                animate={{
                    x: [0, 250, -150, 0],
                    y: [0, -180, 100, 0],
                    scale: [1, 1.4, 0.8, 1],
                    rotate: [0, 45, -45, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[130%] h-[130%] opacity-60"
                style={{
                    background: 'radial-gradient(circle, #CBD5E1 0%, transparent 70%)',
                    filter: 'blur(90px)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            />

            {/* Camada 2: Profundidade Azul DocMatch */}
            <motion.div
                animate={{
                    x: [0, -220, 180, 0],
                    y: [0, 200, -100, 0],
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[110%] h-[110%]"
                style={{
                    background: 'radial-gradient(circle, #2D5284 0%, transparent 75%)',
                    filter: 'blur(100px)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            />

            {/* Camada 3: Brilho Dourado (Aura Premium Pulsante) */}
            <motion.div
                animate={{
                    scale: [1, 1.8, 1],
                    x: [0, 80, -80, 0],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[15%] left-[10%] w-[90%] h-[90%]"
                style={{
                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 60%)',
                    filter: 'blur(110px)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            />
        </div>
    )
}
