'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreVertical, CheckCheck, Camera, Phone, Video, ArrowLeft, Send, Paperclip, Smile } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'

const conversasMock = [
    {
        id: '1',
        nome: 'Dr. Lucas Pereira',
        ultimaMensagem: 'Tudo bem, nos vemos amanhã às 10h.',
        horario: '14:30',
        naoLidas: 2,
        foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop',
        online: true
    },
    {
        id: '2',
        nome: 'Dra. Ana Silva',
        ultimaMensagem: 'A receita já está disponível no seu perfil.',
        horario: '12:15',
        naoLidas: 0,
        foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
        online: false
    },
    {
        id: '3',
        nome: 'Suporte DocMatch',
        ultimaMensagem: 'Como posso ajudar com seu agendamento?',
        horario: 'Ontem',
        naoLidas: 0,
        foto: 'https://i.pravatar.cc/150?u=support',
        online: true
    }
]

export default function MensagensPage() {
    const router = useRouter()
    const [viewChat, setViewChat] = useState<string | null>(null)

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        return (
            <div className="flex flex-col h-screen bg-[#E2E8F0]">
                {/* Header Chat */}
                <header className="bg-[#2D5284] px-4 py-3 flex items-center justify-between text-white shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setViewChat(null)}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <Avatar className="w-10 h-10 border border-white/20">
                            <AvatarImage src={chatAtivo.foto} />
                            <AvatarFallback>{chatAtivo.nome[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm leading-tight">{chatAtivo.nome}</span>
                            <span className="text-[10px] text-white/70">{chatAtivo.online ? 'online' : 'visto por último hoje'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/90">
                        <Video className="w-5 h-5" />
                        <Phone className="w-5 h-5" />
                        <MoreVertical className="w-5 h-5" />
                    </div>
                </header>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50" style={{ backgroundImage: 'radial-gradient(#2D528410 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    <div className="flex justify-center">
                        <span className="bg-white/80 text-slate-500 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider shadow-sm">Hoje</span>
                    </div>

                    <div className="flex flex-col items-end space-y-1 max-w-[85%] ml-auto">
                        <div className="bg-[#D4AF37] text-[#1A365D] p-3 rounded-2xl rounded-tr-none shadow-sm text-sm font-medium">
                            Olá Dr. Lucas, gostaria de confirmar o endereço da clínica para amanhã.
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold">14:28 • lida</span>
                    </div>

                    <div className="flex flex-col items-start space-y-1 max-w-[85%]">
                        <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium border border-blue-100">
                            {chatAtivo.ultimaMensagem}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold">{chatAtivo.horario}</span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    <button className="text-slate-400 p-2"><Smile className="w-6 h-6" /></button>
                    <button className="text-slate-400 p-2"><Paperclip className="w-6 h-6" /></button>
                    <div className="flex-1 relative">
                        <input
                            placeholder="Escreva sua mensagem..."
                            className="w-full bg-slate-100 rounded-full py-3 px-5 text-sm outline-none focus:ring-1 focus:ring-[#2D5284]/30"
                        />
                    </div>
                    <button className="bg-[#2D5284] text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Lista */}
            <header className="bg-[#2D5284] px-5 pt-8 pb-6 rounded-b-3xl shadow-lg relative z-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white font-black text-2xl tracking-tight">Conversas</h1>
                    <div className="flex gap-4">
                        <button className="text-white/80"><Camera className="w-5 h-5" /></button>
                        <button className="text-white/80"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        placeholder="Buscar médico ou conversa..."
                        className="w-full bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-medium shadow-inner outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    />
                </div>
            </header>

            {/* Lista de Conversas */}
            <main className="p-4 space-y-1 pt-6">
                {conversasMock.map((conversa) => (
                    <button
                        key={conversa.id}
                        onClick={() => setViewChat(conversa.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-white transition-all active:scale-[0.98] group"
                    >
                        <div className="relative">
                            <Avatar className="w-14 h-14 border-2 border-white shadow-sm group-hover:border-blue-100 transition-colors">
                                <AvatarImage src={conversa.foto} />
                                <AvatarFallback>{conversa.nome[0]}</AvatarFallback>
                            </Avatar>
                            {conversa.online && (
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-50"></span>
                            )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{conversa.nome}</h3>
                                <span className={conversa.naoLidas > 0 ? "text-[10px] font-bold text-[#D4AF37]" : "text-[10px] font-medium text-slate-400"}>
                                    {conversa.horario}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pr-2">
                                <p className="text-[13px] text-slate-500 font-medium truncate pr-4">{conversa.ultimaMensagem}</p>
                                {conversa.naoLidas > 0 ? (
                                    <span className="bg-[#D4AF37] text-[#1A365D] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                        {conversa.naoLidas}
                                    </span>
                                ) : (
                                    <CheckCheck className="w-4 h-4 text-blue-400" />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </main>

            <BottomNav activeTab="mensagens" />
        </div>
    )
}
