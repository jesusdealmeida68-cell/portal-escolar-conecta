import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, KeyRound, LoaderCircle, ShieldCheck, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  AuthLayout,
  AuthVisualPanel,
  AuthMobileBanner,
  PasswordInput,
  FieldError,
  FormBanner,
} from "@/components/auth/auth-shell";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar palavra-passe — Portal Escolar" },
      { name: "description", content: "Recupera o acesso à tua conta do Portal Escolar." },
      { property: "og:title", content: "Recuperar palavra-passe — Portal Escolar" },
      { property: "og:description", content: "Recupera o acesso à tua conta do Portal Escolar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecoverPage,
});

const GENERIC_SENT_MESSAGE =
  "Se os dados corresponderem a uma conta registada, enviámos um código de verificação para o contacto associado.";
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

type Step = "identify" | "otp" | "reset" | "success";

const identifySchema = z.object({
  identifier: z.string().trim().min(1, "Introduz o teu número de BI ou identificador."),
  contact: z.string().trim().min(1, "Introduz o teu email ou telefone registado."),
});
type IdentifyValues = z.infer<typeof identifySchema>;

const resetSchema = z
  .object({
    password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirma a nova palavra-passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As palavras-passe não coincidem.",
    path: ["confirmPassword"],
  });
type ResetValues = z.infer<typeof resetSchema>;

/**
 * ESTRUTURA APENAS — ainda sem Supabase.
 * Substituir pelos passos reais quando a integração for ligada:
 *   1) Edge Function `request-password-recovery` (identifier + contact) que
 *      confirma a correspondência no servidor e despoleta o envio do código
 *      (supabase.auth.resetPasswordForEmail / signInWithOtp), sempre
 *      respondendo de forma genérica, sem revelar se a conta existe.
 *   2) supabase.auth.verifyOtp({ email|phone, token, type: "recovery"|"sms" })
 *      para validar o código e estabelecer sessão.
 *   3) supabase.auth.updateUser({ password }) para definir a nova senha,
 *      seguido de supabase.auth.signOut().
 */
async function fakeRequestRecovery(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
}
async function fakeVerifyOtp(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
}
async function fakeUpdatePassword(): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
}

function StepHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
}) {
  return (
    <>
      <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-soft text-primary-foreground shadow-lg shadow-primary/25">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </>
  );
}

function RecoverPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>("identify");
  const [submitting, setSubmitting] = React.useState(false);
  const [banner, setBanner] = React.useState<string | null>(null);
  const [showNoContactHelp, setShowNoContactHelp] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);

  const identifyForm = useForm<IdentifyValues>({
    resolver: zodResolver(identifySchema),
    defaultValues: { identifier: "", contact: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const submitIdentify = async (_values: IdentifyValues) => {
    setBanner(null);
    setSubmitting(true);
    try {
      await fakeRequestRecovery();
      setStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (cooldown > 0 || submitting) return;
    setSubmitting(true);
    try {
      await fakeRequestRecovery();
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setSubmitting(false);
    }
  };

  const submitOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setOtpError(null);
    if (otp.length !== OTP_LENGTH) {
      setOtpError(`Introduz o código de ${OTP_LENGTH} dígitos.`);
      return;
    }
    setSubmitting(true);
    try {
      await fakeVerifyOtp();
      setStep("reset");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReset = async (_values: ResetValues) => {
    setBanner(null);
    setSubmitting(true);
    try {
      await fakeUpdatePassword();
      setStep("success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      backTo="/login"
      backLabel="Voltar ao login"
      visual={
        <AuthVisualPanel
          eyebrow="Recuperação de acesso"
          title="Vamos ajudar-te a voltar a entrar."
          description="Em poucos passos, verificamos a tua identidade e ajudamos-te a criar uma nova palavra-passe."
        />
      }
    >
      <AuthMobileBanner
        eyebrow="Recuperação de acesso"
        title="Vamos ajudar-te a voltar a entrar."
      />
      <div className="rounded-2xl border border-border bg-card p-7 portal-shadow sm:p-8">
        {step === "identify" && (
          <>
            <StepHeader
              icon={KeyRound}
              title="Recupera o teu acesso."
              description="Esqueceste a tua palavra-passe? Vamos ajudar-te a recuperar a tua conta."
            />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Introduz os dados associados à tua conta para iniciar a recuperação.
            </p>

            <form
              className="mt-6 space-y-5"
              onSubmit={identifyForm.handleSubmit(submitIdentify)}
              noValidate
            >
              {banner && <FormBanner>{banner}</FormBanner>}

              <div>
                <Label htmlFor="identifier">Número de BI ou identificador</Label>
                <Input
                  id="identifier"
                  placeholder="Introduz o teu identificador"
                  className="mt-1.5"
                  disabled={submitting}
                  aria-invalid={!!identifyForm.formState.errors.identifier || undefined}
                  {...identifyForm.register("identifier")}
                />
                <FieldError>{identifyForm.formState.errors.identifier?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="contact">Email ou número de telefone registado</Label>
                <Input
                  id="contact"
                  placeholder="Introduz o teu email ou telefone"
                  className="mt-1.5"
                  disabled={submitting}
                  aria-invalid={!!identifyForm.formState.errors.contact || undefined}
                  {...identifyForm.register("contact")}
                />
                <FieldError>{identifyForm.formState.errors.contact?.message}</FieldError>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Continuar
              </Button>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                Os teus dados são usados apenas para verificar a tua identidade e nunca são
                partilhados com terceiros.
              </p>

              <div className="border-t border-border pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowNoContactHelp((v) => !v)}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Não tens acesso ao teu contacto de recuperação?
                </button>
                {showNoContactHelp && (
                  <p className="mt-3 rounded-md bg-muted p-3 text-left text-sm leading-6 text-muted-foreground">
                    Contacta a administração da tua escola para confirmar a tua identidade e
                    recuperar o acesso à tua conta.
                  </p>
                )}
              </div>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <StepHeader
              icon={ShieldCheck}
              title="Verifica o teu código"
              description={GENERIC_SENT_MESSAGE}
            />
            <form className="mt-6 space-y-5" onSubmit={submitOtp} noValidate>
              {otpError && <FormBanner>{otpError}</FormBanner>}

              <div>
                <Label htmlFor="otp">Código de verificação</Label>
                <div className="mt-2">
                  <InputOTP
                    id="otp"
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                    disabled={submitting}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  O código é válido por tempo limitado.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Verificar código
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={cooldown > 0 || submitting}
                  className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                >
                  {cooldown > 0 ? `Reenviar código (${cooldown}s)` : "Reenviar código"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("identify");
                  setOtp("");
                  setOtpError(null);
                }}
                className="block w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Voltar ao login
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <StepHeader
              icon={KeyRound}
              title="Cria uma nova palavra-passe"
              description="Escolhe uma palavra-passe forte para a tua conta."
            />
            <form
              className="mt-6 space-y-5"
              onSubmit={resetForm.handleSubmit(submitReset)}
              noValidate
            >
              {banner && <FormBanner>{banner}</FormBanner>}

              <div>
                <Label htmlFor="password">Nova palavra-passe</Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  placeholder="Introduz a nova palavra-passe"
                  className="mt-1.5"
                  disabled={submitting}
                  invalid={!!resetForm.formState.errors.password}
                  {...resetForm.register("password")}
                />
                <FieldError>{resetForm.formState.errors.password?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar nova palavra-passe</Label>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Repete a nova palavra-passe"
                  className="mt-1.5"
                  disabled={submitting}
                  invalid={!!resetForm.formState.errors.confirmPassword}
                  {...resetForm.register("confirmPassword")}
                />
                <FieldError>{resetForm.formState.errors.confirmPassword?.message}</FieldError>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Guardar nova palavra-passe
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-soft text-primary-foreground shadow-lg shadow-primary/25">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-foreground">
              Palavra-passe alterada com sucesso!
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Já podes entrar na tua área escolar com a nova palavra-passe.
            </p>
            <Button className="mt-7 w-full" onClick={() => navigate({ to: "/login" })}>
              Voltar ao login
            </Button>
          </div>
        )}
      </div>

      {step === "identify" && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <UserCog className="size-3.5" aria-hidden="true" />
          Precisas de outro tipo de ajuda? Contacta a administração da tua escola.
        </p>
      )}
    </AuthLayout>
  );
}
