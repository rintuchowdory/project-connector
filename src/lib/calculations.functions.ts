import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const saveSchema = z.object({
  age: z.number().int().min(14).max(100),
  grossSalary: z.number().min(0).max(1_000_000),
  employmentStatus: z.string().min(1).max(40),
  yearsWorked: z.number().int().min(0).max(80),
  retirementAge: z.number().int().min(50).max(80),
  estimatedPension: z.number().min(0),
  pensionGap: z.number().min(0),
  result: z.unknown().optional(),
});

export const saveCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("pension_calculations")
      .insert({
        user_id: userId,
        age: data.age,
        gross_salary: data.grossSalary,
        employment_status: data.employmentStatus,
        years_worked: data.yearsWorked,
        retirement_age: data.retirementAge,
        estimated_pension: data.estimatedPension,
        pension_gap: data.pensionGap,
        result: (data.result ?? null) as never,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });

export const listCalculations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("pension_calculations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("pension_calculations")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ display_name: z.string().trim().min(1).max(80) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("profiles")
      .update({ display_name: data.display_name })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });
