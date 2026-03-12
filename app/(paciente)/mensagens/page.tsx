'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, Phone, Video, MoreVertical, ArrowLeft, Send,
    Paperclip, Camera, Mic, Square, CheckCheck, Reply, Trash2,
    Copy, X, Ban, ShieldCheck, Heart, Bell, BellOff
} from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { medicosMock } from '@/data/mockData'

const conversasMock = [
    { id: '1', nome: 'Dra. Ana Silva', foto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150', horari: '10:30', ultimaMsg: 'Olá! Como posso ajudar hoje?', naoLidas: 2, online: true },
    { id: '2', nome: 'Dr. Roberto Santos', foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150', horari: 'Ontem', ultimaMsg: 'A receita foi enviada para o seu e-mail.', naoLidas: 0, online: false },
    { id: '3', nome: 'Farmácia Central', foto: 'https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?auto=format&fit=crop&q=80&w=150', horari: '09:15', ultimaMsg: 'Seu pedido está pronto para retirada.', naoLidas: 1, online: true },
    { id: '4', nome: 'Dra. Juliana Lima', foto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150', horari: 'Segunda', ultimaMsg: 'Pode confirmar o horário da consulta?', naoLidas: 0, online: false },
]

const msgsPorChat: Record<string, any[]> = {
    '1': [
        { id: '1', text: 'Bom dia, Dra. Ana! Gostaria de tirar uma dúvida sobre o medicamento.', time: '10:00', sender: 'user', date: 'Hoje' },
        { id: '2', text: 'Olá! Bom dia. Sim, claro. Pode falar.', time: '10:05', sender: 'other', date: 'Hoje' },
    ],
    '2': [
        { id: '1', text: 'Dr. Roberto, recebi a receita. Obrigado!', time: 'Ontem', sender: 'user', date: 'Ontem' },
    ],
    '3': [
        { id: '1', text: 'Olá! O medicamento X está disponível?', time: '09:00', sender: 'user', date: 'Hoje' },
        { id: '2', text: 'Está sim! Deseja reservar?', time: '09:15', sender: 'other', date: 'Hoje' },
    ]
}

const ChatBackgroundPattern = () => (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="chat-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M10 10 L20 10 L20 20 L10 20 Z M40 40 L50 40 L50 50 L40 50 Z" fill="currentColor" />
                    <circle cx="30" cy="10" r="2" fill="currentColor" />
                    <path d="M50 10 Q 55 15, 50 20" stroke="currentColor" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chat-pattern)" />
        </svg>
    </div>
)

const CustomAudioPlayer = ({ url, avatarUrl }: { url: string, avatarUrl: string }) => {
    return (
        <div className="flex items-center gap-3 py-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <img src={avatarUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 h-1 bg-slate-200 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-[#1A365D]"></div>
            </div>
            <Mic className="w-4 h-4 text-[#1A365D]" />
        </div>
    )
}

export default function MensagensPage() {
    const router = useRouter()
    const [viewChat, setViewChat] = useState<string | null>(null)
    const [msgs, setMsgs] = useState<any[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [swipingId, setSwipingId] = useState<string | null>(null)
    const [swipeX, setSwipeX] = useState(0)
    const [replyingToMsg, setReplyingToMsg] = useState<any | null>(null)
    const [selectedMsgs, setSelectedMsgs] = useState<string[]>([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showContactProfile, setShowContactProfile] = useState(false)
    const [mutedChats, setMutedChats] = useState<Record<string, boolean>>({})
    const [blockedChats, setBlockedChats] = useState<Record<string, boolean>>({})

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const timerRef = useRef<any>(null)

    useEffect(() => {
        if (viewChat) {
            setMsgs(msgsPorChat[viewChat] || [])
            setSelectedMsgs([])
            setReplyingToMsg(null)
            setIsSearching(false)
            setSearchQuery('')
        }
    }, [viewChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [msgs])

    const handleSend = () => {
        if (!inputValue.trim() || !viewChat) return
        const newMsg = {
            id: Date.now().toString(),
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'user',
            date: 'Hoje',
            replyTo: replyingToMsg
        }
        setMsgs(prev => [...prev, newMsg])
        setInputValue('')
        setReplyingToMsg(null)
        toast.success('Mensagem enviada')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording(true)
        } else {
            startRecording()
        }
    }

    const startRecording = () => {
        setIsRecording(true)
        setRecordingTime(0)
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1)
        }, 1000)
    }

    const stopRecording = (send: boolean) => {
        setIsRecording(false)
        clearInterval(timerRef.current)
        if (send && viewChat) {
            const newMsg = {
                id: Date.now().toString(),
                audioUrl: '#',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'user',
                date: 'Hoje'
            }
            setMsgs(prev => [...prev, newMsg])
            toast.success('Áudio enviado')
        }
    }

    const handleBalloonClick = (id: string) => {
        if (selectedMsgs.length > 0) {
            toggleSelect(id)
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedMsgs(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        )
    }

    const handleLongPress = (id: string) => {
        if (window.navigator.vibrate) window.navigator.vibrate(50)
        toggleSelect(id)
    }

    const pressTimer = useRef<any>(null)

    const handlePointerDown = (id: string) => {
        pressTimer.current = setTimeout(() => handleLongPress(id), 500)
    }

    const handlePointerUp = () => {
        clearTimeout(pressTimer.current)
    }

    const handleDeleteSelected = () => {
        setMsgs(prev => prev.filter(m => !selectedMsgs.includes(m.id)))
        setSelectedMsgs([])
        toast.success('Mensagens apagadas')
    }

    const initReply = (msg: any) => {
        setReplyingToMsg(msg)
        setSelectedMsgs([])
    }

    const handleAddReaction = (msgId: string, emoji: string) => {
        setMsgs(prev => prev.map(m => m.id === msgId ? { ...m, reaction: emoji } : m))
        setSelectedMsgs([])
    }

    const handleToggleMute = () => {
        if (!viewChat) return
        setMutedChats(prev => ({ ...prev, [viewChat]: !prev[viewChat] }))
        toast.success(mutedChats[viewChat] ? 'Notificações ativadas' : 'Notificações silenciadas')
    }

    const handleToggleBlock = () => {
        if (!viewChat) return
        setBlockedChats(prev => ({ ...prev, [viewChat]: !prev[viewChat] }))
        toast.info(blockedChats[viewChat] ? 'Contato desbloqueado' : 'Contato bloqueado')
    }

    const handleClearHistory = () => {
        if (!viewChat) return
        setMsgs([])
        toast.success('Histórico limpo')
        setIsMenuOpen(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            toast.success('Arquivo selecionado (Simulação)')
        }
    }

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        let displayMsgs = msgs

        if (isSearching && searchQuery.trim() !== '') {
            displayMsgs = displayMsgs.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        return (
            <div className="flex flex-col h-screen overflow-hidden bg-[#E2E8F0]">
                <ChatBackgroundPattern />

                <div className="flex flex-col h-screen relative z-10 overflow-hidden">
                    {isSearching ? (
                        <header className="bg-white px-3 py-2.5 flex items-center gap-2 text-[#1A365D] shadow-md z-30 shrink-0">
                            <button onClick={() => { setIsSearching(false); setSearchQuery('') }} className="p-2 text-slate-500"><ArrowLeft className="w-6 h-6" /></button>
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar nesta conversa..."
                                className="flex-1 bg-transparent outline-none border-none text-[15px]"
                            />
                            {searchQuery && <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400"><X className="w-5 h-5" /></button>}
                        </header>
                    ) : selectedMsgs.length > 0 ? (
                        <header className="bg-[#D4AF37] px-3 py-2.5 flex items-center justify-between text-[#1A365D] shadow-md z-30 shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedMsgs([])}><ArrowLeft className="w-6 h-6" /></button>
                                <span className="font-bold text-[18px]">{selectedMsgs.length}</span>
                            </div>
                            <div className="flex items-center gap-5">
                                {selectedMsgs.length === 1 && <button onClick={() => initReply(displayMsgs.find(m => m.id === selectedMsgs[0]))}><Reply className="w-5 h-5" /></button>}
                                <button onClick={handleDeleteSelected}><Trash2 className="w-5 h-5" /></button>
                                {selectedMsgs.length === 1 && <button onClick={() => setSelectedMsgs([])}><Copy className="w-5 h-5" /></button>}
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)}><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </header>
                    ) : (
                        <header className="bg-[#2D5284] px-3 py-3 flex items-center gap-3 text-white shadow-lg z-20 shrink-0 relative rounded-b-[24px]">
                            <button onClick={() => setViewChat(null)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
                            <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setShowContactProfile(true)}>
                                <div className="w-10 h-10 rounded-xl border border-white/20 overflow-hidden shadow-sm">
                                    <img src={chatAtivo.foto} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-[15px] leading-tight">{chatAtivo.nome}</h2>
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <div className={`w-1.5 h-1.5 rounded-full ${chatAtivo.online ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                                        <span className="text-[10px] text-white/70">{chatAtivo.online ? 'Online' : 'Visto recentemente'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <Video className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" onClick={() => toast.info('Videochamada...')} />
                                <Phone className="w-[18px] h-[18px] cursor-pointer opacity-80 hover:opacity-100" onClick={() => toast.info('Chamada...')} />
                                <div className="relative">
                                    <MoreVertical className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 text-[#1A365D] border border-slate-100">
                                            <button className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center justify-between" onClick={() => { setIsMenuOpen(false); setIsSearching(true); }}>
                                                <span>Buscar</span>
                                                <Search className="w-4 h-4" />
                                            </button>
                                            <button className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center justify-between" onClick={() => { setIsMenuOpen(false); handleToggleMute(); }}>
                                                <span>{mutedChats[viewChat] ? 'Ativar' : 'Silenciar'}</span>
                                                <Bell className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#FFF8DD] text-slate-700 text-[11px] px-4 py-2 rounded-lg text-center max-w-[90%] border border-[#E8C55E]/40">
                                🔒 Notificações protegidas com DocZap.
                            </div>
                        </div>

                        {displayMsgs.map((msg, idx) => {
                            const isSelected = selectedMsgs.includes(msg.id)
                            return (
                                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        onPointerDown={() => handlePointerDown(msg.id)}
                                        onPointerUp={handlePointerUp}
                                        onClick={() => handleBalloonClick(msg.id)}
                                        className={`p-[3px] rounded-2xl shadow-sm relative transition-all ${isSelected ? 'brightness-90 ring-2 ring-[#D4AF37]' : ''} ${msg.sender === 'user' ? 'bg-gradient-to-br from-[#E2C358] to-[#D4AF37] text-[#1A365D] rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm'}`}
                                    >
                                        <div className="px-3 pt-1.5 pb-2 text-[15px] min-w-[70px]">
                                            {msg.audioUrl ? <CustomAudioPlayer url="#" avatarUrl={msg.sender === 'user' ? "" : chatAtivo.foto} /> : <span>{msg.text}</span>}
                                            <span className="float-right text-[10px] mt-2.5 ml-3 font-bold flex items-center gap-1">
                                                {msg.time}
                                                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-600" />}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {!blockedChats[viewChat] ? (
                        <div className="bg-[#F6F6F6] p-2 pb-6 flex items-end gap-2 border-t border-slate-200/60">
                            <div className="flex-1 bg-white rounded-[24px] border border-slate-200 p-1 flex flex-col">
                                {replyingToMsg && (
                                    <div className="bg-slate-50 border-b border-slate-100 p-2 flex items-center justify-between">
                                        <div className="border-l-4 border-blue-400 pl-2">
                                            <p className="text-[11px] font-bold text-blue-500">Respondendo</p>
                                            <p className="text-[12px] text-slate-500 truncate">{replyingToMsg.text}</p>
                                        </div>
                                        <button onClick={() => setReplyingToMsg(null)}><X className="w-5 h-5 text-slate-400" /></button>
                                    </div>
                                )}
                                <div className="flex items-end min-h-[46px] relative">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Mensagem"
                                        rows={1}
                                        className="w-full bg-transparent py-3 px-4 outline-none resize-none"
                                    />
                                    <div className="flex gap-1 pr-2 mb-1">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 p-2"><Paperclip className="w-5 h-5 -rotate-45" /></button>
                                        <button onClick={() => cameraInputRef.current?.click()} className="text-slate-400 p-2"><Camera className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={inputValue.trim() ? handleSend : handleMicClick} className="bg-[#D4AF37] text-[#1A365D] w-[46px] h-[46px] rounded-full flex items-center justify-center">
                                {inputValue.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        </div>
                    ) : (
                        <div onClick={handleToggleBlock} className="bg-slate-100 p-4 text-center text-slate-500 text-sm">Contatando bloqueado. Clique para desbloquear.</div>
                    )}
                </div>

                {showContactProfile && (
                    <div className="absolute inset-0 z-50 bg-[#F1F5F9] animate-slide-in-right">
                        <header className="bg-slate-800 p-4 text-white flex items-center gap-4">
                            <button onClick={() => setShowContactProfile(false)}><ArrowLeft className="w-6 h-6" /></button>
                            <span className="font-bold">Perfil</span>
                        </header>
                        <div className="p-8 flex flex-col items-center">
                            <img src={chatAtivo.foto} className="w-32 h-32 rounded-full mb-4 shadow-lg" />
                            <h2 className="text-2xl font-bold text-slate-800">{chatAtivo.nome}</h2>
                            <p className="text-slate-500">+55 11 99999-9999</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="relative mb-10">
                <Header variant="page" title="DocZap" showNotifications userAvatar="/images/avatar_sophia.png" userName="Sophia" className="doczap" />

                <div className="absolute left-5 right-5 -bottom-6 z-20">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 shadow-md border-0 outline-none focus:ring-0 text-[14px] text-slate-600"
                        />
                    </div>
                </div>
            </div>

            <main className="pt-4 divide-y divide-slate-100">
                {conversasMock.map((conversa) => (
                    <button key={conversa.id} onClick={() => setViewChat(conversa.id)} className="w-full flex items-center px-4 py-4 hover:bg-slate-50 transition-colors">
                        <div className="relative mr-4">
                            <img src={conversa.foto} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                            {conversa.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>}
                        </div>
                        <div className="flex-1 text-left">
                            <div className="flex justify-between">
                                <h3 className="font-bold text-[#1A365D]">{conversa.nome}</h3>
                                <span className="text-xs text-slate-400">{conversa.horari}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{conversa.ultimaMsg}</p>
                        </div>
                        {conversa.naoLidas > 0 && (
                            <div className="ml-2 bg-[#D4AF37] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {conversa.naoLidas}
                            </div>
                        )}
                    </button>
                ))}
            </main>
            <BottomNav activeTab="mensagens" />
        </div>
    )
}
