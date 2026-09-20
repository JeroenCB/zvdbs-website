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
    <div className="bg-white border border-line rounded-2xl p-7 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.15)] hover:shadow-[0_24px_44px_-24px_rgba(15,23,42,0.2)] transition-shadow dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-white/[0.02] dark:border-night-line dark:shadow-none dark:backdrop-blur-sm">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-aqua-light flex items-center justify-center text-xl mb-4 dark:bg-night-cyan/10 dark:border dark:border-night-cyan/25">
          {icon}
        </div>
      )}
      {label && <p className="text-xs text-sub font-medium mb-2 dark:text-night-sub">{label}</p>}
      <h3 className="text-base font-bold text-ink mb-2 dark:text-night-ink">{title}</h3>
      <p className="text-sm text-sub leading-relaxed dark:text-night-sub">{description || detail}</p>
    </div>
  );
}
