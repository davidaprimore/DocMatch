// Dados mockados para o protótipo do DocMatch

// Tipos
export interface Especialidade {
  id: string;
  nome: string;
  icone: string;
}

export interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidadeId: string;
  especialidade: string;
  foto: string;
  bio: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  valorConsulta: number;
  planosAceitos: string[];
  nota: number;
  totalAvaliacoes: number;
  disponibilidade: Disponibilidade[];
  avaliacoes: Avaliacao[];
}

export interface Disponibilidade {
  dia: string;
  horarios: string[];
}

export interface Avaliacao {
  id: string;
  paciente: string;
  nota: number;
  comentario: string;
  data: string;
}

export interface Farmacia {
  id: string;
  nome: string;
  logo: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  distancia: number;
  entregaOnline: boolean;
  tempoEntrega: string;
}

export interface Medicamento {
  id: string;
  nome: string;
  principioAtivo: string;
  dosagem: string;
  apresentacao: string;
  precoReferencia: number;
  precos: { farmaciaId: string; preco: number; disponivel: boolean }[];
}

export interface Receita {
  id: string;
  codigo: string;
  dataEmissao: string;
  validade: string;
  medicoId: string;
  medicoNome: string;
  status: 'ativa' | 'utilizada' | 'expirada';
  medicamentos: {
    medicamentoId: string;
    nome: string;
    dosagem: string;
    posologia: string;
    quantidade: number;
  }[];
}

export interface UsuarioPaciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  planosSaude: string[];
  foto: string;
}

export interface PlanoSaude {
  id: string;
  nome: string;
}

// Dados
export const especialidades: Especialidade[] = [
  { id: '1', nome: 'Clínico Geral', icone: 'Stethoscope' },
  { id: '2', nome: 'Cardiologia', icone: 'Heart' },
  { id: '3', nome: 'Dermatologia', icone: 'Sparkles' },
  { id: '4', nome: 'Ortopedia', icone: 'Bone' },
  { id: '5', nome: 'Pediatria', icone: 'Baby' },
  { id: '6', nome: 'Ginecologia', icone: 'User' },
  { id: '7', nome: 'Oftalmologia', icone: 'Eye' },
  { id: '8', nome: 'Psiquiatria', icone: 'Brain' },
  { id: '9', nome: 'Endocrinologia', icone: 'Activity' },
  { id: '10', nome: 'Neurologia', icone: 'Zap' },
];

export const planosSaude: PlanoSaude[] = [
  { id: '1', nome: 'Unimed' },
  { id: '2', nome: 'Bradesco Saúde' },
  { id: '3', nome: 'SulAmérica' },
  { id: '4', nome: 'Amil' },
  { id: '5', nome: 'Porto Seguro' },
  { id: '6', nome: 'Particular' },
];

