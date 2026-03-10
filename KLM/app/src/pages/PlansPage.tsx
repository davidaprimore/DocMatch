import { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Star, 
  Shield, 
  ChevronLeft,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { planosAssinaturaPaciente, planosAssinaturaMedico } from '@/data/mockData';
import { toast } from 'sonner';

export function PlansPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [userType, setUserType] = useState<'paciente' | 'medico'>('paciente');

  const handleSubscribe = (planId: string) => {
    toast.success(`Redirecionando para pagamento do plano ${planId}...`);
  };

  const plans = userType === 'paciente' ? planosAssinaturaPaciente : planosAssinaturaMedico;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] pb-24">
      <Header userType="paciente" />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-400 hover:text-white -ml-4"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(222,35%,20%)] border border-[hsl(222,20%,25%)] mb-6">
            <Crown className="w-4 h-4 text-[hsl(45,80%,47%)]" />
            <span className="text-sm text-gray-300">Escolha o plano ideal para você</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Planos DocMatch
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Escolha o plano que melhor atende suas necessidades. 
            Todos os planos incluem suporte e atualizações gratuitas.
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex justify-center mb-8">
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'paciente' | 'medico')}>
            <TabsList className="bg-[hsl(222,35%,15%)] border border-[hsl(222,20%,25%)]">
              <TabsTrigger 
                value="paciente"
                className="data-[state=active]:gold-gradient data-[state=active]:text-[hsl(222,47%,12%)]"
              >
                <Star className="w-4 h-4 mr-2" />
                Para Pacientes
              </TabsTrigger>
              <TabsTrigger 
                value="medico"
                className="data-[state=active]:gold-gradient data-[state=active]:text-[hsl(222,47%,12%)]"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Para Médicos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Mensal</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Anual
            <Badge className="ml-2 bg-green-500/20 text-green-400 border-0">
              Economize 20%
            </Badge>
          </span>
        </div>

        {/* Plans Grid */}
        <div className={`grid gap-6 ${plans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.destaque 
                  ? 'bg-gradient-to-b from-[hsl(222,35%,15%)] to-[hsl(45,30%,12%)] border-[hsl(45,80%,47%)]' 
                  : 'bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]'
              }`}
            >
              {plan.destaque && (
                <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
              )}
              
              {plan.destaque && (
                <div className="absolute top-4 right-4">
                  <Badge className="gold-gradient text-[hsl(222,47%,12%)] font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.destaque ? 'gold-gradient' : 'bg-[hsl(222,35%,20%)]'
                    }`}>
                      {plan.destaque ? (
                        <Crown className="w-5 h-5 text-[hsl(222,47%,12%)]" />
                      ) : (
                        <Zap className="w-5 h-5 text-[hsl(45,80%,47%)]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.nome}</h3>
                      <p className="text-sm text-gray-400">{plan.descricao}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      R$ {isAnnual 
                        ? (plan.preco_anual / 12).toFixed(2).replace('.', ',')
                        : plan.preco_mensal.toFixed(2).replace('.', ',')
                      }
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-gray-500 mt-1">
                      R$ {plan.preco_anual.toFixed(2).replace('.', ',')} cobrado anualmente
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-300">Inclui:</p>
                  {plan.recursos.map((recurso, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{recurso}</span>
                    </div>
                  ))}
                  {'limitacoes' in plan && Array.isArray((plan as { limitacoes?: string[] }).limitacoes) && 
                    (plan as { limitacoes?: string[] }).limitacoes?.map((limitacao: string, idx: number) => (
                      <div key={`limit-${idx}`} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500">{limitacao}</span>
                      </div>
                    ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full h-12 font-semibold ${
                    plan.destaque
                      ? 'gold-gradient text-[hsl(222,47%,12%)] hover:gold-glow'
                      : 'bg-[hsl(222,35%,20%)] text-white hover:bg-[hsl(222,35%,25%)] border border-[hsl(222,20%,25%)]'
                  }`}
                >
                  {plan.preco_mensal === 0 ? 'Começar Grátis' : `Assinar ${plan.nome}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[hsl(222,35%,20%)] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-[hsl(45,80%,47%)]" />
            </div>
            <p className="text-sm font-medium text-white">Pagamento Seguro</p>
            <p className="text-xs text-gray-500">Criptografia SSL</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[hsl(222,35%,20%)] flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-[hsl(45,80%,47%)]" />
            </div>
            <p className="text-sm font-medium text-white">7 Dias de Garantia</p>
            <p className="text-xs text-gray-500">Dinheiro de volta</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[hsl(222,35%,20%)] flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-[hsl(45,80%,47%)]" />
            </div>
            <p className="text-sm font-medium text-white">Ativação Imediata</p>
            <p className="text-xs text-gray-500">Comece a usar agora</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[hsl(222,35%,20%)] flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-[hsl(45,80%,47%)]" />
            </div>
            <p className="text-sm font-medium text-white">Suporte 24/7</p>
            <p className="text-xs text-gray-500">Estamos aqui para ajudar</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim, você pode cancelar sua assinatura a qualquer momento. O acesso permanece até o final do período pago.',
              },
              {
                q: 'Como funciona o período de teste?',
                a: 'Você pode usar o plano Gratuito indefinidamente. Para experimentar o Premium, oferecemos 7 dias de garantia.',
              },
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.',
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos cartão de crédito, boleto bancário e PIX.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[hsl(222,35%,15%)] border border-[hsl(222,20%,25%)]">
                <h3 className="font-medium text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav activeTab="menu" />
    </div>
  );
}
