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
      <div className="glass-card p-8 text-center space-y-4 shadow-xl h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(14,30,56,0.65)] border border-[#2F6690]/50 flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#8DC2FF] animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-mono">
            Searching for Solvers across Mesh...
          </h3>
          <p className="text-xs text-[#CBD5E1] mt-1 font-sans">
            Broadcasting intent constraints to decentralized solver mesh...
          </p>
        </div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="glass-card p-8 text-center space-y-3 shadow-xl h-full flex flex-col items-center justify-center font-mono">
        <div className="text-sm font-bold text-white">Solver Bidding Pool Standby</div>
        <p className="text-xs text-[#CBD5E1]">Broadcast intent to view real-time competitive bids from solver network.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4 shadow-xl h-full flex flex-col justify-between">
      {/* Header & Auction Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Live Solver Auction & Capital Marketplace
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(14,30,56,0.65)] border border-[#CEF26D]/30 text-[#CEF26D] font-mono font-bold">
              {bids.length} Competing
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5E1] mt-0.5 font-sans">
            Real-time multi-attribute competition driven by Cost ({sliders.cost}%), Speed ({sliders.speed}%), and Safety ({sliders.safety}%) weights.
          </p>
        </div>

        {/* Live Auction Countdown Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-sub-box font-mono text-xs text-white shrink-0 self-start sm:self-auto shadow-md">
          <Clock className="w-3.5 h-3.5 text-[#8DC2FF] animate-spin" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#CBD5E1] uppercase">
              {isAuctionClosed ? 'Status:' : 'Window:'}
            </span>
            <span className={`font-bold font-mono ${isAuctionClosed ? 'text-[#CEF26D]' : 'text-[#FF7032]'}`}>
              {isAuctionClosed
                ? 'AUCTION CLOSED'
                : `00:${biddingCountdownSec.toString().padStart(2, '0')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Staggered Arrival Banner */}
      {arrivalMessage && !isAuctionClosed && (
        <div className="glass-sub-box p-2.5 flex items-center gap-2 text-xs text-[#8DC2FF] font-mono animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-ping" />
          <span>{arrivalMessage}</span>
        </div>
      )}

      {/* Ranked Solver Cards */}
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
                  ? 'bg-[rgba(22,42,70,0.85)] border-[#CEF26D] shadow-xl shadow-[#CEF26D]/15 ring-1 ring-[#CEF26D]'
                  : isRank1
                  ? 'bg-[rgba(22,42,70,0.7)] border-[#8DC2FF] shadow-lg shadow-[#2F6690]/20'
                  : 'glass-sub-box border-white/5'
              }`}
            >
              {/* Card Main Row */}
              <div className="p-3 sm:p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Rank, Name, Route */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isWinner
                        ? 'bg-[#CEF26D]/20 text-[#CEF26D] border border-[#CEF26D]'
                        : isRank1
                        ? 'bg-[#2F6690]/30 text-[#8DC2FF] border border-[#8DC2FF]'
                        : 'bg-[rgba(10,20,38,0.7)] text-[#CBD5E1] border border-white/5'
                    }`}
                  >
                    {isWinner ? <Award className="w-4 h-4 text-[#CEF26D]" /> : `#${index + 1}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white font-mono">
                        {bid.solverName}
                      </h4>

                      {isWinner ? (
                        <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-[#CEF26D]/20 text-[#CEF26D] border border-[#CEF26D]/40">
                          ★ Winner
                        </span>
                      ) : isRank1 ? (
                        <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-[#2F6690]/30 text-[#8DC2FF] border border-[#8DC2FF]/40">
                          Rank #1
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[10px] text-[#CBD5E1] font-mono">
                      {bid.routeDescription || 'Decentralized routing'}
                    </p>
                  </div>
                </div>

                {/* Middle: Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {/* Expected Output */}
                  <div className="bg-[rgba(10,20,38,0.7)] px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[9px] text-[#CBD5E1] block">Output</span>
                    <span className="font-bold text-[#CEF26D] text-xs">
                      ${bid.expectedOutput.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Fee & ETA */}
                  <div className="bg-[rgba(10,20,38,0.7)] px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[9px] text-[#CBD5E1] block">Fee / ETA</span>
                    <span className="font-bold text-white text-xs">
                      ${bid.feeUsd.toFixed(2)} · {bid.etaSec}s
                    </span>
                  </div>

                  {/* Capital Status */}
                  <div className="bg-[rgba(10,20,38,0.7)] px-2 py-1 rounded-md border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-[#CBD5E1] block">Liquidity</span>
                    <span className="font-bold text-[#8DC2FF] text-xs">
                      ${(bid.liquidityUsd / 1000).toFixed(0)}K (Bond ${bid.collateralOfferedUsd})
                    </span>
                  </div>
                </div>

                {/* Right: Final Score & Breakdown Toggle */}
                <div className="flex items-center justify-between lg:justify-end gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] text-[#CBD5E1] uppercase font-mono block">
                      Score
                    </span>
                    <span
                      className={`text-base font-bold font-mono ${
                        isRank1 ? 'text-[#CEF26D]' : 'text-white'
                      }`}
                    >
                      {bid.finalScore.toFixed(1)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(bid.solverId)}
                    className="px-2 py-1 rounded-md bg-[rgba(14,30,56,0.65)] hover:bg-white/10 border border-[#8DC2FF]/20 text-[11px] font-mono text-[#8DC2FF] flex items-center gap-0.5 transition-all cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide' : 'Info'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {onSelectBid && !isAuctionClosed && (
                    <button
                      type="button"
                      onClick={() => onSelectBid(bid)}
                      className="px-2.5 py-1 rounded-md bg-[#2F6690] hover:bg-[#3D7BAA] font-mono text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Score Breakdown */}
              {isExpanded && (
                <div className="bg-[rgba(10,20,38,0.9)] border-t border-white/10 p-3 space-y-2 font-mono text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="font-bold text-white text-[10px] uppercase">
                      Formula Contributions:
                    </span>
                    <span className="text-[#CBD5E1] text-[10px]">
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
