import { createFileRoute } from "@tanstack/react-router";
import { CalendarX2, CircleCheck, Clock, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { Pill, type TomPill } from "@/components/aluno/pill";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarData } from "@/lib/aluno/format";
import type { EstadoJustificacao } from "@/lib/aluno/types";

export const Route = createFileRoute("/aluno/faltas")({
  head: () => ({ meta: [{ title: "Mapa de faltas — Área do Aluno" }] }),
  component: FaltasPage,
});

const ESTADOS: Record<EstadoJustificacao, { tom: TomPill; rotulo: string; icone: typeof Clock }> = {
  justificada: { tom: "sucesso", rotulo: "Justificada", icone: CircleCheck },
  injustificada: { tom: "perigo", rotulo: "Injustificada", icone: TriangleAlert },
  "em-analise": { tom: "aviso", rotulo: "Em análise", icone: Clock },
};

function FaltasPage() {
  const { faltas } = useAluno();

  const soma = (estado?: EstadoJustificacao) =>
    faltas
      .filter((f) => !estado || f.justificacao === estado)
      .reduce((total, f) => total + f.quantidade, 0);

  const porDisciplina = Object.entries(
    faltas.reduce<Record<string, number>>((acc, f) => {
      acc[f.disciplina] = (acc[f.disciplina] ?? 0) + f.quantidade;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const maximo = porDisciplina[0]?.[1] ?? 1;

  const resumo: Array<{ rotulo: string; valor: number }> = [
    { rotulo: "Total de faltas", valor: soma() },
    { rotulo: "Justificadas", valor: soma("justificada") },
    { rotulo: "Injustificadas", valor: soma("injustificada") },
    { rotulo: "Em análise", valor: soma("em-analise") },
  ];

  return (
    <>
      <PageHeader
        icon={CalendarX2}
        title="Mapa de faltas"
        description="As tuas faltas por disciplina e o estado de cada justificação."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {resumo.map((r) => (
          <div key={r.rotulo} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-muted-foreground">{r.rotulo}</p>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{r.valor}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="por-disciplina" className="mt-8">
        <h2 id="por-disciplina" className="mb-3 text-lg font-extrabold text-foreground">
          Por disciplina
        </h2>
        <ul className="space-y-3 rounded-2xl border border-border bg-card p-5">
          {porDisciplina.map(([disciplina, total]) => (
            <li key={disciplina} className="flex items-center gap-4">
              <span className="w-36 shrink-0 truncate text-sm font-semibold text-foreground sm:w-44">
                {disciplina}
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${(total / maximo) * 100}%` }}
                />
              </span>
              <span className="w-6 text-right text-sm font-bold text-foreground tabular-nums">
                {total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="registo" className="mt-8">
        <h2 id="registo" className="mb-3 text-lg font-extrabold text-foreground">
          Registo
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[30rem] text-sm">
            <caption className="sr-only">Registo de faltas</caption>
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Data
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Disciplina
                </th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">
                  Faltas
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Justificação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {faltas.map((f) => {
                const estado = ESTADOS[f.justificacao];
                return (
                  <tr key={f.id}>
                    <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">
                      {formatarData(f.data)}
                    </th>
                    <td className="px-3 py-3 text-foreground">{f.disciplina}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{f.quantidade}</td>
                    <td className="px-5 py-3 text-right">
                      <Pill tom={estado.tom} icone={estado.icone}>
                        {estado.rotulo}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
