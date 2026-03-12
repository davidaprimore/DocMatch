'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function DynamicMistBackground() {
    const pathname = usePathname()
    
    // Monitora se deve exibir a névoa baseado na rota
    const shouldShowMist = (
        pathname === '/dashboard' ||
        pathname?.startsWith('/buscar') ||
        pathname === '/cesta' ||
        pathname?.startsWith('/consultas') ||
        pathname === '/mensagens'
    )

    if (!shouldShowMist) return null

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ background: '#E7F0FD' }}>
            {/* Camada 1: Névoa Base Suave - Ultra Dinâmica v1.2 */}
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
                    transform: 'translateZ(0)'
                }}
            />

            {/* Camada 2: Profundidade Azul DocMatch - Movimento Agressivo */}
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
                    transform: 'translateZ(0)'
                }}
            />
        </div>
    )
}
