import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Settings,
  Shield,
} from "lucide-react";

import { PageHeader } from "@/components/aluno/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { iniciais } from "@/lib/aluno/format";
import { perfilProfessorMock } from "@/lib/professor/mock-data";

export const Route = createFileRoute("/professor/perfil")({
  head: () => ({ meta: [{ title: "Meu Perfil — Área do Professor | Huambo Calunga II" }] }),
  component: MeuPerfilPage,
});

function LinhaDado({
  icon: Icon,
  label,
  valor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  valor: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-brand-pale text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-foreground">{valor}</p>
      </div>
    </div>
  );
}

function CampoSenha({
  id,
  label,
  value,
  onChange,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [visivel, setVisivel] = React.useState(false);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Input
          id={id}
          type={visivel ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          className={cn("pr-10", invalid && "border-destructive focus-visible:ring-destructive")}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visivel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function MeuPerfilPage() {
  const navigate = useNavigate();

  const [editarAberto, setEditarAberto] = React.useState(false);
  const [senhaAberta, setSenhaAberta] = React.useState(false);
  const [senhaGuardada, setSenhaGuardada] = React.useState(false);
  const [perfilGuardado, setPerfilGuardado] = React.useState(false);

  const [senhaAtual, setSenhaAtual] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const senhasDiferentes = confirmarSenha.length > 0 && novaSenha !== confirmarSenha;
  const podeGuardarSenha =
    senhaAtual.length > 0 && novaSenha.length >= 6 && novaSenha === confirmarSenha;

  const fecharModalSenha = () => {
    setSenhaAberta(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const [notificacoesEmail, setNotificacoesEmail] = React.useState(true);
  const [temaEscuro, setTemaEscuro] = React.useState(false);

  return (
    <div>
      <PageHeader icon={GraduationCap} title="Meu Perfil" />

      <Card className="mb-6 overflow-hidden border-border">
        <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-primary to-brand-soft px-5 py-7 text-center text-primary-foreground sm:flex-row sm:text-left">
          <Avatar className="size-20 shrink-0 ring-4 ring-primary-foreground/25">
            <AvatarFallback className="bg-primary-foreground/15 text-2xl font-bold text-primary-foreground">
              {iniciais(perfilProfessorMock.nomeCompleto)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold sm:text-2xl">
              {perfilProfessorMock.nomeCompleto}
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/85">
              {perfilProfessorMock.numeroProfessor} · {perfilProfessorMock.cargo}
            </p>
            <p className="text-sm text-primary-foreground/85">{perfilProfessorMock.escola}</p>
          </div>
        </div>
      </Card>

      {perfilGuardado && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0" />
          Alterações guardadas apenas nesta demonstração.
        </div>
      )}

      <Card className="mb-6 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">Dados pessoais</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setEditarAberto(true)}
          >
            <Pencil className="size-3.5" />
            Editar perfil
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LinhaDado icon={IdCard} label="Nome completo" valor={perfilProfessorMock.nomeCompleto} />
          <LinhaDado
            icon={IdCard}
            label="Identificador"
            valor={perfilProfessorMock.numeroProfessor}
          />
          <LinhaDado icon={Mail} label="E-mail" valor={perfilProfessorMock.email} />
          <LinhaDado icon={Phone} label="Telefone" valor={perfilProfessorMock.telefone} />
        </CardContent>
      </Card>

      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Shield className="size-4 text-primary" />
            Segurança da conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Palavra-passe</p>
              <p className="text-xs text-muted-foreground">
                Recomendamos alterar periodicamente a tua palavra-passe.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSenhaAberta(true)}>
              Alterar palavra-passe
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Settings className="size-4 text-primary" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Notificações por e-mail</p>
              <p className="text-xs text-muted-foreground">Avisos sobre a tua atividade escolar.</p>
            </div>
            <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Tema escuro</p>
              <p className="text-xs text-muted-foreground">
                Preferência visual apenas nesta demonstração.
              </p>
            </div>
            <Switch checked={temaEscuro} onCheckedChange={setTemaEscuro} />
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="gap-1.5 text-destructive hover:text-destructive"
        onClick={() => navigate({ to: "/login" })}
      >
        <LogOut className="size-4" />
        Terminar sessão
      </Button>

      {/* Editar perfil — apenas visual, não altera dados reais */}
      <Dialog open={editarAberto} onOpenChange={setEditarAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Protótipo visual — estas alterações não são guardadas num sistema real.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setEditarAberto(false);
              setPerfilGuardado(true);
              window.setTimeout(() => setPerfilGuardado(false), 4000);
            }}
          >
            <div>
              <Label htmlFor="nome-professor">Nome completo</Label>
              <Input
                id="nome-professor"
                defaultValue={perfilProfessorMock.nomeCompleto}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email-professor">E-mail</Label>
              <Input
                id="email-professor"
                defaultValue={perfilProfessorMock.email}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="telefone-professor">Telefone</Label>
              <Input
                id="telefone-professor"
                defaultValue={perfilProfessorMock.telefone}
                className="mt-1.5"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditarAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alterar palavra-passe — apenas visual, sem autenticação real */}
      <Dialog
        open={senhaAberta}
        onOpenChange={(open) => (open ? setSenhaAberta(true) : fecharModalSenha())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar palavra-passe</DialogTitle>
            <DialogDescription>
              Protótipo visual — esta ação não altera nenhuma credencial real.
            </DialogDescription>
          </DialogHeader>

          {senhaGuardada ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" />
              Palavra-passe alterada nesta demonstração.
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!podeGuardarSenha) return;
                setSenhaGuardada(true);
                window.setTimeout(() => {
                  setSenhaGuardada(false);
                  fecharModalSenha();
                }, 1800);
              }}
            >
              <CampoSenha
                id="senha-atual"
                label="Palavra-passe atual"
                value={senhaAtual}
                onChange={setSenhaAtual}
              />
              <CampoSenha
                id="nova-senha"
                label="Nova palavra-passe"
                value={novaSenha}
                onChange={setNovaSenha}
              />
              <CampoSenha
                id="confirmar-senha"
                label="Confirmar nova palavra-passe"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
                invalid={senhasDiferentes}
              />
              {senhasDiferentes && (
                <p className="text-xs font-semibold text-destructive">
                  As palavras-passe não coincidem.
                </p>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={fecharModalSenha}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!podeGuardarSenha}>
                  Guardar nova palavra-passe
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
