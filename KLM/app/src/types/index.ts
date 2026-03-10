// DocMatch Types - Conforme LGPD Brasil

export interface User {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  tipo: 'paciente' | 'medico' | 'farmacia';
  created_at: string;
  updated_at: string;
  // LGPD Compliance
  consentimento_lgpd: boolean;
  data_consentimento?: string;
}

export interface Paciente extends User {
  tipo: 'paciente';
  cpf: string;
  data_nascimento: string;
  endereco: Endereco;
  plano_saude?: PlanoSaude;
  historico_consultas?: Consulta[];
  receitas?: Receita[];
  favoritos?: string[]; // IDs dos médicos favoritos
  assinatura?: AssinaturaPaciente;
}

export interface Medico extends User {
  tipo: 'medico';
  crm: string;
  especialidade: string;
  subespecialidade?: string;
  bio: string;
  foto_url?: string;
  endereco_consultorio: Endereco;
  planos_saude_aceitos: PlanoSaude[];
  valor_consulta: number;
  valor_consulta_particular: number;
  horarios_disponiveis: Horario[];
  avaliacao: number;
  total_avaliacoes: number;
  assinatura: AssinaturaMedico;
  destaque: boolean;
  formacao?: string[];
  experiencia?: string;
}

export interface Farmacia {
  id: string;
  nome: string;
  cnpj: string;
  endereco: Endereco;
  telefone: string;
  logo_url?: string;
  horario_funcionamento: {
    abertura: string;
    fechamento: string;
    _24h: boolean;
  };
  entrega_online: boolean;
  api_integracao?: {
    url_base: string;
    chave_api?: string;
    status: 'ativo' | 'pendente' | 'inativo';
  };
  medicamentos?: MedicamentoFarmacia[];
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude?: number;
  longitude?: number;
}

export interface PlanoSaude {
  id: string;
  nome: string;
  operadora: string;
  tipo: 'individual' | 'empresarial' | 'familiar';
  numero_carteirinha?: string;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  medico_id: string;
  data: string;
  horario: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'nao_compareceu';
  tipo: 'presencial' | 'online';
  valor: number;
  plano_saude_utilizado?: PlanoSaude;
  receita_id?: string;
  observacoes?: string;
  created_at: string;
}

export interface Receita {
  id: string;
  consulta_id: string;
  paciente_id: string;
  medico_id: string;
  data_emissao: string;
  validade: string;
  medicamentos: MedicamentoReceita[];
  observacoes?: string;
  qr_code?: string;
  assinatura_digital: string;
  status: 'ativa' | 'utilizada' | 'vencida' | 'cancelada';
}

export interface MedicamentoReceita {
  id: string;
  nome: string;
  principio_ativo: string;
  concentracao: string;
  forma_farmaceutica: string;
  posologia: string;
  quantidade: number;
  uso_continuo: boolean;
}

export interface MedicamentoFarmacia {
  id: string;
  farmacia_id: string;
  medicamento_id: string;
  nome: string;
  principio_ativo: string;
  concentracao: string;
  forma_farmaceutica: string;
  fabricante: string;
  preco: number;
  preco_promocional?: number;
  estoque: number;
  requer_receita: boolean;
  url_produto?: string;
}

export interface Horario {
  dia_semana: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo
  hora_inicio: string;
  hora_fim: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
}

export interface AssinaturaPaciente {
  plano: 'gratuito' | 'basico' | 'premium';
  status: 'ativo' | 'inativo' | 'cancelado';
  data_inicio: string;
  data_renovacao?: string;
  data_cancelamento?: string;
  valor_mensal?: number;
  beneficios: string[];
}

export interface AssinaturaMedico {
  plano: 'basico' | 'premium';
  status: 'ativo' | 'inativo' | 'cancelado';
  data_inicio: string;
  data_renovacao?: string;
  valor_mensal: number;
  beneficios: string[];
}

export interface Avaliacao {
  id: string;
  paciente_id: string;
  medico_id: string;
  consulta_id: string;
  nota: number;
  comentario?: string;
  data: string;
  anonimo: boolean;
}

export interface FiltroBusca {
  especialidade?: string;
  localizacao?: {
    latitude: number;
    longitude: number;
    raio_km: number;
  };
  plano_saude?: string;
  valor_maximo?: number;
  data_disponivel?: string;
  avaliacao_minima?: number;
  apenas_online?: boolean;
  apenas_destaque?: boolean;
}

export interface FiltroFarmacia {
  localizacao?: {
    latitude: number;
    longitude: number;
    raio_km: number;
  };
  entrega_online?: boolean;
  _24h?: boolean;
  medicamentos_ids?: string[];
}

export interface ResultadoComparacao {
  farmacia: Farmacia;
  medicamentos: {
    medicamento: MedicamentoFarmacia;
    quantidade: number;
    preco_unitario: number;
    preco_total: number;
  }[];
  preco_total_cesta: number;
  economia_vs_mais_caro: number;
  distancia_km?: number;
  tempo_entrega?: string;
}

// LGPD - Consentimento e Privacidade
export interface ConsentimentoLGPD {
  id: string;
  user_id: string;
  finalidade: string;
  consentido: boolean;
  data_consentimento: string;
  data_revogacao?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface SolicitacaoLGPD {
  id: string;
  user_id: string;
  tipo: 'acesso' | 'retificacao' | 'exclusao' | 'portabilidade' | 'oposicao';
  status: 'pendente' | 'em_analise' | 'concluida' | 'negada';
  data_solicitacao: string;
  data_resposta?: string;
  resposta?: string;
}
