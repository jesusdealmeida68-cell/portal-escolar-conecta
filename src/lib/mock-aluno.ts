/**
 * Dados de demonstração (mock) para a Área do Aluno.
 *
 * IMPORTANTE: Este ficheiro existe apenas para fins visuais/demonstração.
 * Nenhum dado aqui é real e não há qualquer ligação à base de dados.
 * Quando a integração com o backend for feita, este ficheiro deve ser
 * substituído por chamadas reais (Supabase) e a flag `temDivida` deve
 * vir do sistema financeiro, nunca do cliente.
 */

export interface AlunoInfo {
  nomeCompleto: string;
  numeroAluno: string;
  classe: string;
  curso: string;
  turma: string;
  turno: string;
  anoLetivo: string;
  mediaPrimeiroTrimestre: number;
  temDivida: boolean;
  fotoIniciais: string;
}

export const alunoMock: AlunoInfo = {
  nomeCompleto: "Beatriz Kiala Domingos",
  numeroAluno: "2026-00417",
  classe: "11.ª Classe",
  curso: "Ciências Físicas e Biológicas",
  turma: "Turma B",
  turno: "Manhã",
  anoLetivo: "2026/2027",
  mediaPrimeiroTrimestre: 15.8,
  temDivida: false,
  fotoIniciais: "BK",
};

export interface DisciplinaNota {
  disciplina: string;
  mac: number;
  npp: number;
  npt: number;
  media: number;
}

export const notasMock: DisciplinaNota[] = [
  { disciplina: "Matemática", mac: 16, npp: 15, npt: 17, media: 16.0 },
  { disciplina: "Física", mac: 14, npp: 15, npt: 16, media: 15.0 },
  { disciplina: "Química", mac: 15, npp: 14, npt: 15, media: 14.7 },
  { disciplina: "Biologia", mac: 17, npp: 16, npt: 18, media: 17.0 },
  { disciplina: "Português", mac: 15, npp: 16, npt: 15, media: 15.3 },
  { disciplina: "Inglês", mac: 16, npp: 17, npt: 16, media: 16.3 },
  { disciplina: "História", mac: 14, npp: 13, npt: 15, media: 14.0 },
  { disciplina: "Educação Física", mac: 18, npp: 18, npt: 19, media: 18.3 },
];

export interface BoletimTrimestre {
  id: string;
  trimestre: string;
  mediaGeral: number;
  disponivel: boolean;
}

export const boletinsMock: BoletimTrimestre[] = [
  { id: "b1", trimestre: "1.º Trimestre", mediaGeral: 15.8, disponivel: true },
  { id: "b2", trimestre: "2.º Trimestre", mediaGeral: 0, disponivel: false },
  { id: "b3", trimestre: "3.º Trimestre", mediaGeral: 0, disponivel: false },
];

export interface PropinaPeriodo {
  id: string;
  periodo: string;
  valor: number;
  vencimento: string;
  estado: "pago" | "pendente" | "atrasado";
  dataPagamento?: string;
  recibo?: string;
}

export const propinasMock: PropinaPeriodo[] = [
  {
    id: "p1",
    periodo: "Setembro/2026",
    valor: 25000,
    vencimento: "05/09/2026",
    estado: "pago",
    dataPagamento: "03/09/2026",
    recibo: "REC-2026-0091",
  },
  {
    id: "p2",
    periodo: "Outubro/2026",
    valor: 25000,
    vencimento: "05/10/2026",
    estado: "pago",
    dataPagamento: "04/10/2026",
    recibo: "REC-2026-0142",
  },
  {
    id: "p3",
    periodo: "Novembro/2026",
    valor: 25000,
    vencimento: "05/11/2026",
    estado: "pago",
    dataPagamento: "05/11/2026",
    recibo: "REC-2026-0198",
  },
  {
    id: "p4",
    periodo: "Dezembro/2026",
    valor: 25000,
    vencimento: "05/12/2026",
    estado: "pendente",
  },
];

export const resumoFinanceiroMock = {
  totalPago: 75000,
  totalDivida: 25000,
  moeda: "Kz",
};

export interface RankingAluno {
  posicao: number;
  nome: string;
  turma: string;
  media: number;
  souEu?: boolean;
}

