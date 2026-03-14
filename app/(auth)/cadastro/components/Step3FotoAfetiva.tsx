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
            <div className="space-y-3">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#F5E6AD] rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
                    <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#D4AF37] animate-pulse" />
                    {data.foto_preview ? (
                        <img src={data.foto_preview} className="w-full h-full rounded-full object-cover border-4 border-white/20" alt="Preview" />
                    ) : (
                        <User className="w-10 h-10 text-[#1A365D]" />
                    )}
                </div>
                <h2 className="text-xl font-black text-white px-4">Sua saúde em boas mãos! 🤝</h2>
                <p className="text-white/60 text-sm px-6 leading-relaxed">
                    Que tal colocar um rosto no seu perfil? Isso ajuda os médicos a identificarem você rapidamente e torna seu atendimento ainda mais humano e seguro.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
                <label className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-[24px] p-6 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">Galeria</span>
                </label>

                <label className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-[24px] p-6 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
                    <input type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">Câmera</span>
                </label>
            </div>

            <div className="pt-4 flex flex-col gap-4 px-2">
                <button 
                    onClick={onSubmit}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black rounded-2xl py-4 shadow-[0_12px_32px_-8px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition text-[13px] uppercase tracking-wider flex items-center justify-center gap-2"
                >
                    {data.foto_preview ? 'Ficou Ótimo! Finalizar →' : 'Finalizar sem foto agora →'}
                </button>
                
                <button 
                    onClick={onBack}
                    className="text-white/30 text-[11px] font-bold uppercase tracking-widest hover:text-white/60 transition"
                >
                    Ajustar Endereço
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
