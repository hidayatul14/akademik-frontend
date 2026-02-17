import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Enrollment } from "../../types/enrollment";

interface Props {
  open: boolean;
  onClose: () => void;
  editData: Enrollment | null;
  refresh: () => void;
}

export default function EnrollmentModal({
  open,
  onClose,
  editData,
  refresh,
}: Props) {
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [useExistingCourse, setUseExistingCourse] = useState(false);

  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState<any>({
    student_id: "",
    course_id: "",
    nim: "",
    student_name: "",
    email: "",
    course_code: "",
    course_name: "",
    credits: 3,
    academic_year: "2025/2026",
    semester: "GANJIL",
    status: "DRAFT",
  });

  /* ==============================
     FETCH EXISTING DATA
  ============================== */

  useEffect(() => {
    if (useExistingStudent) {
      api.get("/students").then((res) => {
        setStudents(res.data.data ?? res.data);
      });
    }
  }, [useExistingStudent]);

  useEffect(() => {
    if (useExistingCourse) {
      api.get("/courses").then((res) => {
        setCourses(res.data.data ?? res.data);
      });
    }
  }, [useExistingCourse]);

  /* ==============================
     PREFILL EDIT
  ============================== */

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
      });
    }
  }, [editData]);

  if (!open) return null;

  /* ==============================
     SUBMIT
  ============================== */

  const handleSubmit = async () => {
    try {
      setErrors({}); // reset error sebelum submit

      if (editData) {
        await api.put(`/enrollments/${editData.id}`, form);
      } else {
        await api.post("/enrollments", form);
      }

      refresh();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="bg-white w-[700px] p-6 rounded-xl space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold">
          {editData ? "Edit Enrollment" : "Create Enrollment"}
        </h2>

        {/* ========================= STUDENT SECTION ========================= */}

        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Student</h3>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useExistingStudent}
              onChange={() => setUseExistingStudent(!useExistingStudent)}
            />
            Use Existing Student
          </label>

          {useExistingStudent ? (
            <select
              className="border w-full p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, student_id: Number(e.target.value) })
              }
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nim} - {s.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                placeholder="NIM"
                className="border w-full p-2 rounded"
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
              />
              {errors.nim && (
                <p className="text-red-500 text-sm mt-1">{errors.nim[0]}</p>
              )}

              <input
                placeholder="Student Name"
                className="border w-full p-2 rounded"
                value={form.student_name}
                onChange={(e) =>
                  setForm({ ...form, student_name: e.target.value })
                }
              />
              {errors.student_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.student_name[0]}
                </p>
              )}

              <input
                placeholder="Email"
                className="border w-full p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </>
          )}
        </div>

        {/* ========================= COURSE SECTION ========================= */}

        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Course</h3>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useExistingCourse}
              onChange={() => setUseExistingCourse(!useExistingCourse)}
            />
            Use Existing Course
          </label>

          {useExistingCourse ? (
            <select
              className="border w-full p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, course_id: Number(e.target.value) })
              }
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                placeholder="Course Code"
                className="border w-full p-2 rounded"
                value={form.course_code}
                onChange={(e) =>
                  setForm({ ...form, course_code: e.target.value })
                }
              />
              {errors.course_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.course_code[0]}
                </p>
              )}

              <input
                placeholder="Course Name"
                className="border w-full p-2 rounded"
                value={form.course_name}
                onChange={(e) =>
                  setForm({ ...form, course_name: e.target.value })
                }
              />
              {errors.course_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.course_name[0]}
                </p>
              )}

              <input
                type="number"
                placeholder="Credits"
                className="border w-full p-2 rounded"
                value={form.credits}
                onChange={(e) =>
                  setForm({ ...form, credits: Number(e.target.value) })
                }
              />
            </>
          )}
        </div>

        {/* ========================= ACADEMIC SECTION ========================= */}

        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Academic Info</h3>

          <input
            placeholder="Academic Year"
            className="border w-full p-2 rounded"
            value={form.academic_year}
            onChange={(e) =>
              setForm({ ...form, academic_year: e.target.value })
            }
          />

          <select
            className="border w-full p-2 rounded"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          >
            <option value="GANJIL">GANJIL</option>
            <option value="GENAP">GENAP</option>
          </select>

          <select
            className="border w-full p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        {/* ========================= BUTTON ========================= */}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-hijau text-white rounded hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
