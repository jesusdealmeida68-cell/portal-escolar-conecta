import * as React from "react";
import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarKz } from "@/lib/aluno/format";

/**
 * Mensagem mostrada no lugar das notas, médias, boletim e classificação quando há propinas em dívida.
 * Não recebe nem mostra nenhum dado académico: só existe porque o contexto entregou `academico = null`.
 */
export function AcessoCondicionado({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { propinas } = useAluno();

  return (
    <section
      aria-labelledby="acesso-condicionado-titulo"
      className="rounded-2xl border border-destructive/25 bg-card px-6 py-12 text-center sm:px-10"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <LockKeyhole className="size-6" aria-hidden="true" />
      </span>
      <h2 id="acesso-condicionado-titulo" className="mt-5 text-xl font-extrabold text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{children}</p>
      <p className="mt-4 text-sm font-semibold text-foreground">
        Valor em dívida: <span className="text-destructive">{formatarKz(propinas.totalEmDivida)}</span>
      </p>
      <Button asChild className="mt-6">
        <Link to="/aluno/propinas">Ver propinas</Link>
      </Button>
    </section>
  );
}
