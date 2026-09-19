import { useState } from "react";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import api from "../../api/axios";
import type { Course } from "../../types/catalog";
import ModalShell from "../ui/ModalShell";

interface Props {
  editData: Course | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

type Form = Omit<Course, "id">;
type Errors = Partial<Record<keyof Form | "form", string>>;

const fieldClass = "mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";

export default function CourseModal({ editData, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Form>(() => ({
    code: editData?.code ?? "",
    name: editData?.name ?? "",
    credits: editData?.credits ?? 3,
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const update = <K extends keyof Form>(field: K, value: Form[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!/^[A-Z]{2,4}[0-9]{3}$/.test(form.code)) next.code = "Use 2–4 uppercase letters followed by 3 digits.";
    if (form.name.trim().length < 3 || form.name.trim().length > 120) next.name = "Name must be 3–120 characters.";
    if (!Number.isInteger(form.credits) || form.credits < 1 || form.credits > 6) next.credits = "Credits must be an integer from 1 to 6.";
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
      if (editData) await api.put(`/courses/${editData.id}`, form);
      else await api.post("/courses", form);
      onSuccess(editData ? "Course updated successfully." : "Course created successfully.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422 && error.response.data?.errors) {
        const mapped: Errors = {};
        Object.entries(error.response.data.errors as Record<string, string[]>).forEach(([key, messages]) => {
          mapped[key as keyof Form] = messages[0];
        });
        setErrors(mapped);
      } else {
        setErrors({ form: "Course data could not be saved. Please try again." });
      }
    } finally {
      setBusy(false);
    }
  };

  const footer = (
    <>
      <button type="button" disabled={busy} onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
      <button type="button" disabled={busy} onClick={submit} className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {busy ? "Saving..." : "Save course"}
      </button>
    </>
  );

  return (
    <ModalShell busy={busy} eyebrow="Course master" title={editData ? "Edit course" : "Add course"} titleId="course-modal-title" footer={footer} onClose={onClose}>
      {errors.form && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}
      <label className="block text-sm font-medium text-slate-700">
        Course code <span className="text-red-500">*</span>
        <input disabled={Boolean(editData)} value={form.code} onChange={(event) => update("code", event.target.value.toUpperCase().replace(/\s/g, ""))} className={fieldClass} />
        {errors.code && <span className="mt-1 block text-xs text-red-600">{errors.code}</span>}
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Course name <span className="text-red-500">*</span>
        <input value={form.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} />
        {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Credits <span className="text-red-500">*</span>
        <input type="number" min={1} max={6} value={form.credits} onChange={(event) => update("credits", Number(event.target.value))} className={fieldClass} />
        {errors.credits && <span className="mt-1 block text-xs text-red-600">{errors.credits}</span>}
      </label>
    </ModalShell>
  );
}