export const medicos: Medico[] = [
  {
    id: '1',
    nome: 'Dra. Ana Carolina Silva',
    crm: 'CRM-SP 123456',
    especialidadeId: '2',
    especialidade: 'Cardiologia',
    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Cardiologista com mais de 15 anos de experiência. Especialista em cardiologia clínica e intervencionista. Formada pela USP com residência no Incor.',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Conj. 152',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
    },
    valorConsulta: 350,
    planosAceitos: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
    nota: 4.9,
    totalAvaliacoes: 234,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['09:00', '10:00', '14:00', '15:00'] },
      { dia: 'Terça', horarios: ['09:00', '11:00', '14:00', '16:00'] },
      { dia: 'Quarta', horarios: ['10:00', '11:00', '15:00'] },
      { dia: 'Quinta', horarios: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { dia: 'Sexta', horarios: ['09:00', '10:00', '11:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Maria S.', nota: 5, comentario: 'Excelente profissional, muito atenciosa e competente.', data: '2024-01-15' },
      { id: '2', paciente: 'João P.', nota: 5, comentario: 'Melhor cardiologista que já consultei. Recomendo!', data: '2024-01-10' },
      { id: '3', paciente: 'Ana L.', nota: 4, comentario: 'Muito boa, mas a espera foi um pouco longa.', data: '2024-01-05' },
    ],
  },
  {
    id: '2',
    nome: 'Dr. Roberto Mendes',
    crm: 'CRM-SP 789012',
    especialidadeId: '4',
    especialidade: 'Ortopedia',
    foto: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Ortopedista especialista em medicina esportiva e cirurgia de joelho. Atende atletas profissionais e amadores. Formado pela UNIFESP.',
    endereco: {
      logradouro: 'R. Oscar Freire',
      numero: '500',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01426-001',
    },
    valorConsulta: 280,
    planosAceitos: ['Unimed', 'Amil', 'Porto Seguro'],
    nota: 4.7,
    totalAvaliacoes: 189,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['08:00', '09:00', '10:00', '14:00'] },
      { dia: 'Terça', horarios: ['14:00', '15:00', '16:00', '17:00'] },
      { dia: 'Quarta', horarios: ['08:00', '09:00', '10:00'] },
      { dia: 'Quinta', horarios: ['14:00', '15:00', '16:00'] },
      { dia: 'Sexta', horarios: ['08:00', '09:00', '10:00', '11:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Pedro R.', nota: 5, comentario: 'Recuperou meu joelho após cirurgia. Ótimo profissional.', data: '2024-01-12' },
      { id: '2', paciente: 'Carla M.', nota: 4, comentario: 'Muito competente, explicou tudo detalhadamente.', data: '2024-01-08' },
    ],
  },
  {
    id: '3',
    nome: 'Dra. Juliana Costa',
    crm: 'CRM-SP 345678',
    especialidadeId: '3',
    especialidade: 'Dermatologia',
    foto: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Dermatologista especializada em dermatologia estética e clínica. Expert em acne, rejuvenescimento e tratamento de manchas.',
    endereco: {
      logradouro: 'Alameda Santos',
      numero: '800',
      complemento: 'Sala 45',
      bairro: 'Cerqueira César',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01419-002',
    },
    valorConsulta: 400,
    planosAceitos: ['Bradesco Saúde', 'SulAmérica', 'Particular'],
    nota: 4.8,
    totalAvaliacoes: 312,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['10:00', '11:00', '15:00', '16:00'] },
      { dia: 'Terça', horarios: ['09:00', '10:00', '11:00'] },
      { dia: 'Quarta', horarios: ['14:00', '15:00', '16:00', '17:00'] },
      { dia: 'Quinta', horarios: ['09:00', '10:00', '11:00', '15:00'] },
      { dia: 'Sexta', horarios: ['14:00', '15:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Fernanda L.', nota: 5, comentario: 'Minha acne melhorou muito após o tratamento. Indico demais!', data: '2024-01-14' },
      { id: '2', paciente: 'Mariana S.', nota: 5, comentario: 'Profissional incrível, muito atenciosa e competente.', data: '2024-01-09' },
    ],
  },
  {
    id: '4',
    nome: 'Dr. Carlos Eduardo Lima',
    crm: 'CRM-SP 567890',
    especialidadeId: '1',
    especialidade: 'Clínico Geral',
    foto: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Clínico geral com foco em medicina preventiva e atenção primária. Experiência em diagnóstico e tratamento de doenças comuns.',
    endereco: {
      logradouro: 'R. Augusta',
      numero: '1500',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-100',
    },
    valorConsulta: 200,
    planosAceitos: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Porto Seguro'],
    nota: 4.6,
    totalAvaliacoes: 456,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'] },
      { dia: 'Terça', horarios: ['08:00', '09:00', '14:00', '15:00', '16:00'] },
      { dia: 'Quarta', horarios: ['08:00', '09:00', '10:00', '11:00'] },
      { dia: 'Quinta', horarios: ['14:00', '15:00', '16:00', '17:00'] },
      { dia: 'Sexta', horarios: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Antonio B.', nota: 5, comentario: 'Excelente médico, muito atencioso e competente.', data: '2024-01-11' },
      { id: '2', paciente: 'Lucia F.', nota: 4, comentario: 'Bom profissional, consulta detalhada.', data: '2024-01-06' },
    ],
  },
  {
    id: '5',
    nome: 'Dra. Patricia Santos',
    crm: 'CRM-SP 234567',
    especialidadeId: '5',
    especialidade: 'Pediatria',
    foto: 'https://randomuser.me/api/portraits/women/22.jpg',
    bio: 'Pediatra com especialização em desenvolvimento infantil. Atende crianças de 0 a 14 anos com muito carinho e atenção.',
    endereco: {
      logradouro: 'Av. Brasil',
      numero: '2000',
      complemento: 'Sala 101',
      bairro: 'Jardim América',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01430-001',
    },
    valorConsulta: 250,
    planosAceitos: ['Unimed', 'Bradesco Saúde', 'Amil'],
    nota: 4.9,
    totalAvaliacoes: 523,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['09:00', '10:00', '11:00', '15:00', '16:00'] },
      { dia: 'Terça', horarios: ['09:00', '10:00', '14:00', '15:00'] },
      { dia: 'Quarta', horarios: ['09:00', '10:00', '11:00', '15:00'] },
      { dia: 'Quinta', horarios: ['09:00', '14:00', '15:00', '16:00'] },
      { dia: 'Sexta', horarios: ['09:00', '10:00', '11:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Renata M.', nota: 5, comentario: 'Minha filha adora a dra. Patricia! Muito paciente e carinhosa.', data: '2024-01-13' },
      { id: '2', paciente: 'Fernando C.', nota: 5, comentario: 'Excelente pediatra, super recomendo!', data: '2024-01-07' },
    ],
  },
  {
    id: '6',
    nome: 'Dr. Marcelo Oliveira',
    crm: 'CRM-SP 890123',
    especialidadeId: '8',
    especialidade: 'Psiquiatria',
    foto: 'https://randomuser.me/api/portraits/men/52.jpg',
    bio: 'Psiquiatra especializado em ansiedade, depressão e transtornos de humor. Abordagem humanizada e acolhedora.',
    endereco: {
      logradouro: 'R. Pamplona',
      numero: '300',
      complemento: 'Conj. 82',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01405-000',
    },
    valorConsulta: 450,
    planosAceitos: ['Bradesco Saúde', 'SulAmérica', 'Particular'],
    nota: 4.8,
    totalAvaliacoes: 198,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['10:00', '11:00', '15:00', '16:00'] },
      { dia: 'Terça', horarios: ['10:00', '11:00', '15:00'] },
      { dia: 'Quarta', horarios: ['10:00', '11:00', '15:00', '16:00'] },
      { dia: 'Quinta', horarios: ['10:00', '15:00'] },
      { dia: 'Sexta', horarios: ['10:00', '11:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Paulo S.', nota: 5, comentario: 'Me ajudou muito no tratamento da minha ansiedade. Profissional excepcional.', data: '2024-01-10' },
      { id: '2', paciente: 'Daniela R.', nota: 5, comentario: 'Muito acolhedor e competente. Recomendo!', data: '2024-01-05' },
    ],
  },
  {
    id: '7',
    nome: 'Dra. Beatriz Ferreira',
    crm: 'CRM-SP 456789',
    especialidadeId: '6',
    especialidade: 'Ginecologia',
    foto: 'https://randomuser.me/api/portraits/women/55.jpg',
    bio: 'Ginecologista e obstetra com foco em saúde da mulher. Acompanhamento pré-natal e procedimentos ginecológicos.',
    endereco: {
      logradouro: 'Av. Angélica',
      numero: '1200',
      complemento: 'Sala 203',
      bairro: 'Higienópolis',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01228-100',
    },
    valorConsulta: 320,
    planosAceitos: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil'],
    nota: 4.9,
    totalAvaliacoes: 387,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { dia: 'Terça', horarios: ['09:00', '10:00', '11:00', '14:00'] },
      { dia: 'Quarta', horarios: ['14:00', '15:00', '16:00'] },
      { dia: 'Quinta', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { dia: 'Sexta', horarios: ['09:00', '10:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Camila T.', nota: 5, comentario: 'Acompanhou minha gestação inteira. Profissional maravilhosa!', data: '2024-01-12' },
      { id: '2', paciente: 'Amanda R.', nota: 5, comentario: 'Muito atenciosa e competente. Super recomendo!', data: '2024-01-08' },
    ],
  },
  {
    id: '8',
    nome: 'Dr. Fernando Almeida',
    crm: 'CRM-SP 678901',
    especialidadeId: '7',
    especialidade: 'Oftalmologia',
    foto: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Oftalmologista especializado em cirurgia refrativa e doenças da retina. Realiza exames completos e cirurgias a laser.',
    endereco: {
      logradouro: 'R. Estados Unidos',
      numero: '100',
      bairro: 'Jardim América',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01427-000',
    },
    valorConsulta: 280,
    planosAceitos: ['Unimed', 'Bradesco Saúde', 'Porto Seguro'],
    nota: 4.7,
    totalAvaliacoes: 267,
    disponibilidade: [
      { dia: 'Segunda', horarios: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
      { dia: 'Terça', horarios: ['08:00', '09:00', '14:00', '15:00', '16:00'] },
      { dia: 'Quarta', horarios: ['08:00', '09:00', '10:00', '11:00'] },
      { dia: 'Quinta', horarios: ['14:00', '15:00', '16:00'] },
      { dia: 'Sexta', horarios: ['08:00', '09:00', '10:00'] },
    ],
    avaliacoes: [
      { id: '1', paciente: 'Ricardo M.', nota: 5, comentario: 'Operou minha vista e agora enxergo perfeitamente! Obrigado dr.', data: '2024-01-11' },
      { id: '2', paciente: 'Sandra L.', nota: 4, comentario: 'Muito bom profissional, exames detalhados.', data: '2024-01-04' },
    ],
  },
];

export const farmacias: Farmacia[] = [
  {
    id: '1',
    nome: 'Drogaria São Paulo',
    logo: '/farmacia-sp.png',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '500',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
    },
    distancia: 0.5,
    entregaOnline: true,
    tempoEntrega: '30-45 min',
  },
  {
    id: '2',
    nome: 'Pague Menos',
    logo: '/pague-menos.png',
    endereco: {
      logradouro: 'R. Augusta',
      numero: '800',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-100',
    },
    distancia: 1.2,
    entregaOnline: true,
    tempoEntrega: '45-60 min',
  },
  {
    id: '3',
    nome: 'Drogasil',
    logo: '/drogasil.png',
    endereco: {
      logradouro: 'Alameda Santos',
      numero: '300',
      bairro: 'Cerqueira César',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01419-002',
    },
    distancia: 1.8,
    entregaOnline: true,
    tempoEntrega: '60-90 min',
  },
  {
    id: '4',
    nome: 'Farmácia Popular',
    logo: '/farmacia-popular.png',
    endereco: {
      logradouro: 'R. Oscar Freire',
      numero: '200',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01426-001',
    },
    distancia: 2.5,
    entregaOnline: false,
    tempoEntrega: '-',
  },
  {
    id: '5',
    nome: 'Extrafarma',
    logo: '/extrafarma.png',
    endereco: {
      logradouro: 'Av. Angélica',
      numero: '600',
      bairro: 'Higienópolis',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01228-100',
    },
    distancia: 3.0,
    entregaOnline: true,
    tempoEntrega: '90-120 min',
  },
];

