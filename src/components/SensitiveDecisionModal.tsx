import React from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { ShieldAlert, AlertTriangle, CheckCircle, Lock, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-amber-900/50 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Sensitive Decision Checkpoint</h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                User Authorization Required
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Automated execution paused. The protocol escalated this transaction because:
            </p>
          </div>
        </div>

        {/* Trigger Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isAmbiguous && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-300">Ambiguous Top Bids Score:</span>
                <p className="text-slate-400 mt-0.5">
                  Top 2 bids score within 5% of each other ({(bid1.finalScore * 100).toFixed(1)} vs {(bid2.finalScore * 100).toFixed(1)}).
                </p>
              </div>
            </div>
          )}

          {isHighValue && (
            <div className="bg-indigo-950/40 border border-indigo-800/60 p-3 rounded-lg flex items-start gap-2">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-indigo-300">High-Value Threshold Exceeded:</span>
                <p className="text-slate-400 mt-0.5">
                  Intent amount (${intent.sourceAmount}) &ge; $1,000 USD limit. Escalate to ZK/Oracle Verification Path.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Bid Comparison */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Compare Top Solver Options:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bid 1 */}
            <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/60 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-bold text-white">{bid1.solverName}</h5>
                  <span className="text-[10px] font-mono text-indigo-400">Score: {(bid1.finalScore * 100).toFixed(1)}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono font-bold">
                  Option #1
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div>Output: <span className="text-emerald-400 font-bold">${bid1.proposedOutput}</span></div>
                <div>Fee: ${bid1.feeUsd}</div>
                <div>Time: {bid1.estimatedExecutionTimeSec}s</div>
                <div>Bond: ${bid1.collateralOfferedUsd}</div>
              </div>
              <button
                type="button"
                onClick={() => onApproveBid(bid1)}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span>Authorize Option #1</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bid 2 */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-bold text-white">{bid2.solverName}</h5>
                  <span className="text-[10px] font-mono text-cyan-400">Score: {(bid2.finalScore * 100).toFixed(1)}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                  Option #2
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div>Output: <span className="text-emerald-400 font-bold">${bid2.proposedOutput}</span></div>
                <div>Fee: ${bid2.feeUsd}</div>
                <div>Time: {bid2.estimatedExecutionTimeSec}s</div>
                <div>Bond: ${bid2.collateralOfferedUsd}</div>
              </div>
              <button
                type="button"
                onClick={() => onApproveBid(bid2)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span>Authorize Option #2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            Cancel Intent & Refund Escrow
          </button>
        </div>
      </div>
    </div>
  );
};
