"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createQuoteRequest(formData: FormData) {
  const requestedDate = textValue(formData, "requested_date");
  const customerName = textValue(formData, "customer_name");
  const customerPhone = textValue(formData, "customer_phone");
  const message = textValue(formData, "message");
  const creationId = textValue(formData, "creation_id");
  const guestValue = textValue(formData, "guest_count");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    redirect("/?quote=invalid#orcamento");
  }
  if (customerName.length < 2 || customerName.length > 120) {
    redirect("/?quote=invalid#orcamento");
  }
  if (customerPhone.length < 8 || customerPhone.length > 40) {
    redirect("/?quote=invalid#orcamento");
  }
  if (message.length > 2000) {
    redirect("/?quote=invalid#orcamento");
  }

  const guestCount = guestValue === "" ? null : Number(guestValue);
  if (guestCount !== null && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 1000)) {
    redirect("/?quote=invalid#orcamento");
  }

  const supabase = await createClient();

  const { data: availability } = await supabase
    .from("availability_calendar")
    .select("status")
    .eq("date", requestedDate)
    .maybeSingle();

  if (availability?.status === "BLOCKED") {
    redirect("/?quote=blocked#orcamento");
  }

  let validCreationId: string | null = null;
  if (creationId) {
    const { data: creation } = await supabase
      .from("creations")
      .select("id")
      .eq("id", creationId)
      .eq("is_published", true)
      .maybeSingle();
    validCreationId = creation?.id ?? null;
  }

  const { error } = await supabase.from("quote_requests").insert({
    requested_date: requestedDate,
    creation_id: validCreationId,
    customer_name: customerName,
    customer_phone: customerPhone,
    guest_count: guestCount,
    message: message || null,
    source: "website"
  });

  if (error) {
    console.error("Failed to create quote request:", error);
    redirect("/?quote=error#orcamento");
  }

  redirect("/?quote=success#orcamento");
}

