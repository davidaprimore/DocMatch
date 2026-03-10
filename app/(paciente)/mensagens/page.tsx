'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreVertical, CheckCheck, Camera, Phone, Video, ArrowLeft, Send, Paperclip, Smile, Mic, Bell, X, Square } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { toast } from 'sonner'

// Novo Padrão de fundo SVG sugerido: tom de gelo (#F1F5F9) com ícones médicos wireframe sutis e distribuídos
const bgPattern = `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%232D5284' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='0.12'%3E%3Cpath d='M30,40 a10,10 0 0,1 20,0 c0,10 -10,18 -10,18 c0,0 -10,-8 -10,-18 z'/%3E%3Cpath d='M90,30 h8 v-8 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 z'/%3E%3Crect x='150' y='50' width='12' height='30' rx='6' transform='rotate(45 156 65)'/%3E%3Cline x1='146' y1='65' x2='166' y2='65' transform='rotate(45 156 65)'/%3E%3Cpath d='M230,40 v15 a15,15 0 0,0 30,0 v-15'/%3E%3Ccircle cx='245' cy='75' r='8'/%3E%3Cpath d='M40,110 v20 a6,6 0 1,0 12,0 v-20 a6,6 0 1,0 -12,0'/%3E%3Cpolyline points='80,120 90,120 95,105 105,135 110,120 120,120'/%3E%3Crect x='140' y='120' width='30' height='15' rx='3' transform='rotate(-30 155 127)'/%3E%3Ccircle cx='155' cy='127' r='2' transform='rotate(-30 155 127)'/%3E%3Cpath d='M220,140 l15,-15 M230,150 l15,-15 M215,135 l8,-8 M240,125 l8,-8'/%3E%3Crect x='215' y='125' width='22' height='8' transform='rotate(-45 226 129)'/%3E%3Cpath d='M200,200 a10,10 0 0,1 20,0 c0,10 -10,18 -10,18 c0,0 -10,-8 -10,-18 z'/%3E%3Cpath d='M260,190 h8 v-8 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 z'/%3E%3Crect x='30' y='210' width='12' height='30' rx='6' transform='rotate(45 36 225)'/%3E%3Cline x1='26' y1='225' x2='46' y2='225' transform='rotate(45 36 225)'/%3E%3Cpath d='M80,200 v15 a15,15 0 0,0 30,0 v-15'/%3E%3Ccircle cx='95' cy='235' r='8'/%3E%3Cpath d='M270,270 v20 a6,6 0 1,0 12,0 v-20 a6,6 0 1,0 -12,0'/%3E%3Cpolyline points='130,280 140,280 145,265 155,295 160,280 170,280'/%3E%3C/g%3E%3C/svg%3E")`

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
    const [showEmojis, setShowEmojis] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const EMOJIS = ['😀', '😂', '❤️', '👍', '🙏', '🩺', '💊', '🩹']

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

    // Lógica para gravação de áudio em tempo real
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRecording) {
            timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
        }
        return () => clearInterval(timer)
    }, [isRecording])

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

    const handleSend = (textOverride?: string) => {
        const text = textOverride || inputValue.trim();
        if (!text || !viewChat) return;

        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        const newMsg = { id: Date.now().toString(), text, sender: 'user' as const, time }

        setMsgsPorChat(prev => ({
            ...prev,
            [viewChat]: [...(prev[viewChat] || []), newMsg]
        }))
        setInputValue('')
        playSound('send')

        // Mock recebimento de resposta após 1.5s (apenas 1 vez por send para não poluir)
        setTimeout(() => {
            const autoReply = {
                id: (Date.now() + 1).toString(),
                text: 'Mensagem automática: Recebi sua mensagem. Retornarei assim que possível.',
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleSend('📎 Arquivo anexado: ' + e.target.files[0].name)
        }
    }

    const handleMicClick = () => {
        if (isRecording) {
            setIsRecording(false)
            handleSend(`🎵 Mensagem de Áudio (0:0${recordingTime > 9 ? recordingTime : '0' + recordingTime})`)
            setRecordingTime(0)
        } else {
            setIsRecording(true)
            setRecordingTime(0)
        }
    }

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        const msgs = msgsPorChat[viewChat] || []

        return (
            <div className="flex flex-col h-screen" style={{ backgroundColor: '#E2E8F0', backgroundImage: bgPattern, backgroundAttachment: 'fixed' }}>
                {/* Header Chat - Nome DocZap modificado */}
                <header className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-4 py-3 flex items-center justify-between text-white shadow-[0_4px_20px_rgba(26,54,93,0.3)] z-20 shrink-0 relative">
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
                    <div className="flex items-center gap-4 text-white/90 relative">
                        <Video className="w-5 h-5 hover:text-white transition-colors cursor-pointer active:scale-90" onClick={() => toast.info('Iniciando videochamada segura...')} />
                        <Phone className="w-5 h-5 hover:text-white transition-colors cursor-pointer active:scale-90" onClick={() => toast.info('Chamada de voz conectando...')} />
                        <MoreVertical className="w-5 h-5 cursor-pointer active:scale-90" onClick={() => setShowMenu(!showMenu)} />
                        {showMenu && (
                            <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 font-medium">
                                <button className="w-full text-left px-4 py-2 text-[14px] hover:bg-slate-50 transition-colors" onClick={() => setShowMenu(false)}>Ver Perfil Profissional</button>
                                <button className="w-full text-left px-4 py-2 text-[14px] hover:bg-slate-50 transition-colors" onClick={() => setShowMenu(false)}>Pesquisar</button>
                                <button className="w-full text-left px-4 py-2 text-[14px] hover:bg-slate-50 transition-colors text-red-500" onClick={() => { setShowMenu(false); toast.success('Conversa silenciada'); }}>Silenciar notificações</button>
                            </div>
                        )}
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
                <div className="p-3 bg-[#F1F5F9] border-t border-slate-200/60 pb-8 flex items-end gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20 shrink-0 relative">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                    {showEmojis && (
                        <div className="absolute bottom-[calc(100%+8px)] left-2 bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl p-2 flex gap-2">
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => { setInputValue(prev => prev + emoji); setShowEmojis(false); }} className="text-xl hover:scale-110 transition-transform">{emoji}</button>
                            ))}
                        </div>
                    )}

                    {!isRecording && (
                        <>
                            <button onClick={() => setShowEmojis(!showEmojis)} className={`p-2 rounded-full transition-colors mb-0.5 active:scale-90 ${showEmojis ? 'text-blue-500 bg-blue-50' : 'text-slate-500 hover:bg-slate-200'}`}><Smile className="w-6 h-6" /></button>
                            <button onClick={() => fileInputRef.current?.click()} className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors mb-0.5 active:scale-90"><Paperclip className="w-6 h-6" /></button>
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
                        </>
                    )}

                    {isRecording && (
                        <div className="flex-1 bg-white rounded-[24px] border border-red-200 shadow-sm min-h-[46px] flex items-center px-5 mb-0.5 gap-3 animate-pulse">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <span className="text-red-500 font-bold text-[14px]">
                                Gravando 0:0{recordingTime > 9 ? recordingTime : `0${recordingTime}`}
                            </span>
                        </div>
                    )}

                    {inputValue.trim() && !isRecording ? (
                        <button onClick={() => handleSend()} className="bg-[#2D5284] text-white p-3.5 mb-0.5 rounded-full shadow-[0_4px_10px_rgba(45,82,132,0.3)] active:scale-90 transition-transform flex items-center justify-center">
                            <Send className="w-5 h-5 ml-1" />
                        </button>
                    ) : (
                        <button onClick={handleMicClick} className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2D5284] hover:bg-[#1A365D]'} text-white p-3.5 mb-0.5 rounded-full shadow-[0_4px_10px_rgba(45,82,132,0.3)] active:scale-90 transition-all flex items-center justify-center`}>
                            {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5 fill-current" />}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] pb-24 font-sans">
            {/* Header Lista estilo Dashboard (Clean, Foco na Busca) */}
            <header className="bg-[#2D5284] px-5 pt-5 pb-8 rounded-b-[24px] shadow-sm relative z-20 mb-8 font-sans">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-white text-[19px] font-bold leading-tight">Joce Moreno</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-[#1A365D]/30 px-2 py-0.5 rounded-full border border-white/10 mb-[2px]">
                                <span className="text-[14px] font-bold text-[#D4AF37]">Doc</span>
                                <span className="text-[14px] font-bold text-white ml-[1px]">Zap</span>
                            </div>
                            <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest mr-1">Premium</span>
                        </div>
                        <Avatar className="w-12 h-12 border border-white/10 shadow-sm">
                            <AvatarImage src="https://i.pravatar.cc/150?u=joce" />
                            <AvatarFallback className="bg-[#1A365D] text-white">JM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* BUSCA OVERLAPPING */}
                <div className="absolute left-5 right-5 -bottom-6 z-30">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Pesquise por mensagem ou pessoa..."
                        className="w-full bg-white border-0 rounded-[16px] py-[15px] flex items-center pl-12 pr-12 shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus:ring-0 text-[14px] font-medium text-slate-600 outline-none placeholder:text-slate-400"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] opacity-80 hover:opacity-100 transition-opacity">
                        <Mic className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                </div>
            </header>

            {/* Lista de Conversas - Relevo 3D nos cards, mantendo grid do app intacto */}
            <main className="px-5 space-y-2 pt-6">
                {conversasMock.map((conversa) => {
                    const ultMsg = msgsPorChat[conversa.id] ? msgsPorChat[conversa.id][msgsPorChat[conversa.id].length - 1] : { text: '', time: conversa.horario }
                    return (
                        <button
                            key={conversa.id}
                            onClick={() => setViewChat(conversa.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-[20px] bg-white border border-slate-100 transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden"
                            style={{
                                boxShadow: '0 4px 15px -4px rgba(26,54,93,0.08), 0 2px 6px -2px rgba(26,54,93,0.04), inset 0 2px 4px rgba(255,255,255,1)'
                            }}
                        >
                            <div className="relative shrink-0 mr-1 pl-1">
                                <Avatar className="w-16 h-16 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-300">
                                    <AvatarImage src={conversa.foto} className="object-cover" />
                                    <AvatarFallback className="bg-slate-100 text-[#1A365D] font-bold text-xl">{conversa.nome[0]}</AvatarFallback>
                                </Avatar>
                                {conversa.online && (
                                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-[2.5px] border-white shadow-sm z-10"></span>
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