export const medicamentos: Medicamento[] = [
  {
    id: '1',
    nome: 'Dipirona Sódica',
    principioAtivo: 'Dipirona sódica',
    dosagem: '500mg',
    apresentacao: 'Comprimido - Caixa com 20 unidades',
    precoReferencia: 12.90,
    precos: [
      { farmaciaId: '1', preco: 10.90, disponivel: true },
      { farmaciaId: '2', preco: 11.50, disponivel: true },
      { farmaciaId: '3', preco: 12.00, disponivel: true },
      { farmaciaId: '4', preco: 9.90, disponivel: true },
      { farmaciaId: '5', preco: 11.00, disponivel: true },
    ],
  },
  {
    id: '2',
    nome: 'Amoxicilina',
    principioAtivo: 'Amoxicilina triidratada',
    dosagem: '500mg',
    apresentacao: 'Cápsula - Caixa com 21 unidades',
    precoReferencia: 35.00,
    precos: [
      { farmaciaId: '1', preco: 32.00, disponivel: true },
      { farmaciaId: '2', preco: 28.90, disponivel: true },
      { farmaciaId: '3', preco: 34.50, disponivel: true },
      { farmaciaId: '4', preco: 25.00, disponivel: true },
      { farmaciaId: '5', preco: 30.00, disponivel: false },
    ],
  },
  {
    id: '3',
    nome: 'Omeprazol',
    principioAtivo: 'Omeprazol',
    dosagem: '20mg',
    apresentacao: 'Cápsula - Caixa com 28 unidades',
    precoReferencia: 28.00,
    precos: [
      { farmaciaId: '1', preco: 25.90, disponivel: true },
      { farmaciaId: '2', preco: 23.00, disponivel: true },
      { farmaciaId: '3', preco: 27.00, disponivel: true },
      { farmaciaId: '4', preco: 20.00, disponivel: true },
      { farmaciaId: '5', preco: 24.50, disponivel: true },
    ],
  },
  {
    id: '4',
    nome: 'Losartana Potássica',
    principioAtivo: 'Losartana potássica',
    dosagem: '50mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 22.00,
    precos: [
      { farmaciaId: '1', preco: 18.90, disponivel: true },
      { farmaciaId: '2', preco: 16.50, disponivel: true },
      { farmaciaId: '3', preco: 20.00, disponivel: true },
      { farmaciaId: '4', preco: 15.00, disponivel: true },
      { farmaciaId: '5', preco: 19.00, disponivel: true },
    ],
  },
  {
    id: '5',
    nome: 'Metformina',
    principioAtivo: 'Cloridrato de metformina',
    dosagem: '850mg',
    apresentacao: 'Comprimido - Caixa com 60 unidades',
    precoReferencia: 18.00,
    precos: [
      { farmaciaId: '1', preco: 15.90, disponivel: true },
      { farmaciaId: '2', preco: 14.00, disponivel: true },
      { farmaciaId: '3', preco: 16.50, disponivel: true },
      { farmaciaId: '4', preco: 12.00, disponivel: true },
      { farmaciaId: '5', preco: 15.00, disponivel: true },
    ],
  },
  {
    id: '6',
    nome: 'Atenolol',
    principioAtivo: 'Atenolol',
    dosagem: '25mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 15.00,
    precos: [
      { farmaciaId: '1', preco: 12.90, disponivel: true },
      { farmaciaId: '2', preco: 11.50, disponivel: true },
      { farmaciaId: '3', preco: 14.00, disponivel: true },
      { farmaciaId: '4', preco: 10.00, disponivel: true },
      { farmaciaId: '5', preco: 13.00, disponivel: true },
    ],
  },
  {
    id: '7',
    nome: 'Simvastatina',
    principioAtivo: 'Simvastatina',
    dosagem: '20mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 25.00,
    precos: [
      { farmaciaId: '1', preco: 22.00, disponivel: true },
      { farmaciaId: '2', preco: 20.00, disponivel: true },
      { farmaciaId: '3', preco: 24.00, disponivel: true },
      { farmaciaId: '4', preco: 18.00, disponivel: true },
      { farmaciaId: '5', preco: 21.50, disponivel: true },
    ],
  },
  {
    id: '8',
    nome: 'Celecoxibe',
    principioAtivo: 'Celecoxibe',
    dosagem: '200mg',
    apresentacao: 'Cápsula - Caixa com 15 unidades',
    precoReferencia: 85.00,
    precos: [
      { farmaciaId: '1', preco: 79.90, disponivel: true },
      { farmaciaId: '2', preco: 75.00, disponivel: true },
      { farmaciaId: '3', preco: 82.00, disponivel: true },
      { farmaciaId: '4', preco: 70.00, disponivel: false },
      { farmaciaId: '5', preco: 78.00, disponivel: true },
    ],
  },
  {
    id: '9',
    nome: 'Clonazepam',
    principioAtivo: 'Clonazepam',
    dosagem: '2mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 35.00,
    precos: [
      { farmaciaId: '1', preco: 32.00, disponivel: true },
      { farmaciaId: '2', preco: 30.00, disponivel: true },
      { farmaciaId: '3', preco: 33.50, disponivel: true },
      { farmaciaId: '4', preco: 28.00, disponivel: true },
      { farmaciaId: '5', preco: 31.00, disponivel: true },
    ],
  },
  {
    id: '10',
    nome: 'Escitalopram',
    principioAtivo: 'Oxalato de escitalopram',
    dosagem: '10mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 45.00,
    precos: [
      { farmaciaId: '1', preco: 40.00, disponivel: true },
      { farmaciaId: '2', preco: 38.00, disponivel: true },
      { farmaciaId: '3', preco: 42.00, disponivel: true },
      { farmaciaId: '4', preco: 35.00, disponivel: true },
      { farmaciaId: '5', preco: 39.00, disponivel: true },
    ],
  },
  {
    id: '11',
    nome: 'Ibuprofeno',
    principioAtivo: 'Ibuprofeno',
    dosagem: '600mg',
    apresentacao: 'Comprimido - Caixa com 20 unidades',
    precoReferencia: 18.00,
    precos: [
      { farmaciaId: '1', preco: 15.90, disponivel: true },
      { farmaciaId: '2', preco: 14.50, disponivel: true },
      { farmaciaId: '3', preco: 16.00, disponivel: true },
      { farmaciaId: '4', preco: 13.00, disponivel: true },
      { farmaciaId: '5', preco: 15.00, disponivel: true },
    ],
  },
  {
    id: '12',
    nome: 'Prednisona',
    principioAtivo: 'Prednisona',
    dosagem: '20mg',
    apresentacao: 'Comprimido - Caixa com 20 unidades',
    precoReferencia: 12.00,
    precos: [
      { farmaciaId: '1', preco: 10.50, disponivel: true },
      { farmaciaId: '2', preco: 9.90, disponivel: true },
      { farmaciaId: '3', preco: 11.00, disponivel: true },
      { farmaciaId: '4', preco: 8.50, disponivel: true },
      { farmaciaId: '5', preco: 10.00, disponivel: true },
    ],
  },
  {
    id: '13',
    nome: 'Azitromicina',
    principioAtivo: 'Azitromicina diidratada',
    dosagem: '500mg',
    apresentacao: 'Comprimido - Caixa com 3 unidades',
    precoReferencia: 28.00,
    precos: [
      { farmaciaId: '1', preco: 25.00, disponivel: true },
      { farmaciaId: '2', preco: 23.50, disponivel: true },
      { farmaciaId: '3', preco: 26.00, disponivel: true },
      { farmaciaId: '4', preco: 22.00, disponivel: true },
      { farmaciaId: '5', preco: 24.50, disponivel: true },
    ],
  },
  {
    id: '14',
    nome: 'Captopril',
    principioAtivo: 'Captopril',
    dosagem: '25mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 10.00,
    precos: [
      { farmaciaId: '1', preco: 8.90, disponivel: true },
      { farmaciaId: '2', preco: 7.50, disponivel: true },
      { farmaciaId: '3', preco: 9.50, disponivel: true },
      { farmaciaId: '4', preco: 6.90, disponivel: true },
      { farmaciaId: '5', preco: 8.50, disponivel: true },
    ],
  },
  {
    id: '15',
    nome: 'Insulina Glargina',
    principioAtivo: 'Insulina glargina',
    dosagem: '100UI/mL',
    apresentacao: 'Solução injetável - Frasco 10mL',
    precoReferencia: 180.00,
    precos: [
      { farmaciaId: '1', preco: 165.00, disponivel: true },
      { farmaciaId: '2', preco: 155.00, disponivel: true },
      { farmaciaId: '3', preco: 170.00, disponivel: true },
      { farmaciaId: '4', preco: 150.00, disponivel: false },
      { farmaciaId: '5', preco: 160.00, disponivel: true },
    ],
  },
  {
    id: '16',
    nome: 'Levotiroxina Sódica',
    principioAtivo: 'Levotiroxina sódica',
    dosagem: '50mcg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 20.00,
    precos: [
      { farmaciaId: '1', preco: 17.90, disponivel: true },
      { farmaciaId: '2', preco: 16.00, disponivel: true },
      { farmaciaId: '3', preco: 18.50, disponivel: true },
      { farmaciaId: '4', preco: 15.00, disponivel: true },
      { farmaciaId: '5', preco: 17.00, disponivel: true },
    ],
  },
  {
    id: '17',
    nome: 'Sinvastatina',
    principioAtivo: 'Sinvastatina',
    dosagem: '40mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 30.00,
    precos: [
      { farmaciaId: '1', preco: 26.00, disponivel: true },
      { farmaciaId: '2', preco: 24.00, disponivel: true },
      { farmaciaId: '3', preco: 28.00, disponivel: true },
      { farmaciaId: '4', preco: 22.00, disponivel: true },
      { farmaciaId: '5', preco: 25.50, disponivel: true },
    ],
  },
  {
    id: '18',
    nome: 'Loratadina',
    principioAtivo: 'Loratadina',
    dosagem: '10mg',
    apresentacao: 'Comprimido - Caixa com 12 unidades',
    precoReferencia: 15.00,
    precos: [
      { farmaciaId: '1', preco: 12.90, disponivel: true },
      { farmaciaId: '2', preco: 11.50, disponivel: true },
      { farmaciaId: '3', preco: 13.50, disponivel: true },
      { farmaciaId: '4', preco: 10.00, disponivel: true },
      { farmaciaId: '5', preco: 12.50, disponivel: true },
    ],
  },
  {
    id: '19',
    nome: 'Pantoprazol',
    principioAtivo: 'Pantoprazol sódico sesqui-hidratado',
    dosagem: '40mg',
    apresentacao: 'Comprimido - Caixa com 28 unidades',
    precoReferencia: 35.00,
    precos: [
      { farmaciaId: '1', preco: 30.00, disponivel: true },
      { farmaciaId: '2', preco: 28.00, disponivel: true },
      { farmaciaId: '3', preco: 32.00, disponivel: true },
      { farmaciaId: '4', preco: 25.00, disponivel: true },
      { farmaciaId: '5', preco: 29.00, disponivel: true },
    ],
  },
  {
    id: '20',
    nome: 'Amlodipina',
    principioAtivo: 'Besilato de anlodipino',
    dosagem: '5mg',
    apresentacao: 'Comprimido - Caixa com 30 unidades',
    precoReferencia: 18.00,
    precos: [
      { farmaciaId: '1', preco: 15.50, disponivel: true },
      { farmaciaId: '2', preco: 14.00, disponivel: true },
      { farmaciaId: '3', preco: 16.50, disponivel: true },
      { farmaciaId: '4', preco: 12.50, disponivel: true },
      { farmaciaId: '5', preco: 15.00, disponivel: true },
    ],
  },
];

