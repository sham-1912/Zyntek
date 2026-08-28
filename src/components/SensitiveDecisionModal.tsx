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
  scoreGap = 0.006,
  onApproveBid,
  onConfirmHighValue,
  onCancel,
}) => {
  if (!isOpen) return null;

  const bid1 = bids[0];
  const bid2 = bids[1] || bids[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-sm">
      <div className="bg-[#FFFDF5] border-2 border-[#D4A017] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-[#2B2B2B]">
        
        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-[rgba(43,43,43,0.08)] pb-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7E7B5] border border-[#D4A017] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-[#D4A017]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B] font-headline">
                {isHighValue && !isAmbiguous
                  ? 'HIGH-VALUE TRANSFER DETECTED'
                  : 'SENSITIVE DECISION REQUIRED: TIE DETECTED'}
              </h3>
              <span className="text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D4A017] text-[#2B2B2B] shadow-xs">
                User Sign-Off Gate
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 font-sans">
              {isHighValue && !isAmbiguous
                ? 'Transfer amount exceeds $1,000 protocol threshold. Enhanced multi-sig verification is required before settlement.'
                : `The top two solver executions are effectively tied (difference: ${(scoreGap * 100).toFixed(1)}%). The protocol will not automatically decide between them.`}
            </p>
          </div>
        </div>

        {/* Ambiguous Bid Side-by-Side Comparison */}
        {isAmbiguous && bids.length >= 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-[#5A5A5A]">
              <span className="font-semibold">Score Difference: {(scoreGap * 100).toFixed(1)}% (Threshold ≤ 5%)</span>
              <span className="text-[#D4A017] font-bold">Manual Winner Selection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Option A */}
              <div className="bg-[#F7E7B5]/60 p-4 rounded-xl border border-[#D4A017]/40 space-y-3 hover:border-[#D4A017] transition-all shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#2B2B2B]">{bid1.solverName}</h4>
                    <span className="text-xs text-[#D4A017] font-bold block mt-0.5">
                      FINAL SCORE: {bid1.finalScore.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDF5] text-[#2B2B2B] font-bold border border-[rgba(43,43,43,0.1)]">
                    OPTION A
                  </span>
                </div>

                <div className="space-y-1.5 text-[#5A5A5A] border-t border-[rgba(43,43,43,0.08)] pt-2.5">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-[#2B2B2B] font-bold">${bid1.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-[#2B2B2B]">${bid1.feeUsd} · {bid1.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#2B2B2B] font-bold">${bid1.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reputation:</span>
                    <span className="text-[#2B2B2B]">{bid1.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid1)}
                  className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-xs font-bold text-[#2B2B2B] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                >
                  <span>Select {bid1.solverName.split('—')[0]} →</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option B */}
              <div className="bg-[#F7E7B5]/60 p-4 rounded-xl border border-[rgba(43,43,43,0.2)] space-y-3 hover:border-[#D4A017] transition-all shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#2B2B2B]">{bid2.solverName}</h4>
                    <span className="text-xs text-[#D4A017] font-bold block mt-0.5">
                      FINAL SCORE: {bid2.finalScore.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDF5] text-[#2B2B2B] font-bold border border-[rgba(43,43,43,0.1)]">
                    OPTION B
                  </span>
                </div>

                <div className="space-y-1.5 text-[#5A5A5A] border-t border-[rgba(43,43,43,0.08)] pt-2.5">
                  <div className="flex justify-between">
                    <span>Expected Output:</span>
                    <span className="text-[#2B2B2B] font-bold">${bid2.expectedOutput} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee / ETA:</span>
                    <span className="text-[#2B2B2B]">${bid2.feeUsd} · {bid2.etaSec}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collateral Bond:</span>
                    <span className="text-[#2B2B2B] font-bold">${bid2.collateralOfferedUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reputation:</span>
                    <span className="text-[#2B2B2B]">{bid2.safetyRating}/100</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onApproveBid(bid2)}
                  className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-xs font-bold text-[#2B2B2B] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                >
                  <span>Select {bid2.solverName.split('—')[0]} →</span>
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
              <div className="bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.1)] opacity-60">
                <span className="text-[10px] text-[#5A5A5A] block uppercase font-semibold">Standard Path (&lt; $1,000)</span>
                <span className="text-[#2B2B2B] font-bold">Optimistic Window</span>
              </div>
              <div className="bg-[#F7E7B5] p-3.5 rounded-xl border border-[#D4A017] shadow-xs">
                <span className="text-[10px] text-[#D4A017] font-bold block uppercase">High-Value Path (≥ $1,000)</span>
                <span className="text-[#2B2B2B] font-bold">Enhanced ZK-Oracle Attestation</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onConfirmHighValue}
              className="w-full py-3.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-xs font-bold text-[#2B2B2B] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4 text-[#607A3A]" />
              <span>Continue with Enhanced Verification →</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[rgba(43,43,43,0.08)] pt-3.5 text-xs font-mono text-[#5A5A5A]">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[#5A5A5A] hover:text-[#2B2B2B] transition-all cursor-pointer font-semibold"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel & Reject</span>
          </button>
          <span className="text-[#607A3A] font-bold">Automation Until Judgment Needed</span>
        </div>
      </div>
    </div>
  );
};
