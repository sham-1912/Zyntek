import React from 'react';
import { AlertOctagon, ShieldCheck, UserCheck, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2, Check } from 'lucide-react';

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
    <div className="glass-card border-2 border-[#B84A39] rounded-2xl p-6 space-y-5 shadow-lg bg-[#FFFDF5] animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#B84A39]/15 border border-[#B84A39] flex items-center justify-center text-[#B84A39] shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-mono tracking-widest text-[#B84A39] font-bold">
                Fault Resolution Protocol
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B84A39]/15 text-[#B84A39] font-mono font-bold">
                Full Collateral Slashed
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#B84A39] font-headline mt-0.5">
              SOLVER FAILURE — COLLATERAL SLASHED & USER REFUNDED
            </h3>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-[#F7E7B5] hover:bg-[#F0C94C]/40 border border-[rgba(43,43,43,0.12)] text-xs font-mono text-[#2B2B2B] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer shadow-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>

      {/* Sequential Slashing Flow (Directive 14) */}
      <div className="bg-[#F7E7B5]/60 p-4 rounded-xl border border-[rgba(43,43,43,0.1)] flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
        <div className="bg-[#FFFDF5] px-3 py-1.5 rounded-lg border border-[rgba(43,43,43,0.08)] font-bold text-[#5A5A5A]">
          EXECUTING
        </div>
        <ArrowRight className="w-4 h-4 text-[#5A5A5A]" />
        <div className="bg-[#B84A39]/20 px-3 py-1.5 rounded-lg border border-[#B84A39] font-bold text-[#B84A39]">
          DEADLINE EXCEEDED
        </div>
        <ArrowRight className="w-4 h-4 text-[#5A5A5A]" />
        <div className="bg-[#B84A39] text-[#FFFDF5] px-3 py-1.5 rounded-lg font-bold">
          FULL BOND SLASHED (${bondAmountUsd})
        </div>
        <ArrowRight className="w-4 h-4 text-[#5A5A5A]" />
        <div className="bg-[#607A3A] text-[#FFFDF5] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>USER 100% REFUNDED (${escrowAmountUsd})</span>
        </div>
      </div>

      {/* Cause Description */}
      <div className="bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.1)] text-xs font-mono space-y-1 shadow-xs">
        <span className="text-[10px] text-[#5A5A5A] uppercase block font-semibold">Incident Cause:</span>
        <p className="text-[#2B2B2B] font-sans text-xs sm:text-sm">
          <strong>{solverName}</strong> failed to deliver tokens to the destination Solana SVM account within the 10-minute maximum execution deadline. Self-enforcing smart contract automatically triggered solver slashing and user compensation.
        </p>
      </div>

      {/* 3 Protection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Solver Collateral Slashed */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[#B84A39]/40 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#B84A39] font-bold text-xs border-b border-[rgba(43,43,43,0.08)] pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>SOLVER COLLATERAL</span>
          </div>
          <div className="space-y-1.5 text-[#5A5A5A]">
            <div className="flex justify-between">
              <span>Bond Posted:</span>
              <span className="text-[#2B2B2B]">${bondAmountUsd} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Bond Slashed:</span>
              <span className="text-[#B84A39] font-bold">-${bondAmountUsd} USDC</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#B84A39]">
              <span>Status:</span>
              <span className="font-bold">CONFISCATED</span>
            </div>
          </div>
        </div>

        {/* User Protection & Full Refund */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[#607A3A]/40 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#607A3A] font-bold text-xs border-b border-[rgba(43,43,43,0.08)] pb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>USER ESCROW REFUND</span>
          </div>
          <div className="space-y-1 text-[#5A5A5A] text-xs">
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Escrow Protected: ${escrowAmountUsd} USDC</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Automatic 100% Refund Released</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#607A3A]">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Zero Capital Loss Incurred</span>
            </div>
          </div>
        </div>

        {/* Solver Reputation Penalty */}
        <div className="bg-[#FFFDF5] p-4 rounded-xl border border-[rgba(43,43,43,0.12)] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#2B2B2B] font-bold text-xs border-b border-[rgba(43,43,43,0.08)] pb-2">
            <UserCheck className="w-4 h-4 text-[#D4A017]" />
            <span>SOLVER PENALTY</span>
          </div>
          <div className="space-y-1 text-[#5A5A5A] text-xs">
            <div>• Reputation: -25 points deduction</div>
            <div>• Solver node flagged on mesh</div>
            <div>• Mandatory bond replenish required</div>
          </div>
        </div>
      </div>
    </div>
  );
};
