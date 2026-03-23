'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Stethoscope, ShieldCheck, Zap, Heart, ArrowRight, Play, Star, CalendarCheck, FileText, CheckCircle2 } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function LandingPage() {
    const router = useRouter()
    const { scrollY } = useScroll()
    const headerBg = useTransform(scrollY, [0, 50], ['rgba(10, 15, 28, 0)', 'rgba(10, 15, 28, 0.85)'])
    const headerBorder = useTransform(scrollY, [0, 50], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.05)'])
    const headerBlur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(16px)'])

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <main className="min-h-screen bg-[#0A0F1C] text-white selection:bg-[#D4AF37]/30 font-sans overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#1A365D]/30 to-transparent blur-[120px] opacity-70" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#D4AF37]/10 to-transparent blur-[120px] opacity-60" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
            </div>

            {/* Premium Navbar */}
            <motion.nav
                style={{ backgroundColor: headerBg, borderColor: headerBorder, backdropFilter: headerBlur }}
                className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push('/')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
                            <Stethoscope className="w-5 h-5 text-[#0A0F1C]" />
                        </div>
                        <span className="text-[22px] font-black tracking-tight">
                            Doc<span className="text-[#D4AF37]">Match</span>
                        </span>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-8 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
                        {['Plataforma', 'Especialistas', 'Preços'].map((item) => (
                            <Link key={item} href="#" className="text-white/60 hover:text-white text-[13px] font-bold transition-colors">{item}</Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block text-white/60 hover:text-white text-[14px] font-bold transition">Acessar Conta</Link>
                        <Link href="/cadastro">
                            <Button className="bg-white text-[#0A0F1C] hover:bg-[#D4AF37] font-black text-[14px] px-6 py-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] border-0">
                                COMEÇAR AGORA
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hyper-Modern Hero Section */}
            <section className="relative pt-40 pb-20 px-6 z-10 flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto text-center flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-[12px] text-[#D4AF37] font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37]" /> A revolução da saúde chegou
                    </div>

                    <h1 className="text-[56px] sm:text-[80px] lg:text-[100px] font-black leading-[0.95] tracking-tight mb-8">
                        Acesso prime à <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-white via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                            saúde inteligente.
                        </span>
                    </h1>

                    <p className="text-white/50 text-[18px] sm:text-[22px] leading-relaxed mb-12 max-w-2xl font-medium">
                        Agende consultas de excelência, gerencie suas receitas digitais e garanta o menor preço nos seus medicamentos. Tudo em um só lugar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/cadastro" className="group">
                            <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0F1C] font-black text-[16px] px-8 py-5 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                                CADASTRAR GRATUITAMENTE
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                        <Link href="/buscar" className="group">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" /> Conheça a Plataforma
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Bento Dashboard Preview */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-6xl mx-auto mt-24 relative"
                >
                    {/* Center Piece */}
                    <div className="relative z-10 w-full md:w-3/4 mx-auto bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-4 sm:p-8">
                        <div className="w-full aspect-video bg-[#0A0F1C] rounded-[24px] border border-white/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="text-center z-10">
                                <Stethoscope className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <h3 className="text-white/40 font-black text-2xl tracking-widest uppercase">Ecosistema DocMatch</h3>
                                <p className="text-[#D4AF37]/50 font-bold mt-2 text-sm">Design Pro-Max Premium</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating elements simulating Bento UI */}
                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-4 md:-left-12 top-20 z-20 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CalendarCheck className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[14px] font-black">Consulta Confirmada</p>
                            <p className="text-[11px] text-white/50">Dr. Paulo Henrique • 14:30</p>
                        </div>
                    </motion.div>

                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-4 md:-right-12 bottom-20 z-20 bg-white/10 backdrop-blur-xl border border-[#D4AF37]/30 p-5 rounded-3xl shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[14px] font-black">Receita Digital</p>
                            <p className="text-[11px] text-white/50">Assinada via LGPD</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Premium Bento Grid Features */}
            <section className="py-32 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-20 text-center sm:text-left">
                        <h2 className="text-[40px] sm:text-[56px] font-black leading-tight tracking-tight">O padrão ouro em <br /><span className="text-[#D4AF37]">tecnologia médica.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Box 1 - Grande */}
                        <div className="md:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
                            <Zap className="w-10 h-10 text-blue-400 mb-6 relative z-10" />
                            <h3 className="text-[28px] font-black mb-4 relative z-10">Agendamento Ultra-Rápido</h3>
                            <p className="text-white/50 text-[16px] font-medium max-w-md relative z-10">Acesse a agenda em tempo real dos melhores especialistas. Sem ligações demoradas, sem esperas. Apenas 3 cliques e você está agendado.</p>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition-colors duration-700" />
                            <ShieldCheck className="w-10 h-10 text-green-400 mb-6 relative z-10" />
                            <h3 className="text-[24px] font-black mb-4 relative z-10">Conformidade LGPD</h3>
                            <p className="text-white/50 text-[15px] font-medium relative z-10">Seus dados médicos são criptografados com padrão bancário E2EE.</p>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-[#D4AF37]/20 rounded-[40px] p-10 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[50px] rounded-full group-hover:bg-[#D4AF37]/30 transition-colors duration-700" />
                            <FileText className="w-10 h-10 text-[#D4AF37] mb-6 relative z-10" />
                            <h3 className="text-[24px] font-black mb-4 relative z-10">Receitas Inteligentes</h3>
                            <p className="text-white/50 text-[15px] font-medium relative z-10">Prescrições digitais com QR Code válidas em qualquer farmácia do Brasil.</p>
                        </div>

                        {/* Box 4 - Grande */}
                        <div className="md:col-span-2 bg-gradient-to-br from-[#1A365D]/40 to-[#0A0F1C] border border-[#D4AF37]/30 rounded-[40px] p-10 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
                            <div className="relative z-10">
                                <div className="inline-block bg-[#D4AF37] text-[#0A0F1C] text-[10px] font-black px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">Lançamento</div>
                                <h3 className="text-[32px] sm:text-[40px] font-black mb-4 leading-tight">Comparador de Preços em Rede Nacional</h3>
                                <p className="text-white/60 text-[18px] mb-8 max-w-lg font-medium">Não pague mais caro. Nossa IA cruza os dados da sua receita com as farmácias ao seu redor para garantir o menor custo possível.</p>
                                <ul className="space-y-3 mb-8">
                                    {['Análise de mais de 10.000 farmácias', 'Descontos automáticos aplicados', 'Reserva de medicamentos online'].map(b => (
                                        <li key={b} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                                            <span className="text-[15px] font-bold text-white/80">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Massive CTA */}
            <section className="py-40 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-[50px] sm:text-[80px] font-black mb-10 tracking-tighter leading-[0.95]">
                        Pronto para mudar <br />sua relação com a <span className="text-[#D4AF37]">saúde?</span>
                    </h2>
                    <p className="text-white/40 text-[22px] mb-12 font-medium max-w-2xl mx-auto">Mais de 10.000 profissionais de elite já utilizam a DocMatch diariamente.</p>
                    
                    <Link href="/cadastro">
                        <div className="bg-white text-[#0A0F1C] font-black text-[20px] px-14 py-8 rounded-[32px] shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-4 uppercase tracking-widest border border-white/10 group">
                            COMEÇAR AGORA 
                            <div className="bg-[#0A0F1C] p-2 rounded-full group-hover:bg-[#D4AF37] transition-colors">
                                <ArrowRight className="w-5 h-5 text-white group-hover:text-[#0A0F1C]" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Simplistic Dark Footer */}
            <footer className="bg-[#0A0F1C] border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[18px] font-black">Doc<span className="text-[#D4AF37]">Match</span></span>
                    </div>
                    <p className="text-white/20 text-[12px] font-bold tracking-widest uppercase">© 2026 DOCMATCH BRASIL LTDA. TODOS OS DIREITOS RESERVADOS.</p>
                    <div className="flex gap-6">
                        {['Termos', 'Privacidade', 'Contato'].map(link => (
                            <Link key={link} href="#" className="text-white/40 hover:text-white transition-colors text-[13px] font-bold uppercase tracking-widest">{link}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </main>
    )
}
