import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { pacienteMock, medicosMock } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, tipo: 'paciente' | 'medico') => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
  tipo: 'paciente' | 'medico';
  cpf?: string;
  crm?: string;
  especialidade?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ANTEGRAVITY: Implementar integração com Supabase Auth
  // - Configurar autenticação com email/senha
  // - Implementar confirmação de email
  // - Adicionar autenticação social (Google, Apple)
  // - Configurar refresh token
  // - Implementar recuperação de senha
  // - LGPD: Registrar logs de acesso do usuário

  const login = useCallback(async (_email: string, _password: string, tipo: 'paciente' | 'medico') => {
    setIsLoading(true);
    try {
      // Simulação de login - ANTEGRAVITY: Substituir por chamada real ao Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (tipo === 'paciente') {
        setUser(pacienteMock);
      } else {
        // Para médico, pega o primeiro médico mock
        setUser(medicosMock[0]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // ANTEGRAVITY: Implementar logout no Supabase
    setUser(null);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulação de registro - ANTEGRAVITY: Substituir por chamada real ao Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar usuário mock baseado nos dados
      const newUser: Partial<User> = {
        id: `user_${Date.now()}`,
        email: data.email,
        nome: data.nome,
        telefone: data.telefone,
        tipo: data.tipo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        consentimento_lgpd: true,
        data_consentimento: new Date().toISOString(),
      };
      
      setUser(newUser as User);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
