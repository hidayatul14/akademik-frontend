import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Enrollment } from "../types/enrollment";
import PageHeader from "../components/PageHeader";

export default function EnrollmentsPage() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const fetchData = async () => {
    const res = await api.get("/enrollments", {
      params: {
        page,
        page_size: pageSize,
        search,
        filters: [
          ...(statusFilter
            ? [{ field: "enrollments.status", operator: "equal", value: statusFilter }]
            : []),
          ...(semesterFilter
            ? [{ field: "enrollments.semester", operator: "equal", value: semesterFilter }]
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

  const handleExport = () => {
    window.open("http://127.0.0.1:8000/api/enrollments/export", "_blank");
  };

  return (
    <div>
      <PageHeader
        title="Enrollments"
        breadcrumb="Dashboard / Enrollments"
        buttonLabel="Export CSV"
      />

      {/* FILTER */}
      <div className="flex gap-4 mt-6">
        <input
          placeholder="Search NIM / Name"
          className="border px-4 py-2 rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="DRAFT">DRAFT</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <select
          className="border px-4 py-2 rounded-lg"
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="">All Semester</option>
          <option value="GANJIL">GANJIL</option>
          <option value="GENAP">GENAP</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">NIM</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Course</th>
              <th className="p-4 text-left">Semester</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{row.nim}</td>
                <td className="p-4">{row.student_name}</td>
                <td className="p-4">{row.course_code}</td>
                <td className="p-4">{row.semester}</td>
                <td className="p-4 font-medium">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {pagination.current_page}
          </span>

          <button
            disabled={!pagination.next_page_url}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
