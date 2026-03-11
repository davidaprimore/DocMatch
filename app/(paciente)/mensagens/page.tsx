'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Search, MoreVertical, CheckCheck, Camera, Phone, Video, ArrowLeft, Send,
    Paperclip, Mic, X, Square, Reply, Heart, ThumbsUp, Laugh, Frown, Bell, Settings,
    Trash2, Ban, BellOff, Play, Pause, CircleX, Copy, Stethoscope, HeartPulse, Syringe,
    Pill, Dna, Activity, Thermometer, Microscope, ClipboardPlus, BriefcaseMedical,
    Droplet, Bandage, Cross, Baby, Bone, Brain, Ear, Eye, FlaskConical, HeartCrack,
    HeartHandshake, Hospital, Radiation, ScanFace, TestTube, TestTubeDiagonal,
    TestTubes, User, Users, PhoneCall, MessageCircle, FileText, CalendarDays, Clock,
    ShieldCheck, Star, Sun, Moon, Smile, Leaf, Coffee, Music, Globe, MapPin, Sparkles,
    Zap, Apple, Watch, Glasses, Laptop, BookOpen, CheckCircle, AlertCircle, Info,
    HelpCircle, Flame, Cloud, Umbrella
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/BottomNav'
import { toast } from 'sonner'
import { medicosMock } from '@/data/mockData'

// 59 Variedades de Ícones Premium
const icons = [
    Stethoscope, HeartPulse, Syringe, Pill, Dna, Activity, Thermometer, Microscope,
    ClipboardPlus, BriefcaseMedical, Droplet, Bandage, Cross, Heart, Baby, Bone,
    Brain, Ear, Eye, FlaskConical, HeartCrack, HeartHandshake, Hospital, Radiation,
    ScanFace, TestTube, TestTubeDiagonal, TestTubes, User, Users, PhoneCall,
    MessageCircle, FileText, CalendarDays, Clock, ShieldCheck, Star, Sun, Moon,
    Smile, Leaf, Coffee, Music, Globe, MapPin, Sparkles, Zap, Apple, Watch, Glasses,
    Laptop, BookOpen, CheckCircle, AlertCircle, Info, HelpCircle, Flame, Cloud,
    Umbrella
];

// Componente React de SVG Otimizado para altíssima densidade, 15% maiores, e 59 ícones
const ChatBackgroundPattern = () => {
    return (
        <svg className="chat-bg-layer absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-multiply opacity-[0.22]">
            <defs>
                <pattern id="medical-pattern" x="0" y="0" width="360" height="600" patternUnits="userSpaceOnUse">
                    {icons.map((Icon, index) => {
                        // Grid de 6 Colunas (Muito mais denso e justificado no width: 360)
                        const col = index % 6;
                        const row = Math.floor(index / 6);

                        // Posiciona os ícones bem próximos do outro (60px de distância - mais compacto)
                        const spacingX = 60;
                        const spacingY = 60;

                        // Zigue-zague (Staggered Grid Layout) para não formar buracos
                        const offsetX = (row % 2 === 0) ? 0 : (spacingX / 2);

                        // Aumentamos +15% no Size original: Size = 32
                        const size = 32;

                        const x = col * spacingX + offsetX + 15;
                        const y = row * spacingY + 15;

                        // Alterna cores entre Azul Base #1A365D e Golden #D4AF37 a cada 3 ícones
                        const isGold = index % 3 === 0;
                        const strokeColor = isGold ? "#D4AF37" : "#1A365D";
                        const opacity = isGold ? 0.6 : 0.7;

                        return (
                            <Icon
                                key={index}
                                x={x}
                                y={y}
                                width={size}
                                height={size}
                                stroke={strokeColor}
                                strokeWidth={1.5}
                                opacity={opacity}
                            />
                        );
                    })}

                    {/* Elementos Particulares (Accents / Pó) para tampar vazios estéticos  */}
                    <circle cx="50" cy="50" r="2" fill="#D4AF37" opacity="0.4" />
                    <circle cx="200" cy="125" r="3" fill="#1A365D" opacity="0.3" />
                    <circle cx="350" cy="275" r="2" fill="#D4AF37" opacity="0.4" />
                    <circle cx="500" cy="50" r="2.5" fill="#1A365D" opacity="0.3" />
                    <circle cx="100" cy="425" r="2" fill="#D4AF37" opacity="0.4" />
                    <circle cx="450" cy="350" r="2" fill="#1A365D" opacity="0.3" />
                    <circle cx="250" cy="550" r="2.5" fill="#D4AF37" opacity="0.4" />
                </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#medical-pattern)" />
        </svg>
    )
}

