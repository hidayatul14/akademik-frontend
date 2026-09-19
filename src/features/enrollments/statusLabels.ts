import type { Enrollment } from "../../types/enrollment";

export const statusLabels: Record<Enrollment["status"], string> = {
  DRAFT: "Draf",
  SUBMITTED: "Diajukan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};
