import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, BellOff, CheckCheck, ChevronDown } from "lucide-react";

import { EmptyState } from "@/components/aluno/empty-state";
import { PageHeader } from "@/components/aluno/page-header";
import { Button } from "@/components/ui/button";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarData } from "@/lib/aluno/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações — Área do Aluno" }] }),
  component: NotificacoesPage,
});

function NotificacoesPage() {
  const { notificacoes, naoLidas, marcarComoLida } = useAluno();
  const [aberta, setAberta] = React.useState<string | null>(null);

  const alternar = (id: string) => {
    setAberta((atual) => (atual === id ? null : id));
    marcarComoLida(id);
  };

  return (
    <>
      <PageHeader
        icon={Bell}
        title="Notificações"
        description={
          naoLidas > 0
            ? `${naoLidas} por ler. Abre uma notificação para a leres por completo.`
            : "Não tens notificações por ler."
        }
      >
        {naoLidas > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => notificacoes.filter((n) => !n.lida).forEach((n) => marcarComoLida(n.id))}
          >
            <CheckCheck className="size-4" aria-hidden="true" /> Marcar todas como lidas
          </Button>
        )}
      </PageHeader>

      {notificacoes.length === 0 ? (
        <EmptyState icon={BellOff} title="Sem notificações">
          Quando a escola te enviar um aviso, ele aparece aqui.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {notificacoes.map((n) => {
            const aberto = aberta === n.id;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  aria-expanded={aberto}
                  aria-controls={`notificacao-${n.id}`}
                  onClick={() => alternar(n.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 size-2.5 shrink-0 rounded-full",
                      n.lida ? "bg-transparent" : "bg-primary",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm text-foreground",
                        n.lida ? "font-medium" : "font-bold",
                      )}
                    >
                      {n.titulo}
                      {!n.lida && <span className="sr-only"> (por ler)</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {formatarData(n.data)}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                      aberto && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`notificacao-${n.id}`}
                  hidden={!aberto}
                  className="px-5 pr-10 pb-5 pl-11 text-sm leading-6 text-muted-foreground"
                >
                  {n.conteudo}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
