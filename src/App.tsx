import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Grid } from './components/Grid';
import { ControlPanel } from './components/ControlPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { Legend } from './components/Legend';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { ComparisonPanel } from './components/ComparisonPanel';
import { CompletionBanner } from './components/CompletionBanner';
import { useGrid } from './hooks/useGrid';
import { useVisualizer } from './hooks/useVisualizer';
import type { MazeType } from './types/algorithm';
import { MAZES } from './maze/definitions';
import { resetVisitedAndPath } from './utils/grid';
import type { Grid as GridType } from './types/grid';

export default function App() {
  const {
    grid: baseGrid,
    containerRef: gridContainerRef,
    density,
    setDensity,
    setGrid,
    resetGrid,
    clearWalls,
    clearPath,
    getStart,
    getTarget,
    handleCellPointerDown,
    handleCellPointerEnter,
    handlePointerUp,
    dragMode,
  } = useGrid();

  const {
    status,
    selectedAlgorithm,
    setSelectedAlgorithm,
    speed,
    setSpeed,
    statistics,
    comparisonResults,
    pathFound,
    start: startVisualization,
    pause,
    resume,
    stop: stopVisualization,
    runComparison,
    clearComparison,
    animatedGrid,
  } = useVisualizer();

  const [selectedMaze, setSelectedMaze] = useState<MazeType>('recursive-division');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // The grid to display: if animation is active/completed use the animated one
  const displayGrid: GridType = useMemo(() => {
    if (animatedGrid && animatedGrid.length > 0) return animatedGrid;
    return baseGrid;
  }, [animatedGrid, baseGrid]);

  const isRunning = status === 'running' || status === 'paused';

  const generateMaze = useCallback(() => {
    const clean = resetVisitedAndPath(baseGrid);
    const newGrid = MAZES[selectedMaze].generate(clean);
    setGrid(newGrid);
    stopVisualization();
  }, [baseGrid, selectedMaze, setGrid, stopVisualization]);

  const handleStart = useCallback(() => {
    const start = getStart();
    const target = getTarget();
    if (!start || !target) return;
    if (start.row === target.row && start.col === target.col) return;
    startVisualization(baseGrid, start, target);
  }, [baseGrid, getStart, getTarget, startVisualization]);

  const handleReset = useCallback(() => {
    stopVisualization();
    resetGrid();
  }, [resetGrid, stopVisualization]);

  const handleClearPath = useCallback(() => {
    stopVisualization();
    clearPath();
  }, [clearPath, stopVisualization]);

  const handleClearWalls = useCallback(() => {
    stopVisualization();
    clearWalls();
  }, [clearWalls, stopVisualization]);

  const handleCompare = useCallback(() => {
    if (comparisonResults) {
      clearComparison();
      return;
    }
    const start = getStart();
    const target = getTarget();
    if (!start || !target) return;
    stopVisualization();
    runComparison(baseGrid, start, target);
  }, [
    comparisonResults,
    baseGrid,
    getStart,
    getTarget,
    runComparison,
    clearComparison,
    stopVisualization,
  ]);

  // Wrap cell handlers to include stop-on-change
  const onCellPointerDown = useCallback(
    (row: number, col: number, e: React.PointerEvent) => {
      if (isRunning) return;
      handleCellPointerDown(row, col, e);
    },
    [handleCellPointerDown, isRunning]
  );

  const onCellPointerEnter = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;
      handleCellPointerEnter(row, col);
    },
    [handleCellPointerEnter, isRunning]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs / textareas / selects
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (status === 'running') pause();
          else if (status === 'paused') resume();
          else handleStart();
          break;
        case 'r':
        case 'R':
          handleReset();
          break;
        case 'c':
        case 'C':
          handleClearPath();
          break;
        case 'w':
        case 'W':
          handleClearWalls();
          break;
        case 'm':
        case 'M':
          generateMaze();
          break;
        case 'Escape':
          stopVisualization();
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    status,
    pause,
    resume,
    handleStart,
    handleReset,
    handleClearPath,
    handleClearWalls,
    generateMaze,
    stopVisualization,
  ]);

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100 flex flex-col" onPointerUp={handlePointerUp}>
      <Header status={status} />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Mobile top bar */}
        <div className="lg:hidden mb-3 flex items-center justify-between gap-2">
          <CompletionBanner status={status} statistics={statistics} pathFound={pathFound} />
          <button
            type="button"
            onClick={() => setMobilePanelOpen((v) => !v)}
            className="shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-[#141e36] border border-[#2b3c62] text-slate-200"
            aria-expanded={mobilePanelOpen}
          >
            {mobilePanelOpen ? 'Hide Controls' : 'Controls'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-4 lg:gap-5">
          {/* Left column - Control Panel (hidden on mobile unless toggled) */}
          <aside
            className={`${
              mobilePanelOpen ? 'block' : 'hidden'
            } lg:block space-y-3 order-2 lg:order-1`}
          >
            <ControlPanel
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={(a) => {
                setSelectedAlgorithm(a);
                if (status === 'completed' || status === 'no-path' || status === 'idle') {
                  stopVisualization();
                }
              }}
              selectedMaze={selectedMaze}
              onMazeChange={setSelectedMaze}
              speed={speed}
              onSpeedChange={setSpeed}
              density={density}
              onDensityChange={setDensity}
              status={status}
              onStart={handleStart}
              onPause={pause}
              onResume={resume}
              onStop={stopVisualization}
              onClearPath={handleClearPath}
              onClearWalls={handleClearWalls}
              onReset={handleReset}
              onGenerateMaze={generateMaze}
              onCompare={handleCompare}
              isComparisonShown={!!comparisonResults}
            />
            <div className="lg:hidden">
              <KeyboardShortcuts />
            </div>
          </aside>

          {/* Center - Grid and completion banner */}
          <section className="order-1 lg:order-2 flex flex-col gap-3 min-w-0">
            <div className="hidden lg:block">
              <CompletionBanner status={status} statistics={statistics} pathFound={pathFound} />
            </div>
            <div
              ref={gridContainerRef}
              className="relative w-full h-[55vh] sm:h-[62vh] lg:h-[70vh] min-h-[320px] lg:min-h-[520px] rounded-xl"
            >
              <Grid
                grid={displayGrid}
                onCellPointerDown={onCellPointerDown}
                onCellPointerEnter={onCellPointerEnter}
                onPointerUp={handlePointerUp}
                disabled={isRunning}
                dragMode={dragMode}
              />
              {displayGrid.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Loading grid…
                </div>
              )}
            </div>
            {comparisonResults && (
              <ComparisonPanel results={comparisonResults} onClose={handleCompare} />
            )}
          </section>

          {/* Right column - Info and stats */}
          <aside className="order-3 space-y-3 hidden lg:block">
            <StatisticsPanel statistics={statistics} status={status} pathFound={pathFound} />
            <AlgorithmInfo algorithmId={selectedAlgorithm} />
            <Legend />
            <KeyboardShortcuts />
          </aside>
        </div>

        {/* Bottom info for mobile */}
        <div className="lg:hidden mt-3 space-y-3">
          <StatisticsPanel statistics={statistics} status={status} pathFound={pathFound} />
          <AlgorithmInfo algorithmId={selectedAlgorithm} />
          <Legend />
        </div>

        <footer className="mt-6 text-center text-[11px] text-slate-500">
          Built with React, TypeScript & Tailwind · Drag start/target nodes, draw walls, and choose
          an algorithm to visualize.
        </footer>
      </main>
    </div>
  );
}


