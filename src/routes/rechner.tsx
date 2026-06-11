import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Save, Info } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { saveCalculation } from "@/lib/calculations.functions";
import {
  calculatePension,
  employmentLabels,
  formatEuro,
  type EmploymentStatus,
  type PensionResult,
} from "@/lib/pension";

export const Route = createFileRoute("/rechner")({
  head: () => ({
    meta: [
      { title: "Renten-Rechner – RentenRadar" },
      {
        name: "description",
        content:
          "Berechne deine voraussichtliche gesetzliche Rente und deine Rentenlücke mit dem RentenRadar Renten-Rechner.",
      },
    ],
  }),
  component: RechnerPage,
});

function RechnerPage() {
  const { isAuthenticated } = useAuth();
  const save = useServerFn(saveCalculation);

  const [age, setAge] = useState(30);
  const [salary, setSalary] = useState(3500);
  const [status, setStatus] = useState<EmploymentStatus>("angestellt");
  const [yearsWorked, setYearsWorked] = useState(8);
  const [retirementAge, setRetirementAge] = useState(67);
  const [result, setResult] = useState<PensionResult | null>(null);
  const [saving, setSaving] = useState(false);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const r = calculatePension({
      age,
      grossSalary: salary,
      employmentStatus: status,
      yearsWorked,
      retirementAge,
    });
    setResult(r);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "rentenradar:last-result",
        `Alter: ${age}, Bruttogehalt: ${salary} EUR/Monat, Status: ${employmentLabels[status]}, gearbeitete Jahre: ${yearsWorked}, gewünschtes Renteneintrittsalter: ${retirementAge}. Geschätzte gesetzliche Rente: ${formatEuro(r.estimatedPension)}/Monat, Rentenlücke: ${formatEuro(r.pensionGap)}/Monat, empfohlene Sparrate: ${formatEuro(r.recommendedMonthlySaving)}/Monat.`,
      );
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      await save({
        data: {
          age,
          grossSalary: salary,
          employmentStatus: status,
          yearsWorked,
          retirementAge,
          estimatedPension: result.estimatedPension,
          pensionGap: result.pensionGap,
          result: result as unknown,
        },
      });
      toast.success("Berechnung gespeichert.");
    } catch {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  const chartData = result
    ? result.scenarios.map((s) => ({
        name: `mit ${s.retirementAge}`,
        rente: s.pension,
        current: s.retirementAge === retirementAge,
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Renten-Rechner
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Eine vereinfachte Schätzung deiner gesetzlichen Rente. Die echten Werte
          hängen von vielen Faktoren ab – betrachte das Ergebnis als Orientierung.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Deine Angaben</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="age">Aktuelles Alter: {age} Jahre</Label>
                  <Input
                    id="age"
                    type="number"
                    min={14}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Bruttogehalt (monatlich, EUR)</Label>
                  <Input
                    id="salary"
                    type="number"
                    min={0}
                    step={50}
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beschäftigungsstatus</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as EmploymentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.keys(employmentLabels) as EmploymentStatus[]
                      ).map((key) => (
                        <SelectItem key={key} value={key}>
                          {employmentLabels[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Bereits gearbeitete Jahre</Label>
                  <Input
                    id="years"
                    type="number"
                    min={0}
                    max={80}
                    value={yearsWorked}
                    onChange={(e) => setYearsWorked(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ret">
                    Gewünschtes Renteneintrittsalter: {retirementAge}
                  </Label>
                  <Input
                    id="ret"
                    type="number"
                    min={60}
                    max={75}
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Rente berechnen
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-6">
            {!result ? (
              <Card className="flex h-full items-center justify-center border-dashed">
                <CardContent className="py-16 text-center text-muted-foreground">
                  Fülle das Formular aus und klicke auf „Rente berechnen", um dein
                  Ergebnis zu sehen.
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Geschätzte Rente / Monat"
                    value={formatEuro(result.estimatedPension)}
                    accent
                  />
                  <StatCard
                    label="Rentenlücke / Monat"
                    value={formatEuro(result.pensionGap)}
                  />
                  <StatCard
                    label="Wunsch-Einkommen (80%)"
                    value={formatEuro(result.targetIncome)}
                  />
                  <StatCard
                    label="Empf. Sparrate / Monat"
                    value={formatEuro(result.recommendedMonthlySaving)}
                  />
                </div>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Szenarien nach Renteneintrittsalter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--border)"
                          />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            width={48}
                          />
                          <Bar dataKey="rente" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={
                                  entry.current
                                    ? "var(--color-accent)"
                                    : "var(--color-primary)"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-3">
                  {isAuthenticated ? (
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="mr-1 h-4 w-4" />
                      Berechnung speichern
                    </Button>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link to="/auth">Anmelden, um zu speichern</Link>
                    </Button>
                  )}
                  <Button variant="ghost" asChild>
                    <Link to="/coach">Mit dem KI-Coach besprechen</Link>
                  </Button>
                </div>

                <p className="flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Vereinfachtes Modell auf Basis von Entgeltpunkten. Keine
                  offizielle Rentenauskunft. Tatsächliche Werte können erheblich
                  abweichen.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-accent/40 bg-accent/5" : "border-border"}>
      <CardContent className="py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
