interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  description?: string;
  buttonLabel?: string;
  onClick?: () => void;
}

export default function PageHeader({ title, breadcrumb, description, buttonLabel, onClick }: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{breadcrumb}</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-poppins text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
        </div>
        {buttonLabel && onClick && (
          <button type="button" onClick={onClick} className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
            {buttonLabel}
          </button>
        )}
      </div>
    </header>
  );
}
