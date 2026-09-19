import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, breadcrumb, description, actions }: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">{breadcrumb}</p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-poppins text-[28px] font-semibold tracking-tight text-slate-950 sm:text-[32px]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
