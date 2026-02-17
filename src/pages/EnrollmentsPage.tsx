import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Enrollment } from "../types/enrollment";
import PageHeader from "../components/PageHeader";

import EnrollmentTable from "../components/enrollments/EnrollmentTable";
import EnrollmentModal from "../components/enrollments/EnrollmentModal";
import EnrollmentFilters from "../components/enrollments/EnrollmentFilters";
import EnrollmentPagination from "../components/enrollments/EnrollmentPagination";

export default function EnrollmentsPage() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<Enrollment | null>(null);

  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [useExistingCourse, setUseExistingCourse] = useState(false);

  const fetchData = async () => {
    const res = await api.get("/enrollments", {
      params: {
        page,
        search,
        filters: [
          ...(statusFilter
            ? [
                {
                  field: "enrollments.status",
                  operator: "equal",
                  value: statusFilter,
                },
              ]
            : []),
          ...(semesterFilter
            ? [
                {
                  field: "enrollments.semester",
                  operator: "equal",
                  value: semesterFilter,
                },
              ]
            : []),
        ],
      },
    });

    setData(res.data.data);
    setPagination(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [page, search, statusFilter, semesterFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/enrollments/${id}`);
    fetchData();
  };

  const handleExport = () => {
    window.open("http://127.0.0.1:8000/api/enrollments/export", "_blank");
  };

  return (
    <div>
      <PageHeader title="Enrollments" breadcrumb="Dashboard / Enrollments" />

      <EnrollmentFilters
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        setSemesterFilter={setSemesterFilter}
      />

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Enrollments List</h2>

        <div className="space-x-3">
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-hijau text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Add Enrollment
          </button>
        </div>
      </div>

      <EnrollmentTable
        data={data}
        onEdit={(row) => {
          setEditData(row);
          setOpenModal(true);
        }}
        onDelete={handleDelete}
      />

      <EnrollmentPagination
        pagination={pagination}
        page={page}
        setPage={setPage}
      />

      <EnrollmentModal
        open={openModal}
        editData={editData}
        onClose={() => {
          setOpenModal(false);
          setEditData(null);
        }}
        refresh={fetchData}
      />
    </div>
  );
}
