import * as React from "react";

import { cn } from "@/lib/utils";

export type TomPill = "sucesso" | "perigo" | "aviso" | "neutro" | "info";

const TONS: Record<TomPill, string> = {
  sucesso: "bg-success-soft text-success-foreground",
  perigo: "bg-destructive/10 text-destructive",
  aviso: "bg-notice text-notice-foreground",
  neutro: "bg-muted text-muted-foreground",
  info: "bg-brand-pale text-primary",
};

/** Etiqueta de estado (pago, em dívida, justificada…). A cor nunca é o único sinal: leva sempre texto. */
export function Pill({
  tom,
  icone: Icone,
  className,
  children,
}: {
  tom: TomPill;
  icone?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONS[tom],
        className,
      )}
    >
      {Icone && <Icone className="size-3.5" aria-hidden={true} />}
      {children}
    </span>
  );
}
