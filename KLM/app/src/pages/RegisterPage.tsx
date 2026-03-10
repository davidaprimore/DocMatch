import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    crm: '',
    especialidade: '',
    aceitaTermos: false,
    aceitaLGPD: false,
  });

  const handleSubmit = async (e: React.FormEvent, userType: 'paciente' | 'medico') => {
    e.preventDefault();

    if (!formData.aceitaTermos || !formData.aceitaLGPD) {
      toast.error('Você precisa aceitar os termos e a política de privacidade');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        tipo: userType,
        cpf: userType === 'paciente' ? formData.cpf : undefined,
        crm: userType === 'medico' ? formData.crm : undefined,
        especialidade: userType === 'medico' ? formData.especialidade : undefined,
      });
      toast.success('Cadastro realizado com sucesso!');
      navigate(userType === 'paciente' ? '/dashboard' : '/medico/dashboard');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-gray-300">Nome completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="nome"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone" className="text-gray-300">Telefone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="telefone"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setStep(2)}
        className="w-full h-12 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
        disabled={!formData.nome || !formData.email || !formData.telefone}
      >
        Continuar
      </Button>
    </div>
  );

  const renderStep2 = (userType: 'paciente' | 'medico') => (
    <div className="space-y-4">
      {userType === 'paciente' ? (
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-gray-300">CPF</Label>
          <Input
            id="cpf"
            placeholder="123.456.789-00"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            className="bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="crm" className="text-gray-300">CRM</Label>
            <Input
              id="crm"
              placeholder="CRM-XX 123456"
              value={formData.crm}
              onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
              className="bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="especialidade" className="text-gray-300">Especialidade</Label>
            <Input
              id="especialidade"
              placeholder="Sua especialidade"
              value={formData.especialidade}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              className="bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 pr-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repita sua senha"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox
            id="termos"
            checked={formData.aceitaTermos}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, aceitaTermos: checked as boolean })
            }
          />
          <Label htmlFor="termos" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
            Li e aceito os{' '}
            <a href="/termos" className="text-[hsl(45,80%,47%)] hover:underline">Termos de Uso</a>
            {' '}e a{' '}
            <a href="/privacidade" className="text-[hsl(45,80%,47%)] hover:underline">Política de Privacidade</a>
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="lgpd"
            checked={formData.aceitaLGPD}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, aceitaLGPD: checked as boolean })
            }
          />
          <Label htmlFor="lgpd" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
            Concordo com o tratamento dos meus dados pessoais conforme a{' '}
            <a href="/lgpd" className="text-[hsl(45,80%,47%)] hover:underline">LGPD</a>
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 h-12 border-[hsl(222,20%,25%)] text-white hover:bg-[hsl(222,35%,20%)]"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
          disabled={isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(222,47%,12%)] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(45,80%,47%)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(222,35%,25%)]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="absolute -top-16 left-0 text-gray-400 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-[hsl(222,47%,12%)]" />
            </div>
            <span className="text-2xl font-bold text-white">
              Doc<span className="text-[hsl(45,80%,47%)]">Match</span>
            </span>
          </a>
        </div>

        <Card className="bg-[hsl(222,35%,15%)] border-[hsl(222,20%,25%)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Crie sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Comece a usar o DocMatch hoje mesmo
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="paciente" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[hsl(222,47%,12%)] mb-6">
                <TabsTrigger 
                  value="paciente"
                  className="data-[state=active]:gold-gradient data-[state=active]:text-[hsl(222,47%,12%)]"
                >
                  Sou Paciente
                </TabsTrigger>
                <TabsTrigger 
                  value="medico"
                  className="data-[state=active]:gold-gradient data-[state=active]:text-[hsl(222,47%,12%)]"
                >
                  Sou Médico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paciente">
                <form onSubmit={(e) => handleSubmit(e, 'paciente')}>
                  {step === 1 ? renderStep1() : renderStep2('paciente')}
                </form>
              </TabsContent>

              <TabsContent value="medico">
                <form onSubmit={(e) => handleSubmit(e, 'medico')}>
                  {step === 1 ? renderStep1() : renderStep2('medico')}
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <a href="/login" className="text-[hsl(45,80%,47%)] hover:underline font-medium">
                  Faça login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-[hsl(45,80%,47%)]" />
            <span>Gratuito para pacientes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-[hsl(45,80%,47%)]" />
            <span>LGPD compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-[hsl(45,80%,47%)]" />
            <span>Agendamento fácil</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-[hsl(45,80%,47%)]" />
            <span>Economia garantida</span>
          </div>
        </div>
      </div>
    </div>
  );
}
