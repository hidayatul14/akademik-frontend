import { Search, SlidersHorizontal, X } from "lucide-react";

interface EnrollmentFiltersProps {
  advancedFilterCount: number;
  search: string;
  status: string;
  semester: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onClear: () => void;
  onOpenAdvancedFilters: () => void;
}

export default function EnrollmentFilters({
  advancedFilterCount,
  search,
  status,
  semester,
  onSearchChange,
  onStatusChange,
  onSemesterChange,
  onClear,
  onOpenAdvancedFilters,
}: EnrollmentFiltersProps) {
  const hasFilters = Boolean(search || status || semester || advancedFilterCount);

  return (
    <section aria-label="Pencarian dan filter KRS" className="mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-1">
        <p className="text-sm font-semibold text-slate-900">Pencarian dan filter</p>
        <p className="text-xs text-slate-500">Pencarian diproses di server</p>
      </div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Cari data KRS</span>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            placeholder="Cari NIM, nama mahasiswa, atau kode MK..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-hijau focus:bg-white focus:ring-2 focus:ring-green-100"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label>
            <span className="sr-only">Filter berdasarkan status</span>
            <select
              value={status}
              className="h-11 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100"
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="">Semua status</option>
              <option value="DRAFT">Draf</option>
              <option value="SUBMITTED">Diajukan</option>
              <option value="APPROVED">Disetujui</option>
              <option value="REJECTED">Ditolak</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filter berdasarkan semester</span>
            <select
              value={semester}
              className="h-11 min-w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100"
              onChange={(event) => onSemesterChange(event.target.value)}
            >
              <option value="">Semua semester</option>
              <option value="GANJIL">Ganjil</option>
              <option value="GENAP">Genap</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onOpenAdvancedFilters}
            className="relative inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter Lanjutan
            {advancedFilterCount > 0 && <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{advancedFilterCount}</span>}
          </button>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
            Bersihkan
          </button>
        </div>
      </div>
    </section>
  );
}
