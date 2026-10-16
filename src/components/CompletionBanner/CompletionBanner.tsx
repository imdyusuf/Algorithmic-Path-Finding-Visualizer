import type { VisualizerStatus } from '../../types/algorithm';
import type { Statistics } from '../../types/algorithm';
import { ALGORITHMS } from '../../algorithms/definitions';

export interface CompletionBannerProps {
  status: VisualizerStatus;
  statistics: Statistics;
  pathFound: boolean | null;
  onDismiss?: () => void;
}

export function CompletionBanner({ status, statistics, pathFound }: CompletionBannerProps) {
  if (status !== 'completed' && status !== 'no-path') return null;
  const algo = statistics.algorithm ? ALGORITHMS[statistics.algorithm].shortName : '';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border px-4 py-3 text-sm ${
        pathFound
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
      }`}
    >
      {pathFound ? (
        <>
          <div className="font-semibold text-[13px]">
            {algo} found a path in {statistics.executionTime} ms
          </div>
          <div className="text-[12px] opacity-90 mt-0.5">
            Explored {statistics.nodesExplored.toLocaleString()} nodes · Shortest path:{' '}
            {statistics.pathLength} steps
          </div>
        </>
      ) : (
        <>
          <div className="font-semibold text-[13px]">No Path Found</div>
          <div className="text-[12px] opacity-90 mt-0.5">
            The target cannot be reached. Try clearing some walls or generating a new maze.
          </div>
        </>
      )}
    </div>
  );
}
