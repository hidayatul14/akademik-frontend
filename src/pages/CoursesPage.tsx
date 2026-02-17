import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";

export default function CoursesPage() {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const res = await api.get("/courses", {
      params: {
        search,
        page,
      },
    });

    setData(res.data.data);
    setPagination(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [search, page]);

  return (
    <div>
      <PageHeader
        title="Courses"
        breadcrumb="Dashboard / Courses"
      />

      {/* SEARCH */}
      <div className="mt-6">
        <input
          placeholder="Search Code / Name"
          className="border px-4 py-2 rounded-lg w-80"
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Credits</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{row.code}</td>
                <td className="p-4">{row.name}</td>
                <td className="p-4">{row.credits}</td>
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
