'use client';

export interface TabDef {
  key: string;
  label: string;
}

export default function Tabs({
  tabs,
  active,
  onChange,
  maxWidthClassName = 'max-w-6xl',
}: {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
  /** Past de breedte van de tabbalk aan op de content eronder. */
  maxWidthClassName?: string;
}) {
  return (
    <div className="border-b border-line px-6 bg-white dark:border-night-line dark:bg-night-bg">
      <div className={`${maxWidthClassName} mx-auto`}>
        <nav className="flex gap-6 -mb-px overflow-x-auto" aria-label="Tabs">
          {tabs.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-aqua text-aqua dark:border-night-cyan dark:text-night-cyan'
                    : 'border-transparent text-sub hover:text-ink hover:border-line dark:text-night-sub dark:hover:text-night-ink dark:hover:border-night-line'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
