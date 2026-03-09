'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Stethoscope,
  Heart,
  Sparkles,
  Bone,
  Baby,
  User,
  Eye,
  Brain,
  Activity,
  Zap,
  Search,
  MapPin,
  Star,
  Clock,
  Calendar,
  FileText,
  Pill,
  ChevronRight,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Check,
  Building2,
  Truck,
  DollarSign,
  Filter,
  SortAsc,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Home,
  Users,
  Package,
  TrendingUp,
  Lock,
  Cookie
} from 'lucide-react'
import {
  especialidades,
  medicos,
  farmacias,
  medicamentos,
  receitas,
  usuarioPaciente,
  planosPaciente,
  planosProfissional,
  planosSaude,
  proximasConsultas,
  type Medico,
  type Receita,
} from '@/data/mockData'

// Tipos de navegação
type Tela =
  | 'landing'
  | 'cadastro-paciente'
  | 'cadastro-profissional'
  | 'login'
  | 'dashboard-paciente'
  | 'busca-medicos'
  | 'perfil-medico'
  | 'minhas-receitas'
  | 'detalhes-receita'
  | 'comparador-precos'
  | 'planos-paciente'
  | 'planos-profissional'

// Componente para ícone de especialidade
function IconeEspecialidade({ icone }: { icone: string }) {
  const icones: Record<string, React.ReactNode> = {
    Stethoscope: <Stethoscope className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />,
    Sparkles: <Sparkles className="h-6 w-6" />,
    Bone: <Bone className="h-6 w-6" />,
    Baby: <Baby className="h-6 w-6" />,
    User: <User className="h-6 w-6" />,
    Eye: <Eye className="h-6 w-6" />,
    Brain: <Brain className="h-6 w-6" />,
    Activity: <Activity className="h-6 w-6" />,
    Zap: <Zap className="h-6 w-6" />,
  }
  return <>{icones[icone] || <Stethoscope className="h-6 w-6" />}</>
}

// Modal de Cookies LGPD
function ModalLGPD({ aberto, onAceitar, onRecusar }: { aberto: boolean; onAceitar: () => void; onRecusar: () => void }) {
  return (
    <Dialog open={aberto}>
      {/* @ts-expect-error onInteractOutside is supported by Radix but not exported by shadcn UI DialogContent props */}
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e: any) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-primary" />
            <DialogTitle>Política de Privacidade e Cookies</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Utilizamos cookies e dados pessoais de acordo com a LGPD para melhorar sua experiência.
            Ao continuar, você concorda com nossa política de privacidade.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          <p className="mb-2">Coletamos dados para:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Personalizar sua experiência na plataforma</li>
            <li>Facilitar o agendamento de consultas</li>
            <li>Comparar preços de medicamentos</li>
            <li>Enviar lembretes e notificações</li>
          </ul>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onRecusar}>
            Recusar
          </Button>
          <Button onClick={onAceitar}>
            Aceitar e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Header do Dashboard
function HeaderDashboard({ telaAtual, onNavegar, menuAberto, setMenuAberto }: {
  telaAtual: Tela;
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void
}) {
  const logado = telaAtual !== 'landing' && telaAtual !== 'login' && telaAtual !== 'cadastro-paciente' && telaAtual !== 'cadastro-profissional'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {logado && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          <button onClick={() => onNavegar('landing')} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--docmatch-navy)] text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold text-[var(--docmatch-navy)]">DocMatch</span>
          </button>
        </div>

        {logado ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenuUsuario onNavegar={onNavegar} />
          </div>
        ) : (
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavegar('login')}>
              Entrar
            </Button>
            <Button onClick={() => onNavegar('cadastro-paciente')}>
              Cadastrar
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}

