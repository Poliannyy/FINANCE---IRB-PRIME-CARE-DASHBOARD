export type Exam = {
  id: number;
  name: string;
  category: string;
  description: string;
  price_particular: number;
  price_prime_plus: number | null;
  price_prime_essential: number | null;
  price_prime_elite: number | null;
};

export const mockExams: Exam[] = [
  { id: 1,  name: "Hemograma Completo",        category: "Laboratorial", description: "Análise completa das células do sangue",       price_particular: 85,  price_prime_plus: 68,  price_prime_essential: 55,  price_prime_elite: 42  },
  { id: 2,  name: "Glicemia em Jejum",          category: "Laboratorial", description: "Medição do nível de glicose no sangue",        price_particular: 35,  price_prime_plus: 28,  price_prime_essential: 22,  price_prime_elite: 18  },
  { id: 3,  name: "Colesterol Total e Frações", category: "Laboratorial", description: "Análise do colesterol LDL, HDL e VLDL",       price_particular: 95,  price_prime_plus: 75,  price_prime_essential: 60,  price_prime_elite: 45  },
  { id: 4,  name: "TSH e T4 Livre",             category: "Laboratorial", description: "Avaliação da função tireoidiana",              price_particular: 120, price_prime_plus: 95,  price_prime_essential: 76,  price_prime_elite: 58  },
  { id: 5,  name: "Ultrassom Abdominal",        category: "Imagem",       description: "Imagem dos órgãos abdominais",                price_particular: 200, price_prime_plus: 160, price_prime_essential: 128, price_prime_elite: 100 },
  { id: 6,  name: "Eletrocardiograma",          category: "Cardiologia",  description: "Registro da atividade elétrica do coração",   price_particular: 80,  price_prime_plus: 64,  price_prime_essential: 52,  price_prime_elite: 40  },
  { id: 7,  name: "Teste Ergométrico",          category: "Cardiologia",  description: "Avaliação cardíaca durante exercício",        price_particular: 350, price_prime_plus: 280, price_prime_essential: 224, price_prime_elite: 175 },
  { id: 8,  name: "Ecocardiograma",             category: "Cardiologia",  description: "Imagem do coração por ultrassom",             price_particular: 450, price_prime_plus: 360, price_prime_essential: 288, price_prime_elite: 220 },
  { id: 9,  name: "Dermatoscopia Digital",      category: "Dermatologia", description: "Análise digital de lesões de pele",           price_particular: 250, price_prime_plus: 200, price_prime_essential: 160, price_prime_elite: 120 },
  { id: 10, name: "Curva Glicêmica",            category: "Laboratorial", description: "Monitoramento da glicose ao longo do tempo",  price_particular: 150, price_prime_plus: 120, price_prime_essential: 96,  price_prime_elite: 75  },
];
