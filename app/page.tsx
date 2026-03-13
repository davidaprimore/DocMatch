'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Stethoscope, Shield, Star, Zap, Heart, Clock, ChevronRight, Play, CheckCircle2, Award, Users, ArrowRight, ShieldCheck, ZapOff } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function LandingPage() {
    const router = useRouter()
    const { scrollY } = useScroll()
    const headerBg = useTransform(scrollY, [0, 100], ['rgba(15, 34, 64, 0)', 'rgba(15, 34, 64, 0.9)'])
    const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)'])

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <main className="min-h-screen bg-[#0F2240] text-white selection:bg-[#D4AF37]/30">
            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2D5284]/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* HEADER / NAVBAR */}
            <motion.nav
                style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={() => router.push('/')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
                            <Stethoscope className="w-5 h-5 text-[#1A365D]" />
                        </div>
                        <span className="text-[22px] font-black tracking-tighter">
                            <span className="text-[#D4AF37]">Doc</span>Match
                        </span>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Médicos', 'Como funciona', 'Especialidades', 'Preços'].map((item) => (
                            <Link key={item} href="#" className="text-white/60 hover:text-[#D4AF37] text-[14px] font-bold transition-colors uppercase tracking-widest">{item}</Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="block text-white/70 text-[14px] font-bold hover:text-white transition">Entrar</Link>
                        <Link href="/cadastro">
                            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-[13px] px-6 py-5 rounded-xl hover:scale-105 transition-transform shadow-[0_8px_20px_rgba(212,175,55,0.25)] border-0">
                                COMEÇAR GRÁTIS
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    className="max-w-6xl mx-auto flex flex-col items-center text-center"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 px-5 py-2 rounded-full text-[11px] text-[#D4AF37] font-black uppercase tracking-[0.2em] mb-8 shadow-inner"
                    >
                        <Users className="w-3.5 h-3.5" /> REVOLUCIONANDO A SAÚDE NO BRASIL
                    </motion.div>

                    <motion.h1 
                        variants={itemVariants}
                        className="text-[48px] sm:text-[72px] lg:text-[84px] font-black leading-[1.05] tracking-tight mb-8"
                    >
                        O médico perfeito <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#CFAF42] bg-clip-text text-transparent drop-shadow-sm">
                            ao seu alcance.
                        </span>
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="text-white/60 text-[18px] sm:text-[20px] leading-relaxed mb-12 max-w-2xl font-medium"
                    >
                        Agende consultas, receba receitas digitais e economize em medicamentos com a plataforma mais moderna e segura do país.
                    </motion.p>

                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                    >
                        <Link href="/cadastro" className="group">
                            <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-[16px] px-10 py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(212,175,55,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3 relative overflow-hidden">
                                <span className="relative z-10 uppercase tracking-wider">Criar minha conta grátis</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            </div>
                        </Link>
                        <Link href="/buscar" className="group">
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold text-[16px] px-10 py-5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <Play className="w-4 h-4 fill-white" /> Explorar Médicos
                            </div>
                        </Link>
                    </motion.div>

                    {/* Dashboard Preview / Floating Cards */}
                    <motion.div 
                        variants={itemVariants}
                        className="mt-24 relative w-full max-w-5xl mx-auto"
                    >
                        {/* Main Preview Glass Card */}
                        <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden p-4 sm:p-8">
                            <img 
                                src="c:/Users/david/.gemini/antigravity/brain/1e896c99-bf52-4fa1-a8cb-da38259d0bbe/dashboard_medicos_check_1773360738914.png" 
                                className="w-full h-auto rounded-[32px] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                                alt="Dashboard Preview" 
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<div class="h-96 w-full flex items-center justify-center bg-white/5 rounded-3xl"><span class="text-white/20 font-black text-xl">INTERACE REAL DOCMATCH</span></div>';
                                }}
                            />
                        </div>

                        {/* Floating Micro-cards */}
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -left-10 z-20 hidden lg:flex bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-[14px] font-black">LGPD Compliance</p>
                                <p className="text-[11px] text-white/50">Dados 100% protegidos</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                            className="absolute -bottom-10 -right-10 z-20 hidden lg:flex bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                                <Award className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-[14px] font-black">Top 1% Médicos</p>
                                <p className="text-[11px] text-white/50">Somente os melhores</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* TRUST SECTION / STRIP */}
            <div className="bg-white/[0.02] border-y border-white/5 py-12">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                    {['Google Health', 'ANS', 'CFM', 'LGPD Certified'].map((logo) => (
                        <div key={logo} className="flex items-center justify-center font-black text-[20px] tracking-tighter opacity-60">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURES SECTION (GLASSMorphism) */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-[36px] sm:text-[48px] font-black mb-6">Por que escolher o <span className="text-[#D4AF37]">DocMatch?</span></h2>
                        <p className="text-white/50 text-[18px] max-w-2xl mx-auto font-medium leading-relaxed">Combinamos inteligência tecnológica com cuidado humano para oferecer a melhor jornada de saúde.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Zap, 
                                title: 'Velocidade Máxima', 
                                desc: 'Encontre e agende um especialista em menos de 2 minutos. Consultas presenciais ou via telemedicina.', 
                                color: 'bg-blue-500/20', 
                                iconColor: 'text-blue-400' 
                            },
                            { 
                                icon: Heart, 
                                title: 'Cuidado Contínuo', 
                                desc: 'Receitas digitais enviadas direto para o seu celular com validade nacional e QR Code para farmácias.', 
                                color: 'bg-red-500/20', 
                                iconColor: 'text-red-400' 
                            },
                            { 
                                icon: Shield, 
                                title: 'Privacidade Total', 
                                desc: 'Arquitetura baseada em LGPD. Seus prontuários e receitas são acessíveis apenas por você e seu médico.', 
                                color: 'bg-[#D4AF37]/20', 
                                iconColor: 'text-[#D4AF37]' 
                            },
                        ].map((f, i) => (
                            <motion.div 
                                key={f.title}
                                whileHover={{ y: -10 }}
                                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[40px] relative group"
                            >
                                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <f.icon className={`w-8 h-8 ${f.iconColor}`} />
                                </div>
                                <h3 className="text-[22px] font-black mb-4">{f.title}</h3>
                                <p className="text-white/40 leading-relaxed text-[15px] font-medium">{f.desc}</p>
                                <div className="absolute top-4 right-8 text-[64px] font-black text-white/[0.02] pointer-events-none">{i+1}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMPARATOR TEASER SECTION */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#1A365D] to-[#0F2240] rounded-[60px] p-8 md:p-20 border border-[#D4AF37]/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-[0_50px_100px_-30px_rgba(212,175,55,0.15)]">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-block bg-[#D4AF37] text-[#1A365D] text-[10px] font-black px-4 py-1.5 rounded-full mb-6 tracking-[0.2em]">EXCLUSIVO</div>
                        <h2 className="text-[32px] sm:text-[44px] font-black mb-6 leading-tight">Compare preços e economize até <span className="text-[#D4AF37]">70%</span> em remédios.</h2>
                        <p className="text-white/60 text-[18px] mb-10 leading-relaxed font-medium">Nossa IA busca em tempo real nas maiores redes de farmácia do Brasil, garantindo o menor preço da sua receita.</p>
                        <div className="space-y-4 mb-10">
                            {['Busca em tempo real', 'Entrega ultra rápida', 'Cache de descontos'].map(check => (
                                <div key={check} className="flex items-center gap-3 justify-center md:justify-start">
                                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                                    <span className="text-[15px] font-bold text-white/80">{check}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/buscar">
                            <Button className="bg-white text-[#1A365D] font-black text-[14px] px-10 py-7 rounded-2xl hover:scale-105 transition-transform flex items-center gap-2">
                                TESTAR COMPARADOR <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="flex-hidden md:flex flex-1 justify-center relative">
                        <div className="w-[300px] h-[450px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-900 relative">
                             {/* Tela de exemplo do comparador */}
                             <div className="p-6 h-full bg-slate-50 flex flex-col">
                                <div className="h-8 w-2/3 bg-slate-200 rounded-lg mb-4" />
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="w-20 h-4 bg-blue-100 rounded" />
                                                <div className="w-12 h-4 bg-green-100 rounded" />
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 rounded" />
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] text-[#1A365D] w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl rotate-12 border-4 border-[#0F2240]">
                            <span className="text-[12px] font-black">ECONOMIZE</span>
                            <span className="text-[28px] font-black">R$ 450</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-40 px-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto relative z-10"
                >
                    <h2 className="text-[42px] sm:text-[60px] font-black mb-10 tracking-tight leading-none">Sua saúde merece o <span className="text-[#D4AF37]">melhor.</span></h2>
                    <p className="text-white/40 text-[20px] mb-12 font-medium">Junte-se a mais de 200.000 brasileiros que já transformaram sua jornada de saúde com o DocMatch.</p>
                    
                    <Link href="/cadastro">
                        <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A365D] font-black text-[20px] px-12 py-7 rounded-3xl shadow-[0_30px_60px_-15px_rgba(212,175,55,0.6)] hover:scale-105 hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-4 uppercase tracking-[0.05em]">
                            Criar minha conta agora <ArrowRight className="w-6 h-6" />
                        </div>
                    </Link>
                    <p className="mt-8 text-white/30 text-[13px] font-bold tracking-widest uppercase">Grátis. Sem cartão de crédito. Rápido.</p>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="bg-black/20 border-t border-white/5 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-8">
                             <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg flex items-center justify-center">
                                <Stethoscope className="w-4 h-4 text-[#1A365D]" />
                            </div>
                            <span className="text-[20px] font-black">Doc<span className="text-[#D4AF37]">Match</span></span>
                        </div>
                        <p className="text-white/40 text-[14px] leading-relaxed mb-8">
                            A plataforma que une tecnologia de ponta com o cuidado que você merece. Sua saúde, sob seu controle.
                        </p>
                    </div>

                    {[
                        { title: 'Plataforma', links: ['Médicos', 'Especialidades', 'Farmácias', 'Preços'] },
                        { title: 'Empresa', links: ['Sobre nós', 'Carreiras', 'Blog', 'Contato'] },
                        { title: 'Legal', links: ['Privacidade', 'Termos', 'DPO', 'Cookies'] },
                    ].map(col => (
                        <div key={col.title}>
                            <h4 className="font-black text-[14px] text-white uppercase tracking-widest mb-8">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <Link href="#" className="text-white/30 text-[14px] font-bold hover:text-[#D4AF37] transition-colors">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/20 text-[12px] font-bold">© 2026 DOCMATCH BRASIL LTDA. TODOS OS DIREITOS RESERVADOS.</p>
                    <div className="flex gap-6">
                        {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                            <Link key={social} href="#" className="text-white/20 hover:text-white transition-colors text-[12px] font-black uppercase tracking-widest">{social}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </main>
    )
}
