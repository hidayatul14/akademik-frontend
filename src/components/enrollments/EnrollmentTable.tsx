import type { Enrollment } from "../../types/enrollment";

export default function EnrollmentTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Enrollment[];
  onEdit: (row: Enrollment) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">NIM</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Semester</th>
            <th className="p-4 text-left">Status</th>
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
