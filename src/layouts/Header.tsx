import { Menu } from "lucide-react";

interface Props {
  onOpenNavigation: () => void;
}

export default function Header({ onOpenNavigation }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onOpenNavigation} aria-label="Open navigation" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Academic Information System</p>
            <p className="mt-0.5 text-xs text-slate-500">Politeknik Caltex Riau</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">OA</span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Academic Operator</p>
            <p className="text-xs text-slate-500">Administration</p>
          </div>
        </div>
      </div>
    </header>
  );
}
