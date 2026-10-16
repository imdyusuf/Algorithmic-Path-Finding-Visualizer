import type {
  AlgorithmId,
  MazeType,
  Speed,
  VisualizerStatus,
} from '../../types/algorithm';
import type { GridDensity } from '../../types/grid';
import { ALGORITHMS, ALGORITHM_ORDER } from '../../algorithms/definitions';
import { MAZES, MAZE_ORDER } from '../../maze/definitions';

export interface ControlPanelProps {
  selectedAlgorithm: AlgorithmId;
  onAlgorithmChange: (a: AlgorithmId) => void;
  selectedMaze: MazeType;
  onMazeChange: (m: MazeType) => void;
  speed: Speed;
  onSpeedChange: (s: Speed) => void;
  density: GridDensity;
  onDensityChange: (d: GridDensity) => void;
  status: VisualizerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onClearPath: () => void;
  onClearWalls: () => void;
  onReset: () => void;
  onGenerateMaze: () => void;
  onCompare: () => void;
  isComparisonShown: boolean;
}

const SPEED_OPTIONS: { value: Speed; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
  { value: 'instant', label: 'Instant' },
];

const DENSITY_OPTIONS: { value: GridDensity; label: string }[] = [
  { value: 'small', label: 'Large Cells' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Small Cells' },
];

export function ControlPanel(props: ControlPanelProps) {
  const {
    selectedAlgorithm,
    onAlgorithmChange,
    selectedMaze,
    onMazeChange,
    speed,
    onSpeedChange,
    density,
    onDensityChange,
    status,
    onStart,
    onPause,
    onResume,
    onStop,
    onClearPath,
    onClearWalls,
    onReset,
    onGenerateMaze,
    onCompare,
    isComparisonShown,
  } = props;

  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isActive = isRunning || isPaused;
  const isCompleted = status === 'completed' || status === 'no-path';

  return (
    <div className="flex flex-col gap-3 w-full">
      <Section title="Algorithm">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
          {ALGORITHM_ORDER.map((id) => {
            const meta = ALGORITHMS[id];
            const selected = selectedAlgorithm === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onAlgorithmChange(id)}
                disabled={isActive}
                aria-pressed={selected}
                className={`group text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                  selected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                    : 'bg-[#0f1729] border-[#22304d] text-slate-300 hover:border-[#37466a] hover:bg-[#14203a]'
                } ${isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{meta.shortName}</span>
                  {meta.guaranteesShortestPath && (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400/80">
                      shortest
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-1 group-hover:line-clamp-none">
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Maze">
        <select
          value={selectedMaze}
          onChange={(e) => onMazeChange(e.target.value as MazeType)}
          disabled={isActive}
          aria-label="Select maze generation algorithm"
          className="w-full bg-[#0f1729] border border-[#22304d] text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-60"
        >
          {MAZE_ORDER.map((id) => (
            <option key={id} value={id}>
              {MAZES[id].name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onGenerateMaze}
          disabled={isActive}
          className="mt-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-[#1a2440] border border-[#2b3c62] text-slate-200 hover:bg-[#212e52] hover:border-violet-500/50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Generate Maze
        </button>
      </Section>

      <Section title="Speed">
        <div className="grid grid-cols-4 gap-1.5">
          {SPEED_OPTIONS.map((opt) => {
            const selected = speed === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSpeedChange(opt.value)}
                aria-pressed={selected}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition border ${
                  selected
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200'
                    : 'bg-[#0f1729] border-[#22304d] text-slate-400 hover:text-slate-200 hover:border-[#37466a]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Cell Size">
        <div className="grid grid-cols-3 gap-1.5">
          {DENSITY_OPTIONS.map((opt) => {
            const selected = density === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDensityChange(opt.value)}
                aria-pressed={selected}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition border ${
                  selected
                    ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
                    : 'bg-[#0f1729] border-[#22304d] text-slate-400 hover:text-slate-200 hover:border-[#37466a]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Actions">
        <div className="flex flex-col gap-2">
          {!isActive && !isCompleted && (
            <button
              type="button"
              onClick={onStart}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-900/30 transition-all active:scale-[0.98]"
            >
              ▶ Visualize {ALGORITHMS[selectedAlgorithm].shortName}
            </button>
          )}
          {isRunning && (
            <button
              type="button"
              onClick={onPause}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all active:scale-[0.98]"
            >
              ⏸ Pause
            </button>
          )}
          {isPaused && (
            <button
              type="button"
              onClick={onResume}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-900/30 transition-all active:scale-[0.98]"
            >
              ▶ Resume
            </button>
          )}
          {(isActive || isCompleted) && (
            <button
              type="button"
              onClick={onStop}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-rose-500/90 text-slate-950 hover:bg-rose-400 shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98]"
            >
              ⏹ Stop / Reset
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClearPath}
              disabled={isActive}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#141e36] border border-[#22304d] text-slate-300 hover:bg-[#1a2746] hover:border-cyan-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Path
            </button>
            <button
              type="button"
              onClick={onClearWalls}
              disabled={isActive}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#141e36] border border-[#22304d] text-slate-300 hover:bg-[#1a2746] hover:border-cyan-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Walls
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isActive}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#141e36] border border-[#22304d] text-slate-300 hover:bg-[#1a2746] hover:border-cyan-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Grid
            </button>
            <button
              type="button"
              onClick={onCompare}
              disabled={isActive}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isComparisonShown
                  ? 'bg-violet-500/20 border-violet-500/60 text-violet-200'
                  : 'bg-[#141e36] border-[#22304d] text-slate-300 hover:bg-[#1a2746] hover:border-violet-500/40'
              }`}
            >
              {isComparisonShown ? 'Hide Compare' : 'Compare All'}
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] p-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
