import type { Grid } from '../types/grid';
import { cloneGrid, findStart, findTarget } from '../utils/grid';

/**
 * Recursive Division maze generation.
 *
 * Starts with an open grid and recursively adds walls with single openings,
 * creating a "perfect" maze that looks like rooms connected by passages.
 * Guaranteed to be connected (no isolated regions).
 */
export function generateRecursiveDivision(grid: Grid): Grid {
  const newGrid = cloneGrid(grid);
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  const start = findStart(newGrid);
  const target = findTarget(newGrid);

  // Clear existing walls first; we'll build from scratch
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].isStart && !newGrid[r][c].isTarget) {
        newGrid[r][c].isWall = false;
      }
    }
  }

  // Add outer border walls
  for (let r = 0; r < rows; r++) {
    newGrid[r][0].isWall = true;
    newGrid[r][cols - 1].isWall = true;
  }
  for (let c = 0; c < cols; c++) {
    newGrid[0][c].isWall = true;
    newGrid[rows - 1][c].isWall = true;
  }

  divide(newGrid, 1, 1, rows - 2, cols - 2, chooseOrientation(rows - 2, cols - 2));

  // Ensure start/target are cleared and reachable by clearing a small pocket
  if (start) {
    newGrid[start.row][start.col].isWall = false;
    newGrid[start.row][start.col].isStart = true;
    clearAround(newGrid, start.row, start.col);
  }
  if (target) {
    newGrid[target.row][target.col].isWall = false;
    newGrid[target.row][target.col].isTarget = true;
    clearAround(newGrid, target.row, target.col);
  }

  return newGrid;
}

function clearAround(grid: Grid, r: number, c: number): void {
  const rows = grid.length;
  const cols = grid[0].length;
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
      if (!grid[nr][nc].isStart && !grid[nr][nc].isTarget) {
        grid[nr][nc].isWall = false;
      }
    }
  }
}

type Orientation = 'horizontal' | 'vertical';

function chooseOrientation(height: number, width: number): Orientation {
  if (width < height) return 'horizontal';
  if (height < width) return 'vertical';
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}

function divide(
  grid: Grid,
  top: number,
  left: number,
  bottom: number,
  right: number,
  orientation: Orientation
): void {
  const height = bottom - top + 1;
  const width = right - left + 1;
  if (height < 3 || width < 3) return;

  if (orientation === 'horizontal') {
    // Even rows only for wall placement (so passage is between cells)
    const possibleRows: number[] = [];
    for (let r = top + 1; r < bottom; r += 2) possibleRows.push(r);
    if (possibleRows.length === 0) return;
    const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    const possibleCols: number[] = [];
    for (let c = left; c <= right; c += 2) possibleCols.push(c);
    if (possibleCols.length === 0) return;
    const passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    for (let c = left; c <= right; c++) {
      if (c !== passageCol) {
        grid[wallRow][c].isWall = true;
      }
    }

    // Recurse above and below
    divide(grid, top, left, wallRow - 1, right, chooseOrientation(wallRow - top, width));
    divide(grid, wallRow + 1, left, bottom, right, chooseOrientation(bottom - wallRow, width));
  } else {
    const possibleCols: number[] = [];
    for (let c = left + 1; c < right; c += 2) possibleCols.push(c);
    if (possibleCols.length === 0) return;
    const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    const possibleRows: number[] = [];
    for (let r = top; r <= bottom; r += 2) possibleRows.push(r);
    if (possibleRows.length === 0) return;
    const passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    for (let r = top; r <= bottom; r++) {
      if (r !== passageRow) {
        grid[r][wallCol].isWall = true;
      }
    }

    divide(grid, top, left, bottom, wallCol - 1, chooseOrientation(height, wallCol - left));
    divide(grid, top, wallCol + 1, bottom, right, chooseOrientation(height, right - wallCol));
  }
}
