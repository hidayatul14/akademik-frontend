import { BookOpen, Menu } from "lucide-react";

interface Props {
  onOpenNavigation: () => void;
}

export default function Header({ onOpenNavigation }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onOpenNavigation} aria-label="Buka navigasi" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-poppins text-sm font-semibold tracking-wide text-slate-900 sm:hidden">SIAKAD</span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Sistem Informasi Akademik</p>
            <p className="mt-0.5 text-xs text-slate-500">Politeknik Caltex Riau</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:inline-flex"><BookOpen className="h-4 w-4 text-emerald-700" /> Ruang kerja akademik</div>
      </div>
    </header>
  );
}
