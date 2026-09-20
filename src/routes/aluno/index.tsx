import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  BookOpenCheck,
  Clock3,
  GraduationCap,
  Hash,
  Home,
  IdCard,
  Layers,
  Wallet,
} from "lucide-react";

import { AlunoShell, AlunoPageHeader } from "@/components/aluno/aluno-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alunoMock } from "@/lib/mock-aluno";

export const Route = createFileRoute("/aluno/")({
  head: () => ({
    meta: [{ title: "Início — Área do Aluno | Portal Escolar" }],
  }),
  component: AlunoInicioPage,
});

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-brand-pale text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function AlunoInicioPage() {
  const aluno = alunoMock;

  return (
    <AlunoShell>
      <AlunoPageHeader
        icon={Home}
        title={`Olá, ${aluno.nomeCompleto.split(" ")[0]}!`}
        description="Aqui tens um resumo geral da tua situação escolar."
      />

      {/* Identificação do aluno */}
      <Card className="mb-6 overflow-hidden border-border portal-shadow">
        <div className="bg-gradient-to-r from-primary to-brand-soft px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/75">
            Identificação do aluno
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold text-primary-foreground sm:text-2xl">
            {aluno.nomeCompleto}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            N.º de aluno {aluno.numeroAluno} · Ano letivo {aluno.anoLetivo}
          </p>
        </div>
        <CardContent className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          <InfoItem icon={IdCard} label="Número de aluno" value={aluno.numeroAluno} />
          <InfoItem icon={GraduationCap} label="Classe" value={aluno.classe} />
          <InfoItem icon={BookOpenCheck} label="Curso" value={aluno.curso} />
          <InfoItem icon={Layers} label="Turma" value={aluno.turma} />
          <InfoItem icon={Clock3} label="Turno" value={aluno.turno} />
          <InfoItem icon={Hash} label="Ano letivo" value={aluno.anoLetivo} />
        </CardContent>
      </Card>

      {/* Resumo académico e financeiro */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <GraduationCap className="size-4 text-primary" />
              Média do 1.º trimestre
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aluno.temDivida ? (
              <div>
                <p className="font-display text-4xl font-extrabold tracking-tight text-muted-foreground">
                  ••••••
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  A média fica disponível após a regularização das propinas.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                  {aluno.mediaPrimeiroTrimestre.toFixed(1)}
                  <span className="ml-1 text-lg font-semibold text-muted-foreground">/ 20</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Média geral do trimestre.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Wallet className="size-4 text-primary" />
              Estado das propinas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col justify-center gap-3">
            {aluno.temDivida ? (
              <>
                <Badge
                  variant="destructive"
                  className="w-fit gap-1.5 rounded-full px-3 py-1.5 text-sm"
                >
                  Propinas em dívida
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Regulariza a tua situação na página de Propinas para desbloquear o acesso às notas
                  e boletins.
                </p>
              </>
            ) : (
              <>
                <Badge className="w-fit gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-600/90">
                  <BadgeCheck className="size-4" />
                  Propinas pagas
                </Badge>
                <p className="text-sm text-muted-foreground">
                  A tua situação financeira está regularizada. Bom trabalho!
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AlunoShell>
  );
}
