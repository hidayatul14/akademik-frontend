import { NavLink } from "react-router-dom";
import { BookOpen, GraduationCap, LayoutDashboard, Library, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/enrollments", label: "KRS Management", icon: BookOpen },
  { to: "/students", label: "Students", icon: GraduationCap },
  { to: "/courses", label: "Courses", icon: Library },
];

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-gray-950/35 backdrop-blur-[1px] lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[272px] transform flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-emerald-600 bg-emerald-600 text-white"><GraduationCap className="h-5 w-5" /></span>
            <div><p className="font-poppins text-sm font-semibold tracking-[0.08em]">SIAKAD</p><p className="mt-0.5 text-[11px] text-slate-400">Politeknik Caltex Riau</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close sidebar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 px-4 py-6">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          <div className="mt-3 space-y-1">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-slate-800 text-white before:absolute before:-left-1 before:h-5 before:w-0.5 before:rounded-full before:bg-emerald-400" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}>
                <Icon className="h-[18px] w-[18px]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="m-4 border-t border-slate-800 px-3 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Academic period</p>
          <p className="mt-2 text-sm font-medium text-slate-200">2026/2027 · Ganjil</p>
        </div>
      </aside>
    </>
  );
}
