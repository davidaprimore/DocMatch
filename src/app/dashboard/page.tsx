"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, MapPin, Calendar, ShoppingBag,
    Bell, ChevronRight, Mic, FileText, Scale, Menu, Heart,
    Home, MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// LOGO CUSTOMIZADA EM SVG PARA NÃO DEPENDER DE IMAGEM
const DocMatchLogo = () => (
    <div className="flex items-center">
        <span className="text-2xl font-black italic tracking-tighter text-white drop-shadow-md">Doc</span>
        <span className="text-2xl font-black italic tracking-tighter text-[#D4AF37] ml-0.5 drop-shadow-md">Match</span>
    </div>
);

export default function AssetRichDashboard() {
    const [userName, setUserName] = useState<string>("Visitante");
    const [avatarUrl, setAvatarUrl] = useState<string>("/images/avatar_joce.png");

    const [agendamentos, setAgendamentos] = useState<any[]>([
        {
            id: "fake1",
            data_horario: new Date(new Date().getTime() + 86400000).toISOString(),
            medicos: {
                nome: "Dr. Lucas Pereira",
                foto: "/images/dr_lucas.png",
                especialidades: { nome: "Cardiologia" }
            }
        },
        {
            id: "fake2",
            data_horario: new Date(new Date().getTime() + 172800000).toISOString(),
            medicos: {
                nome: "Dra. Ana Silva",
                foto: "/images/dra_ana.png",
                especialidades: { nome: "Pediatria" }
            }
        }
    ]);

    const [sugeridos] = useState([
        { nome: "Dra. Ana Silva", foto: "/images/dra_ana.png", spec: "Pediatria", stars: 5 },
        { nome: "Dr. André Santos", foto: "/images/dr_andre.png", spec: "Clínico Geral", stars: 4.8 },
        { nome: "Dra. Beatriz Luz", foto: "/images/dra_beatriz.png", spec: "Dermatologia", stars: 4.9 }
    ]);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();

            // 1. Carregar Usuário Real
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else {
                setUserName("Jóce Moreno");
            }

            if (user?.user_metadata?.avatar_url) {
                setAvatarUrl(user.user_metadata.avatar_url);
            }

            // 2. Carregar Agendamentos reais
            const { data: agData } = await supabase
                .from('agendamentos')
                .select(`
                id, data_horario,
                medicos ( nome, foto, especialidades ( nome ) )
            `)
                .order('data_horario', { ascending: true })
                .limit(3);

            if (agData && agData.length > 0) {
                if (agData.length === 1) {
                    // Adiciona um mock se o DB trouxer só 1, para manter o carrossel visível
                    setAgendamentos([...agData, {
                        id: "fake2",
                        data_horario: new Date(new Date().getTime() + 172800000).toISOString(),
                        medicos: { nome: "Dra. Ana Silva", foto: "/images/dra_ana.png", especialidades: { nome: "Pediatria" } }
                    }]);
                } else {
                    setAgendamentos(agData);
                }
            }
        }
        loadData();
    }, []);

    const formatTime = (isoString?: string) => {
        if (!isoString) return "10/03 às 23:37";
        const d = new Date(isoString);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} às ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] text-[#1E293B] font-sans pb-[100px] overflow-x-hidden max-w-md mx-auto shadow-2xl relative border-x border-slate-200">

            {/* 1. HEADER - Slim e Curvado usando SVG Logo */}
            <header className="bg-[#2D5284] px-6 pt-10 pb-12 rounded-b-[50px] shadow-2xl relative z-20">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={avatarUrl}
                                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg object-cover bg-white"
                                alt="Profile"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#2D5284] rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">Olá,</p>
                            <h1 className="text-xs font-bold text-white tracking-tight leading-none">{userName}</h1>
                        </div>
                    </div>
                    <DocMatchLogo />
                </div>

                {/* BUSCA COM DESIGN DO MOCKUP */}
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por especialidade ou sintoma..."
                        className="w-full bg-white border-none rounded-2xl py-4 flex items-center pr-12 shadow-[0_15px_30px_rgba(0,0,0,0.1)] focus:ring-0 text-sm font-medium"
                        style={{ paddingLeft: '3.25rem' }}
                    />
                    <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
                </div>
            </header>

            <main className="px-6 -mt-6 space-y-8 relative z-30">

                {/* 2. WIDGET ECONOMIA - Versão CSS Puro Tailwind Arbitrary Values */}
                <div className="bg-gradient-to-r from-[#D4AF37] via-[#FDF5E6] to-[#D4AF37] p-[1.5px] rounded-2xl shadow-xl">
                    <div className="bg-white/95 backdrop-blur-md rounded-[15px] py-3.5 px-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">💰</span>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none drop-shadow-sm">Economia Acumulada</p>
                        </div>
                        <p className="text-sm font-black text-[#B8860B] drop-shadow-sm">R$ 450,00</p>
                    </div>
                </div>

                {/* 4. MENU DE ACESSO RÁPIDO - Ícones Estilizados */}
                <section className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Agendar', icon: <Calendar size={22} />, color: 'bg-white text-blue-600' },
                        { label: 'Receitas', icon: <FileText size={22} />, color: 'bg-white text-slate-600' },
                        { label: 'Comparador', icon: <Scale size={22} />, color: 'bg-white text-slate-600' },
                        { label: 'Cesta', icon: <ShoppingBag size={22} />, color: 'bg-[#1A365D] text-[#D4AF37]' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`w-14 h-14 ${item.color} rounded-[24px] flex items-center justify-center shadow-sm border border-slate-100`}>
                                {item.icon}
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                        </div>
                    ))}
                </section>

                {/* 3. AGENDAMENTOS - Carrossel de Alta Fidelidade */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest">Agendamentos Pendentes</h3>
                        <button className="text-[10px] font-black text-[#D4AF37] uppercase">Mostrar todos</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x -mx-2 px-2">
                        {agendamentos.map((ag, i) => (
                            <div key={i} className="min-w-[85%] snap-center bg-white rounded-[35px] p-5 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-50">
                                <img src={ag.medicos?.foto || '/images/dr_lucas.png'} className="w-14 h-14 rounded-2xl object-cover bg-slate-50" alt={ag.medicos?.nome} />
                                <div className="flex-1">
                                    <h4 className="font-black text-sm text-slate-800">{ag.medicos?.nome}</h4>
                                    <p className="text-[11px] text-slate-400 font-medium">{ag.medicos?.especialidades?.nome || 'Especialista'} • {formatTime(ag.data_horario)}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-full">
                                    <ChevronRight size={18} className="text-slate-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. BANNER PREMIUM - CSS Puro de Alta Fidelidade */}
                <section className="bg-gradient-to-br from-[#1A365D] to-[#2D5284] rounded-[40px] p-8 text-white shadow-[0_25px_50px_rgba(26,54,93,0.3)] relative overflow-hidden border border-white/10 mt-6 mb-2">
                    <div className="relative z-10">
                        <h2 className="text-xl font-black mb-1 italic tracking-tight">DocMatch Premium</h2>
                        <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] mb-7">Upgrade para economizar mais</p>
                        <button className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F6AD55] to-[#D4AF37] text-[#1A365D] font-black text-[11px] py-4.5 rounded-[22px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                            Assine Agora! - R$ 29,90/mês
                        </button>
                    </div>
                    {/* Círculos de luz decorativos em vez de imagem externa */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                </section>

                {/* 6. MÉDICOS SUGERIDOS */}
                <section className="space-y-4 pt-1 pb-6 relative z-10">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest">Sugeridos para Você</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 snap-x">
                        {sugeridos.map((doc, i) => (
                            <div key={i} className="min-w-[130px] snap-center bg-white rounded-[28px] p-4 flex flex-col items-center relative shadow-sm border border-slate-50">
                                <button className="absolute top-4 right-4 text-slate-300">
                                    <Heart size={16} />
                                </button>
                                <img src={doc.foto} className="w-[64px] h-[64px] rounded-full object-cover border-4 border-slate-50 mb-3" alt={doc.nome} />
                                <h4 className="font-black text-[13px] text-slate-800 text-center leading-tight">{doc.nome}</h4>
                                <p className="text-[10px] text-slate-400 font-medium text-center mt-1">{doc.spec}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* 6. NAVBAR DE VIDRO CHAPADA NA BASE - 80% Branco Opaco com Ícones Mockup */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[100] pb-0">
                <div className="bg-white/80 backdrop-blur-2xl border-t border-white/50 rounded-t-[40px] h-[90px] flex items-center justify-around px-3 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] pointer-events-auto pt-2 pb-4">
                    {[
                        {
                            label: 'Início',
                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 12h3v9h14v-9h3L12 3z" /></svg>
                        },
                        {
                            label: 'Buscar',
                            icon: <Search size={24} strokeWidth={2} />
                        },
                        {
                            label: 'Mensagens',
                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        },
                        {
                            label: 'Atividades',
                            icon: <Bell size={24} strokeWidth={2} />
                        },
                        {
                            label: 'Menu',
                            icon: <Menu size={24} strokeWidth={2} />
                        },
                    ].map((item, i) => (
                        <button key={i} className={`flex flex-col items-center gap-1.5 px-3 pt-2 ${i === 0 ? 'text-[#2D5284]' : 'text-[#8AA1BD] hover:text-[#2D5284]'} transition-colors cursor-pointer`}>
                            {item.icon}
                            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #E2E8F0; }
      `}</style>
        </div>
    );
}
