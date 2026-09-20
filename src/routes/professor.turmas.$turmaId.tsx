import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpenCheck, ClipboardEdit, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { EmptyState } from "@/components/aluno/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alunosPorTurma, turmasMock } from "@/lib/professor/mock-data";

export const Route = createFileRoute("/professor/turmas/$turmaId")({
  head: () => ({ meta: [{ title: "Minha Turma — Área do Professor | Huambo Calunga II" }] }),
  component: MinhaTurmaPage,
});

function MinhaTurmaPage() {
  const { turmaId } = Route.useParams();
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = React.useState("");

  const turma = turmasMock.find((t) => t.id === turmaId);

  if (!turma) {
    return (
      <div>
        <PageHeader icon={Users} title="Turma não encontrada" />
        <EmptyState icon={Search} title="Esta turma não está atribuída a ti">
          Volta a Minhas Turmas para escolher uma turma válida.
        </EmptyState>
        <Button asChild variant="outline" className="mt-5 gap-1.5">
          <Link to="/professor/turmas">
            <ArrowLeft className="size-4" />
            Voltar às Minhas Turmas
          </Link>
        </Button>
      </div>
    );
  }

  const alunos = alunosPorTurma(turma.id);
  const termo = pesquisa.trim().toLowerCase();
  const alunosFiltrados = termo
    ? alunos.filter(
        (a) =>
          a.nomeCompleto.toLowerCase().includes(termo) || a.numero.toLowerCase().includes(termo),
      )
    : alunos;

  const irPara = (destino: "/professor/notas" | "/professor/lancar-notas") =>
    navigate({ to: destino, search: { turma: turma.id } });

  return (
    <div>
      <PageHeader
        icon={Users}
        title={turma.nome}
        description={`${turma.curso} · ${turma.classe} · Ano letivo ${turma.anoLetivo}`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total de alunos
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {turma.totalAlunos}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Disciplinas atribuídas
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {turma.disciplinas.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => irPara("/professor/notas")}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <BookOpenCheck className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">Disciplinas e Notas</span>
            <span className="block truncate text-xs text-muted-foreground">
              Consultar pautas da {turma.nome}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => irPara("/professor/lancar-notas")}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <ClipboardEdit className="size-4.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">Lançar Notas</span>
            <span className="block truncate text-xs text-muted-foreground">
              Registar médias da {turma.nome}
            </span>
          </span>
        </button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b border-border p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar por nome ou número..."
                className="pl-9"
                aria-label="Pesquisar alunos"
              />
            </div>
          </div>

          {alunos.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Users} title="Turma sem alunos">
                Esta turma ainda não tem alunos atribuídos.
              </EmptyState>
            </div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Search} title="Nenhum aluno encontrado">
                Tenta pesquisar por outro nome ou número.
              </EmptyState>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Número</TableHead>
                    <TableHead>Nome completo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.numero}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {aluno.numero}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {aluno.nomeCompleto}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="mt-6 gap-1.5">
        <Link to="/professor/turmas">
          <ArrowLeft className="size-4" />
          Voltar às Minhas Turmas
        </Link>
      </Button>
    </div>
  );
}
