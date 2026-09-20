import { createFileRoute } from "@tanstack/react-router";
import { CircleCheck, Clock, Download, TriangleAlert, Wallet } from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { Pill, type TomPill } from "@/components/aluno/pill";
import { Button } from "@/components/ui/button";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarData, formatarKz } from "@/lib/aluno/format";
import { descarregarPdf, gerarReciboPdf } from "@/lib/aluno/pdf";
import type { EstadoPeriodo } from "@/lib/aluno/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/propinas")({
  head: () => ({ meta: [{ title: "Propinas — Área do Aluno" }] }),
  component: PropinasPage,
});

const ESTADOS: Record<EstadoPeriodo, { tom: TomPill; rotulo: string; icone: typeof Clock }> = {
  pago: { tom: "sucesso", rotulo: "Pago", icone: CircleCheck },
  "em-divida": { tom: "perigo", rotulo: "Em dívida", icone: TriangleAlert },
  "a-vencer": { tom: "neutro", rotulo: "A vencer", icone: Clock },
};

function PropinasPage() {
  const { propinas, temDivida, perfil } = useAluno();

  return (
    <>
      <PageHeader
        icon={Wallet}
        title="Propinas"
        description="Estado das mensalidades e os pagamentos já confirmados pela escola."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-muted-foreground">Situação</p>
          <p className="mt-3">
            <Pill tom={temDivida ? "perigo" : "sucesso"} className="text-sm">
              {temDivida ? "Em dívida" : "Em dia"}
            </Pill>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-muted-foreground">Total pago</p>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {formatarKz(propinas.totalPago)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border bg-card p-5",
            temDivida ? "border-destructive/30" : "border-border",
          )}
        >
          <p className="text-sm font-semibold text-muted-foreground">Em dívida</p>
          <p
            className={cn(
              "mt-2 text-2xl font-extrabold",
              temDivida ? "text-destructive" : "text-foreground",
            )}
          >
            {formatarKz(propinas.totalEmDivida)}
          </p>
        </div>
      </div>

      {temDivida && (
        <p role="alert" className="mt-4 rounded-xl bg-destructive/5 px-4 py-3 text-sm text-foreground">
          Enquanto houver propinas em dívida, as notas, as médias, o boletim e a classificação não
          ficam disponíveis. Depois de a escola confirmar o pagamento, voltam a aparecer.
        </p>
      )}

      <section aria-labelledby="mensalidades-titulo" className="mt-8">
        <h2 id="mensalidades-titulo" className="mb-3 text-lg font-extrabold text-foreground">
          Mensalidades
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[30rem] text-sm">
            <caption className="sr-only">Mensalidades do ano letivo {perfil.anoLetivo}</caption>
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Período
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Vencimento
                </th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">
                  Valor
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {propinas.periodos.map((p) => {
                const estado = ESTADOS[p.estado];
                return (
                  <tr key={p.id}>
                    <th scope="row" className="px-5 py-3 text-left font-semibold text-foreground">
                      {p.periodo}
                    </th>
                    <td className="px-3 py-3 text-muted-foreground">{formatarData(p.vencimento)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatarKz(p.valor)}</td>
                    <td className="px-5 py-3 text-right">
                      <Pill tom={estado.tom} icone={estado.icone}>
                        {estado.rotulo}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="pagamentos-titulo" className="mt-8">
        <h2 id="pagamentos-titulo" className="text-lg font-extrabold text-foreground">
          Pagamentos confirmados
        </h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          Só aparecem aqui os pagamentos que o sistema financeiro da escola já confirmou.
        </p>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {propinas.pagamentos.map((pg) => (
            <li key={pg.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{pg.periodo}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatarKz(pg.valor)}, confirmado a {formatarData(pg.confirmadoEm)}
                </p>
              </div>
              {pg.recibo ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    descarregarPdf(
                      `recibo-${pg.recibo?.numero ?? pg.id}.pdf`,
                      gerarReciboPdf(perfil, pg),
                    )
                  }
                >
                  <Download className="size-4" aria-hidden="true" /> Recibo {pg.recibo.numero}
                </Button>
              ) : (
                <Pill tom="aviso" icone={Clock}>
                  Recibo ainda não emitido
                </Pill>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
