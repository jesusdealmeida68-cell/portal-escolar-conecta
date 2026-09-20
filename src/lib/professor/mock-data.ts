/**
 * Dados fictícios da Área do Professor — apenas para demonstrar a interface.
 * Nada aqui representa alunos, turmas ou notas reais.
 */

import type {
  AlunoResumo,
  AulaHorario,
  IntervaloHorario,
  NotaAluno,
  PerfilProfessor,
  Turma,
} from "./types";

export const perfilProfessorMock: PerfilProfessor = {
  nomeCompleto: "Professor Adão Kiala Sumbo",
  numeroProfessor: "PROF-2026-0038",
  cargo: "Professor",
  escola: "Huambo Calunga II (dados fictícios)",
  email: "adao.sumbo@exemplo-escola.co.ao",
  telefone: "+244 923 000 111",
};

export const turmasMock: Turma[] = [
  {
    id: "10a",
    nome: "10.ª A",
    classe: "10.ª Classe",
    curso: "Ciências Físicas e Biológicas",
    anoLetivo: "2026/2027",
    totalAlunos: 28,
    disciplinas: ["Matemática", "Física"],
  },
  {
    id: "10b",
    nome: "10.ª B",
    classe: "10.ª Classe",
    curso: "Ciências Físicas e Biológicas",
    anoLetivo: "2026/2027",
    totalAlunos: 26,
    disciplinas: ["Matemática"],
  },
  {
    id: "11a",
    nome: "11.ª A",
    classe: "11.ª Classe",
    curso: "Ciências Jurídicas",
    anoLetivo: "2026/2027",
    totalAlunos: 24,
    disciplinas: ["Matemática", "Física"],
  },
  {
    id: "12c",
    nome: "12.ª C",
    classe: "12.ª Classe",
    curso: "Economia",
    anoLetivo: "2026/2027",
    totalAlunos: 0,
    disciplinas: ["Matemática"],
  },
];

const NOMES_ALUNOS = [
  "Beatriz Kiala Domingos",
  "Edson Manuel Paulo",
  "Marta Sofia Neto",
  "Fábio André Sami",
  "Cátia Isabel Ventura",
  "Rúben Costa Pereira",
  "Ivo Domingos Sacanga",
  "Suraia Manuel Costa",
  "Décio João Capemba",
  "Ana Paula Cassinda",
  "Miguel Ernesto Bumba",
  "Larissa Fábio Neto",
];

