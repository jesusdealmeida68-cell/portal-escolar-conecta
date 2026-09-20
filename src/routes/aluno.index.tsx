import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarX2,
  ChevronRight,
  GraduationCap,
  LockKeyhole,
  TriangleAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/aluno/pill";
import { useAluno } from "@/lib/aluno/aluno-context";
import { formatarData, formatarKz, formatarMedia, iniciais } from "@/lib/aluno/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aluno/")({
  head: () => ({ meta: [{ title: "Início — Área do Aluno" }] }),
  component: InicioPage,
});

function CartaoResumo({
  to,
  icon: Icone,
  titulo,
  valor,
  detalhe,
  destaque,
}: {
  to: string;
  icon: LucideIcon;
  titulo: string;
  valor: React.ReactNode;
  detalhe: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        destaque ? "border-destructive/30" : "border-border",
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Icone className="size-4" aria-hidden="true" />
        {titulo}
      </span>
      <span className="mt-3 text-2xl font-extrabold text-foreground">{valor}</span>
      <span className="mt-1 text-sm text-muted-foreground">{detalhe}</span>
    </Link>
  );
}

function InicioPage() {
  const { perfil, propinas, temDivida, academico, notificacoes, naoLidas, faltas } = useAluno();

  // Última avaliação com notas oficiais. Sem `academico` (dívida) nunca chega a existir média.
  const boletim = academico?.boletins.filter((b) => b.disponivel).at(-1) ?? null;
  const totalFaltas = faltas.reduce((soma, f) => soma + f.quantidade, 0);
  const porJustificar = faltas.filter((f) => f.justificacao === "injustificada").length;
  const recentes = notificacoes.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6 portal-shadow">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
            {iniciais(perfil.nomeCompleto)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-[1.7rem]">
            Olá, {perfil.nomeCompleto.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{perfil.nomeCompleto}</p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
            {[
              ["Aluno n.º", perfil.numeroAluno],
              ["Classe", perfil.classe],
              ["Curso", perfil.curso],
              ["Turma", `${perfil.turma}, turno da ${perfil.turno.toLowerCase()}`],
              ["Ano letivo", perfil.anoLetivo],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="flex gap-1.5">
                <dt className="text-muted-foreground">{rotulo}:</dt>
                <dd className="font-semibold text-foreground">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {temDivida && (
        <section
          role="alert"
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-foreground">Tens propinas em dívida</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Enquanto não regularizares, as notas, médias, o boletim e a classificação ficam
              indisponíveis.
            </p>
          </div>
          <Button asChild>
            <Link to="/aluno/propinas">Ver propinas</Link>
          </Button>
        </section>
      )}

      <section aria-label="Resumo" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CartaoResumo
          to="/aluno/notas"
          icon={temDivida ? LockKeyhole : GraduationCap}
          titulo={boletim ? `Média do ${boletim.trimestre}.º trimestre` : "Média trimestral"}
          valor={
            temDivida ? (
              <span aria-label="Indisponível" className="tracking-widest">
                ••••••
              </span>
            ) : boletim?.media != null ? (
              formatarMedia(boletim.media)
            ) : (
              "—"
            )
          }
          detalhe={temDivida ? "Indisponível com propinas em dívida" : "Numa escala de 0 a 20"}
        />
        <CartaoResumo
          to="/aluno/propinas"
          icon={Wallet}
          titulo="Propinas"
          valor={
            <Pill tom={temDivida ? "perigo" : "sucesso"} className="text-sm">
              {temDivida ? "Em dívida" : "Em dia"}
            </Pill>
          }
          detalhe={
            temDivida
              ? `${formatarKz(propinas.totalEmDivida)} por pagar`
              : `${formatarKz(propinas.totalPago)} pagos`
          }
          destaque={temDivida}
        />
        <CartaoResumo
          to="/aluno/notificacoes"
          icon={Bell}
          titulo="Notificações"
          valor={naoLidas}
          detalhe="por ler"
        />
        <CartaoResumo
          to="/aluno/faltas"
          icon={CalendarX2}
          titulo="Faltas"
          valor={totalFaltas}
          detalhe={
            porJustificar > 0
              ? `${porJustificar} por justificar`
              : "Todas justificadas ou em análise"
          }
        />
      </section>

      <section aria-labelledby="recentes-titulo">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 id="recentes-titulo" className="text-lg font-extrabold text-foreground">
            Últimas notificações
          </h2>
          <Link
            to="/aluno/notificacoes"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {recentes.map((n) => (
            <li key={n.id}>
              <Link
                to="/aluno/notificacoes"
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    n.lida ? "bg-transparent" : "bg-primary",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm text-foreground",
                      n.lida ? "font-medium" : "font-bold",
                    )}
                  >
                    {n.titulo}
                    {!n.lida && <span className="sr-only"> (por ler)</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {formatarData(n.data)}
                  </span>
                </span>
                <ChevronRight className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
