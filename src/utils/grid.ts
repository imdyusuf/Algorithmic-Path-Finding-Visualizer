import type { Grid, GridDensity, GridDimensions, Node, Position } from '../types/grid';
import { createEmptyNode } from '../types/grid';

/**
 * Create a fresh grid with the given dimensions, placing start/target near the
 * center-left and center-right.
 */
export function createGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row: Node[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(createEmptyNode(r, c));
    }
    grid.push(row);
  }
  const startPos: Position = { row: Math.floor(rows / 2), col: Math.floor(cols / 6) };
  const targetPos: Position = { row: Math.floor(rows / 2), col: cols - Math.floor(cols / 6) - 1 };
  grid[startPos.row][startPos.col].isStart = true;
  grid[targetPos.row][targetPos.col].isTarget = true;
  return grid;
}

export function cloneGrid(grid: Grid): Grid {
  const newGrid: Grid = [];
  for (let r = 0; r < grid.length; r++) {
    const row: Node[] = [];
    for (let c = 0; c < grid[r].length; c++) {
      const n = grid[r][c];
      row.push({
        ...n,
        // previousNode is only used during algorithm execution and doesn't need deep cloning
        previousNode: null,
      });
    }
    newGrid.push(row);
  }
  return newGrid;
}

export function resetVisitedAndPath(grid: Grid): Grid {
  const newGrid = cloneGrid(grid);
  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {
      const node = newGrid[r][c];
      node.isVisited = false;
      node.isFrontier = false;
      node.isPath = false;
      node.isCurrent = false;
      node.distance = Infinity;
      node.heuristic = 0;
      node.previousNode = null;
    }
  }
  return newGrid;
}

export function clearWalls(grid: Grid): Grid {
  const newGrid = cloneGrid(grid);
  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {
      const node = newGrid[r][c];
      if (!node.isStart && !node.isTarget) {
        node.isWall = false;
      }
      node.isVisited = false;
      node.isFrontier = false;
      node.isPath = false;
      node.isCurrent = false;
      node.distance = Infinity;
      node.heuristic = 0;
      node.previousNode = null;
    }
  }
  return newGrid;
}

export function findStart(grid: Grid): Position | null {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isStart) return { row: r, col: c };
    }
  }
  return null;
}

export function findTarget(grid: Grid): Position | null {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].isTarget) return { row: r, col: c };
    }
  }
  return null;
}

export function getNeighbors(
  grid: Grid,
  node: Node,
  allowDiagonal = false
): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;

  // 4-directional movement
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  if (allowDiagonal) {
    if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
    if (row > 0 && col < cols - 1) neighbors.push(grid[row - 1][col + 1]);
    if (row < rows - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);
    if (row < rows - 1 && col < cols - 1) neighbors.push(grid[row + 1][col + 1]);
  }

  return neighbors;
}

/**
 * Given a target node, backtrack via previousNode to reconstruct the shortest path.
 */
export function reconstructPath(target: Node): Node[] {
  const path: Node[] = [];
  let current: Node | null = target;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}

/**
 * Calculate responsive grid dimensions based on container width and height.
 * Ensures the grid always fills the available space with square-ish cells.
 */
export function calculateGridDimensions(
  containerWidth: number,
  containerHeight: number,
  density: GridDensity
): GridDimensions {
  let cellSize: number;
  switch (density) {
    case 'small':
      cellSize = 36;
      break;
    case 'medium':
      cellSize = 26;
      break;
    case 'large':
      cellSize = 20;
      break;
    default:
      cellSize = 26;
  }

  // On mobile we use larger cells regardless
  if (containerWidth < 480) {
    cellSize = Math.max(cellSize, 24);
  }

  const cols = Math.max(10, Math.floor(containerWidth / cellSize));
  const rows = Math.max(10, Math.floor(containerHeight / cellSize));

  return { rows, cols };
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}