function DropdownMenuUsuario({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" onClick={() => setAberto(!aberto)}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={usuarioPaciente.foto} alt={usuarioPaciente.nome} />
          <AvatarFallback>{usuarioPaciente.nome.charAt(0)}</AvatarFallback>
        </Avatar>
      </Button>
      {aberto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-background shadow-lg">
            <div className="p-3 border-b">
              <p className="font-medium">{usuarioPaciente.nome}</p>
              <p className="text-sm text-muted-foreground">{usuarioPaciente.email}</p>
            </div>
            <div className="p-2">
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => { onNavegar('dashboard-paciente'); setAberto(false) }}
              >
                <Home className="h-4 w-4" /> Início
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => { onNavegar('minhas-receitas'); setAberto(false) }}
              >
                <FileText className="h-4 w-4" /> Minhas Receitas
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => { onNavegar('planos-paciente'); setAberto(false) }}
              >
                <CreditCard className="h-4 w-4" /> Meu Plano
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                <Settings className="h-4 w-4" /> Configurações
              </button>
              <Separator className="my-2" />
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent"
                onClick={() => { onNavegar('landing'); setAberto(false) }}
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Sidebar do Dashboard
function SidebarDashboard({ telaAtual, onNavegar, menuAberto }: {
  telaAtual: Tela;
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean
}) {
  const itensMenu = [
    { id: 'dashboard-paciente' as Tela, label: 'Início', icone: Home },
    { id: 'busca-medicos' as Tela, label: 'Buscar Médicos', icone: Search },
    { id: 'minhas-receitas' as Tela, label: 'Minhas Receitas', icone: FileText },
    { id: 'comparador-precos' as Tela, label: 'Comparar Preços', icone: DollarSign },
    { id: 'planos-paciente' as Tela, label: 'Meu Plano', icone: CreditCard },
  ]

  return (
    <>
      {/* Overlay mobile */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => { }} />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background
          transition-transform duration-300 md:translate-x-0
          ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="flex flex-col gap-1 p-4">
          {itensMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavegar(item.id)}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                transition-colors hover:bg-accent
                ${telaAtual === item.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
              `}
            >
              <item.icone className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-accent/50">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-1">Plano Gratuito</p>
              <p className="text-xs text-muted-foreground mb-3">Remova anúncios e tenha mais benefícios</p>
              <Button size="sm" className="w-full" onClick={() => onNavegar('planos-paciente')}>
                Fazer Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  )
}

// Footer
function Footer() {
  return (
    <footer className="border-t bg-[var(--docmatch-navy)]/5">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--docmatch-navy)] text-white font-bold">
                D
              </div>
              <span className="text-xl font-bold text-[var(--docmatch-navy)]">DocMatch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectamos você aos melhores profissionais de saúde do Brasil.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--docmatch-navy)]">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-[var(--docmatch-navy)]">Para Pacientes</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Para Médicos</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Para Farmácias</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--docmatch-navy)]">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-[var(--docmatch-navy)]">Central de Ajuda</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Contato</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">FAQ</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--docmatch-navy)]">LGPD e Privacidade</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-[var(--docmatch-navy)]">Política de Privacidade</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Termos de Uso</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Cookies</button></li>
              <li><button className="hover:text-[var(--docmatch-navy)]">Seus Direitos</button></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 DocMatch. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Shield className="h-4 w-4 text-[var(--docmatch-gold)]" />
            <span className="text-sm text-muted-foreground">Dados protegidos pela LGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Tela: Landing Page
function TelaLanding({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold">DocMatch</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavegar('login')}>
              Entrar
            </Button>
            <Button onClick={() => onNavegar('cadastro-paciente')}>
              Cadastrar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[var(--docmatch-navy)]/5 to-background">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] font-semibold">Plataforma de Saúde</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Conectamos você aos melhores{' '}
              <span className="text-[var(--docmatch-navy)]">profissionais de saúde</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Encontre médicos, agende consultas, receba receitas digitais e compare preços de medicamentos
              em farmácias perto de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 bg-[var(--docmatch-navy)] hover:bg-[var(--docmatch-navy-light)]" onClick={() => onNavegar('cadastro-paciente')}>
                <User className="h-5 w-5" />
                Sou Paciente
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-[var(--docmatch-navy)] text-[var(--docmatch-navy)] hover:bg-[var(--docmatch-navy)]/5" onClick={() => onNavegar('cadastro-profissional')}>
                <Stethoscope className="h-5 w-5" />
                Sou Profissional
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => onNavegar('cadastro-profissional')}>
                <Building2 className="h-5 w-5" />
                Sou Farmácia
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Em poucos passos, você encontra o profissional ideal e cuida da sua saúde
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--docmatch-navy)]/10 text-[var(--docmatch-navy)]">
                  <Search className="h-8 w-8" />
                </div>
                <CardTitle>1. Busque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Encontre médicos por especialidade, localização ou plano de saúde
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--docmatch-gold)]/10 text-[var(--docmatch-gold)]">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle>2. Agende</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Escolha o melhor horário e agende sua consulta online
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--docmatch-navy)]/10 text-[var(--docmatch-navy)]">
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle>3. Receba</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receba receitas digitais e compare preços de medicamentos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que usar o DocMatch?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Praticidade</h3>
                <p className="text-sm text-muted-foreground">Agende consultas 24h, sem ligar para clínicas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Segurança</h3>
                <p className="text-sm text-muted-foreground">Seus dados protegidos pela LGPD</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Economia</h3>
                <p className="text-sm text-muted-foreground">Compare preços e economize em medicamentos</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Entrega</h3>
                <p className="text-sm text-muted-foreground">Receba medicamentos em casa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades Populares */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Especialidades Populares</h2>
            <p className="text-muted-foreground">Encontre profissionais nas áreas mais procuradas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {especialidades.slice(0, 10).map((esp) => (
              <button
                key={esp.id}
                onClick={() => onNavegar('busca-medicos')}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--docmatch-navy)]/10 text-[var(--docmatch-navy)]">
                  <IconeEspecialidade icone={esp.icone} />
                </div>
                <span className="text-sm font-medium text-center">{esp.nome}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Tela: Cadastro de Paciente
function TelaCadastroPaciente({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  const [etapa, setEtapa] = useState(1)
  const [lgpdAceito, setLgpdAceito] = useState(false)
  const [planosSelecionados, setPlanosSelecionados] = useState<string[]>([])

  const togglePlano = (plano: string) => {
    setPlanosSelecionados(prev =>
      prev.includes(plano) ? prev.filter(p => p !== plano) : [...prev, plano]
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavegar('landing')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold">DocMatch</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar conta de Paciente</CardTitle>
            <CardDescription>Cadastre-se para encontrar médicos e agendar consultas</CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <div className={`h-2 w-16 rounded-full ${etapa >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-16 rounded-full ${etapa >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {etapa === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input id="nome" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nascimento">Data de nascimento *</Label>
                    <Input id="nascimento" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" placeholder="00000-000" />
                  </div>
                </div>
                <Button className="w-full" onClick={() => setEtapa(2)}>
                  Continuar
                </Button>
              </div>
            )}

            {etapa === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Planos de saúde (opcional)</Label>
                  <p className="text-sm text-muted-foreground">Selecione os planos que você possui</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {planosSaude.map((plano) => (
                      <button
                        key={plano.id}
                        onClick={() => togglePlano(plano.nome)}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors
                          ${planosSelecionados.includes(plano.nome)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-accent'}
                        `}
                      >
                        {planosSelecionados.includes(plano.nome) && <Check className="h-4 w-4" />}
                        {plano.nome}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input id="senha" type="password" placeholder="Mínimo 8 caracteres" />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                  <Checkbox
                    id="lgpd"
                    checked={lgpdAceito}
                    onCheckedChange={(checked) => setLgpdAceito(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="lgpd" className="text-sm font-medium cursor-pointer">
                      Aceito os termos de uso e política de privacidade
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Li e concordo com o tratamento dos meus dados pessoais conforme a LGPD
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setEtapa(1)} className="flex-1">
                    Voltar
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!lgpdAceito}
                    onClick={() => onNavegar('dashboard-paciente')}
                  >
                    Criar minha conta
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Button variant="link" className="p-0" onClick={() => onNavegar('login')}>
                Fazer login
              </Button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

// Tela: Cadastro de Profissional
function TelaCadastroProfissional({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  const [aba, setAba] = useState('pessoais')
  const [lgpdAceito, setLgpdAceito] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavegar('landing')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold">DocMatch</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Criar conta de Profissional</CardTitle>
              <CardDescription>Cadastre-se para receber pacientes e gerenciar sua agenda</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={aba} onValueChange={setAba}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="profissionais">Dados Profissionais</TabsTrigger>
                  <TabsTrigger value="plano">Escolher Plano</TabsTrigger>
                </TabsList>

                <TabsContent value="pessoais" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-pro">Nome completo *</Label>
                      <Input id="nome-pro" placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-pro">E-mail *</Label>
                      <Input id="email-pro" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf-pro">CPF *</Label>
                      <Input id="cpf-pro" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone-pro">Telefone *</Label>
                      <Input id="telefone-pro" placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto" onClick={() => setAba('profissionais')}>
                    Próximo: Dados Profissionais
                  </Button>
                </TabsContent>

                <TabsContent value="profissionais" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crm">CRM *</Label>
                      <Input id="crm" placeholder="CRM-SP 000000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidade">Especialidade *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {especialidades.map((esp) => (
                            <SelectItem key={esp.id} value={esp.id}>{esp.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor da consulta *</Label>
                      <Input id="valor" placeholder="R$ 0,00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Planos de saúde aceitos</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {planosSaude.map((plano) => (
                            <SelectItem key={plano.id} value={plano.id}>{plano.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço do consultório *</Label>
                    <Textarea id="endereco" placeholder="Logradouro, número, bairro, cidade - UF" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setAba('pessoais')}>
                      Voltar
                    </Button>
                    <Button onClick={() => setAba('plano')}>
                      Próximo: Escolher Plano
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="plano" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {planosProfissional.map((plano) => (
                      <Card
                        key={plano.id}
                        className={`cursor-pointer transition-all ${planoSelecionado === plano.id
                          ? 'ring-2 ring-primary'
                          : 'hover:border-primary/50'
                          } ${plano.destaque ? 'border-accent' : ''}`}
                        onClick={() => setPlanoSelecionado(plano.id)}
                      >
                        <CardHeader>
                          {plano.destaque && (
                            <Badge className="w-fit mb-2 bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] font-semibold">Mais Popular</Badge>
                          )}
                          <CardTitle>{plano.nome}</CardTitle>
                          <div className="text-3xl font-bold">
                            R$ {plano.preco}<span className="text-sm font-normal text-muted-foreground">/mês</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plano.recursos.map((recurso, idx) => (
                              <li key={idx} className={`flex items-center gap-2 text-sm ${!recurso.disponivel ? 'text-muted-foreground' : ''}`}>
                                {recurso.disponivel ? (
                                  <Check className="h-4 w-4 text-accent" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                                {recurso.nome}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                    <Checkbox
                      id="lgpd-pro"
                      checked={lgpdAceito}
                      onCheckedChange={(checked) => setLgpdAceito(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="lgpd-pro" className="text-sm font-medium cursor-pointer">
                        Aceito os termos de uso e política de privacidade
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Li e concordo com o tratamento dos meus dados pessoais conforme a LGPD
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setAba('profissionais')}>
                      Voltar
                    </Button>
                    <Button
                      disabled={!lgpdAceito || !planoSelecionado}
                      onClick={() => onNavegar('dashboard-paciente')}
                    >
                      Criar minha conta
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Button variant="link" className="p-0" onClick={() => onNavegar('login')}>
                  Fazer login
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Tela: Login
function TelaLogin({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavegar('landing')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold">DocMatch</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Entrar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou continue com e-mail</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-login">E-mail</Label>
              <Input id="email-login" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha-login">Senha</Label>
              <Input id="senha-login" type="password" placeholder="Sua senha" />
            </div>
            <div className="flex justify-end">
              <Button variant="link" className="p-0 text-sm">
                Esqueci minha senha
              </Button>
            </div>
            <Button className="w-full" onClick={() => onNavegar('dashboard-paciente')}>
              Entrar
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Button variant="link" className="p-0" onClick={() => onNavegar('cadastro-paciente')}>
                Cadastre-se
              </Button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

// Tela: Dashboard do Paciente
function TelaDashboardPaciente({ onNavegar, menuAberto, setMenuAberto }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="dashboard-paciente"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="dashboard-paciente"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-6xl">
          {/* Saudação */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Olá, {usuarioPaciente.nome.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Veja o resumo da sua saúde</p>
          </div>

          {/* Cards de resumo */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Próximas consultas</CardDescription>
                <CardTitle className="text-2xl">2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">agendadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Receitas ativas</CardDescription>
                <CardTitle className="text-2xl">2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">disponíveis para uso</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[var(--docmatch-navy)] to-[var(--docmatch-navy-dark)] text-white border-[var(--docmatch-gold)]/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/80">Economia total</CardDescription>
                <CardTitle className="text-2xl text-[var(--docmatch-gold)]">R$ 127,00</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">em medicamentos este mês</p>
              </CardContent>
            </Card>
          </div>

          {/* Próximas consultas */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Próximas consultas</h2>
            <div className="space-y-3">
              {proximasConsultas.map((consulta) => (
                <Card key={consulta.id} className="flex items-center p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--docmatch-navy)]/10 text-[var(--docmatch-navy)] mr-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{consulta.medicoNome}</p>
                    <p className="text-sm text-muted-foreground">{consulta.especialidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{consulta.data}</p>
                    <p className="text-sm text-muted-foreground">{consulta.horario}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-4">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Buscar por especialidade */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Buscar por especialidade</h2>
              <Button variant="outline" size="sm" onClick={() => onNavegar('busca-medicos')}>
                Ver todas
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {especialidades.slice(0, 5).map((esp) => (
                <button
                  key={esp.id}
                  onClick={() => onNavegar('busca-medicos')}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--docmatch-navy)]/10 text-[var(--docmatch-navy)]">
                    <IconeEspecialidade icone={esp.icone} />
                  </div>
                  <span className="text-sm font-medium text-center">{esp.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Promoção do plano Plus */}
          <Card className="bg-gradient-to-r from-[var(--docmatch-navy)] to-[var(--docmatch-navy-dark)] text-white border border-[var(--docmatch-gold)]/30">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <Badge className="bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] font-semibold mb-2">Plano Plus</Badge>
                <h3 className="text-xl font-bold mb-2">Remova anúncios e tenha mais benefícios</h3>
                <p className="text-white/80 text-sm">
                  Suporte prioritário, sem anúncios, descontos exclusivos e muito mais por apenas R$19/mês
                </p>
              </div>
              <Button className="bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] hover:bg-[var(--docmatch-gold-light)] font-semibold" onClick={() => onNavegar('planos-paciente')}>
                Conhecer planos
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Tela: Busca de Médicos
function TelaBuscaMedicos({ onNavegar, menuAberto, setMenuAberto }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void
}) {
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState('')
  const [distancia, setDistancia] = useState([10])
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null)

  const medicosFiltrados = especialidadeFiltro
    ? medicos.filter(m => m.especialidadeId === especialidadeFiltro)
    : medicos

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="busca-medicos"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="busca-medicos"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Buscar Médicos</h1>

          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Especialidade</Label>
                  <Select value={especialidadeFiltro} onValueChange={(val) => setEspecialidadeFiltro(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp.id} value={esp.id}>{esp.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <div className="flex gap-2">
                    <Input placeholder="CEP" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Distância: {distancia[0]}km</Label>
                  <Slider value={distancia} onValueChange={(val: any) => setDistancia(val)} max={50} min={1} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Plano de saúde</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {planosSaude.map((plano) => (
                        <SelectItem key={plano.id} value={plano.id}>{plano.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">{medicosFiltrados.length} médicos encontrados</p>
            <Button variant="outline" size="sm" className="gap-2">
              <SortAsc className="h-4 w-4" />
              Ordenar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {medicosFiltrados.map((medico) => (
              <Card key={medico.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex p-4">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={medico.foto} alt={medico.nome} />
                      <AvatarFallback>{medico.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{medico.nome}</h3>
                      <p className="text-sm text-muted-foreground">{medico.crm}</p>
                      <Badge variant="secondary" className="mt-1">{medico.especialidade}</Badge>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-[var(--docmatch-gold)] text-[var(--docmatch-gold)]" />
                        <span className="text-sm font-medium">{medico.nota}</span>
                        <span className="text-sm text-muted-foreground">({medico.totalAvaliacoes} avaliações)</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{medico.endereco.logradouro}, {medico.endereco.numero}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--docmatch-navy)]">R$ {medico.valorConsulta.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setMedicoSelecionado(medico)}>
                          Ver perfil
                        </Button>
                        <Button size="sm" onClick={() => {
                          setMedicoSelecionado(medico)
                        }}>
                          Agendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de perfil do médico */}
      {medicoSelecionado && (
        <Dialog open={!!medicoSelecionado} onOpenChange={() => setMedicoSelecionado(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Perfil do Médico</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Informações principais */}
              <div className="flex gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={medicoSelecionado.foto} alt={medicoSelecionado.nome} />
                  <AvatarFallback>{medicoSelecionado.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{medicoSelecionado.nome}</h2>
                  <p className="text-muted-foreground">{medicoSelecionado.crm}</p>
                  <Badge variant="secondary" className="mt-1">{medicoSelecionado.especialidade}</Badge>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{medicoSelecionado.nota}</span>
                    <span className="text-muted-foreground">({medicoSelecionado.totalAvaliacoes} avaliações)</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">Sobre</h3>
                <p className="text-muted-foreground">{medicoSelecionado.bio}</p>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="font-semibold mb-2">Endereço</h3>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <div>
                    <p>{medicoSelecionado.endereco.logradouro}, {medicoSelecionado.endereco.numero}</p>
                    {medicoSelecionado.endereco.complemento && <p>{medicoSelecionado.endereco.complemento}</p>}
                    <p>{medicoSelecionado.endereco.bairro} - {medicoSelecionado.endereco.cidade}/{medicoSelecionado.endereco.estado}</p>
                    <p>CEP: {medicoSelecionado.endereco.cep}</p>
                  </div>
                </div>
              </div>

              {/* Planos aceitos */}
              <div>
                <h3 className="font-semibold mb-2">Planos de saúde aceitos</h3>
                <div className="flex flex-wrap gap-2">
                  {medicoSelecionado.planosAceitos.map((plano) => (
                    <Badge key={plano} variant="outline">{plano}</Badge>
                  ))}
                </div>
              </div>

              {/* Avaliações */}
              <div>
                <h3 className="font-semibold mb-2">Avaliações recentes</h3>
                <div className="space-y-3">
                  {medicoSelecionado.avaliacoes.map((avaliacao) => (
                    <div key={avaliacao.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{avaliacao.paciente}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[var(--docmatch-gold)] text-[var(--docmatch-gold)]" />
                          <span>{avaliacao.nota}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{avaliacao.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disponibilidade */}
              <div>
                <h3 className="font-semibold mb-2">Disponibilidade</h3>
                <div className="grid grid-cols-5 gap-2">
                  {medicoSelecionado.disponibilidade.map((dia) => (
                    <div key={dia.dia} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{dia.dia}</p>
                      <div className="space-y-1">
                        {dia.horarios.slice(0, 3).map((horario) => (
                          <Button key={horario} variant="outline" size="sm" className="w-full text-xs">
                            {horario}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valor e botão */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Valor da consulta</p>
                  <p className="text-2xl font-bold text-[var(--docmatch-navy)]">R$ {medicoSelecionado.valorConsulta.toFixed(2)}</p>
                </div>
                <Button onClick={() => setMedicoSelecionado(null)}>
                  Agendar consulta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Tela: Minhas Receitas
function TelaMinhasReceitas({ onNavegar, menuAberto, setMenuAberto, onSelecionarReceita }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
  onSelecionarReceita: (receita: Receita) => void
}) {
  const [filtroStatus, setFiltroStatus] = useState<string>('todas')

  const receitasFiltradas = filtroStatus === 'todas'
    ? receitas
    : receitas.filter(r => r.status === filtroStatus)

  const statusBadge = (status: string) => {
    const estilos: Record<string, string> = {
      ativa: 'bg-accent text-accent-foreground',
      utilizada: 'bg-secondary text-secondary-foreground',
      expirada: 'bg-muted text-muted-foreground',
    }
    return estilos[status] || ''
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="minhas-receitas"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="minhas-receitas"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Minhas Receitas</h1>

          {/* Filtros */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filtroStatus === 'todas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroStatus('todas')}
            >
              Todas
            </Button>
            <Button
              variant={filtroStatus === 'ativa' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroStatus('ativa')}
            >
              Ativas
            </Button>
            <Button
              variant={filtroStatus === 'utilizada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroStatus('utilizada')}
            >
              Utilizadas
            </Button>
            <Button
              variant={filtroStatus === 'expirada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroStatus('expirada')}
            >
              Expiradas
            </Button>
          </div>

          {/* Lista de receitas */}
          <div className="space-y-4">
            {receitasFiltradas.map((receita) => (
              <Card key={receita.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{receita.codigo}</span>
                        <Badge className={statusBadge(receita.status)}>
                          {receita.status.charAt(0).toUpperCase() + receita.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="font-medium">{receita.medicoNome}</p>
                      <p className="text-sm text-muted-foreground">
                        Emitida em {receita.dataEmissao} • Válida até {receita.validade}
                      </p>
                      <p className="text-sm mt-2">
                        {receita.medicamentos.length} medicamento(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onSelecionarReceita(receita)
                          onNavegar('detalhes-receita')
                        }}
                      >
                        Ver detalhes
                      </Button>
                      {receita.status === 'ativa' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            onSelecionarReceita(receita)
                            onNavegar('comparador-precos')
                          }}
                        >
                          Comparar preços
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Tela: Detalhes da Receita
function TelaDetalhesReceita({ onNavegar, menuAberto, setMenuAberto, receita }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
  receita: Receita | null
}) {
  if (!receita) {
    return (
      <div className="min-h-screen bg-muted/30">
        <HeaderDashboard
          telaAtual="detalhes-receita"
          onNavegar={onNavegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
        <main className="md:ml-64 p-6">
          <p>Receita não encontrada</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="detalhes-receita"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="detalhes-receita"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-4xl">
          <Button variant="ghost" className="mb-4" onClick={() => onNavegar('minhas-receitas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Receita {receita.codigo}</CardTitle>
                  <CardDescription>
                    Emitida por {receita.medicoNome} em {receita.dataEmissao}
                  </CardDescription>
                </div>
                <div className="text-right">
                  {/* QR Code placeholder */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">QR Code</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Válida até {receita.validade}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

              {/* Lista de medicamentos */}
              <div>
                <h3 className="font-semibold mb-4">Medicamentos</h3>
                <div className="space-y-4">
                  {receita.medicamentos.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--docmatch-gold)]/10 text-[var(--docmatch-gold)]">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{med.nome} {med.dosagem}</p>
                        <p className="text-sm text-muted-foreground">Posologia: {med.posologia}</p>
                        <p className="text-sm text-muted-foreground">Quantidade: {med.quantidade} unidade(s)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Médico */}
              <div>
                <h3 className="font-semibold mb-2">Profissional que emitiu</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={medicos.find(m => m.id === receita.medicoId)?.foto} />
                    <AvatarFallback>{receita.medicoNome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{receita.medicoNome}</p>
                    <p className="text-sm text-muted-foreground">{medicos.find(m => m.id === receita.medicoId)?.crm}</p>
                  </div>
                </div>
              </div>

              {receita.status === 'ativa' && (
                <Button className="w-full" onClick={() => onNavegar('comparador-precos')}>
                  Comparar preços em farmácias
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Tela: Comparador de Preços
function TelaComparadorPrecos({ onNavegar, menuAberto, setMenuAberto, receita }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
  receita: Receita | null
}) {
  const [modoComparacao, setModoComparacao] = useState<'individual' | 'cesta'>('cesta')
  const [medicamentosSelecionados, setMedicamentosSelecionados] = useState<string[]>(
    receita?.medicamentos.map(m => m.medicamentoId) || []
  )
  const [raio, setRaio] = useState([5])

  const toggleMedicamento = (id: string) => {
    setMedicamentosSelecionados(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  // Calcular preços por farmácia
  const calcularPrecosPorFarmacia = () => {
    const precosPorFarmacia: Record<string, { farmacia: typeof farmacias[0], total: number, disponiveis: number }> = {}

    farmacias.forEach(farmacia => {
      let total = 0
      let disponiveis = 0

      medicamentosSelecionados.forEach(medId => {
        const medicamento = medicamentos.find(m => m.id === medId)
        if (medicamento) {
          const precoInfo = medicamento.precos.find(p => p.farmaciaId === farmacia.id)
          if (precoInfo?.disponivel) {
            total += precoInfo.preco
            disponiveis++
          }
        }
      })

      if (disponiveis > 0) {
        precosPorFarmacia[farmacia.id] = { farmacia, total, disponiveis }
      }
    })

    return Object.values(precosPorFarmacia).sort((a, b) => a.total - b.total)
  }

  const resultados = calcularPrecosPorFarmacia()
  const menorPreco = resultados[0]?.total

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="comparador-precos"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="comparador-precos"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Comparador de Preços</h1>

          {/* Seleção de medicamentos */}
          {receita && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Medicamentos da receita {receita.codigo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {receita.medicamentos.map((med) => (
                    <button
                      key={med.medicamentoId}
                      onClick={() => toggleMedicamento(med.medicamentoId)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border text-left transition-colors
                        ${medicamentosSelecionados.includes(med.medicamentoId)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-accent'}
                      `}
                    >
                      <Checkbox
                        checked={medicamentosSelecionados.includes(med.medicamentoId)}
                        className={medicamentosSelecionados.includes(med.medicamentoId) ? 'border-white' : ''}
                      />
                      <div>
                        <p className="font-medium">{med.nome}</p>
                        <p className="text-sm opacity-80">{med.dosagem}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Modo de comparação</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={modoComparacao === 'individual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setModoComparacao('individual')}
                    >
                      Medicamento a medicamento
                    </Button>
                    <Button
                      variant={modoComparacao === 'cesta' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setModoComparacao('cesta')}
                    >
                      Cesta completa
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Raio de distância: {raio[0]}km</Label>
                  <Slider value={raio} onValueChange={(val: any) => setRaio(val)} max={20} min={1} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select defaultValue="preco">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preco">Menor preço</SelectItem>
                      <SelectItem value="distancia">Menor distância</SelectItem>
                      <SelectItem value="entrega">Tempo de entrega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <h2 className="text-lg font-semibold mb-4">
            {resultados.length} farmácias encontradas
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {resultados.map((resultado, idx) => (
              <Card key={resultado.farmacia.id} className={idx === 0 ? 'ring-2 ring-accent' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--docmatch-navy)]/10">
                        <Building2 className="h-6 w-6 text-[var(--docmatch-navy)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{resultado.farmacia.nome}</h3>
                          {idx === 0 && (
                            <Badge className="bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] font-semibold">Mais barato</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {resultado.farmacia.distancia}km de distância
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--docmatch-navy)]">R$ {resultado.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{resultado.disponiveis} de {medicamentosSelecionados.length} disponíveis</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{resultado.farmacia.endereco.bairro}</span>
                    </div>
                    {resultado.farmacia.entregaOnline && (
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>{resultado.farmacia.tempoEntrega}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {resultado.farmacia.entregaOnline && (
                      <Button className="flex-1">
                        Comprar online
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1">
                      Ver no mapa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Tela: Planos do Paciente
function TelaPlanosPaciente({ onNavegar, menuAberto, setMenuAberto }: {
  onNavegar: (tela: Tela) => void;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderDashboard
        telaAtual="planos-paciente"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />
      <SidebarDashboard
        telaAtual="planos-paciente"
        onNavegar={onNavegar}
        menuAberto={menuAberto}
      />
      <main className="md:ml-64 p-6">
        <div className="container max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Escolha seu plano</h1>
            <p className="text-muted-foreground">Tenha mais benefícios e uma experiência sem anúncios</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {planosPaciente.map((plano) => (
              <Card
                key={plano.id}
                className={`relative ${plano.destaque ? 'ring-2 ring-[var(--docmatch-gold)] bg-gradient-to-b from-[var(--docmatch-navy)]/5 to-transparent' : ''}`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)] font-semibold">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">R$ {plano.preco}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plano.recursos.map((recurso, idx) => (
                      <li key={idx} className={`flex items-center gap-3 text-sm ${!recurso.disponivel ? 'text-muted-foreground' : ''}`}>
                        {recurso.disponivel ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--docmatch-gold)] text-[var(--docmatch-navy-dark)]">
                            <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                            <X className="h-3 w-3" />
                          </div>
                        )}
                        {recurso.nome}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plano.destaque ? 'default' : 'outline'}
                    disabled={plano.id === 'gratuito'}
                  >
                    {plano.id === 'gratuito' ? 'Plano atual' : 'Assinar agora'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Garantias */}
          <Card className="mt-8 border-[var(--docmatch-gold)]/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--docmatch-navy)] text-[var(--docmatch-gold)]">
                <Shield className="h-8 w-8" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-semibold mb-1">Garantia de 7 dias</h3>
                <p className="text-sm text-muted-foreground">
                  Se não estiver satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Componente Principal
export default function DocMatch() {
  const [telaAtual, setTelaAtual] = useState<Tela>('landing')
  const [cookiesAceitos, setCookiesAceitos] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null)

  // Verificar se já aceitou cookies
  useEffect(() => {
    const aceitou = localStorage.getItem('lgpd_aceito')
    if (aceitou) {
      setCookiesAceitos(true)
    }
  }, [])

  const aceitarCookies = () => {
    localStorage.setItem('lgpd_aceito', 'true')
    setCookiesAceitos(true)
  }

  const recusarCookies = () => {
    localStorage.setItem('lgpd_aceito', 'false')
    setCookiesAceitos(true)
  }

  const navegar = (tela: Tela) => {
    setTelaAtual(tela)
    setMenuAberto(false)
  }

  const selecionarReceita = (receita: Receita) => {
    setReceitaSelecionada(receita)
  }

  return (
    <>
      {/* Modal de Cookies LGPD */}
      <ModalLGPD
        aberto={!cookiesAceitos}
        onAceitar={aceitarCookies}
        onRecusar={recusarCookies}
      />

      {/* Renderização das telas */}
      {telaAtual === 'landing' && <TelaLanding onNavegar={navegar} />}
      {telaAtual === 'cadastro-paciente' && <TelaCadastroPaciente onNavegar={navegar} />}
      {telaAtual === 'cadastro-profissional' && <TelaCadastroProfissional onNavegar={navegar} />}
      {telaAtual === 'login' && <TelaLogin onNavegar={navegar} />}
      {telaAtual === 'dashboard-paciente' && (
        <TelaDashboardPaciente
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      )}
      {telaAtual === 'busca-medicos' && (
        <TelaBuscaMedicos
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      )}
      {telaAtual === 'minhas-receitas' && (
        <TelaMinhasReceitas
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
          onSelecionarReceita={selecionarReceita}
        />
      )}
      {telaAtual === 'detalhes-receita' && (
        <TelaDetalhesReceita
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
          receita={receitaSelecionada}
        />
      )}
      {telaAtual === 'comparador-precos' && (
        <TelaComparadorPrecos
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
          receita={receitaSelecionada}
        />
      )}
      {telaAtual === 'planos-paciente' && (
        <TelaPlanosPaciente
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      )}
      {telaAtual === 'planos-profissional' && (
        <TelaPlanosPaciente
          onNavegar={navegar}
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
        />
      )}
    </>
  )
}
