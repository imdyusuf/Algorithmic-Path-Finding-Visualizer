import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AlgorithmId,
  AlgorithmResult,
  ComparisonResult,
  Statistics,
  VisualizationFrame,
  VisualizerStatus,
} from '../types/algorithm';
import type { Grid, Position } from '../types/grid';
import { ALGORITHM_FUNCTIONS, ALGORITHMS } from '../algorithms/definitions';
import { Speed } from '../types/algorithm';
import { resetVisitedAndPath } from '../utils/grid';

export interface UseVisualizerReturn {
  status: VisualizerStatus;
  selectedAlgorithm: AlgorithmId;
  setSelectedAlgorithm: (a: AlgorithmId) => void;
  speed: Speed;
  setSpeed: (s: Speed) => void;
  statistics: Statistics;
  comparisonResults: ComparisonResult[] | null;
  pathFound: boolean | null;
  start: (grid: Grid, startPos: Position, targetPos: Position) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  runComparison: (grid: Grid, startPos: Position, targetPos: Position) => void;
  clearComparison: () => void;
  animatedGrid: Grid;
}

const SPEED_DELAYS: Record<Speed, number> = {
  slow: 35,
  normal: 18,
  fast: 8,
  instant: 0,
};

/**
 * Hook that owns all visualization state: selected algorithm, speed,
 * animation frames, pause/resume/stop controls, and statistics. It consumes
 * a grid from useGrid and produces an "animatedGrid" that the <Grid />
 * component renders.
 */
export function useVisualizer(): UseVisualizerReturn {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmId>('astar');
  const [speed, setSpeed] = useState<Speed>('normal');
  const speedRef = useRef<Speed>('normal');
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  const [status, setStatus] = useState<VisualizerStatus>('idle');
  const [statistics, setStatistics] = useState<Statistics>({
    algorithm: null,
    nodesExplored: 0,
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    frontierNodes: 0,
    gridDimensions: { rows: 0, cols: 0 },
  });
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[] | null>(null);
  const [animatedGrid, setAnimatedGrid] = useState<Grid | null>(null);
  const [pathFound, setPathFound] = useState<boolean | null>(null);

  // Animation refs
  const framesRef = useRef<VisualizationFrame[]>([]);
  const frameIndexRef = useRef(0);
  const currentGridRef = useRef<Grid | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const visitedCountRef = useRef(0);
  const frontierCountRef = useRef(0);
  const endTimeRef = useRef(0);
  const dimsRef = useRef<{ rows: number; cols: number }>({ rows: 0, cols: 0 });
  const selectedAlgoRef = useRef<AlgorithmId>('astar');
  const totalExploredRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    framesRef.current = [];
    frameIndexRef.current = 0;
    currentGridRef.current = null;
    visitedCountRef.current = 0;
    frontierCountRef.current = 0;
    isPausedRef.current = false;
    setAnimatedGrid(null);
    setStatus('idle');
    setPathFound(null);
  }, []);

  const runAlgorithmOnGrid = useCallback(
    (algorithm: AlgorithmId, grid: Grid, startPos: Position, targetPos: Position): AlgorithmResult => {
      const fn = ALGORITHM_FUNCTIONS[algorithm];
      return fn(grid, startPos, targetPos);
    },
    []
  );

  const start = useCallback(
    (grid: Grid, startPos: Position, targetPos: Position) => {
      // Reset any prior animation
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setComparisonResults(null);

      const startTime = performance.now();
      startTimeRef.current = startTime;
      endTimeRef.current = 0;

      // Run algorithm synchronously to produce all frames
      const cleanGrid = resetVisitedAndPath(grid);
      const result = runAlgorithmOnGrid(selectedAlgorithm, cleanGrid, startPos, targetPos);

      framesRef.current = result.frames;
      frameIndexRef.current = 0;
      currentGridRef.current = cleanGrid.map((row) => row.map((n) => ({ ...n })));
      visitedCountRef.current = 0;
      frontierCountRef.current = 0;
      isPausedRef.current = false;
      dimsRef.current = { rows: grid.length, cols: grid[0]?.length ?? 0 };
      selectedAlgoRef.current = selectedAlgorithm;
      totalExploredRef.current = result.nodesExplored;

      setAnimatedGrid(currentGridRef.current);
      setStatus('running');
      setPathFound(null);
      setStatistics({
        algorithm: selectedAlgorithm,
        nodesExplored: 0,
        nodesVisited: 0,
        pathLength: 0,
        executionTime: 0,
        frontierNodes: 0,
        gridDimensions: dimsRef.current,
      });

      const tick = (now: number) => {
        if (isPausedRef.current) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const currentSpeed = speedRef.current;
        const delay = SPEED_DELAYS[currentSpeed];

        if (delay === 0) {
          // Instant: apply all remaining frames immediately
          applyAllFrames(framesRef.current, currentGridRef.current!);
          const finalGrid = currentGridRef.current!;
          const pathLen = countPath(finalGrid);
          const visitedCount = countVisited(finalGrid);
          const frontierCount = countFrontier(finalGrid);
          setAnimatedGrid([...finalGrid.map((r) => [...r])]);
          const endTime = performance.now();
          endTimeRef.current = endTime;
          const hasPath = result.path !== null;
          setPathFound(hasPath);
          setStatus(hasPath ? 'completed' : 'no-path');
          setStatistics({
            algorithm: selectedAlgorithm,
            nodesExplored: result.nodesExplored,
            nodesVisited: visitedCount,
            pathLength: hasPath ? pathLen : 0,
            executionTime: Math.round(endTime - startTime),
            frontierNodes: frontierCount,
            gridDimensions: { rows: grid.length, cols: grid[0]?.length ?? 0 },
          });
          rafRef.current = null;
          return;
        }

        if (now - lastTickRef.current < delay) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        lastTickRef.current = now;

        // Apply multiple frames per tick to keep up with speed
        let framesThisTick = 1;
        if (currentSpeed === 'fast') framesThisTick = 3;
        else if (currentSpeed === 'normal') framesThisTick = 2;

        for (let i = 0; i < framesThisTick; i++) {
          if (frameIndexRef.current >= framesRef.current.length) break;
          const frame = framesRef.current[frameIndexRef.current++];
          applyFrame(frame, currentGridRef.current!);
          if (frame.type === 'visit') {
            visitedCountRef.current++;
          } else if (frame.type === 'frontier') {
            frontierCountRef.current++;
          }
        }

        if (frameIndexRef.current >= framesRef.current.length) {
          const finalGrid = currentGridRef.current!;
          const pathLen = countPath(finalGrid);
          const visitedCount = countVisited(finalGrid);
          const frontierCount = countFrontier(finalGrid);
          setAnimatedGrid([...finalGrid.map((r) => [...r])]);
          const endTime = performance.now();
          endTimeRef.current = endTime;
          const hasPath = result.path !== null;
          setPathFound(hasPath);
          setStatus(hasPath ? 'completed' : 'no-path');
          setStatistics({
            algorithm: selectedAlgorithm,
            nodesExplored: result.nodesExplored,
            nodesVisited: visitedCount,
            pathLength: hasPath ? pathLen : 0,
            executionTime: Math.round(endTime - startTime),
            frontierNodes: frontierCount,
            gridDimensions: { rows: grid.length, cols: grid[0]?.length ?? 0 },
          });
          rafRef.current = null;
          return;
        }

        setAnimatedGrid([...currentGridRef.current!.map((r) => [...r])]);
        rafRef.current = requestAnimationFrame(tick);
      };

      lastTickRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    },
    [selectedAlgorithm, speed, runAlgorithmOnGrid]
  );

  const pause = useCallback(() => {
    if (status !== 'running') return;
    isPausedRef.current = true;
    setStatus('paused');
  }, [status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    isPausedRef.current = false;
    setStatus('running');
  }, [status]);

  // Pause/resume effect: no-op, raf loop checks isPausedRef
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const runComparison = useCallback(
    (grid: Grid, startPos: Position, targetPos: Position) => {
      // Stop any running animation
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setAnimatedGrid(null);
      setStatus('idle');
      setPathFound(null);

      const algorithms: AlgorithmId[] = ['bfs', 'dfs', 'dijkstra', 'astar', 'greedy'];
      const results: ComparisonResult[] = [];
      for (const algo of algorithms) {
        const cleanGrid = resetVisitedAndPath(grid);
        const t0 = performance.now();
        const res = runAlgorithmOnGrid(algo, cleanGrid, startPos, targetPos);
        const t1 = performance.now();
        results.push({
          algorithmId: algo,
          algorithmName: ALGORITHMS[algo].shortName,
          nodesExplored: res.nodesExplored,
          pathLength: res.path ? res.pathLength : 0,
          executionTime: Math.round(t1 - t0),
          pathFound: res.path !== null,
        });
      }
      setComparisonResults(results);
    },
    [runAlgorithmOnGrid]
  );

  const clearComparison = useCallback(() => {
    setComparisonResults(null);
  }, []);

  // Update statistics.gridDimensions whenever algorithm changes but dimensions are known
  const statWithDims = useMemo(() => statistics, [statistics]);

  return {
    status,
    selectedAlgorithm,
    setSelectedAlgorithm,
    speed,
    setSpeed,
    statistics: statWithDims,
    comparisonResults,
    pathFound,
    start,
    pause,
    resume,
    stop,
    runComparison,
    clearComparison,
    animatedGrid: animatedGrid ?? [],
  };
}

