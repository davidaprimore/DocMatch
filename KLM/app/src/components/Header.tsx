import { useState } from 'react';
import { Menu, Stethoscope, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  userType?: 'paciente' | 'medico' | null;
  userName?: string;
  onLogout?: () => void;
}

export function Header({ userType, userName, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = userType === 'paciente' 
    ? [
        { label: 'Início', href: '/dashboard' },
        { label: 'Buscar Médicos', href: '/buscar' },
        { label: 'Minhas Consultas', href: '/consultas' },
        { label: 'Receitas', href: '/receitas' },
        { label: 'Favoritos', href: '/favoritos' },
        { label: 'Meu Plano', href: '/planos' },
      ]
    : userType === 'medico'
    ? [
        { label: 'Dashboard', href: '/medico/dashboard' },
        { label: 'Agenda', href: '/medico/agenda' },
        { label: 'Pacientes', href: '/medico/pacientes' },
        { label: 'Receitas', href: '/medico/receitas' },
        { label: 'Financeiro', href: '/medico/financeiro' },
        { label: 'Meu Plano', href: '/medico/plano' },
      ]
    : [
        { label: 'Início', href: '/' },
        { label: 'Para Pacientes', href: '/pacientes' },
        { label: 'Para Médicos', href: '/medicos' },
        { label: 'Planos', href: '/planos' },
        { label: 'Sobre', href: '/sobre' },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[hsl(222,20%,25%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center group-hover:gold-glow transition-all">
              <Stethoscope className="w-6 h-6 text-[hsl(222,47%,12%)]" />
            </div>
            <span className="text-xl font-bold text-white">
              Doc<span className="text-[hsl(45,80%,47%)]">Match</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 hover:text-[hsl(45,80%,47%)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {userType ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="w-4 h-4 text-[hsl(45,80%,47%)]" />
                  <span>Olá, {userName?.split(' ')[0]}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                  asChild
                >
                  <a href="/login">Entrar</a>
                </Button>
                <Button
                  size="sm"
                  className="gold-gradient text-[hsl(222,47%,12%)] font-semibold hover:gold-glow"
                  asChild
                >
                  <a href="/cadastro">Cadastrar</a>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[280px] bg-[hsl(222,47%,12%)] border-l border-[hsl(222,20%,25%)]"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-[hsl(222,47%,12%)]" />
                    </div>
                    <span>Doc<span className="text-[hsl(45,80%,47%)]">Match</span></span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="mt-8 flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-gray-300 hover:text-white hover:bg-[hsl(222,35%,20%)] rounded-lg transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {userType && (
                  <div className="mt-8 pt-8 border-t border-[hsl(222,20%,25%)]">
                    <div className="px-4 mb-4 text-sm text-gray-400">
                      Logado como <span className="text-white">{userName}</span>
                    </div>
                    <button
                      onClick={() => {
                        onLogout?.();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}

                {!userType && (
                  <div className="mt-8 pt-8 border-t border-[hsl(222,20%,25%)] flex flex-col gap-2">
                    <a
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-center text-gray-300 hover:text-white hover:bg-[hsl(222,35%,20%)] rounded-lg transition-colors"
                    >
                      Entrar
                    </a>
                    <a
                      href="/cadastro"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-center gold-gradient text-[hsl(222,47%,12%)] font-semibold rounded-lg"
                    >
                      Cadastrar
                    </a>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
