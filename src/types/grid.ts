export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isTarget: boolean;
  isWall: boolean;
  isVisited: boolean;
  isFrontier: boolean;
  isPath: boolean;
  isCurrent: boolean;
  distance: number;
  heuristic: number;
  previousNode: Node | null;
}

export type Grid = Node[][];

export type GridDensity = 'small' | 'medium' | 'large';

export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface Position {
  row: number;
  col: number;
}

export function createEmptyNode(row: number, col: number): Node {
  return {
    row,
    col,
    isStart: false,
    isTarget: false,
    isWall: false,
    isVisited: false,
    isFrontier: false,
    isPath: false,
    isCurrent: false,
    distance: Infinity,
    heuristic: 0,
    previousNode: null,
  };
}
