"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateQuoteStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"].includes(status)) {
    throw new Error("Solicitação inválida.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
}
