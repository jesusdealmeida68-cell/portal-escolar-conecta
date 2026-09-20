import * as React from "react";

import {
  PERFIL_DEMO,
  obterAcademico,
  obterFaltas,
  obterHorario,
  obterNotificacoes,
  obterPropinas,
  obterRanking,
  type Cenario,
} from "./mock-data";
import type {
  Academico,
  ContaPropinas,
  HorarioTurma,
  Notificacao,
  PerfilAluno,
  RankingTurma,
  RegistoFalta,
} from "./types";

/**
 * Ponto único de acesso aos dados da Área do Aluno.
 *
 * AGORA: devolve dados de demonstração (`mock-data.ts`).
 * DEPOIS (Supabase): substituir o conteúdo do `useMemo` por consultas reais
 * (ex.: TanStack Query + `supabase.rpc(...)`) mantendo o mesmo formato de retorno,
 * para as páginas não precisarem de mudar.
 *
 * `academico` e `ranking` são `null` quando o aluno tem propinas em dívida:
 * as páginas nunca recebem notas, médias nem classificação nesse caso.
 */
export interface AlunoData {
  perfil: PerfilAluno;
  propinas: ContaPropinas;
  temDivida: boolean;
  academico: Academico | null;
  ranking: RankingTurma | null;
  notificacoes: Notificacao[];
  naoLidas: number;
  marcarComoLida: (id: string) => void;
  horario: HorarioTurma;
  faltas: RegistoFalta[];
  /** Só para a demonstração: alterna entre propinas em dia / em dívida. */
  demo: { cenario: Cenario; definirCenario: (c: Cenario) => void };
}

const AlunoContext = React.createContext<AlunoData | null>(null);

export function AlunoProvider({ children }: { children: React.ReactNode }) {
  const [cenario, setCenario] = React.useState<Cenario>("em-dia");
  const [abertas, setAbertas] = React.useState<string[]>([]);

  const value = React.useMemo<AlunoData>(() => {
    const propinas = obterPropinas(cenario);

    const notificacoes = obterNotificacoes(cenario)
      .map((n) => ({ ...n, lida: n.lida || abertas.includes(n.id) }))
      .sort((a, b) => (a.data < b.data ? 1 : -1));

    return {
      perfil: PERFIL_DEMO,
      propinas,
      temDivida: propinas.estado === "em-divida",
      academico: obterAcademico(cenario),
      ranking: obterRanking(cenario),
      notificacoes,
      naoLidas: notificacoes.filter((n) => !n.lida).length,
      marcarComoLida: (id) => setAbertas((atual) => (atual.includes(id) ? atual : [...atual, id])),
      horario: obterHorario(),
      faltas: obterFaltas(),
      demo: { cenario, definirCenario: setCenario },
    };
  }, [cenario, abertas]);

  return <AlunoContext.Provider value={value}>{children}</AlunoContext.Provider>;
}

export function useAluno(): AlunoData {
  const ctx = React.useContext(AlunoContext);
  if (!ctx) throw new Error("useAluno tem de ser usado dentro de <AlunoProvider>.");
  return ctx;
}
