import React from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { Award, Zap, Shield, DollarSign, ChevronRight, Activity, ShieldAlert, CheckCircle2, Clock, Info, Tag } from 'lucide-react';

interface SolverBidTableProps {
  bids: SolverBid[];
  intent: UserIntent;
  isBroadcasting: boolean;
  biddingCountdownSec: number;
  autoProceedCountdownSec?: number | null;
  onSelectBid: (bid: SolverBid) => void;
  selectedBidId?: string;
  isAmbiguous?: boolean;
  scoreGap?: number;
  isHighValue?: boolean;
  onCancelAutoProceed?: () => void;
}

export const SolverBidTable: React.FC<SolverBidTableProps> = ({
  bids,
  intent,
  isBroadcasting,
  biddingCountdownSec,
  autoProceedCountdownSec,
  onSelectBid,
  selectedBidId,
  isAmbiguous,
  scoreGap,
  isHighValue,
  onCancelAutoProceed,
}) => {
  if (isBroadcasting && bids.length === 0) {
    return (
      <div className="glass-panel p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center animate-pulse-glow">
          <Activity className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-mono">Broadcasting Intent to Solver Network...</h3>
          <p className="text-xs text-slate-400 mt-1">
            Reaching distributed solvers (Alpha, Flash & Shield)...
          </p>
        </div>
      </div>
    );
  }

  if (bids.length === 0) return null;

  const topBid = bids[0];
  const isClearWinner = !isAmbiguous && !isHighValue;

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Table Header & Bidding Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-section font-bold text-white font-mono">Solver Bids Marketplace</h2>
            <span className="text-metadata px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-cost font-semibold">
              Solvers Reached: {bids.length}/3
            </span>
          </div>
          <p className="text-body text-slate-400 mt-0.5">
            Scored in real-time based on your priority weights: Cost ({intent.sliders.cost}%), Speed ({intent.sliders.speed}%), Safety ({intent.sliders.safety}%)
          </p>
        </div>

        {/* Live Bidding Window Countdown Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 font-mono text-xs text-indigo-300 shrink-0">
          <Clock className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>
            {biddingCountdownSec > 0
              ? `Bidding window closes in 0:0${biddingCountdownSec}`
              : 'Auction Bidding Closed'}
          </span>
        </div>
      </div>

      {/* Requirement 7: Distinct Alert / Checkpoint Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs transition-all ${
          isClearWinner
            ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
            : 'bg-alert/15 border-2 border-alert text-alert shadow-lg shadow-alert/10'
        }`}
      >
        {isClearWinner ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cost shrink-0" />
            <div>
              <span className="font-bold text-sm text-cost block">Auto-Selected — Proceeding automatically</span>
              <p className="text-slate-300 text-[11px] font-sans">
                Top bid clearly wins with a {((scoreGap || 0.2) * 100).toFixed(1)}% score advantage (&gt;5%). Execution starting in {autoProceedCountdownSec ?? 3}s...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-alert shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-sm text-alert block uppercase tracking-wide">
                User Action Required — Sensitive Decision Checkpoint
              </span>
              <p className="text-slate-200 text-[11px] font-sans">
                {isAmbiguous
                  ? `Top 2 bids are scored very close (${(scoreGap! * 100).toFixed(1)}% gap \u2264 5%). Please manually confirm your preferred solver.`
                  : `High-value intent ($${intent.sourceAmount} \u2265 $1,000). Manual sign-off required for ZK-Oracle verification.`}
              </p>
            </div>
          </div>
        )}

        {isClearWinner && onCancelAutoProceed && autoProceedCountdownSec !== null && (
          <button
            type="button"
            onClick={onCancelAutoProceed}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold shrink-0"
          >
            Pause Auto-Proceed
          </button>
        )}
      </div>

      {/* Rationale Banner for Rank #1 */}
      {topBid.synthesisRationale && (
        <div className="bg-slate-900/90 border border-indigo-500/40 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white font-mono uppercase text-[10px] tracking-wider block mb-0.5">
              Why This Ranked #1:
            </span>
            <p className="text-[11px] text-slate-300">{topBid.synthesisRationale}</p>
          </div>
        </div>
      )}

      {/* Requirement 5 & 2: Differentiated Bids & Flattened Sub-Cards */}
      <div className="space-y-4">
        {bids.map((bid, index) => {
          const isWinner = index === 0;
          const isSelected = selectedBidId === bid.solverId;

          // Requirement 5: Distinct Hero Card for Winning Bid vs. Compact Row for Non-Winners
          if (isWinner) {
            return (
              <div
                key={bid.solverId}
                className={`p-6 rounded-2xl border-2 transition-all shadow-xl ${
                  isClearWinner
                    ? 'bg-slate-900/90 border-cost shadow-cost/10'
                    : 'bg-slate-900/90 border-alert shadow-alert/10'
                } ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}
              >
                {/* Winner Header: Badge, Name, Hero Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cost/20 border border-cost/40 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-cost" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-section font-bold text-white">{bid.solverName}</h3>

                        {bid.summaryPill && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cost border border-cost/30 font-mono flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{bid.summaryPill}</span>
                          </span>
                        )}

                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono ${
                            isClearWinner
                              ? 'bg-cost/20 text-cost border border-cost/40'
                              : 'bg-alert/20 text-alert border border-alert/40'
                          }`}
                        >
                          {isClearWinner ? '★ Rank #1 Winning Bid' : 'Leading Bid (Manual Sign-off)'}
                        </span>
                      </div>
                      <p className="text-metadata text-slate-400 mt-1">{bid.routeDescription}</p>
                    </div>
                  </div>

                  {/* Requirement 3: Hero Score Readout (24px) */}
                  <div className="text-right shrink-0">
                    <div className="text-metadata text-slate-400 uppercase tracking-wider">Weighted Score</div>
                    <div className="text-hero-sm font-bold font-mono text-cost">
                      {(bid.finalScore * 100).toFixed(1)}
                      <span className="text-xs font-normal text-slate-500">/100</span>
                    </div>
                  </div>
                </div>

                {/* Requirement 2: Flattened Sub-Cards into Inline Stat Chips */}
                <div className="pt-4 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 text-xs font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-cost" />
                    <span className="text-slate-400">Cost:</span>
                    <span className="text-cost font-bold">${bid.proposedOutput}</span>
                    <span className="text-slate-500 text-[11px]">(Fee: ${bid.feeUsd})</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 text-xs font-mono">
                    <Zap className="w-3.5 h-3.5 text-speed" />
                    <span className="text-slate-400">Speed:</span>
                    <span className="text-speed font-bold">{bid.estimatedExecutionTimeSec}s</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 text-xs font-mono">
                    <Shield className="w-3.5 h-3.5 text-safety" />
                    <span className="text-slate-400">Safety:</span>
                    <span className="text-safety font-bold">Rep {bid.reputationScore}/100</span>
                    <span className="text-slate-500 text-[11px]">(Bond: ${bid.collateralOfferedUsd})</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!isClearWinner}
                    onClick={() => onSelectBid(bid)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      !isClearWinner
                        ? 'bg-alert/20 text-alert border border-alert/40 cursor-not-allowed'
                        : 'bg-cost text-slate-950 hover:bg-lime-300 font-bold shadow-lg shadow-cost/20'
                    }`}
                  >
                    <span>
                      {!isClearWinner
                        ? 'Review Action Required Above'
                        : 'Accept & Execute Winning Intent'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          }

          // Requirement 5: Compact Lower-Contrast Row for Non-Winning Bids
          return (
            <div
              key={bid.solverId}
              className="p-4 rounded-xl bg-slate-950/50 hover:bg-slate-900/60 border border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all opacity-80 hover:opacity-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-xs font-bold font-mono text-slate-400 shrink-0">
                  #{index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-body font-bold text-slate-200">{bid.solverName}</h4>
                    {bid.summaryPill && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {bid.summaryPill}
                      </span>
                    )}
                  </div>
                  <p className="text-metadata text-slate-500">{bid.routeDescription}</p>
                </div>
              </div>

              {/* Compact Inline Stat Chips */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-cost font-semibold">${bid.proposedOutput}</span>
                  <span className="text-speed font-semibold">{bid.estimatedExecutionTimeSec}s</span>
                  <span className="text-safety font-semibold">Rep {bid.reputationScore}</span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 font-bold">
                    {(bid.finalScore * 100).toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBid(bid)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Select</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
