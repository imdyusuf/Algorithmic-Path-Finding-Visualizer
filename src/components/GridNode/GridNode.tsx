import { memo } from 'react';
import type { Node } from '../../types/grid';

export interface GridNodeProps {
  node: Node;
  cellSize: number;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter: (e: React.PointerEvent) => void;
  disabled: boolean;
}

/**
 * Individual cell in the grid. Memoized so that only changed cells re-render
 * during the animation - this is the key performance optimization for large grids.
 */
function GridNodeComponent({ node, cellSize, onPointerDown, onPointerEnter, disabled }: GridNodeProps) {
  const { isStart, isTarget, isWall, isVisited, isFrontier, isPath, isCurrent } = node;

  let stateClass = 'bg-[#0f1729] border-[#1a2540] hover:bg-[#15203a]';
  let content: React.ReactNode = null;

  if (isStart) {
    stateClass = 'bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    content = (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%] text-slate-900"
        aria-hidden
      >
        <path d="M12 2v20" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    );
  } else if (isTarget) {
    stateClass = 'bg-gradient-to-br from-rose-400 to-rose-600 border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
    content = (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%] text-slate-900"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
    );
  } else if (isWall) {
    stateClass = 'bg-[#26324a] border-[#324366]';
  } else if (isPath) {
    stateClass =
      'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.45)]';
  } else if (isCurrent) {
    stateClass = 'bg-amber-400/80 border-amber-300';
  } else if (isVisited) {
    stateClass =
      'bg-gradient-to-br from-violet-500/80 to-indigo-600/80 border-violet-400/40';
  } else if (isFrontier) {
    stateClass = 'bg-[#1d2b4a] border-cyan-500/40 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]';
  }

  return (
    <div
      role="gridcell"
      aria-label={getAriaLabel(node)}
      data-testid={`node-${node.row}-${node.col}`}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      className={`border-[0.5px] rounded-[2px] transition-colors duration-100 flex items-center justify-center ${stateClass} ${
        disabled ? 'pointer-events-none' : 'cursor-pointer touch-none select-none'
      }`}
      style={{
        width: cellSize,
        height: cellSize,
      }}
    >
      {content}
    </div>
  );
}

export const GridNode = memo(GridNodeComponent);

function getAriaLabel(n: Node): string {
  if (n.isStart) return 'Start node';
  if (n.isTarget) return 'Target node';
  if (n.isWall) return 'Wall';
  if (n.isPath) return 'Shortest path';
  if (n.isCurrent) return 'Currently exploring';
  if (n.isVisited) return 'Visited node';
  if (n.isFrontier) return 'Frontier node';
  return 'Unvisited node';
}
