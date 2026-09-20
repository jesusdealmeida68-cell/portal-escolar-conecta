import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { EmptyState } from "@/components/aluno/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { turmasMock } from "@/lib/professor/mock-data";

export const Route = createFileRoute("/professor/turmas")({
  head: () => ({ meta: [{ title: "Minhas Turmas — Área do Professor | Huambo Calunga II" }] }),
  component: MinhasTurmasPage,
});

function MinhasTurmasPage() {
  const [pesquisa, setPesquisa] = React.useState("");

  const termo = pesquisa.trim().toLowerCase();
  const turmasFiltradas = termo
    ? turmasMock.filter((t) =>
        [t.nome, t.classe, t.curso].some((campo) => campo.toLowerCase().includes(termo)),
      )
    : turmasMock;

  const totalAlunos = turmasMock.reduce((acc, t) => acc + t.totalAlunos, 0);

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Minhas Turmas"
        description="Consulta as turmas que te foram atribuídas neste ano letivo."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total de turmas
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {turmasMock.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total de alunos
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {totalAlunos}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Pesquisar por turma, classe ou curso..."
          className="pl-9"
          aria-label="Pesquisar turmas"
        />
      </div>

      {turmasFiltradas.length === 0 ? (
        <EmptyState icon={Search} title="Nenhuma turma encontrada">
          Tenta pesquisar por outro nome de turma, classe ou curso.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {turmasFiltradas.map((turma) => (
            <Card key={turma.id} className="flex flex-col border-border">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-extrabold text-foreground">
                    {turma.nome}
                  </h3>
                  <span className="shrink-0 rounded-full bg-brand-pale px-2.5 py-1 text-xs font-bold text-primary">
                    {turma.totalAlunos} alunos
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{turma.classe}</p>
                <p className="text-sm text-muted-foreground">{turma.curso}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {turma.disciplinas.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      <BookOpenCheck className="size-3" aria-hidden="true" />
                      {d}
                    </span>
                  ))}
                </div>

                <Button asChild className="mt-5 w-full">
                  <Link to="/professor/turmas/$turmaId" params={{ turmaId: turma.id }}>
                    Abrir turma
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