export function alunosPorTurma(turmaId: string): AlunoResumo[] {
  const turma = turmasMock.find((t) => t.id === turmaId);
  if (!turma || turma.totalAlunos === 0) return [];
  return Array.from({ length: turma.totalAlunos }, (_, i) => ({
    numero: `${turma.classe.slice(0, 2).replace(/\D/g, "") || "10"}${turmaId.toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
    nomeCompleto:
      NOMES_ALUNOS[i % NOMES_ALUNOS.length] +
      (i >= NOMES_ALUNOS.length ? ` ${Math.floor(i / NOMES_ALUNOS.length) + 1}` : ""),
  }));
}

export const TRIMESTRES = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"] as const;

/** Gera uma média determinística (não aleatória) a partir do número do aluno + disciplina. */
function mediaDeterministica(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  return Math.round((10 + (hash % 90) / 10) * 10) / 10; // entre 10.0 e 19.9
}

/** Notas fictícias de uma turma numa disciplina/trimestre. Uma turma sem alunos devolve []. */
export function notasDaTurma(turmaId: string, disciplina: string, trimestre: string): NotaAluno[] {
  const alunos = alunosPorTurma(turmaId);
  return alunos.map((aluno, i) => {
    // Um em cada cinco alunos ainda não tem nota lançada, para demonstrar o estado "por lançar".
    const porLancar = (i + disciplina.length) % 5 === 0;
    if (porLancar) {
      return {
        numeroAluno: aluno.numero,
        disciplina,
        trimestre,
        estado: "por-lancar",
        avaliacaoContinua: null,
        provaProfessor: null,
        provaTrimestral: null,
        mediaTrimestral: null,
      };
    }
    const seed = `${turmaId}-${aluno.numero}-${disciplina}-${trimestre}`;
    const ac = mediaDeterministica(seed + "ac");
    const pp = mediaDeterministica(seed + "pp");
    const pt = mediaDeterministica(seed + "pt");
    return {
      numeroAluno: aluno.numero,
      disciplina,
      trimestre,
      estado: "lancada",
      avaliacaoContinua: ac,
      provaProfessor: pp,
      provaTrimestral: pt,
      mediaTrimestral: mediaDeterministica(seed + "final"),
    };
  });
}

export const horarioMock: AulaHorario[] = [
  {
    dia: "Segunda-feira",
    inicio: "07:30",
    fim: "08:15",
    disciplina: "Matemática",
    curso: "Ciências Físicas e Biológicas",
    classe: "10.ª Classe",
    turma: "10.ª A",
    sala: "Sala 12",
  },
  {
    dia: "Segunda-feira",
    inicio: "08:15",
    fim: "09:00",
    disciplina: "Matemática",
    curso: "Ciências Físicas e Biológicas",
    classe: "10.ª Classe",
    turma: "10.ª B",
    sala: "Sala 12",
  },
  {
    dia: "Segunda-feira",
    inicio: "09:15",
    fim: "10:00",
    disciplina: "Física",
    curso: "Ciências Físicas e Biológicas",
    classe: "10.ª Classe",
    turma: "10.ª A",
    sala: "Lab. 2",
  },
  {
    dia: "Terça-feira",
    inicio: "07:30",
    fim: "08:15",
    disciplina: "Matemática",
    curso: "Ciências Jurídicas",
    classe: "11.ª Classe",
    turma: "11.ª A",
    sala: "Sala 7",
  },
  {
    dia: "Terça-feira",
    inicio: "08:15",
    fim: "09:00",
    disciplina: "Física",
    curso: "Ciências Jurídicas",
    classe: "11.ª Classe",
    turma: "11.ª A",
    sala: "Lab. 1",
  },
  {
    dia: "Quarta-feira",
    inicio: "07:30",
    fim: "08:15",
    disciplina: "Matemática",
    curso: "Ciências Físicas e Biológicas",
    classe: "10.ª Classe",
    turma: "10.ª A",
    sala: "Sala 12",
  },
  {
    dia: "Quarta-feira",
    inicio: "09:15",
    fim: "10:00",
    disciplina: "Matemática",
    curso: "Economia",
    classe: "12.ª Classe",
    turma: "12.ª C",
    sala: "Sala 4",
  },
  {
    dia: "Quinta-feira",
    inicio: "07:30",
    fim: "08:15",
    disciplina: "Matemática",
    curso: "Ciências Físicas e Biológicas",
    classe: "10.ª Classe",
    turma: "10.ª B",
    sala: "Sala 12",
  },
  {
    dia: "Quinta-feira",
    inicio: "08:15",
    fim: "09:00",
    disciplina: "Física",
    curso: "Ciências Jurídicas",
    classe: "11.ª Classe",
    turma: "11.ª A",
    sala: "Lab. 1",
  },
  {
    dia: "Sexta-feira",
    inicio: "07:30",
    fim: "08:15",
    disciplina: "Matemática",
    curso: "Ciências Jurídicas",
    classe: "11.ª Classe",
    turma: "11.ª A",
    sala: "Sala 7",
  },
  {
    dia: "Sexta-feira",
    inicio: "09:15",
    fim: "10:00",
    disciplina: "Matemática",
    curso: "Economia",
    classe: "12.ª Classe",
    turma: "12.ª C",
    sala: "Sala 4",
  },
];

export const intervalosMock: IntervaloHorario[] = [
  { dia: "Segunda-feira", inicio: "09:00", fim: "09:15" },
  { dia: "Terça-feira", inicio: "09:00", fim: "09:15" },
  { dia: "Quarta-feira", inicio: "08:15", fim: "09:15" },
  { dia: "Quinta-feira", inicio: "09:00", fim: "09:15" },
  { dia: "Sexta-feira", inicio: "08:15", fim: "09:15" },
];

/** Próxima aula em destaque na página Início / Horário — sempre a primeira da lista, por simplicidade. */
export const proximaAulaMock = horarioMock[0]!;
