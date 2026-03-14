'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Stethoscope, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Step1Identidade } from './components/Step1Identidade'
import { Step2Localizacao } from './components/Step2Localizacao'
import { Step3FotoAfetiva } from './components/Step3FotoAfetiva'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function CadastroPage() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ 
        nome: '', 
        email: '', 
        telefone: '', 
        cpf: '',
        password: '', 
        confirmPassword: '', 
        // Localização
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: '',
        // Foto
        foto_blob: null as Blob | null,
        foto_preview: ''
    })

    const updateForm = (data: Partial<typeof form>) => {
        setForm(prev => ({ ...prev, ...data }))
    }

    const handleFinalSubmit = async () => {
        try {
            // 1. Upload da foto se existir
            let fotoUrl = ''
            if (form.foto_blob) {
                const fileExt = 'jpg'
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `perfil/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('fotos_perfil')
                    .upload(filePath, form.foto_blob, { contentType: 'image/jpeg', upsert: true })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('fotos_perfil')
                    .getPublicUrl(filePath)
                
                fotoUrl = publicUrl
            }

            // 2. Registro Completo
            const registrationData = {
                ...form,
                tipo: 'paciente' as const,
                foto: fotoUrl,
                // Garantir que campos de localização vão para o backend
                metadata: {
                    cep: form.cep,
                    endereco: `${form.logradouro}, ${form.numero}${form.complemento ? ' - ' + form.complemento : ''}`,
                    bairro: form.bairro,
                    cidade: form.cidade,
                    uf: form.uf
                }
            }

            await register(registrationData)
            router.push('/dashboard')
        } catch (err: any) {
            console.error('Erro no cadastro final:', err)
        }
    }

    const steps = [
        { id: 1, title: 'Identidade' },
        { id: 2, title: 'Localização' },
        { id: 3, title: 'Perfil' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A365D] via-[#2D5284] to-[#1A365D] flex flex-col p-6 py-10 overflow-x-hidden">
            <button 
                onClick={() => step > 1 ? setStep(step - 1) : router.back()} 
                className="text-white mb-6 self-start p-2 hover:bg-white/10 rounded-full transition-all"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="mb-8 text-center">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
                    <Stethoscope className="w-8 h-8 text-[#1A365D]" />
                </div>
                <h1 className="text-2xl font-black text-white">Comece sua jornada</h1>
                
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {steps.map((s) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s.id ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/10'}`} />
                        </div>
                    ))}
                </div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                    Ato {step}: {steps.find(s => s.id === step)?.title}
                </p>
            </div>

            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Step1Identidade 
                                    data={form} 
                                    updateData={updateForm} 
                                    onNext={() => setStep(2)} 
                                />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Step2Localizacao 
                                    data={form} 
                                    updateData={updateForm} 
                                    onNext={() => setStep(3)} 
                                    onBack={() => setStep(1)}
                                />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Step3FotoAfetiva 
                                    data={form} 
                                    updateData={updateForm} 
                                    onSubmit={handleFinalSubmit}
                                    onBack={() => setStep(2)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading && (
                        <div className="absolute inset-0 bg-[#1A365D]/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-[40px] p-8 text-center">
                            <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
                            <p className="text-white font-black text-sm uppercase tracking-widest">Iniciando sua jornada...</p>
                            <p className="text-white/40 text-[10px] mt-2">Estamos preparando seu espaço seguro no DocMatch</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-white/40 text-sm mt-8">
                    Já faz parte do time?{' '}
                    <Link href="/login" className="text-[#D4AF37] font-black hover:underline tracking-tight">CANAIS DE ACESSO</Link>
                </p>
            </div>
        </div>
    )
}
