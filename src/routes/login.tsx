import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, LockKeyhole, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AuthLayout,
  AuthVisualPanel,
  PasswordInput,
  FieldError,
  FormBanner,
} from "@/components/auth/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Portal Escolar" },
      { name: "description", content: "Acede à tua área escolar no Portal Escolar." },
      { property: "og:title", content: "Entrar — Portal Escolar" },
      { property: "og:description", content: "Acede à tua área escolar no Portal Escolar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Introduz o teu número de BI ou código."),
  password: z.string().min(1, "Introduz a tua palavra-passe."),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof loginSchema>;

/**
 * ESTRUTURA APENAS — ainda sem Supabase.
 * Este handler só demonstra os estados do formulário (carregamento, erro).
 * Quando a integração for ligada, substituir por:
 *   1) resolver o identificador (BI) para o email da conta (RPC no backend);
 *   2) supabase.auth.signInWithPassword({ email, password });
 *   3) redireccionar consoante o papel (aluno/professor/encarregado/administração),
 *      obtido de forma confiável no servidor — nunca escolhido pelo formulário.
 */
async function fakeAuthenticate(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
}

function LoginPage() {
  const [banner, setBanner] = React.useState<string | null>(null);
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
    setBanner(null);
    setSubmitting(true);
    try {
      await fakeAuthenticate();
      setBanner("Estrutura pronta. A autenticação real será ligada ao Supabase na próxima etapa.");
    } finally {
      setSubmitting(false);
    }
  };

  const remember = watch("remember");

  return (
    <AuthLayout
      visual={
        <AuthVisualPanel
          eyebrow="Área reservada"
          title="A tua escola, sempre à mão."
          description="Acompanha notícias, comunicados e informações da tua comunidade escolar num só lugar."
        />
      }
    >
      <div className="rounded-lg border border-border bg-card p-7 portal-shadow sm:p-8">
        <span className="grid size-12 place-items-center rounded-lg bg-secondary text-primary">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Bem-vindo de volta!</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Acede à tua área escolar e acompanha tudo o que acontece na tua escola.
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {banner && <FormBanner tone="info">{banner}</FormBanner>}

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
  );
}
