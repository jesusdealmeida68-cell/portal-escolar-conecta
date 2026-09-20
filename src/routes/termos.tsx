import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de utilização — Huambo Calunga II" },
      { name: "description", content: "Termos de utilização do Huambo Calunga II." },
      { property: "og:title", content: "Termos de utilização — Huambo Calunga II" },
      { property: "og:description", content: "Termos de utilização do Huambo Calunga II." },
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
      <h1 className="mt-3 text-4xl font-extrabold">Termos de utilização</h1>
      <p className="mt-6 leading-7 text-muted-foreground">
        Os termos completos serão publicados antes da disponibilização de contas e serviços
        privados. O conteúdo atual tem caráter público e informativo.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/">
          <ArrowLeft /> Voltar
        </Link>
      </Button>
    </main>
  );
}
