import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  editData: any;
  refresh: () => void;
}

export default function CourseModal({
  open,
  onClose,
  editData,
  refresh,
}: Props) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    credits: 3,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        code: "",
        name: "",
        credits: 3,
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setErrors({});

      if (editData) {
        await api.put(`/courses/${editData.id}`, form);
      } else {
        await api.post("/courses", form);
      }

      refresh();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="bg-white w-[500px] p-6 rounded-xl space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit Course" : "Add Course"}
        </h2>

        <div>
          <input
            placeholder="Course Code"
            className="border w-full p-2 rounded"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code[0]}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Course Name"
            className="border w-full p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Credits"
            className="border w-full p-2 rounded"
            value={form.credits}
            onChange={(e) =>
              setForm({ ...form, credits: Number(e.target.value) })
            }
          />
          {errors.credits && (
            <p className="text-red-500 text-sm">{errors.credits[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
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
