// Vereinfachtes Renten-Modell für RentenRadar.
// WICHTIG: Dies ist eine grobe Orientierungsschätzung, keine offizielle Rentenauskunft.

export type EmploymentStatus =
  | "angestellt"
  | "selbststaendig"
  | "beamter"
  | "minijob"
  | "arbeitslos";

export interface PensionInput {
  age: number;
  grossSalary: number; // brutto pro Monat in EUR
  employmentStatus: EmploymentStatus;
  yearsWorked: number;
  retirementAge: number;
}

export interface PensionResult {
  estimatedPension: number; // monatliche gesetzliche Rente (EUR)
  pensionGap: number; // Lücke zum gewünschten Lebensstandard (EUR / Monat)
  netToday: number; // geschätztes heutiges Netto (EUR / Monat)
  targetIncome: number; // Wunsch-Renteneinkommen (80% des Netto)
  totalContributionYears: number; // erwartete Beitragsjahre bis Rente
  scenarios: { retirementAge: number; pension: number }[];
  recommendedMonthlySaving: number; // empfohlene private Sparrate
}

// Durchschnittsentgelt (West) ~ 45.358 EUR / Jahr (2024er Größenordnung).
const AVG_ANNUAL_INCOME = 45358;
// Aktueller Rentenwert (West) ~ 39,32 EUR pro Entgeltpunkt (2024er Größenordnung).
const PENSION_VALUE_PER_POINT = 39.32;
const STANDARD_RETIREMENT_AGE = 67;

// Sehr grobe Netto-Schätzung aus dem Bruttogehalt.
function estimateNet(gross: number): number {
  if (gross <= 0) return 0;
  // vereinfachte effektive Abgabenquote
  let rate = 0.36;
  if (gross < 2000) rate = 0.25;
  else if (gross < 3500) rate = 0.32;
  else if (gross < 5500) rate = 0.38;
  else rate = 0.43;
  return Math.round(gross * (1 - rate));
}

function pensionForYears(input: PensionInput, contributionYears: number): number {
  if (input.employmentStatus === "selbststaendig") {
    // i. d. R. keine gesetzliche Pflichtversicherung
    return 0;
  }

  // Entgeltpunkte pro Jahr = eigenes Jahreseinkommen / Durchschnittsentgelt
  let annualIncome = input.grossSalary * 12;
  if (input.employmentStatus === "minijob") annualIncome = Math.min(annualIncome, 6456);
  if (input.employmentStatus === "arbeitslos") annualIncome = AVG_ANNUAL_INCOME * 0.4;

  const pointsPerYear = Math.min(annualIncome / AVG_ANNUAL_INCOME, 2);
  const totalPoints = pointsPerYear * Math.max(contributionYears, 0);

  // Zu- / Abschlag je nach Renteneintrittsalter (0,3 %/Monat früher, +0,5 %/Monat später)
  const monthsDiff = (input.retirementAge - STANDARD_RETIREMENT_AGE) * 12;
  let factor = 1;
  if (monthsDiff < 0) factor = 1 + monthsDiff * 0.003;
  else if (monthsDiff > 0) factor = 1 + monthsDiff * 0.005;
  factor = Math.max(factor, 0.7);

  // Beamte: höhere Pension (Näherung)
  const beamtenBonus = input.employmentStatus === "beamter" ? 1.6 : 1;

  return Math.round(totalPoints * PENSION_VALUE_PER_POINT * factor * beamtenBonus);
}

export function calculatePension(input: PensionInput): PensionResult {
  const yearsUntilRetirement = Math.max(input.retirementAge - input.age, 0);
  const totalContributionYears = input.yearsWorked + yearsUntilRetirement;

  const estimatedPension = pensionForYears(input, totalContributionYears);
  const netToday = estimateNet(input.grossSalary);
  const targetIncome = Math.round(netToday * 0.8);
  const pensionGap = Math.max(targetIncome - estimatedPension, 0);

  const scenarioAges = [63, 67, 70];
  const scenarios = scenarioAges.map((retirementAge) => {
    const years = input.yearsWorked + Math.max(retirementAge - input.age, 0);
    return {
      retirementAge,
      pension: pensionForYears({ ...input, retirementAge }, years),
    };
  });

  // Empfohlene Sparrate: Lücke über die verbleibenden Jahre ansparen,
  // grobe Annahme ~3 % reale Rendite, ~20 Jahre Rentenbezug.
  let recommendedMonthlySaving = 0;
  if (pensionGap > 0 && yearsUntilRetirement > 0) {
    const neededCapital = pensionGap * 12 * 20;
    const months = yearsUntilRetirement * 12;
    const monthlyRate = 0.03 / 12;
    // Annuität (Sparplan-Endwert): FV = PMT * ((1+r)^n - 1) / r
    const growth = Math.pow(1 + monthlyRate, months);
    recommendedMonthlySaving = Math.round((neededCapital * monthlyRate) / (growth - 1));
  }

  return {
    estimatedPension,
    pensionGap,
    netToday,
    targetIncome,
    totalContributionYears,
    scenarios,
    recommendedMonthlySaving,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const employmentLabels: Record<EmploymentStatus, string> = {
  angestellt: "Angestellt",
  selbststaendig: "Selbstständig",
  beamter: "Beamtin / Beamter",
  minijob: "Minijob",
  arbeitslos: "Arbeitssuchend",
};
