import { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Calendar, 
  FileText, 
  TrendingDown, 
  Shield, 
  ChevronRight,
  Star,
  Users,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';

export function LandingPage() {
  const [searchSpecialty, setSearchSpecialty] = useState('');

  const features = [
    {
      icon: Search,
      title: 'Encontre o médico ideal',
      description: 'Busque por especialidade, localização, plano de saúde ou valor da consulta.',
    },
    {
      icon: Calendar,
      title: 'Agende com facilidade',
      description: 'Veja horários disponíveis em tempo real e agende sua consulta em poucos cliques.',
    },
    {
      icon: FileText,
      title: 'Receita digital segura',
      description: 'Receba suas prescrições digitalmente com validade e assinatura eletrônica.',
    },
    {
      icon: TrendingDown,
      title: 'Economize em medicamentos',
      description: 'Compare preços em várias farmácias e encontre a melhor opção para sua cesta.',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Cadastre-se gratuitamente',
      description: 'Crie sua conta em menos de 2 minutos. É rápido, fácil e seguro.',
    },
    {
      step: '02',
      title: 'Encontre seu médico',
      description: 'Filtre por especialidade, localização, plano de saúde e preço.',
    },
    {
      step: '03',
      title: 'Agende sua consulta',
      description: 'Escolha o melhor horário e confirme seu agendamento.',
    },
    {
      step: '04',
      title: 'Economize nos remédios',
      description: 'Após a consulta, compare preços e compre pelo melhor valor.',
    },
  ];

  const stats = [
    { value: '10.000+', label: 'Médicos cadastrados', icon: Users },
    { value: '500+', label: 'Farmácias parceiras', icon: Building2 },
    { value: '1M+', label: 'Consultas realizadas', icon: Calendar },
    { value: '4.8', label: 'Avaliação média', icon: Star },
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Paciente',
      content: 'Consegui encontrar uma dermatologista excelente perto de casa e ainda economizei 30% nos medicamentos!',
      rating: 5,
    },
    {
      name: 'Dr. Carlos Lima',
      role: 'Médico',
      content: 'O DocMatch revolucionou minha clínica. Consigo atender mais pacientes e gerenciar tudo digitalmente.',
      rating: 5,
    },
    {
      name: 'Ana Paula',
      role: 'Paciente',
      content: 'A comparação de preços é incrível. Agora sei exatamente onde comprar meus remédios mais barato.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,18%)] to-[hsl(222,47%,12%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[hsl(45,80%,47%)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[hsl(222,35%,25%)]/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(222,35%,20%)] border border-[hsl(222,20%,25%)] mb-8">
              <Shield className="w-4 h-4 text-[hsl(45,80%,47%)]" />
              <span className="text-sm text-gray-300">100% em conformidade com a LGPD</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Encontre médicos e{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(45,80%,47%)] to-[hsl(45,80%,55%)]">
                economize
              </span>{' '}
              em medicamentos
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              A plataforma completa que conecta pacientes, médicos e farmácias. 
              Agende consultas, receba receitas digitais e compare preços de remédios.
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="flex gap-3 p-2 bg-[hsl(222,35%,15%)] rounded-2xl border border-[hsl(222,20%,25%)]">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Qual especialidade você procura?"
                    value={searchSpecialty}
                    onChange={(e) => setSearchSpecialty(e.target.value)}
                    className="pl-12 h-14 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0"
                  />
                </div>
                <Button 
                  className="h-14 px-8 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow rounded-xl"
                  asChild
                >
                  <a href={`/buscar?especialidade=${encodeURIComponent(searchSpecialty)}`}>
                    Buscar
                  </a>
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="h-14 px-8 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
                asChild
              >
                <a href="/cadastro">
                  <Users className="w-5 h-5 mr-2" />
                  Sou Paciente
                </a>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-8 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
                asChild
              >
                <a href="/medicos/cadastro">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Sou Médico
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[hsl(222,20%,25%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(222,35%,20%)] mb-4">
                  <stat.icon className="w-6 h-6 text-[hsl(45,80%,47%)]" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo em uma só plataforma
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              DocMatch reúne tudo o que você precisa para cuidar da sua saúde de forma prática e econômica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[hsl(222,47%,12%)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[hsl(222,47%,10%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Como funciona
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Em poucos passos, você encontra seu médico e economiza nos medicamentos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-[hsl(222,35%,20%)] mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-[hsl(222,20%,25%)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              O que dizem sobre nós
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Milhares de pacientes e médicos já estão usando o DocMatch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[hsl(45,80%,47%)] text-[hsl(45,80%,47%)]" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[hsl(222,35%,18%)] to-[hsl(222,35%,15%)] border border-[hsl(222,20%,25%)] p-8 sm:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(45,80%,47%)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[hsl(222,35%,25%)]/30 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Cadastre-se gratuitamente e descubra como o DocMatch pode facilitar sua vida e economizar seu dinheiro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="h-14 px-8 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
                  asChild
                >
                  <a href="/cadastro">Criar conta gratuita</a>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
                  asChild
                >
                  <a href="/planos">Ver planos</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[hsl(222,20%,25%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[hsl(222,47%,12%)]" />
                </div>
                <span className="text-lg font-bold text-white">
                  Doc<span className="text-[hsl(45,80%,47%)]">Match</span>
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Conectando pacientes, médicos e farmácias de forma inteligente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Para Pacientes</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/buscar" className="hover:text-[hsl(45,80%,47%)]">Buscar médicos</a></li>
                <li><a href="/planos" className="hover:text-[hsl(45,80%,47%)]">Planos</a></li>
                <li><a href="/como-funciona" className="hover:text-[hsl(45,80%,47%)]">Como funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Para Médicos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/medicos/cadastro" className="hover:text-[hsl(45,80%,47%)]">Cadastre-se</a></li>
                <li><a href="/medicos/planos" className="hover:text-[hsl(45,80%,47%)]">Planos profissionais</a></li>
                <li><a href="/medicos/beneficios" className="hover:text-[hsl(45,80%,47%)]">Benefícios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacidade" className="hover:text-[hsl(45,80%,47%)]">Política de Privacidade</a></li>
                <li><a href="/termos" className="hover:text-[hsl(45,80%,47%)]">Termos de Uso</a></li>
                <li><a href="/lgpd" className="hover:text-[hsl(45,80%,47%)]">LGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[hsl(222,20%,25%)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 DocMatch. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>LGPD Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
