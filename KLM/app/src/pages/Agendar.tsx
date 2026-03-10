import { useState } from 'react';
import { ChevronLeft, Search, MapPin, Star, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

export function Agendar() {
    const [step, setStep] = useState(1);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

    const specialties = [
        { name: 'Cardiologia', icon: '❤️' },
        { name: 'Clínica Médica', icon: '🩺' },
        { name: 'Pediatria', icon: '🧸' },
        { name: 'Dermatologia', icon: '✨' },
        { name: 'Ortopedia', icon: '🦴' },
        { name: 'Psiquiatria', icon: '🧠' },
    ];

    const doctors = [
        {
            nome: 'Dra. Ana Silva',
            especialidade: 'Dermatologia',
            distancia: '2.5 km',
            rating: 4.9,
            preco: 'R$ 250',
            foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
        },
        {
            nome: 'Dr. Lucas Pereira',
            especialidade: 'Cardiologia',
            distancia: '3.1 km',
            rating: 4.8,
            preco: 'R$ 300',
            foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop',
        },
    ];

    const dates = [
        { dia: 'Seg', data: '15' },
        { dia: 'Ter', data: '16', selected: true },
        { dia: 'Qua', data: '17' },
        { dia: 'Qui', data: '18' },
        { dia: 'Sex', data: '19' },
    ];

    const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E2E8F0] to-[#F1F5F9] pb-20 font-sans flex flex-col">
            {/* Header Premium Flat */}
            <header className="bg-[#2D5284] px-5 pt-12 pb-6 rounded-b-2xl shadow-md sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : window.history.back()}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-[17px] font-bold text-white tracking-wide">
                        {step === 1 ? 'Especialidade' : step === 2 ? 'Profissionais' : 'Data e Hora'}
                    </h1>
                    <div className="w-10 h-10"></div> {/* Spacer balance */}
                </div>

                {/* Progresso UI */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
                </div>
            </header>

            <main className="flex-1 px-5 pt-6 animate-in fade-in zoom-in-95 duration-300">

                {/* PASSO 1: ESPECIALIDADE */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-[20px] font-black text-[#1A365D] leading-tight">
                            O que você está<br />buscando hoje?
                        </h2>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Ex: Cardiologista, Dor de cabeça..."
                                className="w-full bg-white border-0 rounded-[16px] py-[16px] flex items-center pl-12 pr-4 shadow-[0_4px_14px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#D4AF37] text-[14px] font-medium text-slate-600 outline-none"
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 text-[14px] mb-4">Especialidades Frequentes</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {specialties.map((spec, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedSpecialty(spec.name);
                                            setStep(2);
                                        }}
                                        className={`flex items-center gap-3 p-4 rounded-[20px] shadow-sm border transition-all ${selectedSpecialty === spec.name
                                                ? 'bg-[#1A365D] border-[#1A365D]'
                                                : 'bg-white border-slate-100 hover:border-[#D4AF37]'
                                            }`}
                                    >
                                        <span className="text-[20px]">{spec.icon}</span>
                                        <span className={`text-[13px] font-bold ${selectedSpecialty === spec.name ? 'text-white' : 'text-slate-700'}`}>
                                            {spec.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PASSO 2: PROFISSIONAIS */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-[18px] font-black text-[#1A365D]">Especialistas em<br /><span className="text-[#D4AF37]">{selectedSpecialty || 'Cardiologia'}</span></h2>
                            <button className="text-[11px] font-bold text-[#2D5284] px-3 py-1.5 bg-white rounded-full shadow-sm">Filtros</button>
                        </div>

                        <div className="space-y-4 pb-6">
                            {doctors.map((doc, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-[24px] p-4 flex gap-4 items-center shadow-[0_12px_24px_-6px_rgba(26,54,93,0.1)] border border-slate-100"
                                >
                                    <img src={doc.foto} alt={doc.nome} className="w-[72px] h-[72px] rounded-[20px] object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[15px] text-[#1A365D]">{doc.nome}</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5">{doc.especialidade}</p>
                                        <div className="flex gap-3 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                                                <span className="text-[11px] font-bold text-slate-700">{doc.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[11px] font-semibold text-slate-500">{doc.distancia}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[13px] font-black text-[#2D5284]">{doc.preco}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedDoctor(doc.nome);
                                                setStep(3);
                                            }}
                                            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-md text-white"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PASSO 3: DATA E HORA */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-[18px] font-black text-[#1A365D]">Quando você deseja<br />agendar?</h2>

                        {/* Doctor Selected Mini-Card */}
                        <div className="bg-[#1A365D] rounded-[20px] p-3 flex items-center gap-3 shadow-md">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-white">👨‍⚕️</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Profissional Selecionado</p>
                                <p className="text-[14px] font-bold text-white">{selectedDoctor || 'Dr. Lucas Pereira'}</p>
                            </div>
                            <button onClick={() => setStep(2)} className="text-[#D4AF37] text-[11px] font-bold mr-2">Trocar</button>
                        </div>

                        {/* Calendário Smooth Horizontal */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 text-[14px] flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-[#D4AF37]" /> Abril 2026
                                </h3>
                            </div>

                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-5 px-5">
                                {dates.map((d, i) => (
                                    <button
                                        key={i}
                                        className={`min-w-[70px] flex flex-col items-center p-3 rounded-[20px] transition-all ${d.selected
                                                ? 'bg-gradient-to-b from-[#1F3E6D] to-[#12274A] shadow-[0_8px_16px_rgba(26,54,93,0.3)] border-transparent'
                                                : 'bg-white border border-slate-100'
                                            }`}
                                    >
                                        <span className={`text-[11px] font-bold uppercase mb-1 ${d.selected ? 'text-[#D4AF37]' : 'text-slate-400'}`}>{d.dia}</span>
                                        <span className={`text-[20px] font-black ${d.selected ? 'text-white' : 'text-[#1A365D]'}`}>{d.data}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Horários Pílulas */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-[14px] mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#D4AF37]" /> Horários Disponíveis
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {times.map((time, i) => (
                                    <button
                                        key={i}
                                        className={`py-3 rounded-[16px] text-[14px] font-bold transition-all ${i === 1 // hardcoded pre-selected
                                                ? 'bg-[#1A365D] text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#D4AF37]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botão Confirmar Fixado Embaixo */}
                        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#E2E8F0] via-[#E2E8F0] to-transparent z-40">
                            <button className="w-full h-[56px] rounded-[20px] bg-gradient-to-r from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-black text-[15px] shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
                                Confirmar Agendamento
                            </button>
                        </div>
                        {/* Espaço extra para o botão fixed */}
                        <div className="h-20"></div>

                    </div>
                )}
            </main>
        </div>
    );
}
