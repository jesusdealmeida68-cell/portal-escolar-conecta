import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Menu,
  Newspaper,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/portal-escolar-hero.jpg";
import scienceImage from "@/assets/noticia-ciencia.jpg";
import readingImage from "@/assets/noticia-leitura.jpg";
import sportsImage from "@/assets/noticia-desporto.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Huambo Calunga II — Educação, comunidade e futuro" },
      {
        name: "description",
        content: "Consulta notícias, comunicados, eventos e informações públicas da nossa escola.",
      },
      { property: "og:title", content: "Huambo Calunga II — Educação, comunidade e futuro" },
      { property: "og:description", content: "Informação da nossa escola num só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const categories = [
  "Todas",
  "Notícias escolares",
  "Comunicados oficiais",
  "Eventos",
  "Calendário escolar",
  "Projetos educativos",
  "Matrículas",
];

const news = [
  {
    id: 1,
    category: "Projetos educativos",
    title: "Ciência que transforma ideias em soluções",
    summary:
      "Uma apresentação visual de como os projetos educativos poderão ser divulgados no portal.",
    date: "18 set. 2026",
    image: scienceImage,
    featured: true,
  },
  {
    id: 2,
    category: "Notícias escolares",
    title: "Leitura partilhada aproxima estudantes",
    summary: "Exemplo de uma publicação sobre iniciativas de leitura e aprendizagem colaborativa.",
    date: "16 set. 2026",
    image: readingImage,
  },
  {
    id: 3,
    category: "Eventos",
    title: "Desporto escolar promove união",
    summary: "Exemplo de divulgação de uma atividade desportiva aberta à comunidade escolar.",
    date: "12 set. 2026",
    image: sportsImage,
  },
];

