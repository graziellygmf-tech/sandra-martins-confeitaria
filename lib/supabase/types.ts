import type { Database } from "@/types/database";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Creation = Tables<"creations">;
export type Category = Tables<"categories">;
export type CreationImage = Tables<"creation_images">;
export type AvailabilityDay = Tables<"availability_days">;
export type PublicAvailabilityDay = Pick<AvailabilityDay, "date" | "status">;
export type AdminAvailabilityDay = Pick<AvailabilityDay, "date" | "status" | "capacity" | "notes">;
export type QuoteRequest = Tables<"quote_requests">;

