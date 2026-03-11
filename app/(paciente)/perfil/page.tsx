'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, MapPin, ShieldCheck, Download, Trash2, Eye, ChevronRight, Camera } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { maskCPFPrivate, maskPhonePrivate } from '@/lib/utils/masks'
import { toast } from 'sonner'

export default function PerfilPage() {
    const router = useRouter()
    const { user } = useAuth()

    const handleExportar = () => toast.info('Preparando seus dados para exportação... (LGPD Art. 20)')
    const handleExcluir = () => toast.error('Funcionalidade de exclusão requer confirmação por e-mail.')

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-[#2D5284] px-5 pt-4 pb-12 rounded-b-3xl shadow-md z-20 mb-14 relative">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-white"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Meu Perfil</h1>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=joce" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" alt="Avatar" />
                        <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-md">
                            <Camera className="w-3.5 h-3.5 text-[#1A365D]" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="px-4 space-y-4">
                <div className="text-center mb-2">
                    <h2 className="font-black text-[18px] text-[#1A365D]">{user?.nome ?? 'Joce Moreno'}</h2>
                    <p className="text-[12px] text-slate-400">Paciente · Plano Gratuito</p>
                </div>

                {/* Dados pessoais */}
                <div className="bg-white rounded-[20px] shadow-card border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-[13px] text-[#1A365D] uppercase tracking-widest">Dados Pessoais</h3>
                        <button className="text-[#2D5284] text-[12px] font-semibold">Editar</button>
                    </div>
                    {[
                        { icon: User, label: 'Nome', value: user?.nome ?? 'Joce Moreno' },
                        { icon: Mail, label: 'E-mail', value: user?.email ?? 'joce@email.com' },
                        { icon: Phone, label: 'Telefone', value: maskPhonePrivate(user?.telefone ?? '21999990000') },
                        { icon: ShieldCheck, label: 'CPF', value: maskCPFPrivate('12345678900') },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0">
                            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                                <p className="text-[13px] text-slate-700 font-semibold">{value}</p>
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

                <button onClick={() => { useAuth().logout; router.push('/login') }}
                    className="w-full bg-red-50 text-red-600 font-bold rounded-2xl py-4 border border-red-100 text-[14px]">
                    Sair da Conta
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
