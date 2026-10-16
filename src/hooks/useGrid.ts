import { useCallback, useEffect, useRef, useState } from 'react';
import type { Grid, GridDensity, Position } from '../types/grid';
import {
  calculateGridDimensions,
  clearWalls as clearWallsUtil,
  cloneGrid,
  createGrid,
  findStart,
  findTarget,
  resetVisitedAndPath,
} from '../utils/grid';

export type DragMode = 'wall' | 'erase' | 'start' | 'target' | null;

export interface UseGridReturn {
  grid: Grid;
  rows: number;
  cols: number;
  density: GridDensity;
  setDensity: (d: GridDensity) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setNodeWall: (row: number, col: number, isWall: boolean) => void;
  moveStart: (row: number, col: number) => void;
  moveTarget: (row: number, col: number) => void;
  resetGrid: () => void;
  clearWalls: () => void;
  clearPath: () => void;
  setGrid: (g: Grid) => void;
  getStart: () => Position | null;
  getTarget: () => Position | null;
  dragMode: DragMode;
  setDragMode: (m: DragMode) => void;
  handleCellPointerDown: (row: number, col: number, e: React.PointerEvent) => void;
  handleCellPointerEnter: (row: number, col: number) => void;
  handlePointerUp: () => void;
}

/**
 * Hook that owns the grid state + all interactive cell operations
 * (placing walls, dragging start/target, mouse drag drawing).
 * It is decoupled from the visualizer state so the grid can be reset or
 * walls drawn without affecting algorithm logic.
 */
