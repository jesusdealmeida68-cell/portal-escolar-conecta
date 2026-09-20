import * as React from "react";
import type { LucideIcon } from "lucide-react";

/** Estado vazio: diz o que falta e, quando faz sentido, o que fazer a seguir. */
export function EmptyState({
  icon: Icone,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icone className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold text-foreground">{title}</h2>
      {children && (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{children}</p>
      )}
    </div>
  );
}
