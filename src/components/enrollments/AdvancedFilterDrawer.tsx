import { Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { EnrollmentFilter, FilterOperator } from "../../types/enrollment";
import { statusLabels } from "../../features/enrollments/statusLabels";

interface Props {
  filters: EnrollmentFilter[];
  logic: "AND" | "OR";
  onApply: (filters: EnrollmentFilter[], logic: "AND" | "OR") => void;
  onClose: () => void;
}

const fields = [
  { value: "student_nim", label: "NIM", type: "text" },
  { value: "student_name", label: "Nama Mahasiswa", type: "text" },
  { value: "course_code", label: "Kode MK", type: "text" },
  { value: "course_name", label: "Nama Mata Kuliah", type: "text" },
  { value: "academic_year", label: "Tahun Ajaran", type: "text" },
  { value: "semester", label: "Semester", type: "enum" },
  { value: "status", label: "Status", type: "enum" },
] as const;

const textOperators: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Mengandung" },
  { value: "startsWith", label: "Diawali dengan" },
  { value: "equal", label: "Sama dengan" },
  { value: "between", label: "Di antara" },
];

const enumOperators: { value: FilterOperator; label: string }[] = [
  { value: "equal", label: "Sama dengan" },
  { value: "in", label: "Salah satu dari" },
];

const createCondition = (): EnrollmentFilter => ({
  id: crypto.randomUUID(),
  field: "student_nim",
  operator: "contains",
  value: "",
});

