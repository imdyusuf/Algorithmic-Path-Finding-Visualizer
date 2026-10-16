import type { Node, Position } from '../types/grid';

/**
 * Manhattan distance for 4-directional grids. Admissible for 4-directional
 * movement (never overestimates actual shortest path).
 */
export function manhattanDistance(a: Position | Node, b: Position | Node): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Euclidean distance. Used for diagonal movement.
 */
export function euclideanDistance(a: Position | Node, b: Position | Node): number {
  const dr = a.row - b.row;
  const dc = a.col - b.col;
  return Math.sqrt(dr * dr + dc * dc);
}

/**
 * Chebyshev distance - for 8-directional movement with uniform cost.
 */
export function chebyshevDistance(a: Position | Node, b: Position | Node): number {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}
