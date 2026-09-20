import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, LockKeyhole, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logoHuambo from "@/assets/logo-huambo-calunga.jpg";
import {
  AuthLayout,
  AuthVisualPanel,
  AuthMobileBanner,
  PasswordInput,
  FieldError,
} from "@/components/auth/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Huambo Calunga II" },
      { name: "description", content: "Acede à tua área escolar no Huambo Calunga II." },
      { property: "og:title", content: "Entrar — Huambo Calunga II" },
      { property: "og:description", content: "Acede à tua área escolar no Huambo Calunga II." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof loginSchema>;

/**
 * ESTRUTURA APENAS — ainda sem Supabase.
 * PROTÓTIPO: qualquer combinação de identificador/palavra-passe preenchida entra
 * na Área do Aluno, com um ecrã de acesso a simular a busca de informações.
 * Quando a integração for ligada, substituir por:
 *   1) resolver o identificador (BI) para o email da conta (RPC no backend);
 *   2) supabase.auth.signInWithPassword({ email, password });
 *   3) redireccionar consoante o papel (aluno/professor/encarregado/administração),
 *      obtido de forma confiável no servidor — nunca escolhido pelo formulário.
 */
async function fakeAuthenticate(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 1400));
}

/** Ecrã de transição a cobrir o ecrã inteiro enquanto o "login" fictício decorre. */
function AccessingOverlay() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-deep/95 px-6 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center overflow-hidden rounded-full bg-hero-foreground/10">
          <img
            src={logoHuambo}
            alt=""
            className="size-14 rounded-full object-cover"
            aria-hidden="true"
          />
        </span>
        <LoaderCircle
          className="mt-6 size-8 animate-spin text-hero-foreground"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-lg font-extrabold text-hero-foreground">
          A aceder à tua conta...
        </h2>
        <p className="mt-1.5 max-w-xs text-sm text-hero-foreground/75">
          A carregar as tuas informações escolares. Aguarda um momento.
        </p>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: true },
  });

  const onSubmit = async (_values: LoginValues) => {
    setSubmitting(true);
    await fakeAuthenticate();
    navigate({ to: "/aluno" });
  };

  const remember = watch("remember");

  return (
    <>
      {submitting && <AccessingOverlay />}
      <AuthLayout
        visual={
          <AuthVisualPanel
            eyebrow="Área reservada"
            title="A tua escola, sempre à mão."
            description="Acompanha notícias, comunicados e informações da tua comunidade escolar num só lugar."
          />
        }
      >
        <AuthMobileBanner eyebrow="Área reservada" title="A tua escola, sempre à mão." />
        <div className="rounded-2xl border border-border bg-card p-7 portal-shadow sm:p-8">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-soft text-primary-foreground shadow-lg shadow-primary/25">
            <LockKeyhole className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-foreground">Bem-vindo de volta!</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Acede à tua área escolar e acompanha tudo o que acontece na tua escola.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="identifier">Bilhete de Identidade ou identificador</Label>
              <Input
                id="identifier"
                autoComplete="username"
                placeholder="Introduz o teu número de BI ou código"
                aria-invalid={!!errors.identifier || undefined}
                className="mt-1.5"
                disabled={submitting}
                {...register("identifier")}
              />
              <FieldError>{errors.identifier?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="password">Palavra-passe</Label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Introduz a tua palavra-passe"
                invalid={!!errors.password}
                className="mt-1.5"
                disabled={submitting}
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setValue("remember", checked === true)}
                  disabled={submitting}
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer font-normal text-muted-foreground"
                >
                  Manter sessão iniciada
                </Label>
              </div>
              <Link
                to="/recuperar-senha"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Esqueci-me da senha
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> A entrar...
                </>
              ) : (
                <>
                  <LogIn className="size-4" /> Entrar
                </>
              )}
            </Button>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}
