import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput, FieldError } from "@/components/auth/auth-shell";

export const Route = createFileRoute("/aluno/senha")({
  head: () => ({
    meta: [{ title: "Trocar senha — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoTrocarSenhaPage,
});

const schema = z
  .object({
    senhaAtual: z.string().min(1, "Introduz a tua palavra-passe atual."),
    novaSenha: z.string().min(8, "A nova palavra-passe deve ter pelo menos 8 caracteres."),
    confirmarSenha: z.string().min(1, "Confirma a nova palavra-passe."),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As palavras-passe não coincidem.",
    path: ["confirmarSenha"],
  });
type FormValues = z.infer<typeof schema>;

/**
 * ESTRUTURA VISUAL APENAS — sem integração com o backend.
 * Quando ligado, este formulário deve chamar o sistema de autenticação existente
 * (ex.: supabase.auth.updateUser) e nunca guardar ou transmitir a palavra-passe
 * em texto simples fora desse fluxo.
 */
function AlunoTrocarSenhaPage() {
  const [enviado, setEnviado] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    setEnviado(true);
    reset();
  };

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={KeyRound}
        title="Trocar senha"
        description="Atualiza a palavra-passe de acesso à tua conta."
      />

      <Card className="max-w-lg border-border">
        <CardContent className="p-5 sm:p-7">
          {enviado && (
            <div className="mb-5 flex items-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              Palavra-passe alterada com sucesso.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="senhaAtual">Palavra-passe atual</Label>
              <PasswordInput
                id="senhaAtual"
                autoComplete="current-password"
                invalid={!!errors.senhaAtual}
                className="mt-1.5"
                {...register("senhaAtual")}
              />
              <FieldError>{errors.senhaAtual?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="novaSenha">Nova palavra-passe</Label>
              <PasswordInput
                id="novaSenha"
                autoComplete="new-password"
                invalid={!!errors.novaSenha}
                className="mt-1.5"
                {...register("novaSenha")}
              />
              <FieldError>{errors.novaSenha?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="confirmarSenha">Confirmar nova palavra-passe</Label>
              <PasswordInput
                id="confirmarSenha"
                autoComplete="new-password"
                invalid={!!errors.confirmarSenha}
                className="mt-1.5"
                {...register("confirmarSenha")}
              />
              <FieldError>{errors.confirmarSenha?.message}</FieldError>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              Alterar senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </AlunoShell>
  );
}
