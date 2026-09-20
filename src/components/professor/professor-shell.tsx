import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpenCheck,
  CalendarClock,
  ChevronDown,
  ClipboardEdit,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { iniciais, nomeCurto } from "@/lib/aluno/format";
import { perfilProfessorMock } from "@/lib/professor/mock-data";
import logoHuambo from "@/assets/logo-huambo-calunga.jpg";

/** As seis páginas da Área do Professor, pela ordem em que aparecem no menu. */
export const NAV_ITEMS: ReadonlyArray<{
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}> = [
  { to: "/professor", label: "Início", icon: Home, exact: true },
  { to: "/professor/turmas", label: "Minhas Turmas", icon: Users },
  { to: "/professor/notas", label: "Disciplinas e Notas", icon: BookOpenCheck },
  { to: "/professor/lancar-notas", label: "Lançar Notas", icon: ClipboardEdit },
  { to: "/professor/horario", label: "Horário", icon: CalendarClock },
  { to: "/professor/perfil", label: "Meu Perfil", icon: GraduationCap },
];

function usePaginaAtiva() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return React.useCallback(
    (item: (typeof NAV_ITEMS)[number]) =>
      item.exact ? pathname === item.to : pathname.startsWith(item.to),
    [pathname],
  );
}

function tituloDaPagina(pathname: string): string {
  if (pathname.startsWith("/professor/turmas/")) return "Minha Turma";
  const item = NAV_ITEMS.find((i) => (i.exact ? pathname === i.to : pathname.startsWith(i.to)));
  return item?.label ?? "Área do Professor";
}

function BrandMark() {
  return (
    <Link to="/professor" className="flex min-w-0 items-center gap-2.5">
      <img
        src={logoHuambo}
        alt="Huambo Calunga II"
        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-black/5"
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-[15px] font-extrabold text-foreground">
          Huambo Calunga II
        </span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Área do Professor
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = usePaginaAtiva();
  return (
    <nav aria-label="Navegação da Área do Professor" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const ativo = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              ativo
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4.5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ProfessorMiniPerfil() {
  return (
    <Link
      to="/professor/perfil"
      className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 transition-colors hover:bg-accent"
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-secondary text-xs font-bold text-secondary-foreground">
          {iniciais(perfilProfessorMock.nomeCompleto)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">
          {nomeCurto(perfilProfessorMock.nomeCompleto)}
        </p>
        <p className="truncate text-xs text-muted-foreground">Ver perfil</p>
      </div>
    </Link>
  );
}

/** Menu lateral fixo — apenas em ecrãs de computador/tablet largo. */
function SidebarDesktop() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center border-b border-border px-4">
        <BrandMark />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavLinks />
      </div>
      <div className="border-t border-border p-3">
        <ProfessorMiniPerfil />
      </div>
    </aside>
  );
}

/** Menu recolhível — em telemóvel e tablet estreito, aberto a partir do cabeçalho. */
function SidebarMobile() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Abrir menu da Área do Professor"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle asChild>
            <div>
              <BrandMark />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t border-border p-3">
          <ProfessorMiniPerfil />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NotificacoesBotao() {
  const [aberto, setAberto] = React.useState(false);
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notificações"
        onClick={() => setAberto((v) => !v)}
        className="relative"
      >
        <Bell className="size-5" />
        <span
          className="absolute right-2 top-2 size-2 rounded-full bg-destructive"
          aria-hidden="true"
        />
      </Button>
      {aberto && (
        <div
          role="status"
          className="absolute right-0 z-30 mt-2 w-64 rounded-lg border border-border bg-popover p-3 text-sm text-muted-foreground shadow-lg"
        >
          Sem notificações novas. (Elemento apenas visual nesta fase.)
        </div>
      )}
    </div>
  );
}

function MenuConta() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-0.5 pr-1 pl-0.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-sm font-bold text-secondary-foreground">
            {iniciais(perfilProfessorMock.nomeCompleto)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {perfilProfessorMock.nomeCompleto}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/professor/perfil" className="flex cursor-pointer items-center gap-2">
            <GraduationCap className="size-4" aria-hidden="true" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate({ to: "/login" })}
          className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Terminar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CabecalhoSuperior() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const titulo = tituloDaPagina(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:pl-6">
      <SidebarMobile />
      <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">{titulo}</h1>
      <div className="flex shrink-0 items-center gap-1.5">
        <NotificacoesBotao />
        <MenuConta />
      </div>
    </header>
  );
}

/** Faixa curta a lembrar que os dados são fictícios — apenas informativa, sem qualquer controlo. */
function FaixaDemonstracao() {
  return (
    <p className="border-b border-notice-foreground/15 bg-notice px-4 py-1.5 text-center text-xs font-semibold text-notice-foreground sm:px-6">
      Protótipo visual — todos os dados apresentados são fictícios.
    </p>
  );
}

export function ProfessorShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarDesktop />
      <div className="lg:pl-64">
        <CabecalhoSuperior />
        <FaixaDemonstracao />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
