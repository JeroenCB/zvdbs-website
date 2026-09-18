'use client';

export interface TabDef {
  key: string;
  label: string;
}

export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="border-b border-gray-200 px-6">
      <div className="max-w-6xl mx-auto">
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
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
