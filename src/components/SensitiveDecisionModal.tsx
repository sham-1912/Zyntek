import React from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { ShieldAlert, AlertTriangle, Lock, ArrowRight, XCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      {/* Requirement 7: Distinct Alert / Checkpoint Theme (#FF7032) */}
      <div className="bg-slate-900 border-2 border-alert rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl shadow-alert/20 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-alert/20 border border-alert/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-7 h-7 text-alert animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-section font-bold text-white">Sensitive Decision Checkpoint</h3>
              <span className="text-metadata uppercase font-mono font-bold px-2.5 py-0.5 rounded bg-alert/20 text-alert border border-alert/40">
                Action Required
              </span>
            </div>
            <p className="text-body text-slate-300 mt-1">
              Automated execution paused. The protocol escalated this transaction for user confirmation:
            </p>
          </div>
        </div>

        {/* Trigger Alert Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isAmbiguous && (
            <div className="bg-alert/10 border border-alert/30 p-3 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-alert shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-alert font-mono">Ambiguous Top Bids (&le;5% Score Gap):</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Top 2 bids score within 5% of each other ({(bid1.finalScore * 100).toFixed(1)} vs {(bid2.finalScore * 100).toFixed(1)}).
                </p>
              </div>
            </div>
          )}

          {isHighValue && (
            <div className="bg-safety/10 border border-safety/30 p-3 rounded-xl flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-safety shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-safety font-mono">High-Value Threshold Exceeded:</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Intent amount (${intent.sourceAmount}) &ge; $1,000 limit. Requires manual sign-off for ZK-Oracle proof.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Bid Comparison */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Compare Top Solver Options:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bid 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-cost transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-body font-bold text-white">{bid1.solverName}</h5>
                  <span className="text-metadata text-cost font-bold">Score: {(bid1.finalScore * 100).toFixed(1)}/100</span>
                </div>
                <span className="text-metadata px-2 py-0.5 rounded bg-cost/20 text-cost font-bold font-mono">
                  Option #1
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div>Output: <span className="text-cost font-bold">${bid1.proposedOutput}</span></div>
                <div>Fee: <span className="text-slate-200">${bid1.feeUsd}</span></div>
                <div>Speed: <span className="text-speed font-semibold">{bid1.estimatedExecutionTimeSec}s</span></div>
                <div>Bond: <span className="text-safety font-semibold">${bid1.collateralOfferedUsd}</span></div>
              </div>
              <button
                type="button"
                onClick={() => onApproveBid(bid1)}
                className="w-full py-2 rounded-lg bg-cost text-slate-950 hover:bg-lime-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Authorize Option #1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bid 2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-speed transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-body font-bold text-white">{bid2.solverName}</h5>
                  <span className="text-metadata text-speed font-bold">Score: {(bid2.finalScore * 100).toFixed(1)}/100</span>
                </div>
                <span className="text-metadata px-2 py-0.5 rounded bg-speed/20 text-speed font-bold font-mono">
                  Option #2
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div>Output: <span className="text-cost font-bold">${bid2.proposedOutput}</span></div>
                <div>Fee: <span className="text-slate-200">${bid2.feeUsd}</span></div>
                <div>Speed: <span className="text-speed font-semibold">{bid2.estimatedExecutionTimeSec}s</span></div>
                <div>Bond: <span className="text-safety font-semibold">${bid2.collateralOfferedUsd}</span></div>
              </div>
              <button
                type="button"
                onClick={() => onApproveBid(bid2)}
                className="w-full py-2 rounded-lg bg-speed text-white hover:bg-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Authorize Option #2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer / Cancel */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Cancel & Reject Intent</span>
          </button>
          <span className="text-metadata text-slate-400 font-mono">
            Requires explicit signature authorization
          </span>
        </div>
      </div>
    </div>
  );
};
