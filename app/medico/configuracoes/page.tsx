'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Shield, Eye, Lock, Smartphone, ChevronRight, Download, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function ConfiguracoesMedicoPage() {
    const router = useRouter()

    const handleExportData = () => {
        toast.success('Relatório de dados gerado seguindo Art. 20 da LGPD. Download iniciado.')
    }

    return (
        <div className="min-h-screen bg-[#0F2240] pb-10">
            <header className="px-5 pt-10 pb-5 bg-gradient-to-b from-white/10 to-transparent">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-white bg-white/10 p-2 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-white font-bold text-[18px]">Configurações</h1>
                </div>
            </header>

            <div className="px-5 space-y-6">
                <section>
                    <h3 className="text-[#D4AF37] text-[10px] uppercase font-black mb-3 tracking-widest px-1">Segurança e Acesso</h3>
                    <div className="bg-white/10 rounded-[24px] border border-white/10 divide-y divide-white/5 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-white/40" />
                                <div className="text-left">
                                    <p className="text-white font-semibold text-[13px]">Alterar Senha</p>
                                    <p className="text-white/30 text-[10px]">Última alteração há 3 meses</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Smartphone className="w-4 h-4 text-white/40" />
                                <div className="text-left">
                                    <p className="text-white font-semibold text-[13px]">Autenticação 2FA</p>
                                    <p className="text-green-400 text-[10px] font-bold">ATIVADO via SMS</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                        </button>
                    </div>
                </section>

                <section>
                    <h3 className="text-[#D4AF37] text-[10px] uppercase font-black mb-3 tracking-widest px-1">Privacidade LGPD</h3>
                    <div className="bg-white/10 rounded-[24px] border border-white/10 divide-y divide-white/5 overflow-hidden">
                        <button onClick={handleExportData} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Download className="w-4 h-4 text-white/40" />
                                <div className="text-left">
                                    <p className="text-white font-semibold text-[13px]">Exportar Meus Dados</p>
                                    <p className="text-white/30 text-[10px]">Baixar histórico profissional e receitas</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all text-red-400">
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-4 h-4 opacity-70" />
                                <div className="text-left">
                                    <p className="font-bold text-[13px]">Excluir Conta</p>
                                    <p className="opacity-40 text-[10px]">Remoção definitiva do DocMatch</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="mt-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-4 flex gap-3">
                        <Info className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <p className="text-white/60 text-[11px] leading-relaxed">
                            O DocMatch segue rigorosamente a **LGPD (Lei 13.709/2018)**. Seus dados de saúde e registros médicos são criptografados fim-a-fim.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
