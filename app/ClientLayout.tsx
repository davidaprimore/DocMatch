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
                dragConstraints={{ right: 0, left: -400 }}
                dragElastic={0.05}
                onDragEnd={(_, info) => {
                    if (info.offset.x > 80 || info.velocity.x > 400) {
                        setIsMenuOpen(false)
                    }
                }}
                animate={{
                    scale: isMenuOpen ? 0.85 : 1,
                    x: isMenuOpen ? '-75vw' : '0vw',
                    rotateY: isMenuOpen ? 15 : 0,
                    borderRadius: isMenuOpen ? '44px' : '0px',
                }}
                transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 180,
                    mass: 0.8
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className={cn(
                    "h-screen w-full bg-white relative z-10 transition-shadow overflow-y-auto overflow-x-hidden",
                    isMenuOpen ? "shadow-[20px_0_60px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing" : "touch-pan-y"
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
