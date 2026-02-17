interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  buttonLabel?: string;
  onClick?: () => void;
}

export default function PageHeader({
  title,
  breadcrumb,
  buttonLabel,
  onClick,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-3xl font-semibold">{title}</span>
        <div className="flex items-center font-medium space-x-2 mt-2 text-gray-500">
          <span>{breadcrumb}</span>
        </div>
      </div>

      {buttonLabel && (
        <button
          onClick={onClick}
          className="bg-hijau text-white px-4 py-2 rounded-lg"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
