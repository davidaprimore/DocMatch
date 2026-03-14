'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '@/providers/UIProvider'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { cn } from '@/lib/utils'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isMenuOpen } = useUI()

    return (
        <>
            <LoadingOverlay />
            
            {/* Wrapper Principal que anima a tela para trás quando o menu abre */}
            <motion.div
                animate={{
                    scale: isMenuOpen ? 0.88 : 1,
                    x: isMenuOpen ? '-60%' : '0%', // Move para a esquerda para abrir espaço para o menu à direita
                    rotateY: isMenuOpen ? 12 : 0,
                    borderRadius: isMenuOpen ? '48px' : '0px',
                }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 200,
                    mass: 0.8
                }}
                style={{ originX: 0.5, originY: 0.5, perspective: 1000 }}
                className={cn(
                    "min-h-screen bg-white relative z-10 transition-shadow",
                    isMenuOpen && "shadow-[20px_0_60px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-none"
                )}
            >
                {children}
            </motion.div>

            {/* Background atrás da tela quando ela recua */}
            <div className={cn(
                "fixed inset-0 bg-[#0F2240] -z-10 transition-opacity duration-500",
                isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} />
        </>
    )
}
