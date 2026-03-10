'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreVertical, CheckCheck, Camera, Phone, Video, ArrowLeft, Send, Paperclip, Mic, X, Square, Reply, Heart, ThumbsUp, Laugh, Frown, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { toast } from 'sonner'

// Fundo exportado via public/
const bgPattern = `url("/fundo-doczap.svg")`

type MsgType = {
    id: string;
    text: string;
    sender: 'user' | 'other';
    time: string;
    date: string;
    audioUrl?: string; // Para áudio real
    replyTo?: MsgType | null;
    reaction?: string;
}

const getTodayStr = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

const conversasMock = [
    {
        id: '1',
        nome: 'Dr. Lucas Pereira',
        horario: '14:30',
        naoLidas: 2,
        foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop',
        online: true
    },
    {
        id: '2',
        nome: 'Dra. Ana Silva',
        horario: '12:15',
        naoLidas: 0,
        foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
        online: false
    },
    {
        id: '3',
        nome: 'Suporte DocMatch',
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

    // Áudio Real
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    // Ações de Mensagem
    const [replyingToMsg, setReplyingToMsg] = useState<MsgType | null>(null)
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null) // Para abrir o menu de reações

    // Double click / Long press timer
    const longPressTimer = useRef<NodeJS.Timeout | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    // Gerenciamento Inteligente de Mensagens
    const [msgsPorChat, setMsgsPorChat] = useState<Record<string, MsgType[]>>({
        '1': [
            { id: 'm0', text: 'Bom dia, não esqueça do seu exame de sangue.', sender: 'other', time: '08:00', date: '6 de Março de 2026' },
            { id: 'm1', text: 'Tudo bem, nos vemos amanhã às 10h.', sender: 'other', time: '14:30', date: getTodayStr() },
            { id: 'm2', text: 'Perfeito, obrigado doutor!', sender: 'user', time: '14:35', date: getTodayStr() },
        ],
        '2': [
            { id: 'm3', text: 'A receita já está disponível no seu perfil.', sender: 'other', time: '12:15', date: getTodayStr() },
        ],
        '3': [
            { id: 'm4', text: 'Como posso ajudar com seu agendamento?', sender: 'other', time: '10:00', date: 'Ontem' },
        ]
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [viewChat, msgsPorChat])

    // Timer do Áudio
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRecording) {
            timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
        }
        return () => clearInterval(timer)
    }, [isRecording])

    const playSound = (type: 'send' | 'receive' | 'reaction') => {
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
            } else if (type === 'receive') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.setValueAtTime(800, now + 0.05);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'reaction') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
        } catch (e) {
            console.error("Audio blocked by browser policy without active interaction.", e)
        }
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                const audioUrl = URL.createObjectURL(audioBlob)
                handleSend('🎶 Áudio', audioUrl)
            }

            mediaRecorder.start()
            setIsRecording(true)
            setRecordingTime(0)
        } catch (err) {
            console.error("Erro ao acessar microfone", err)
            toast.error("Não foi possível acessar o microfone.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            // As tracks devem ser paradas para liberar o uso do microfone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }
    }

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    const handleSend = (textOverride?: string, audioUrl?: string) => {
        const text = textOverride || inputValue.trim();
        if (!text || !viewChat) return;

        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

        const newMsg: MsgType = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            time,
            date: getTodayStr(),
            replyTo: replyingToMsg,
            audioUrl
        }

        setMsgsPorChat(prev => ({
            ...prev,
            [viewChat]: [...(prev[viewChat] || []), newMsg]
        }))

        setInputValue('')
        setReplyingToMsg(null)
        playSound('send')

        if (!audioUrl) {
            // Mock recebimento apenas se for texto
            setTimeout(() => {
                const autoReply: MsgType = {
                    id: (Date.now() + 1).toString(),
                    text: 'Mensagem recebida!',
                    sender: 'other',
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    date: getTodayStr()
                }
                setMsgsPorChat(prev => ({
                    ...prev,
                    [viewChat]: [...(prev[viewChat] || []), autoReply]
                }))
                playSound('receive')
            }, 1500)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleSend('📎 Arquivo anexado: ' + e.target.files[0].name)
        }
    }

    // Ações de Mensagem (Reação e Long Press)
    const handleDoubleClick = (msgId: string) => {
        if (!viewChat) return;
        setMsgsPorChat(prev => {
            const chatMsgs = prev[viewChat].map(msg =>
                msg.id === msgId ? { ...msg, reaction: '❤️' } : msg
            )
            return { ...prev, [viewChat]: chatMsgs }
        })
        playSound('reaction')
        toast.success("Amou essa mensagem!")
    }

    const handlePointerDown = (msgId: string) => {
        longPressTimer.current = setTimeout(() => {
            setActiveMessageId(msgId)
            if (window.navigator.vibrate) window.navigator.vibrate(50) // Haptic feedback leve
        }, 500) // 500ms para long press
    }

    const handlePointerUp = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current)
    }

    const handleAddReaction = (msgId: string, emoji: string) => {
        if (!viewChat) return;
        setMsgsPorChat(prev => {
            const chatMsgs = prev[viewChat].map(msg =>
                msg.id === msgId ? { ...msg, reaction: emoji === msg.reaction ? undefined : emoji } : msg // Toggle reaction
            )
            return { ...prev, [viewChat]: chatMsgs }
        })
        setActiveMessageId(null)
        playSound('reaction')
    }

    const initReply = (msg: MsgType) => {
        setReplyingToMsg(msg)
        setActiveMessageId(null)
    }

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        const msgs = msgsPorChat[viewChat] || []

        return (
            <div className="flex flex-col h-screen" style={{ backgroundColor: '#F1F5F9', backgroundImage: bgPattern, backgroundAttachment: 'fixed' }}>
                {/* Header Chat */}
                <header className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-3 py-2.5 flex items-center gap-2 text-white shadow-[0_2px_10px_rgba(26,54,93,0.3)] z-20 shrink-0 relative">
                    <button onClick={() => setViewChat(null)} className="flex items-center gap-1 hover:bg-white/10 p-1.5 -ml-1 rounded-full transition-colors active:scale-90">
                        <ArrowLeft className="w-6 h-6" />
                        <Avatar className="w-10 h-10 border border-white/10">
                            <AvatarImage src={chatAtivo.foto} />
                            <AvatarFallback>{chatAtivo.nome[0]}</AvatarFallback>
                        </Avatar>
                    </button>

                    <div className="flex flex-col flex-1 pl-1 cursor-pointer" onClick={() => toast.info('Ver perfil do contato')}>
                        <span className="font-bold text-[16px] leading-tight drop-shadow-sm">{chatAtivo.nome}</span>
                        <span className="text-[12.5px] text-zinc-300 font-medium">{chatAtivo.online ? 'online' : 'visto por último hoje'}</span>
                    </div>

                    <div className="flex items-center gap-4 text-white p-1">
                        <Video className="w-[22px] h-[22px] active:scale-90 transition-transform" onClick={() => toast.info('Iniciando videochamada segura...')} />
                        <Phone className="w-[20px] h-[20px] active:scale-90 transition-transform" onClick={() => toast.info('Chamada de voz conectando...')} />
                        <MoreVertical className="w-5 h-5 active:scale-90 transition-transform" />
                    </div>
                </header>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 relative z-0" onClick={() => setActiveMessageId(null)}>
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#FFF8DD] text-slate-700 text-[11px] px-4 py-2 rounded-lg text-center shadow-sm max-w-[90%] border border-[#E8C55E]/40 font-medium">
                            🔒 As mensagens são protegidas com criptografia de ponta a ponta. A DocZap não pode ler ou ouvir o que você envia.
                        </div>
                    </div>

                    {msgs.map((msg, index) => {
                        const isFirstOfDay = index === 0 || msgs[index - 1].date !== msg.date;
                        return (
                            <div key={msg.id}>
                                {isFirstOfDay && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-[#E2E8F0]/90 backdrop-blur-sm text-slate-700 font-bold text-[11px] px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                            {msg.date}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`flex flex-col max-w-[85%] relative ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                    {/* Overlay de Reações */}
                                    {activeMessageId === msg.id && (
                                        <div className={`absolute z-30 -top-12 flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow-xl border border-slate-100 ${msg.sender === 'user' ? 'right-0' : 'left-0'}`}>
                                            {['❤️', '👍', '😂', '😮', '😢', '🙏'].map(emoji => (
                                                <button key={emoji} onClick={(e) => { e.stopPropagation(); handleAddReaction(msg.id, emoji) }} className="text-xl hover:scale-125 transition-transform active:scale-90">{emoji}</button>
                                            ))}
                                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                            <button onClick={(e) => { e.stopPropagation(); initReply(msg) }} className="text-slate-500 hover:text-blue-500 transition-colors p-1"><Reply className="w-5 h-5" /></button>
                                        </div>
                                    )}

                                    {/* Balão de Mensagem */}
                                    <div
                                        onDoubleClick={() => handleDoubleClick(msg.id)}
                                        onPointerDown={() => handlePointerDown(msg.id)}
                                        onPointerUp={handlePointerUp}
                                        onPointerLeave={handlePointerUp}
                                        className={`p-[3px] rounded-2xl shadow-sm relative transition-opacity ${activeMessageId && activeMessageId !== msg.id ? 'opacity-50' : 'opacity-100'} ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-[#E2C358] to-[#D4AF37] text-[#1A365D] rounded-tr-sm border border-[#CBA035]/60'
                                            : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                                            }`}>

                                        {/* Box de Resposta (Quote) */}
                                        {msg.replyTo && (
                                            <div className={`mx-[5px] mt-[5px] mb-[2px] p-2 rounded-xl text-[13px] border-l-4 ${msg.sender === 'user' ? 'bg-[#1A365D]/10 border-[#1A365D]' : 'bg-slate-100 border-[#2D5284]'}`}>
                                                <p className="font-bold text-[11px] mb-0.5 opacity-80">{msg.replyTo.sender === 'user' ? 'Você' : chatAtivo.nome}</p>
                                                <p className="opacity-90 font-medium truncate max-w-[200px]">{msg.replyTo.text}</p>
                                            </div>
                                        )}

                                        <div className="px-3 pt-1.5 pb-2 text-[15px] font-medium leading-[1.3] relative min-w-[70px]">
                                            {msg.audioUrl ? (
                                                <div className="flex items-center gap-2 pt-1 pb-2">
                                                    <Mic className="w-5 h-5 opacity-70" />
                                                    <audio controls src={msg.audioUrl} className="h-8 w-44 rounded-full outline-none" style={{ backgroundColor: 'transparent' }} />
                                                </div>
                                            ) : (
                                                <span className="break-words">{msg.text}</span>
                                            )}

                                            {/* Hora da mensagem flotando no canto inferior */}
                                            <span className={`float-right text-[10px] mt-2.5 -mr-1 ml-3 font-bold flex items-center gap-1 ${msg.sender === 'user' ? 'text-[#1A365D]/80' : 'text-slate-400'}`}>
                                                {msg.time}
                                                {msg.sender === 'user' && <CheckCheck className="w-[14px] h-[14px] text-blue-600 inline" />}
                                            </span>

                                            {/* Reação Exibida */}
                                            {msg.reaction && (
                                                <div className={`absolute -bottom-3 ${msg.sender === 'user' ? '-left-2' : '-right-2'} bg-white text-[10px] rounded-full px-1.5 py-0.5 shadow-md border border-slate-100 z-10`}>
                                                    {msg.reaction}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (WhatsApp Style Simplificado) */}
                <div className="bg-[#F6F6F6] p-2 pb-6 flex items-end gap-2 z-20 shrink-0 relative bg-opacity-95 backdrop-blur-md border-t border-slate-200/60">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />

                    <div className="flex-1 bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col transition-all">

                        {/* Preview de Resposta */}
                        {replyingToMsg && (
                            <div className="bg-slate-50 border-b border-slate-100 p-2 pl-3 flex items-center justify-between">
                                <div className="border-l-4 border-blue-400 pl-2">
                                    <p className="text-[11px] font-bold text-blue-500">{replyingToMsg.sender === 'user' ? 'Respondendo a Você' : chatAtivo.nome}</p>
                                    <p className="text-[12px] text-slate-500 truncate max-w-[200px]">{replyingToMsg.text}</p>
                                </div>
                                <button onClick={() => setReplyingToMsg(null)} className="p-2 text-slate-400 hover:text-red-500 rounded-full active:scale-90"><X className="w-5 h-5" /></button>
                            </div>
                        )}

                        {isRecording ? (
                            <div className="min-h-[46px] flex items-center px-4 gap-3 bg-red-50/50">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-red-500 font-bold text-[15px]">
                                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                                </span>
                                <span className="text-[12px] text-red-400 ml-auto animate-pulse">Deslize para cancelar </span>
                            </div>
                        ) : (
                            <div className="flex items-end min-h-[46px] relative px-1">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Mensagem"
                                    rows={1}
                                    className="w-full bg-transparent py-3 pl-4 pr-24 text-[16px] outline-none resize-none overflow-hidden max-h-[120px] self-center my-auto"
                                    style={{ lineHeight: '1.2' }}
                                />

                                {/* Ações In-Input (Clipe e Câmera) */}
                                <div className="absolute right-2 bottom-1.5 flex gap-1">
                                    <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"><Paperclip className="w-5 h-5 -rotate-45" /></button>
                                    <button onClick={() => cameraInputRef.current?.click()} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"><Camera className="w-[22px] h-[22px]" /></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {inputValue.trim() && !isRecording ? (
                        <button onClick={() => handleSend()} className="bg-[#2D5284] text-white w-[46px] h-[46px] rounded-full shadow-md active:scale-90 transition-transform flex items-center justify-center shrink-0 mb-0.5">
                            <Send className="w-[20px] h-[20px] ml-1" />
                        </button>
                    ) : (
                        <button onClick={handleMicClick} className={`${isRecording ? 'bg-red-500 shadow-red-500/30' : 'bg-[#2D5284]'} text-white w-[46px] h-[46px] rounded-full shadow-md active:scale-90 transition-all flex items-center justify-center shrink-0 mb-0.5`}>
                            {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-[22px] h-[22px] fill-current" />}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // LISTA DE CONVERSAS (WhatsApp Style = Flat, sem cards marginais, cores douradas)
    return (
        <div className="min-h-screen bg-white pb-24 font-sans">
            {/* Header Lista estilo Dashboard (A pedido do usuário) */}
            <header className="bg-gradient-to-br from-[#1A365D] to-[#2D5284] px-5 pt-8 pb-10 rounded-b-[40px] shadow-[0_15px_40px_rgba(26,54,93,0.3)] relative z-20 mb-8 border-b border-white/10 ring-1 ring-white/10">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center">
                        <span className="text-[26px] font-black tracking-tight text-white drop-shadow-sm">Doc<span className="text-[#D4AF37]">Zap</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative text-white hover:text-gray-200 transition-colors bg-white/10 p-2.5 rounded-full shadow-sm active:scale-95" onClick={() => router.push('/notificacoes')}>
                            <Bell strokeWidth={2} className="w-[20px] h-[20px]" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-[#1A365D]"></span>
                        </button>
                        <Avatar className="w-[46px] h-[46px] border-2 border-white/20 shadow-md">
                            <AvatarImage src="https://i.pravatar.cc/150?u=joce" />
                            <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white font-bold">JM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* BUSCA OVERLAPPING */}
                <div className="absolute left-5 right-5 -bottom-7 z-30">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="Pesquise por mensagem ou pessoa..."
                        className="w-full bg-white border-0 rounded-[20px] py-[16px] flex items-center pl-11 pr-4 shadow-[0_8px_24px_rgba(26,54,93,0.15)] focus:ring-2 focus:ring-[#D4AF37]/40 text-[14px] font-bold text-slate-600 outline-none placeholder:text-slate-400 placeholder:font-medium"
                    />
                </div>
            </header>

            {/* Lista Plana (Edge to Edge, sem gaps brutais) */}
            <main className="pt-2">
                <div className="px-5 py-3 flex items-center gap-4 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100" onClick={() => toast.info('Nova Lista de Transmissão ou Grupo de Saúde')}>
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 rotate-180 text-[#2D5284]" />
                    </div>
                    <span className="font-bold text-[16px] text-[#2D5284]">Nova Solicitação Médica</span>
                </div>

                {conversasMock.map((conversa, i) => {
                    const messages = msgsPorChat[conversa.id]
                    const ultMsg = messages ? messages[messages.length - 1] : { text: '', time: conversa.horario }
                    return (
                        <button
                            key={conversa.id}
                            onClick={() => setViewChat(conversa.id)}
                            className="w-full flex items-center px-4 py-3 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
                        >
                            <div className="relative shrink-0 mr-4">
                                <Avatar className="w-[52px] h-[52px]">
                                    <AvatarImage src={conversa.foto} className="object-cover" />
                                    <AvatarFallback className="bg-[#E2E8F0] text-[#1A365D] font-bold text-xl">{conversa.nome[0]}</AvatarFallback>
                                </Avatar>
                                {conversa.online && (
                                    <span className="absolute bottom-[2px] right-[2px] w-[14px] h-[14px] bg-[#D4AF37] rounded-full border-2 border-white z-10"></span>
                                )}
                            </div>

                            {/* Border na div interior para replicar a divisória exata do zap */}
                            <div className={`flex-1 text-left min-w-0 pb-3 pt-1 ${i !== conversasMock.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[#1A365D] text-[16px] leading-tight truncate">{conversa.nome}</h3>
                                    <span className={conversa.naoLidas > 0 ? "text-[12px] font-black text-[#D4AF37]" : "text-[12px] font-medium text-slate-400"}>
                                        {ultMsg.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pr-1">
                                    <p className={`text-[14px] truncate pr-4 ${conversa.naoLidas > 0 ? 'text-[#1A365D] font-bold' : 'text-slate-500'}`}>
                                        {ultMsg.text}
                                    </p>

                                    {conversa.naoLidas > 0 && (
                                        <div className="bg-[#D4AF37] text-white text-[11px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                            {conversa.naoLidas}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </main>

            <BottomNav activeTab="mensagens" />
        </div>
    )
}
