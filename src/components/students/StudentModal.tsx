import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StudentModal({
  open,
  onClose,
  editData,
  refresh,
}: any) {
  const [form, setForm] = useState({
    nim: "",
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        nim: editData.nim,
        name: editData.name,
        email: editData.email,
      });
    } else {
      setForm({ nim: "", name: "", email: "" });
    }
  }, [editData]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editData) {
        await api.put(`/students/${editData.id}`, form);
      } else {
        await api.post("/students", form);
      }

      refresh();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit Student" : "Add Student"}
        </h2>

        {!editData && (
          <input
            placeholder="NIM"
            className="border w-full p-2 rounded"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
          />
        )}

        <input
          placeholder="Name"
          className="border w-full p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border w-full p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-hijau text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
