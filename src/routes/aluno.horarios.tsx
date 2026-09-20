import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Coffee } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { useAluno } from "@/lib/aluno/aluno-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/horarios")({
  head: () => ({ meta: [{ title: "Horários — Área do Aluno" }] }),
  component: HorariosPage,
});

function HorariosPage() {
  const { horario, perfil } = useAluno();
  const [dia, setDia] = React.useState(0);

  return (
    <>
      <PageHeader
        icon={CalendarDays}
        title="Horários"
        description={`${perfil.classe}, turma ${horario.turma}, turno da ${horario.turno.toLowerCase()}.`}
      />

      {/* Telemóvel: um dia de cada vez. */}
      <div className="md:hidden">
        <div role="tablist" aria-label="Dia da semana" className="mb-4 flex gap-1.5 overflow-x-auto">
          {horario.dias.map((nome, i) => (
            <button
              key={nome}
              type="button"
              role="tab"
              aria-selected={dia === i}
              onClick={() => setDia(i)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                dia === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {nome.replace("-feira", "")}
            </button>
          ))}
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {horario.linhas.map((linha) => {
            const aula = linha.intervalo ? null : (linha.aulas[dia] ?? null);
            return (
              <li key={linha.inicio} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
                  {linha.inicio} – {linha.fim}
                </span>
                {linha.intervalo ? (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Coffee className="size-4" aria-hidden="true" /> Intervalo
                  </span>
                ) : aula ? (
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-foreground">{aula.disciplina}</span>
                    <span className="block text-xs text-muted-foreground">
                      {aula.sala ? `Sala ${aula.sala}` : "Sala por atribuir"}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Sem aula</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Ecrãs maiores: a semana inteira. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full min-w-[46rem] table-fixed text-sm">
          <caption className="sr-only">Horário semanal da turma {horario.turma}</caption>
          <thead className="bg-muted/60 text-left text-muted-foreground">
            <tr>
              <th scope="col" className="w-28 px-4 py-3 font-semibold">
                Hora
              </th>
              {horario.dias.map((nome) => (
                <th key={nome} scope="col" className="px-3 py-3 font-semibold">
                  {nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {horario.linhas.map((linha) =>
              linha.intervalo ? (
                <tr key={linha.inicio} className="bg-muted/40">
                  <th scope="row" className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground tabular-nums">
                    {linha.inicio} – {linha.fim}
                  </th>
                  <td
                    colSpan={horario.dias.length}
                    className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground"
                  >
                    Intervalo
                  </td>
                </tr>
              ) : (
                <tr key={linha.inicio}>
                  <th scope="row" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground tabular-nums">
                    {linha.inicio} – {linha.fim}
                  </th>
                  {horario.dias.map((nome, i) => {
                    const aula = linha.aulas[i] ?? null;
                    return (
                      <td key={nome} className="px-3 py-3 align-top">
                        {aula ? (
                          <>
                            <span className="block font-bold text-foreground">{aula.disciplina}</span>
                            <span className="block text-xs text-muted-foreground">
                              {aula.sala ? `Sala ${aula.sala}` : "Sala por atribuir"}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">Sem aula</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
