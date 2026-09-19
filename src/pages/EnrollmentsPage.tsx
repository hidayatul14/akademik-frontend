import { useState } from "react";
import { Download, Plus } from "lucide-react";
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
      setToast({ id: Date.now(), type: "success", message: "Enrollment deleted successfully." });
      refresh();
    } catch {
      setToast({ id: Date.now(), type: "error", message: "The enrollment could not be deleted. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const exportUrl = buildEnrollmentExportUrl(api.defaults.baseURL ?? "", {
      advancedFilters,
      filterLogic,
      search,
      semester: semesterFilter,
      sorts,
      status: statusFilter,
    });
    window.open(exportUrl, "_blank", "noopener,noreferrer");
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
      <PageHeader title="KRS Management" breadcrumb="Academic Operations / Enrollments" description="Review, filter, and manage course registrations across the active academic period." />

      <EnrollmentFilters
        advancedFilterCount={advancedFilters.length}
        search={search}
        status={statusFilter}
        semester={semesterFilter}
        onSearchChange={(value) => { setSearch(value); resetToFirstPage(); }}
        onStatusChange={(value) => { setStatusFilter(value); resetToFirstPage(); }}
        onSemesterChange={(value) => { setSemesterFilter(value); resetToFirstPage(); }}
        onClear={() => { setSearch(""); setStatusFilter(""); setSemesterFilter(""); setAdvancedFilters([]); setFilterLogic("AND"); resetToFirstPage(); }}
        onOpenAdvancedFilters={() => setFilterDrawerOpen(true)}
      />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Enrollment records</h2>
          <p className="mt-1 text-sm text-gray-500">Manage course registrations and academic status in one place.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button type="button" onClick={() => setOpenModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-hijau px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">
            <Plus className="h-4 w-4" /> Add enrollment
          </button>
        </div>
      </div>

      <EnrollmentTable data={data} error={error} loading={loading} onEdit={(row) => { setEditData(row); setOpenModal(true); }} onDelete={setDeleteTarget} sorts={sorts} onSort={toggleSort} onRetry={refresh} />
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

      <ConfirmDialog open={deleteTarget !== null} busy={deleting} title="Delete enrollment?" description="This removes the KRS record from active data. Student and course master data will remain available." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
