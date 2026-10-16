import type { ComparisonResult } from '../../types/algorithm';

export interface ComparisonPanelProps {
  results: ComparisonResult[];
  onClose: () => void;
}

export function ComparisonPanel({ results, onClose }: ComparisonPanelProps) {
  if (results.length === 0) return null;
  const maxNodes = Math.max(...results.map((r) => r.nodesExplored), 1);
  const minNodes = Math.min(...results.map((r) => r.nodesExplored));
  const shortestPath = Math.min(...results.filter((r) => r.pathFound).map((r) => r.pathLength));

  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Algorithm Comparison
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comparison"
          className="text-slate-400 hover:text-slate-100 text-sm w-6 h-6 inline-flex items-center justify-center rounded hover:bg-[#1a2746] transition"
        >
          ✕
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] font-mono">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-wider">
              <th className="text-left py-1 pr-3 font-medium">Algorithm</th>
              <th className="text-right py-1 px-2 font-medium">Explored</th>
              <th className="text-right py-1 px-2 font-medium">Path</th>
              <th className="text-right py-1 pl-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const pct = (r.nodesExplored / maxNodes) * 100;
              const isFewest = r.nodesExplored === minNodes && r.pathFound;
              const isShortest = r.pathFound && r.pathLength === shortestPath;
              return (
                <tr key={r.algorithmId} className="border-t border-[#1a2540]">
                  <td className="py-2 pr-3 text-slate-200 font-sans font-medium">
                    {r.algorithmName}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 bg-[#0a1122] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isFewest ? 'bg-emerald-400' : 'bg-violet-500/70'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`tabular-nums w-12 text-right ${
                          isFewest ? 'text-emerald-300 font-semibold' : 'text-slate-200'
                        }`}
                      >
                        {r.nodesExplored}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-2 px-2 text-right tabular-nums ${
                      !r.pathFound
                        ? 'text-rose-400'
                        : isShortest
                          ? 'text-emerald-300 font-semibold'
                          : r.pathLength > shortestPath
                            ? 'text-amber-300'
                            : 'text-slate-200'
                    }`}
                  >
                    {r.pathFound ? r.pathLength : '—'}
                  </td>
                  <td className="py-2 pl-3 text-right tabular-nums text-slate-400">
                    {r.executionTime} ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
        Green highlight = fewest nodes explored / optimal path length. Amber = path found but not
        optimal. Algorithms with identical shortest-path lengths are expected on uniform grids for
        optimal algorithms.
      </p>
    </div>
  );
}
