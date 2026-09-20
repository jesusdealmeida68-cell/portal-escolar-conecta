import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ProfessorShell } from "@/components/professor/professor-shell";

export const Route = createFileRoute("/professor")({
  head: () => ({
    meta: [
      { title: "Área do Professor — Huambo Calunga II" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfessorLayout,
});

function ProfessorLayout() {
  return (
    <ProfessorShell>
      <Outlet />
    </ProfessorShell>
  );
}
