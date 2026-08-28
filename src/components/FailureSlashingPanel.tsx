import React from 'react';
import { AlertOctagon, ShieldCheck, UserCheck, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

interface FailureSlashingPanelProps {
  solverName: string;
  bondAmountUsd?: number;
  escrowAmountUsd?: number;
  onReset?: () => void;
}

export const FailureSlashingPanel: React.FC<FailureSlashingPanelProps> = ({
  solverName,
  bondAmountUsd = 500,
  escrowAmountUsd = 500,
  onReset,
}) => {
  return (
    <div className="bg-[#0E1E38] border-2 border-[#FF7032] rounded-2xl p-6 space-y-6 shadow-2xl shadow-[#FF7032]/10 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7032]/20 border border-[#FF7032] flex items-center justify-center text-[#FF7032]">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#FF7032] font-bold">
                Fault Resolution Protocol
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF7032]/20 text-[#FF7032] font-mono font-bold">
                Full Bond Slashed
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono mt-0.5">
              ❌ EXECUTION FAILED — SOLVER COLLATERAL SLASHED
            </h3>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl bg-[#142848] hover:bg-[#1A335C] border border-[#8DC2FF]/20 text-xs font-mono text-[#8DC2FF] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>

      {/* Visual Transition Sequence */}
      <div className="bg-[#142848] p-3.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-[#CBD5E1]">EXECUTING</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
        <span className="text-[#FF7032] font-bold">FAILED</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
        <span className="text-[#FF7032] font-bold">BOND SLASHED</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
        <span className="text-[#CEF26D] font-bold">USER REFUNDED</span>
      </div>

      {/* Reason Box */}
      <div className="bg-[#142848] p-3.5 rounded-xl border border-white/10 text-xs font-mono space-y-1">
        <span className="text-[10px] text-[#CBD5E1] uppercase block">Failure Reason:</span>
        <p className="text-white font-sans">
          {solverName} missed destination execution deadline (Timeout error on Solana SVM leg). Automatic slashing triggered by protocol smart contract.
        </p>
      </div>

      {/* 3 Protection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Solver Collateral Slashed */}
        <div className="bg-[#142848] p-4 rounded-xl border border-[#FF7032]/40 space-y-2">
          <div className="flex items-center gap-2 text-[#FF7032] font-bold text-[11px] border-b border-white/5 pb-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>SOLVER COLLATERAL</span>
          </div>
          <div className="space-y-1 text-[#CBD5E1]">
            <div className="flex justify-between">
              <span>Bond Posted:</span>
              <span className="text-white">${bondAmountUsd} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Bond Slashed:</span>
              <span className="text-[#FF7032] font-bold">${bondAmountUsd} USDC</span>
            </div>
          </div>
        </div>

        {/* User Protection */}
        <div className="bg-[#142848] p-4 rounded-xl border border-[#CEF26D]/40 space-y-2">
          <div className="flex items-center gap-2 text-[#CEF26D] font-bold text-[11px] border-b border-white/5 pb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>USER PROTECTION</span>
          </div>
          <div className="space-y-1 text-[#CBD5E1] text-[11px]">
            <div className="flex items-center gap-1.5 text-[#CEF26D]">
              <span>✓</span>
              <span>Escrow funds protected (${escrowAmountUsd})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CEF26D]">
              <span>✓</span>
              <span>Automatic full refund initiated</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CEF26D]">
              <span>✓</span>
              <span>Compensation fee transferred</span>
            </div>
          </div>
        </div>

        {/* Solver Status Penalty */}
        <div className="bg-[#142848] p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-[#8DC2FF] font-bold text-[11px] border-b border-white/5 pb-1.5">
            <UserCheck className="w-4 h-4" />
            <span>SOLVER STATUS</span>
          </div>
          <div className="space-y-1 text-[#CBD5E1] text-[11px]">
            <div>• Reputation score deducted (-15 pts)</div>
            <div>• Solver node flagged for failure</div>
            <div>• Collateral reserve re-staked</div>
          </div>
        </div>
      </div>
    </div>
  );
};
