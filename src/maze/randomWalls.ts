import type { Grid } from '../types/grid';
import { cloneGrid, findStart, findTarget } from '../utils/grid';

/**
 * Fills a random subset of cells with walls.
 * density controls the approximate fraction of cells that become walls (0-1).
 * Start and target cells are never overwritten.
 */
export function generateRandomWalls(grid: Grid, density = 0.3): Grid {
  const newGrid = cloneGrid(grid);
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  const start = findStart(newGrid);
  const target = findTarget(newGrid);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = newGrid[r][c];
      if (node.isStart || node.isTarget) continue;
      if (start && Math.abs(r - start.row) <= 1 && Math.abs(c - start.col) <= 1) continue;
      if (target && Math.abs(r - target.row) <= 1 && Math.abs(c - target.col) <= 1) continue;
      node.isWall = Math.random() < density;
    }
  }
  return newGrid;
}

/**
 * Randomly scatters "obstacles" - short horizontal/vertical wall segments
 * that look more like natural obstacles than pure noise.
 */
export function generateRandomObstacles(grid: Grid, count = 24): Grid {
  const newGrid = cloneGrid(grid);
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  const start = findStart(newGrid);
  const target = findTarget(newGrid);

  // First clear any existing walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].isStart && !newGrid[r][c].isTarget) {
        newGrid[r][c].isWall = false;
      }
    }
  }

  for (let i = 0; i < count; i++) {
    const horizontal = Math.random() < 0.5;
    const length = Math.floor(Math.random() * 5) + 3;
    const startR = Math.floor(Math.random() * rows);
    const startC = Math.floor(Math.random() * cols);

    for (let j = 0; j < length; j++) {
      const r = horizontal ? startR : startR + j;
      const c = horizontal ? startC + j : startC;
      if (r < 0 || r >= rows || c < 0 || c >= cols) break;
      const node = newGrid[r][c];
      if (node.isStart || node.isTarget) continue;
      if (start && Math.abs(r - start.row) <= 1 && Math.abs(c - start.col) <= 1) continue;
      if (target && Math.abs(r - target.row) <= 1 && Math.abs(c - target.col) <= 1) continue;
      node.isWall = true;
    }
  }

  return newGrid;
}
