interface InfoCardProps {
  title: string;
  description: string;
  label?: string;
  detail?: string;
}

export default function InfoCard({ title, description, label, detail }: InfoCardProps) {
  // Support both old and new prop formats
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      {label && <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description || detail}</p>
    </div>
  );
}
