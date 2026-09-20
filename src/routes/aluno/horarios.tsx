import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alunoMock, horarioMock } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/horarios")({
  head: () => ({
    meta: [{ title: "Horários — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoHorariosPage,
});

const diasComAulas = Object.entries(horarioMock);

function AlunoHorariosPage() {
  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={CalendarClock}
        title="Horários"
        description={`Horário semanal da ${alunoMock.turma} · Turno da ${alunoMock.turno.toLowerCase()}.`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {diasComAulas.map(([dia, aulas]) => (
          <Card key={dia} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">{dia}-feira</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {aulas.map((aula, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{aula.disciplina}</p>
                    <p className="text-xs text-muted-foreground">{aula.sala}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-primary">
                    {aula.inicio} – {aula.fim}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </AlunoShell>
  );
}
