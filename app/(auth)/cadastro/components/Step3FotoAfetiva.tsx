'use client'

import { useState } from 'react'
import { Camera, Image as ImageIcon, Sparkles, User, ArrowRight } from 'lucide-react'
import { ImageCropper } from '@/components/ImageCropper'
import { motion, AnimatePresence } from 'framer-motion'

interface Step3Props {
    data: any
    updateData: (data: any) => void
    onSubmit: () => void
    onBack: () => void
}

export function Step3FotoAfetiva({ data, updateData, onSubmit, onBack }: Step3Props) {
    const [showCropper, setShowCropper] = useState(false)
    const [tempImage, setTempImage] = useState<string | null>(null)

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setTempImage(reader.result as string)
                setShowCropper(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        updateData({ foto_blob: blob, foto_preview: url })
        setShowCropper(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center pb-4">
            <div className="space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                    {/* Ring Animado */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-white/0 rounded-full animate-spin-slow opacity-20" />
                    
                    <div className="w-full h-full rounded-full border-4 border-[#D4AF37]/30 p-1 relative z-10">
                        <div className="w-full h-full rounded-full bg-white/5 overflow-hidden shadow-2xl relative">
                            {data.foto_preview ? (
                                <img src={data.foto_preview} className="w-full h-full object-cover" alt="Sua Foto" />
                            ) : (
                                <div className="relative w-full h-full">
                                    <img 
                                        src="/assets/medica-inspiracao.png" 
                                        className="w-full h-full object-cover grayscale-[0.3] brightness-90 hover:grayscale-0 transition-all duration-700" 
                                        alt="Inspiração" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
                                        <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {!data.foto_preview && (
                        <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-[#1A365D] p-2 rounded-xl shadow-lg animate-bounce">
                            <Camera className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black text-white px-4">Humanize seu perfil 🤝</h2>
                    <p className="text-white/60 text-xs px-8 leading-relaxed">
                        Médicos e pacientes preferem ver quem está do outro lado. Uma foto passa **segurança e transparência** no atendimento.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
                <label className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[28px] p-6 hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/5 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[#D4AF37]/10">
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform">
                        <ImageIcon className="w-6 h-6 text-[#1A365D]" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Galeria</span>
                </label>

                <label className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[28px] p-6 hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/5 hover:border-[#D4AF37] transition-all cursor-pointer group shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[#D4AF37]/10">
                    <input type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform">
                        <Camera className="w-6 h-6 text-[#1A365D]" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Câmera</span>
                </label>
            </div>

            <div className="pt-4 flex flex-col gap-4 px-2">
                {data.foto_preview ? (
                    <button 
                        onClick={onSubmit}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-[0_12px_32px_-8px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition text-[13px] uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        Tudo Pronto! Finalizar →
                    </button>
                ) : (
                    <button 
                        onClick={onSubmit}
                        className="w-full bg-white/5 border border-white/10 text-white/40 font-bold rounded-2xl py-3.5 hover:bg-white/10 hover:text-white/60 transition text-[11px] uppercase tracking-widest"
                    >
                        Pular esta etapa por enquanto
                    </button>
                )}
                
                <button 
                    onClick={onBack}
                    className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors"
                >
                    ⇠ Corrigir Endereço
                </button>
            </div>

            <AnimatePresence>
                {showCropper && tempImage && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <div className="w-full max-w-md bg-[#1A365D] rounded-[40px] p-8 border border-white/10 shadow-2xl relative">
                            <h3 className="text-white font-black text-center mb-6 uppercase tracking-widest">Ajuste sua Foto</h3>
                            <ImageCropper 
                                image={tempImage} 
                                onCropComplete={onCropComplete} 
                                onCancel={() => setShowCropper(false)} 
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
