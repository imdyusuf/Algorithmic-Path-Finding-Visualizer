import type { AlgorithmResult } from '../types/algorithm';
import type { Grid, Node, Position } from '../types/grid';
import { MinHeap } from '../dataStructures/MinHeap';
import { getNeighbors, reconstructPath } from '../utils/grid';
import { manhattanDistance } from '../utils/heuristics';

/**
 * Greedy Best-First Search.
 *
 * Data structure: Min-Heap keyed by h(n) (heuristic to target).
 * Guarantees shortest path: NO.
 *
 * Strategy: Always expand the node that appears closest to the target, ignoring
 * the distance already traveled. It is often faster than A* in terms of nodes
 * explored but does not guarantee the shortest path (it can get "tunneled"
 * into a local optimum or take a longer route around obstacles).
 */
export function greedyBestFirst(
  inputGrid: Grid,
  start: Position,
  target: Position
): AlgorithmResult {
  const grid = inputGrid.map((row) =>
    row.map((n) => ({
      ...n,
      previousNode: null as Node | null,
      distance: Infinity,
      heuristic: Infinity,
    }))
  );
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];

  const frames: AlgorithmResult['frames'] = [];
  const visitedInOrder: Node[] = [];
  let nodesExplored = 0;

  startNode.heuristic = manhattanDistance(startNode, targetNode);
  startNode.distance = 0;

  const heap = new MinHeap<Node>();
  heap.insert(startNode.heuristic, startNode);

  const visited = new Set<string>();

  while (!heap.isEmpty()) {
    const currentItem = heap.extractMin()!;
    const current = currentItem.value;
    const currentKey = nodeKey(current);

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    nodesExplored++;
    visitedInOrder.push(current);
    current.isVisited = true;

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
      const nKey = nodeKey(neighbor);
      if (visited.has(nKey) || neighbor.isWall) continue;
      const h = manhattanDistance(neighbor, targetNode);
      if (h < neighbor.heuristic) {
        neighbor.heuristic = h;
        neighbor.distance = current.distance + 1;
        neighbor.previousNode = current;
        neighbor.isFrontier = true;
        heap.insert(h, neighbor);

        frames.push({
          type: 'frontier',
          position: { row: neighbor.row, col: neighbor.col },
        });
      }
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
