import type { AlgorithmDefinition, AlgorithmFunction, AlgorithmId } from '../types/algorithm';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { astar } from './astar';
import { greedyBestFirst } from './greedyBestFirst';

export const ALGORITHMS: Record<AlgorithmId, AlgorithmDefinition> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search',
    shortName: 'BFS',
    description:
      'Explores all nodes at the present depth before moving on to nodes at the next depth level. Guarantees the shortest path on unweighted grids.',
    howItWorks:
      'BFS starts at the source and explores every neighbor in FIFO order using a queue. This level-by-level expansion ensures that the first time the target is reached, it is via the shortest (minimum edge count) path.',
    dataStructure: 'Queue (FIFO)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    usesHeuristic: false,
    useCases: [
      'Shortest path on unweighted graphs',
      'Connected components',
      'Flood fill / level-order traversal',
      'Peer-to-peer network broadcasting',
    ],
  },
  dfs: {
    id: 'dfs',
    name: 'Depth-First Search',
    shortName: 'DFS',
    description:
      'Explores as far as possible along a single branch before backtracking. Does NOT guarantee a shortest path.',
    howItWorks:
      'DFS uses a stack (or recursion) to dive deep into one direction until it hits a dead-end or the target, then backtracks. It is memory-efficient for deep graphs but can produce very long paths.',
    dataStructure: 'Stack (LIFO)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    usesHeuristic: false,
    useCases: [
      'Maze generation',
      'Topological sorting',
      'Cycle detection',
      'Connected components in dense graphs',
    ],
  },
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    shortName: 'Dijkstra',
    description:
      'Explores nodes in order of increasing cost from the start using a min-heap. Guarantees the shortest path for non-negative edge weights.',
    howItWorks:
      "Dijkstra's repeatedly selects the unvisited node with the smallest known distance, marks it as visited, and relaxes the distance to each neighbor. On an unweighted grid it produces identical results to BFS but works for weighted graphs.",
    dataStructure: 'Min-Heap (Priority Queue)',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    usesHeuristic: false,
    useCases: [
      'Shortest path in weighted graphs',
      'Network routing (OSPF, IS-IS)',
      'Mapping & navigation (weighted)',
      'Robotics motion planning',
    ],
  },
  astar: {
    id: 'astar',
    name: 'A* Search',
    shortName: 'A*',
    description:
      'Uses the cost from the start plus a heuristic estimate to the target to efficiently find a shortest path. Uses Manhattan distance on 4-direction grids.',
    howItWorks:
      'A* evaluates nodes by f(n) = g(n) + h(n), where g is the known cost from start and h is a heuristic estimate to the target. With an admissible h (like Manhattan distance for 4-direction movement), A* guarantees the shortest path while exploring far fewer nodes than Dijkstra.',
    dataStructure: 'Min-Heap (Priority Queue)',
    timeComplexity: 'O((V + E) log V) worst-case; often much faster in practice',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    usesHeuristic: true,
    useCases: [
      'Games & NPC pathfinding',
      'Robotics navigation',
      'Route planning',
      'Any weighted search where a good heuristic exists',
    ],
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy Best-First Search',
    shortName: 'Greedy BFS',
    description:
      'Always expands the node with the smallest heuristic distance to the target. Fast but does NOT guarantee the shortest path.',
    howItWorks:
      'Greedy BFS uses only h(n) (heuristic to target) to decide which node to open next. It aggressively chases the target and often explores very few nodes, but can overshoot and return a non-optimal path when obstacles force detours.',
    dataStructure: 'Min-Heap (Priority Queue)',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    usesHeuristic: true,
    useCases: [
      'Approximate search when speed matters more than optimality',
      'Heuristic baselines for comparison',
      'Large open grids with few obstacles',
    ],
  },
};

export const ALGORITHM_FUNCTIONS: Record<AlgorithmId, AlgorithmFunction> = {
  bfs,
  dfs,
  dijkstra,
  astar,
  greedy: greedyBestFirst,
};

export const ALGORITHM_ORDER: AlgorithmId[] = ['bfs', 'dfs', 'dijkstra', 'astar', 'greedy'];