export default function AdvancedFilterDrawer({ filters, logic, onApply, onClose }: Props) {
  const [draftFilters, setDraftFilters] = useState<EnrollmentFilter[]>(filters.length ? filters : [createCondition()]);
  const [draftLogic, setDraftLogic] = useState<"AND" | "OR">(logic);
  const [conditionErrors, setConditionErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  const updateCondition = (id: string, patch: Partial<EnrollmentFilter>) => {
    setDraftFilters((current) => current.map((filter) => filter.id === id ? { ...filter, ...patch } : filter));
    setConditionErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const changeField = (condition: EnrollmentFilter, field: string) => {
    const fieldType = fields.find((item) => item.value === field)?.type;
    updateCondition(condition.id, { field, operator: fieldType === "enum" ? "equal" : "contains", value: "" });
  };

  const apply = () => {
    const errors: Record<string, string> = {};
    const normalized = draftFilters.flatMap<EnrollmentFilter>((filter) => {
      if (filter.operator === "between") {
        const values = Array.isArray(filter.value) ? filter.value.map((value) => value.trim()) : [];
        if (values.every((value) => !value)) return [];
        if (values.length !== 2 || values.some((value) => !value)) {
          errors[filter.id] = "Isi nilai awal dan akhir sebelum menerapkan filter.";
          return [];
        }
        return [{ ...filter, value: values }];
      }
      if (filter.operator === "in") {
        const values = (Array.isArray(filter.value) ? filter.value : filter.value.split(","))
          .map((value) => value.trim()).filter(Boolean);
        return values.length ? [{ ...filter, value: values }] : [];
      }
      const value = typeof filter.value === "string" ? filter.value.trim() : "";
      return value ? [{ ...filter, value }] : [];
    });
    setConditionErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onApply(normalized, draftLogic);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="advanced-filter-title" className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
        <header className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-hijau"><SlidersHorizontal className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Penyusun Filter</span></div>
            <h2 id="advanced-filter-title" className="mt-2 text-xl font-semibold text-gray-900">Filter Lanjutan</h2>
            <p className="mt-1 text-sm text-gray-500">Gabungkan beberapa kondisi untuk mencari data KRS.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup filter lanjutan" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800">Hubungan antar kondisi</legend>
            <div className="mt-3 inline-flex rounded-lg bg-gray-100 p-1">
              {(["AND", "OR"] as const).map((value) => (
                <label key={value} className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition ${draftLogic === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                  <input type="radio" name="filter-logic" value={value} checked={draftLogic === value} onChange={() => setDraftLogic(value)} className="sr-only" />
                  {value === "AND" ? "Semua (AND)" : "Salah satu (OR)"}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{draftLogic === "AND" ? "Semua kondisi harus terpenuhi." : "Cukup salah satu kondisi terpenuhi."}</p>
          </fieldset>

          <div className="mt-6 space-y-3">
            {draftFilters.map((condition, index) => {
              const field = fields.find((item) => item.value === condition.field) ?? fields[0];
              const operators = field.type === "enum" ? enumOperators : textOperators;
              return (
                <div key={condition.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Kondisi {index + 1}</span>
                    <button type="button" disabled={draftFilters.length === 1} onClick={() => setDraftFilters((current) => current.filter((item) => item.id !== condition.id))} aria-label={`Hapus kondisi ${index + 1}`} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-gray-600">Kolom
                      <select value={condition.field} onChange={(event) => changeField(condition, event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        {fields.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-gray-600">Operator
                      <select value={condition.operator} onChange={(event) => updateCondition(condition.id, { operator: event.target.value as FilterOperator, value: "" })} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        {operators.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </label>
                  </div>

                  <div className="mt-3">
                    {condition.operator === "between" ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[0, 1].map((valueIndex) => <input key={valueIndex} aria-label={valueIndex === 0 ? "Nilai awal" : "Nilai akhir"} placeholder={valueIndex === 0 ? "Dari" : "Sampai"} value={Array.isArray(condition.value) ? condition.value[valueIndex] ?? "" : ""} onChange={(event) => { const values = Array.isArray(condition.value) ? [...condition.value] : ["", ""]; values[valueIndex] = event.target.value; updateCondition(condition.id, { value: values }); }} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100" />)}
                      </div>
                    ) : condition.operator === "in" && field.type === "enum" ? (
                      <select multiple value={Array.isArray(condition.value) ? condition.value : condition.value ? [condition.value] : []} onChange={(event) => updateCondition(condition.id, { value: Array.from(event.target.selectedOptions, (option) => option.value) })} className="min-h-24 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        {(field.value === "status" ? ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const : ["GANJIL", "GENAP"] as const).map((value) => <option key={value} value={value}>{value in statusLabels ? statusLabels[value as keyof typeof statusLabels] : value === "GANJIL" ? "Ganjil" : "Genap"}</option>)}
                      </select>
                    ) : field.value === "status" ? (
                      <select value={typeof condition.value === "string" ? condition.value : condition.value.join(",")} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        <option value="">Pilih status</option><option value="DRAFT">Draf</option><option value="SUBMITTED">Diajukan</option><option value="APPROVED">Disetujui</option><option value="REJECTED">Ditolak</option>
                      </select>
                    ) : field.value === "semester" ? (
                      <select value={typeof condition.value === "string" ? condition.value : condition.value.join(",")} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        <option value="">Pilih semester</option><option value="GANJIL">Ganjil</option><option value="GENAP">Genap</option>
                      </select>
                    ) : (
                      <input value={Array.isArray(condition.value) ? condition.value.join(", ") : condition.value} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} placeholder={condition.operator === "in" ? "Pisahkan nilai dengan koma" : "Masukkan nilai"} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100" />
                    )}
                  </div>
                  {conditionErrors[condition.id] && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{conditionErrors[condition.id]}</p>}
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => setDraftFilters((current) => [...current, createCondition()])} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-hijau hover:text-hijau"><Plus className="h-4 w-4" /> Tambah kondisi</button>
        </div>

        <footer className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button type="button" onClick={() => { setDraftFilters([createCondition()]); setDraftLogic("AND"); }} className="text-sm font-semibold text-gray-500 hover:text-gray-900">Atur ulang</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="button" onClick={apply} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Terapkan Filter</button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