type MsgType = {
    id: string;
    text: string;
    sender: 'user' | 'other';
    time: string;
    date: string;
    audioUrl?: string; // Para áudio real
    replyTo?: MsgType | null;
    reaction?: string;
    swipeOffset?: number; // Para drag-to-reply
    isDeleted?: boolean;
}

// Subcomponente Player de Áudio Estilo WhatsApp
const CustomAudioPlayer = ({ url, avatarUrl }: { url: string, avatarUrl?: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const changeSpeed = () => {
        if (!audioRef.current) return;
        const nextSpeed = speed === 1 ? 1.5 : (speed === 1.5 ? 2 : 1);
        audioRef.current.playbackRate = nextSpeed;
        setSpeed(nextSpeed);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setProgress((audioRef.current.currentTime / audioRef.current.duration) || 0);
    };

    return (
        <div className="flex items-center gap-2 py-0.5 relative z-10 w-fit">
            {avatarUrl && (
                <Avatar className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0">
                    <img src={avatarUrl} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
                </Avatar>
            )}
            <button onClick={(e) => { e.stopPropagation(); togglePlay() }} className="text-[#1A365D] bg-slate-100 rounded-full p-2 active:scale-95 transition-transform flex items-center justify-center shrink-0 w-8 h-8" style={{ marginTop: '2px' }}>
                {isPlaying ? <Pause className="w-[14px] h-[14px] fill-current" /> : <Play className="w-[14px] h-[14px] fill-current ml-0.5" />}
            </button>
            <div className="flex-1 min-w-[100px] max-w-[140px] flex items-center justify-center gap-[2px]">
                {/* Simulated Waveform (Bar chart style) */}
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1 bg-[#1A365D]/30 rounded-full" style={{
                        height: Math.sin(i) * 5 + 8 + 'px',
                        backgroundColor: (i / 24) < progress ? '#1A365D' : '#1A365D30'
                    }} />
                ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); changeSpeed() }} className="text-[#1A365D] bg-white/60 px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm active:scale-95 transition-colors hover:bg-white shrink-0 cursor-pointer">
                {speed}x
            </button>
            <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />
        </div>
    )
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
    const searchParams = useSearchParams()
    const [viewChat, setViewChat] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState('')

    // Busca no Chat
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Controle de Contatos Lógicos
    const [mutedChats, setMutedChats] = useState<Record<string, boolean>>({})
    const [blockedChats, setBlockedChats] = useState<Record<string, boolean>>({})

    // Áudio Real
    const [isRecording, setIsRecording] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    // Ações de Mensagem
    const [replyingToMsg, setReplyingToMsg] = useState<MsgType | null>(null)
    const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]) // Seleção Multipla
    const [showContactProfile, setShowContactProfile] = useState(false) // Tela de Perfil

    // Swipe to reply
    const [swipingId, setSwipingId] = useState<string | null>(null)
    const startX = useRef<number>(0)
    const currentX = useRef<number>(0)

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

    // Abre conversa automaticamente se vier com ?chat=ID na URL
    useEffect(() => {
        const chatId = searchParams?.get('chat')
        if (chatId) setViewChat(chatId)
    }, [searchParams])

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
            // Feedback mais amigável de erro de permissão ou HTTPS
            toast.error("Erro no Microfone", {
                description: "Não foi possível acessar. Verifique se deu permissão ou se o site é seguro (HTTPS em celular).",
                duration: 5000
            })
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
                if (!mutedChats[viewChat]) playSound('receive')
            }, 1500)
        }
    }

    const handleDeleteMessage = (msgId: string) => {
        if (!viewChat) return;
        setMsgsPorChat(prev => {
            const currentMsgs = prev[viewChat];
            return {
                ...prev,
                [viewChat]: currentMsgs.map(msg => msg.id === msgId ? { ...msg, isDeleted: true, text: '', audioUrl: undefined } : msg)
            }
        });
        setSelectedMsgs([]);
        toast.info('Mensagem apagada');
    }

    const handleDeleteSelected = () => {
        if (!viewChat || selectedMsgs.length === 0) return;
        setMsgsPorChat(prev => {
            const currentMsgs = prev[viewChat];
            return {
                ...prev,
                [viewChat]: currentMsgs.map(msg => selectedMsgs.includes(msg.id) ? { ...msg, isDeleted: true, text: '', audioUrl: undefined } : msg)
            }
        });
        const count = selectedMsgs.length;
        setSelectedMsgs([]);
        toast.info(count > 1 ? `${count} mensagens apagadas` : 'Mensagem apagada');
    }

    const handleClearHistory = () => {
        if (!viewChat) return;
        setMsgsPorChat(prev => ({ ...prev, [viewChat]: [] }));
        setIsMenuOpen(false);
        toast.success('Histórico Limpo');
    }

    const handleToggleMute = () => {
        if (!viewChat) return;
        setMutedChats(prev => ({ ...prev, [viewChat]: !prev[viewChat] }));
        setIsMenuOpen(false);
        toast.success(mutedChats[viewChat] ? 'Notificações ativadas' : 'Notificações silenciadas');
    }

    const handleToggleBlock = () => {
        if (!viewChat) return;
        setBlockedChats(prev => ({ ...prev, [viewChat]: !prev[viewChat] }));
        setIsMenuOpen(false);
        toast.error(blockedChats[viewChat] ? 'Contato Desbloqueado' : 'Contato Bloqueado');
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
            if (selectedMsgs.length === 0) {
                setSelectedMsgs([msgId]) // Ativa o modo de seleção
            }
            if (window.navigator.vibrate) window.navigator.vibrate(50) // Haptic feedback leve
        }, 500) // 500ms para long press
    }

    const handleBalloonClick = (msgId: string) => {
        if (selectedMsgs.length > 0) {
            setSelectedMsgs(prev =>
                prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]
            )
        }
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
        setSelectedMsgs([])
        playSound('reaction')
    }

    const initReply = (msg: MsgType) => {
        setReplyingToMsg(msg)
        setSelectedMsgs([])
        setSwipingId(null)
        // Reset offsets after reply init
        setMsgsPorChat(prev => {
            if (!viewChat) return prev
            return {
                ...prev,
                [viewChat]: prev[viewChat].map(m => ({ ...m, swipeOffset: 0 }))
            }
        })
    }

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, msgId: string) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        startX.current = clientX;
        currentX.current = clientX;
        setSwipingId(msgId)
    }

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!swipingId || !viewChat) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        currentX.current = clientX;

        const diff = currentX.current - startX.current;
        // Permite swipe para direita, com fricção (max 80px)
        const offset = diff > 0 ? Math.min(diff * 0.4, 80) : 0;

        setMsgsPorChat(prev => ({
            ...prev,
            [viewChat]: prev[viewChat].map(msg =>
                msg.id === swipingId ? { ...msg, swipeOffset: offset } : msg
            )
        }))
    }

    const handleTouchEnd = () => {
        if (!swipingId || !viewChat) return;

        const diff = currentX.current - startX.current;
        if (diff > 50) {
            // Se arrastou bem, engatilha reply
            const msgToReply = msgsPorChat[viewChat].find(m => m.id === swipingId)
            if (msgToReply) initReply(msgToReply)
            if (window.navigator.vibrate) window.navigator.vibrate(50)
        }

        // Volta a mensagem pro lugar suavemente
        setMsgsPorChat(prev => ({
            ...prev,
            [viewChat]: prev[viewChat].map(msg =>
                msg.id === swipingId ? { ...msg, swipeOffset: 0 } : msg
            )
        }))
        setSwipingId(null)
    }

    const chatAtivo = conversasMock.find(c => c.id === viewChat)

    if (viewChat && chatAtivo) {
        let msgs = msgsPorChat[viewChat] || []

        if (isSearching && searchQuery.trim() !== '') {
            msgs = msgs.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        return (
            <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                {/* Camada real do Fundo renderizada em SVG Nativo de Alta Definição */}
                <ChatBackgroundPattern />

                <div className="flex flex-col h-screen relative z-10 overflow-hidden">
                    {isSearching ? (
                        <header className="bg-white px-3 py-2.5 flex items-center gap-2 text-[#1A365D] shadow-[0_2px_10px_rgba(26,54,93,0.1)] z-30 shrink-0 relative animate-fade-in transition-colors">
                            <button onClick={() => { setIsSearching(false); setSearchQuery('') }} className="active:scale-90 transition-transform p-2 text-slate-500 hover:text-[#1A365D]"><ArrowLeft className="w-6 h-6" /></button>
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar nesta conversa..."
                                className="flex-1 bg-transparent outline-none border-none text-[15px] font-medium placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-slate-600 active:scale-90"><X className="w-5 h-5" /></button>
                            )}
                        </header>
                    ) : selectedMsgs.length > 0 ? (
                        <header className="bg-[#D4AF37] px-3 py-2.5 flex items-center justify-between text-[#1A365D] shadow-[0_2px_10px_rgba(212,175,55,0.3)] z-30 shrink-0 relative animate-fade-in transition-colors">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedMsgs([])} className="active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
                                <span className="font-bold text-[18px]">{selectedMsgs.length}</span>
                            </div>
                            <div className="flex items-center gap-5 pr-1">
                                {selectedMsgs.length === 1 && (
                                    <button onClick={() => {
                                        const msg = msgs.find(m => m.id === selectedMsgs[0]);
                                        if (msg) initReply(msg);
                                    }} className="active:scale-90 transition-transform"><Reply className="w-5 h-5" /></button>
                                )}
                                <button onClick={handleDeleteSelected} className="active:scale-90 transition-transform text-[#1A365D] drop-shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                {selectedMsgs.length === 1 && (
                                    <button onClick={() => {
                                        const msgText = msgs.find(m => m.id === selectedMsgs[0])?.text;
                                        if (msgText) {
                                            if (navigator.clipboard && window.isSecureContext) {
                                                navigator.clipboard.writeText(msgText).then(() => toast.success('Conteúdo copiado!')).catch(() => toast.error('Erro ao copiar'));
                                            } else {
                                                const textArea = document.createElement("textarea");
                                                textArea.value = msgText;
                                                document.body.appendChild(textArea);
                                                textArea.select();
                                                try {
                                                    document.execCommand('copy');
                                                    toast.success('Conteúdo copiado!');
                                                } catch (err) {
                                                    toast.error('Erro ao copiar');
                                                }
                                                textArea.remove();
                                            }
                                        }
                                        setSelectedMsgs([]);
                                    }} className="active:scale-90 transition-transform"><Copy className="w-[18px] h-[18px]" /></button>
                                )}
                                {selectedMsgs.length === 1 && (
                                    <button onClick={() => { toast.info('Funcionalidade de encaminhar em breve'); setSelectedMsgs([]); }} className="active:scale-90 transition-transform"><MoreVertical className="w-5 h-5" /></button>
                                )}
                            </div>
                        </header>
                    ) : (
                        <header className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-3 py-2.5 flex items-center gap-2 text-white shadow-[0_2px_10px_rgba(26,54,93,0.3)] z-20 shrink-0 relative animate-fade-in">
                            <button onClick={() => setViewChat(null)} className="flex items-center justify-center hover:bg-white/10 p-1.5 -ml-1 rounded-full transition-colors active:scale-90 shrink-0">
                                <ArrowLeft className="w-6 h-6" />
                            </button>

                            <div className="flex items-center flex-1 gap-2 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => setShowContactProfile(true)}>
                                <Avatar className="w-10 h-10 min-w-[40px] border border-white/10 overflow-hidden bg-white shrink-0 rounded-full">
                                    <img src={chatAtivo.foto} alt={chatAtivo.nome} className="absolute inset-0 w-full h-full object-cover" />
                                </Avatar>
                                <div className="flex flex-col flex-1 pl-1">
                                    <span className="font-bold text-[16px] leading-tight drop-shadow-sm truncate">{chatAtivo.nome}</span>
                                    <span className="text-[12.5px] text-[#D4AF37] font-medium truncate">{chatAtivo.online ? 'online' : 'visto por último hoje'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-white p-1">
                                <Video className="w-[22px] h-[22px] active:scale-90 transition-transform cursor-pointer" strokeWidth={1.5} onClick={() => toast.info('Iniciando videochamada segura...')} />
                                <Phone className="w-[20px] h-[20px] active:scale-90 transition-transform cursor-pointer" strokeWidth={1.5} onClick={() => toast.info('Chamada de voz conectando...')} />
                                <div className="relative">
                                    <MoreVertical className="w-5 h-5 active:scale-90 transition-transform cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                                    {isMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-40 border border-slate-100 font-medium text-[#1A365D] overflow-hidden animate-fade-in shadow-premium">
                                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors text-[14px] flex items-center justify-between" onClick={() => { setIsMenuOpen(false); setIsSearching(true); }}>
                                                    <span>Buscar na Conversa</span>
                                                    <Search className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <div className="h-px bg-slate-100 mx-3 my-0.5"></div>
                                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors text-[14px] flex items-center justify-between" onClick={handleToggleMute}>
                                                    <span>{mutedChats[viewChat] ? 'Ativar Notificações' : 'Silenciar Notificações'}</span>
                                                    {mutedChats[viewChat] ? <Bell className="w-4 h-4 text-slate-400" /> : <BellOff className="w-4 h-4 text-slate-400" />}
                                                </button>
                                                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors text-[14px] flex items-center justify-between" onClick={handleClearHistory}>
                                                    <span>Limpar Histórico</span>
                                                </button>
                                                <div className="h-px bg-slate-100 mx-3 my-1"></div>
                                                <button className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-500 transition-colors flex items-center justify-between text-[14px]" onClick={handleToggleBlock}>
                                                    <span>{blockedChats[viewChat] ? 'Desbloquear' : 'Bloquear Contato'}</span>
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </header>
                    )}

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 relative z-0" onClick={() => setSelectedMsgs([])}>
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#FFF8DD] text-slate-700 text-[11px] px-4 py-2 rounded-lg text-center shadow-sm max-w-[90%] border border-[#E8C55E]/40 font-medium">
                                🔒 As mensagens são protegidas com criptografia de ponta a ponta. A DocZap não pode ler ou ouvir o que você envia.
                            </div>
                        </div>

                        {msgs.map((msg, index) => {
                            const isFirstOfDay = index === 0 || msgs[index - 1].date !== msg.date;
                            const isSelected = selectedMsgs.includes(msg.id);
                            const isSingleSelected = selectedMsgs.length === 1 && isSelected;

                            return (
                                <div key={msg.id}>
                                    {isFirstOfDay && (
                                        <div className="flex justify-center my-4">
                                            <span className="bg-[#E2E8F0]/90 backdrop-blur-sm text-slate-700 font-bold text-[11px] px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                                {msg.date}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`flex items-center w-full relative ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {/* Icone Reply aparecendo no Swipe */}
                                        {msg.sender === 'other' && swipingId === msg.id && msg.swipeOffset && msg.swipeOffset > 20 && (
                                            <div className="absolute left-[-40px] w-8 h-8 rounded-full bg-[#1A365D]/10 flex items-center justify-center transition-opacity" style={{ opacity: msg.swipeOffset / 80 }}>
                                                <Reply className="w-4 h-4 text-[#1A365D]" />
                                            </div>
                                        )}

                                        <div
                                            className={`flex flex-col max-w-[85%] relative transition-transform ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                            style={{ transform: `translateX(${msg.swipeOffset || 0}px)`, transition: swipingId === msg.id ? 'none' : 'transform 0.2s ease-out' }}
                                            onTouchStart={(e) => handleTouchStart(e, msg.id)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={handleTouchEnd}
                                            onMouseDown={(e) => handleTouchStart(e, msg.id)}
                                            onMouseMove={(e) => swipingId === msg.id && handleTouchMove(e)}
                                            onMouseUp={handleTouchEnd}
                                            onMouseLeave={handleTouchEnd}
                                        >
                                            {/* Overlay de Reações */}
                                            {isSingleSelected && (
                                                <div className={`absolute z-30 -top-12 flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 animate-slide-up-fade ${msg.sender === 'user' ? 'right-0' : 'left-0'}`}>
                                                    {['❤️', '👍', '😂', '😮', '😢', '🙏'].map(emoji => (
                                                        <button key={emoji} onClick={(e) => { e.stopPropagation(); handleAddReaction(msg.id, emoji) }} className="text-[22px] hover:scale-125 transition-transform active:scale-90 cursor-pointer">{emoji}</button>
                                                    ))}
                                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                                    <button onClick={(e) => { e.stopPropagation(); toast.info('Mais Emoji Picker (Nativo ou Grid)') }} className="text-slate-500 hover:text-[#1A365D] hover:bg-slate-100 rounded-full transition-colors p-1.5 flex items-center justify-center cursor-pointer active:scale-90">
                                                        <span className="text-[18px] leading-none mb-0.5 font-bold">+</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Balão de Mensagem */}
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleBalloonClick(msg.id); }}
                                                onDoubleClick={() => handleDoubleClick(msg.id)}
                                                onPointerDown={() => handlePointerDown(msg.id)}
                                                onPointerUp={handlePointerUp}
                                                onPointerLeave={handlePointerUp}
                                                className={`p-[3px] rounded-2xl shadow-sm relative transition-all select-none ${isSelected ? 'brightness-90 ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#F1F5F9]' : ''} ${selectedMsgs.length > 0 && !isSelected ? 'opacity-80' : 'opacity-100'} ${msg.sender === 'user'
                                                    ? 'bg-gradient-to-br from-[#E2C358] to-[#D4AF37] text-[#1A365D] rounded-tr-sm border border-[#CBA035]/60'
                                                    : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                                                    }`}>

                                                {/* Box de Resposta (Quote) */}
                                                {msg.replyTo && !msg.isDeleted && (
                                                    <div className={`mx-[5px] mt-[5px] mb-[2px] p-2 rounded-xl text-[13px] border-l-4 ${msg.sender === 'user' ? 'bg-[#1A365D]/10 border-[#1A365D]' : 'bg-slate-100 border-[#2D5284]'}`}>
                                                        <p className="font-bold text-[11px] mb-0.5 opacity-80">{msg.replyTo.sender === 'user' ? 'Você' : (chatAtivo?.nome || 'Contato')}</p>
                                                        <p className="opacity-90 font-medium truncate max-w-[200px]">{msg.replyTo.text || 'Áudio/Mídia'}</p>
                                                    </div>
                                                )}

                                                {msg.isDeleted ? (
                                                    <div className="px-3 py-2 text-[13.5px] italic text-slate-500/80 flex items-center gap-2 min-w-[70px]">
                                                        <Ban className="w-4 h-4 opacity-50" />
                                                        {msg.sender === 'user' ? 'Você apagou esta mensagem.' : 'Esta mensagem foi apagada.'}
                                                    </div>
                                                ) : (
                                                    <div className="px-3 pt-1.5 pb-2 text-[15px] font-medium leading-[1.3] relative min-w-[70px]">
                                                        {msg.audioUrl ? (
                                                            <CustomAudioPlayer url={msg.audioUrl} avatarUrl={msg.sender === 'user' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' : chatAtivo?.foto} />
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
                    {
                        blockedChats[viewChat] ? (
                            <div onClick={handleToggleBlock} className="bg-[#F6F6F6] p-4 pb-8 flex items-center justify-center z-20 shrink-0 relative bg-opacity-95 backdrop-blur-md border-t border-slate-200/60 text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors">
                                Você bloqueou este contato. Toque para desbloquear.
                            </div>
                        ) : (
                            <div className="bg-[#F6F6F6] p-2 pb-6 flex items-end gap-2 z-20 shrink-0 relative bg-opacity-95 backdrop-blur-md border-t border-slate-200/60">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />

                                <div className="flex-1 bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col transition-all">

                                    {/* Preview de Resposta */}
                                    {replyingToMsg && (
                                        <div className="bg-slate-50 border-b border-slate-100 p-2 pl-3 flex items-center justify-between">
                                            <div className="border-l-4 border-blue-400 pl-2">
                                                <p className="text-[11px] font-bold text-blue-500">{replyingToMsg?.sender === 'user' ? 'Respondendo a Você' : (chatAtivo?.nome || 'Contato')}</p>
                                                <p className="text-[12px] text-slate-500 truncate max-w-[200px]">{replyingToMsg?.text || ''}</p>
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
                                    <button onClick={() => handleSend()} className="bg-[#D4AF37] text-white w-[46px] h-[46px] rounded-full shadow-[0_2px_8px_rgba(212,175,55,0.4)] active:scale-90 transition-transform flex items-center justify-center shrink-0 mb-0.5">
                                        <Send className="w-[20px] h-[20px] ml-1" />
                                    </button>
                                ) : (
                                    <button onClick={handleMicClick} className={`${isRecording ? 'bg-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.4)]' : 'bg-[#D4AF37] shadow-[0_2px_8px_rgba(212,175,55,0.4)]'} text-[#1A365D] w-[46px] h-[46px] rounded-full active:scale-90 transition-all flex items-center justify-center shrink-0 mb-0.5`}>
                                        {isRecording ? <Square className="w-5 h-5 fill-current text-white" /> : <Mic className="w-[22px] h-[22px]" strokeWidth={2.5} />}
                                    </button>
                                )}
                            </div>
                        )}

                    {/* Modal de Perfil do Contato */}
                    {
                        showContactProfile && (
                            <div className="absolute inset-0 z-40 bg-[#F1F5F9] flex flex-col animate-slide-in-right h-full w-full">
                                {/* Header do Perfil */}
                                <header className="bg-gradient-to-r from-[#1A365D] to-[#2D5284] px-4 py-3 flex items-center gap-4 text-white shadow-[0_2px_10px_rgba(26,54,93,0.3)] shrink-0 z-50 relative">
                                    <button onClick={() => setShowContactProfile(false)} className="hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors active:scale-90"><ArrowLeft className="w-6 h-6" /></button>
                                    <span className="font-bold text-[18px]">Dados do contato</span>
                                </header>

                                {/* Conteúdo do Perfil */}
                                <div className="flex-1 overflow-y-auto pb-8 z-40 relative">
                                    {/* Seção 1: Foto e Nome Grande */}
                                    <div className="bg-white flex flex-col items-center justify-center py-8 px-4 shadow-sm border-b border-slate-100 mb-2">
                                        <Avatar className="w-[140px] h-[140px] mb-5 shadow-lg border-2 border-white ring-2 ring-slate-100">
                                            <img src={chatAtivo?.foto} alt={chatAtivo?.nome} className="absolute inset-0 w-full h-full object-cover" />
                                        </Avatar>
                                        <h2 className="text-[24px] font-black text-[#1A365D] text-center leading-tight mb-1 drop-shadow-sm">{chatAtivo?.nome}</h2>
                                        <p className="text-slate-500 font-medium text-[15px] mb-6 tracking-wide">+55 11 99999-9999</p>

                                        <div className="flex items-center gap-6 text-[#1A365D]">
                                            <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform" onClick={() => toast.info('Ligação iniciada...')}>
                                                <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0]/60 flex items-center justify-center text-[#1A365D] shadow-sm"><Phone strokeWidth={2.5} className="w-6 h-6" /></div>
                                                <span className="text-[12px] font-bold">Ligar</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform" onClick={() => toast.info('Videochamada iniciada...')}>
                                                <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0]/60 flex items-center justify-center text-[#1A365D] shadow-sm"><Video strokeWidth={2.5} className="w-6 h-6" /></div>
                                                <span className="text-[12px] font-bold">Vídeo</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform" onClick={() => { setShowContactProfile(false); setIsMenuOpen(true); }}>
                                                <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0]/60 flex items-center justify-center text-[#1A365D] shadow-sm"><Search strokeWidth={2.5} className="w-6 h-6" /></div>
                                                <span className="text-[12px] font-bold">Buscar</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-2 bg-slate-50"></div>

                                    {/* Seção Bio */}
                                    <div className="bg-white px-5 py-5 shadow-sm border-b border-t border-slate-100 mb-2">
                                        <p className="font-bold text-[#1A365D] text-[15px] mb-1">Recado e número de telefone</p>
                                        <p className="text-[15px] text-slate-800 leading-relaxed font-medium">Atendimento focado no paciente. 🏥🩺</p>
                                        <p className="text-[13px] text-slate-400 mt-0.5 font-medium">1 de Março</p>
                                    </div>

                                    <div className="w-full h-2 bg-slate-50"></div>

                                    {/* Ações Avançadas */}
                                    <div className="bg-white px-5 py-7 shadow-sm border-b border-t border-slate-100 flex flex-col justify-center items-center">
                                        <button onClick={() => {
                                            const medicoTarget = medicosMock.find((m: any) => m.nome === chatAtivo?.nome);
                                            router.push(medicoTarget ? `/agendar/${medicoTarget.id}` : '/buscar');
                                        }} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C55E] text-[#1A365D] font-black text-[16px] py-4 rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-3 relative overflow-hidden border border-[#D4AF37]/50">
                                            {/* Reflexo / Glassmorphism */}
                                            <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ clipPath: 'polygon(0 0, 45% 0, 60% 100%, 0% 100%)' }}></div>
                                            <Heart className="w-[26px] h-[26px] fill-[#1A365D] text-[#1A365D] drop-shadow-sm relative z-10" />
                                            <span className="relative z-10 tracking-wide mt-0.5">AGENDAR NOVA CONSULTA</span>
                                        </button>
                                        <p className="text-slate-400 text-[12px] mt-3.5 font-medium text-center leading-tight max-w-[85%]">Marque rapidamente um horário presencial ou de telemedicina com este profissional.</p>
                                    </div>

                                    <div className="bg-white px-5 py-2 shadow-sm border-b border-t border-slate-100 flex flex-col mb-4 mt-2">
                                        <button onClick={handleToggleMute} className="w-full flex items-center gap-4 py-4 text-left active:bg-slate-50 transition-colors border-b border-slate-50">
                                            <span className="w-8 flex justify-center">{viewChat && mutedChats[viewChat] ? <BellOff className="w-[22px] h-[22px] text-slate-500 flex-shrink-0" /> : <Bell className="w-[22px] h-[22px] text-slate-500 flex-shrink-0" />}</span>
                                            <span className="font-bold text-[#1A365D] text-[15px] flex-1">Silenciar notificações</span>
                                        </button>
                                        <button onClick={handleClearHistory} className="w-full flex items-center gap-4 py-4 text-left active:bg-slate-50 transition-colors border-b border-slate-50">
                                            <span className="w-8 flex justify-center"><Trash2 className="w-[22px] h-[22px] text-slate-500 flex-shrink-0" /></span>
                                            <span className="font-bold text-[#1A365D] text-[15px] flex-1">Limpar Histórico</span>
                                        </button>
                                        <button onClick={() => { handleToggleBlock(); setShowContactProfile(false); }} className="w-full flex items-center gap-4 py-4 text-left active:bg-red-50 text-red-500 transition-colors rounded-b-xl">
                                            <span className="w-8 flex justify-center"><Ban className="w-[22px] h-[22px] flex-shrink-0" /></span>
                                            <span className="font-bold text-[15px] flex-1">{viewChat && blockedChats[viewChat] ? 'Desbloquear Contato' : 'Bloquear Contato'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    }

    // LISTA DE CONVERSAS (WhatsApp Style = Flat, sem cards marginais, cores douradas)

    return (
        <div className="min-h-screen bg-white pb-24 font-sans">
            {/* Header Lista estilo Dashboard (A pedido do usuário) - Menor e Compacto */}
            <header className="bg-gradient-to-br from-[#1A365D] to-[#2D5284] px-5 pt-8 pb-7 rounded-b-[30px] shadow-[0_8px_25px_rgba(26,54,93,0.2)] relative z-20 mb-6 border-b border-white/5">
                <div className="flex justify-between items-center mb-5 relative z-10">
                    <div className="flex items-center">
                        <span className="text-[24px] font-black tracking-tight text-white drop-shadow-sm">Doc<span className="text-[#D4AF37]">Match</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative text-white hover:text-[#D4AF37] transition-colors p-2 active:scale-95" onClick={() => router.push('/notificacoes')}>
                            <Bell strokeWidth={2} className="w-[22px] h-[22px]" />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#D4AF37] rounded-full border border-[#1A365D]"></span>
                        </button>
                        <button className="p-2 text-white hover:text-[#D4AF37] active:scale-95 transition-colors" onClick={() => toast.info('Configurações do Mensageiro')}>
                            <Settings strokeWidth={2} className="w-[24px] h-[24px]" />
                        </button>
                    </div>
                </div>

                {/* BUSCA OVERLAPPING */}
                <div className="absolute left-5 right-5 -bottom-6 z-30">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-[18px] h-[18px]" strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="Pesquise por mensagem ou pessoa..."
                        className="w-full bg-white border-0 rounded-[16px] py-[14px] flex items-center pl-11 pr-4 shadow-[0_4px_15px_rgba(26,54,93,0.1)] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-40 text-[14px] font-bold text-[#1A365D] outline-none placeholder:text-slate-400 placeholder:font-medium transition-shadow"
                    />
                </div>
            </header>

            {/* Lista Plana (Edge to Edge, sem gaps brutais) */}
            <main className="pt-4">
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
    );
}
