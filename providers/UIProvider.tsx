'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface UIContextType {
    isMenuOpen: boolean
    setIsMenuOpen: (open: boolean) => void
    isLoadingGlobal: boolean
    setIsLoadingGlobal: (loading: boolean) => void
    triggerDemoLoading: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(false)
    const pathname = usePathname()

    // Fecha o menu automaticamente ao mudar de rota
    useEffect(() => {
        setIsMenuOpen(false)
        
        // Simula o fim do carregamento ao chegar na nova rota
        // Em um app real, isso seria disparado pelo fim do fetch global
        setIsLoadingGlobal(false)
    }, [pathname])

    const triggerDemoLoading = () => {
        setIsLoadingGlobal(true)
        setTimeout(() => {
            setIsLoadingGlobal(false)
        }, 6000) // 6 segundos para ele ver o "Só mais um pouco"
    }

    return (
        <UIContext.Provider value={{
            isMenuOpen,
            setIsMenuOpen,
            isLoadingGlobal,
            setIsLoadingGlobal,
            triggerDemoLoading
        }}>
            {children}
        </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider')
    }
    return context
}
