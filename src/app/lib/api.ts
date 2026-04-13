import { mockExams } from "./mockData";
import type { Exam } from "./mockData";

// Simula um banco em memória durante a sessão
let examsDB: Exam[] = [...mockExams];

export const ExamAPI = {
  async list(): Promise<Exam[]> {
    return [...examsDB];
  },

  async create(data: Omit<Exam, "id">): Promise<Exam> {
    const newExam: Exam = {
      id: Math.max(0, ...examsDB.map(e => e.id)) + 1,
      ...data,
    };
    examsDB.push(newExam);
    return newExam;
  },

  async update(id: number, data: Partial<Omit<Exam, "id">>): Promise<Exam | null> {
    const idx = examsDB.findIndex(e => e.id === id);
    if (idx === -1) return null;
    examsDB[idx] = { ...examsDB[idx], ...data };
    return examsDB[idx];
  },

  async delete(id: number): Promise<boolean> {
    const before = examsDB.length;
    examsDB = examsDB.filter(e => e.id !== id);
    return examsDB.length < before;
  },
};