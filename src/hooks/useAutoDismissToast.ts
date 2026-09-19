import { useEffect, useState } from "react";
import type { ToastMessage } from "../components/ui/Toast";

export default function useAutoDismissToast(duration = 4000) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), duration);
    return () => window.clearTimeout(timer);
  }, [duration, toast]);

  return { toast, setToast };
}
