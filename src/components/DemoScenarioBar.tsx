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
    <div className="glass-card p-4 space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#CEF26D]" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Interactive Demo Scenarios
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#E2E8F0]">
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
              ? 'bg-[rgba(26,49,82,0.9)] border-[#CEF26D] text-white ring-1 ring-[#CEF26D] shadow-lg shadow-[#CEF26D]/15'
              : 'glass-sub-box hover:bg-[rgba(22,42,70,0.7)] text-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#CEF26D] flex items-center gap-1.5 text-sm">
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className="text-[10px] text-white font-bold bg-[rgba(10,20,38,0.7)] px-1.5 py-0.2 rounded border border-white/10">$500</span>
          </div>
          <span className="text-[11px] text-[#CBD5E1] block leading-tight mt-1">
            Standard Optimistic Verification & Instant Settlement
          </span>
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'ambiguous'
              ? 'bg-[rgba(26,49,82,0.9)] border-[#8DC2FF] text-white ring-1 ring-[#8DC2FF] shadow-lg shadow-[#8DC2FF]/15'
              : 'glass-sub-box hover:bg-[rgba(22,42,70,0.7)] text-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#8DC2FF] flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-[#8DC2FF]" /> Ambiguous Bids
            </span>
            <span className="text-[10px] text-white font-bold bg-[rgba(10,20,38,0.7)] px-1.5 py-0.2 rounded border border-white/10">≤1.6% Gap</span>
          </div>
          <span className="text-[11px] text-[#CBD5E1] block leading-tight mt-1">
            Top 2 close scores trigger Sensitive Decision Gate
          </span>
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'high_value'
              ? 'bg-[rgba(26,49,82,0.9)] border-[#2F6690] text-white ring-1 ring-[#2F6690] shadow-lg shadow-[#2F6690]/25'
              : 'glass-sub-box hover:bg-[rgba(22,42,70,0.7)] text-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CEF26D]" /> High-Value Intent
            </span>
            <span className="text-[10px] text-white font-bold bg-[rgba(10,20,38,0.7)] px-1.5 py-0.2 rounded border border-white/10">$1,500</span>
          </div>
          <span className="text-[11px] text-[#CBD5E1] block leading-tight mt-1">
            Enhanced ZK-Oracle Proof & User Confirmation
          </span>
        </button>

        {/* 4. Solver Failure */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'solver_failure'
              ? 'bg-[#FF7032]/20 border-[#FF7032] text-white ring-1 ring-[#FF7032] shadow-lg shadow-[#FF7032]/20'
              : 'glass-sub-box hover:bg-[rgba(22,42,70,0.7)] text-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#FF7032] flex items-center gap-1.5 text-sm">
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Failure
            </span>
            <span className="text-[10px] text-white font-bold bg-[rgba(10,20,38,0.7)] px-1.5 py-0.2 rounded border border-white/10">Timeout</span>
          </div>
          <span className="text-[11px] text-[#CBD5E1] block leading-tight mt-1">
            Full $500 Bond Slashed & 100% User Refunded
          </span>
        </button>
      </div>
    </div>
  );
};
