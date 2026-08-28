import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { SolverBid, PrioritySliders } from '../services/types';
import { Award, Clock, ChevronDown, ChevronUp, DollarSign, Zap, Shield, Activity } from 'lucide-react';
import { WhySolverWonCard } from './WhySolverWonCard';

interface SolverBidTableProps {
  bids: SolverBid[];
  sliders: PrioritySliders;
  isBroadcasting: boolean;
  biddingCountdownSec: number;
  arrivalMessage?: string;
  isAuctionClosed?: boolean;
  winningBidId?: string;
  onSelectBid?: (bid: SolverBid) => void;
}

export const SolverBidTable: React.FC<SolverBidTableProps> = ({
  bids,
  sliders,
  isBroadcasting,
  biddingCountdownSec,
  arrivalMessage,
  isAuctionClosed,
  winningBidId,
  onSelectBid,
}) => {
  const [expandedSolverId, setExpandedSolverId] = useState<string | null>(null);

  const toggleExpand = (solverId: string) => {
    setExpandedSolverId((prev) => (prev === solverId ? null : solverId));
  };

  if (isBroadcasting && bids.length === 0) {
    return (
      <div className="bg-[#151526] border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#20203A] border border-[#1053D4]/50 flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#A9A7FF] animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-mono">
            Searching for Solvers across Mesh...
          </h3>
          <p className="text-xs text-[#A5A5B8] mt-1 font-sans">
            Broadcasting intent constraints to decentralized solver mesh...
          </p>
        </div>
      </div>
    );
  }

  if (bids.length === 0) return null;

  const topBid = bids[0];
  const winningBid = bids.find((b) => b.solverId === winningBidId) || (isAuctionClosed ? topBid : undefined);

  return (
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Header & Auction Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-mono">
              Live Solver Auction & Capital Marketplace
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#20203A] border border-[#D1FE5D]/30 text-[#D1FE5D] font-mono font-bold">
              {bids.length} Competing
            </span>
          </div>
          <p className="text-xs text-[#A5A5B8] mt-1 font-sans">
            Solvers competing in real-time. Dynamic ranking driven by your Cost ({sliders.cost}%), Speed ({sliders.speed}%), and Safety ({sliders.safety}%) weights.
          </p>
        </div>

        {/* Live Auction Countdown Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#20203A] border border-white/10 font-mono text-xs text-white shrink-0 self-start sm:self-auto shadow-md">
          <Clock className="w-4 h-4 text-[#A9A7FF] animate-spin" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#A5A5B8] uppercase">
              {isAuctionClosed ? 'Auction Status' : 'Bidding Window'}
            </span>
            <span className={`font-bold font-mono ${isAuctionClosed ? 'text-[#D1FE5D]' : 'text-[#FF7032]'}`}>
              {isAuctionClosed
                ? 'AUCTION CLOSED'
                : `00:${biddingCountdownSec.toString().padStart(2, '0')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Staggered Arrival / Activity Banner */}
      {arrivalMessage && !isAuctionClosed && (
        <div className="bg-[#20203A]/70 border border-[#1053D4]/40 p-3 rounded-xl flex items-center gap-2.5 text-xs text-[#A9A7FF] font-mono animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#D1FE5D] animate-ping" />
          <span>{arrivalMessage}</span>
        </div>
      )}

      {/* Module 2: Why Solver Won Explanation (when winner is determined) */}
      {isAuctionClosed && winningBid && (
        <WhySolverWonCard winningBid={winningBid} sliders={sliders} />
      )}

      {/* Ranked Solver Cards (Framer Motion Layout Animation for Real-Time Reordering) */}
      <div className="space-y-3">
        {bids.map((bid, index) => {
          const isRank1 = index === 0;
          const isWinner = isAuctionClosed && (winningBidId ? winningBidId === bid.solverId : isRank1);
          const isExpanded = expandedSolverId === bid.solverId;

          return (
            <motion.div
              key={bid.solverId}
              layout
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
              }}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isWinner
                  ? 'bg-[#20203A] border-[#D1FE5D] shadow-xl shadow-[#D1FE5D]/10 ring-1 ring-[#D1FE5D]'
                  : isRank1
                  ? 'bg-[#20203A]/90 border-[#1053D4] shadow-lg shadow-[#1053D4]/10'
                  : 'bg-[#151526] hover:bg-[#20203A]/60 border-white/10'
              }`}
            >
              {/* Card Main Row */}
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Rank, Name, Route */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isWinner
                        ? 'bg-[#D1FE5D]/20 text-[#D1FE5D] border border-[#D1FE5D]'
                        : isRank1
                        ? 'bg-[#1053D4]/20 text-[#A9A7FF] border border-[#1053D4]'
                        : 'bg-[#20203A] text-[#A5A5B8] border border-white/5'
                    }`}
                  >
                    {isWinner ? <Award className="w-5 h-5 text-[#D1FE5D]" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white font-mono">
                        {bid.solverName}
                      </h4>

                      {isWinner ? (
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#D1FE5D]/20 text-[#D1FE5D] border border-[#D1FE5D]/40">
                          ★ Selected Winner
                        </span>
                      ) : isRank1 ? (
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#1053D4]/20 text-[#A9A7FF] border border-[#1053D4]/40">
                          Leading Rank #1
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[11px] text-[#A5A5B8] font-mono mt-0.5">
                      {bid.routeDescription || 'Decentralized liquidity routing'}
                    </p>
                  </div>
                </div>

                {/* Middle: Key Metric Chips + Module 8: Capital & Liquidity Status Meter */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {/* Expected Output */}
                  <div className="bg-[#0B0B14] px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#A5A5B8] block">Expected Output</span>
                    <span className="font-bold text-[#D1FE5D]">
                      ${bid.expectedOutput.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Fee & ETA */}
                  <div className="bg-[#0B0B14] px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#A5A5B8] block">Fee / ETA</span>
                    <span className="font-bold text-white">
                      ${bid.feeUsd.toFixed(2)} · {bid.etaSec}s
                    </span>
                  </div>

                  {/* Module 8: Capital & Liquidity Availability Status */}
                  <div className="bg-[#0B0B14] px-2.5 py-1.5 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                    <div className="flex justify-between items-center text-[10px] text-[#A5A5B8]">
                      <span>Capital Available</span>
                      <span className="text-[#D1FE5D]">✓ Verified</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-[#7171DE] mt-0.5">
                      <span>${(bid.liquidityUsd / 1000).toFixed(0)}K Liq</span>
                      <span className="text-white text-[10px]">(${bid.collateralOfferedUsd} Bond)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Final Weighted Score & Breakdown Toggle */}
                <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="text-right">
                    <span className="text-[10px] text-[#A5A5B8] uppercase font-mono block">
                      Score
                    </span>
                    <span
                      className={`text-lg font-bold font-mono ${
                        isRank1 ? 'text-[#D1FE5D]' : 'text-white'
                      }`}
                    >
                      {bid.finalScore.toFixed(1)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(bid.solverId)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#20203A] hover:bg-[#20203A]/80 border border-white/10 text-xs font-mono text-[#A9A7FF] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide' : 'Breakdown'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onSelectBid && !isAuctionClosed && (
                    <button
                      type="button"
                      onClick={() => onSelectBid(bid)}
                      className="px-3 py-1.5 rounded-lg bg-[#1053D4] hover:bg-blue-600 font-mono text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Score Breakdown Calculation */}
              {isExpanded && (
                <div className="bg-[#0B0B14]/90 border-t border-white/10 p-4 sm:p-5 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                      Deterministic Score Formula Breakdown:
                    </span>
                    <span className="text-[#A5A5B8] text-[11px]">
                      Final Score = Σ (SubScore × Weight)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Cost Calculation */}
                    <div className="bg-[#151526] p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[#D1FE5D] font-bold">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" /> Cost
                        </span>
                        <span>{bid.subScores.costScore}</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                        <span>User Weight:</span>
                        <span className="text-white">{sliders.cost}%</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between pt-1 border-t border-white/5">
                        <span>Contribution:</span>
                        <span className="text-[#D1FE5D] font-bold">
                          {(bid.subScores.costScore * (sliders.cost / 100)).toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Speed Calculation */}
                    <div className="bg-[#151526] p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[#1053D4] font-bold">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> Speed
                        </span>
                        <span>{bid.subScores.speedScore}</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                        <span>User Weight:</span>
                        <span className="text-white">{sliders.speed}%</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between pt-1 border-t border-white/5">
                        <span>Contribution:</span>
                        <span className="text-[#1053D4] font-bold">
                          {(bid.subScores.speedScore * (sliders.speed / 100)).toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Safety Calculation */}
                    <div className="bg-[#151526] p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[#7171DE] font-bold">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" /> Safety
                        </span>
                        <span>{bid.subScores.safetyScore}</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between">
                        <span>User Weight:</span>
                        <span className="text-white">{sliders.safety}%</span>
                      </div>
                      <div className="text-[11px] text-[#A5A5B8] flex justify-between pt-1 border-t border-white/5">
                        <span>Contribution:</span>
                        <span className="text-[#7171DE] font-bold">
                          {(bid.subScores.safetyScore * (sliders.safety / 100)).toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