export const receitas: Receita[] = [
  {
    id: '1',
    codigo: 'DM-2024-001234',
    dataEmissao: '2024-01-15',
    validade: '2024-07-15',
    medicoId: '1',
    medicoNome: 'Dra. Ana Carolina Silva',
    status: 'ativa',
    medicamentos: [
      { medicamentoId: '4', nome: 'Losartana Potássica', dosagem: '50mg', posologia: '1 comprimido pela manhã', quantidade: 2 },
      { medicamentoId: '6', nome: 'Atenolol', dosagem: '25mg', posologia: '1 comprimido à noite', quantidade: 2 },
    ],
  },
  {
    id: '2',
    codigo: 'DM-2024-001189',
    dataEmissao: '2024-01-10',
    validade: '2024-04-10',
    medicoId: '6',
    medicoNome: 'Dr. Marcelo Oliveira',
    status: 'ativa',
    medicamentos: [
      { medicamentoId: '9', nome: 'Clonazepam', dosagem: '2mg', posologia: '1/2 comprimido à noite', quantidade: 1 },
      { medicamentoId: '10', nome: 'Escitalopram', dosagem: '10mg', posologia: '1 comprimido pela manhã', quantidade: 1 },
    ],
  },
  {
    id: '3',
    codigo: 'DM-2023-009876',
    dataEmissao: '2023-10-05',
    validade: '2024-01-05',
    medicoId: '4',
    medicoNome: 'Dr. Carlos Eduardo Lima',
    status: 'expirada',
    medicamentos: [
      { medicamentoId: '1', nome: 'Dipirona Sódica', dosagem: '500mg', posologia: '1 comprimido a cada 6 horas se necessário', quantidade: 1 },
      { medicamentoId: '11', nome: 'Ibuprofeno', dosagem: '600mg', posologia: '1 comprimido a cada 8 horas se necessário', quantidade: 1 },
    ],
  },
];

