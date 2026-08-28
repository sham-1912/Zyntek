import React from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { AlertTriangle, ArrowRight, XCircle, ShieldCheck } from 'lucide-react';

interface SensitiveDecisionModalProps {
  isOpen: boolean;
  intent?: UserIntent;
  bids: SolverBid[];
  isAmbiguous: boolean;
  isHighValue: boolean;
  scoreGap?: number;
  onApproveBid: (bid: SolverBid) => void;
  onConfirmHighValue: () => void;
  onCancel: () => void;
}

export const SensitiveDecisionModal: React.FC<SensitiveDecisionModalProps> = ({
  isOpen,
  bids,
  isAmbiguous,
  isHighValue,
  scoreGap = 0.016,
  onApproveBid,
  onConfirmHighValue,
  onCancel,
}) => {
  if (!isOpen) return null;

  const bid1 = bids[0];
  const bid2 = bids[1] || bids[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101C2C]/85 backdrop-blur-md">
      <div className="bg-[#162A46] border-2 border-[#FF7032] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl shadow-[#FF7032]/20 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF7032]/20 border border-[#FF7032] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-[#FF7032]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#F3F6FF] font-mono">
                {isHighValue && !isAmbiguous
                  ? '⚠ HIGH-VALUE TRANSFER DETECTED'
                  : '⚠ SENSITIVE DECISION REQUIRED'}
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#FF7032]/20 text-[#FF7032] border border-[#FF7032]/40">
                User Sign-Off Required
              </span>
            </div>
            <p className="text-xs text-[#8DC2FF]/80 mt-1 font-sans">
              {isHighValue && !isAmbiguous
                ? 'Transfer value exceeds protocol threshold ($1,000). Enhanced verification is required before settlement.'
                : `The protocol detected a very close ${(scoreGap * 100).toFixed(1)}% score difference between the top 2 solvers. Please manually select your preferred solver.`}
            </p>
          </div>
        </div>

        {/* Ambiguous Bid Side-by-Side Comparison */}
        {isAmbiguous && bids.length >= 2 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-[#8DC2FF]/80">
              <span>Score Difference: {(scoreGap * 100).toFixed(1)}% (Threshold ≤ 5%)</span>
              <span>Manual Winner Selection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A */}
              <div className="bg-[#101C2C] p-4 rounded-xl border border-[#2F6690]/60 space-y-3 hover:border-[#8DC2FF] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#F3F6FF] font-mono">{bid1.solverName}</h4>
                    <span className="text-xs text-[#CEF26D] font-mono font-bold">
                      Score: {bid1.finalScore.toFixed(1)}/100
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#2F6690]/30 text-[#8DC2FF] font-mono font-bold">
                    Option A
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono text-[#8DC2FF]/80 border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-[#F3F6FF] font-bold">${bid1.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-[#F3F6FF]">${bid1.feeUsd} · {bid1.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#8DC2FF] font-bold">${bid1.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating:</span>
                    <span className="text-[#F3F6FF]">{bid1.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid1)}
                  className="w-full py-2.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-xs font-bold text-[#F3F6FF] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Select {bid1.solverName.split('—')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option B */}
              <div className="bg-[#101C2C] p-4 rounded-xl border border-[#8DC2FF]/40 space-y-3 hover:border-[#8DC2FF] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#F3F6FF] font-mono">{bid2.solverName}</h4>
                    <span className="text-xs text-[#CEF26D] font-mono font-bold">
                      Score: {bid2.finalScore.toFixed(1)}/100
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A3152] text-[#8DC2FF] font-mono font-bold">
                    Option B
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono text-[#8DC2FF]/80 border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-[#F3F6FF] font-bold">${bid2.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-[#F3F6FF]">${bid2.feeUsd} · {bid2.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#8DC2FF] font-bold">${bid2.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating:</span>
                    <span className="text-[#F3F6FF]">{bid2.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid2)}
                  className="w-full py-2.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-xs font-bold text-[#F3F6FF] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Select {bid2.solverName.split('—')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* High-Value Escalation Path */}
        {isHighValue && !isAmbiguous && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101C2C] p-3 rounded-xl border border-white/5 opacity-60">
                <span className="text-[10px] text-[#8DC2FF]/70 block">Standard Path (&lt; $1,000)</span>
                <span className="text-[#F3F6FF] font-bold">Optimistic Window</span>
              </div>
              <div className="bg-[#1A3152] p-3 rounded-xl border border-[#CEF26D]/50">
                <span className="text-[10px] text-[#CEF26D] block">High-Value Path (≥ $1,000)</span>
                <span className="text-[#CEF26D] font-bold">Enhanced Oracle / ZK Attestation</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onConfirmHighValue}
              className="w-full py-3 rounded-xl bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-xs font-bold text-[#F3F6FF] flex items-center justify-center gap-2 shadow-lg shadow-[#2F6690]/30 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#CEF26D]" />
              <span>Continue with Enhanced Verification</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8DC2FF]/70">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[#8DC2FF]/70 hover:text-[#F3F6FF] transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel & Reject</span>
          </button>
          <span>Protocol Trust-Minimized Gate</span>
        </div>
      </div>
    </div>
  );
};
