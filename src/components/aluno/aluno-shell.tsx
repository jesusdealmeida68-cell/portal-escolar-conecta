import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Bell,
  CalendarClock,
  ClipboardList,
  GraduationCap,
  Home,
  KeyRound,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { alunoMock, notificacoesMock } from "@/lib/mock-aluno";

/** As oito páginas da Área do Aluno — não adicionar nem remover itens sem alinhar com o pedido original. */
const navItems: Array<{
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}> = [
  { to: "/aluno", label: "Início", icon: Home, exact: true },
  { to: "/aluno/notas", label: "Notas e boletim", icon: ClipboardList },
  { to: "/aluno/propinas", label: "Propinas", icon: Wallet },
  { to: "/aluno/ranking", label: "Ranking", icon: Award },
  { to: "/aluno/notificacoes", label: "Notificações", icon: Bell },
  { to: "/aluno/horarios", label: "Horários", icon: CalendarClock },
  { to: "/aluno/faltas", label: "Mapa de faltas", icon: ClipboardList },
  { to: "/aluno/senha", label: "Trocar senha", icon: KeyRound },
];

function AlunoLogo() {
  return (
    <Link
      to="/aluno"
      className="flex min-w-0 items-center gap-2.5"
      aria-label="Portal Escolar, Área do Aluno"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary">
        <GraduationCap className="size-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-base font-extrabold text-foreground">
          Portal Escolar
        </span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Área do Aluno
        </span>
      </span>
    </Link>
  );
}

function NotificationsButton() {
  const naoLidas = notificacoesMock.filter((n) => !n.lida).length;
  return (
    <Link
      to="/aluno/notificacoes"
      aria-label="Notificações"
      className="relative grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Bell className="size-5" aria-hidden="true" />
      {naoLidas > 0 && (
        <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {naoLidas}
        </span>
      )}
    </Link>
  );
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex shrink-0 items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-sm font-bold text-secondary-foreground">
            {alunoMock.fotoIniciais}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-foreground sm:inline">
          {alunoMock.nomeCompleto.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{alunoMock.nomeCompleto}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/aluno/senha" className="flex cursor-pointer items-center gap-2">
            <Settings className="size-4" aria-hidden="true" />
            Trocar senha
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/"
            className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <AlunoLogo />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <NotificationsButton />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

function HorizontalNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Navegação da Área do Aluno"
      className="sticky top-16 z-20 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-1 sm:px-4">
        <ul className="flex snap-x snap-mandatory gap-1 overflow-x-auto scroll-smooth px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1.5 sm:px-2 [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to} className="shrink-0 snap-start">
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Cabeçalho da página com título e descrição opcional — usado em todas as 8 páginas para consistência visual. */
export function AlunoPageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl bg-brand-pale text-primary">
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>
    </div>
  );
}

/** Invólucro comum a todas as páginas da Área do Aluno: cabeçalho + navegação + conteúdo responsivo. */
export function AlunoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <TopHeader />
      <HorizontalNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
