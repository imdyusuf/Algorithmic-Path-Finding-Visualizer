import { useState } from 'react';
import type { AlgorithmId } from '../../types/algorithm';
import { ALGORITHMS } from '../../algorithms/definitions';

export interface AlgorithmInfoProps {
  algorithmId: AlgorithmId;
}

export function AlgorithmInfo({ algorithmId }: AlgorithmInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const algo = ALGORITHMS[algorithmId];

  return (
    <div className="rounded-xl bg-[#0d1425] border border-[#1f2a44] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#131d36] transition-colors"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{algo.name}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{algo.description}</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 text-sm border-t border-[#1f2a44] pt-3">
          <p className="text-slate-300 leading-relaxed text-[13px]">{algo.howItWorks}</p>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <InfoBox label="Data Structure" value={algo.dataStructure} />
            <InfoBox
              label="Shortest Path?"
              value={algo.guaranteesShortestPath ? '✓ Yes' : '✗ No'}
              valueClass={algo.guaranteesShortestPath ? 'text-emerald-300' : 'text-rose-300'}
            />
            <InfoBox label="Uses Heuristic?" value={algo.usesHeuristic ? 'Yes' : 'No'} />
            <InfoBox label="Time" value={algo.timeComplexity} mono />
            <InfoBox label="Space" value={algo.spaceComplexity} mono />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
              Use Cases
            </div>
            <ul className="space-y-1 text-[12px] text-slate-300">
              {algo.useCases.map((uc) => (
                <li key={uc} className="flex gap-2">
                  <span className="text-cyan-400 mt-0.5">›</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({
  label,
  value,
  mono = false,
  valueClass = 'text-slate-200',
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="rounded-md bg-[#0a1122] border border-[#1b2742] p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</div>
      <div className={`${mono ? 'font-mono' : ''} ${valueClass} text-[12px] leading-tight`}>
        {value}
      </div>
    </div>
  );
}
