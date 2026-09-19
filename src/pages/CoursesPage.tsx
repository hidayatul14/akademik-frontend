import { useEffect, useState } from "react";
import { Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import api from "../api/axios";
import CourseModal from "../components/courses/CourseModal";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import MasterDataPagination from "../components/ui/MasterDataPagination";
import Toast from "../components/ui/Toast";
import useAutoDismissToast from "../hooks/useAutoDismissToast";
import useDebouncedValue from "../hooks/useDebouncedValue";
import type { Course, PaginatedResponse } from "../types/catalog";

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Course> | null>(null);
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editData, setEditData] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, setToast } = useAutoDismissToast();

  useEffect(() => setPage(1), [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get<PaginatedResponse<Course>>("/courses", {
          signal: controller.signal,
          params: { search: query || undefined, page },
        });
        setData(response.data.data);
        setPagination(response.data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCourses();
    return () => controller.abort();
  }, [page, query, refreshKey]);

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSaved = (message: string) => {
    closeModal();
    setToast({ id: Date.now(), type: "success", message });
    setRefreshKey((value) => value + 1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/courses/${deleteTarget.id}`);
      setDeleteTarget(null);
      setToast({ id: Date.now(), type: "success", message: "Mata kuliah berhasil dihapus." });
      setRefreshKey((value) => value + 1);
    } catch {
      setToast({ id: Date.now(), type: "error", message: "Mata kuliah tidak dapat dihapus karena masih digunakan pada KRS." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Mata Kuliah"
        breadcrumb="Data Induk / Mata Kuliah"
        description="Kelola daftar mata kuliah yang digunakan saat membuat KRS."
        actions={<button type="button" onClick={() => setModalOpen(true)} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"><Plus className="h-4 w-4" /> Tambah Mata Kuliah</button>}
      />

      <section aria-label="Pencarian mata kuliah" className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Cari mata kuliah</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kode atau nama mata kuliah..." className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
        </label>
        {!loading && !error && <p className="text-sm text-slate-500">{pagination?.total.toLocaleString("id-ID") ?? 0} mata kuliah</p>}
      </section>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50">
              <tr>
                {["Kode MK", "Nama Mata Kuliah", "SKS"].map((label) => <th key={label} className="border-b border-slate-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</th>)}
                <th className="border-b border-slate-200 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && Array.from({ length: 6 }).map((_, row) => <tr key={row}>{Array.from({ length: 4 }).map((__, cell) => <td key={cell} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>)}</tr>)}
              {!loading && !error && data.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-sm font-medium text-slate-900">{course.code}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">{course.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{course.credits} SKS</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" onClick={() => { setEditData(course); setModalOpen(true); }} aria-label={`Ubah ${course.name}`} className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(course)} aria-label={`Hapus ${course.name}`} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (error || data.length === 0) && <EmptyState error={error} />}
      </div>

      <MasterDataPagination pagination={pagination} loading={loading} onPageChange={setPage} />
      {modalOpen && <CourseModal editData={editData} onClose={closeModal} onSuccess={handleSaved} />}
      <ConfirmDialog open={Boolean(deleteTarget)} busy={deleting} title="Hapus mata kuliah?" description="Mata kuliah yang masih digunakan dalam data KRS tidak dapat dihapus. Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus Mata Kuliah" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function EmptyState({ error }: { error: boolean }) {
  return <div className="grid min-h-64 place-items-center p-6 text-center"><div><Inbox className="mx-auto h-7 w-7 text-slate-400" /><h3 className="mt-3 font-semibold text-slate-900">{error ? "Data mata kuliah gagal dimuat" : "Mata kuliah tidak ditemukan"}</h3><p className="mt-1 text-sm text-slate-500">{error ? "Periksa koneksi API lalu coba lagi." : "Ubah kata pencarian atau tambahkan mata kuliah baru."}</p></div></div>;
}
