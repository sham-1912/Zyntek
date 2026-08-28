import React from 'react';
import { Play, AlertTriangle, ShieldCheck, AlertOctagon, Sparkles } from 'lucide-react';

export type DemoScenarioType = 'happy_path' | 'ambiguous' | 'high_value' | 'solver_failure';

interface DemoScenarioBarProps {
  activeScenario: DemoScenarioType | null;
  onSelectScenario: (scenario: DemoScenarioType) => void;
  isRunning: boolean;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  activeScenario,
  onSelectScenario,
}) => {
  return (
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D1FE5D]" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Interactive Demo Scenarios
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#A5A5B8]">
          Click any scenario to test full trust-minimized protocol flows live
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
        {/* 1. Happy Path */}
        <button
          type="button"
          onClick={() => onSelectScenario('happy_path')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'happy_path'
              ? 'bg-[#20203A] border-[#D1FE5D] text-white ring-1 ring-[#D1FE5D]'
              : 'bg-[#0B0B14] hover:bg-[#20203A]/60 border-white/5 text-[#A5A5B8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#D1FE5D] flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className="text-[10px] opacity-60">$500</span>
          </div>
          <span className="text-[10px] text-[#A5A5B8] block leading-tight">
            Standard Optimistic Verification & Instant Settlement
          </span>
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'ambiguous'
              ? 'bg-[#20203A] border-[#1053D4] text-white ring-1 ring-[#1053D4]'
              : 'bg-[#0B0B14] hover:bg-[#20203A]/60 border-white/5 text-[#A5A5B8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#A9A7FF] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#1053D4]" /> Ambiguous Bids
            </span>
            <span className="text-[10px] opacity-60">≤1.6% Gap</span>
          </div>
          <span className="text-[10px] text-[#A5A5B8] block leading-tight">
            Top 2 close scores trigger Sensitive Decision Modal
          </span>
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'high_value'
              ? 'bg-[#20203A] border-[#7171DE] text-white ring-1 ring-[#7171DE]'
              : 'bg-[#0B0B14] hover:bg-[#20203A]/60 border-white/5 text-[#A5A5B8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#7171DE] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Value Intent
            </span>
            <span className="text-[10px] opacity-60">$1,500</span>
          </div>
          <span className="text-[10px] text-[#A5A5B8] block leading-tight">
            Enhanced ZK-Oracle Proof & User Confirmation
          </span>
        </button>

        {/* 4. Solver Failure */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'solver_failure'
              ? 'bg-[#FF7032]/15 border-[#FF7032] text-white ring-1 ring-[#FF7032]'
              : 'bg-[#0B0B14] hover:bg-[#20203A]/60 border-white/5 text-[#A5A5B8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#FF7032] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Failure
            </span>
            <span className="text-[10px] opacity-60">Timeout</span>
          </div>
          <span className="text-[10px] text-[#A5A5B8] block leading-tight">
            Full $500 Bond Slashed & 100% User Refunded
          </span>
        </button>
      </div>
    </div>
  );
};
