/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DADOS DE DEMONSTRAÇÃO — nada aqui é real.                           ║
 * ║  Servem só para ver o desenho da Área do Aluno antes de ligar o      ║
 * ║  Supabase. Ao ligar a base de dados, substituir as funções `obter…`  ║
 * ║  deste ficheiro por consultas reais (ver `aluno-context.tsx`).       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */
import type {
  Academico,
  BoletimTrimestre,
  ContaPropinas,
  HorarioTurma,
  LinhaRanking,
  NotaDisciplina,
  Notificacao,
  PagamentoConfirmado,
  PerfilAluno,
  PeriodoPropina,
  RankingTurma,
  RegistoFalta,
} from "./types";

export type Cenario = "em-dia" | "em-divida";

export const PERFIL_DEMO: PerfilAluno = {
  nomeCompleto: "Ana Beatriz Ferreira Domingos",
  numeroAluno: "2026-0417",
  classe: "11.ª Classe",
  curso: "Ciências Físicas e Biológicas",
  turma: "B",
  turno: "Manhã",
  anoLetivo: "2026/2027",
};

/* ------------------------------ Propinas ------------------------------ */

const VALOR_PROPINA = 25000;

const MESES_LETIVOS: Array<{ periodo: string; vencimento: string }> = [
  { periodo: "Setembro 2026", vencimento: "2026-09-10" },
  { periodo: "Outubro 2026", vencimento: "2026-10-10" },
  { periodo: "Novembro 2026", vencimento: "2026-11-10" },
  { periodo: "Dezembro 2026", vencimento: "2026-12-10" },
  { periodo: "Janeiro 2027", vencimento: "2027-01-10" },
  { periodo: "Fevereiro 2027", vencimento: "2027-02-10" },
  { periodo: "Março 2027", vencimento: "2027-03-10" },
  { periodo: "Abril 2027", vencimento: "2027-04-10" },
  { periodo: "Maio 2027", vencimento: "2027-05-10" },
  { periodo: "Junho 2027", vencimento: "2027-06-10" },
  { periodo: "Julho 2027", vencimento: "2027-07-10" },
];

/** Datas em que o sistema financeiro confirmou cada pagamento (só para os períodos pagos). */
const CONFIRMACOES = [
  { confirmadoEm: "2026-09-08", recibo: "RC-2026-0148" },
  { confirmadoEm: "2026-10-09", recibo: "RC-2026-0263" },
  { confirmadoEm: "2026-11-09", recibo: "RC-2026-0371" },
  // Recibo ainda por emitir: mostra o estado «recibo indisponível».
  { confirmadoEm: "2026-12-09", recibo: null },
];

export function obterPropinas(cenario: Cenario): ContaPropinas {
  // Em dia: Set–Dez pagos. Em dívida: só Set e Out pagos; Nov e Dez venceram sem pagamento.
  const pagosAte = cenario === "em-dia" ? 4 : 2;
  const vencidosAte = 4;

  const periodos: PeriodoPropina[] = MESES_LETIVOS.map((mes, i) => ({
    id: `p${i + 1}`,
    periodo: mes.periodo,
    vencimento: mes.vencimento,
    valor: VALOR_PROPINA,
    estado: i < pagosAte ? "pago" : i < vencidosAte ? "em-divida" : "a-vencer",
  }));

  const pagamentos: PagamentoConfirmado[] = periodos
    .filter((p) => p.estado === "pago")
    .map((p, i) => {
      const confirmacao = CONFIRMACOES[i];
      return {
        id: `pg${i + 1}`,
        confirmadoEm: confirmacao?.confirmadoEm ?? p.vencimento,
        periodo: p.periodo,
        valor: p.valor,
        recibo: confirmacao?.recibo ? { numero: confirmacao.recibo } : null,
      };
    })
    .reverse();

  const totalPago = periodos.filter((p) => p.estado === "pago").reduce((s, p) => s + p.valor, 0);
  const totalEmDivida = periodos
    .filter((p) => p.estado === "em-divida")
    .reduce((s, p) => s + p.valor, 0);

  return {
    estado: totalEmDivida > 0 ? "em-divida" : "em-dia",
    totalPago,
    totalEmDivida,
    periodos,
    pagamentos,
  };
}

/* ------------------------------- Notas ------------------------------- */

const arred = (n: number) => Math.round(n);

function nota(
  disciplina: string,
  avaliacaoContinua: number,
  provaProfessor: number,
  provaTrimestral: number,
): NotaDisciplina {
  return {
    disciplina,
    avaliacaoContinua,
    provaProfessor,
    provaTrimestral,
    mediaTrimestral: arred((avaliacaoContinua + provaProfessor + provaTrimestral) / 3),
  };
}

