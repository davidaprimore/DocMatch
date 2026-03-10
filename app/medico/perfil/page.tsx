'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Shield, Camera, Save, LogOut, Award, Briefcase, MapPin } from 'lucide-react'
import { medicosMock } from '@/data/mockData'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export default function PerfilMedicoPage() {
    const router = useRouter()
    const { logout } = useAuth()
    const medico = medicosMock[0]
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success('Perfil atualizado com sucesso!')
        }, 1000)
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-24">
            <header className="relative h-[220px] bg-[#1A365D] flex flex-col items-center justify-center pt-8">
                <button onClick={() => router.back()} className="absolute top-10 left-5 text-white bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                    <div className="w-28 h-28 rounded-[32px] border-4 border-[#D4AF37] overflow-hidden shadow-2xl">
                        <img src={medico.foto_url} className="w-full h-full object-cover" alt={medico.nome} />
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-2xl flex items-center justify-center border-4 border-[#1A365D] shadow-lg transition-active active:scale-90">
                        <Camera className="w-5 h-5 text-[#1A365D]" />
                    </button>
                </div>
            </header>

            <div className="px-5 -mt-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-white/30 text-[10px] uppercase font-black tracking-widest px-2">Dados Profissionais</h3>

                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <label className="text-white/40 text-[10px] font-bold block mb-1">Nome Completo</label>
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-[#D4AF37]" />
                                    <input defaultValue={medico.nome} className="bg-transparent text-white text-sm font-semibold outline-none w-full" />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <label className="text-white/40 text-[10px] font-bold block mb-1">CRM / Registro</label>
                                <div className="flex items-center gap-3">
                                    <Award className="w-4 h-4 text-[#D4AF37]" />
                                    <p className="text-white/60 text-sm font-semibold">{medico.crm}</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <label className="text-white/40 text-[10px] font-bold block mb-1">Especialidade Principal</label>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                                    <input defaultValue={medico.especialidade} className="bg-transparent text-white text-sm font-semibold outline-none w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white/30 text-[10px] uppercase font-black tracking-widest px-2">Configurações de Conta</h3>
                        <button onClick={() => router.push('/medico/configuracoes')} className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between transition-active active:bg-white/10">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-white/40" />
                                <span className="text-white font-semibold text-sm">Privacidade e LGPD</span>
                            </div>
                            <Save className="w-4 h-4 text-white/20" />
                        </button>

                        <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-400 font-bold transition-active active:scale-95">
                            <LogOut className="w-4 h-4" /> Sair da conta
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-5 right-5 z-50">
                <button onClick={handleSave} disabled={loading} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black py-4 rounded-2xl shadow-[0_12px_24px_rgba(212,175,55,0.3)] transition-active active:scale-95 disabled:opacity-50">
                    {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
            </div>
        </div>
    )
}
