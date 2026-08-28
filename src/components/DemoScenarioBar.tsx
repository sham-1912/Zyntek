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
    <div className="glass-card p-4 space-y-3 shadow-md border border-[rgba(43,43,43,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(43,43,43,0.08)] pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4A017]" />
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase font-mono tracking-wider">
            Interactive Demo Scenarios
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#5A5A5A]">
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
              ? 'bg-[#F7E7B5] border-[#D4A017] text-[#2B2B2B] ring-2 ring-[#D4A017]/40 shadow-sm'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#D4A017] flex items-center gap-1.5 text-sm">
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">$500</span>
          </div>
          <span className="text-[11px] text-[#5A5A5A] block leading-tight mt-1">
            Standard Optimistic Verification & Instant Settlement
          </span>
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'ambiguous'
              ? 'bg-[#F7E7B5] border-[#F0C94C] text-[#2B2B2B] ring-2 ring-[#F0C94C]/50 shadow-sm'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#2B2B2B] flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D4A017]" /> Ambiguous Bids
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">≤1.6% Gap</span>
          </div>
          <span className="text-[11px] text-[#5A5A5A] block leading-tight mt-1">
            Top 2 close scores trigger Sensitive Decision Gate
          </span>
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'high_value'
              ? 'bg-[#F7E7B5] border-[#D4A017] text-[#2B2B2B] ring-2 ring-[#D4A017]/40 shadow-sm'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#2B2B2B] flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#607A3A]" /> High-Value Intent
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">$1,500</span>
          </div>
          <span className="text-[11px] text-[#5A5A5A] block leading-tight mt-1">
            Enhanced ZK-Oracle Proof & User Confirmation
          </span>
        </button>

        {/* 4. Solver Failure */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'solver_failure'
              ? 'bg-[#B84A39]/15 border-[#B84A39] text-[#B84A39] ring-2 ring-[#B84A39]/30 shadow-sm'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#B84A39] flex items-center gap-1.5 text-sm">
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Failure
            </span>
            <span className="text-[10px] text-[#B84A39] font-bold bg-[#B84A39]/10 px-1.5 py-0.2 rounded border border-[#B84A39]/30">Timeout</span>
          </div>
          <span className="text-[11px] text-[#5A5A5A] block leading-tight mt-1">
            Full $500 Bond Slashed & 100% User Refunded
          </span>
        </button>
      </div>
    </div>
  );
};
