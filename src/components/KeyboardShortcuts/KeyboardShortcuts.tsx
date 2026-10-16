const SHORTCUTS: { keys: string[]; description: string }[] = [
  { keys: ['Space'], description: 'Start / Pause' },
  { keys: ['R'], description: 'Reset grid' },
  { keys: ['C'], description: 'Clear path' },
  { keys: ['W'], description: 'Clear walls' },
  { keys: ['M'], description: 'Generate maze' },
  { keys: ['Esc'], description: 'Stop visualization' },
];

export function KeyboardShortcuts() {
  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Shortcuts
      </h3>
      <ul className="space-y-1">
        {SHORTCUTS.map((sc) => (
          <li key={sc.description} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-400">{sc.description}</span>
            <span className="flex gap-1">
              {sc.keys.map((k) => (
                <kbd
                  key={k}
                  className="inline-flex min-w-[20px] justify-center items-center rounded border border-[#2a3a5c] bg-[#0a1122] px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                >
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
