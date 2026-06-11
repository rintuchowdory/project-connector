# RentenRadar – MVP Plan

**"Verstehe deine Zukunft. Berechne deine Rente. Plane rechtzeitig."**

Eine vertrauenswürdige, KI-gestützte Renten-Plattform für Deutschland. Erste Version mit Renten-Rechner, Nutzerkonten mit Profil und einem echten KI Renten-Coach.

## Umfang dieser Version
- **Renten-Rechner** (Kern-Feature)
- **Login + Profil** (Lovable Cloud Backend, gespeicherte Berechnungen)
- **KI Renten-Coach** (echte Antworten über Lovable AI)
- **Design:** vertrauenswürdig & seriös (ruhige Blau/Grün-Töne, klar, wie eine moderne Bank/Behörde)

Krisen-Simulator und Länder-Vergleich kommen in einer späteren Phase.

## Seiten / Routen
```text
/                 Landing (Tagline, Erklärung, CTA zum Rechner/Login)
/auth             Login & Registrierung (E-Mail/Passwort + Google)
/rechner          Renten-Rechner (öffentlich nutzbar, Speichern erfordert Login)
/coach            KI Renten-Coach Chat (Login erforderlich)
/profil           Profil + gespeicherte Berechnungen (Login erforderlich)
```

## 1. Renten-Rechner
Eingaben: Alter, Bruttogehalt (monatlich), Beschäftigungsstatus, bisherige Arbeitsjahre, gewünschtes Renteneintrittsalter.

Ergebnis:
- Geschätzte gesetzliche Rente (vereinfachtes Entgeltpunkte-Modell)
- Rentenlücke (Differenz zum aktuellen Netto-Lebensstandard)
- Szenarien beim Renteneintrittsalter (63 / 67 / 70)
- Klare Hinweise, dass es sich um eine vereinfachte Schätzung handelt

Ergebnisse werden visuell dargestellt (Balken/Zahlen-Karten). Eingeloggte Nutzer können eine Berechnung speichern.

## 2. Login + Profil
- E-Mail/Passwort und Google-Anmeldung
- `profiles`-Tabelle (Name) wird beim Signup automatisch angelegt
- `pension_calculations`-Tabelle für gespeicherte Berechnungen pro Nutzer
- Profilseite zeigt Name + Liste gespeicherter Berechnungen

## 3. KI Renten-Coach
Chat-Assistent für Fragen wie "Kann ich mit 63 in Rente?", "Wie viel sollte ich monatlich sparen?", "Lohnen sich ETFs?".
- Antworten in einfacher, klarer Sprache (Deutsch)
- Nutzt die gespeicherten Profildaten/Berechnung als Kontext (falls vorhanden)
- Streaming-Antworten, Markdown-Darstellung
- Deutliche Hinweise: keine verbindliche Finanzberatung

## Technische Umsetzung
- **Backend:** Lovable Cloud aktivieren (Auth, Datenbank)
- **KI:** Lovable AI (Modell `google/gemini-3-flash-preview`) über Streaming-Server-Route `/api/chat`; System-Prompt + Key bleiben serverseitig
- **Datenbank:**
  - `profiles` (id → auth.users, display_name) + Trigger zum Auto-Anlegen, RLS nur eigener Zugriff
  - `pension_calculations` (user_id, Eingaben, Ergebnisse, created_at), RLS nur eigener Zugriff
  - GRANTs für `authenticated`/`service_role`
- **Auth-Routen:** geschützte Bereiche unter `_authenticated/` (Rechner öffentlich, Coach/Profil geschützt)
- **Design:** seriöses Farbsystem über semantische Tokens in `src/styles.css`, ruhige Blau/Grün-Palette, klare Typografie

## Wichtige Hinweise
- Die Rentenschätzung ist ein vereinfachtes Modell zur Orientierung, keine offizielle Rentenauskunft.
- Der Coach gibt allgemeine Informationen, keine individuelle Finanzberatung.

## Spätere Phasen (nicht in diesem Build)
- Krisen-Simulator ("Was passiert wenn…" mit interaktiven Charts)
- Länder-Vergleich (DE/Schweden/Niederlande/Schweiz) + politische Transparenz-Daten
- PDF-Renten-Reports, Premium-Features
