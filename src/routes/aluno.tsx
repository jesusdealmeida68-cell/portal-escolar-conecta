import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AlunoHeader } from "@/components/aluno/aluno-header";
import { DemoBar } from "@/components/aluno/demo-bar";
import { AlunoProvider } from "@/lib/aluno/aluno-context";

export const Route = createFileRoute("/aluno")({
  head: () => ({
    meta: [{ title: "Área do Aluno — Huambo Calunga II" }, { name: "robots", content: "noindex" }],
  }),
  component: AlunoLayout,
});

/**
 * Estrutura comum às oito páginas: faixa de demonstração, cabeçalho com a navegação horizontal
 * no topo (sem menu lateral) e o conteúdo da página ativa.
 */
function AlunoLayout() {
  return (
    <AlunoProvider>
      <div className="min-h-screen bg-background">
        <DemoBar />
        <AlunoHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </AlunoProvider>
  );
}
