/**
 * Tipos da Área do Professor.
 *
 * Apenas descrevem o formato dos dados que a interface espera — tudo aqui é
 * preenchido com dados fictícios (ver mock-data.ts). Quando o backend for
 * ligado, as respostas do servidor devem ser mapeadas para estes tipos, sem
 * mexer nas páginas.
 */

export interface PerfilProfessor {
  nomeCompleto: string;
  numeroProfessor: string;
  cargo: string;
  escola: string;
  email: string;
  telefone: string;
}

export interface Turma {
  id: string;
  nome: string;
  classe: string;
  curso: string;
  anoLetivo: string;
  totalAlunos: number;
  disciplinas: string[];
}

export interface AlunoResumo {
  numero: string;
  nomeCompleto: string;
}

/** Uma aula no horário semanal. */
export interface AulaHorario {
  dia: "Segunda-feira" | "Terça-feira" | "Quarta-feira" | "Quinta-feira" | "Sexta-feira";
  inicio: string;
  fim: string;
  disciplina: string;
  curso: string;
  classe: string;
  turma: string;
  sala: string;
}

/** Um intervalo livre entre aulas (apenas visual, nunca confundido com aula). */
export interface IntervaloHorario {
  dia: AulaHorario["dia"];
  inicio: string;
  fim: string;
}

export type EstadoNota = "lancada" | "por-lancar";

/** Nota trimestral de um aluno numa disciplina. */
export interface NotaAluno {
  numeroAluno: string;
  disciplina: string;
  trimestre: string;
  estado: EstadoNota;
  avaliacaoContinua: number | null;
  provaProfessor: number | null;
  provaTrimestral: number | null;
  mediaTrimestral: number | null;
}
