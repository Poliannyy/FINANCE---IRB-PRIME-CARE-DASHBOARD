import { mockExams } from "./mockData";
import type { Exam } from "./mockData";

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
};
