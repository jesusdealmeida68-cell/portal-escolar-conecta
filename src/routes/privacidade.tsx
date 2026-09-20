import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Huambo Calunga II" },
      { name: "description", content: "Informação sobre privacidade no Huambo Calunga II." },
      { property: "og:title", content: "Política de privacidade — Huambo Calunga II" },
      { property: "og:description", content: "Informação sobre privacidade no Huambo Calunga II." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});
function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Informação legal</p>
      <h1 className="mt-3 text-4xl font-extrabold">Política de privacidade</h1>
      <p className="mt-6 leading-7 text-muted-foreground">
        A política completa será publicada antes da recolha de dados pessoais ou da ativação de
        contas. Nesta fase, a página pública não solicita dados pessoais.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/">
          <ArrowLeft /> Voltar
        </Link>
      </Button>
    </main>
  );
}
