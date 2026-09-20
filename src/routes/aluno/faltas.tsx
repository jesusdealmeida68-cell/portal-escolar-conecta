import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { faltasMock, type FaltaRegisto } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/faltas")({
  head: () => ({
    meta: [{ title: "Mapa de faltas — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoFaltasPage,
});

const estadoConfig: Record<FaltaRegisto["justificada"], { label: string; className: string }> = {
  justificada: {
    label: "Justificada",
    className: "bg-emerald-600 text-white hover:bg-emerald-600/90",
  },
  pendente: { label: "Pendente", className: "bg-amber-500 text-white hover:bg-amber-500/90" },
  "nao-justificada": {
    label: "Não justificada",
    className: "bg-destructive text-destructive-foreground",
  },
};

function AlunoFaltasPage() {
  const totalFaltas = faltasMock.reduce((acc, f) => acc + f.quantidade, 0);

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={ClipboardList}
        title="Mapa de faltas"
        description="Registos oficiais das tuas faltas por disciplina."
      />

      <Card className="mb-6 border-border">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-pale text-primary">
            <ClipboardList className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total de faltas no trimestre
            </p>
            <p className="font-display text-2xl font-extrabold text-foreground">{totalFaltas}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">Registos de faltas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead>Justificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faltasMock.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-muted-foreground">{f.data}</TableCell>
                  <TableCell className="font-semibold text-foreground">{f.disciplina}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {f.quantidade}
                  </TableCell>
                  <TableCell>
                    <Badge className={estadoConfig[f.justificada].className}>
                      {estadoConfig[f.justificada].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AlunoShell>
  );
}
