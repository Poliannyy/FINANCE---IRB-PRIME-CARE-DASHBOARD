import { mockExames, mockCampanhas, mockPacientes } from "./mockData";
import type { Exame, Campanha, Paciente } from "./mockData";

let examesDB: Exame[] = [...mockExames];
let campanhasDB: Campanha[] = [...mockCampanhas];
let pacientesDB: Paciente[] = [...mockPacientes];

export const ExameAPI = {
  async list(): Promise<Exame[]> {
    return [...examesDB];
  },
  async create(data: Omit<Exame, "id">): Promise<Exame> {
    const newExame: Exame = {
      id: Math.max(0, ...examesDB.map(e => e.id)) + 1,
      ...data,
    };
    examesDB.push(newExame);
    return newExame;
  },
};

export const CampanhaAPI = {
  async list(): Promise<Campanha[]> {
    return [...campanhasDB];
  },
  async create(data: Omit<Campanha, "id" | "total_participantes" | "exames_incluidos">): Promise<Campanha> {
    const newCampanha: Campanha = {
      id: Math.max(0, ...campanhasDB.map(c => c.id)) + 1,
      total_participantes: 0,
      exames_incluidos: [],
      ...data,
    };
    campanhasDB.push(newCampanha);
    return newCampanha;
  },
};

export const PacienteAPI = {
  async list(): Promise<Paciente[]> {
    return [...pacientesDB];
  },
  async create(data: Omit<Paciente, "id">): Promise<Paciente> {
    const newPaciente: Paciente = {
      id: Math.max(0, ...pacientesDB.map(p => p.id)) + 1,
      ...data,
    };
    pacientesDB.push(newPaciente);
    return newPaciente;
  },
};
