'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '@/providers/UIProvider'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { cn } from '@/lib/utils'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isMenuOpen, setIsMenuOpen } = useUI()

    return (
        <>
            <LoadingOverlay />
            
            {/* Wrapper Principal que anima a tela para trás quando o menu abre */}
            <motion.div
                drag={isMenuOpen ? "x" : false}
                dragConstraints={{ left: 0, right: 300 }}
                dragElastic={0.05}
                onDragEnd={(_, info) => {
                    if (info.offset.x > 100 || info.velocity.x > 500) {
                        setIsMenuOpen(false)
                    }
                }}
                animate={{
                    scale: isMenuOpen ? 0.85 : 1,
                    x: isMenuOpen ? '-75%' : '0%', // Desliza para a esquerda para mostrar o menu à direita
                    rotateY: isMenuOpen ? 15 : 0,
                    borderRadius: isMenuOpen ? '44px' : '0px',
                }}
                transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 180,
                    mass: 0.8
                }}
                style={{ originX: 0.5, originY: 0.5, perspective: 2000 }}
                className={cn(
                    "min-h-screen bg-white relative z-10 transition-shadow touch-pan-y",
                    isMenuOpen && "shadow-[20px_0_60px_rgba(0,0,0,0.4)] overflow-hidden cursor-grab active:cursor-grabbing"
                )}
            >
                {children}
            </motion.div>

            {/* Background fixo que serve de base para o menu - Elevado z-index para cobrir o MistBackground */}
            <div className={cn(
                "fixed inset-0 bg-[#1A365D] z-[1] transition-opacity duration-500",
                isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} />
        </>
    )
}
