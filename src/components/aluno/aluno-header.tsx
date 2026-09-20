import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  CalendarX2,
  ChevronDown,
  FileText,
  House,
  KeyRound,
  LogOut,
  Trophy,
  Wallet,
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
import { useAluno } from "@/lib/aluno/aluno-context";
import { iniciais, nomeCurto } from "@/lib/aluno/format";
import { cn } from "@/lib/utils";

/** As oito páginas da Área do Aluno, pela ordem em que aparecem no topo. */
export const ITENS_NAV = [
  { to: "/aluno", label: "Início", icon: House },
  { to: "/aluno/notas", label: "Notas e boletim", icon: FileText },
  { to: "/aluno/propinas", label: "Propinas", icon: Wallet },
  { to: "/aluno/ranking", label: "Ranking", icon: Trophy },
  { to: "/aluno/notificacoes", label: "Notificações", icon: Bell },
  { to: "/aluno/horarios", label: "Horários", icon: CalendarDays },
  { to: "/aluno/faltas", label: "Mapa de faltas", icon: CalendarX2 },
  { to: "/aluno/trocar-senha", label: "Trocar senha", icon: KeyRound },
] as const satisfies ReadonlyArray<{ to: string; label: string; icon: LucideIcon }>;

/** Contador vermelho sobre um ícone (notificações por ler). */
function ContadorBadge({ valor, className }: { valor: number; className?: string }) {
  if (valor <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] leading-4 font-bold text-destructive-foreground ring-2 ring-card",
        className,
      )}
    >
      {valor > 9 ? "9+" : valor}
    </span>
  );
}

function MenuConta() {
  const { perfil } = useAluno();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-muted py-1 pr-2 pl-1 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:pr-3"
        aria-label={`Menu da conta de ${nomeCurto(perfil.nomeCompleto)}`}
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
            {iniciais(perfil.nomeCompleto)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate sm:inline">{nomeCurto(perfil.nomeCompleto)}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-bold text-foreground">{perfil.nomeCompleto}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Aluno n.º {perfil.numeroAluno}, {perfil.classe}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/aluno/trocar-senha" className="cursor-pointer">
            <KeyRound className="size-4" aria-hidden="true" /> Trocar senha
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer">
            <House className="size-4" aria-hidden="true" /> Página inicial do portal
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

/**
 * Navegação horizontal no topo, ao estilo do Facebook: ícone + nome, página ativa destacada.
 * No telemóvel desliza para os lados; o separador ativo é centrado automaticamente.
 */
function NavegacaoAluno() {
  const { naoLidas } = useAluno();
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

  // Centra o separador ativo sempre que a página muda (só desloca a própria barra, nunca a página).
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
    <nav aria-label="Áreas do aluno" className="relative border-t border-border/70">
      <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
        <div
          ref={scrollerRef}
          onScroll={atualizarFade}
          className="relative flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITENS_NAV.map((item) => {
            const Icone = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className={cn(
                  "group relative my-1 flex h-11 shrink-0 snap-center items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors xl:flex-1",
                  "hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  "data-[status=active]:text-primary",
                  // Barra inferior da página ativa, encostada à linha do cabeçalho.
                  "after:absolute after:inset-x-3 after:-bottom-1 after:h-[3px] after:origin-center after:scale-x-0 after:rounded-t-full after:bg-primary after:transition-transform data-[status=active]:after:scale-x-100",
                )}
              >
                <span className="relative">
                  <Icone className="size-5" aria-hidden="true" />
                  {item.to === "/aluno/notificacoes" && (
                    <ContadorBadge valor={naoLidas} className="-top-1.5 -right-2" />
                  )}
                </span>
                <span>{item.label}</span>
                {item.to === "/aluno/notificacoes" && naoLidas > 0 && (
                  <span className="sr-only">, {naoLidas} por ler</span>
                )}
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

export function AlunoHeader() {
  const { naoLidas } = useAluno();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/aluno"
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Huambo Calunga II, início da Área do Aluno"
        >
          <AuthLogo />
          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
          <span className="hidden text-sm font-semibold text-muted-foreground sm:block">
            Área do Aluno
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/aluno/notificacoes"
            className="relative grid size-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={
              naoLidas > 0 ? `Notificações, ${naoLidas} por ler` : "Notificações, sem novidades"
            }
          >
            <Bell className="size-5" aria-hidden="true" />
            <ContadorBadge valor={naoLidas} className="-top-0.5 -right-0.5" />
          </Link>
          <MenuConta />
        </div>
      </div>
      <NavegacaoAluno />
    </header>
  );
}
