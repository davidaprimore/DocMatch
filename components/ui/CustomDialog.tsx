'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, CheckCircle2, AlertCircle, X } from 'lucide-react'

type DialogType = 'success' | 'error' | 'info' | 'confirm'

interface DialogOptions {
    title: string
    message: string
    type?: DialogType
    onConfirm?: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
}

interface DialogContextType {
    showDialog: (options: DialogOptions) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogOptions | null>(null)

    const showDialog = (options: DialogOptions) => {
        setDialog({
            ...options,
            type: options.type || 'info'
        })
    }

    const handleConfirm = () => {
        if (dialog?.onConfirm) dialog.onConfirm()
        setDialog(null)
    }

    const handleCancel = () => {
        if (dialog?.onCancel) dialog.onCancel()
        setDialog(null)
    }

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            <AnimatePresence>
                {dialog && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={handleCancel}
                        />

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-slate-50/60 backdrop-blur-3xl rounded-[40px] border-2 border-[#D4AF37] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
                        >
                            <div className="p-8 text-center space-y-6">
                                {/* Icon Section */}
                                <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden">
                                    <div className={`absolute inset-0 opacity-10 ${
                                        dialog.type === 'error' ? 'bg-red-500' : 
                                        dialog.type === 'success' ? 'bg-[#2D5284]' : 'bg-[#2D5284]'
                                    }`} />
                                    {dialog.type === 'error' && <XCircle className="w-8 h-8 text-red-500" />}
                                    {dialog.type === 'success' && <CheckCircle2 className="w-8 h-8 text-[#2D5284]" />}
                                    {(dialog.type === 'info' || dialog.type === 'confirm') && <AlertCircle className="w-8 h-8 text-[#2D5284]" />}
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-xl font-black ${
                                        dialog.type === 'error' ? 'text-red-600' : 'text-[#1A365D]'
                                    }`}>
                                        {dialog.title}
                                    </h3>
                                    <p className="text-[#1A365D]/70 text-sm leading-relaxed px-2 font-medium">
                                        {dialog.message}
                                    </p>
                                </div>

                                <div className="pt-2 flex flex-col gap-3">
                                    <button 
                                        onClick={handleConfirm}
                                        className={`w-full font-black rounded-2xl py-4 uppercase tracking-widest text-[11px] shadow-lg active:scale-[0.98] transition ${
                                            dialog.type === 'error' ? 'bg-red-500 text-white' : 
                                            'bg-[#2D5284] text-white'
                                        }`}
                                    >
                                        {dialog.confirmText || (dialog.type === 'confirm' ? 'Sim' : 'Entendi')}
                                    </button>

                                    {dialog.type === 'confirm' && (
                                        <button 
                                            onClick={handleCancel}
                                            className="w-full bg-[#1A365D]/5 border border-[#1A365D]/10 text-[#1A365D]/60 font-bold rounded-2xl py-4 hover:bg-[#1A365D]/10 transition text-[11px] uppercase tracking-widest"
                                        >
                                            {dialog.cancelText || 'Agora não'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Close Button X (optional) */}
                            <button 
                                onClick={handleCancel}
                                className="absolute top-6 right-6 p-2 text-[#2D5284]/40 hover:text-[#2D5284] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DialogContext.Provider>
    )
}

export function useDialog() {
    const context = useContext(DialogContext)
    if (context === undefined) throw new Error('useDialog must be used within a DialogProvider')
    return context
}
