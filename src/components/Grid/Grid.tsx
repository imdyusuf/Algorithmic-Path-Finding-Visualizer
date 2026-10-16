import { useEffect, useRef, useState } from 'react';
import type { Grid as GridType } from '../../types/grid';
import type { DragMode } from '../../hooks/useGrid';
import { GridNode } from '../GridNode';

export interface GridProps {
  grid: GridType;
  onCellPointerDown: (row: number, col: number, e: React.PointerEvent) => void;
  onCellPointerEnter: (row: number, col: number) => void;
  onPointerUp: () => void;
  disabled: boolean;
  dragMode: DragMode;
}

/**
 * Renders the 2D grid of nodes. Calculates a cell size based on available space
 * so the grid always fills the container. Memoization of cells happens at the
 * GridNode level.
 */
export function Grid({
  grid,
  onCellPointerDown,
  onCellPointerEnter,
  onPointerUp,
  disabled,
}: GridProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(24);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (grid.length === 0) return;
    setRows(grid.length);
    setCols(grid[0].length);
    const recompute = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 0 || h <= 0) return;
      const sizeW = Math.floor(w / grid[0].length);
      const sizeH = Math.floor(h / grid.length);
      const size = Math.max(4, Math.min(sizeW, sizeH));
      setCellSize(size);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [grid]);

  // Prevent touch scrolling while drawing
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
    };
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, [disabled]);

  return (
    <div
      ref={wrapperRef}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="grid"
      aria-label="Pathfinding grid"
      className="w-full h-full overflow-hidden bg-[#0b1020] rounded-xl border border-[#1f2a44] p-1 shadow-inner"
      style={{
        touchAction: 'none',
      }}
    >
      <div
        className="grid h-full w-full mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: '1px',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {grid.map((row, r) =>
          row.map((node, c) => (
            <GridNode
              key={`${r}-${c}`}
              node={node}
              cellSize={cellSize}
              disabled={disabled}
              onPointerDown={(e) => onCellPointerDown(r, c, e)}
              onPointerEnter={() => onCellPointerEnter(r, c)}
            />
          ))
        )}
      </div>
    </div>
  );
}
