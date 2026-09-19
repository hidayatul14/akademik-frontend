import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { LoaderCircle, Search, X } from "lucide-react";
import api from "../../api/axios";
import type { Enrollment } from "../../types/enrollment";

interface Props {
  editData: Enrollment | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface FormState {
  student_id: string;
  course_id: string;
  nim: string;
  student_name: string;
  email: string;
  course_code: string;
  course_name: string;
  credits: number;
  academic_year: string;
  semester: "GANJIL" | "GENAP";
  status: Enrollment["status"];
}

interface StudentOption { id: number; nim: string; name: string }
interface CourseOption { id: number; code: string; name: string }
type FieldErrors = Partial<Record<keyof FormState | "form", string>>;

const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-hijau focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

function initialForm(editData: Enrollment | null): FormState {
  return {
    student_id: "",
    course_id: "",
    nim: editData?.nim ?? "",
    student_name: editData?.student_name ?? "",
    email: editData?.email ?? "",
    course_code: editData?.course_code ?? "",
    course_name: editData?.course_name ?? "",
    credits: editData?.credits ?? 3,
    academic_year: editData?.academic_year ?? "2026/2027",
    semester: editData?.semester ?? "GANJIL",
    status: editData?.status ?? "DRAFT",
  };
}

export default function EnrollmentModal({ editData, onClose, onSuccess }: Props) {
  const editing = Boolean(editData);
  const [form, setForm] = useState<FormState>(() => initialForm(editData));
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [useExistingCourse, setUseExistingCourse] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const studentTimer = useRef<number | null>(null);
  const courseTimer = useRef<number | null>(null);
  const firstInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstInput.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && !busy) onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      if (studentTimer.current) window.clearTimeout(studentTimer.current);
      if (courseTimer.current) window.clearTimeout(courseTimer.current);
    };
  }, [busy, onClose]);

  const setValue = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const scheduleStudentSearch = (keyword: string) => {
    setStudentSearch(keyword);
    if (studentTimer.current) window.clearTimeout(studentTimer.current);
    studentTimer.current = window.setTimeout(async () => {
      const response = await api.get<StudentOption[]>("/students/search", { params: { search: keyword } });
      setStudents(response.data);
    }, 350);
  };

  const scheduleCourseSearch = (keyword: string) => {
    setCourseSearch(keyword);
    if (courseTimer.current) window.clearTimeout(courseTimer.current);
    courseTimer.current = window.setTimeout(async () => {
      const response = await api.get<CourseOption[]>("/courses/search", { params: { search: keyword } });
      setCourses(response.data);
    }, 350);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!editing && useExistingStudent && !form.student_id) next.student_id = "Pilih mahasiswa yang sudah ada.";
    if (!editing && !useExistingStudent) {
      if (!/^\d{8,12}$/.test(form.nim)) next.nim = "NIM harus terdiri dari 8–12 angka tanpa spasi.";
      if (form.student_name.trim().length < 3 || form.student_name.trim().length > 100) next.student_name = "Nama mahasiswa harus terdiri dari 3–100 karakter.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Masukkan alamat email yang valid.";
    }
    if (editing && (form.student_name.trim().length < 3 || form.student_name.trim().length > 100)) next.student_name = "Nama mahasiswa harus terdiri dari 3–100 karakter.";
    if (editing && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Masukkan alamat email yang valid.";

    if (!editing && useExistingCourse && !form.course_id) next.course_id = "Pilih mata kuliah yang sudah ada.";
    if (!editing && !useExistingCourse && !/^[A-Z]{2,4}[0-9]{3}$/.test(form.course_code)) next.course_code = "Gunakan 2–4 huruf kapital diikuti 3 angka, misalnya IF101.";
    if ((!useExistingCourse || editing) && (form.course_name.trim().length < 3 || form.course_name.trim().length > 120)) next.course_name = "Nama mata kuliah harus terdiri dari 3–120 karakter.";
    if ((!useExistingCourse || editing) && (!Number.isInteger(form.credits) || form.credits < 1 || form.credits > 6)) next.credits = "SKS harus berupa bilangan bulat dari 1 sampai 6.";
    if (!/^\d{4}\/\d{4}$/.test(form.academic_year)) next.academic_year = "Gunakan format tahun ajaran YYYY/YYYY.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setBusy(true);
    setErrors({});

    const payload = editing ? {
      student_name: form.student_name.trim(),
      email: form.email.trim(),
      course_name: form.course_name.trim(),
      credits: form.credits,
      academic_year: form.academic_year,
      semester: form.semester,
      status: form.status,
    } : {
      ...(useExistingStudent ? { student_id: Number(form.student_id) } : { nim: form.nim, student_name: form.student_name.trim(), email: form.email.trim() }),
      ...(useExistingCourse ? { course_id: Number(form.course_id) } : { course_code: form.course_code, course_name: form.course_name.trim(), credits: form.credits }),
      academic_year: form.academic_year,
      semester: form.semester,
      status: form.status,
    };

    try {
      if (editData) await api.put(`/enrollments/${editData.id}`, payload);
      else await api.post("/enrollments", payload);
      onSuccess(editData ? "Data KRS berhasil diperbarui." : "Data KRS berhasil dibuat.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        const apiErrors = error.response.data?.errors as Record<string, string[]> | undefined;
        if (apiErrors) {
          const mapped: FieldErrors = {};
          Object.entries(apiErrors).forEach(([field, messages]) => { mapped[field as keyof FormState] = messages[0]; });
          setErrors(mapped);
        } else {
          setErrors({ form: error.response.data?.message ?? "Data yang dikirim tidak valid." });
        }
      } else {
        setErrors({ form: "Data KRS gagal disimpan. Periksa koneksi lalu coba lagi." });
      }
    } finally {
      setBusy(false);
    }
  };

  const fieldError = (field: keyof FormState) => errors[field] ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors[field]}</p> : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (!busy && event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="enrollment-form-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-hijau">Pengambilan Mata Kuliah</p><h2 id="enrollment-form-title" className="mt-1 text-xl font-semibold text-gray-900">{editing ? "Ubah KRS" : "Buat KRS"}</h2><p className="mt-1 text-sm text-gray-500">{editing ? "Perbarui data KRS dan data induk terkait." : "Daftarkan mahasiswa, mata kuliah, dan KRS dalam satu transaksi."}</p></div>
          <button type="button" disabled={busy} onClick={onClose} aria-label="Tutup formulir" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {errors.form && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</div>}

          <section aria-labelledby="student-section"><div className="flex items-center justify-between"><div><h3 id="student-section" className="font-semibold text-gray-900">Informasi Mahasiswa</h3><p className="text-sm text-gray-500">Identitas dan kontak mahasiswa.</p></div>{!editing && <label className="flex items-center gap-2 text-sm font-medium text-gray-600"><input type="checkbox" checked={useExistingStudent} onChange={(event) => { setUseExistingStudent(event.target.checked); setErrors({}); }} className="h-4 w-4 rounded accent-emerald-600" />Gunakan data yang ada</label>}</div>
            {useExistingStudent && !editing ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">Cari mahasiswa<div className="relative"><Search className="absolute left-3 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-gray-400" /><input ref={firstInput} value={studentSearch} onChange={(event) => scheduleStudentSearch(event.target.value)} placeholder="Cari NIM atau nama" className={`${inputClass} pl-9`} /></div></label><label className="text-sm font-medium text-gray-700">Mahasiswa<span className="text-red-500"> *</span><select value={form.student_id} onChange={(event) => setValue("student_id", event.target.value)} className={inputClass}><option value="">Pilih mahasiswa</option>{students.map((student) => <option key={student.id} value={student.id}>{student.nim} — {student.name}</option>)}</select>{fieldError("student_id")}</label></div> : <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">NIM<span className="text-red-500"> *</span><input ref={firstInput} disabled={editing} value={form.nim} inputMode="numeric" maxLength={12} onChange={(event) => setValue("nim", event.target.value.replace(/\D/g, ""))} className={inputClass} />{fieldError("nim")}</label><label className="text-sm font-medium text-gray-700">Nama mahasiswa<span className="text-red-500"> *</span><input value={form.student_name} onChange={(event) => setValue("student_name", event.target.value)} className={inputClass} />{fieldError("student_name")}</label><label className="text-sm font-medium text-gray-700 sm:col-span-2">Email<span className="text-red-500"> *</span><input type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} className={inputClass} />{fieldError("email")}</label></div>}
          </section>

          <hr className="border-gray-100" />
          <section aria-labelledby="course-section"><div className="flex items-center justify-between"><div><h3 id="course-section" className="font-semibold text-gray-900">Informasi Mata Kuliah</h3><p className="text-sm text-gray-500">Identitas mata kuliah dan jumlah SKS.</p></div>{!editing && <label className="flex items-center gap-2 text-sm font-medium text-gray-600"><input type="checkbox" checked={useExistingCourse} onChange={(event) => { setUseExistingCourse(event.target.checked); setErrors({}); }} className="h-4 w-4 rounded accent-emerald-600" />Gunakan data yang ada</label>}</div>
            {useExistingCourse && !editing ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">Cari mata kuliah<div className="relative"><Search className="absolute left-3 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={courseSearch} onChange={(event) => scheduleCourseSearch(event.target.value)} placeholder="Cari kode atau nama" className={`${inputClass} pl-9`} /></div></label><label className="text-sm font-medium text-gray-700">Mata kuliah<span className="text-red-500"> *</span><select value={form.course_id} onChange={(event) => setValue("course_id", event.target.value)} className={inputClass}><option value="">Pilih mata kuliah</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code} — {course.name}</option>)}</select>{fieldError("course_id")}</label></div> : <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">Kode MK<span className="text-red-500"> *</span><input disabled={editing} value={form.course_code} onChange={(event) => setValue("course_code", event.target.value.toUpperCase().replace(/\s/g, ""))} className={inputClass} />{fieldError("course_code")}</label><label className="text-sm font-medium text-gray-700">SKS<span className="text-red-500"> *</span><input type="number" min={1} max={6} value={form.credits} onChange={(event) => setValue("credits", Number(event.target.value))} className={inputClass} />{fieldError("credits")}</label><label className="text-sm font-medium text-gray-700 sm:col-span-2">Nama mata kuliah<span className="text-red-500"> *</span><input value={form.course_name} onChange={(event) => setValue("course_name", event.target.value)} className={inputClass} />{fieldError("course_name")}</label></div>}
          </section>

          <hr className="border-gray-100" />
          <section aria-labelledby="academic-section"><div><h3 id="academic-section" className="font-semibold text-gray-900">Informasi KRS</h3><p className="text-sm text-gray-500">Periode akademik dan status pengajuan KRS.</p></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="text-sm font-medium text-gray-700">Tahun ajaran<span className="text-red-500"> *</span><input value={form.academic_year} placeholder="2026/2027" onChange={(event) => setValue("academic_year", event.target.value)} className={inputClass} />{fieldError("academic_year")}</label><label className="text-sm font-medium text-gray-700">Semester<span className="text-red-500"> *</span><select value={form.semester} onChange={(event) => setValue("semester", event.target.value as FormState["semester"])} className={inputClass}><option value="GANJIL">Ganjil</option><option value="GENAP">Genap</option></select></label><label className="text-sm font-medium text-gray-700">Status<span className="text-red-500"> *</span><select value={form.status} onChange={(event) => setValue("status", event.target.value as Enrollment["status"])} className={inputClass}><option value="DRAFT">Draf</option><option value="SUBMITTED">Diajukan</option><option value="APPROVED">Disetujui</option><option value="REJECTED">Ditolak</option></select></label></div></section>

          {editing && <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">Perubahan data mahasiswa atau mata kuliah juga mengubah data induk dan dapat memengaruhi KRS lain yang menggunakannya.</p>}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4"><button type="button" disabled={busy} onClick={onClose} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Batal</button><button type="button" disabled={busy} onClick={submit} className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-hijau px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{busy ? "Menyimpan..." : editing ? "Simpan perubahan" : "Buat KRS"}</button></footer>
      </div>
    </div>
  );
}
