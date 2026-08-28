import React from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { ShieldAlert, AlertTriangle, Lock, ArrowRight, X } from 'lucide-react';

interface SensitiveDecisionModalProps {
  isOpen: boolean;
  intent: UserIntent;
  bids: SolverBid[];
  isAmbiguous: boolean;
  isHighValue: boolean;
  onApproveBid: (bid: SolverBid) => void;
  onCancel: () => void;
}

export const SensitiveDecisionModal: React.FC<SensitiveDecisionModalProps> = ({
  isOpen,
  intent,
  bids,
  isAmbiguous,
  isHighValue,
  onApproveBid,
  onCancel,
}) => {
  if (!isOpen || bids.length < 2) return null;

  const bid1 = bids[0];
  const bid2 = bids[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1915]/60 backdrop-blur-sm">
      <div className="ix-card max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 border-[#E5D19E] shadow-xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E8E4DA] pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center shrink-0 text-[#8C6407]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1A1915] font-sans">Sensitive Decision Checkpoint</h3>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] border border-[#E5D19E]">
                  User Sign-off Required
                </span>
              </div>
              <p className="text-xs text-[#6B6659] mt-1">
                Automated execution paused. The protocol escalated this transaction because:
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="text-[#7A7568] hover:text-[#1A1915]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trigger Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isAmbiguous && (
            <div className="bg-[#FAF5E8] border border-[#E5D19E] p-3 rounded-lg flex items-start gap-2 text-[#8C6407]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#C69214]" />
              <div className="text-xs">
                <span className="font-bold block">Ambiguous Top Bids Score</span>
                <p className="text-[#6B6659] text-[11px] mt-0.5">
                  Top 2 bids score within 5% of each other ({(bid1.finalScore * 100).toFixed(1)} vs {(bid2.finalScore * 100).toFixed(1)}).
                </p>
              </div>
            </div>
          )}

          {isHighValue && (
            <div className="bg-[#FAF5E8] border border-[#E5D19E] p-3 rounded-lg flex items-start gap-2 text-[#8C6407]">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#C69214]" />
              <div className="text-xs">
                <span className="font-bold block">High-Value Threshold</span>
                <p className="text-[#6B6659] text-[11px] mt-0.5">
                  Intent amount (${intent.sourceAmount.toLocaleString()} ≥ $1,000) requires ZK-Oracle verification gate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Bid Comparison (Matching Reference Card Language) */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
            Side-by-Side Competitive Bid Comparison
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Bid 1 Card */}
            <div className="ix-card p-4 space-y-3 border-[#C69214]">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1A1915] font-sans">{bid1.solverName}</h4>
                <span className="text-xs font-mono font-bold text-[#C69214]">
                  {(bid1.finalScore * 100).toFixed(1)} Pts
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-[#6B6659]">
                <div className="flex justify-between">
                  <span>Output:</span>
                  <span className="font-bold text-[#1A1915]">${bid1.proposedOutput.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="font-bold text-[#1A1915]">${bid1.feeUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="font-bold text-[#1A1915]">{bid1.estimatedExecutionTimeSec}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Collateral:</span>
                  <span className="font-bold text-[#8C6407]">${bid1.collateralOfferedUsd.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApproveBid(bid1)}
                className="w-full py-2 ix-btn-gold text-xs font-bold flex items-center justify-center gap-1"
              >
                <span>Select {bid1.solverName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bid 2 Card */}
            <div className="ix-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1A1915] font-sans">{bid2.solverName}</h4>
                <span className="text-xs font-mono font-bold text-[#7A7568]">
                  {(bid2.finalScore * 100).toFixed(1)} Pts
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-[#6B6659]">
                <div className="flex justify-between">
                  <span>Output:</span>
                  <span className="font-bold text-[#1A1915]">${bid2.proposedOutput.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="font-bold text-[#1A1915]">${bid2.feeUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="font-bold text-[#1A1915]">{bid2.estimatedExecutionTimeSec}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Collateral:</span>
                  <span className="font-bold text-[#8C6407]">${bid2.collateralOfferedUsd.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApproveBid(bid2)}
                className="w-full py-2 ix-btn-outline text-xs font-bold hover:border-[#C69214] flex items-center justify-center gap-1"
              >
                <span>Select {bid2.solverName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
