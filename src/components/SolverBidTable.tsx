import React from 'react';
import { SolverBid, UserIntent } from '../services/types';
import { Award, Zap, Shield, DollarSign, ChevronRight, Activity, Clock, ShieldAlert } from 'lucide-react';

interface SolverBidTableProps {
  bids: SolverBid[];
  intent: UserIntent;
  isBroadcasting: boolean;
  onSelectBid: (bid: SolverBid) => void;
  selectedBidId?: string;
  isAmbiguous?: boolean;
  scoreGap?: number;
}

export const SolverBidTable: React.FC<SolverBidTableProps> = ({
  bids,
  intent,
  isBroadcasting,
  onSelectBid,
  selectedBidId,
  isAmbiguous,
  scoreGap,
}) => {
  if (isBroadcasting) {
    return (
      <div className="glass-panel p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center animate-pulse-glow">
          <Activity className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-mono">Broadcasting Intent to Solver Pool...</h3>
          <p className="text-xs text-slate-400 mt-1">
            Receiving competitive bids from Alpha, Flash & Shield solver agents...
          </p>
        </div>
      </div>
    );
  }

  if (bids.length === 0) return null;

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-mono">Solver Bids & Dynamic Scoring</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold">
              3 Bids Received
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scored in real-time based on your priority weights: Cost ({intent.sliders.cost}%), Speed ({intent.sliders.speed}%), Safety ({intent.sliders.safety}%)
          </p>
        </div>

        {/* Ambiguity Alert Banner if top 2 bids are within 5% */}
        {isAmbiguous && (
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-700/80 px-3 py-1.5 rounded-lg text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ambiguous Winner! Gap: {(scoreGap! * 100).toFixed(1)}% &le; 5%</span>
          </div>
        )}
      </div>

      {/* Solver Bid Cards */}
      <div className="space-y-4">
        {bids.map((bid, index) => {
          const isWinner = index === 0;
          const isSelected = selectedBidId === bid.solverId;

          return (
            <div
              key={bid.solverId}
              className={`p-5 rounded-xl border transition-all ${
                isWinner
                  ? 'bg-slate-900/90 border-indigo-500/80 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              } ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}
            >
              {/* Card Top: Profile Name & Final Score */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  {isWinner ? (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      #{index + 1}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{bid.solverName}</h4>
                      {isWinner && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          Auto Rank #1
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{bid.routeDescription}</p>
                  </div>
                </div>

                {/* Final Score Pill */}
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Weighted Final Score</div>
                  <div className="text-xl font-bold font-mono text-indigo-400">
                    {(bid.finalScore * 100).toFixed(1)}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Sub-Score Breakdown Section (MANDATORY REQUIREMENT) */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Cost Sub-Score */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-indigo-300 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                      Cost Sub-score
                    </span>
                    <span className="font-mono text-indigo-400">
                      {(bid.subScores.costScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${bid.subScores.costScore * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                    <div>Output: <span className="text-white">${bid.proposedOutput}</span></div>
                    <div>Fee: <span className="text-white">${bid.feeUsd}</span></div>
                    <div>Slippage: <span className="text-white">{bid.estimatedSlippagePct}%</span></div>
                  </div>
                </div>

                {/* Speed Sub-Score */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-amber-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Speed Sub-score
                    </span>
                    <span className="font-mono text-amber-400">
                      {(bid.subScores.speedScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${bid.subScores.speedScore * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                    <div>Exec Time: <span className="text-white">{bid.estimatedExecutionTimeSec}s</span></div>
                    <div>Solana Latency: <span className="text-white">~1.2s</span></div>
                  </div>
                </div>

                {/* Safety Sub-Score */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-cyan-300 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      Safety Sub-score
                    </span>
                    <span className="font-mono text-cyan-400">
                      {(bid.subScores.safetyScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${bid.subScores.safetyScore * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                    <div>Reputation: <span className="text-white">{bid.reputationScore}/100</span></div>
                    <div>Bond Locked: <span className="text-white">${bid.collateralOfferedUsd}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectBid(bid)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isWinner
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <span>{isWinner ? 'Accept & Execute Top Bid' : 'Select Solver'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