export const usuarioPaciente: UsuarioPaciente = {
  id: '1',
  nome: 'Maria da Silva',
  email: 'maria.silva@email.com',
  telefone: '(11) 99999-8888',
  dataNascimento: '1985-06-15',
  planosSaude: ['Unimed', 'Bradesco Saúde'],
  foto: 'https://randomuser.me/api/portraits/women/33.jpg',
};

// Planos para paciente
export const planosPaciente = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    preco: 0,
    recursos: [
      { nome: 'Busca de médicos', disponivel: true },
      { nome: 'Agendamento de consultas', disponivel: true },
      { nome: 'Receitas digitais', disponivel: true },
      { nome: 'Comparador de preços', disponivel: true },
      { nome: 'Sem anúncios', disponivel: false },
      { nome: 'Suporte prioritário', disponivel: false },
      { nome: 'Descontos em farmácias', disponivel: false },
      { nome: 'Telemedicina ilimitada', disponivel: false },
    ],
  },
  {
    id: 'plus',
    nome: 'Plus',
    preco: 19,
    destaque: true,
    recursos: [
      { nome: 'Busca de médicos', disponivel: true },
      { nome: 'Agendamento de consultas', disponivel: true },
      { nome: 'Receitas digitais', disponivel: true },
      { nome: 'Comparador de preços', disponivel: true },
      { nome: 'Sem anúncios', disponivel: true },
      { nome: 'Suporte prioritário', disponivel: true },
      { nome: 'Descontos em farmácias', disponivel: false },
      { nome: 'Telemedicina ilimitada', disponivel: false },
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 39,
    recursos: [
      { nome: 'Busca de médicos', disponivel: true },
      { nome: 'Agendamento de consultas', disponivel: true },
      { nome: 'Receitas digitais', disponivel: true },
      { nome: 'Comparador de preços', disponivel: true },
      { nome: 'Sem anúncios', disponivel: true },
      { nome: 'Suporte prioritário', disponivel: true },
      { nome: 'Descontos em farmácias', disponivel: true },
      { nome: 'Telemedicina ilimitada', disponivel: true },
    ],
  },
];

