import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Download, Lock, ShieldAlert } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alunoMock, boletinsMock, notasMock } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/notas")({
  head: () => ({
    meta: [{ title: "Notas e boletim — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoNotasPage,
});

/**
 * Regra de acesso: se o aluno tiver propinas em dívida, notas, médias e boletins
 * ficam ocultos. Esta verificação visual deve ser espelhada no backend (ex.: RLS
 * do Supabase / política de API), nunca confiar apenas nesta condição do cliente.
 */
function AcessoCondicionado() {
  return (
    <Card className="border-dashed border-destructive/40 bg-destructive/5">
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <Lock className="size-6" />
        </span>
        <h2 className="font-display text-lg font-extrabold text-foreground">
          Acesso condicionado à regularização das propinas
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          As tuas notas, médias e boletins ficam disponíveis assim que a situação financeira for
          regularizada. Consulta os valores em dívida na página de Propinas.
        </p>
        <Button asChild className="mt-2">
          <a href="/aluno/propinas" className="flex items-center gap-2">
            <ShieldAlert className="size-4" />
            Ver propinas em dívida
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function AlunoNotasPage() {
  const bloqueado = alunoMock.temDivida;

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={ClipboardList}
        title="Notas e boletim"
        description="Consulta as tuas avaliações por disciplina e os boletins trimestrais."
      />

      {bloqueado ? (
        <AcessoCondicionado />
      ) : (
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Avaliações por disciplina — 1.º Trimestre
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0 sm:p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">MAC</TableHead>
                    <TableHead className="text-center">NPP</TableHead>
                    <TableHead className="text-center">NPT</TableHead>
                    <TableHead className="text-right">Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notasMock.map((n) => (
                    <TableRow key={n.disciplina}>
                      <TableCell className="font-semibold text-foreground">
                        {n.disciplina}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">{n.mac}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{n.npp}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{n.npt}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {n.media.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Boletins trimestrais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {boletinsMock.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{b.trimestre}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {b.disponivel
                        ? `Média geral: ${b.mediaGeral.toFixed(1)}`
                        : "Ainda não disponível"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={b.disponivel ? "default" : "outline"}
                    disabled={!b.disponivel}
                    className="w-full gap-1.5"
                  >
                    <Download className="size-3.5" />
                    Baixar PDF
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </AlunoShell>
  );
}
