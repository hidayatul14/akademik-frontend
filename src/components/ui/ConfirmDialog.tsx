import { AlertTriangle, LoaderCircle, X } from "lucide-react";

interface Props {
  busy?: boolean;
  description: string;
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ busy, description, open, title, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/35 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (!busy && event.target === event.currentTarget) onCancel(); }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-red-50 p-3 text-red-600"><AlertTriangle className="h-5 w-5" /></span>
          <button type="button" disabled={busy} onClick={onCancel} aria-label="Close confirmation" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <h2 id="confirm-title" className="mt-5 text-lg font-semibold text-gray-900">{title}</h2>
        <p id="confirm-description" className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" disabled={busy} onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Delete enrollment
          </button>
        </div>
      </div>
    </div>
  );
}
