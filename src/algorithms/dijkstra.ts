import type { AlgorithmResult } from '../types/algorithm';
import type { Grid, Node, Position } from '../types/grid';
import { MinHeap } from '../dataStructures/MinHeap';
import { getNeighbors, reconstructPath } from '../utils/grid';

/**
 * Dijkstra's Algorithm.
 *
 * Data structure: Min-Heap (priority queue) keyed by distance from start.
 * Guarantees shortest path on non-negative edge weights (yes).
 *
 * Strategy: At each step, select the unvisited node with the smallest known
 * distance from start, then relax its neighbors. Equivalent to BFS on a
 * weighted graph. On an unweighted grid, produces the same path as BFS but
 * explores all directions uniformly.
 */
export function dijkstra(
  inputGrid: Grid,
  start: Position,
  target: Position
): AlgorithmResult {
  const grid = inputGrid.map((row) =>
    row.map((n) => ({ ...n, previousNode: null as Node | null, distance: Infinity }))
  );
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];

  const frames: AlgorithmResult['frames'] = [];
  const visitedInOrder: Node[] = [];
  let nodesExplored = 0;

  startNode.distance = 0;
  const heap = new MinHeap<Node>();
  heap.insert(0, startNode);

  // Track visited nodes - once popped from heap, we have their shortest distance
  const visited = new Set<string>();

  while (!heap.isEmpty()) {
    const currentItem = heap.extractMin()!;
    const current = currentItem.value;
    const currentKey = nodeKey(current);

    if (visited.has(currentKey)) continue;
    if (current.distance > currentItem.priority) {
      // Stale entry, skip
      continue;
    }

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
      if (visited.has(nodeKey(neighbor)) || neighbor.isWall) continue;
      const newDist = current.distance + 1;
      if (newDist < neighbor.distance) {
        neighbor.distance = newDist;
        neighbor.previousNode = current;
        neighbor.isFrontier = true;
        heap.insert(newDist, neighbor);

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
