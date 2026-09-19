import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EnrollmentPagination as PaginationData } from "../../types/enrollment";

interface Props {
  disabled?: boolean;
  pagination: PaginationData | null;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function EnrollmentPagination({ disabled, pagination, page, pageSize, onPageChange, onPageSizeChange }: Props) {
  if (!pagination) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(pagination.last_page, start + 4);
  const pages = Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-gray-500">
        <span>Menampilkan <strong className="text-gray-800">{pagination.from ?? 0}–{pagination.to ?? 0}</strong> dari <strong className="text-gray-800">{pagination.total.toLocaleString("id-ID")}</strong> data</span>
        <label className="flex items-center gap-2">
          Baris per halaman
          <select value={pageSize} disabled={disabled} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="rounded-md border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
            {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>

      <nav aria-label="Halaman data KRS" className="flex items-center gap-1">
        <button type="button" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Halaman sebelumnya" className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        {pages.map((pageNumber) => (
          <button key={pageNumber} type="button" disabled={disabled} onClick={() => onPageChange(pageNumber)} aria-current={pageNumber === page ? "page" : undefined} className={`min-w-9 rounded-md px-3 py-2 font-medium transition ${pageNumber === page ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {pageNumber}
          </button>
        ))}
        <button type="button" disabled={disabled || page >= pagination.last_page} onClick={() => onPageChange(page + 1)} aria-label="Halaman berikutnya" className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </nav>
    </div>
  );
}
