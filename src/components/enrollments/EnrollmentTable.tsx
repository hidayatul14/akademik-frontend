import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Inbox, Pencil, Trash2 } from "lucide-react";
import type { Enrollment, EnrollmentSort } from "../../types/enrollment";
import { statusLabels } from "../../features/enrollments/statusLabels";

interface Props {
  data: Enrollment[];
  error: string | null;
  loading: boolean;
  sorts: EnrollmentSort[];
  onDelete: (id: number) => void;
  onEdit: (row: Enrollment) => void;
  onRetry: () => void;
  onSort: (field: string) => void;
}

const columns = [
  { field: "student_nim", label: "NIM" },
  { field: "student_name", label: "Mahasiswa" },
  { field: "course_code", label: "Kode MK" },
  { field: "course_name", label: "Mata Kuliah" },
  { field: "academic_year", label: "Tahun Ajaran" },
  { field: "semester", label: "Semester" },
  { field: "status", label: "Status" },
];

const statusClasses: Record<Enrollment["status"], string> = {
  DRAFT: "bg-gray-100 text-gray-700 ring-gray-200",
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

export default function EnrollmentTable({ data, error, loading, sorts, onDelete, onEdit, onRetry, onSort }: Props) {
  const sortState = (field: string) => {
    const index = sorts.findIndex((sort) => sort.field === field);
    return index === -1 ? null : { ...sorts[index], priority: index + 1 };
  };

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => {
                const activeSort = sortState(column.field);
                return (
                  <th key={column.field} scope="col" className="border-b border-gray-200 px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => onSort(column.field)}
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 transition hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hijau"
                      aria-label={`Urutkan berdasarkan ${column.label}`}
                    >
                      {column.label}
                      {activeSort?.dir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 text-hijau" />
                      ) : activeSort?.dir === "desc" ? (
                        <ArrowDown className="h-3.5 w-3.5 text-hijau" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500" />
                      )}
                      {activeSort && sorts.length > 1 && (
                        <span className="rounded bg-green-50 px-1 text-[10px] text-hijau">{activeSort.priority}</span>
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="border-b border-gray-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && Array.from({ length: 7 }).map((_, row) => (
              <tr key={row} aria-hidden="true">
                {Array.from({ length: 8 }).map((__, cell) => (
                  <td key={cell} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-gray-100" /></td>
                ))}
              </tr>
            ))}

            {!loading && !error && data.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-emerald-50/30">
                <td className="whitespace-nowrap px-4 py-4 font-mono text-sm font-medium text-gray-900">{row.nim}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-800">{row.student_name}</td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-sm text-gray-700">{row.course_code}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{row.course_name}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{row.academic_year}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{row.semester}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[row.status]}`}>
                    {statusLabels[row.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <div className="inline-flex gap-1">
                    <button type="button" onClick={() => onEdit(row)} aria-label={`Ubah KRS mahasiswa ${row.nim}`} className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(row.id)} aria-label={`Hapus KRS mahasiswa ${row.nim}`} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && error && (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <span className="rounded-full bg-red-50 p-3 text-red-600"><AlertCircle className="h-6 w-6" /></span>
          <h3 className="mt-4 font-semibold text-gray-900">Data KRS gagal dimuat</h3>
          <p className="mt-1 max-w-md text-sm text-gray-500">{error}</p>
          <button type="button" onClick={onRetry} className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">Coba lagi</button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <span className="rounded-full bg-gray-100 p-3 text-gray-500"><Inbox className="h-6 w-6" /></span>
          <h3 className="mt-4 font-semibold text-gray-900">Data KRS tidak ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500">Ubah pencarian atau filter, atau tambahkan KRS baru.</p>
        </div>
      )}
    </div>
  );
}
