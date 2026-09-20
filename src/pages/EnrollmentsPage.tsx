import { useState } from "react";
import { Download, Plus, X } from "lucide-react";
import api from "../api/axios";
import type { Enrollment, EnrollmentFilter, EnrollmentSort } from "../types/enrollment";
import PageHeader from "../components/PageHeader";
import EnrollmentTable from "../components/enrollments/EnrollmentTable";
import EnrollmentModal from "../components/enrollments/EnrollmentModal";
import EnrollmentFilters from "../components/enrollments/EnrollmentFilters";
import EnrollmentPagination from "../components/enrollments/EnrollmentPagination";
import AdvancedFilterDrawer from "../components/enrollments/AdvancedFilterDrawer";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";
import { buildEnrollmentExportUrl } from "../features/enrollments/enrollmentQuery";
import useEnrollmentData from "../features/enrollments/useEnrollmentData";
import useAutoDismissToast from "../hooks/useAutoDismissToast";
import useDebouncedValue from "../hooks/useDebouncedValue";

const numberFormatter = new Intl.NumberFormat("id-ID");

export default function EnrollmentsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [statusFilter, setStatusFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sorts, setSorts] = useState<EnrollmentSort[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<EnrollmentFilter[]>([]);
  const [filterLogic, setFilterLogic] = useState<"AND" | "OR">("AND");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<Enrollment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const hasActiveFilters = Boolean(search || statusFilter || semesterFilter || advancedFilters.length);
  const { toast, setToast } = useAutoDismissToast();
  const { data, error, loading, pagination } = useEnrollmentData({
    advancedFilters,
    filterLogic,
    page,
    pageSize,
    refreshKey,
    search: debouncedSearch,
    semester: semesterFilter,
    sorts,
    status: statusFilter,
  });

  const resetToFirstPage = () => setPage(1);
  const refresh = () => setRefreshKey((current) => current + 1);

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await api.delete(`/enrollments/${deleteTarget}`);
      setDeleteTarget(null);
      setToast({ id: Date.now(), type: "success", message: "Data KRS berhasil dihapus." });
      refresh();
    } catch {
      setToast({ id: Date.now(), type: "error", message: "Data KRS gagal dihapus. Silakan coba lagi." });
    } finally {
      setDeleting(false);
    }
  };

  const exportUrl = buildEnrollmentExportUrl(api.defaults.baseURL ?? "", {
    advancedFilters,
    filterLogic,
    search,
    semester: semesterFilter,
    sorts,
    status: statusFilter,
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setSemesterFilter("");
    setAdvancedFilters([]);
    setFilterLogic("AND");
    resetToFirstPage();
  };

  const toggleSort = (field: string) => {
    setSorts((current) => {
      const existing = current.find((sort) => sort.field === field);
      if (!existing) return [...current, { field, dir: "asc" }];
      if (existing.dir === "asc") return current.map((sort) => sort.field === field ? { ...sort, dir: "desc" } : sort);
      return current.filter((sort) => sort.field !== field);
    });
    resetToFirstPage();
  };

  return (
    <div>
      <PageHeader
        title="Pengelolaan KRS"
        breadcrumb="Akademik / KRS"
        description="Tinjau pengambilan mata kuliah, kelola status, dan temukan data yang dibutuhkan."
        actions={
          <>
            <a href={exportUrl} target="_blank" rel="noopener noreferrer" onClick={() => setExportNotice(true)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:flex-none">
              <Download className="h-4 w-4" /> Ekspor CSV
            </a>
            <button type="button" onClick={() => setOpenModal(true)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:flex-none">
              <Plus className="h-4 w-4" /> Tambah KRS
            </button>
          </>
        }
      />

      {exportNotice && (
        <div role="status" className="mt-5 flex items-start justify-between gap-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <p>Permintaan ekspor dibuka di tab baru. Untuk data besar, unduhan dapat memakan waktu; Anda tetap bisa menggunakan halaman ini. Jika gagal, periksa tab unduhan atau coba lagi.</p>
          <button type="button" onClick={() => setExportNotice(false)} aria-label="Tutup informasi ekspor" className="shrink-0 rounded p-0.5 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      <EnrollmentFilters
        advancedFilterCount={advancedFilters.length}
        search={search}
        status={statusFilter}
        semester={semesterFilter}
        onSearchChange={(value) => { setSearch(value); resetToFirstPage(); }}
        onStatusChange={(value) => { setStatusFilter(value); resetToFirstPage(); }}
        onSemesterChange={(value) => { setSemesterFilter(value); resetToFirstPage(); }}
        onClear={clearFilters}
        onOpenAdvancedFilters={() => setFilterDrawerOpen(true)}
      />

      <div className="mt-7 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-poppins text-lg font-semibold text-slate-950">{hasActiveFilters ? "Hasil pencarian" : "Daftar KRS"}</h2>
          <p className="mt-1 text-sm text-slate-500">{loading ? "Memuat data..." : error ? "Data belum dapat dimuat." : `${numberFormatter.format(pagination?.total ?? 0)} data ditemukan${hasActiveFilters ? " berdasarkan filter aktif" : ""}.`}</p>
        </div>
      </div>

      <EnrollmentTable data={data} error={error} loading={loading} hasFilters={hasActiveFilters} onClearFilters={clearFilters} onEdit={(row) => { setEditData(row); setOpenModal(true); }} onDelete={setDeleteTarget} sorts={sorts} onSort={toggleSort} onRetry={refresh} />
      <EnrollmentPagination pagination={pagination} page={page} pageSize={pageSize} disabled={loading} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); resetToFirstPage(); }} />

      {openModal && <EnrollmentModal editData={editData} onClose={() => { setOpenModal(false); setEditData(null); }} onSuccess={(message) => { setOpenModal(false); setEditData(null); setToast({ id: Date.now(), type: "success", message }); refresh(); }} />}

      {filterDrawerOpen && (
        <AdvancedFilterDrawer
          filters={advancedFilters}
          logic={filterLogic}
          onClose={() => setFilterDrawerOpen(false)}
          onApply={(filters, logic) => {
            setAdvancedFilters(filters);
            setFilterLogic(logic);
            resetToFirstPage();
            setFilterDrawerOpen(false);
          }}
        />
      )}

      <ConfirmDialog open={deleteTarget !== null} busy={deleting} title="Hapus data KRS?" description="Data KRS akan dihapus dari daftar aktif. Data mahasiswa dan mata kuliah tetap tersimpan." confirmLabel="Hapus KRS" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
