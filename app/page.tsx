import Link from 'next/link'
import { Stethoscope, Shield, Star, Zap, Heart, Clock, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'DocMatch — Encontre o Médico Ideal | Agendamento, Receitas e Preços',
    description: 'A plataforma de saúde mais completa do Brasil. Encontre médicos, agende consultas online ou presenciais, receba receitas digitais e compare preços de medicamentos.',
}

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0F2240] via-[#1A365D] to-[#0F2240] text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-[#1A365D]" />
                    </div>
                    <span className="text-[20px] font-black">Doc<span className="text-[#D4AF37]">Match</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-white/70 text-[14px] font-medium hover:text-white transition">Entrar</Link>
                    <Link href="/cadastro" className="bg-[#D4AF37] text-[#1A365D] font-black text-[13px] px-4 py-2 rounded-xl hover:brightness-110 transition">
                        Criar conta grátis
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="text-center px-6 py-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-4 py-2 rounded-full text-[12px] text-[#D4AF37] font-bold uppercase tracking-widest mb-6">
                    <Star className="w-3.5 h-3.5 fill-current" /> A plataforma de saúde do Brasil
                </div>
                <h1 className="text-[40px] sm:text-[52px] font-black leading-tight mb-4">
                    Encontre o médico ideal.<br /><span className="text-[#D4AF37]">Na hora certa.</span>
                </h1>
                <p className="text-white/60 text-[16px] leading-relaxed mb-8 max-w-xl mx-auto">
                    Agende consultas, receba receitas digitais e compare preços de medicamentos — tudo em um só lugar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/cadastro" className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-[15px] px-8 py-4 rounded-2xl shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:brightness-110 transition flex items-center justify-center gap-2">
                        Começar grátis <ChevronRight className="w-5 h-5" />
                    </Link>
                    <Link href="/buscar" className="border border-white/20 text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:bg-white/10 transition flex items-center justify-center gap-2">
                        Buscar médicos
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-12 max-w-5xl mx-auto">
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { icon: Zap, title: 'Agendamento imediato', desc: 'Slots disponíveis em tempo real. Confirme em segundos.', color: 'from-[#2D5284] to-[#1A365D]' },
                        { icon: Heart, title: 'Receitas digitais', desc: 'Receitas com QR Code válido em todo o Brasil, conforme CFM.', color: 'from-[#1A5240] to-[#0F3428]' },
                        { icon: Shield, title: 'Seus dados protegidos', desc: 'Conformidade total com LGPD. Você controla seus dados de saúde.', color: 'from-[#4A1942] to-[#2E0F26]' },
                    ].map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className={`bg-gradient-to-br ${color} rounded-[24px] p-6 border border-white/10`}>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <h3 className="font-bold text-[16px] mb-2">{title}</h3>
                            <p className="text-white/50 text-[13px] leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-white/10 py-12 px-6">
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
                    {[['5.000+', 'Médicos cadastrados'], ['200k', 'Consultas agendadas'], ['4.9★', 'Avaliação média']].map(([v, l]) => (
                        <div key={l}>
                            <p className="text-[32px] font-black text-[#D4AF37]">{v}</p>
                            <p className="text-white/50 text-[12px] mt-1">{l}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="text-center py-20 px-6">
                <h2 className="text-[28px] font-black mb-3">Pronto para cuidar da sua saúde?</h2>
                <p className="text-white/50 text-[14px] mb-6">Crie sua conta grátis em menos de 1 minuto.</p>
                <Link href="/cadastro" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-[15px] px-8 py-4 rounded-2xl shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:brightness-110 transition">
                    Criar conta grátis <ChevronRight className="w-5 h-5" />
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 px-6 text-center">
                <p className="text-white/30 text-[12px]">
                    © 2026 DocMatch · <Link href="/privacidade" className="hover:text-white/60 transition">Política de Privacidade</Link> · <Link href="/termos" className="hover:text-white/60 transition">Termos de Uso</Link>
                </p>
            </footer>
        </main>
    )
}
