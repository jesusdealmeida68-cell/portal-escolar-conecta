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
  Users,
  type LucideIcon,
} from "lucide-react";

import { AuthLogo } from "@/components/auth/auth-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iniciais, nomeCurto } from "@/lib/aluno/format";
import { perfilProfessorMock } from "@/lib/professor/mock-data";
import { cn } from "@/lib/utils";

/** As seis páginas da Área do Professor, pela ordem em que aparecem no topo. */
export const NAV_ITEMS = [
  { to: "/professor", label: "Início", icon: Home, exact: true },
  { to: "/professor/turmas", label: "Minhas Turmas", icon: Users, exact: false },
  { to: "/professor/notas", label: "Disciplinas e Notas", icon: BookOpenCheck, exact: false },
  { to: "/professor/lancar-notas", label: "Lançar Notas", icon: ClipboardEdit, exact: false },
  { to: "/professor/horario", label: "Horário", icon: CalendarClock, exact: false },
  { to: "/professor/perfil", label: "Meu Perfil", icon: GraduationCap, exact: false },
] as const satisfies ReadonlyArray<{ to: string; label: string; icon: LucideIcon; exact: boolean }>;

/** Faixa curta a lembrar que os dados são fictícios — igual à da Área do Aluno, só sem o alternador de cenário. */
function FaixaDemonstracao() {
  return (
    <div className="border-b border-notice-foreground/15 bg-notice text-notice-foreground">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs font-semibold sm:px-6 lg:px-8">
        Protótipo visual — todos os dados apresentados são fictícios.
      </p>
    </div>
  );
}

function MenuConta() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-muted py-1 pr-2 pl-1 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:pr-3"
        aria-label={`Menu da conta de ${nomeCurto(perfilProfessorMock.nomeCompleto)}`}
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
            {iniciais(perfilProfessorMock.nomeCompleto)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate sm:inline">
          {nomeCurto(perfilProfessorMock.nomeCompleto)}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-bold text-foreground">
            {perfilProfessorMock.nomeCompleto}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{perfilProfessorMock.cargo}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/professor/perfil" className="cursor-pointer">
            <GraduationCap className="size-4" aria-hidden="true" /> Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer">
            <Home className="size-4" aria-hidden="true" /> Página inicial do portal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Terminar sessão a sério (supabase.auth.signOut) fica para a etapa do backend. */}
        <DropdownMenuItem className="cursor-pointer" onSelect={() => navigate({ to: "/login" })}>
          <LogOut className="size-4" aria-hidden="true" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificacoesBotao() {
  const [aberto, setAberto] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="relative grid size-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label="Notificações"
      >
        <Bell className="size-5" aria-hidden="true" />
        <span
          className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-card"
          aria-hidden="true"
        />
      </button>
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

/**
 * Navegação horizontal no topo, ao estilo do Facebook: ícone + nome, página ativa destacada.
 * No telemóvel desliza para os lados; o separador ativo é centrado automaticamente.
 * Estrutura idêntica à Área do Aluno (src/components/aluno/aluno-header.tsx).
 */
function NavegacaoProfessor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [fade, setFade] = React.useState({ esquerda: false, direita: false });

  const atualizarFade = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setFade({
      esquerda: el.scrollLeft > 4,
      direita: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ativo = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (ativo) {
      const alvo = ativo.offsetLeft - (el.clientWidth - ativo.offsetWidth) / 2;
      el.scrollTo({ left: Math.max(0, alvo), behavior: "smooth" });
    }
    atualizarFade();
  }, [pathname, atualizarFade]);

  React.useEffect(() => {
    window.addEventListener("resize", atualizarFade);
    return () => window.removeEventListener("resize", atualizarFade);
  }, [atualizarFade]);

  return (
    <nav aria-label="Áreas do professor" className="relative border-t border-border/70">
      <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
        <div
          ref={scrollerRef}
          onScroll={atualizarFade}
          className="relative flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const Icone = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className={cn(
                  "group relative my-1 flex h-11 shrink-0 snap-center items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors xl:flex-1",
                  "hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  "data-[status=active]:text-primary",
                  "after:absolute after:inset-x-3 after:-bottom-1 after:h-[3px] after:origin-center after:scale-x-0 after:rounded-t-full after:bg-primary after:transition-transform data-[status=active]:after:scale-x-100",
                )}
              >
                <Icone className="size-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent transition-opacity lg:hidden",
          fade.esquerda ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent transition-opacity lg:hidden",
          fade.direita ? "opacity-100" : "opacity-0",
        )}
      />
    </nav>
  );
}

function ProfessorHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/professor"
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Huambo Calunga II, início da Área do Professor"
        >
          <AuthLogo />
          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
          <span className="hidden text-sm font-semibold text-muted-foreground sm:block">
            Área do Professor
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <NotificacoesBotao />
          <MenuConta />
        </div>
      </div>
      <NavegacaoProfessor />
    </header>
  );
}

export function ProfessorShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <FaixaDemonstracao />
      <ProfessorHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
