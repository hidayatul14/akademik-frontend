import type { PaginatedResponse } from "../../types/catalog";

interface Props {
  pagination: PaginatedResponse<unknown> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function MasterDataPagination({ pagination, loading, onPageChange }: Props) {
  if (!pagination) return null;

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="text-slate-500">
        Page <strong className="text-slate-900">{pagination.current_page}</strong> of {pagination.last_page}
        <span aria-hidden="true"> · </span>
        {pagination.total.toLocaleString()} records
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={!pagination.prev_page_url || loading} onClick={() => onPageChange(pagination.current_page - 1)} className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
        <button type="button" disabled={!pagination.next_page_url || loading} onClick={() => onPageChange(pagination.current_page + 1)} className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
