import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, ClipboardEdit, Lock, Users } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { EmptyState } from "@/components/aluno/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { TRIMESTRES, alunosPorTurma, turmasMock } from "@/lib/professor/mock-data";

const searchSchema = z.object({ turma: z.string().optional() });

export const Route = createFileRoute("/professor/lancar-notas")({
  head: () => ({ meta: [{ title: "Lançar Notas — Área do Professor | Huambo Calunga II" }] }),
  validateSearch: searchSchema,
  component: LancarNotasPage,
});

const CURSOS = Array.from(new Set(turmasMock.map((t) => t.curso)));
const CLASSES = Array.from(new Set(turmasMock.map((t) => t.classe)));

type Campo = "ac" | "pp" | "pt";
type LinhaEdicao = Record<Campo, string>;

function valorValido(valor: string): boolean {
  if (valor.trim() === "") return true;
  const n = Number(valor.replace(",", "."));
  return !Number.isNaN(n) && n >= 0 && n <= 20;
}

function LancarNotasPage() {
  const { turma: turmaInicial } = Route.useSearch();

  const [curso, setCurso] = React.useState("todos");
  const [classe, setClasse] = React.useState("todas");
  const [turmaId, setTurmaId] = React.useState(turmaInicial ?? turmasMock[0]?.id ?? "");
  const [trimestre, setTrimestre] = React.useState<string>(TRIMESTRES[0]);

  const turmasVisiveis = turmasMock.filter(
    (t) => (curso === "todos" || t.curso === curso) && (classe === "todas" || t.classe === classe),
  );
  const turma = turmasVisiveis.find((t) => t.id === turmaId) ?? turmasVisiveis[0] ?? turmasMock[0];
  const [disciplina, setDisciplina] = React.useState(turma?.disciplinas[0] ?? "");

  React.useEffect(() => {
    if (turma && turma.id !== turmaId) setTurmaId(turma.id);
    if (turma && !turma.disciplinas.includes(disciplina)) setDisciplina(turma.disciplinas[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curso, classe]);

  const alunos = turma ? alunosPorTurma(turma.id) : [];
  const [edicao, setEdicao] = React.useState<Record<string, LinhaEdicao>>({});
  const [guardado, setGuardado] = React.useState(false);

  const atualizarCampo = (numero: string, campo: Campo, valor: string) => {
    setGuardado(false);
    setEdicao((prev) => ({
      ...prev,
      [numero]: { ac: "", pp: "", pt: "", ...prev[numero], [campo]: valor },
    }));
  };

  const cancelar = () => {
    setEdicao({});
    setGuardado(false);
  };

  const guardar = () => {
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 4000);
  };

  return (
    <div>
      <PageHeader
        icon={ClipboardEdit}
        title="Lançar Notas"
        description="Regista as médias dos alunos e consulta o resultado calculado pelo sistema."
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
            {(turma?.disciplinas ?? []).map((d) => (
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
        <EmptyState icon={Users} title="Nenhuma turma corresponde aos filtros">
          Ajusta o curso ou a classe selecionados.
        </EmptyState>
      ) : alunos.length === 0 ? (
        <EmptyState icon={Users} title="Turma sem alunos">
          A {turma.nome} ainda não tem alunos atribuídos.
        </EmptyState>
      ) : (
        <>
          {guardado && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              Notas guardadas nesta demonstração — ainda não são gravadas num sistema real.
            </div>
          )}

          <Card className="border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Número</TableHead>
                      <TableHead className="min-w-40">Nome do aluno</TableHead>
                      <TableHead className="text-center">Avaliações</TableHead>
                      <TableHead className="text-center">Prova do professor</TableHead>
                      <TableHead className="text-center">Prova trimestral</TableHead>
                      <TableHead className="text-center">Média final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunos.map((aluno) => {
                      const linha = edicao[aluno.numero] ?? { ac: "", pp: "", pt: "" };
                      return (
                        <TableRow key={aluno.numero}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {aluno.numero}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {aluno.nomeCompleto}
                          </TableCell>
                          {(["ac", "pp", "pt"] as Campo[]).map((campo) => {
                            const valor = linha[campo];
                            const invalido = !valorValido(valor);
                            return (
                              <TableCell key={campo} className="text-center">
                                <Input
                                  inputMode="decimal"
                                  value={valor}
                                  onChange={(e) =>
                                    atualizarCampo(aluno.numero, campo, e.target.value)
                                  }
                                  placeholder="0–20"
                                  aria-invalid={invalido}
                                  className={cn(
                                    "mx-auto w-20 text-center",
                                    invalido && "border-destructive focus-visible:ring-destructive",
                                  )}
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            <span
                              title="Calculado automaticamente pelo sistema quando a fórmula oficial for definida"
                              className="mx-auto flex w-24 items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-muted px-2 py-2 text-xs font-semibold text-muted-foreground"
                            >
                              <Lock className="size-3" aria-hidden="true" />
                              Automático
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={guardar} className="gap-1.5">
              <CheckCircle2 className="size-4" />
              Guardar notas
            </Button>
            <Button variant="outline" onClick={cancelar}>
              Cancelar
            </Button>
            <Button variant="ghost" asChild className="gap-1.5">
              <Link to="/professor/turmas">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>
          </div>
        </>
      )}
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
