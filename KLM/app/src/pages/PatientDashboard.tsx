import {
  Calendar,
  FileText,
  Heart,
  Star,
  ChevronRight,
  Bell,
  Scale,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { pacienteMock, receitaMock, medicosMock } from '@/data/mockData';

export function PatientDashboard() {
  const paciente = pacienteMock;
  const medicosFavoritos = medicosMock.filter(m => paciente.favoritos?.includes(m.id));

  const handleVerReceita = () => {
    window.location.href = '/receitas/rec_001';
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] pb-24 font-sans">

      {/* HEADER SUPERIOR E BUSCA IGUAL AO MOCKUP */}
      <header className="bg-[#2D5284] px-5 pt-10 pb-6 rounded-b-2xl shadow-md relative z-20">
        <div className="flex justify-between items-center mb-6">
          {/* Esquerda: Avatar e Olá */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border border-white/20 shadow-sm">
              <AvatarImage src={'https://i.pravatar.cc/150?u=joce'} />
              <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white">JM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-normal">Olá,</span>
              <span className="text-white text-base font-bold leading-tight">{paciente.nome}</span>
            </div>
          </div>

          {/* Direita: Sino e Logo */}
          <div className="flex items-center gap-5">
            <button className="relative text-white hover:text-gray-200 transition-colors">
              <Bell strokeWidth={2} className="w-[20px] h-[20px]" />
            </button>
            <div className="flex items-center">
              <span className="text-[18px] font-bold text-[#D4AF37]">Doc</span>
              <span className="text-[18px] font-bold text-white ml-[1px]">Match</span>
            </div>
          </div>
        </div>

        {/* BUSCA */}
        <div className="relative group mt-2">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por especialidade ou sintoma..."
            className="w-full bg-white border-0 rounded-[14px] py-[14px] flex items-center pr-12 shadow-[0_4px_14px_rgba(0,0,0,0.1)] focus:ring-0 text-[13px] font-medium text-slate-500 outline-none placeholder:text-slate-400"
            style={{ paddingLeft: '3rem' }}
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
      </header>

      <main className="px-5 mt-6 relative z-30 max-w-7xl mx-auto">

        {/* Health Plan Badge */}
        {paciente.plano_saude && (
          <div className="mb-6 flex gap-2">
            <Badge variant="secondary" className="px-4 py-2 bg-[hsl(222,35%,20%)] text-gray-300 border border-[hsl(222,20%,25%)]">
              <Heart className="w-4 h-4 mr-2 text-[hsl(45,80%,47%)]" />
              {paciente.plano_saude.nome}
            </Badge>
          </div>
        )}

        {/* Banner Econonia Pill - Dourado */}
        <div className="bg-gradient-to-r from-[#D4AF37] via-[#FDF5E6] to-[#D4AF37] p-[1.5px] rounded-full shadow-lg mb-8 mx-1">
          <div className="bg-gradient-to-r from-[#cfb042] to-[#b39122] rounded-full py-2.5 px-5 flex items-center justify-center gap-2">
            <span className="text-sm">💰</span>
            <p className="text-[12px] font-bold text-[#1A365D] uppercase tracking-wide">Economia Acumulada: R$ 450,00</p>
          </div>
        </div>

        {/* Quick Actions (Mockup Style) */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Agendar', desc: 'Consulta', icon: <Calendar strokeWidth={1.5} className="w-6 h-6" /> },
            { label: 'Minhas', desc: 'Receitas', icon: <FileText strokeWidth={1.5} className="w-6 h-6" /> },
            { label: 'Comparador', desc: 'de Preços', icon: <Scale strokeWidth={1.5} className="w-6 h-6" /> },
            { label: 'Minha', desc: 'Cesta', icon: <ShoppingBag strokeWidth={1.5} className="w-6 h-6" /> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <button className="w-16 h-16 rounded-[20px] bg-[#1A365D] flex items-center justify-center text-white mb-2 shadow-md hover:bg-[#2D5284] transition-colors">
                {item.icon}
              </button>
              <span className="text-[10px] font-bold text-center leading-tight truncate w-full text-slate-800">{item.label}</span>
              <span className="text-[10px] font-bold text-center leading-tight truncate w-full text-slate-800">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments (Carousel) */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 text-[13px]">Agendamentos Pendentes</h3>
            <button className="text-[11px] font-semibold text-[#D4AF37]">Mostrar todos</button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4">
            {/* Usando array fixo de 2 pra mostrar o slide parcial independentemente do mock ser 1 */}
            {[
              { nome: 'Dr. Lucas Pereira', esp: 'Cardiologista', img: 'https://i.pravatar.cc/150?u=lucas', data: 'Amanhã 10:00' },
              { nome: 'Dra. Ana Silva', esp: 'Pediatra', img: 'https://i.pravatar.cc/150?u=ana', data: 'Dia 12 15:30' }
            ].map((c, i) => (
              <div key={i} className="min-w-[88%] snap-center bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
                <img src={c.img} className="w-14 h-14 rounded-2xl object-cover bg-slate-50" alt={c.nome} />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800">{c.nome}</h4>
                  <p className="text-[11px] text-slate-500">{c.esp}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.data}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Prescriptions */}
        <Card className="mb-6 bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                Prescrições Recentes
              </CardTitle>
              <a href="/receitas" className="text-sm text-[hsl(45,80%,47%)] hover:underline flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div
                onClick={handleVerReceita}
                className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(222,47%,12%)] hover:bg-[hsl(222,35%,20%)] cursor-pointer transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={medicosMock[0].foto_url} />
                  <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white">
                    {medicosMock[0].nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{medicosMock[0].nome}</p>
                  <p className="text-sm text-gray-400">{medicosMock[0].especialidade}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(receitaMock.data_emissao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[hsl(45,80%,47%)]/20 text-[hsl(45,80%,47%)] border-0">
                    {receitaMock.medicamentos.length} medicamentos
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Doctors */}
        {medicosFavoritos.length > 0 && (
          <Card className="mb-6 bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                  Médicos Favoritos
                </CardTitle>
                <a href="/favoritos" className="text-sm text-[hsl(45,80%,47%)] hover:underline flex items-center gap-1">
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {medicosFavoritos.map((medico) => (
                  <a
                    key={medico.id}
                    href={`/medicos/${medico.id}`}
                    className="flex-shrink-0 w-40 p-4 rounded-xl bg-[hsl(222,47%,12%)] hover:bg-[hsl(222,35%,20%)] transition-colors"
                  >
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={medico.foto_url} />
                      <AvatarFallback className="bg-[hsl(222,35%,20%)] text-white">
                        {medico.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-white text-center truncate">{medico.nome}</p>
                    <p className="text-xs text-gray-400 text-center">{medico.especialidade}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-[hsl(45,80%,47%)] text-[hsl(45,80%,47%)]" />
                      <span className="text-xs text-gray-300">{medico.avaliacao}</span>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eco / Premium Strip Banner (Horizontal & Discreto) */}
        {paciente.assinatura?.plano === 'gratuito' && (
          <div className="mb-6 relative w-full h-24 rounded-2xl overflow-hidden shadow-lg border border-[hsl(45,80%,47%)]/30 flex items-center justify-between px-5 bg-gradient-to-r from-[#1A365D] via-[#2A4365] to-[#1A365D]">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#8C7326]"></div>
            <div className="flex-1 ml-3">
              <h3 className="text-[13px] font-black text-white leading-tight uppercase tracking-tight">Faça o Upgrade para o<br /><span className="text-[#D4AF37]">DocMatch Premium!</span></h3>
              <p className="text-[9px] text-gray-300 mt-1 block">✓ Agendamentos Prioritários &nbsp; ✓ Descontos</p>
            </div>
            <button onClick={() => window.location.href = '/planos'} className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full py-2 px-4 shadow-[0_4px_10px_rgba(212,175,55,0.3)]">
              <span className="block text-[10px] font-black text-[#1A365D] uppercase text-center leading-none">Assine Agora!</span>
              <span className="block text-[8px] font-medium text-[#1A365D] text-center mt-0.5">R$ 39,90/Mês</span>
            </button>
          </div>
        )}
      </main>

      <BottomNav activeTab="inicio" />
    </div>
  );
}
