import React from 'react';
import { Play, AlertTriangle, ShieldCheck, AlertOctagon, Sparkles } from 'lucide-react';

export type DemoScenarioType = 'happy_path' | 'ambiguous' | 'high_value' | 'solver_failure';

interface DemoScenarioBarProps {
  activeScenario: DemoScenarioType | null;
  onSelectScenario: (scenario: DemoScenarioType) => void;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  activeScenario,
  onSelectScenario,
}) => {
  return (
    <div className="bg-[#0E1E38] border border-[#8DC2FF]/20 rounded-2xl p-4 space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#CEF26D]" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Interactive Demo Scenarios
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#CBD5E1]">
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
              ? 'bg-[#1A335C] border-[#CEF26D] text-white ring-1 ring-[#CEF26D]'
              : 'bg-[#142848] hover:bg-[#1A335C]/60 border-white/5 text-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#CEF26D] flex items-center gap-1.5 text-sm">
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className="text-[10px] text-[#CBD5E1]">$500</span>
          </div>
          <span className="text-[10px] text-[#CBD5E1] block leading-tight">
            Standard Optimistic Verification & Instant Settlement
          </span>
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'ambiguous'
              ? 'bg-[#1A335C] border-[#8DC2FF] text-white ring-1 ring-[#8DC2FF]'
              : 'bg-[#142848] hover:bg-[#1A335C]/60 border-white/5 text-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#8DC2FF] flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-[#8DC2FF]" /> Ambiguous Bids
            </span>
            <span className="text-[10px] text-[#CBD5E1]">≤1.6% Gap</span>
          </div>
          <span className="text-[10px] text-[#CBD5E1] block leading-tight">
            Top 2 close scores trigger Sensitive Decision Gate
          </span>
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'high_value'
              ? 'bg-[#1A335C] border-[#2F6690] text-white ring-1 ring-[#2F6690]'
              : 'bg-[#142848] hover:bg-[#1A335C]/60 border-white/5 text-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#8DC2FF] flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6690]" /> High-Value Intent
            </span>
            <span className="text-[10px] text-[#CBD5E1]">$1,500</span>
          </div>
          <span className="text-[10px] text-[#CBD5E1] block leading-tight">
            Enhanced ZK-Oracle Proof & User Confirmation
          </span>
        </button>

        {/* 4. Solver Failure */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'solver_failure'
              ? 'bg-[#FF7032]/20 border-[#FF7032] text-white ring-1 ring-[#FF7032]'
              : 'bg-[#142848] hover:bg-[#1A335C]/60 border-white/5 text-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#FF7032] flex items-center gap-1.5 text-sm">
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Failure
            </span>
            <span className="text-[10px] text-[#CBD5E1]">Timeout</span>
          </div>
          <span className="text-[10px] text-[#CBD5E1] block leading-tight">
            Full $500 Bond Slashed & 100% User Refunded
          </span>
        </button>
      </div>
    </div>
  );
};
