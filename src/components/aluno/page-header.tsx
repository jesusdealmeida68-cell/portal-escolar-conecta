import * as React from "react";
import type { LucideIcon } from "lucide-react";

/** Título de cada página da Área do Aluno: ícone, nome da página e uma linha de contexto. */
export function PageHeader({
  icon: Icone,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string | undefined;
  /** Ações à direita (ex.: botão de descarregar). */
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icone className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl leading-tight font-extrabold text-foreground sm:text-[1.7rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
