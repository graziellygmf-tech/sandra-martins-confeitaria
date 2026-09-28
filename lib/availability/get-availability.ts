import { createClient } from "@/lib/supabase/server";
import type { AvailabilityDay } from "@/lib/supabase/types";

export async function getAvailability(start: string, end: string): Promise<AvailabilityDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability_days")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to load availability:", error);
    return [];
  }

  return (data ?? []) as AvailabilityDay[];
}
