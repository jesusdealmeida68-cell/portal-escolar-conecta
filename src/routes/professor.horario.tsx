import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Clock3, DoorOpen } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { horarioMock, intervalosMock, proximaAulaMock } from "@/lib/professor/mock-data";
import type { AulaHorario } from "@/lib/professor/types";

export const Route = createFileRoute("/professor/horario")({
  head: () => ({ meta: [{ title: "Horário — Área do Professor | Huambo Calunga II" }] }),
  component: HorarioProfessorPage,
});

const DIAS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
] as const satisfies ReadonlyArray<AulaHorario["dia"]>;

type Item =
  | { tipo: "aula"; inicio: string; aula: AulaHorario }
  | { tipo: "intervalo"; inicio: string; fim: string };

function itensDoDia(dia: AulaHorario["dia"]): Item[] {
  const aulas: Item[] = horarioMock
    .filter((a) => a.dia === dia)
    .map((aula) => ({ tipo: "aula" as const, inicio: aula.inicio, aula }));
  const intervalos: Item[] = intervalosMock
    .filter((i) => i.dia === dia)
    .map((i) => ({ tipo: "intervalo" as const, inicio: i.inicio, fim: i.fim }));
  return [...aulas, ...intervalos].sort((a, b) => a.inicio.localeCompare(b.inicio));
}

function CartaoAula({ aula }: { aula: AulaHorario }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="w-16 shrink-0 text-center">
        <p className="text-sm font-extrabold text-foreground">{aula.inicio}</p>
        <p className="text-xs text-muted-foreground">{aula.fim}</p>
      </div>
      <div className="h-10 w-px shrink-0 bg-border" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{aula.disciplina}</p>
        <p className="truncate text-xs text-muted-foreground">
          {aula.curso} · {aula.classe} · {aula.turma}
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        <DoorOpen className="size-3" aria-hidden="true" />
        {aula.sala}
      </span>
    </div>
  );
}

function LinhaIntervalo({ inicio, fim }: { inicio: string; fim: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 pl-2 text-xs text-muted-foreground">
      <span className="h-px flex-1 border-t border-dashed border-border" />
      Intervalo · {inicio} – {fim}
      <span className="h-px flex-1 border-t border-dashed border-border" />
    </div>
  );
}

function HorarioProfessorPage() {
  const [modo, setModo] = React.useState<"dia" | "semana">("dia");
  const [diaSelecionado, setDiaSelecionado] = React.useState<AulaHorario["dia"]>(DIAS[0]);

  return (
    <div>
      <PageHeader
        icon={CalendarClock}
        title="Horário"
        description="Consulta os dias e horários das tuas aulas."
      />

      <Card className="mb-6 overflow-hidden border-border">
        <div className="bg-gradient-to-r from-primary to-brand-soft px-5 py-5 text-primary-foreground sm:px-7">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
            <Clock3 className="size-3.5" />
            Próxima aula (demonstração)
          </p>
          <h2 className="mt-1.5 font-display text-xl font-extrabold sm:text-2xl">
            {proximaAulaMock.disciplina} · {proximaAulaMock.inicio}–{proximaAulaMock.fim}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/85">
            {proximaAulaMock.curso} · {proximaAulaMock.classe} · {proximaAulaMock.turma} · Sala{" "}
            {proximaAulaMock.sala}
          </p>
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={modo} onValueChange={(v) => setModo(v as "dia" | "semana")}>
          <TabsList>
            <TabsTrigger value="dia">Dia selecionado</TabsTrigger>
            <TabsTrigger value="semana">Semana completa</TabsTrigger>
          </TabsList>
        </Tabs>

        {modo === "dia" && (
          <div className="flex gap-1 overflow-x-auto">
            {DIAS.map((dia) => (
              <button
                key={dia}
                type="button"
                onClick={() => setDiaSelecionado(dia)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  diaSelecionado === dia
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                {dia.replace("-feira", "")}
              </button>
            ))}
          </div>
        )}
      </div>

      {modo === "dia" ? (
        <div className="space-y-2">
          {itensDoDia(diaSelecionado).map((item, i) =>
            item.tipo === "aula" ? (
              <CartaoAula key={i} aula={item.aula} />
            ) : (
              <LinhaIntervalo key={i} inicio={item.inicio} fim={item.fim} />
            ),
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DIAS.map((dia) => (
            <Card key={dia} className="border-border">
              <CardContent className="p-4">
                <h3 className="mb-3 font-display text-base font-extrabold text-foreground">
                  {dia}
                </h3>
                <div className="space-y-2">
                  {itensDoDia(dia).map((item, i) =>
                    item.tipo === "aula" ? (
                      <CartaoAula key={i} aula={item.aula} />
                    ) : (
                      <LinhaIntervalo key={i} inicio={item.inicio} fim={item.fim} />
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
