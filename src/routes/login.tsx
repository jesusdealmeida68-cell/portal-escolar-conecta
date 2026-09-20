import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Entrar — Portal Escolar" },
    { name: "description", content: "Acesso reservado do Portal Escolar." },
    { property: "og:title", content: "Entrar — Portal Escolar" },
    { property: "og:description", content: "Acesso reservado do Portal Escolar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: LoginPage,
});

function LoginPage() { return <main className="grid min-h-screen place-items-center bg-brand-pale px-4"><div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center portal-shadow"><span className="mx-auto grid size-14 place-items-center rounded-lg bg-primary text-primary-foreground"><GraduationCap /></span><h1 className="mt-5 text-2xl font-extrabold">Acesso ao Portal Escolar</h1><div className="mx-auto mt-6 grid size-11 place-items-center rounded-full bg-muted text-muted-foreground"><LockKeyhole className="size-5" /></div><p className="mt-4 text-sm leading-6 text-muted-foreground">A autenticação ainda não está disponível. Esta página está preparada para integração futura, sem criar acessos fictícios.</p><Button asChild variant="outline" className="mt-7"><Link to="/"><ArrowLeft /> Voltar à página inicial</Link></Button></div></main>; }