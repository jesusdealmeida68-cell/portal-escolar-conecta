import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

import { AcessoCondicionado } from "@/components/aluno/acesso-condicionado";
import { PageHeader } from "@/components/aluno/page-header";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarMedia } from "@/lib/aluno/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/ranking")({
  head: () => ({ meta: [{ title: "Ranking — Área do Aluno" }] }),
  component: RankingPage,
});

function RankingPage() {
  const { ranking } = useAluno();

  // Com propinas em dívida `ranking` é null: nem a classificação nem as médias chegam aqui.
  if (!ranking) {
    return (
      <>
        <PageHeader
          icon={Trophy}
          title="Ranking"
          description="Classificação da turma por média trimestral."
        />
        <AcessoCondicionado title="Ranking indisponível">
          A classificação da turma só fica visível com as propinas regularizadas.
        </AcessoCondicionado>
      </>
    );
  }

  const minha = ranking.linhas.find((l) => l.eu);

  return (
    <>
      <PageHeader
        icon={Trophy}
        title="Ranking"
        description={`Turma ${ranking.turma}, média do ${ranking.trimestre}.º trimestre.`}
      />

      {minha && (
        <div className="mb-6 rounded-2xl border border-primary/25 bg-brand-pale p-5">
          <p className="text-sm font-semibold text-primary">A tua posição</p>
          <p className="mt-1 text-3xl font-extrabold text-foreground">
            {minha.posicao}.º
            <span className="ml-2 text-base font-semibold text-muted-foreground">
              de {ranking.linhas.length} alunos, com média {formatarMedia(minha.media)}
            </span>
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Classificação da turma {ranking.turma} no {ranking.trimestre}.º trimestre
          </caption>
          <thead className="bg-muted/60 text-left text-muted-foreground">
            <tr>
              <th scope="col" className="w-16 px-5 py-3 font-semibold">
                Pos.
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Aluno
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                Média
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ranking.linhas.map((l) => (
              <tr key={l.posicao} className={cn(l.eu && "bg-brand-pale")}>
                <td className="px-5 py-3 font-extrabold tabular-nums text-foreground">
                  {l.posicao}.º
                </td>
                <th scope="row" className="px-3 py-3 text-left font-semibold text-foreground">
                  {l.nome}
                  {l.eu && <span className="ml-2 text-xs font-bold text-primary">(tu)</span>}
                </th>
                <td className="px-5 py-3 text-right font-bold tabular-nums">
                  {formatarMedia(l.media)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
