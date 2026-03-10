'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreVertical, CheckCheck, Camera, Phone, Video, ArrowLeft, Send, Paperclip, Smile, Mic } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { toast } from 'sonner'

// Padrão de fundo em SVG com símbolos médicos (estetoscópio, pílula, coração, cruz verde simplificados)
const bgPattern = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231A365D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.05'%3E%3Cpath d='M20 20v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4z'/%3E%3Cpath d='M80 80v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4z'/%3E%3Crect x='60' y='20' width='16' height='8' rx='4' transform='rotate(45 68 24)'/%3E%3Crect x='20' y='80' width='16' height='8' rx='4' transform='rotate(-45 28 84)'/%3E%3Cpath d='M100 30a6 6 0 0 0-12 0c0 7 12 16 12 16s12-9 12-16a6 6 0 0 0-12 0z'/%3E%3Cpath d='M40 90a6 6 0 0 0-12 0c0 7 12 16 12 16s12-9 12-16a6 6 0 0 0-12 0z'/%3E%3Cpath d='M30 40 A10 10 0 0 1 50 40 L50 60 A5 5 0 0 1 40 60 L40 50'/%3E%3Cpath d='M90 100 A10 10 0 0 1 110 100 L110 120 A5 5 0 0 1 100 120 L100 110'/%3E%3C/g%3E%3C/svg%3E")`

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
    const [inputValue, setInputValue] = useState('')

    // Gerenciamento de mensagens para o chat interativo
    const [msgsPorChat, setMsgsPorChat] = useState<Record<string, { id: string, text: string, sender: 'user' | 'other', time: string }[]>>({
        '1': [
            { id: 'm1', text: 'Tudo bem, nos vemos amanhã às 10h.', sender: 'other', time: '14:30' },
            { id: 'm2', text: 'Perfeito, obrigado doutor!', sender: 'user', time: '14:35' },
        ],
        '2': [
            { id: 'm3', text: 'A receita já está disponível no seu perfil.', sender: 'other', time: '12:15' },
        ],
        '3': [
            { id: 'm4', text: 'Como posso ajudar com seu agendamento?', sender: 'other', time: 'Ontem' },
        ]
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [viewChat, msgsPorChat])

    // Função para tocar som de 'Plop' via Web Audio API
    const playSound = (type: 'send' | 'receive') => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === 'send') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else {
                // Som duplo rápido para recebimento
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.setValueAtTime(800, now + 0.05);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            console.error("Audio blocked by browser policy without active interaction.", e)
        }
    }

    const handleSend = () => {
        if (!inputValue.trim() || !viewChat) return;

        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        const newMsg = { id: Date.now().toString(), text: inputValue, sender: 'user' as const, time }

        setMsgsPorChat(prev => ({
            ...prev,
            [viewChat]: [...(prev[viewChat] || []), newMsg]
        }))
        setInputValue('')
        playSound('send')

        // Mock recebimento de resposta após 1.5s
        setTimeout(() => {
            const autoReply = {
                id: (Date.now() + 1).toString(),
                text: 'Mensagem automática: Estou em atendimento no momento. Responderei em breve.',
                sender: 'other' as const,
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }
            setMsgsPorChat(prev => ({
                ...prev,
                [viewChat]: [...(prev[viewChat] || []), autoReply]
            }))
            playSound('receive')
            toast.info('Nova mensagem recebida!')
        }, 1500)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend()
    }

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        const msgs = msgsPorChat[viewChat] || []

        return (
            <div className="flex flex-col h-screen" style={{ backgroundColor: '#E2E8F0', backgroundImage: bgPattern, backgroundAttachment: 'fixed' }}>
                {/* Header Chat - Nome DocZap modificado */}
                <header className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-4 py-3 flex items-center justify-between text-white shadow-[0_4px_20px_rgba(26,54,93,0.3)] z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setViewChat(null)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors active:scale-90">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <Avatar className="w-10 h-10 border border-white/20 shadow-md">
                            <AvatarImage src={chatAtivo.foto} />
                            <AvatarFallback>{chatAtivo.nome[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-[15px] leading-tight drop-shadow-sm">{chatAtivo.nome}</span>
                            </div>
                            <span className="text-[11px] text-[#D4AF37] font-medium">{chatAtivo.online ? 'online' : 'visto por último hoje'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/90">
                        <Video className="w-5 h-5 hover:text-white transition-colors cursor-pointer" onClick={() => toast.info('Videochamada indisponível no plano atual.')} />
                        <Phone className="w-5 h-5 hover:text-white transition-colors cursor-pointer" onClick={() => toast.info('Chamada de voz conectando...')} />
                        <MoreVertical className="w-5 h-5 cursor-pointer" />
                    </div>
                </header>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-6 relative z-0 backdrop-blur-[2px]">
                    <div className="flex justify-center mb-4">
                        <span className="bg-[#1A365D]/10 backdrop-blur-md border border-white/40 text-[#1A365D] text-[10px] px-3 py-1.5 rounded-2xl uppercase font-black tracking-widest shadow-sm">DocZap Conectado de ponta a ponta</span>
                    </div>

                    {msgs.map((msg) => (
                        <div key={msg.id} className={`flex flex-col items-${msg.sender === 'user' ? 'end' : 'start'} max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                            <div className={`p-3 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[14.5px] font-medium relative ${msg.sender === 'user'
                                ? 'bg-gradient-to-br from-[#E2C358] to-[#D4AF37] text-[#1A365D] rounded-tr-sm border border-[#CBA035]'
                                : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold mt-1 pl-1 pr-1 flex items-center gap-1">
                                {msg.time}
                                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500 inline" />}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-[#F1F5F9] border-t border-slate-200/60 pb-8 flex items-end gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10 shrink-0 relative">
                    <button className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors mb-0.5"><Smile className="w-6 h-6" /></button>
                    <button className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors mb-0.5"><Paperclip className="w-6 h-6" /></button>
                    <div className="flex-1 relative">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Mensagem"
                            rows={1}
                            className="w-full bg-white rounded-[24px] py-3 px-5 text-[15px] outline-none border border-slate-200 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none overflow-hidden min-h-[46px] flex items-center"
                        />
                    </div>
                    {inputValue.trim() ? (
                        <button onClick={handleSend} className="bg-[#2D5284] text-white p-3.5 mb-0.5 rounded-full shadow-[0_4px_10px_rgba(45,82,132,0.3)] active:scale-90 transition-transform flex items-center justify-center">
                            <Send className="w-5 h-5 ml-1" />
                        </button>
                    ) : (
                        <button className="bg-[#2D5284] text-white p-3.5 mb-0.5 rounded-full shadow-[0_4px_10px_rgba(45,82,132,0.3)] active:scale-90 transition-transform flex items-center justify-center">
                            <Mic className="w-5 h-5 fill-current" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] pb-24 font-sans">
            {/* Header Lista com o nome solicitado: DocZap */}
            <header className="bg-gradient-to-br from-[#1A365D] to-[#2D5284] px-5 pt-8 pb-8 rounded-b-[40px] shadow-[0_15px_40px_rgba(26,54,93,0.3)] relative z-20 ring-1 ring-white/10">
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h1 className="text-white font-black text-2xl tracking-tight drop-shadow-md">
                        Doc<span className="text-[#D4AF37]">Zap</span> <span className="text-sm border border-[#D4AF37]/50 rounded-full px-2 text-[#D4AF37] font-bold bg-[#D4AF37]/10 tracking-widest uppercase ml-1 align-middle">Premium</span>
                    </h1>
                    <div className="flex gap-4">
                        <button className="text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors shadow-sm active:scale-95"><Camera className="w-5 h-5" /></button>
                        <button className="text-white bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors shadow-sm active:scale-95"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="relative z-10">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" strokeWidth={2.5} />
                    <input
                        placeholder="Buscar consulta, médico ou mensagem..."
                        className="w-full bg-white rounded-[24px] py-4 pl-12 pr-4 text-[14px] font-bold text-slate-600 shadow-[0_4px_20px_rgba(0,0,0,0.08)] outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-slate-400 border border-white"
                    />
                </div>
            </header>

            {/* Lista de Conversas - Relevo 3D nos cards, mantendo grid do app intacto */}
            <main className="px-5 space-y-4 pt-10">
                {conversasMock.map((conversa) => {
                    const ultMsg = msgsPorChat[conversa.id] ? msgsPorChat[conversa.id][msgsPorChat[conversa.id].length - 1] : { text: '', time: conversa.horario }
                    return (
                        <button
                            key={conversa.id}
                            onClick={() => setViewChat(conversa.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-[28px] bg-white border border-slate-100 transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden"
                            style={{
                                boxShadow: '0 8px 24px -6px rgba(26,54,93,0.1), 0 4px 10px -4px rgba(26,54,93,0.06), inset 0 2px 4px rgba(255,255,255,1)'
                            }}
                        >
                            <div className="relative shrink-0">
                                <Avatar className="w-16 h-16 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-300">
                                    <AvatarImage src={conversa.foto} className="object-cover" />
                                    <AvatarFallback className="bg-slate-100 text-[#1A365D] font-bold text-xl">{conversa.nome[0]}</AvatarFallback>
                                </Avatar>
                                {conversa.online && (
                                    <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm"></span>
                                )}
                            </div>
                            <div className="flex-1 text-left min-w-0 pr-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-black text-[#1A365D] text-[15.5px] leading-tight truncate tracking-tight">{conversa.nome}</h3>
                                    <span className={conversa.naoLidas > 0 ? "text-[11px] font-black text-[#D4AF37] whitespace-nowrap" : "text-[11px] font-bold text-slate-400 whitespace-nowrap"}>
                                        {ultMsg.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pr-1">
                                    <p className={`text-[13px] truncate pr-4 ${conversa.naoLidas > 0 ? 'text-[#1A365D] font-extrabold' : 'text-slate-500 font-medium'}`}>
                                        {ultMsg.text || conversa.ultimaMensagem}
                                    </p>
                                    {conversa.naoLidas > 0 ? (
                                        <div className="bg-[#D4AF37] text-[#1A365D] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(212,175,55,0.6)] shrink-0">
                                            {conversa.naoLidas}
                                        </div>
                                    ) : (
                                        <CheckCheck className="w-4 h-4 text-blue-400 shrink-0" strokeWidth={3} />
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </main>

            {/* BottomNav original para não quebrar layout da porta 3001 */}
            <BottomNav activeTab="mensagens" />
        </div>
    )
}
