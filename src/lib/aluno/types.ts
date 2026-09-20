/**
 * Tipos da Área do Aluno.
 *
 * Descrevem o formato dos dados que a interface espera. Quando o Supabase for
 * ligado, as respostas do servidor devem ser mapeadas para estes tipos (ou
 * estes tipos passam a ser gerados a partir das tabelas) sem mexer nas páginas.
 */

/** Datas em ISO "AAAA-MM-DD". Horas em "HH:MM". */
export type DataISO = string;

export interface PerfilAluno {
  nomeCompleto: string;
  numeroAluno: string;
  classe: string;
  curso: string;
  turma: string;
  turno: string;
  anoLetivo: string;
}

/* ------------------------------ Propinas ------------------------------ */

export type EstadoPropinas = "em-dia" | "em-divida";
export type EstadoPeriodo = "pago" | "em-divida" | "a-vencer";

export interface PeriodoPropina {
  id: string;
  periodo: string;
  vencimento: DataISO;
  valor: number;
  estado: EstadoPeriodo;
}

/** Só existe se o sistema financeiro confirmou o pagamento. */
export interface PagamentoConfirmado {
  id: string;
  confirmadoEm: DataISO;
  periodo: string;
  valor: number;
  /** null enquanto o recibo ainda não foi emitido. */
  recibo: { numero: string } | null;
}

export interface ContaPropinas {
  estado: EstadoPropinas;
  totalPago: number;
  totalEmDivida: number;
  periodos: PeriodoPropina[];
  pagamentos: PagamentoConfirmado[];
}

/* ------------------------- Notas e médias (0–20) ------------------------- */

export interface NotaDisciplina {
  disciplina: string;
  avaliacaoContinua: number;
  provaProfessor: number;
  provaTrimestral: number;
  mediaTrimestral: number;
}

export type Trimestre = 1 | 2 | 3;

export interface BoletimTrimestre {
  trimestre: Trimestre;
  /** false quando ainda não há notas oficiais lançadas. */
  disponivel: boolean;
  notas: NotaDisciplina[];
  media: number | null;
}

/** Só é entregue à interface quando NÃO há propinas em dívida. */
export interface Academico {
  boletins: BoletimTrimestre[];
}

/* ------------------------------- Ranking ------------------------------- */

export interface LinhaRanking {
  posicao: number;
  nome: string;
  turma: string;
  media: number;
  /** true na linha do aluno autenticado. */
  eu: boolean;
}

export interface RankingTurma {
  trimestre: Trimestre;
  turma: string;
  linhas: LinhaRanking[];
}

/* ---------------------------- Notificações ---------------------------- */

export interface Notificacao {
  id: string;
  titulo: string;
  conteudo: string;
  data: DataISO;
  lida: boolean;
}

/* ------------------------------ Horário ------------------------------ */

export interface AulaHorario {
  disciplina: string;
  /** Omitida quando a sala ainda não foi atribuída. */
  sala?: string;
}

export interface LinhaHorario {
  inicio: string;
  fim: string;
  intervalo?: boolean;
  /** Segunda a sexta; null = sem aula. Vazio quando `intervalo` é true. */
  aulas: Array<AulaHorario | null>;
}

export interface HorarioTurma {
  turma: string;
  turno: string;
  dias: string[];
  linhas: LinhaHorario[];
}

/* ------------------------------- Faltas ------------------------------- */

export type EstadoJustificacao = "justificada" | "injustificada" | "em-analise";

export interface RegistoFalta {
  id: string;
  data: DataISO;
  disciplina: string;
  quantidade: number;
  justificacao: EstadoJustificacao;
}
