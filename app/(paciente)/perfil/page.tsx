'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, MapPin, ShieldCheck, Download, Trash2, Eye, ChevronRight, Camera, Loader2, Star } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { maskCPFPrivate, maskPhonePrivate } from '@/lib/utils/masks'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { ImageCropper } from '@/components/ImageCropper'
 
import { supabase } from '@/lib/supabase'
 
export default function PerfilPage() {
    const router = useRouter()
    const { user, logout, updateProfile } = useAuth()
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const galleyInputRef = useRef<HTMLInputElement>(null)
 
    const handleExportar = () => toast.info('Preparando seus dados para exportação... (LGPD Art. 20)')
    const handleExcluir = () => toast.error('Funcionalidade de exclusão requer confirmação por e-mail.')
 
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setSelectedImage(reader.result as string)
                setIsCropping(true)
            })
            reader.readAsDataURL(e.target.files[0])
        }
    }
 
    const handleCroppedImage = async (blob: Blob) => {
        if (!user) return
        setIsCropping(false)
        setIsUploading(true)
        
        try {
            const fileExt = 'jpg'
            const fileName = `${user.id}/${Date.now()}.${fileExt}`
            const filePath = `${fileName}`
 
            // 1. Upload para o Storage
            const { error: uploadError } = await supabase.storage
                .from('fotos_perfil')
                .upload(filePath, blob, {
                    contentType: 'image/jpeg',
                    upsert: true
                })
 
            if (uploadError) throw uploadError
 
            // 2. Pegar URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('fotos_perfil')
                .getPublicUrl(filePath)
 
            // 3. Atualizar no Banco de Dados
            await updateProfile({ foto: publicUrl })
            
            toast.success('Foto de perfil atualizada com sucesso!')
        } catch (err: any) {
            console.error('Erro no upload:', err)
            toast.error('Erro ao salvar foto: ' + (err.message || 'Erro desconhecido'))
        } finally {
            setIsUploading(false)
        }
    }
 
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <Header title="Meu Perfil" showBackButton showNotifications />
 
            <div className="flex flex-col items-center -mt-16 mb-6 relative z-[60]">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 relative">
                            {user?.foto ? (
                                <img 
                                    src={user.foto} 
                                    className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-40' : 'opacity-100'}`} 
                                    alt={user?.nome ?? ""} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-2xl">
                                    {user?.nome?.substring(0, 2).toUpperCase() || 'DM'}
                                </div>
                            )}
                            
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                                    <Loader2 className="w-6 h-6 text-[#2D5284] animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => cameraInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                        >
                            <Camera className="w-4 h-4 text-[#1A365D]" />
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={() => galleyInputRef.current?.click()}
                    className="mt-3 text-[#2D5284] text-[13px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    Alterar foto
                </button>
 
                {/* Inputs Escondidos */}
                <input 
                    type="file" 
                    ref={cameraInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={onFileChange} 
                />
                <input 
                    type="file" 
                    ref={galleyInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onFileChange} 
                />
            </div>
 
            {isCropping && selectedImage && (
                <ImageCropper 
                    image={selectedImage} 
                    onCropComplete={handleCroppedImage} 
                    onCancel={() => setIsCropping(false)} 
                />
            )}
 
            <div className="px-4 space-y-4">
                <div className="text-center mb-2">
                    <h2 className="font-black text-[18px] text-[#1A365D] uppercase tracking-tight">{user?.nome ?? ''}</h2>
                    <div className="flex flex-col items-center gap-1 mt-1">
                        <p className="text-[12px] text-slate-400 font-bold">
                            Paciente · Plano {user?.plano_nome || 'Free'}
                        </p>
                        <div className="flex items-center gap-1.5 bg-white shadow-sm border border-slate-100 px-3 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                            <span className="text-[12px] font-black text-[#1A365D]">{user?.nota?.toFixed(2) || '5.00'}</span>
                        </div>
                    </div>
                </div>
 
                {/* Dados pessoais */}
                <div className="bg-white rounded-[20px] shadow-card border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-[13px] text-[#1A365D] uppercase tracking-widest">Dados Pessoais</h3>
                        <button className="text-[#2D5284] text-[12px] font-semibold">Editar</button>
                    </div>
                    {[
                        { icon: User, label: 'Nome Completo', value: user?.nome ?? '-' },
                        { icon: Mail, label: 'E-mail', value: user?.email ?? '-' },
                        { icon: Phone, label: 'Telefone', value: user?.telefone ? maskPhonePrivate(user.telefone) : '-' },
                        { icon: ShieldCheck, label: 'CPF', value: user?.cpf ? maskCPFPrivate(user.cpf) : '-' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0">
                            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{label}</p>
                                <p className="text-[14px] text-slate-700 font-bold">{value}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-200" />
                        </div>
                    ))}
                </div>
 
                {/* LGPD */}
                <div className="bg-white rounded-[20px] shadow-card border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <h3 className="font-bold text-[13px] text-[#1A365D] uppercase tracking-widest">Privacidade & LGPD</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Seus direitos conforme a Lei nº 13.709/2018</p>
                    </div>
 
                    {[
                        { icon: Eye, label: 'Ver meus dados', desc: 'Consulte tudo que armazenamos', action: () => toast.info('Abrindo relatório de dados...') },
                        { icon: Download, label: 'Exportar meus dados', desc: 'Baixar JSON com seus dados (Art. 20)', action: handleExportar },
                        { icon: Trash2, label: 'Excluir minha conta', desc: 'Anonimização irreversível dos dados', action: handleExcluir, danger: true },
                    ].map(({ icon: Icon, label, desc, action, danger }) => (
                        <button key={label} onClick={action} className="w-full flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0 text-left">
                            <Icon className={`w-4 h-4 flex-shrink-0 ${danger ? 'text-red-500' : 'text-[#2D5284]'}`} />
                            <div className="flex-1">
                                <p className={`text-[13px] font-semibold ${danger ? 'text-red-600' : 'text-slate-700'}`}>{label}</p>
                                <p className="text-[11px] text-slate-400">{desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-200" />
                        </button>
                    ))}
                </div>
 
                <button onClick={async () => { await logout(); router.push('/login') }}
                    className="w-full bg-red-50 text-red-600 font-bold rounded-2xl py-4 border border-red-100 text-[14px]">
                    Sair da Conta
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
