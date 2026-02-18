import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import type { Enrollment } from "../../types/enrollment";

interface Props {
  data: Enrollment[];
  onEdit: (row: Enrollment) => void;
  onDelete: (id: number) => void;
  sorts: { field: string; dir: "asc" | "desc" }[];
  onSort: (field: string) => void;
}

export default function EnrollmentTable({
  data,
  onEdit,
  onDelete,
  sorts,
  onSort,
}: Props) {
  const renderSortIcon = (field: string) => {
    const index = sorts.findIndex((s) => s.field === field);
    if (index === -1)
      return <FaSort className="inline ml-2 text-gray-400 text-sm" />;

    const dir = sorts[index].dir;

    return dir === "asc" ? (
      <FaSortUp className="inline ml-2 text-hijau text-sm" />
    ) : (
      <FaSortDown className="inline ml-2 text-hijau text-sm" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="p-4 text-left cursor-pointer select-none hover:text-hijau"
              onClick={() => onSort("students.nim")}
            >
              NIM {renderSortIcon("students.nim")}
            </th>

            <th
              className="p-4 text-left cursor-pointer select-none hover:text-hijau"
              onClick={() => onSort("students.name")}
            >
              Name {renderSortIcon("students.name")}
            </th>

            <th
              className="p-4 text-left cursor-pointer select-none hover:text-hijau"
              onClick={() => onSort("courses.code")}
            >
              Course {renderSortIcon("courses.code")}
            </th>

            <th className="p-4 text-left">Semester</th>

            <th
              className="p-4 text-left cursor-pointer select-none hover:text-hijau"
              onClick={() => onSort("enrollments.status")}
            >
              Status {renderSortIcon("enrollments.status")}
            </th>

            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{row.nim}</td>
              <td className="p-4">{row.student_name}</td>
              <td className="p-4">{row.course_code}</td>
              <td className="p-4">{row.semester}</td>
              <td className="p-4">{row.status}</td>
              <td className="p-4 space-x-2">
                <button
                  onClick={() => onEdit(row)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(row.id)}
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
  );
}
