import { useState } from "react";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import api from "../../api/axios";
import type { Student } from "../../types/catalog";
import ModalShell from "../ui/ModalShell";

interface Props {
  editData: Student | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

type Form = Omit<Student, "id">;
type Errors = Partial<Record<keyof Form | "form", string>>;

const fieldClass = "mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";

export default function StudentModal({ editData, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Form>(() => ({
    nim: editData?.nim ?? "",
    name: editData?.name ?? "",
    email: editData?.email ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const update = (field: keyof Form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!/^\d{8,12}$/.test(form.nim)) next.nim = "NIM harus terdiri dari 8–12 angka.";
    if (form.name.trim().length < 3 || form.name.trim().length > 100) next.name = "Nama harus terdiri dari 3–100 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Masukkan alamat email yang valid.";
    return next;
  };

  const submit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setBusy(true);
    try {
      if (editData) await api.put(`/students/${editData.id}`, form);
      else await api.post("/students", form);
      onSuccess(editData ? "Data mahasiswa berhasil diperbarui." : "Mahasiswa berhasil ditambahkan.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422 && error.response.data?.errors) {
        const mapped: Errors = {};
        Object.entries(error.response.data.errors as Record<string, string[]>).forEach(([key, messages]) => {
          mapped[key as keyof Form] = messages[0];
        });
        setErrors(mapped);
      } else {
        setErrors({ form: "Data mahasiswa gagal disimpan. Silakan coba lagi." });
      }
    } finally {
      setBusy(false);
    }
  };

  const footer = (
    <>
      <button type="button" disabled={busy} onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
      <button type="button" disabled={busy} onClick={submit} className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {busy ? "Menyimpan..." : "Simpan Mahasiswa"}
      </button>
    </>
  );

  return (
    <ModalShell busy={busy} eyebrow="Data Induk Mahasiswa" title={editData ? "Ubah Mahasiswa" : "Tambah Mahasiswa"} titleId="student-modal-title" footer={footer} onClose={onClose}>
      {errors.form && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}
      <label className="block text-sm font-medium text-slate-700">
        NIM <span className="text-red-500">*</span>
        <input disabled={Boolean(editData)} value={form.nim} onChange={(event) => update("nim", event.target.value.replace(/\D/g, ""))} maxLength={12} inputMode="numeric" className={fieldClass} />
        {errors.nim && <span className="mt-1 block text-xs text-red-600">{errors.nim}</span>}
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Nama lengkap <span className="text-red-500">*</span>
        <input value={form.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} />
        {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email <span className="text-red-500">*</span>
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={fieldClass} />
        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
      </label>
    </ModalShell>
  );
}
