import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, User } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getProfile,
  updateProfile,
  listCalculations,
  deleteCalculation,
} from "@/lib/calculations.functions";
import { employmentLabels, formatEuro, type EmploymentStatus } from "@/lib/pension";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({ meta: [{ title: "Profil – RentenRadar" }] }),
  component: ProfilPage,
});

function ProfilPage() {
  const queryClient = useQueryClient();
  const fetchProfile = useServerFn(getProfile);
  const saveProfile = useServerFn(updateProfile);
  const fetchCalcs = useServerFn(listCalculations);
  const removeCalc = useServerFn(deleteCalculation);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  const calcsQuery = useQuery({
    queryKey: ["calculations"],
    queryFn: () => fetchCalcs(),
  });

  useEffect(() => {
    if (profileQuery.data?.display_name) setName(profileQuery.data.display_name);
  }, [profileQuery.data]);

  async function handleSaveName() {
    setSavingName(true);
    try {
      await saveProfile({ data: { display_name: name } });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil aktualisiert.");
    } catch {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeCalc({ data: { id } });
      await queryClient.invalidateQueries({ queryKey: ["calculations"] });
      toast.success("Berechnung gelöscht.");
    } catch {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Mein Profil
        </h1>

        <Card className="mt-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" /> Persönliche Daten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Anzeigename</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveName} disabled={savingName || !name.trim()}>
                Speichern
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="mt-10 text-xl font-semibold text-foreground">
          Gespeicherte Berechnungen
        </h2>

        <div className="mt-4 space-y-3">
          {calcsQuery.isLoading && (
            <p className="text-sm text-muted-foreground">Lädt …</p>
          )}
          {calcsQuery.data && calcsQuery.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Noch keine Berechnungen gespeichert.
            </p>
          )}
          {calcsQuery.data?.map((c) => (
            <Card key={c.id} className="border-border">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-4">
                  <Detail label="Alter" value={`${c.age} J.`} />
                  <Detail
                    label="Status"
                    value={
                      employmentLabels[c.employment_status as EmploymentStatus] ??
                      c.employment_status
                    }
                  />
                  <Detail
                    label="Rente / Monat"
                    value={formatEuro(Number(c.estimated_pension))}
                  />
                  <Detail
                    label="Lücke / Monat"
                    value={formatEuro(Number(c.pension_gap))}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                  aria-label="Löschen"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
