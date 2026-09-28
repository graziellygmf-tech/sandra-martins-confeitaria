"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveAvailability(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "");
  const capacityValue = String(formData.get("capacity") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Data inválida.");
  if (!["AVAILABLE", "LIMITED", "BLOCKED"].includes(status)) throw new Error("Status inválido.");

  const capacity = capacityValue === "" ? null : Number(capacityValue);
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 0)) {
    throw new Error("Capacidade inválida.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("availability_days")
    .upsert({
      date,
      status,
      capacity,
      notes: notes || null
    }, { onConflict: "date" });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/agenda");
}
