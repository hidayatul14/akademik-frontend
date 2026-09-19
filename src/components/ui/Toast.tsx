import { AlertCircle, CheckCircle2, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error";
}

interface Props {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: Props) {
  if (!toast) return null;

  const success = toast.type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm" role="status" aria-live="polite">
      <div className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${success ? "border-emerald-200" : "border-red-200"}`}>
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${success ? "text-emerald-600" : "text-red-600"}`} />
        <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
        <button type="button" onClick={onClose} aria-label="Dismiss notification" className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
