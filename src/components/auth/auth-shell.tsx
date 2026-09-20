import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, GraduationCap } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/portal-escolar-hero.jpg";

/**
 * Small brand mark shared with the public homepage header/footer.
 * Kept local to the auth pages so the homepage (src/routes/index.tsx)
 * never needs to be touched for this work.
 */
export function AuthLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-md",
          inverse ? "bg-hero-foreground/12" : "bg-primary",
        )}
      >
        <GraduationCap
          className={inverse ? "text-hero-foreground" : "text-primary-foreground"}
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          "truncate font-display text-lg font-extrabold",
          inverse ? "text-hero-foreground" : "text-foreground",
        )}
      >
        Portal Escolar
      </span>
    </div>
  );
}

/** Slim top bar used by every auth screen: logo + link back to the public site. */
export function AuthTopBar({
  backTo = "/",
  backLabel = "Voltar à página inicial",
}: {
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <header className="border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={backTo} aria-label="Portal Escolar, início">
          <AuthLogo />
        </Link>
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    </header>
  );
}

/** Left-hand editorial panel shown alongside the form on wide screens. */
export function AuthVisualPanel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative isolate hidden overflow-hidden lg:block">
      <img
        src={heroImage}
        alt="Estudantes num pátio escolar"
        width={1200}
        height={1400}
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
        fetchPriority="high"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative flex h-full min-h-[560px] flex-col justify-end p-10 text-hero-foreground xl:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-soft">{eyebrow}</p>
        <h2 className="mt-4 max-w-sm text-3xl font-extrabold leading-tight xl:text-4xl">{title}</h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-hero-foreground/75">{description}</p>
      </div>
    </div>
  );
}

/** Generic full-height two-column layout: visual panel + centered form column. */
export function AuthLayout({
  visual,
  children,
  backTo = "/",
  backLabel = "Voltar à página inicial",
}: {
  visual: React.ReactNode;
  children: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-brand-pale">
      <AuthTopBar backTo={backTo} backLabel={backLabel} />
      <div className="grid lg:grid-cols-2">
        {visual}
        <main className="grid place-items-center px-4 py-12 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** Password field with a show/hide toggle, wired for react-hook-form via forwardRef. */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(
          "pr-10",
          invalid && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-9 cursor-pointer place-items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

/** Inline field-level error text. */
export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{children}</p>;
}

/** Banner-style form error, used for auth/server-level failures (not single-field issues). */
export function FormBanner({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm leading-5",
        tone === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {children}
    </div>
  );
}

/** Whether a thrown error looks like a network/connectivity failure rather than an API response. */
export function isNetworkError(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  if (error instanceof TypeError) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return message.includes("failed to fetch") || message.includes("network");
}
