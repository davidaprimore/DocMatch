import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent, userType: 'paciente' | 'medico') => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await login(formData.email, formData.password, userType);
      toast.success('Login realizado com sucesso!');
      navigate(userType === 'paciente' ? '/dashboard' : '/medico/dashboard', { replace: true });
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

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
            <CardTitle className="text-2xl text-white">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com sua conta para continuar
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
                <form onSubmit={(e) => handleSubmit(e, 'paciente')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-paciente" className="text-gray-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="email-paciente"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-paciente" className="text-gray-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="password-paciente"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: checked as boolean })
                        }
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                        Lembrar-me
                      </Label>
                    </div>
                    <a href="/recuperar-senha" className="text-sm text-[hsl(45,80%,47%)] hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="medico">
                <form onSubmit={(e) => handleSubmit(e, 'medico')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-medico" className="text-gray-300">Email profissional</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="email-medico"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-[hsl(222,47%,12%)] border-[hsl(222,20%,25%)] text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-medico" className="text-gray-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="password-medico"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember-medico"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: checked as boolean })
                        }
                      />
                      <Label htmlFor="remember-medico" className="text-sm text-gray-400 cursor-pointer">
                        Lembrar-me
                      </Label>
                    </div>
                    <a href="/recuperar-senha" className="text-sm text-[hsl(45,80%,47%)] hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Ainda não tem conta?{' '}
                <a href="/cadastro" className="text-[hsl(45,80%,47%)] hover:underline font-medium">
                  Cadastre-se
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* LGPD Notice */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Ao fazer login, você concorda com nossos{' '}
          <a href="/termos" className="text-[hsl(45,80%,47%)] hover:underline">Termos de Uso</a>
          {' '}e{' '}
          <a href="/privacidade" className="text-[hsl(45,80%,47%)] hover:underline">Política de Privacidade</a>.
          <br />
          Seus dados estão protegidos conforme a LGPD.
        </p>
      </div>
    </div>
  );
}
