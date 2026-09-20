import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpenCheck, ClipboardEdit, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { EmptyState } from "@/components/aluno/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatarMedia } from "@/lib/aluno/format";
import { TRIMESTRES, alunosPorTurma, notasDaTurma, turmasMock } from "@/lib/professor/mock-data";
import type { AlunoResumo, NotaAluno, Turma } from "@/lib/professor/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professor/turmas/$turmaId")({
  head: () => ({ meta: [{ title: "Minha Turma — Área do Professor | Huambo Calunga II" }] }),
  component: MinhaTurmaPage,
});

function MinhaTurmaPage() {
  const { turmaId } = Route.useParams();
  const navigate = useNavigate();

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
              Ver em ecrã inteiro, com filtros de curso e classe
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

      <SecaoDisciplinasNotas turma={turma} alunos={alunos} />

      <Button asChild variant="outline" className="mt-6 gap-1.5">
        <Link to="/professor/turmas">
          <ArrowLeft className="size-4" />
          Voltar às Minhas Turmas
        </Link>
      </Button>
    </div>
  );
}

/**
 * Grelha de "Disciplinas e Notas" da turma: alunos na vertical, disciplinas na horizontal,
 * média trimestral em cada célula. Clicar numa média abre o detalhe (MAC, NPP, NPT).
 * Só mostra as disciplinas atribuídas a este professor nesta turma (turma.disciplinas) —
 * nunca disciplinas de outros professores, e sem nenhuma ação de edição aqui.
 */
function SecaoDisciplinasNotas({ turma, alunos }: { turma: Turma; alunos: AlunoResumo[] }) {
  const [trimestre, setTrimestre] = React.useState<string>(TRIMESTRES[0]);
  const [pesquisa, setPesquisa] = React.useState("");
  const [detalhe, setDetalhe] = React.useState<{ nota: NotaAluno; nomeAluno: string } | null>(null);

  const termo = pesquisa.trim().toLowerCase();
  const alunosFiltrados = termo
    ? alunos.filter(
        (a) =>
          a.nomeCompleto.toLowerCase().includes(termo) || a.numero.toLowerCase().includes(termo),
      )
    : alunos;

  const notasPorDisciplina = React.useMemo(() => {
    const mapa = new Map<string, NotaAluno[]>();
    for (const disciplina of turma.disciplinas) {
      mapa.set(disciplina, notasDaTurma(turma.id, disciplina, trimestre));
    }
    return mapa;
  }, [turma, trimestre]);

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <BookOpenCheck className="size-4.5 text-primary" aria-hidden="true" />
              Disciplinas e Notas
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {turma.classe} · {turma.nome} · {turma.curso} · Ano letivo {turma.anoLetivo}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-44">
              <label className="sr-only" htmlFor="trimestre-turma">
                Trimestre
              </label>
              <Select value={trimestre} onValueChange={setTrimestre}>
                <SelectTrigger id="trimestre-turma" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIMESTRES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-56">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar por nome ou número..."
                className="pl-9"
                aria-label="Pesquisar alunos por nome ou número"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {alunos.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Users} title="Turma sem alunos">
                Esta turma ainda não tem alunos atribuídos.
              </EmptyState>
            </div>
          ) : turma.disciplinas.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={BookOpenCheck} title="Nenhuma disciplina atribuída">
                Não tens disciplinas atribuídas nesta turma.
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
                    <TableHead className="sticky left-0 z-10 w-28 bg-card">Número</TableHead>
                    <TableHead className="sticky left-28 z-10 min-w-40 bg-card">
                      Nome do aluno
                    </TableHead>
                    {turma.disciplinas.map((d) => (
                      <TableHead key={d} className="text-center whitespace-nowrap">
                        {d}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.numero}>
                      <TableCell className="sticky left-0 z-10 bg-card font-mono text-xs text-muted-foreground">
                        {aluno.numero}
                      </TableCell>
                      <TableCell className="sticky left-28 z-10 min-w-40 bg-card font-semibold text-foreground">
                        {aluno.nomeCompleto}
                      </TableCell>
                      {turma.disciplinas.map((disciplina) => {
                        const nota = notasPorDisciplina
                          .get(disciplina)
                          ?.find((n) => n.numeroAluno === aluno.numero);

                        if (
                          !nota ||
                          nota.estado === "por-lancar" ||
                          nota.mediaTrimestral === null
                        ) {
                          return (
                            <TableCell
                              key={disciplina}
                              className="text-center font-mono text-muted-foreground"
                              aria-label={`${disciplina}: nota ainda não lançada`}
                            >
                              —
                            </TableCell>
                          );
                        }

                        const reprovado = nota.mediaTrimestral < 10;
                        return (
                          <TableCell key={disciplina} className="text-center">
                            <button
                              type="button"
                              onClick={() => setDetalhe({ nota, nomeAluno: aluno.nomeCompleto })}
                              className={cn(
                                "rounded-md px-2.5 py-1 font-display text-sm font-extrabold underline-offset-2 hover:bg-accent hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                                reprovado ? "text-destructive" : "text-foreground",
                              )}
                              aria-label={`${disciplina}, média ${formatarMedia(nota.mediaTrimestral)}. Ver detalhe da avaliação`}
                            >
                              {formatarMedia(nota.mediaTrimestral)}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detalhe} onOpenChange={(open) => !open && setDetalhe(null)}>
        <DialogContent>
          {detalhe && (
            <>
              <DialogHeader>
                <DialogTitle>{detalhe.nomeAluno}</DialogTitle>
                <DialogDescription>
                  {detalhe.nota.disciplina} · {detalhe.nota.trimestre}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <LinhaDetalhe
                  label="MAC — Média de Avaliação Contínua"
                  valor={detalhe.nota.avaliacaoContinua}
                />
                <LinhaDetalhe
                  label="NPP — Nota da Prova do Professor"
                  valor={detalhe.nota.provaProfessor}
                />
                <LinhaDetalhe
                  label="NPT — Nota da Prova Trimestral"
                  valor={detalhe.nota.provaTrimestral}
                />
                <div className="flex items-center justify-between rounded-lg bg-brand-pale px-3.5 py-3">
                  <span className="text-sm font-bold text-foreground">Média trimestral</span>
                  <span className="font-display text-lg font-extrabold text-primary">
                    {detalhe.nota.mediaTrimestral === null
                      ? "Não lançada"
                      : formatarMedia(detalhe.nota.mediaTrimestral)}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function LinhaDetalhe({ label, valor }: { label: string; valor: number | null }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold",
          valor === null ? "text-muted-foreground italic" : "text-foreground",
        )}
      >
        {valor === null ? "Não lançada" : formatarMedia(valor)}
      </span>
    </div>
  );
}
