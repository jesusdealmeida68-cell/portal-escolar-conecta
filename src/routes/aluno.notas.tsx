import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Hourglass } from "lucide-react";

import { AcessoCondicionado } from "@/components/aluno/acesso-condicionado";
import { EmptyState } from "@/components/aluno/empty-state";
import { PageHeader } from "@/components/aluno/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarMedia } from "@/lib/aluno/format";
import { descarregarPdf, gerarBoletimPdf } from "@/lib/aluno/pdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/notas")({
  head: () => ({ meta: [{ title: "Notas e boletim — Área do Aluno" }] }),
  component: NotasPage,
});

function Nota({ valor }: { valor: number }) {
  return (
    <span className={cn("tabular-nums", valor < 10 && "font-bold text-destructive")}>
      {formatarMedia(valor)}
      {valor < 10 && <span className="sr-only"> (abaixo de 10)</span>}
    </span>
  );
}

function NotasPage() {
  const { academico, perfil } = useAluno();
  const [tab, setTab] = React.useState("1");

  const descricao = "Avaliações de 0 a 20 valores, por disciplina e trimestre.";

  // Com propinas em dívida `academico` é null: nenhuma nota chega a esta página.
  if (!academico) {
    return (
      <>
        <PageHeader icon={FileText} title="Notas e boletim" description={descricao} />
        <AcessoCondicionado title="Notas e boletim indisponíveis">
          Para consultares as notas, as médias e descarregares o boletim, regulariza primeiro as
          propinas em dívida.
        </AcessoCondicionado>
      </>
    );
  }

  return (
    <>
      <PageHeader icon={FileText} title="Notas e boletim" description={descricao} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 h-auto w-full justify-start sm:w-auto">
          {academico.boletins.map((b) => (
            <TabsTrigger key={b.trimestre} value={String(b.trimestre)} className="px-4 py-2">
              {b.trimestre}.º trimestre
            </TabsTrigger>
          ))}
        </TabsList>

        {academico.boletins.map((b) => (
          <TabsContent key={b.trimestre} value={String(b.trimestre)}>
            {!b.disponivel ? (
              <EmptyState icon={Hourglass} title="Ainda sem notas lançadas">
                As notas do {b.trimestre}.º trimestre aparecem aqui quando a escola as publicar.
              </EmptyState>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-foreground">
                      Boletim do {b.trimestre}.º trimestre
                    </h2>
                    {b.media != null && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Média geral:{" "}
                        <span className="font-bold text-foreground">{formatarMedia(b.media)}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      descarregarPdf(
                        `boletim-${b.trimestre}-trimestre-${perfil.numeroAluno}.pdf`,
                        gerarBoletimPdf(perfil, b),
                      )
                    }
                  >
                    <Download className="size-4" aria-hidden="true" /> Baixar boletim em PDF
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[34rem] text-sm">
                    <caption className="sr-only">
                      Notas do {b.trimestre}.º trimestre por disciplina
                    </caption>
                    <thead className="bg-muted/60 text-left text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          Disciplina
                        </th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">
                          Aval. contínua
                        </th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">
                          Prova do professor
                        </th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">
                          Prova trimestral
                        </th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">
                          Média
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {b.notas.map((n) => (
                        <tr key={n.disciplina}>
                          <th scope="row" className="px-5 py-3 text-left font-semibold text-foreground">
                            {n.disciplina}
                          </th>
                          <td className="px-3 py-3 text-right">
                            <Nota valor={n.avaliacaoContinua} />
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Nota valor={n.provaProfessor} />
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Nota valor={n.provaTrimestral} />
                          </td>
                          <td className="px-5 py-3 text-right font-bold">
                            <Nota valor={n.mediaTrimestral} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
