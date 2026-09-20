import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHeader } from "@/components/aluno/page-header";
import { FieldError, FormBanner, PasswordInput } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/aluno/trocar-senha")({
  head: () => ({ meta: [{ title: "Trocar senha — Área do Aluno" }] }),
  component: TrocarSenhaPage,
});

const schema = z
  .object({
    atual: z.string().min(1, "Introduz a tua senha atual."),
    nova: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres."),
    confirmar: z.string().min(1, "Confirma a nova senha."),
  })
  .refine((v) => v.nova === v.confirmar, {
    message: "As senhas não coincidem.",
    path: ["confirmar"],
  })
  .refine((v) => v.nova !== v.atual, {
    message: "A nova senha tem de ser diferente da atual.",
    path: ["nova"],
  });
type Valores = z.infer<typeof schema>;

/**
 * ESTRUTURA APENAS, ainda sem Supabase.
 * Depois: confirmar a senha atual (supabase.auth.signInWithPassword) e só então
 * supabase.auth.updateUser({ password: nova }).
 */
async function fakeAtualizarSenha(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
}

function TrocarSenhaPage() {
  const [aEnviar, setAEnviar] = React.useState(false);
  const [sucesso, setSucesso] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Valores>({
    resolver: zodResolver(schema),
    defaultValues: { atual: "", nova: "", confirmar: "" },
  });

  const onSubmit = async (_valores: Valores) => {
    setSucesso(false);
    setAEnviar(true);
    try {
      await fakeAtualizarSenha();
      reset();
      setSucesso(true);
    } finally {
      setAEnviar(false);
    }
  };

  return (
    <>
      <PageHeader
        icon={KeyRound}
        title="Trocar senha"
        description="Escolhe uma senha nova que só tu saibas."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-7"
      >
        {sucesso && (
          <FormBanner tone="info">
            Senha atualizada (demonstração). A alteração real será ligada ao Supabase na próxima
            etapa.
          </FormBanner>
        )}

        <div>
          <Label htmlFor="atual">Senha atual</Label>
          <PasswordInput
            id="atual"
            autoComplete="current-password"
            invalid={!!errors.atual}
            className="mt-1.5"
            disabled={aEnviar}
            {...register("atual")}
          />
          <FieldError>{errors.atual?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="nova">Nova senha</Label>
          <PasswordInput
            id="nova"
            autoComplete="new-password"
            invalid={!!errors.nova}
            className="mt-1.5"
            disabled={aEnviar}
            {...register("nova")}
          />
          <FieldError>{errors.nova?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirmar">Confirmar nova senha</Label>
          <PasswordInput
            id="confirmar"
            autoComplete="new-password"
            invalid={!!errors.confirmar}
            className="mt-1.5"
            disabled={aEnviar}
            {...register("confirmar")}
          />
          <FieldError>{errors.confirmar?.message}</FieldError>
        </div>

        <Button type="submit" className="w-full" disabled={aEnviar}>
          {aEnviar ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> A guardar...
            </>
          ) : (
            "Guardar nova senha"
          )}
        </Button>
      </form>
    </>
  );
}
