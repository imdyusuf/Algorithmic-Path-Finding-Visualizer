import type { AlgorithmResult } from '../types/algorithm';
import type { Grid, Node, Position } from '../types/grid';
import { Stack } from '../dataStructures/Stack';
import { getNeighbors, reconstructPath } from '../utils/grid';

/**
 * Depth-First Search.
 *
 * Data structure: LIFO Stack
 * Guarantees shortest path: NO (it explores as far as possible along each branch before backtracking).
 *
 * Strategy: Push neighbors onto the stack and explore as deep as possible before
 * backtracking. DFS will find a path if one exists, but there is no guarantee
 * that it is the shortest path.
 */
export function dfs(
  inputGrid: Grid,
  start: Position,
  target: Position
): AlgorithmResult {
  const grid = inputGrid.map((row) => row.map((n) => ({ ...n, previousNode: null as Node | null })));
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];

  const frames: AlgorithmResult['frames'] = [];
  const visitedInOrder: Node[] = [];
  let nodesExplored = 0;

  const stack = new Stack<Node>();
  stack.push(startNode);

  const visited = new Set<string>();
  visited.add(nodeKey(startNode));
  startNode.isVisited = true;

  while (!stack.isEmpty()) {
    const current = stack.pop()!;
    nodesExplored++;
    visitedInOrder.push(current);

    frames.push({
      type: 'visit',
      position: { row: current.row, col: current.col },
      visitedCount: nodesExplored,
    });

    if (current.row === targetNode.row && current.col === targetNode.col) {
      const path = reconstructPath(current);
      const pathPositions = path.map((n) => ({ row: n.row, col: n.col }));
      frames.push({ type: 'path', path: pathPositions });
      return {
        frames,
        visitedInOrder,
        path,
        pathLength: path.length - 1,
        nodesExplored,
      };
    }

    // Reverse neighbors so that the order of exploration matches reading order (up/down/left/right)
    const neighbors = getNeighbors(grid, current).reverse();
    for (const neighbor of neighbors) {
      const key = nodeKey(neighbor);
      if (visited.has(key) || neighbor.isWall) continue;
      visited.add(key);
      neighbor.previousNode = current;
      neighbor.isFrontier = true;
      stack.push(neighbor);

      frames.push({
        type: 'frontier',
        position: { row: neighbor.row, col: neighbor.col },
      });
    }

    frames.push({
      type: 'current',
      position: { row: current.row, col: current.col },
    });
  }

  return {
    frames,
    visitedInOrder,
    path: null,
    pathLength: 0,
    nodesExplored,
  };
}

function nodeKey(n: Node): string {
  return `${n.row},${n.col}`;
}
