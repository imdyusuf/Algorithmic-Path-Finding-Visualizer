const LEGEND_ITEMS: { label: string; className: string; icon?: React.ReactNode }[] = [
  {
    label: 'Start',
    className: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
  },
  {
    label: 'Target',
    className: 'bg-gradient-to-br from-rose-400 to-rose-600',
  },
  { label: 'Wall', className: 'bg-[#26324a]' },
  { label: 'Unvisited', className: 'bg-[#0f1729] border border-[#1a2540]' },
  { label: 'Frontier', className: 'bg-[#1d2b4a] border border-cyan-500/50' },
  {
    label: 'Visited',
    className: 'bg-gradient-to-br from-violet-500/80 to-indigo-600/80',
  },
  {
    label: 'Shortest Path',
    className: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
  },
];

export function Legend() {
  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Legend
      </h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`inline-block w-3.5 h-3.5 rounded-[3px] ${item.className} shrink-0`}
            />
            <span className="text-[11px] text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
