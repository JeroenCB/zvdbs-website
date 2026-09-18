interface InfoCardProps {
  title: string;
  description: string;
  label?: string;
  detail?: string;
  icon?: string;
}

export default function InfoCard({ title, description, label, detail, icon }: InfoCardProps) {
  // Support both old and new prop formats
  return (
    <div className="bg-white border border-line rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-0.5 transition">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-coral-light flex items-center justify-center text-2xl mx-auto mb-4">
          {icon}
        </div>
      )}
      {label && <p className="text-xs text-sub font-medium mb-2">{label}</p>}
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-sub leading-relaxed">{description || detail}</p>
    </div>
  );
}
