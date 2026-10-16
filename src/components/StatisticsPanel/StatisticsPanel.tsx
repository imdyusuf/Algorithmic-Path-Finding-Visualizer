import type { Statistics as Stats, VisualizerStatus } from '../../types/algorithm';
import { ALGORITHMS } from '../../algorithms/definitions';

export interface StatisticsPanelProps {
  statistics: Stats;
  status: VisualizerStatus;
  pathFound: boolean | null;
}

export function StatisticsPanel({ statistics, status, pathFound }: StatisticsPanelProps) {
  const algoName = statistics.algorithm ? ALGORITHMS[statistics.algorithm].shortName : '—';
  const isDone = status === 'completed' || status === 'no-path';

  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] p-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Statistics
      </h3>
      {isDone && (
        <div
          className={`mb-3 rounded-lg px-3 py-2 text-xs font-medium border ${
            pathFound
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {pathFound ? '✓ Path Found' : '✗ No Path Exists'}
        </div>
      )}
      <dl className="space-y-1.5 font-mono text-[13px]">
        <StatRow label="Algorithm" value={algoName} highlight />
        <StatRow label="Nodes Explored" value={statistics.nodesExplored.toLocaleString()} />
        <StatRow label="Nodes Visited" value={statistics.nodesVisited.toLocaleString()} />
        <StatRow label="Frontier Nodes" value={statistics.frontierNodes.toLocaleString()} />
        <StatRow
          label="Path Length"
          value={pathFound && statistics.pathLength > 0 ? `${statistics.pathLength} steps` : '—'}
        />
        <StatRow
          label="Execution"
          value={statistics.executionTime > 0 ? `${statistics.executionTime} ms` : '—'}
        />
        <StatRow
          label="Grid"
          value={
            statistics.gridDimensions.rows > 0
              ? `${statistics.gridDimensions.rows} × ${statistics.gridDimensions.cols}`
              : '—'
          }
        />
      </dl>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400 text-xs">{label}</dt>
      <dd
        className={`text-right tabular-nums ${
          highlight ? 'text-cyan-300 font-semibold' : 'text-slate-200'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
