import React from 'react';
import { Play, AlertTriangle, ShieldCheck, AlertOctagon, Sparkles, ShieldAlert, RefreshCw } from 'lucide-react';

export type DemoScenarioType = 'happy_path' | 'ambiguous' | 'high_value' | 'solver_failure' | 'risk_audit';

interface DemoScenarioBarProps {
  activeScenario: DemoScenarioType | null;
  onSelectScenario: (scenario: DemoScenarioType) => void;
  onResetState?: () => void;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  activeScenario,
  onSelectScenario,
  onResetState,
}) => {
  return (
    <div className="glass-card p-4 space-y-3 shadow-md border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(43,43,43,0.08)] pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4A017]" />
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
            Interactive Protocol Demo Scenarios
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#5A5A5A] hidden md:inline">
            1-Click deterministically test all protocol conditions
          </span>

          {onResetState && (
            <button
              type="button"
              onClick={onResetState}
              className="px-2.5 py-1 rounded-lg bg-[#F7E7B5] hover:bg-[#F0C94C]/50 border border-[rgba(43,43,43,0.15)] text-[10px] font-mono text-[#2B2B2B] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title="Reset all simulation & blockchain state"
            >
              <RefreshCw className="w-3 h-3 text-[#2B2B2B]" />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 font-mono text-xs">
        {/* 1. Happy Path */}
        <button
          type="button"
          onClick={() => onSelectScenario('happy_path')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'happy_path'
              ? 'bg-[#F7E7B5] border-[#D4A017] text-[#2B2B2B] ring-2 ring-[#D4A017]/40 shadow-xs'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#D4A017] flex items-center gap-1.5 text-xs sm:text-sm">
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">$500</span>
          </div>
          <span className="text-[10px] text-[#5A5A5A] block leading-tight mt-1">
            Optimistic verification & instant dual-chain settlement
          </span>
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'ambiguous'
              ? 'bg-[#F7E7B5] border-[#F0C94C] text-[#2B2B2B] ring-2 ring-[#F0C94C]/50 shadow-xs'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#2B2B2B] flex items-center gap-1.5 text-xs sm:text-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D4A017]" /> Ambiguous Bids
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">0.6% Gap</span>
          </div>
          <span className="text-[10px] text-[#5A5A5A] block leading-tight mt-1">
            Tied scores trigger user sign-off decision gate
          </span>
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'high_value'
              ? 'bg-[#F7E7B5] border-[#D4A017] text-[#2B2B2B] ring-2 ring-[#D4A017]/40 shadow-xs'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#2B2B2B] flex items-center gap-1.5 text-xs sm:text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#607A3A]" /> High-Value Intent
            </span>
            <span className="text-[10px] text-[#2B2B2B] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[rgba(43,43,43,0.1)]">$1,500</span>
          </div>
          <span className="text-[10px] text-[#5A5A5A] block leading-tight mt-1">
            ZK-Oracle Groth16 proof & manual authorization
          </span>
        </button>

        {/* 4. Solver Failure & Slashing */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'solver_failure'
              ? 'bg-[#B84A39]/15 border-[#B84A39] text-[#B84A39] ring-2 ring-[#B84A39]/30 shadow-xs'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#B84A39] flex items-center gap-1.5 text-xs sm:text-sm">
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Failure
            </span>
            <span className="text-[10px] text-[#B84A39] font-bold bg-[#B84A39]/10 px-1.5 py-0.2 rounded border border-[#B84A39]/30">Slashing</span>
          </div>
          <span className="text-[10px] text-[#5A5A5A] block leading-tight mt-1">
            Full $500 bond slashed & user 100% refunded
          </span>
        </button>

        {/* 5. Risk & Collusion Audit */}
        <button
          type="button"
          onClick={() => onSelectScenario('risk_audit')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeScenario === 'risk_audit'
              ? 'bg-[#F0C94C]/25 border-[#D4A017] text-[#2B2B2B] ring-2 ring-[#D4A017]/40 shadow-xs'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/60 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#2B2B2B] flex items-center gap-1.5 text-xs sm:text-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4A017]" /> Risk & Collusion
            </span>
            <span className="text-[10px] text-[#D4A017] font-bold bg-[#F7E7B5] px-1.5 py-0.2 rounded border border-[#D4A017]/30">87% Sim</span>
          </div>
          <span className="text-[10px] text-[#5A5A5A] block leading-tight mt-1">
            Inspect coordinated bidding anomaly report
          </span>
        </button>
      </div>
    </div>
  );
};
