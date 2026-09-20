import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock3, Download, Wallet } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { propinasMock, resumoFinanceiroMock, type PropinaPeriodo } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/propinas")({
  head: () => ({
    meta: [{ title: "Propinas — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoPropinasPage,
});

function formatKz(valor: number) {
  return `${valor.toLocaleString("pt-PT")} ${resumoFinanceiroMock.moeda}`;
}

const estadoBadge: Record<PropinaPeriodo["estado"], { label: string; className: string }> = {
  pago: { label: "Pago", className: "bg-emerald-600 text-white hover:bg-emerald-600/90" },
  pendente: { label: "Pendente", className: "bg-amber-500 text-white hover:bg-amber-500/90" },
  atrasado: { label: "Atrasado", className: "bg-destructive text-destructive-foreground" },
};

function AlunoPropinasPage() {
  const pagas = propinasMock.filter((p) => p.estado === "pago");
  const pendentes = propinasMock.filter((p) => p.estado !== "pago");

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={Wallet}
        title="Propinas"
        description="Consulta o estado da tua conta, pagamentos confirmados e recibos disponíveis."
      />

      {/* Resumo */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total pago
              </p>
              <p className="font-display text-2xl font-extrabold text-foreground">
                {formatKz(resumoFinanceiroMock.totalPago)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Clock3 className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total em dívida
              </p>
              <p className="font-display text-2xl font-extrabold text-foreground">
                {formatKz(resumoFinanceiroMock.totalDivida)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Períodos e vencimentos */}
      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <CalendarDays className="size-4 text-primary" />
            Períodos e vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propinasMock.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold text-foreground">{p.periodo}</TableCell>
                  <TableCell className="text-muted-foreground">{formatKz(p.valor)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.vencimento}</TableCell>
                  <TableCell>
                    <Badge className={estadoBadge[p.estado].className}>
                      {estadoBadge[p.estado].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico de pagamentos confirmados */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            Histórico de pagamentos confirmados
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {pagas.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-foreground">{p.periodo}</p>
                <p className="text-xs text-muted-foreground">
                  Pago em {p.dataPagamento} · {formatKz(p.valor)}
                </p>
              </div>
              {p.recibo && (
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="size-3.5" />
                  Recibo {p.recibo}
                </Button>
              )}
            </div>
          ))}
          {pendentes.length > 0 && (
            <div className="bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
              Os períodos pendentes não têm recibo até confirmação do pagamento pelo sistema
              financeiro.
            </div>
          )}
        </CardContent>
      </Card>
    </AlunoShell>
  );
}
