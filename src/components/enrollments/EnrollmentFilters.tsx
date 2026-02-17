export default function EnrollmentFilters({
  setSearch,
  setStatusFilter,
  setSemesterFilter,
}: any) {
  return (
    <div className="flex gap-4 mt-6">
      <input
        placeholder="Search NIM / Name"
        className="border px-4 py-2 rounded-lg"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border px-4 py-2 rounded-lg"
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="DRAFT">DRAFT</option>
        <option value="SUBMITTED">SUBMITTED</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
      </select>

      <select
        className="border px-4 py-2 rounded-lg"
        onChange={(e) => setSemesterFilter(e.target.value)}
      >
        <option value="">All Semester</option>
        <option value="GANJIL">GANJIL</option>
        <option value="GENAP">GENAP</option>
      </select>
    </div>
  );
}