const NOTAS_1T: NotaDisciplina[] = [
  nota("Língua Portuguesa", 14, 15, 16),
  nota("Língua Inglesa", 16, 15, 17),
  nota("Matemática", 13, 12, 14),
  nota("Física", 12, 13, 12),
  nota("Química", 15, 14, 15),
  nota("Biologia", 17, 16, 18),
  nota("Filosofia", 15, 16, 15),
  nota("Educação Física", 18, 17, 18),
];

const mediaDe = (notas: NotaDisciplina[]) =>
  notas.reduce((s, n) => s + n.mediaTrimestral, 0) / notas.length;

/** Média oficial do 1.º trimestre (calculada a partir das notas acima). */
const MEDIA_1T = Math.round(mediaDe(NOTAS_1T) * 10) / 10;

const BOLETINS: BoletimTrimestre[] = [
  { trimestre: 1, disponivel: true, notas: NOTAS_1T, media: MEDIA_1T },
  { trimestre: 2, disponivel: false, notas: [], media: null },
  { trimestre: 3, disponivel: false, notas: [], media: null },
];

/**
 * ⚠️ REGRA DE ACESSO — no backend real, esta decisão TEM de ser tomada no servidor
 * (política RLS / função segura no Supabase que devolve erro ou vazio se houver dívida).
 * Aqui devolve `null` para a interface nunca receber notas de quem tem dívida;
 * esconder só no ecrã não chega.
 */
export function obterAcademico(cenario: Cenario): Academico | null {
  if (cenario === "em-divida") return null;
  return { boletins: BOLETINS };
}

/* ------------------------------- Ranking ------------------------------- */

const COLEGAS: Array<{ nome: string; media: number }> = [
  { nome: "Paulo André Kiala", media: 17.4 },
  { nome: "Mariana Sofia Cardoso", media: 16.9 },
  { nome: "Josina Beatriz Manuel", media: 16.2 },
  { nome: "Edson Miguel Pinto", media: 15.8 },
  { nome: "Helena Cristina Sebastião", media: 14.6 },
  { nome: "Nelson Adriano Baptista", media: 14.3 },
  { nome: "Isabel Catarina Lourenço", media: 13.9 },
  { nome: "Tiago Emanuel Neto", media: 13.4 },
  { nome: "Luzia Margarida Gaspar", media: 13.1 },
  { nome: "Ricardo Fernando Vieira", media: 12.6 },
  { nome: "Sandra Patrícia Mateus", media: 12.2 },
  { nome: "Mateus Domingos Rocha", media: 11.7 },
  { nome: "Graça Filomena Tomás", media: 10.9 },
  { nome: "Bruno Alexandre Cunha", media: 10.2 },
];

/** Mesmo aviso das notas: no backend real, negar também a classificação a quem tem dívida. */
export function obterRanking(cenario: Cenario): RankingTurma | null {
  if (cenario === "em-divida") return null;

  const linhas: LinhaRanking[] = [
    ...COLEGAS.map((c) => ({ nome: c.nome, media: c.media, eu: false })),
    { nome: PERFIL_DEMO.nomeCompleto, media: MEDIA_1T, eu: true },
  ]
    .sort((a, b) => b.media - a.media)
    .map((l, i) => ({ ...l, posicao: i + 1, turma: PERFIL_DEMO.turma }));

  return { trimestre: 1, turma: PERFIL_DEMO.turma, linhas };
}

/* ---------------------------- Notificações ---------------------------- */

