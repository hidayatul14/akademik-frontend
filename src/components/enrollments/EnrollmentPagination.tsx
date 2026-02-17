export default function EnrollmentPagination({
  pagination,
  page,
  setPage,
}: any) {
  if (!pagination) return null;

  return (
    <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow">
      <button
        disabled={!pagination.prev_page_url}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
      >
        Prev
      </button>

      <span className="font-semibold">
        Page {pagination.current_page}
      </span>

      <button
        disabled={!pagination.next_page_url}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
