import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator,
  MessageSquareText,
  ShieldCheck,
  TrendingDown,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RentenRadar – Berechne & verstehe deine Rente" },
      {
        name: "description",
        content:
          "RentenRadar hilft dir, deine gesetzliche Rente zu berechnen, deine Rentenlücke zu erkennen und mit einem KI-Coach rechtzeitig zu planen.",
      },
      { property: "og:title", content: "RentenRadar – Berechne & verstehe deine Rente" },
      {
        property: "og:description",
        content:
          "KI-gestützter Renten-Rechner für Deutschland: gesetzliche Rente schätzen, Rentenlücke erkennen, klug vorsorgen.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 to-background" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Verständlich. Unabhängig. Für Deutschland.
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Verstehe deine Zukunft. <br />
              Berechne deine Rente.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              RentenRadar zeigt dir in wenigen Minuten, wie hoch deine gesetzliche
              Rente voraussichtlich ausfällt, wie groß deine Rentenlücke ist – und
              was du heute tun kannst, um rechtzeitig zu planen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/rechner">
                  Jetzt Rente berechnen
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/coach">KI Renten-Coach fragen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingDown,
              title: "Sinkendes Rentenniveau",
              text: "Immer weniger Beschäftigte finanzieren immer mehr Rentnerinnen und Rentner. Das setzt die gesetzliche Rente unter Druck.",
            },
            {
              icon: LineChart,
              title: "Unsicherheit über Reformen",
              text: "Renteneintrittsalter, Beitragssätze, Aktienrente – kaum jemand weiß, was die Reformen für die eigene Rente bedeuten.",
            },
            {
              icon: ShieldCheck,
              title: "Zu spät vorgesorgt",
              text: "Wer früh plant, profitiert vom Zinseszins. RentenRadar macht sichtbar, wie viel privates Sparen wirklich nötig ist.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border">
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  <item.icon className="h-6 w-6" />
                </span>
                <CardTitle className="mt-3 text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            So funktioniert RentenRadar
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calculator className="h-6 w-6" />
                </span>
                <CardTitle className="mt-3">Renten-Rechner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Gib Alter, Gehalt und Arbeitsjahre ein und erhalte eine
                  Schätzung deiner gesetzlichen Rente, deiner Rentenlücke und
                  Szenarien für unterschiedliche Renteneintrittsalter.
                </p>
                <Button variant="link" className="px-0" asChild>
                  <Link to="/rechner">
                    Zum Rechner <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <MessageSquareText className="h-6 w-6" />
                </span>
                <CardTitle className="mt-3">KI Renten-Coach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Stelle Fragen wie „Kann ich mit 63 in Rente?" oder „Wie viel
                  sollte ich monatlich sparen?" und erhalte verständliche
                  Antworten in einfacher Sprache.
                </p>
                <Button variant="link" className="px-0" asChild>
                  <Link to="/coach">
                    Coach öffnen <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">RentenRadar</p>
          <p className="mt-2 max-w-2xl">
            Hinweis: RentenRadar liefert vereinfachte Schätzungen zur Orientierung
            und ersetzt keine offizielle Rentenauskunft oder unabhängige
            Finanzberatung.
          </p>
        </div>
      </footer>
    </div>
  );
}
