import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BookOpenCheck, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { EmptyState } from "@/components/aluno/empty-state";
import { Pill } from "@/components/aluno/pill";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatarMedia } from "@/lib/aluno/format";
import { TRIMESTRES, alunosPorTurma, notasDaTurma, turmasMock } from "@/lib/professor/mock-data";
import type { NotaAluno } from "@/lib/professor/types";

const searchSchema = z.object({ turma: z.string().optional() });

export const Route = createFileRoute("/professor/notas")({
  head: () => ({
    meta: [{ title: "Disciplinas e Notas — Área do Professor | Huambo Calunga II" }],
  }),
  validateSearch: searchSchema,
  component: DisciplinasNotasPage,
});

const CURSOS = Array.from(new Set(turmasMock.map((t) => t.curso)));
const CLASSES = Array.from(new Set(turmasMock.map((t) => t.classe)));

function DisciplinasNotasPage() {
  const { turma: turmaInicial } = Route.useSearch();

  const [curso, setCurso] = React.useState<string>("todos");
  const [classe, setClasse] = React.useState<string>("todas");
  const [turmaId, setTurmaId] = React.useState<string>(turmaInicial ?? turmasMock[0]?.id ?? "");
  const [disciplina, setDisciplina] = React.useState<string>("todas");
  const [trimestre, setTrimestre] = React.useState<string>(TRIMESTRES[0]);
  const [detalhe, setDetalhe] = React.useState<{ nota: NotaAluno; nomeAluno: string } | null>(null);

  const turmasVisiveis = turmasMock.filter(
    (t) => (curso === "todos" || t.curso === curso) && (classe === "todas" || t.classe === classe),
  );
  const turma = turmasVisiveis.find((t) => t.id === turmaId) ?? turmasVisiveis[0] ?? turmasMock[0];

  React.useEffect(() => {
    if (turma && turma.id !== turmaId) setTurmaId(turma.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curso, classe]);

  const disciplinasDaTurma = turma?.disciplinas ?? [];
  const disciplinasParaColunas =
    disciplina === "todas"
      ? disciplinasDaTurma
      : disciplinasDaTurma.filter((d) => d === disciplina);

  const alunos = turma ? alunosPorTurma(turma.id) : [];
  const notasPorDisciplina = React.useMemo(() => {
    const mapa = new Map<string, NotaAluno[]>();
    if (turma) {
      for (const d of disciplinasParaColunas) {
        mapa.set(d, notasDaTurma(turma.id, d, trimestre));
      }
    }
    return mapa;
  }, [turma, disciplinasParaColunas, trimestre]);

  return (
    <div>
      <PageHeader
        icon={BookOpenCheck}
        title="Disciplinas e Notas"
        description="Consulta as pautas e as médias dos teus alunos."
      />

      <Card className="mb-6 border-border">
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <FiltroSelect label="Curso" value={curso} onChange={setCurso}>
            <SelectItem value="todos">Todos os cursos</SelectItem>
            {CURSOS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </FiltroSelect>

          <FiltroSelect label="Classe" value={classe} onChange={setClasse}>
            <SelectItem value="todas">Todas as classes</SelectItem>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </FiltroSelect>

          <FiltroSelect label="Turma" value={turma?.id ?? ""} onChange={setTurmaId}>
            {turmasVisiveis.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.nome}
              </SelectItem>
            ))}
          </FiltroSelect>

          <FiltroSelect label="Disciplina" value={disciplina} onChange={setDisciplina}>
            <SelectItem value="todas">Todas as disciplinas</SelectItem>
            {disciplinasDaTurma.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </FiltroSelect>

          <FiltroSelect label="Trimestre" value={trimestre} onChange={setTrimestre}>
            {TRIMESTRES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </FiltroSelect>
        </CardContent>
      </Card>

      {!turma ? (
        <EmptyState icon={Search} title="Nenhuma turma corresponde aos filtros">
          Ajusta o curso ou a classe selecionados.
        </EmptyState>
      ) : alunos.length === 0 ? (
        <EmptyState icon={Users} title="Turma sem alunos">
          A {turma.nome} ainda não tem alunos atribuídos.
        </EmptyState>
      ) : disciplinasParaColunas.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="Nenhuma disciplina atribuída">
          Não tens disciplinas atribuídas nesta turma.
        </EmptyState>
      ) : (
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 z-10 w-24 bg-card">Número</TableHead>
                    <TableHead className="sticky left-24 z-10 min-w-40 bg-card">Nome</TableHead>
                    {disciplinasParaColunas.map((d) => (
                      <TableHead key={d} className="text-center">
                        {d}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunos.map((aluno) => (
                    <TableRow key={aluno.numero}>
                      <TableCell className="sticky left-0 z-10 bg-card font-mono text-xs text-muted-foreground">
                        {aluno.numero}
                      </TableCell>
                      <TableCell className="sticky left-24 z-10 min-w-40 bg-card font-semibold text-foreground">
                        {aluno.nomeCompleto}
                      </TableCell>
                      {disciplinasParaColunas.map((d) => {
                        const nota = notasPorDisciplina
                          .get(d)
                          ?.find((n) => n.numeroAluno === aluno.numero);
                        if (!nota || nota.estado === "por-lancar") {
                          return (
                            <TableCell key={d} className="text-center">
                              <Pill tom="neutro">Por lançar</Pill>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={d} className="text-center">
                            <button
                              type="button"
                              onClick={() => setDetalhe({ nota, nomeAluno: aluno.nomeCompleto })}
                              className="rounded-md px-2.5 py-1 font-display text-sm font-extrabold text-primary underline-offset-2 hover:bg-brand-pale hover:underline"
                            >
                              {formatarMedia(nota.mediaTrimestral ?? 0)}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

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
                <LinhaDetalhe label="Média das avaliações" valor={detalhe.nota.avaliacaoContinua} />
                <LinhaDetalhe
                  label="Média da prova do professor"
                  valor={detalhe.nota.provaProfessor}
                />
                <LinhaDetalhe
                  label="Média da prova trimestral"
                  valor={detalhe.nota.provaTrimestral}
                />
                <div className="flex items-center justify-between rounded-lg bg-brand-pale px-3.5 py-3">
                  <span className="text-sm font-bold text-foreground">
                    Média trimestral (calculada)
                  </span>
                  <span className="font-display text-lg font-extrabold text-primary">
                    {formatarMedia(detalhe.nota.mediaTrimestral ?? 0)}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LinhaDetalhe({ label, valor }: { label: string; valor: number | null }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">
        {valor === null ? "—" : formatarMedia(valor)}
      </span>
    </div>
  );
}

function FiltroSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
