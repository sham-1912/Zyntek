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
    <div className="glass-card p-5 space-y-3.5 shadow-md border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#2B2B2B] text-[#D4A017] flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
              Interactive Protocol Demo Scenarios
            </h3>
            <span className="text-[11px] font-mono text-[#5A5A5A]">
              1-Click deterministically trigger end-to-end protocol workflows
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {activeScenario && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#607A3A]/15 text-[#607A3A] border border-[#607A3A]/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#607A3A]" />
              Scenario Armed & Active
            </span>
          )}

          {onResetState && (
            <button
              type="button"
              onClick={onResetState}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF5] hover:bg-[#F7E7B5] border border-[rgba(43,43,43,0.15)] text-xs font-mono text-[#2B2B2B] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Reset all simulation & blockchain state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {/* 1. Happy Path */}
        <button
          type="button"
          onClick={() => onSelectScenario('happy_path')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeScenario === 'happy_path'
              ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#D4A017] ring-4 ring-[#D4A017]/30 shadow-lg'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/40 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${activeScenario === 'happy_path' ? 'text-[#F0C94C]' : 'text-[#2B2B2B]'}`}>
              <Play className="w-3.5 h-3.5 fill-current" /> Happy Path
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeScenario === 'happy_path' ? 'bg-[#D4A017] text-[#2B2B2B]' : 'bg-[#F7E7B5] text-[#2B2B2B]'
            }`}>
              $500
            </span>
          </div>
          <span className={`text-[11px] block leading-tight mt-1 font-sans ${activeScenario === 'happy_path' ? 'text-[#FFFDF5]/80' : 'text-[#5A5A5A]'}`}>
            Optimistic verification & instant dual-chain settlement
          </span>
          {activeScenario === 'happy_path' && (
            <div className="mt-2 text-[10px] text-[#CEF26D] font-bold font-mono">● CURRENTLY RUNNING</div>
          )}
        </button>

        {/* 2. Ambiguous Bids */}
        <button
          type="button"
          onClick={() => onSelectScenario('ambiguous')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeScenario === 'ambiguous'
              ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#F0C94C] ring-4 ring-[#F0C94C]/30 shadow-lg'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/40 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${activeScenario === 'ambiguous' ? 'text-[#F0C94C]' : 'text-[#2B2B2B]'}`}>
              <AlertTriangle className="w-3.5 h-3.5 text-[#D4A017]" /> Ambiguous Bids
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeScenario === 'ambiguous' ? 'bg-[#F0C94C] text-[#2B2B2B]' : 'bg-[#F7E7B5] text-[#2B2B2B]'
            }`}>
              0.6% Gap
            </span>
          </div>
          <span className={`text-[11px] block leading-tight mt-1 font-sans ${activeScenario === 'ambiguous' ? 'text-[#FFFDF5]/80' : 'text-[#5A5A5A]'}`}>
            Tied scores trigger user sign-off decision gate
          </span>
          {activeScenario === 'ambiguous' && (
            <div className="mt-2 text-[10px] text-[#CEF26D] font-bold font-mono">● CURRENTLY RUNNING</div>
          )}
        </button>

        {/* 3. High-Value Intent */}
        <button
          type="button"
          onClick={() => onSelectScenario('high_value')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeScenario === 'high_value'
              ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#D4A017] ring-4 ring-[#D4A017]/30 shadow-lg'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/40 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${activeScenario === 'high_value' ? 'text-[#F0C94C]' : 'text-[#2B2B2B]'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#607A3A]" /> High-Value
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeScenario === 'high_value' ? 'bg-[#D4A017] text-[#2B2B2B]' : 'bg-[#F7E7B5] text-[#2B2B2B]'
            }`}>
              $1,500
            </span>
          </div>
          <span className={`text-[11px] block leading-tight mt-1 font-sans ${activeScenario === 'high_value' ? 'text-[#FFFDF5]/80' : 'text-[#5A5A5A]'}`}>
            ZK-Oracle Groth16 proof & manual authorization
          </span>
          {activeScenario === 'high_value' && (
            <div className="mt-2 text-[10px] text-[#CEF26D] font-bold font-mono">● CURRENTLY RUNNING</div>
          )}
        </button>

        {/* 4. Solver Failure & Slashing */}
        <button
          type="button"
          onClick={() => onSelectScenario('solver_failure')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeScenario === 'solver_failure'
              ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#B84A39] ring-4 ring-[#B84A39]/30 shadow-lg'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/40 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${activeScenario === 'solver_failure' ? 'text-[#B84A39]' : 'text-[#2B2B2B]'}`}>
              <AlertOctagon className="w-3.5 h-3.5" /> Solver Slashed
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeScenario === 'solver_failure' ? 'bg-[#B84A39] text-[#FFFDF5]' : 'bg-[#B84A39]/15 text-[#B84A39]'
            }`}>
              -$500 Bond
            </span>
          </div>
          <span className={`text-[11px] block leading-tight mt-1 font-sans ${activeScenario === 'solver_failure' ? 'text-[#FFFDF5]/80' : 'text-[#5A5A5A]'}`}>
            Full $500 bond slashed & user 100% refunded
          </span>
          {activeScenario === 'solver_failure' && (
            <div className="mt-2 text-[10px] text-[#B84A39] font-bold font-mono">● CURRENTLY RUNNING</div>
          )}
        </button>

        {/* 5. Risk & Collusion Audit */}
        <button
          type="button"
          onClick={() => onSelectScenario('risk_audit')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
            activeScenario === 'risk_audit'
              ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#D4A017] ring-4 ring-[#D4A017]/30 shadow-lg'
              : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/40 border-[rgba(43,43,43,0.12)] text-[#2B2B2B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-bold flex items-center gap-1.5 text-xs sm:text-sm ${activeScenario === 'risk_audit' ? 'text-[#F0C94C]' : 'text-[#2B2B2B]'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4A017]" /> Risk & Collusion
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeScenario === 'risk_audit' ? 'bg-[#D4A017] text-[#2B2B2B]' : 'bg-[#F7E7B5] text-[#2B2B2B]'
            }`}>
              87.4% Sim
            </span>
          </div>
          <span className={`text-[11px] block leading-tight mt-1 font-sans ${activeScenario === 'risk_audit' ? 'text-[#FFFDF5]/80' : 'text-[#5A5A5A]'}`}>
            Inspect coordinated bidding anomaly report
          </span>
          {activeScenario === 'risk_audit' && (
            <div className="mt-2 text-[10px] text-[#CEF26D] font-bold font-mono">● CURRENTLY RUNNING</div>
          )}
        </button>
      </div>
    </div>
  );
};