export function obterNotificacoes(cenario: Cenario): Notificacao[] {
  const base: Notificacao[] = [
    {
      id: "n1",
      titulo: "Calendário das provas do 2.º trimestre",
      conteudo:
        "Já está definido o calendário das provas trimestrais do 2.º trimestre. As provas decorrem entre 8 e 19 de março, no horário normal das aulas. Consulta a tua turma na secretaria caso tenhas dúvidas sobre alguma data.",
      data: "2026-12-17",
      lida: false,
    },
    {
      id: "n2",
      titulo: "Reunião de encarregados de educação",
      conteudo:
        "Convidamos os encarregados de educação da 11.ª Classe para a reunião de balanço do 1.º trimestre, no sábado, às 9h00, no auditório da escola. A presença é importante para acompanhar o percurso escolar dos alunos.",
      data: "2026-12-14",
      lida: false,
    },
    {
      id: "n3",
      titulo: "Alteração de sala em Educação Física",
      conteudo:
        "Devido a obras no pavilhão, as aulas de Educação Física decorrem temporariamente no campo desportivo exterior. Traz roupa e calçado adequados e uma garrafa de água.",
      data: "2026-12-09",
      lida: true,
    },
    {
      id: "n4",
      titulo: "Encerramento do 1.º trimestre",
      conteudo:
        "As aulas do 1.º trimestre terminam a 18 de dezembro. O regresso está marcado para 11 de janeiro. Bom descanso e boas festas a toda a comunidade escolar.",
      data: "2026-12-04",
      lida: true,
    },
    {
      id: "n5",
      titulo: "Feira de Ciências: inscrições abertas",
      conteudo:
        "Estão abertas as inscrições para a Feira de Ciências da escola. Os grupos de até quatro alunos devem entregar o título do projeto ao professor de Física ou de Biologia até ao final do mês.",
      data: "2026-11-20",
      lida: true,
    },
  ];

  if (cenario === "em-divida") {
    return [
      {
        id: "n6",
        titulo: "Aviso: propinas em atraso",
        conteudo:
          "Consta no sistema financeiro que as propinas de novembro e dezembro de 2026 ainda não foram pagas. Enquanto houver valores em dívida, o acesso às notas e ao boletim fica condicionado. Depois de o pagamento ser confirmado pelo sistema financeiro, o acesso é restabelecido.",
        data: "2026-12-16",
        lida: false,
      },
      ...base,
    ];
  }

  return [
    {
      id: "n7",
      titulo: "Boletim do 1.º trimestre disponível",
      conteudo:
        "As notas e o boletim do 1.º trimestre já estão disponíveis na página «Notas e boletim». Podes consultar as médias por disciplina e descarregar o boletim em PDF.",
      data: "2026-12-18",
      lida: false,
    },
    ...base,
  ];
}

/* ------------------------------- Horário ------------------------------- */

const SALA = "Sala 12";

export function obterHorario(): HorarioTurma {
  // `sala` omitida → Sala 12; `null` → aula sem sala atribuída.
  const a = (disciplina: string, sala: string | null = SALA) =>
    sala ? { disciplina, sala } : { disciplina };

  return {
    turma: PERFIL_DEMO.turma,
    turno: PERFIL_DEMO.turno,
    dias: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"],
    linhas: [
      {
        inicio: "07:15",
        fim: "08:00",
        aulas: [
          a("Matemática"),
          a("Biologia", "Laboratório 1"),
          a("Língua Portuguesa"),
          a("Química", "Laboratório 2"),
          a("Língua Inglesa"),
        ],
      },
      {
        inicio: "08:00",
        fim: "08:45",
        aulas: [
          a("Matemática"),
          a("Biologia", "Laboratório 1"),
          a("Física", "Laboratório 2"),
          a("Química", "Laboratório 2"),
          a("Biologia", "Laboratório 1"),
        ],
      },
      {
        inicio: "08:45",
        fim: "09:30",
        aulas: [
          a("Língua Portuguesa"),
          a("Língua Inglesa"),
          a("Física", "Laboratório 2"),
          a("Biologia", "Laboratório 1"),
          a("Matemática"),
        ],
      },
      { inicio: "09:30", fim: "09:50", intervalo: true, aulas: [] },
      {
        inicio: "09:50",
        fim: "10:35",
        aulas: [
          a("Física", "Laboratório 2"),
          a("Matemática"),
          a("Química", "Laboratório 2"),
          a("Filosofia"),
          a("Língua Portuguesa"),
        ],
      },
      {
        inicio: "10:35",
        fim: "11:20",
        aulas: [
          a("Química", "Laboratório 2"),
          a("Educação Física", "Campo desportivo"),
          a("Matemática"),
          a("Língua Portuguesa"),
          // Sala ainda não atribuída: mostra como se comporta a falta de sala.
          a("Física", null),
        ],
      },
      {
        inicio: "11:20",
        fim: "12:05",
        aulas: [
          a("Filosofia"),
          a("Educação Física", "Campo desportivo"),
          a("Língua Inglesa"),
          a("Matemática"),
          null,
        ],
      },
    ],
  };
}

/* ------------------------------- Faltas ------------------------------- */

/** Registos lançados pela escola. O aluno nunca marca as próprias presenças. */
export function obterFaltas(): RegistoFalta[] {
  return [
    { id: "f1", data: "2026-12-11", disciplina: "Matemática", quantidade: 2, justificacao: "em-analise" },
    { id: "f2", data: "2026-11-26", disciplina: "Educação Física", quantidade: 1, justificacao: "injustificada" },
    { id: "f3", data: "2026-11-13", disciplina: "Física", quantidade: 2, justificacao: "justificada" },
    { id: "f4", data: "2026-10-29", disciplina: "Língua Inglesa", quantidade: 1, justificacao: "justificada" },
    { id: "f5", data: "2026-10-15", disciplina: "Química", quantidade: 1, justificacao: "injustificada" },
    { id: "f6", data: "2026-10-02", disciplina: "Biologia", quantidade: 2, justificacao: "justificada" },
  ];
}
