import type { Grid } from '../types/grid';
import { cloneGrid, findStart, findTarget } from '../utils/grid';
import { Stack } from '../dataStructures/Stack';

/**
 * Randomized Depth-First Search maze (also known as "recursive backtracker").
 *
 * Creates a perfect maze (one path between any two cells) with long winding
 * corridors. Operates on a 2x2 cell grid, carving passages.
 *
 * We start with all cells as walls, then carve out passages via DFS.
 */
export function generateRandomizedDfs(grid: Grid): Grid {
  const newGrid = cloneGrid(grid);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  // Start with everything as walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newGrid[r][c].isStart && !newGrid[r][c].isTarget) {
        newGrid[r][c].isWall = true;
      }
    }
  }

  // We carve on odd coordinates. Find valid start point inside the border.
  const startR = 1;
  const startC = 1;
  newGrid[startR][startC].isWall = false;

  const stack = new Stack<{ r: number; c: number }>();
  stack.push({ r: startR, c: startC });
  const visited = new Set<string>([`${startR},${startC}`]);

  while (!stack.isEmpty()) {
    const current = stack.pop()!;
    const { r, c } = current;

    // Collect unvisited neighbors (2 steps away in 4 directions)
    const neighbors: { r: number; c: number; wallR: number; wallC: number }[] = [];
    const deltas = [
      { dr: -2, dc: 0 },
      { dr: 2, dc: 0 },
      { dr: 0, dc: -2 },
      { dr: 0, dc: 2 },
    ];
    for (const { dr, dc } of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited.has(`${nr},${nc}`)) {
        neighbors.push({ r: nr, c: nc, wallR: r + dr / 2, wallC: c + dc / 2 });
      }
    }

    if (neighbors.length > 0) {
      stack.push(current);
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Carve through the wall between current and chosen
      newGrid[chosen.wallR][chosen.wallC].isWall = false;
      newGrid[chosen.r][chosen.c].isWall = false;
      visited.add(`${chosen.r},${chosen.c}`);
      stack.push({ r: chosen.r, c: chosen.c });
    }
  }

  // Make sure start/target are open. For DFS maze we place start at top-left
  // carved area and target at bottom-right carved area, but we respect whatever
  // start/target the user already set.
  const start = findStart(newGrid);
  const target = findTarget(newGrid);
  if (start) {
    newGrid[start.row][start.col].isWall = false;
    newGrid[start.row][start.col].isStart = true;
    // Open a passage to the nearest carved cell
    openNeighbor(newGrid, start.row, start.col);
  }
  if (target) {
    newGrid[target.row][target.col].isWall = false;
    newGrid[target.row][target.col].isTarget = true;
    openNeighbor(newGrid, target.row, target.col);
  }

  return newGrid;
}

function openNeighbor(grid: Grid, r: number, c: number): void {
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
      if (!grid[nr][nc].isWall) return; // already open
    }
  }
  // If all neighbors are walls, carve one
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
      if (!grid[nr][nc].isStart && !grid[nr][nc].isTarget) {
        grid[nr][nc].isWall = false;
        return;
      }
    }
  }
}
