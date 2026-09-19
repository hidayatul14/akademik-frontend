import { Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { EnrollmentFilter, FilterOperator } from "../../types/enrollment";

interface Props {
  filters: EnrollmentFilter[];
  logic: "AND" | "OR";
  onApply: (filters: EnrollmentFilter[], logic: "AND" | "OR") => void;
  onClose: () => void;
}

const fields = [
  { value: "student_nim", label: "NIM", type: "text" },
  { value: "student_name", label: "Student name", type: "text" },
  { value: "course_code", label: "Course code", type: "text" },
  { value: "course_name", label: "Course name", type: "text" },
  { value: "academic_year", label: "Academic year", type: "text" },
  { value: "semester", label: "Semester", type: "enum" },
  { value: "status", label: "Status", type: "enum" },
] as const;

const textOperators: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts with" },
  { value: "equal", label: "Equals" },
  { value: "between", label: "Between" },
];

const enumOperators: { value: FilterOperator; label: string }[] = [
  { value: "equal", label: "Equals" },
  { value: "in", label: "Is one of" },
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

  const updateCondition = (id: string, patch: Partial<EnrollmentFilter>) => {
    setDraftFilters((current) => current.map((filter) => filter.id === id ? { ...filter, ...patch } : filter));
  };

  const changeField = (condition: EnrollmentFilter, field: string) => {
    const fieldType = fields.find((item) => item.value === field)?.type;
    updateCondition(condition.id, { field, operator: fieldType === "enum" ? "equal" : "contains", value: "" });
  };

  const apply = () => {
    const normalized = draftFilters
      .map((filter) => ({
        ...filter,
        value: filter.operator === "in" && typeof filter.value === "string"
          ? filter.value.split(",").map((value) => value.trim()).filter(Boolean)
          : filter.value,
      }))
      .filter((filter) => Array.isArray(filter.value) ? filter.value.some(Boolean) : filter.value.trim() !== "");
    onApply(normalized, draftLogic);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-950/30 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside role="dialog" aria-modal="true" aria-labelledby="advanced-filter-title" className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-hijau"><SlidersHorizontal className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Query builder</span></div>
            <h2 id="advanced-filter-title" className="mt-2 text-xl font-semibold text-gray-900">Advanced filters</h2>
            <p className="mt-1 text-sm text-gray-500">Combine conditions across every enrollment column.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close advanced filters" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800">Match conditions using</legend>
            <div className="mt-3 inline-flex rounded-lg bg-gray-100 p-1">
              {(["AND", "OR"] as const).map((value) => (
                <label key={value} className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition ${draftLogic === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                  <input type="radio" name="filter-logic" value={value} checked={draftLogic === value} onChange={() => setDraftLogic(value)} className="sr-only" />
                  {value}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{draftLogic === "AND" ? "Every condition must match." : "At least one condition must match."}</p>
          </fieldset>

          <div className="mt-6 space-y-3">
            {draftFilters.map((condition, index) => {
              const field = fields.find((item) => item.value === condition.field) ?? fields[0];
              const operators = field.type === "enum" ? enumOperators : textOperators;
              return (
                <div key={condition.id} className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Condition {index + 1}</span>
                    <button type="button" disabled={draftFilters.length === 1} onClick={() => setDraftFilters((current) => current.filter((item) => item.id !== condition.id))} aria-label={`Remove condition ${index + 1}`} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-gray-600">Field
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
                        {[0, 1].map((valueIndex) => <input key={valueIndex} aria-label={valueIndex === 0 ? "From value" : "To value"} placeholder={valueIndex === 0 ? "From" : "To"} value={Array.isArray(condition.value) ? condition.value[valueIndex] ?? "" : ""} onChange={(event) => { const values = Array.isArray(condition.value) ? [...condition.value] : ["", ""]; values[valueIndex] = event.target.value; updateCondition(condition.id, { value: values }); }} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100" />)}
                      </div>
                    ) : condition.operator === "in" && field.type === "enum" ? (
                      <select multiple value={Array.isArray(condition.value) ? condition.value : condition.value ? [condition.value] : []} onChange={(event) => updateCondition(condition.id, { value: Array.from(event.target.selectedOptions, (option) => option.value) })} className="min-h-24 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        {(field.value === "status" ? ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] : ["GANJIL", "GENAP"]).map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                    ) : field.value === "status" ? (
                      <select value={typeof condition.value === "string" ? condition.value : condition.value.join(",")} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        <option value="">Select status</option><option value="DRAFT">Draft</option><option value="SUBMITTED">Submitted</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
                      </select>
                    ) : field.value === "semester" ? (
                      <select value={typeof condition.value === "string" ? condition.value : condition.value.join(",")} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100">
                        <option value="">Select semester</option><option value="GANJIL">Ganjil</option><option value="GENAP">Genap</option>
                      </select>
                    ) : (
                      <input value={Array.isArray(condition.value) ? condition.value.join(", ") : condition.value} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} placeholder={condition.operator === "in" ? "Separate values with commas" : "Enter a value"} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-hijau focus:ring-2 focus:ring-green-100" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => setDraftFilters((current) => [...current, createCondition()])} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-hijau hover:text-hijau"><Plus className="h-4 w-4" /> Add condition</button>
        </div>

        <footer className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button type="button" onClick={() => { setDraftFilters([createCondition()]); setDraftLogic("AND"); }} className="text-sm font-semibold text-gray-500 hover:text-gray-900">Reset</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={apply} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Apply filters</button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
