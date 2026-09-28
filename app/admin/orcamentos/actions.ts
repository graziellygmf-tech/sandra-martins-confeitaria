"use server";

import { requireAdmin } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";

export async function updateQuoteStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"].includes(status)) {
    throw new Error("Solicitação inválida.");
  }

  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
}
