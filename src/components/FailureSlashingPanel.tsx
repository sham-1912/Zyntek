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
    <div className="glass-card border-2 border-[#B84A39] rounded-2xl p-6 space-y-6 shadow-md bg-[#FFFDF5] animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B84A39]/15 border border-[#B84A39] flex items-center justify-center text-[#B84A39]">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#B84A39] font-bold">
                Fault Resolution Protocol
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#B84A39]/15 text-[#B84A39] font-mono font-bold">
                Full Bond Slashed
              </span>
            </div>
            <h3 className="text-base font-bold text-[#B84A39] font-headline mt-0.5">
              ❌ EXECUTION FAILED — SOLVER COLLATERAL SLASHED
            </h3>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl bg-[#F7E7B5] hover:bg-[#F0C94C]/40 border border-[rgba(43,43,43,0.12)] text-xs font-mono text-[#2B2B2B] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer shadow-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>

      {/* Visual Transition Sequence */}
      <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.1)] flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-[#5A5A5A]">EXECUTING</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#5A5A5A]" />
        <span className="text-[#B84A39] font-bold">FAILED</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#5A5A5A]" />
        <span className="text-[#B84A39] font-bold">BOND SLASHED</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#5A5A5A]" />
        <span className="text-[#607A3A] font-bold">USER REFUNDED</span>
      </div>

      {/* Reason Box */}
      <div className="bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.1)] text-xs font-mono space-y-1 shadow-xs">
        <span className="text-[10px] text-[#5A5A5A] uppercase block">Failure Reason:</span>
        <p className="text-[#2B2B2B] font-sans">
          {solverName} missed destination execution deadline (Timeout error on Solana SVM leg). Automatic slashing triggered by protocol smart contract.
        </p>
      </div>

      {/* 3 Protection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Solver Collateral Slashed */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[#B84A39]/40 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#B84A39] font-bold text-[11px] border-b border-[rgba(43,43,43,0.08)] pb-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>SOLVER COLLATERAL</span>
          </div>
          <div className="space-y-1 text-[#5A5A5A]">
            <div className="flex justify-between">
              <span>Bond Posted:</span>
              <span className="text-[#2B2B2B]">${bondAmountUsd} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Bond Slashed:</span>
              <span className="text-[#B84A39] font-bold">${bondAmountUsd} USDC</span>
            </div>
          </div>
        </div>

        {/* User Protection */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[#607A3A]/40 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#607A3A] font-bold text-[11px] border-b border-[rgba(43,43,43,0.08)] pb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>USER PROTECTION</span>
          </div>
          <div className="space-y-1 text-[#5A5A5A] text-[11px]">
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <span>✓</span>
              <span>Escrow funds protected (${escrowAmountUsd})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <span>✓</span>
              <span>Automatic full refund initiated</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <span>✓</span>
              <span>Compensation fee transferred</span>
            </div>
          </div>
        </div>

        {/* Solver Status Penalty */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[rgba(43,43,43,0.12)] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#2B2B2B] font-bold text-[11px] border-b border-[rgba(43,43,43,0.08)] pb-1.5">
            <UserCheck className="w-4 h-4 text-[#D4A017]" />
            <span>SOLVER STATUS</span>
          </div>
          <div className="space-y-1 text-[#5A5A5A] text-[11px]">
            <div>• Reputation score deducted (-15 pts)</div>
            <div>• Solver node flagged for failure</div>
            <div>• Collateral reserve re-staked</div>
          </div>
        </div>
      </div>
    </div>
  );
};
