import * as React from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Regista o service worker (necessário para o Chrome/Edge/Android considerarem
 * o site "instalável") e mostra:
 *  - Android/Chrome/Edge desktop: um botão flutuante que dispara o prompt nativo
 *    de instalação assim que o browser o disponibiliza (evento beforeinstallprompt).
 *  - iOS/Safari: não existe prompt nativo, por isso mostramos um cartão com o
 *    passo a passo (Partilhar → Adicionar ao ecrã principal).
 * Não é intrusivo: só aparece quando o browser sinaliza que a instalação é
 * possível, e o utilizador pode dispensar em qualquer altura (guardado na sessão).
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error -- iOS Safari-only property
    window.navigator.standalone === true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function PwaInstallManager() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Instalação continua a funcionar via manifest; falha silenciosa é aceitável aqui.
      });
    });
  }, []);

  React.useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
      return;
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (isIos()) {
      const timeout = window.setTimeout(() => setShowIosHint(true), 1200);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        window.clearTimeout(timeout);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (dismissed) return null;
  if (!deferredPrompt && !showIosHint) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar aplicação"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-card p-3.5 pr-2.5 portal-shadow",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]",
        "sm:inset-x-auto sm:right-5 sm:bottom-5",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
        <img src="/icons/icon-96.png" alt="" className="size-9" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">Instalar o Huambo Calunga II</p>
        {showIosHint && !deferredPrompt ? (
          <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            Toca em <Share className="size-3.5 shrink-0" aria-hidden="true" /> e depois em
            <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
              <SquarePlus className="size-3.5 shrink-0" aria-hidden="true" />
              Adicionar ao ecrã principal
            </span>
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Acede mais rápido, em ecrã inteiro, como uma aplicação.
          </p>
        )}
      </div>

      {deferredPrompt && (
        <Button size="sm" onClick={handleInstall} className="shrink-0 gap-1.5">
          <Download className="size-3.5" />
          Instalar
        </Button>
      )}

      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar"
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
