interface InfoCardProps {
  label: string;
  title: string;
  detail: string;
}

export default function InfoCard({ label, title, detail }: InfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
    </div>
  );
}