export const rankingMock: RankingAluno[] = [
  { posicao: 1, nome: "Marta Sofia Neto", turma: "Turma B", media: 18.4 },
  { posicao: 2, nome: "Edson Manuel Paulo", turma: "Turma B", media: 17.9 },
  { posicao: 3, nome: "Beatriz Kiala Domingos", turma: "Turma B", media: 15.8, souEu: true },
  { posicao: 4, nome: "Fábio André Sami", turma: "Turma B", media: 15.2 },
  { posicao: 5, nome: "Cátia Isabel Ventura", turma: "Turma B", media: 14.6 },
  { posicao: 6, nome: "Rúben Costa Pereira", turma: "Turma B", media: 14.1 },
  { posicao: 7, nome: "Ivo Domingos Sacanga", turma: "Turma B", media: 13.5 },
];

export interface NotificacaoItem {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  lida: boolean;
  tipo: "aviso" | "financeiro" | "academico";
}

export const notificacoesMock: NotificacaoItem[] = [
  {
    id: "n1",
    titulo: "Boletim do 1.º trimestre disponível",
    conteudo:
      "O boletim do 1.º trimestre já está disponível para consulta e download na área de Notas e boletim.",
    data: "18 set. 2026",
    lida: false,
    tipo: "academico",
  },
  {
    id: "n2",
    titulo: "Lembrete de propina — Dezembro",
    conteudo:
      "A propina referente a Dezembro/2026 vence a 05/12/2026. Regularize a tempo para evitar restrições de acesso.",
    data: "15 set. 2026",
    lida: false,
    tipo: "financeiro",
  },
  {
    id: "n3",
    titulo: "Reunião de pais e encarregados de educação",
    conteudo:
      "Convocamos os encarregados de educação para a reunião trimestral no dia 28 de setembro, às 14h00, no auditório.",
    data: "10 set. 2026",
    lida: true,
    tipo: "aviso",
  },
  {
    id: "n4",
    titulo: "Alteração pontual de horário — Educação Física",
    conteudo:
      "A aula de Educação Física de quinta-feira passa para o período da tarde, na próxima semana apenas.",
    data: "02 set. 2026",
    lida: true,
    tipo: "academico",
  },
];

export interface AulaHorario {
  disciplina: string;
  sala: string;
  inicio: string;
  fim: string;
}

export const horarioMock: Record<string, AulaHorario[]> = {
  Segunda: [
    { disciplina: "Matemática", sala: "Sala 12", inicio: "07:30", fim: "08:15" },
    { disciplina: "Física", sala: "Lab. 2", inicio: "08:15", fim: "09:00" },
    { disciplina: "Português", sala: "Sala 12", inicio: "09:15", fim: "10:00" },
  ],
  Terça: [
    { disciplina: "Biologia", sala: "Lab. 1", inicio: "07:30", fim: "08:15" },
    { disciplina: "Inglês", sala: "Sala 12", inicio: "08:15", fim: "09:00" },
    { disciplina: "Educação Física", sala: "Pavilhão", inicio: "09:15", fim: "10:00" },
  ],
  Quarta: [
    { disciplina: "Química", sala: "Lab. 2", inicio: "07:30", fim: "08:15" },
    { disciplina: "Matemática", sala: "Sala 12", inicio: "08:15", fim: "09:00" },
    { disciplina: "História", sala: "Sala 12", inicio: "09:15", fim: "10:00" },
  ],
  Quinta: [
    { disciplina: "Física", sala: "Lab. 2", inicio: "07:30", fim: "08:15" },
    { disciplina: "Biologia", sala: "Lab. 1", inicio: "08:15", fim: "09:00" },
    { disciplina: "Português", sala: "Sala 12", inicio: "09:15", fim: "10:00" },
  ],
  Sexta: [
    { disciplina: "Inglês", sala: "Sala 12", inicio: "07:30", fim: "08:15" },
    { disciplina: "Química", sala: "Lab. 2", inicio: "08:15", fim: "09:00" },
    { disciplina: "Matemática", sala: "Sala 12", inicio: "09:15", fim: "10:00" },
  ],
};

export interface FaltaRegisto {
  id: string;
  data: string;
  disciplina: string;
  quantidade: number;
  justificada: "justificada" | "pendente" | "nao-justificada";
}

export const faltasMock: FaltaRegisto[] = [
  { id: "f1", data: "12/09/2026", disciplina: "Física", quantidade: 1, justificada: "justificada" },
  {
    id: "f2",
    data: "15/09/2026",
    disciplina: "Matemática",
    quantidade: 2,
    justificada: "pendente",
  },
  {
    id: "f3",
    data: "17/09/2026",
    disciplina: "Química",
    quantidade: 1,
    justificada: "nao-justificada",
  },
];
