import type { Grid, Node, Position } from './grid';

export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'greedy';

export type MazeType =
  | 'random-obstacles'
  | 'random-walls'
  | 'recursive-division'
  | 'randomized-dfs';

export type VisualizerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'no-path';

export type Speed = 'slow' | 'normal' | 'fast' | 'instant';

export interface VisualizationFrame {
  type: 'visit' | 'frontier' | 'current' | 'path' | 'reset-node';
  node?: Node;
  position?: Position;
  path?: Position[];
  visitedCount?: number;
  frontierCount?: number;
}

export interface AlgorithmResult {
  frames: VisualizationFrame[];
  visitedInOrder: Node[];
  path: Node[] | null;
  pathLength: number;
  nodesExplored: number;
}

export interface AlgorithmDefinition {
  id: AlgorithmId;
  name: string;
  shortName: string;
  description: string;
  howItWorks: string;
  dataStructure: string;
  timeComplexity: string;
  spaceComplexity: string;
  guaranteesShortestPath: boolean;
  usesHeuristic: boolean;
  useCases: string[];
}

export interface Statistics {
  algorithm: AlgorithmId | null;
  nodesExplored: number;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  frontierNodes: number;
  gridDimensions: { rows: number; cols: number };
}

export interface ComparisonResult {
  algorithmId: AlgorithmId;
  algorithmName: string;
  nodesExplored: number;
  pathLength: number;
  executionTime: number;
  pathFound: boolean;
}

export type AlgorithmFunction = (
  grid: Grid,
  start: Position,
  target: Position
) => AlgorithmResult;
