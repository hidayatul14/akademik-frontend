import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Enrollment } from "../types/enrollment";

export default function EnrollmentsPage() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("enrollments.id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const pageSize = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/enrollments", {
        params: {
          page: page,
          page_size: pageSize,
          search: search,
          sort_by: sortBy,
          sort_dir: sortDir,
          filters: statusFilter
            ? [
                {
                  field: "enrollments.status",
                  operator: "equal",
                  value: statusFilter,
                },
              ]
            : [],
        },
      });

      setData(res.data.data);
      setPagination(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, statusFilter, sortBy, sortDir]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleExport = () => {
    window.open("http://127.0.0.1:8000/api/enrollments/export", "_blank");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data KRS</h1>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari NIM / Nama..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">DRAFT</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading data...
          </div>
        )}

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("students.nim")}
              >
                NIM
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("students.name")}
              >
                Nama
              </th>
              <th className="p-4">Kode MK</th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("enrollments.status")}
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-4">{row.nim}</td>
                <td className="p-4">{row.student_name}</td>
                <td className="p-4">{row.course_code}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      row.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : row.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : row.status === "SUBMITTED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span>
            Page {pagination.current_page}
          </span>

          <button
            disabled={!pagination.next_page_url}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
