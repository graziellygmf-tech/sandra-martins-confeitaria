export type AvailabilityStatus = "AVAILABLE" | "LIMITED" | "BLOCKED" | "UNKNOWN";

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Disponível",
  LIMITED: "Poucas vagas",
  BLOCKED: "Indisponível",
  UNKNOWN: "Consulte"
};

// The full date cell uses the same color in the customer and admin calendars.
export const availabilityCellClasses: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-[#e5efe4] text-[#314631] hover:bg-[#dbe9d9]",
  LIMITED: "bg-[#fbf0d9] text-[#6b4e1f] hover:bg-[#f6e6c4]",
  BLOCKED: "bg-[#f1dfdc] text-[#744a45] hover:bg-[#ead2ce]",
  UNKNOWN: "bg-[#eeeae4] text-[#625d57] hover:bg-[#e4dfd7]"
};

