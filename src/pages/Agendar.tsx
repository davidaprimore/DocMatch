import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, ArrowLeft, ChevronRight, Zap, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/BottomNav';

export function Agendar() {
    const navigate = useNavigate();

    const favoritos = [
        {
            nome: 'Dra. Luana',
            especialidade: 'Dermatologia',
            local: 'RJ',
            rating: 4.9,
            foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
        },
        {
            nome: 'Dr. Roberto',
            especialidade: 'Clínico Geral',
            local: 'SP',
            rating: 4.8,
            foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop',
        },
        {
            nome: 'Dra. Fernanda',
            especialidade: 'Cardiologia',
            local: 'PR',
            rating: 5.0,
            foto: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=150&auto=format&fit=crop',
        },
    ];

    const filtros = ['Especialidade', 'Data', 'Avaliação', '📍 Localização (RJ)'];

    const medicos = [
        {
            nome: 'Dra. Beatriz Luz',
            especialidade: 'Dermatologia',
            rating: 5,
            local: 'Ipanema, RJ',
            slot: { dia: 'HOJE', hora: '16:30', tipo: 'rapido' },
            foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
        },
        {
            nome: 'Dr. André Santos',
            especialidade: 'Clínico Geral',
            rating: 5,
            local: 'Copacabana, RJ',
            slot: { dia: 'SEGUNDA', hora: '10:00', tipo: 'normal' },
            foto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* HEADER AZUL PREMIUM COM BUSCA SOBREPOSTA */}
            <header className="bg-[#2D5284] px-5 pt-5 pb-8 rounded-b-3xl shadow-md relative z-20 mb-6">
                {/* Topo com Voltar e Título */}
                <div className="flex items-center gap-4 mb-5">
                    <button onClick={() => navigate(-1)} className="text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-white font-bold text-[18px]">Agendar Consulta</h1>
                </div>

                <div className="flex justify-between items-center mb-2">
                    {/* Avatar e Olá */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="w-11 h-11 border border-white/20 shadow-sm">
                                <AvatarImage src={'https://i.pravatar.cc/150?u=joce'} />
                                <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white">JM</AvatarFallback>
                            </Avatar>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#2D5284]"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white/80 text-[11px] font-bold tracking-wider uppercase">Olá,</span>
                            <span className="text-white text-[15px] font-bold leading-tight">Jóce Moreno</span>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-[18px] font-bold text-white">Doc</span>
                        <span className="text-[18px] font-bold text-[#D4AF37]">Match</span>
                    </div>
                </div>

                {/* BUSCA - OVERLAPPING */}
                <div className="absolute left-5 right-5 -bottom-6 z-30">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por especialidade ou sintoma..."
                        className="w-full bg-white border border-gray-100 rounded-[20px] py-[15px] flex items-center pr-12 shadow-[0_8px_20px_rgba(45,82,132,0.15)] focus:ring-0 text-[13px] font-medium text-slate-600 outline-none placeholder:text-slate-400"
                        style={{ paddingLeft: '3rem' }}
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </div>
            </header>

            <main className="px-4 pt-5 pb-6 space-y-5">

                {/* MEUS FAVORITOS */}
                <section>
                    <h3 className="font-bold text-[#1A365D] text-[13px] tracking-widest uppercase mb-2.5 px-1">Meus Favoritos</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-4 px-5">
                        {favoritos.map((fav, i) => (
                            <div key={i} className="flex-shrink-0 w-[140px] bg-white rounded-[24px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center relative">
                                <button className="absolute top-3 right-3 text-red-500">
                                    <Heart className="w-4 h-4 fill-current" />
                                </button>
                                <img src={fav.foto} className="w-[60px] h-[60px] rounded-full object-cover mb-3 border-2 border-slate-50" alt={fav.nome} />
                                <h4 className="font-bold text-[14px] text-slate-800 text-center w-full truncate">{fav.nome}</h4>
                                <p className="text-[11px] text-slate-500 font-medium text-center">{fav.especialidade}</p>
                                <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-500 w-full">
                                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {fav.local}</div>
                                    <div className="flex items-center gap-1"><Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /> {fav.rating}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FILTRAR POR */}
                <section>
                    <h3 className="font-bold text-[#1A365D] text-[13px] tracking-widest uppercase mb-2 px-1">Filtrar Por</h3>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-5">
                        {filtros.map((filtro, i) => (
                            <button key={i} className={`flex-shrink-0 px-4 py-2 rounded-full border text-[12px] font-semibold whitespace-nowrap transition-colors ${i === 3 ? 'border-[#2D5284] text-[#2D5284] bg-[#2D5284]/5' : 'border-slate-300 text-slate-600 bg-white hover:border-slate-400'}`}>
                                {filtro}
                            </button>
                        ))}
                    </div>
                </section>

                {/* MÉDICOS DISPONÍVEIS */}
                <section>
                    <h3 className="font-bold text-[#1A365D] text-[13px] tracking-widest uppercase mb-2 px-1">Médicos Disponíveis</h3>
                    <div className="space-y-3">
                        {medicos.map((med, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 relative mb-3">
                                <button className="absolute right-4 top-4 text-slate-400">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="flex gap-4">
                                    <img src={med.foto} className="w-[64px] h-[64px] rounded-full object-cover border-2 border-slate-50 flex-shrink-0" alt={med.nome} />
                                    <div className="pr-6">
                                        <h4 className="font-bold text-[16px] text-slate-800 leading-tight">{med.nome}</h4>
                                        <p className="text-[13px] text-slate-500 mb-1">({med.especialidade})</p>
                                        <div className="flex gap-0.5 mb-2">
                                            {[...Array(med.rating)].map((_, j) => (
                                                <Star key={j} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-[12px] text-slate-500 font-medium pb-1 mt-3">
                                            <MapPin className="w-4 h-4 ml-[-2px]" /> {med.local}
                                        </div>
                                    </div>
                                </div>

                                {/* Slot Card Posicionado */}
                                <div className="absolute right-4 bottom-4 w-[85px]">
                                    <div className={`rounded-[12px] border ${med.slot.tipo === 'rapido' ? 'border-[#D4AF37]/50 bg-[#FFFBF0]' : 'border-slate-200 bg-slate-50'} overflow-hidden shadow-sm`}>
                                        <div className="py-1.5 px-2 text-center border-b border-black/5">
                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{med.slot.dia}</div>
                                            <div className="text-[16px] font-black text-[#1A365D] leading-none">{med.slot.hora}</div>
                                        </div>
                                        {med.slot.tipo === 'rapido' && (
                                            <div className="bg-[#D4AF37]/20 py-1 flex justify-center items-center gap-1">
                                                <Zap className="w-2.5 h-2.5 text-[#B8860B] fill-current" />
                                                <span className="text-[8px] font-bold text-[#B8860B] uppercase">Slot Rápido</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Banner Telemedicina (Botão extra como no mockup) */}
                    <button className="w-full mt-2 bg-white rounded-[16px] p-3 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/80 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#EEF2F6] flex items-center justify-center mr-3 flex-shrink-0 text-[#2D5284]">
                            <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-bold text-[15px] text-[#1A365D]">Telemedicina Agora</h4>
                            <p className="text-[11px] text-slate-500">Prioridade ilimitada para subscritores premium</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>

                </section>
            </main>

            <BottomNav />
        </div>
    );
}
