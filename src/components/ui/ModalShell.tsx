import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  busy?: boolean;
  children: ReactNode;
  eyebrow: string;
  footer: ReactNode;
  title: string;
  titleId: string;
  onClose: () => void;
}

export default function ModalShell({ busy = false, children, eyebrow, footer, title, titleId, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [busy, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (!busy && event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{eyebrow}</p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
          </div>
          <button type="button" disabled={busy} onClick={onClose} aria-label="Tutup formulir" className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-4 px-6 py-5">{children}</div>
        <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</footer>
      </div>
    </div>
  );
}
