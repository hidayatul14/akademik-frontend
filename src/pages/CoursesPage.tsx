import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import CourseModal from "../components/courses/CourseModal";

export default function CoursesPage() {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

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

  const handleEdit = (row: any) => {
    setEditData(row);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure want to delete this course?")) return;

    await api.delete(`/courses/${id}`);
    fetchData();
  };

  return (
    <div>
      <PageHeader
        title="Courses"
        breadcrumb="Dashboard / Courses"
      />

      {/* SEARCH + ADD BUTTON */}
      <div className="mt-6 flex justify-between items-center">
        <input
          placeholder="Search Code / Name"
          className="border px-4 py-2 rounded-lg w-80"
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="bg-hijau text-white px-4 py-2 rounded-lg"
        >
          + Add Course
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Credits</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{row.code}</td>
                <td className="p-4">{row.name}</td>
                <td className="p-4">{row.credits}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(row.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
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

      {/* MODAL */}
      <CourseModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditData(null);
        }}
        editData={editData}
        refresh={fetchData}
      />
    </div>
  );
}
