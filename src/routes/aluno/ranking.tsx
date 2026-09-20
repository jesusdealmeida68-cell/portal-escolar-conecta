import { createFileRoute } from "@tanstack/react-router";
import { Award, Medal } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { rankingMock } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/ranking")({
  head: () => ({
    meta: [{ title: "Ranking — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoRankingPage,
});

const medalColors: Record<number, string> = {
  1: "text-amber-500",
  2: "text-slate-400",
  3: "text-amber-700",
};

function AlunoRankingPage() {
  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={Award}
        title="Ranking"
        description="Classificação da tua turma com base nas médias oficiais do 1.º trimestre."
      />

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            Turma B · 1.º Trimestre
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {rankingMock.map((r) => (
            <div
              key={r.posicao}
              className={cn("flex items-center gap-4 px-5 py-3.5", r.souEu && "bg-brand-pale/60")}
            >
              <div className="grid size-9 shrink-0 place-items-center">
                {r.posicao <= 3 ? (
                  <Medal className={cn("size-6", medalColors[r.posicao])} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">{r.posicao}.º</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {r.nome}
                  {r.souEu && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                      Tu
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{r.turma}</p>
              </div>
              <p className="shrink-0 font-display text-lg font-extrabold text-primary">
                {r.media.toFixed(1)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AlunoShell>
  );
}