// ---- Frame application helpers ----

function applyFrame(frame: VisualizationFrame, grid: Grid): void {
  if (frame.type === 'visit' && frame.position) {
    const node = grid[frame.position.row][frame.position.col];
    node.isVisited = true;
    node.isFrontier = false;
    node.isCurrent = false;
  } else if (frame.type === 'frontier' && frame.position) {
    const node = grid[frame.position.row][frame.position.col];
    if (!node.isVisited && !node.isStart && !node.isTarget) {
      node.isFrontier = true;
    }
  } else if (frame.type === 'current' && frame.position) {
    // Clear prior current flags on the grid? Simpler to just not show a separate current highlight; we keep this frame for potential future use.
    // We mark isCurrent only if not yet visited; it doesn't matter much because it becomes 'visit' next.
    const node = grid[frame.position.row][frame.position.col];
    node.isCurrent = true;
  } else if (frame.type === 'path' && frame.path) {
    for (const p of frame.path) {
      const node = grid[p.row][p.col];
      if (!node.isStart && !node.isTarget) {
        node.isPath = true;
        node.isFrontier = false;
        node.isVisited = false;
      }
    }
  }
}

function applyAllFrames(frames: VisualizationFrame[], grid: Grid): void {
  for (const frame of frames) {
    applyFrame(frame, grid);
  }
}

function countVisited(grid: Grid): number {
  let count = 0;
  for (const row of grid) for (const n of row) if (n.isVisited) count++;
  return count;
}
function countFrontier(grid: Grid): number {
  let count = 0;
  for (const row of grid) for (const n of row) if (n.isFrontier) count++;
  return count;
}
function countPath(grid: Grid): number {
  let count = 0;
  for (const row of grid) for (const n of row) if (n.isPath) count++;
  // +1 because path length is edges, but nodes include start/target
  return count + 1; // edges = nodes - 1; we report nodes (steps) including start
}
