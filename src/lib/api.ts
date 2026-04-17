const API_BASE_URL = "http://localhost:8000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
    throw new Error(error.detail || "Erro na requisição");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const ExameAPI = {
  async list(busca?: string, categoria?: string) {
    let url = "/exames/";
    const params = new URLSearchParams();
    if (busca) params.append("busca", busca);
    if (categoria && categoria !== "Todos") params.append("categoria", categoria);
    if (params.toString()) url += `?${params.toString()}`;

    const data = await fetchAPI(url);
    return data.map(transformExame);
  },

  async listCategorias() {
    return fetchAPI("/exames/categorias");
  },

  async create(data: any) {
    const res = await fetchAPI("/exames/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformExame(res);
  },
};

export const CampanhaAPI = {
  async list(status?: string) {
    let url = "/campanhas/";
    if (status && status !== "todas") url += `?status=${status}`;
    return fetchAPI(url);
  },

  async create(data: any) {
    return fetchAPI("/campanhas/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const PacienteAPI = {
  async list(busca?: string, etapa?: string) {
    let url = "/pacientes/";
    const params = new URLSearchParams();
    if (busca) params.append("busca", busca);
    if (etapa && etapa !== "Todos") params.append("etapa", etapa);
    if (params.toString()) url += `?${params.toString()}`;
    return fetchAPI(url);
  },

  async create(data: any) {
    return fetchAPI("/pacientes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const DashboardAPI = {
  async getStats() {
    return fetchAPI("/dashboard/");
  },
  async getRecentExams() {
    return fetchAPI("/dashboard/exames-recentes");
  },
  async getActiveCampaigns() {
    return fetchAPI("/dashboard/campanhas-ativas");
  },
};

export const PlanosAPI = {
  async list() {
    return fetchAPI("/planos/");
  },
  async getTabela(busca?: string) {
    let url = "/planos/tabela";
    if (busca) url += `?busca=${busca}`;
    return fetchAPI(url);
  },
};

// Auxiliar para transformar o formato do back-end (lista de preços) para o formato plano do front-end
function transformExame(ex: any) {
  const precos: any = {
    preco_particular: 0,
    preco_prime_plus: 0,
    preco_prime_essential: 0,
    preco_prime_elite: 0,
  };
  ex.precos.forEach((p: any) => {
    if (p.plano_id === 1) precos.preco_particular = Number(p.preco);
    if (p.plano_id === 2) precos.preco_prime_plus = Number(p.preco);
    if (p.plano_id === 3) precos.preco_prime_essential = Number(p.preco);
    if (p.plano_id === 4) precos.preco_prime_elite = Number(p.preco);
  });

  return {
    id: ex.id,
    nome: ex.nome,
    categoria: ex.categoria.nome,
    categoria_id: ex.categoria_id,
    descricao: ex.descricao,
    tempo_resultado: ex.tempo_resultado,
    preparo: ex.preparo,
    ...precos,
  };
}
