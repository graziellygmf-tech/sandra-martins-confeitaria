"use server";

import { requireAdmin } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveAvailability(formData: FormData) {
  const { supabase } = await requireAdmin();
  const date = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "");
  const capacityValue = String(formData.get("capacity") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Escolha uma data válida.");
  if (!["AVAILABLE", "LIMITED", "BLOCKED"].includes(status)) throw new Error("Escolha uma situação válida.");

  const capacity = capacityValue === "" ? null : Number(capacityValue);
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 0)) {
    throw new Error("O limite de encomendas deve ser um número igual ou maior que zero.");
  }

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
  redirect(`/admin/agenda?month=${date.slice(0, 7)}&selected=${date}&saved=1`);
}

