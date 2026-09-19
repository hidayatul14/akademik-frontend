import { useEffect, useState } from "react";
import { Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import StudentModal from "../components/students/StudentModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import MasterDataPagination from "../components/ui/MasterDataPagination";
import Toast from "../components/ui/Toast";
import useAutoDismissToast from "../hooks/useAutoDismissToast";
import useDebouncedValue from "../hooks/useDebouncedValue";
import type { PaginatedResponse, Student } from "../types/catalog";

export default function StudentsPage() {
  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Student> | null>(null);
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editData, setEditData] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, setToast } = useAutoDismissToast();

  useEffect(() => setPage(1), [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get<PaginatedResponse<Student>>("/students", {
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

    void loadStudents();
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
      await api.delete(`/students/${deleteTarget.id}`);
      setDeleteTarget(null);
      setToast({ id: Date.now(), type: "success", message: "Data mahasiswa berhasil dihapus." });
      setRefreshKey((value) => value + 1);
    } catch {
      setToast({ id: Date.now(), type: "error", message: "Data mahasiswa tidak dapat dihapus karena masih digunakan pada KRS." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Mahasiswa"
        breadcrumb="Data Induk / Mahasiswa"
        description="Kelola identitas dan informasi kontak mahasiswa yang digunakan dalam data KRS."
        actions={<button type="button" onClick={() => setModalOpen(true)} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"><Plus className="h-4 w-4" /> Tambah Mahasiswa</button>}
      />

      <section aria-label="Pencarian mahasiswa" className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Cari mahasiswa</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari NIM, nama, atau email..." className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
        </label>
        {!loading && !error && <p className="text-sm text-slate-500">{pagination?.total.toLocaleString("id-ID") ?? 0} mahasiswa</p>}
      </section>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr>
                {["NIM", "Nama Mahasiswa", "Email"].map((label) => <th key={label} className="border-b border-slate-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</th>)}
                <th className="border-b border-slate-200 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && Array.from({ length: 6 }).map((_, row) => <tr key={row}>{Array.from({ length: 4 }).map((__, cell) => <td key={cell} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>)}</tr>)}
              {!loading && !error && data.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-sm font-medium text-slate-900">{student.nim}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">{student.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{student.email}</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" onClick={() => { setEditData(student); setModalOpen(true); }} aria-label={`Ubah ${student.name}`} className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setDeleteTarget(student)} aria-label={`Hapus ${student.name}`} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (error || data.length === 0) && <EmptyState error={error} />}
      </div>

      <MasterDataPagination pagination={pagination} loading={loading} onPageChange={setPage} />
      {modalOpen && <StudentModal editData={editData} onClose={closeModal} onSuccess={handleSaved} />}
      <ConfirmDialog open={Boolean(deleteTarget)} busy={deleting} title="Hapus mahasiswa?" description="Mahasiswa yang masih digunakan dalam data KRS tidak dapat dihapus. Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus Mahasiswa" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function EmptyState({ error }: { error: boolean }) {
  return <div className="grid min-h-64 place-items-center p-6 text-center"><div><Inbox className="mx-auto h-7 w-7 text-slate-400" /><h3 className="mt-3 font-semibold text-slate-900">{error ? "Data mahasiswa gagal dimuat" : "Mahasiswa tidak ditemukan"}</h3><p className="mt-1 text-sm text-slate-500">{error ? "Periksa koneksi API lalu coba lagi." : "Ubah kata pencarian atau tambahkan mahasiswa baru."}</p></div></div>;
}
