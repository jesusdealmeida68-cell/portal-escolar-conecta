import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpenCheck,
  CalendarClock,
  ClipboardEdit,
  Clock3,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { perfilProfessorMock, proximaAulaMock, turmasMock } from "@/lib/professor/mock-data";
import { nomeCurto } from "@/lib/aluno/format";

export const Route = createFileRoute("/professor/")({
  head: () => ({ meta: [{ title: "Início — Área do Professor | Huambo Calunga II" }] }),
  component: ProfessorInicioPage,
});

function saudacao(): string {
  // Determinístico (não depende da hora do relógio do visitante) para nunca variar entre o
  // servidor e o navegador durante a hidratação.
  return "Bom dia";
}

function CartaoResumo({
  icon: Icon,
  label,
  valor,
}: {
  icon: LucideIcon;
  label: string;
  valor: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-pale text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="truncate font-display text-xl font-extrabold text-foreground">{valor}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AcessoRapido({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </span>
      <span className="text-sm font-bold text-foreground">{label}</span>
    </Link>
  );
}

function ProfessorInicioPage() {
  const totalAlunos = turmasMock.reduce((acc, t) => acc + t.totalAlunos, 0);
  const totalDisciplinas = new Set(turmasMock.flatMap((t) => t.disciplinas)).size;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          {saudacao()}, {nomeCurto(perfilProfessorMock.nomeCompleto)}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Aqui está o resumo da tua atividade escolar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoResumo icon={Users} label="Turmas atribuídas" valor={String(turmasMock.length)} />
        <CartaoResumo icon={BookOpenCheck} label="Disciplinas" valor={String(totalDisciplinas)} />
        <CartaoResumo icon={Users} label="Total de alunos" valor={String(totalAlunos)} />
        <CartaoResumo
          icon={Clock3}
          label="Próxima aula"
          valor={`${proximaAulaMock.disciplina} · ${proximaAulaMock.inicio}`}
        />
      </div>

      <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Acessos rápidos
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AcessoRapido to="/professor/turmas" icon={Users} label="Minhas Turmas" />
        <AcessoRapido to="/professor/notas" icon={BookOpenCheck} label="Disciplinas e Notas" />
        <AcessoRapido to="/professor/lancar-notas" icon={ClipboardEdit} label="Lançar Notas" />
        <AcessoRapido to="/professor/horario" icon={CalendarClock} label="Horário" />
      </div>
    </div>
  );
}
