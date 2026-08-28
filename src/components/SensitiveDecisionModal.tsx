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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B14]/80 backdrop-blur-md">
      <div className="bg-[#151526] border-2 border-[#FF7032] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl shadow-[#FF7032]/20 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF7032]/20 border border-[#FF7032] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-[#FF7032]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white font-mono">
                {isHighValue && !isAmbiguous
                  ? '⚠ HIGH-VALUE TRANSFER DETECTED'
                  : '⚠ SENSITIVE DECISION REQUIRED'}
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#FF7032]/20 text-[#FF7032] border border-[#FF7032]/40">
                User Sign-Off Required
              </span>
            </div>
            <p className="text-xs text-[#A5A5B8] mt-1 font-sans">
              {isHighValue && !isAmbiguous
                ? 'Transfer value exceeds protocol threshold ($1,000). Enhanced verification is required before settlement.'
                : `The protocol detected a very close ${(scoreGap * 100).toFixed(1)}% score difference between the top 2 solvers. Please manually select your preferred solver.`}
            </p>
          </div>
        </div>

        {/* Ambiguous Bid Side-by-Side Comparison */}
        {isAmbiguous && bids.length >= 2 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-[#A5A5B8]">
              <span>Score Difference: {(scoreGap * 100).toFixed(1)}% (Threshold ≤ 5%)</span>
              <span>Manual Winner Selection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A */}
              <div className="bg-[#0B0B14] p-4 rounded-xl border border-[#1053D4]/50 space-y-3 hover:border-[#1053D4] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{bid1.solverName}</h4>
                    <span className="text-xs text-[#D1FE5D] font-mono font-bold">
                      Score: {bid1.finalScore.toFixed(1)}/100
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1053D4]/20 text-[#A9A7FF] font-mono font-bold">
                    Option A
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono text-[#A5A5B8] border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-white font-bold">${bid1.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-white">${bid1.feeUsd} · {bid1.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#7171DE] font-bold">${bid1.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating:</span>
                    <span className="text-white">{bid1.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid1)}
                  className="w-full py-2.5 rounded-lg bg-[#1053D4] hover:bg-blue-600 font-mono text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Select {bid1.solverName.split('—')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option B */}
              <div className="bg-[#0B0B14] p-4 rounded-xl border border-[#7171DE]/50 space-y-3 hover:border-[#7171DE] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{bid2.solverName}</h4>
                    <span className="text-xs text-[#D1FE5D] font-mono font-bold">
                      Score: {bid2.finalScore.toFixed(1)}/100
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#7171DE]/20 text-[#7171DE] font-mono font-bold">
                    Option B
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono text-[#A5A5B8] border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-white font-bold">${bid2.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-white">${bid2.feeUsd} · {bid2.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#7171DE] font-bold">${bid2.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating:</span>
                    <span className="text-white">{bid2.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid2)}
                  className="w-full py-2.5 rounded-lg bg-[#7171DE] hover:bg-purple-600 font-mono text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
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
              <div className="bg-[#0B0B14] p-3 rounded-xl border border-white/5 opacity-60">
                <span className="text-[10px] text-[#A5A5B8] block">Standard Path (&lt; $1,000)</span>
                <span className="text-white font-bold">Optimistic Window</span>
              </div>
              <div className="bg-[#20203A] p-3 rounded-xl border border-[#D1FE5D]/40">
                <span className="text-[10px] text-[#D1FE5D] block">High-Value Path (≥ $1,000)</span>
                <span className="text-[#D1FE5D] font-bold">Enhanced Oracle / ZK Attestation</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onConfirmHighValue}
              className="w-full py-3 rounded-xl bg-[#1053D4] hover:bg-blue-600 font-mono text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#1053D4]/20 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D1FE5D]" />
              <span>Continue with Enhanced Verification</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#A5A5B8]">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[#A5A5B8] hover:text-white transition-all cursor-pointer"
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
