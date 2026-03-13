'use client'
 
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
 
interface Point {
    x: number
    y: number
}
 
interface Area {
    width: number
    height: number
    x: number
    y: number
}
 
interface ImageCropperProps {
    image: string
    onCropComplete: (croppedImage: Blob) => void
    onCancel: () => void
}
 
export function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
 
    const onCropChange = (crop: Point) => {
        setCrop(crop)
    }
 
    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }
 
    const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])
 
    const handleSave = async () => {
        if (!croppedAreaPixels) return
 
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels)
            if (croppedImage) {
                onCropComplete(croppedImage)
            }
        } catch (e) {
            console.error(e)
        }
    }
 
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-[32px] overflow-hidden flex flex-col shadow-2xl border border-white/20"
            >
                {/* Header do Modal */}
                <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
                    <h3 className="font-black text-[#1A365D] uppercase tracking-widest text-sm">Ajustar Foto</h3>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
 
                {/* Área do Cropper */}
                <div className="relative h-80 w-full bg-slate-100">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropAreaComplete}
                        onZoomChange={onZoomChange}
                        cropShape="round"
                        showGrid={false}
                    />
                </div>
 
                {/* Controles */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-4 h-4 text-slate-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                        />
                        <ZoomIn className="w-4 h-4 text-slate-400" />
                    </div>
 
                    <div className="flex gap-3">
                        <button 
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Salvar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
 
/**
 * Utilitário para processar a imagem e retornar um Blob
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
 
    if (!ctx) return null
 
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
 
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )
 
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob)
        }, 'image/jpeg', 0.9)
    })
}
 
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })
}
