export type Exame = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco_particular: number;
  preco_prime_plus: number | null;
  preco_prime_essential: number | null;
  preco_prime_elite: number | null;
};

export type Campanha = {
  id: number;
  nome: string;
  descricao: string;
  desconto_percentual: number;
  data_inicio: string;
  data_fim: string;
  status: "ativa" | "pausada" | "encerrada";
  total_participantes: number;
  exames_incluidos: string[];
};

export type Paciente = {
  id: number;
  nome: string;
  idade: number;
  data_nascimento: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  plano_id?: number;
  etapa_jornada: "primeiro_contato" | "avaliacao" | "tratamento" | "acompanhamento" | "fidelizado";
  observacoes?: string;
};

export const mockExames: Exame[] = [
  { id: 1,  nome: "Hemograma Completo",        categoria: "Laboratorial", descricao: "Análise completa das células do sangue",       preco_particular: 85,  preco_prime_plus: 68,  preco_prime_essential: 55,  preco_prime_elite: 42  },
  { id: 2,  nome: "Glicemia em Jejum",          categoria: "Laboratorial", descricao: "Medição do nível de glicose no sangue",        preco_particular: 35,  preco_prime_plus: 28,  preco_prime_essential: 22,  preco_prime_elite: 18  },
  { id: 3,  nome: "Colesterol Total e Frações", categoria: "Laboratorial", descricao: "Análise do colesterol LDL, HDL e VLDL",       preco_particular: 95,  preco_prime_plus: 75,  preco_prime_essential: 60,  preco_prime_elite: 45  },
  { id: 4,  nome: "TSH e T4 Livre",             categoria: "Laboratorial", descricao: "Avaliação da função tireoidiana",              preco_particular: 120, preco_prime_plus: 95,  preco_prime_essential: 76,  preco_prime_elite: 58  },
  { id: 5,  nome: "Ultrassom Abdominal",        categoria: "Imagem",       descricao: "Imagem dos órgãos abdominais",                preco_particular: 200, preco_prime_plus: 160, preco_prime_essential: 128, preco_prime_elite: 100 },
  { id: 6,  nome: "Eletrocardiograma",          categoria: "Cardiologia",  descricao: "Registro da atividade elétrica do coração",   preco_particular: 80,  preco_prime_plus: 64,  preco_prime_essential: 52,  preco_prime_elite: 40  },
  { id: 7,  nome: "Teste Ergométrico",          categoria: "Cardiologia",  descricao: "Avaliação cardíaca durante exercício",        preco_particular: 350, preco_prime_plus: 280, preco_prime_essential: 224, preco_prime_elite: 175 },
  { id: 8,  nome: "Ecocardiograma",             categoria: "Cardiologia",  descricao: "Imagem do coração por ultrassom",             preco_particular: 450, preco_prime_plus: 360, preco_prime_essential: 288, preco_prime_elite: 220 },
  { id: 9,  nome: "Dermatoscopia Digital",      categoria: "Dermatologia", descricao: "Análise digital de lesões de pele",           preco_particular: 250, preco_prime_plus: 200, preco_prime_essential: 160, preco_prime_elite: 120 },
  { id: 10, nome: "Curva Glicêmica",            categoria: "Laboratorial", descricao: "Monitoramento da glicose ao longo do tempo",  preco_particular: 150, preco_prime_plus: 120, preco_prime_essential: 96,  preco_prime_elite: 75  },
];

export const mockCampanhas: Campanha[] = [
  {
    id: 1,
    nome: "Coração Saudável",
    descricao: "Prevenção cardiovascular com descontos em exames cardiológicos.",
    desconto_percentual: 20,
    data_inicio: "2024-04-01",
    data_fim: "2024-05-30",
    status: "ativa",
    total_participantes: 124,
    exames_incluidos: ["Eletrocardiograma", "Ecocardiograma", "Teste Ergométrico"]
  },
  {
    id: 2,
    nome: "Check-up Laboratorial",
    descricao: "Conjunto de exames básicos para monitoramento da saúde.",
    desconto_percentual: 15,
    data_inicio: "2024-03-15",
    data_fim: "2024-04-15",
    status: "pausada",
    total_participantes: 89,
    exames_incluidos: ["Hemograma Completo", "Glicemia em Jejum", "Colesterol Total"]
  }
];

export const mockPacientes: Paciente[] = [
  {
    id: 1,
    nome: "Maria Oliveira",
    idade: 45,
    data_nascimento: "1979-05-12",
    telefone: "(11) 98888-7777",
    email: "maria.oliveira@gmail.com",
    etapa_jornada: "fidelizado",
    observacoes: "Paciente crônico com acompanhamento de diabetes."
  },
  {
    id: 2,
    nome: "João Silva",
    idade: 32,
    data_nascimento: "1992-08-25",
    telefone: "(11) 97777-6666",
    email: "joao.silva@hotmail.com",
    etapa_jornada: "avaliacao",
    observacoes: "Primeira consulta para check-up geral."
  }
];
