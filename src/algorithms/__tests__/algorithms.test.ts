/**
 * Algorithm correctness tests. These test the core algorithm logic without
 * any React dependency. Run with: npx vitest run
 */
import { describe, it, expect } from 'vitest';
import { bfs } from '../bfs';
import { dfs } from '../dfs';
import { dijkstra } from '../dijkstra';
import { astar } from '../astar';
import { greedyBestFirst } from '../greedyBestFirst';
import type { Grid } from '../../types/grid';
import { createGrid } from '../../utils/grid';

function makeGrid(rows: number, cols: number): Grid {
  const g = createGrid(rows, cols);
  // createGrid places start/target; we need to reset them to known positions for tests
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      g[r][c].isStart = false;
      g[r][c].isTarget = false;
      g[r][c].isWall = false;
      g[r][c].isVisited = false;
      g[r][c].isFrontier = false;
      g[r][c].isPath = false;
    }
  }
  return g;
}

const ALGOS = {
  bfs: { name: 'BFS', fn: bfs, guaranteesShortest: true },
  dfs: { name: 'DFS', fn: dfs, guaranteesShortest: false },
  dijkstra: { name: 'Dijkstra', fn: dijkstra, guaranteesShortest: true },
  astar: { name: 'A*', fn: astar, guaranteesShortest: true },
  greedy: { name: 'Greedy BFS', fn: greedyBestFirst, guaranteesShortest: false },
} as const;

describe('pathfinding algorithms', () => {
  it('finds a path on an open grid where start == target', () => {
    for (const [key, algo] of Object.entries(ALGOS)) {
      const grid = makeGrid(5, 5);
      grid[2][2].isStart = true;
      grid[2][2].isTarget = true;
      const res = algo.fn(grid, { row: 2, col: 2 }, { row: 2, col: 2 });
      expect(res.path, `${key} should return a path`).not.toBeNull();
      expect(res.pathLength, `${key} path length should be 0`).toBe(0);
    }
  });

  it('finds a path when start is adjacent to target', () => {
    for (const [key, algo] of Object.entries(ALGOS)) {
      const grid = makeGrid(5, 5);
      grid[2][2].isStart = true;
      grid[2][3].isTarget = true;
      const res = algo.fn(grid, { row: 2, col: 2 }, { row: 2, col: 3 });
      expect(res.path, `${key} should return a path`).not.toBeNull();
      expect(res.pathLength, `${key} path length should be 1`).toBe(1);
    }
  });

  it('finds a path on a fully open 5x5 grid', () => {
    for (const [key, algo] of Object.entries(ALGOS)) {
      const grid = makeGrid(5, 5);
      grid[0][0].isStart = true;
      grid[4][4].isTarget = true;
      const res = algo.fn(grid, { row: 0, col: 0 }, { row: 4, col: 4 });
      expect(res.path, `${key} should find a path`).not.toBeNull();
      // shortest Manhattan path is 8 steps (4 down + 4 right)
      if (algo.guaranteesShortest) {
        expect(res.pathLength, `${key} should find shortest path (8)`).toBe(8);
      }
    }
  });

  it('returns no path when target is completely walled off', () => {
    for (const [key, algo] of Object.entries(ALGOS)) {
      const grid = makeGrid(7, 7);
      grid[1][1].isStart = true;
      grid[5][5].isTarget = true;
      // Build a box around target
      for (let c = 3; c <= 6; c++) {
        grid[3][c].isWall = true;
      }
      for (let r = 3; r <= 6; r++) {
        grid[r][3].isWall = true;
      }
      grid[4][4].isWall = false; // just a cell inside the box
      // But also seal top and left properly
      // Ensure the target at (5,5) is fully enclosed
      for (let c = 3; c <= 6; c++) grid[6]?.[c] !== undefined && (grid[6][c].isWall = true);
      for (let r = 3; r <= 6; r++) grid[r]?.[6] !== undefined && (grid[r][6].isWall = true);
      const res = algo.fn(grid, { row: 1, col: 1 }, { row: 5, col: 5 });
      expect(res.path, `${key} should return null when no path exists`).toBeNull();
      expect(res.pathLength, `${key} path length should be 0`).toBe(0);
    }
  });

  it('BFS explores level-by-level and does not revisit nodes', () => {
    const grid = makeGrid(5, 5);
    grid[0][0].isStart = true;
    grid[4][4].isTarget = true;
    const res = bfs(grid, { row: 0, col: 0 }, { row: 4, col: 4 });
    // Should visit each node at most once
    const visitPositions = new Set(
      res.visitedInOrder.map((n) => `${n.row},${n.col}`)
    );
    expect(visitPositions.size).toBe(res.visitedInOrder.length);
  });

  it('DFS explores all reachable nodes until target is found', () => {
    const grid = makeGrid(5, 5);
    grid[0][0].isStart = true;
    grid[4][4].isTarget = true;
    const res = dfs(grid, { row: 0, col: 0 }, { row: 4, col: 4 });
    expect(res.path).not.toBeNull();
    // DFS may visit many nodes but should never visit the same node twice
    const visitPositions = new Set(
      res.visitedInOrder.map((n) => `${n.row},${n.col}`)
    );
    expect(visitPositions.size).toBe(res.visitedInOrder.length);
  });

  it('A* explores fewer nodes than BFS/Dijkstra on an open grid (heuristic helps)', () => {
    const rows = 15;
    const cols = 30;
    const grid = makeGrid(rows, cols);
    grid[7][1].isStart = true;
    grid[7][28].isTarget = true;
    const bfsRes = bfs(grid, { row: 7, col: 1 }, { row: 7, col: 28 });
    const dijkRes = dijkstra(grid, { row: 7, col: 1 }, { row: 7, col: 28 });
    const aRes = astar(grid, { row: 7, col: 1 }, { row: 7, col: 28 });
    // On an open grid A* should explore strictly fewer nodes
    expect(aRes.nodesExplored).toBeLessThan(bfsRes.nodesExplored);
    expect(aRes.nodesExplored).toBeLessThan(dijkRes.nodesExplored);
    // But all optimal algorithms should find same path length
    expect(aRes.pathLength).toBe(bfsRes.pathLength);
    expect(aRes.pathLength).toBe(dijkRes.pathLength);
  });

  it('maze generation does not overwrite start/target', () => {
    // Import here to avoid circular issues at module load
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { generateRecursiveDivision } = require('../../maze/recursiveDivision');
    const { generateRandomizedDfs } = require('../../maze/randomizedDfs');
    const { generateRandomWalls } = require('../../maze/randomWalls');

    const grid = createGrid(21, 31);
    // Start/target already set by createGrid
    let startR = -1, startC = -1, targetR = -1, targetC = -1;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c].isStart) { startR = r; startC = c; }
        if (grid[r][c].isTarget) { targetR = r; targetC = c; }
      }
    }

    for (const gen of [generateRecursiveDivision, generateRandomizedDfs]) {
      const after = gen(grid);
      expect(after[startR][startC].isStart).toBe(true);
      expect(after[startR][startC].isWall).toBe(false);
      expect(after[targetR][targetC].isTarget).toBe(true);
      expect(after[targetR][targetC].isWall).toBe(false);
    }

    const afterRand = generateRandomWalls(grid, 0.4);
    expect(afterRand[startR][startC].isStart).toBe(true);
    expect(afterRand[startR][startC].isWall).toBe(false);
    expect(afterRand[targetR][targetC].isTarget).toBe(true);
    expect(afterRand[targetR][targetC].isWall).toBe(false);
  });
});