export function useGrid(): UseGridReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [density, setDensity] = useState<GridDensity>('medium');
  const [dimensions, setDimensions] = useState<{ rows: number; cols: number }>({ rows: 21, cols: 45 });
  const [grid, setGridState] = useState<Grid>(() => createGrid(21, 45));
  const [dragMode, setDragMode] = useState<DragMode>(null);

  // Resize grid when density or container changes
  useEffect(() => {
    const recompute = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Subtract a bit of padding
      const width = rect.width - 4;
      const height = rect.height - 4;
      if (width <= 0 || height <= 0) return;
      const dims = calculateGridDimensions(width, height, density);
      setDimensions(dims);
      setGridState((prev) => {
        // Preserve walls + start/target positions best we can on resize
        return resizeGrid(prev, dims.rows, dims.cols);
      });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [density]);

  const setGrid = useCallback((g: Grid) => {
    setGridState(g);
  }, []);

  const setNodeWall = useCallback((row: number, col: number, isWall: boolean) => {
    setGridState((prev) => {
      const next = cloneGrid(prev);
      const node = next[row]?.[col];
      if (!node || node.isStart || node.isTarget) return prev;
      node.isWall = isWall;
      return next;
    });
  }, []);

  const moveStart = useCallback((row: number, col: number) => {
    setGridState((prev) => {
      const next = cloneGrid(prev);
      for (let r = 0; r < next.length; r++) {
        for (let c = 0; c < next[r].length; c++) {
          if (next[r][c].isStart) {
            next[r][c].isStart = false;
          }
        }
      }
      const node = next[row]?.[col];
      if (!node) return prev;
      node.isStart = true;
      node.isWall = false;
      node.isTarget = false;
      return next;
    });
  }, []);

  const moveTarget = useCallback((row: number, col: number) => {
    setGridState((prev) => {
      const next = cloneGrid(prev);
      for (let r = 0; r < next.length; r++) {
        for (let c = 0; c < next[r].length; c++) {
          if (next[r][c].isTarget) {
            next[r][c].isTarget = false;
          }
        }
      }
      const node = next[row]?.[col];
      if (!node) return prev;
      node.isTarget = true;
      node.isWall = false;
      node.isStart = false;
      return next;
    });
  }, []);

  const resetGrid = useCallback(() => {
    setGridState(createGrid(dimensions.rows, dimensions.cols));
  }, [dimensions]);

  const clearWalls = useCallback(() => {
    setGridState((prev) => clearWallsUtil(prev));
  }, []);

  const clearPath = useCallback(() => {
    setGridState((prev) => resetVisitedAndPath(prev));
  }, []);

  const getStart = useCallback(() => findStart(grid), [grid]);
  const getTarget = useCallback(() => findTarget(grid), [grid]);

  // ----- Drag handlers -----
  const handleCellPointerDown = useCallback(
    (row: number, col: number, e: React.PointerEvent) => {
      e.preventDefault();
      const node = grid[row]?.[col];
      if (!node) return;
      if (node.isStart) {
        setDragMode('start');
      } else if (node.isTarget) {
        setDragMode('target');
      } else if (node.isWall) {
        setDragMode('erase');
        setNodeWall(row, col, false);
      } else {
        setDragMode('wall');
        setNodeWall(row, col, true);
      }
    },
    [grid, setNodeWall]
  );

  const handleCellPointerEnter = useCallback(
    (row: number, col: number) => {
      if (!dragMode) return;
      const node = grid[row]?.[col];
      if (!node) return;
      if (dragMode === 'wall') {
        if (!node.isStart && !node.isTarget) setNodeWall(row, col, true);
      } else if (dragMode === 'erase') {
        setNodeWall(row, col, false);
      } else if (dragMode === 'start') {
        if (!node.isTarget && !node.isWall) moveStart(row, col);
      } else if (dragMode === 'target') {
        if (!node.isStart && !node.isWall) moveTarget(row, col);
      }
    },
    [dragMode, grid, setNodeWall, moveStart, moveTarget]
  );

  const handlePointerUp = useCallback(() => {
    setDragMode(null);
  }, []);

  // Clear drag mode if pointer is released anywhere
  useEffect(() => {
    const up = () => setDragMode(null);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  return {
    grid,
    rows: dimensions.rows,
    cols: dimensions.cols,
    density,
    setDensity,
    containerRef,
    setNodeWall,
    moveStart,
    moveTarget,
    resetGrid,
    clearWalls,
    clearPath,
    setGrid,
    getStart,
    getTarget,
    dragMode,
    setDragMode,
    handleCellPointerDown,
    handleCellPointerEnter,
    handlePointerUp,
  };
}

/**
 * Resize grid to new rows/cols while preserving walls, start, target
 * positions as much as possible.
 */
function resizeGrid(oldGrid: Grid, newRows: number, newCols: number): Grid {
  const newGrid = createGrid(newRows, newCols);
  // Clear start/target in new grid to re-place them from old grid
  for (let r = 0; r < newRows; r++) {
    for (let c = 0; c < newCols; c++) {
      newGrid[r][c].isStart = false;
      newGrid[r][c].isTarget = false;
    }
  }
  const minRows = Math.min(oldGrid.length, newRows);
  const minCols = Math.min(oldGrid[0]?.length ?? 0, newCols);

  // Find old start/target positions
  let oldStart: Position | null = null;
  let oldTarget: Position | null = null;
  for (let r = 0; r < oldGrid.length; r++) {
    for (let c = 0; c < oldGrid[r].length; c++) {
      if (oldGrid[r][c].isStart) oldStart = { row: r, col: c };
      if (oldGrid[r][c].isTarget) oldTarget = { row: r, col: c };
    }
  }

  // Copy walls
  for (let r = 0; r < minRows; r++) {
    for (let c = 0; c < minCols; c++) {
      if (oldGrid[r][c].isWall) {
        newGrid[r][c].isWall = true;
      }
    }
  }

  // Place start/target, clamped into new dimensions
  const placeSafe = (
    oldPos: Position | null,
    fallback: Position,
    setter: 'start' | 'target'
  ) => {
    let r: number;
    let c: number;
    if (oldPos) {
      r = Math.min(Math.max(oldPos.row, 0), newRows - 1);
      c = Math.min(Math.max(oldPos.col, 0), newCols - 1);
    } else {
      r = fallback.row;
      c = fallback.col;
    }
    newGrid[r][c].isWall = false;
    if (setter === 'start') {
      newGrid[r][c].isStart = true;
      newGrid[r][c].isTarget = false;
    } else {
      newGrid[r][c].isTarget = true;
      newGrid[r][c].isStart = false;
    }
  };

  placeSafe(oldStart, { row: Math.floor(newRows / 2), col: Math.floor(newCols / 6) }, 'start');
  placeSafe(
    oldTarget,
    { row: Math.floor(newRows / 2), col: newCols - Math.floor(newCols / 6) - 1 },
    'target'
  );

  return newGrid;
}