// Planos para profissional
export const planosProfissional = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 49,
    recursos: [
      { nome: 'Perfil na plataforma', disponivel: true },
      { nome: 'Agenda digital', disponivel: true },
      { nome: 'Receitas digitais', disponivel: true },
      { nome: 'Notificações por e-mail', disponivel: true },
      { nome: 'Relatórios básicos', disponivel: true },
      { nome: 'Destaque nas buscas', disponivel: false },
      { nome: 'Emissão de laudos', disponivel: false },
      { nome: 'Integração com WhatsApp', disponivel: false },
      { nome: 'Suporte prioritário', disponivel: false },
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 99,
    destaque: true,
    recursos: [
      { nome: 'Perfil na plataforma', disponivel: true },
      { nome: 'Agenda digital', disponivel: true },
      { nome: 'Receitas digitais', disponivel: true },
      { nome: 'Notificações por e-mail', disponivel: true },
      { nome: 'Relatórios básicos', disponivel: true },
      { nome: 'Destaque nas buscas', disponivel: true },
      { nome: 'Emissão de laudos', disponivel: true },
      { nome: 'Integração com WhatsApp', disponivel: true },
      { nome: 'Suporte prioritário', disponivel: true },
    ],
  },
];

// Próximas consultas mockadas
export const proximasConsultas = [
  {
    id: '1',
    medicoNome: 'Dra. Ana Carolina Silva',
    especialidade: 'Cardiologia',
    data: '2024-01-25',
    horario: '10:00',
    endereco: 'Av. Paulista, 1000 - Bela Vista',
  },
  {
    id: '2',
    medicoNome: 'Dra. Juliana Costa',
    especialidade: 'Dermatologia',
    data: '2024-02-05',
    horario: '15:00',
    endereco: 'Alameda Santos, 800 - Cerqueira César',
  },
];