import logoHuambo from "@/assets/logo-huambo-calunga.jpg";

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img
        src={logoHuambo}
        alt="Huambo Calunga II"
        className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5"
      />
      <span
        className={`truncate font-display text-lg font-extrabold ${inverse ? "text-hero-foreground" : "text-foreground"}`}
      >
        Huambo Calunga II
      </span>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-brand-deep text-hero-foreground"
      role="status"
      aria-live="polite"
    >
      <div className="w-[min(82vw,360px)] text-center">
        <div className="mx-auto mb-6 grid size-20 place-items-center rounded-lg border border-hero-foreground/20 bg-hero-foreground/10">
          <GraduationCap className="size-10" />
        </div>
        <h1 className="text-2xl font-extrabold">Huambo Calunga II</h1>
        <p className="mt-2 text-sm text-hero-foreground/70">Educar hoje. Transformar o futuro.</p>
        <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-hero-foreground/15">
          <div className="loading-bar h-full w-20 rounded-full bg-brand-soft" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-hero-foreground/65">
          A preparar o portal...
        </p>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Início", "#inicio"],
    ["Notícias", "#noticias"],
    ["A Escola", "#escolas"],
    ["Eventos", "#eventos"],
    ["Sobre", "#sobre"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" aria-label="Huambo Calunga II, início">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
          <Button asChild>
            <Link to="/login">
              Entrar <ArrowRight />
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
          aria-label="Navegação móvel"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-accent"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => {
    const image = new Image();
    image.src = heroImage;
    const done = () => window.setTimeout(() => setLoading(false), 450);
    if (image.complete) done();
    else image.addEventListener("load", done, { once: true });
    const fallback = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(fallback);
  }, []);
  if (loading) return <LoadingScreen />;
  const visible = filter === "Todas" ? news : news.filter((item) => item.category === filter);
  return (
    <div id="inicio" className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative isolate min-h-[650px] overflow-hidden sm:min-h-[680px]">
          <img
            src={heroImage}
            alt="Estudantes num pátio escolar"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
            fetchPriority="high"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-4 py-20 sm:min-h-[680px] sm:px-6 lg:px-8">
            <div className="max-w-2xl text-hero-foreground">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-soft">
                Educação • Comunidade • Futuro
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Informação que aproxima toda a comunidade escolar.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-hero-foreground/80 sm:text-lg">
                Notícias, comunicados, eventos e informações da nossa escola reunidos num portal
                público, simples e acessível.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" asChild>
                  <a href="#noticias">
                    Explorar notícias <ArrowRight />
                  </a>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <a href="#escolas">
                    Conhecer a escola <Building2 />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="noticias" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Informação atual"
                title="Últimas notícias"
                description="Acompanha o que acontece na comunidade escolar. Os conteúdos abaixo são exemplos visuais para demonstrar o portal."
              />
              <span className="w-fit rounded-md bg-notice px-3 py-1.5 text-xs font-bold text-notice-foreground">
                Conteúdo de demonstração
              </span>
            </div>
            <div
              className="mt-10 flex gap-2 overflow-x-auto pb-3"
              role="group"
              aria-label="Filtrar publicações"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={filter === category ? "default" : "outline"}
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
            {visible.length ? (
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {visible.map((item) => (
                  <article
                    key={item.id}
                    className={`portal-shadow group overflow-hidden rounded-lg border border-border bg-card ${item.featured && visible.length > 1 ? "lg:row-span-2" : ""}`}
                  >
                    <img
                      src={item.image}
                      alt="Cenário escolar de demonstração"
                      width={1200}
                      height={912}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${item.featured && visible.length > 1 ? "h-64 lg:h-[360px]" : "h-48"}`}
                    />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase text-primary">
                          {item.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                      <Button
                        variant="link"
                        className="mt-3 h-auto px-0"
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        aria-expanded={expanded === item.id}
                      >
                        Ler notícia <ChevronRight />
                      </Button>
                      {expanded === item.id && (
                        <p className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                          Esta é uma publicação de demonstração. O conteúdo completo estará
                          disponível quando as notícias reais forem publicadas.
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-border bg-card py-14 text-center">
                <Newspaper className="mx-auto size-9 text-muted-foreground" />
                <h3 className="mt-4 font-bold">Nenhuma publicação nesta categoria</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Escolhe outra categoria para continuar a explorar.
                </p>
              </div>
            )}
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setFilter("Todas")}>
                Ver todas as notícias <ArrowRight />
              </Button>
            </div>
          </div>
        </section>

        <section
          id="escolas"
          className="scroll-mt-24 border-y border-border bg-brand-pale py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="A nossa escola"
              title="Conhece a nossa escola"
              description="Um espaço público para apresentar a nossa escola: localização, contactos e informações gerais."
            />
            <div className="mt-10 grid min-h-72 place-items-center rounded-lg border border-dashed border-primary/30 bg-card px-6 text-center">
              <div className="max-w-md">
                <span className="mx-auto grid size-14 place-items-center rounded-lg bg-secondary text-primary">
                  <Building2 />
                </span>
                <h3 className="mt-5 text-xl font-bold">As informações da escola aparecerão aqui</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ainda não foram adicionadas as informações da escola. Esta área será atualizada em
                  breve.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="eventos" className="scroll-mt-24 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <SectionHeading
                eyebrow="Agenda escolar"
                title="Próximos eventos"
                description="Atividades, encontros e datas importantes serão apresentados automaticamente após publicação."
              />
              <div className="rounded-lg border border-border bg-card p-6 portal-shadow sm:p-8">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                    <CalendarDays />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold">Calendário em preparação</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Ainda não existem eventos publicados. Quando houver novidades, poderá
                      consultar a data, instituição, local e descrição aqui.
                    </p>
                    <Button variant="link" className="mt-3 h-auto px-0" disabled>
                      Ver calendário <ArrowRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-deep py-20 text-hero-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-soft">
                  Informação oficial
                </p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Comunicados importantes
                </h2>
                <p className="mt-4 leading-7 text-hero-foreground/70">
                  Avisos institucionais, matrículas e alterações de calendário num espaço claro e
                  destacado.
                </p>
              </div>
              <div className="rounded-lg border border-hero-foreground/15 bg-hero-foreground/8 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <Bell className="mt-1 size-6 shrink-0 text-brand-soft" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-md bg-notice px-2.5 py-1 text-xs font-bold text-notice-foreground">
                        Demonstração
                      </span>
                      <span className="text-xs text-hero-foreground/60">20 set. 2026</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold">
                      Espaço reservado para comunicados oficiais
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-hero-foreground/70">
                      Os avisos serão apresentados aqui quando publicados por utilizadores
                      administrativos autorizados. Nenhum comunicado real está ativo neste momento.
                    </p>
                    <p className="mt-4 text-xs font-semibold text-hero-foreground/60">
                      Huambo Calunga II · Informação demonstrativa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="scroll-mt-24 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="lg:col-span-1">
              <SectionHeading
                eyebrow="Sobre o portal"
                title="Tudo num só lugar"
                description="Um ponto de encontro digital para estudantes, famílias, educadores e toda a comunidade."
              />
            </div>
            {[
              [
                BookOpen,
                "Informação acessível",
                "Conteúdo público organizado e fácil de consultar.",
              ],
              [Clock3, "Sempre atual", "Preparado para receber novas publicações automaticamente."],
              [
                GraduationCap,
                "Foco na educação",
                "Uma identidade criada para servir a comunidade escolar.",
              ],
            ].map(([Icon, title, text]) => {
              const C = Icon as typeof BookOpen;
              return (
                <div key={String(title)} className="rounded-lg border border-border bg-card p-6">
                  <C className="size-6 text-primary" />
                  <h3 className="mt-5 font-bold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{String(text)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hero-foreground/10 bg-brand-deep text-hero-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo inverse />
          <p className="mt-5 max-w-md text-sm leading-6 text-hero-foreground/65">
            Informação escolar pública, acessível e organizada para aproximar a escola, famílias e
            comunidade.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">Explorar</h2>
          <div className="mt-4 grid gap-3 text-sm text-hero-foreground/65">
            {[
              ["Início", "#inicio"],
              ["Notícias", "#noticias"],
              ["A Escola", "#escolas"],
              ["Eventos", "#eventos"],
              ["Sobre", "#sobre"],
            ].map(([l, h]) => (
              <a key={h} href={h} className="hover:text-hero-foreground">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold">Informação legal</h2>
          <div className="mt-4 grid gap-3 text-sm text-hero-foreground/65">
            <Link to="/privacidade" className="hover:text-hero-foreground">
              Política de privacidade
            </Link>
            <Link to="/termos" className="hover:text-hero-foreground">
              Termos de utilização
            </Link>
            <p>Contactos oficiais serão publicados quando disponibilizados.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-hero-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-hero-foreground/50 sm:px-6 lg:px-8">
          © 2026 Huambo Calunga II. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
