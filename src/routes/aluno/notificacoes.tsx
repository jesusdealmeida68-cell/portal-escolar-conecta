import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Bell, CircleDollarSign, GraduationCap, Megaphone } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { notificacoesMock, type NotificacaoItem } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/notificacoes")({
  head: () => ({
    meta: [{ title: "Notificações — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoNotificacoesPage,
});

const tipoConfig: Record<NotificacaoItem["tipo"], { icon: typeof Bell; className: string }> = {
  academico: { icon: GraduationCap, className: "bg-brand-pale text-primary" },
  financeiro: { icon: CircleDollarSign, className: "bg-amber-100 text-amber-700" },
  aviso: { icon: Megaphone, className: "bg-secondary text-secondary-foreground" },
};

function AlunoNotificacoesPage() {
  const [abertas, setAbertas] = React.useState<Record<string, boolean>>({});

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={Bell}
        title="Notificações"
        description="Comunicados e avisos destinados a ti."
      />

      <div className="space-y-3">
        {notificacoesMock.map((n) => {
          const { icon: Icon, className } = tipoConfig[n.tipo];
          const aberta = abertas[n.id];
          return (
            <Card
              key={n.id}
              className={cn(
                "cursor-pointer border-border transition-colors hover:border-primary/40",
                !n.lida && !aberta && "border-l-4 border-l-primary",
              )}
              onClick={() => setAbertas((prev) => ({ ...prev, [n.id]: !prev[n.id] }))}
            >
              <CardContent className="flex gap-3 p-4 sm:p-5">
                <span
                  className={cn(
                    "mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl",
                    className,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">{n.titulo}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{n.data}</span>
                  </div>
                  <p
                    className={cn("mt-1 text-sm text-muted-foreground", !aberta && "line-clamp-1")}
                  >
                    {n.conteudo}
                  </p>
                  {!n.lida && !aberta && (
                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      Não lida
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AlunoShell>
  );
}
