import type { AlgorithmResult } from '../types/algorithm';
import type { Grid, Node, Position } from '../types/grid';
import { Queue } from '../dataStructures/Queue';
import { getNeighbors, reconstructPath } from '../utils/grid';

/**
 * Breadth-First Search.
 *
 * Data structure: FIFO Queue
 * Guarantees shortest path on unweighted grids (yes; uniform edge cost).
 *
 * Strategy: Explore every neighbor at the present depth level before moving on
 * to nodes at the next depth level. Visits nodes in order of increasing
 * unweighted distance from the start, which is why it finds the shortest path.
 */
export function bfs(
  inputGrid: Grid,
  start: Position,
  target: Position
): AlgorithmResult {
  // Work on a shallow-copied grid so we don't mutate the input.
  const grid = inputGrid.map((row) => row.map((n) => ({ ...n, previousNode: null as Node | null })));
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];

  const frames: AlgorithmResult['frames'] = [];
  const visitedInOrder: Node[] = [];
  let nodesExplored = 0;

  const queue = new Queue<Node>();
  queue.enqueue(startNode);
  startNode.isVisited = true;

  frames.push({
    type: 'current',
    position: { row: startNode.row, col: startNode.col },
  });

  const visited = new Set<string>();
  visited.add(nodeKey(startNode));

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
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

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const key = nodeKey(neighbor);
      if (visited.has(key) || neighbor.isWall) continue;
      visited.add(key);
      neighbor.previousNode = current;
      neighbor.isFrontier = true;
      queue.enqueue(neighbor);

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
