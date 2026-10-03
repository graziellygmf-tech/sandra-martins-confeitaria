import { createClient } from "@/lib/supabase/server";
import type { PublicAvailabilityDay } from "@/lib/supabase/types";

export async function getAvailability(start: string, end: string): Promise<{ availability: PublicAvailabilityDay[]; error: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability_calendar")
    .select("date,status")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to load availability:", error);
    return { availability: [], error: true };
  }

  return { availability: data ?? [], error: false };
}

