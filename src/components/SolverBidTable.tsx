import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { SolverBid, PrioritySliders } from '../services/types';
import { Award, Clock, ChevronDown, ChevronUp, Activity } from 'lucide-react';

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
      <div className="glass-card p-8 text-center space-y-4 shadow-md h-full flex flex-col items-center justify-center border border-[rgba(43,43,43,0.12)]">
        <div className="w-12 h-12 rounded-full bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#D4A017] animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#2B2B2B] font-headline">
            Searching for Solvers across Mesh...
          </h3>
          <p className="text-xs text-[#5A5A5A] mt-1 font-sans">
            Broadcasting intent constraints to decentralized solver mesh...
          </p>
        </div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="glass-card p-8 text-center space-y-3 shadow-md h-full flex flex-col items-center justify-center font-mono border border-[rgba(43,43,43,0.12)]">
        <div className="text-sm font-bold text-[#2B2B2B]">Solver Bidding Pool Standby</div>
        <p className="text-xs text-[#5A5A5A]">Broadcast intent to view real-time competitive bids from solver network.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4 shadow-md h-full flex flex-col justify-between border border-[rgba(43,43,43,0.12)]">
      {/* Header & Auction Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
              Live Solver Auction & Capital Marketplace
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7E7B5] border border-[#D4A017]/40 text-[#2B2B2B] font-mono font-bold shadow-xs">
              {bids.length} Competing
            </span>
          </div>
          <p className="text-[11px] text-[#5A5A5A] mt-0.5 font-sans">
            Real-time multi-attribute competition driven by Cost ({sliders.cost}%), Speed ({sliders.speed}%), and Safety ({sliders.safety}%) weights.
          </p>
        </div>

        {/* Live Auction Countdown Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 font-mono text-xs text-[#2B2B2B] shrink-0 self-start sm:self-auto shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#D4A017] animate-spin" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#5A5A5A] uppercase font-semibold">
              {isAuctionClosed ? 'Status:' : 'Window:'}
            </span>
            <span className={`font-bold font-mono ${isAuctionClosed ? 'text-[#607A3A]' : 'text-[#B84A39]'}`}>
              {isAuctionClosed
                ? 'AUCTION CLOSED'
                : `00:${biddingCountdownSec.toString().padStart(2, '0')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Staggered Arrival Banner */}
      {arrivalMessage && !isAuctionClosed && (
        <div className="bg-[#F7E7B5]/60 border border-[#D4A017]/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-[#2B2B2B] font-mono animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-ping" />
          <span>{arrivalMessage}</span>
        </div>
      )}

      {/* Ranked Solver Cards: Winner gets #F7E7B5 with #D4A017 border & Mustard badge */}
      <div className="space-y-2.5">
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
              className={`rounded-xl border transition-all overflow-hidden ${
                isWinner
                  ? 'bg-[#F7E7B5] border-[#D4A017] shadow-md ring-2 ring-[#D4A017]/40'
                  : isRank1
                  ? 'bg-[#F7E7B5]/70 border-[#F0C94C] shadow-xs'
                  : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/30 border-[rgba(43,43,43,0.12)]'
              }`}
            >
              {/* Card Main Row */}
              <div className="p-3 sm:p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Rank, Name, Route */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isWinner
                        ? 'bg-[#D4A017] text-[#2B2B2B]'
                        : isRank1
                        ? 'bg-[#F0C94C] text-[#2B2B2B]'
                        : 'bg-[#F7E7B5] text-[#2B2B2B] border border-[rgba(43,43,43,0.08)]'
                    }`}
                  >
                    {isWinner ? <Award className="w-4 h-4 text-[#2B2B2B]" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-[#2B2B2B] font-mono">
                        {bid.solverName}
                      </h4>

                      {isWinner ? (
                        <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#D4A017] text-[#2B2B2B] shadow-xs">
                          ★ WINNER
                        </span>
                      ) : isRank1 ? (
                        <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#F0C94C] text-[#2B2B2B]">
                          Rank #1
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[10px] text-[#5A5A5A] font-mono">
                      {bid.routeDescription || 'Decentralized routing'}
                    </p>
                  </div>
                </div>

                {/* Middle: Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {/* Expected Output */}
                  <div className="bg-[#FFFDF5] px-2.5 py-1 rounded-md border border-[rgba(43,43,43,0.1)] shadow-xs">
                    <span className="text-[9px] text-[#5A5A5A] block">Output</span>
                    <span className="font-bold text-[#D4A017] text-xs">
                      ${bid.expectedOutput.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Fee & ETA */}
                  <div className="bg-[#FFFDF5] px-2.5 py-1 rounded-md border border-[rgba(43,43,43,0.1)] shadow-xs">
                    <span className="text-[9px] text-[#5A5A5A] block">Fee / ETA</span>
                    <span className="font-bold text-[#2B2B2B] text-xs">
                      ${bid.feeUsd.toFixed(2)} · {bid.etaSec}s
                    </span>
                  </div>

                  {/* Capital Status */}
                  <div className="bg-[#FFFDF5] px-2.5 py-1 rounded-md border border-[rgba(43,43,43,0.1)] shadow-xs col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-[#5A5A5A] block">Liquidity</span>
                    <span className="font-bold text-[#2B2B2B] text-xs">
                      ${(bid.liquidityUsd / 1000).toFixed(0)}K (Bond ${bid.collateralOfferedUsd})
                    </span>
                  </div>
                </div>

                {/* Right: Final Score & Breakdown Toggle */}
                <div className="flex items-center justify-between lg:justify-end gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] text-[#5A5A5A] uppercase font-mono block font-semibold">
                      Score
                    </span>
                    <span
                      className={`text-base font-bold font-mono ${
                        isWinner ? 'text-[#D4A017]' : isRank1 ? 'text-[#2B2B2B]' : 'text-[#2B2B2B]'
                      }`}
                    >
                      {bid.finalScore.toFixed(1)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(bid.solverId)}
                    className="px-2 py-1 rounded-md bg-[#FFFDF5] hover:bg-[#F7E7B5] border border-[rgba(43,43,43,0.12)] text-[11px] font-mono text-[#2B2B2B] flex items-center gap-0.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isExpanded ? 'Hide' : 'Info'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-[#2B2B2B]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#2B2B2B]" />
                    )}
                  </button>

                  {onSelectBid && !isAuctionClosed && (
                    <button
                      type="button"
                      onClick={() => onSelectBid(bid)}
                      className="px-3 py-1 rounded-md bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-[11px] font-bold text-[#2B2B2B] transition-all cursor-pointer shadow-xs"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Score Breakdown */}
              {isExpanded && (
                <div className="bg-[#FFFDF5] border-t border-[rgba(43,43,43,0.08)] p-3 space-y-2 font-mono text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-1">
                    <span className="font-bold text-[#2B2B2B] text-[10px] uppercase">
                      Formula Contributions:
                    </span>
                    <span className="text-[#5A5A5A] text-[10px]">
                      Cost ({(bid.subScores.costScore * (sliders.cost / 100)).toFixed(1)}) + Speed ({(bid.subScores.speedScore * (sliders.speed / 100)).toFixed(1)}) + Safety ({(bid.subScores.safetyScore * (sliders.safety / 100)).toFixed(1)})
                    </span>
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
