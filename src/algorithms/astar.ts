import type { AlgorithmResult } from '../types/algorithm';
import type { Grid, Node, Position } from '../types/grid';
import { MinHeap } from '../dataStructures/MinHeap';
import { getNeighbors, reconstructPath } from '../utils/grid';
import { manhattanDistance } from '../utils/heuristics';

/**
 * A* Search.
 *
 * Data structure: Min-Heap keyed by f(n) = g(n) + h(n), where
 *   g(n) = cost from start to n
 *   h(n) = heuristic estimate from n to target
 * Guarantees shortest path: YES, provided h(n) is admissible (Manhattan is).
 *
 * Strategy: Combines Dijkstra's optimality with a greedy heuristic. Nodes
 * that appear closer to the target are prioritized, so A* typically explores
 * far fewer nodes than Dijkstra while still guaranteeing an optimal path
 * (for admissible heuristics).
 */
export function astar(
  inputGrid: Grid,
  start: Position,
  target: Position
): AlgorithmResult {
  const grid = inputGrid.map((row) =>
    row.map((n) => ({
      ...n,
      previousNode: null as Node | null,
      distance: Infinity,
      heuristic: 0,
    }))
  );
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];

  const frames: AlgorithmResult['frames'] = [];
  const visitedInOrder: Node[] = [];
  let nodesExplored = 0;

  startNode.distance = 0; // g-cost
  startNode.heuristic = manhattanDistance(startNode, targetNode);

  const heap = new MinHeap<Node>();
  heap.insert(startNode.distance + startNode.heuristic, startNode);

  // closedSet: nodes we've already processed (popped from heap)
  const closedSet = new Set<string>();
  // Keep track of best known g-cost for each node so we can skip stale heap entries
  const bestG = new Map<string, number>();
  bestG.set(nodeKey(startNode), 0);

  while (!heap.isEmpty()) {
    const currentItem = heap.extractMin()!;
    const current = currentItem.value;
    const currentKey = nodeKey(current);

    if (closedSet.has(currentKey)) continue;
    // Stale entry: we already found a better path
    if ((bestG.get(currentKey) ?? Infinity) < current.distance) continue;

    closedSet.add(currentKey);
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
      if (closedSet.has(nKey) || neighbor.isWall) continue;
      const tentativeG = current.distance + 1;
      const previousBest = bestG.get(nKey) ?? Infinity;
      if (tentativeG < previousBest) {
        neighbor.distance = tentativeG;
        neighbor.heuristic = manhattanDistance(neighbor, targetNode);
        neighbor.previousNode = current;
        neighbor.isFrontier = true;
        bestG.set(nKey, tentativeG);
        const f = tentativeG + neighbor.heuristic;
        heap.insert(f, neighbor);

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
