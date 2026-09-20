import { useAluno } from "@/lib/aluno/aluno-context";
import type { Cenario } from "@/lib/aluno/mock-data";
import { cn } from "@/lib/utils";

const OPCOES: Array<{ valor: Cenario; rotulo: string }> = [
  { valor: "em-dia", rotulo: "Propinas em dia" },
  { valor: "em-divida", rotulo: "Propinas em dívida" },
];

/**
 * Faixa temporária: avisa que os dados são de demonstração e deixa testar a regra das propinas.
 * Desaparece (junto com `demo` no contexto) quando o Supabase for ligado.
 */
export function DemoBar() {
  const { demo } = useAluno();

  return (
    <div className="border-b border-notice-foreground/15 bg-notice text-notice-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <p className="font-semibold">Dados de demonstração. Nada aqui é real.</p>
        <div
          role="group"
          aria-label="Situação das propinas na demonstração"
          className="inline-flex rounded-md bg-background/70 p-0.5"
        >
          {OPCOES.map((opcao) => {
            const ativo = demo.cenario === opcao.valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                aria-pressed={ativo}
                onClick={() => demo.definirCenario(opcao.valor)}
                className={cn(
                  "cursor-pointer rounded px-3 py-1 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  ativo
                    ? "bg-primary text-primary-foreground"
                    : "text-notice-foreground hover:bg-background",
                )}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
