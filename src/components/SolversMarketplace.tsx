import React, { useState } from 'react';
import type { SolverBid, UserIntent } from '../services/types';
import { Search, CheckCircle2, ShieldAlert, Clock, ArrowRight, ShieldCheck, Zap, Award, Activity, Bot } from 'lucide-react';

interface SolversMarketplaceProps {
  bids: SolverBid[];
  intent: UserIntent | null;
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

export const SolversMarketplace: React.FC<SolversMarketplaceProps> = ({
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('ALL');
  const [selectedSolverDetail, setSelectedSolverDetail] = useState<string | null>(null);

  const mockDirectorySolvers = [
    {
      id: 'nexus',
      name: 'NexusRoute',
      status: 'ONLINE • HIGH CAPACITY',
      reputation: 99.9,
      tvl: '$142.5M',
      successRate: '99.8%',
      activeBids: 1204,
      isHero: true,
    },
    {
      id: 'flash',
      name: 'FlashSolve',
      specialized: 'SPECIALIZED: ARB',
      reputation: 98.5,
      tvl: '$45.2M',
      successRate: '98.5%',
      activeBids: 432,
    },
    {
      id: 'omni',
      name: 'OmniRouter',
      specialized: 'CROSS-CHAIN',
      reputation: 99.1,
      tvl: '$88.1M',
      successRate: '99.1%',
      activeBids: 891,
    },
    {
      id: 'alpha',
      name: 'AlphaMatch',
      specialized: 'OFFLINE',
      reputation: 94.2,
      tvl: '$12.4M',
      successRate: '94.2%',
      activeBids: 0,
      isOffline: true,
    },
    {
      id: 'zero',
      name: 'ZeroSlippage',
      specialized: 'SPECIALIZED: OP',
      reputation: 97.8,
      tvl: '$29.6M',
      successRate: '97.8%',
      activeBids: 156,
    },
  ];

  // If there's an active intent with broadcasting/bids, render Live Bidding Competition State!
  if (isBroadcasting || (intent && bids.length > 0)) {
    const isClearWinner = !isAmbiguous && !isHighValue;

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (Matching Reference UI) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DA] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1915] font-sans">
              Solvers Auction Competition
            </h1>
            <p className="text-xs text-[#6B6659] mt-0.5">
              Live competitive bidding window for Intent <span className="font-mono text-[#C69214]">#{intent?.intentId}</span>
            </p>
          </div>

          {/* Live Countdown Timer (Matching Image 5 `00:11`) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF5E8] border border-[#E5D19E] text-xs font-mono text-[#8C6407] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#C69214] animate-spin" />
            <span>
              {biddingCountdownSec > 0
                ? `Bidding window: 00:0${biddingCountdownSec}`
                : 'Bidding Window Closed'}
            </span>
          </div>
        </div>

        {/* Sensitive-Decision Checkpoint / Auto-Select Banner */}
        <div className={`ix-card p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs ${
          isClearWinner 
            ? 'bg-[#F2F9F4] border-[#B6E3C4] text-[#1E5631]' 
            : 'bg-[#FAF0D9] border-[#E5C984] text-[#8C6407]'
        }`}>
          {isClearWinner ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-sm block font-sans">Clear Top Bid — Proceeding Automatically</span>
                <span className="text-[11px] text-[#4A5D4E] font-sans">
                  Top bid holds a {((scoreGap || 0.2) * 100).toFixed(1)}% score advantage. Auto-execution in {autoProceedCountdownSec ?? 3}s...
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#C69214] shrink-0" />
              <div>
                <span className="font-bold text-sm block font-sans">Sensitive Decision Checkpoint — Manual Input Required</span>
                <span className="text-[11px] text-[#705007] font-sans">
                  {isAmbiguous
                    ? `Close bid competition (${((scoreGap || 0.02) * 100).toFixed(1)}% score gap ≤ 5%). Select winning solver.`
                    : `High-value intent ($${intent?.sourceAmount} ≥ $1,000). Manual ZK/Oracle verification approval required.`}
                </span>
              </div>
            </div>
          )}

          {isClearWinner && onCancelAutoProceed && autoProceedCountdownSec !== null && (
            <button
              type="button"
              onClick={onCancelAutoProceed}
              className="px-3 py-1.5 rounded bg-white border border-[#B6E3C4] text-xs font-mono font-semibold text-[#1E5631] hover:bg-[#E2F2E7] transition-colors shrink-0"
            >
              Pause & Compare
            </button>
          )}
        </div>

        {/* Staggered Live Bids Grid / Side-by-Side Comparison */}
        {isBroadcasting && bids.length === 0 ? (
          <div className="ix-card p-12 text-center space-y-3">
            <Activity className="w-8 h-8 text-[#C69214] animate-spin mx-auto" />
            <h3 className="text-base font-bold text-[#1A1915] font-sans">Broadcasting Intent to Solver Network...</h3>
            <p className="text-xs text-[#6B6659]">Relaying parameters to distributed solver nodes (Alpha, Flash & Shield)...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort bids dynamically so FLIP position swap triggers when score ranking changes */}
            {[...bids].sort((a, b) => b.finalScore - a.finalScore).map((bid, index) => {
              const isSelected = selectedBidId === bid.solverId || (index === 0 && !selectedBidId);
              const isTopRanked = index === 0;

              return (
                <div
                  key={bid.solverId}
                  className={`ix-card p-5 space-y-4 ix-flip-item ix-card-hover relative flex flex-col justify-between ${
                    isSelected ? 'border-[#C69214] ring-2 ring-[#C69214]/20 shadow-md' : 'hover:border-[#D8D2C4]'
                  }`}
                  style={{
                    animationDelay: `${(index + 1) * 220}ms`,
                  }}
                >
                  {/* Leading Bid Badge */}
                  {isTopRanked && (
                    <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-[#C69214] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs transition-all duration-300">
                      LEADING BID
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1915] font-sans">{bid.solverName}</h4>
                        <span className="text-[11px] font-mono text-[#7A7568]">{bid.summaryPill || 'Cross-Chain Aggregator'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[#C69214]">
                          {(bid.finalScore * 100).toFixed(1)} Pts
                        </div>
                        <div className="text-[10px] font-mono text-[#7A7568]">Rep: {bid.reputationScore}%</div>
                      </div>
                    </div>

                    {/* Score Bar Animation */}
                    <div className="w-full h-1.5 bg-[#E8E4DA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C69214] rounded-full transition-all duration-800 ease-out"
                        style={{ width: `${Math.min(100, bid.finalScore * 100)}%` }}
                      />
                    </div>

                    {/* Bid Values */}
                    <div className="space-y-1.5 text-xs font-mono border-t border-b border-[#E8E4DA] py-2.5">
                      <div className="flex items-center justify-between text-[#6B6659]">
                        <span>Output Amount:</span>
                        <span className="font-bold text-[#1A1915]">${bid.proposedOutput.toFixed(2)} USDC</span>
                      </div>
                      <div className="flex items-center justify-between text-[#6B6659]">
                        <span>Protocol Fee:</span>
                        <span className="font-bold text-[#1A1915]">${bid.feeUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#6B6659]">
                        <span>Execution Speed:</span>
                        <span className="font-bold text-[#1A1915]">{bid.estimatedExecutionTimeSec}s</span>
                      </div>
                      <div className="flex items-center justify-between text-[#6B6659]">
                        <span>Bond Collateral:</span>
                        <span className="font-bold text-[#8C6407]">${bid.collateralOfferedUsd.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Route Description */}
                    <p className="text-[11px] text-[#6B6659] leading-relaxed">
                      {bid.routeDescription}
                    </p>
                  </div>

                  {/* Select Action Button */}
                  <button
                    type="button"
                    onClick={() => onSelectBid(bid)}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all ix-btn-active flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'ix-btn-gold shadow-xs'
                        : 'ix-btn-outline hover:border-[#C69214]'
                    }`}
                  >
                    <span>{isSelected ? 'SELECTED BID' : 'SELECT SOLVER'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    );
  }

  // Standard Solvers Directory Marketplace View (Matching Image 2 & 3)
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header (Matching Image 2: Solvers Marketplace) */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1915] font-sans">
          Solvers Marketplace
        </h1>
        <p className="text-sm text-[#6B6659] max-w-3xl">
          Discover and route through active protocol solvers based on historical performance, specialization, and real-time network states.
        </p>
      </div>

      {/* Search & Filter Bar (Matching Image 2) */}
      <div className="ix-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#7A7568] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by solver name or network..."
            className="w-full bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-[#1A1915] outline-none focus:border-[#C69214] transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedNetworkFilter}
            onChange={(e) => setSelectedNetworkFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg px-3 py-2 text-xs font-mono text-[#38352F] outline-none focus:border-[#C69214] uppercase cursor-pointer"
          >
            <option value="ALL">ALL NETWORKS</option>
            <option value="ETH">ETHEREUM</option>
            <option value="SOL">SOLANA</option>
            <option value="ARB">ARBITRUM</option>
          </select>

          <select
            className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg px-3 py-2 text-xs font-mono text-[#38352F] outline-none focus:border-[#C69214] uppercase cursor-pointer"
          >
            <option value="REP">SORT BY: REPUTATION</option>
            <option value="TVL">SORT BY: TVL</option>
            <option value="SPEED">SORT BY: EXECUTION SPEED</option>
          </select>
        </div>

      </div>

      {/* If a solver is clicked, show AlphaNode detail view (Matching Image 3)! */}
      {selectedSolverDetail ? (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedSolverDetail(null)}
            className="text-xs font-mono text-[#C69214] hover:underline flex items-center gap-1"
          >
            ← Back to Solvers List
          </button>

          {/* Hero Solver Banner (Matching Image 3: AlphaNode) */}
          <div className="ix-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center text-[#8C6407]">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#1A1915] font-sans">AlphaNode</h2>
                  <span className="px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#E5D19E] text-[#8C6407] text-[10px] font-mono font-bold">
                    • Active
                  </span>
                </div>
                <p className="text-xs text-[#6B6659]">
                  High-frequency solver specializing in cross-chain DEX aggregation and complex routing paths.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="ix-btn-outline px-4 py-2 text-xs">
                Follow
              </button>
              <button type="button" className="ix-btn-gold px-4 py-2 text-xs">
                Delegate Stake
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Trust Signals & Right Performance Chart (Matching Image 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: TRUST SIGNALS */}
            <div className="space-y-4">
              <div className="ix-card p-5 space-y-4">
                <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider block">
                  TRUST SIGNALS
                </span>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5]">
                    <ShieldCheck className="w-5 h-5 text-[#C69214] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1A1915]">Slash Protection Enabled</div>
                      <div className="text-[11px] text-[#7A7568]">Covered up to 500 ETH</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5]">
                    <Zap className="w-5 h-5 text-[#C69214] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1A1915]">Staked Capital</div>
                      <div className="text-[11px] text-[#7A7568]">$2.4M (1,240 ETH)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5]">
                    <Award className="w-5 h-5 text-[#C69214] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1A1915]">Audited Smart Contracts</div>
                      <div className="text-[11px] text-[#7A7568]">Zellic, Trail of Bits</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats 2x2 Grid */}
              <div className="ix-card p-5 grid grid-cols-2 gap-4 text-center font-mono">
                <div>
                  <div className="text-[10px] text-[#7A7568] uppercase">Total Solved</div>
                  <div className="text-xl font-extrabold text-[#1A1915]">14,290</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#7A7568] uppercase">Success Rate</div>
                  <div className="text-xl font-extrabold text-[#C69214]">99.4%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#7A7568] uppercase">Avg Execution</div>
                  <div className="text-lg font-bold text-[#1A1915]">1.2s</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#7A7568] uppercase">Total Volume</div>
                  <div className="text-lg font-bold text-[#1A1915]">$142M</div>
                </div>
              </div>
            </div>

            {/* Right Column: Performance Chart & Fulfilling List (Matching Image 3) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* 30D Performance Chart Mock */}
              <div className="ix-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider">
                    PERFORMANCE (30D)
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#E5D19E] text-[#8C6407] font-bold">Success Rate</span>
                    <span className="px-2 py-0.5 rounded text-[#7A7568]">Exec Time</span>
                  </div>
                </div>

                <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-[#E8E4DA]">
                  {[40, 65, 30, 75, 45, 80, 60, 85, 55, 90, 70, 95].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t transition-all ${
                        i >= 9 ? 'bg-[#C69214]' : 'bg-[#D9C496]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#7A7568]">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                </div>
              </div>

              {/* Currently Fulfilling List */}
              <div className="ix-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-2">
                  <span className="text-[11px] font-mono font-medium text-[#7A7568] uppercase tracking-wider">
                    CURRENTLY FULFILLING
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#E5D19E] text-[#8C6407] text-[10px] font-mono font-bold">
                    3 Active
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#FAF8F5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1A1915]">Swap 10 ETH to USDC</div>
                      <div className="text-[10px] text-[#7A7568]">ID: 0x9a4...2b1</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#C69214] font-bold">Routing...</div>
                      <div className="text-[10px] text-[#7A7568]">Est. &lt; 2s</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF8F5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1A1915]">Bridge 5,000 USDC to Arb</div>
                      <div className="text-[10px] text-[#7A7568]">ID: 0x3f1...8c9</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#8C6407] font-bold">Confirming...</div>
                      <div className="text-[10px] text-[#7A7568]">Est. &lt; 15s</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF8F5] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1A1915]">Limit Order: Buy UNI @ $6.50</div>
                      <div className="text-[10px] text-[#7A7568]">ID: 0x7d2...1a4</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#7A7568] font-bold">Monitoring</div>
                      <div className="text-[10px] text-[#7A7568]">Target not met</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* Solver Directory Cards (Matching Image 2) */
        <div className="space-y-4">
          
          {/* Featured Hero Solver Card (NexusRoute) */}
          <div
            onClick={() => setSelectedSolverDetail('nexus')}
            className="ix-card p-6 hover:border-[#C69214] transition-all cursor-pointer space-y-5 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center text-[#8C6407] group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1915] font-sans group-hover:text-[#C69214] transition-colors">
                    NexusRoute
                  </h3>
                  <span className="text-[11px] font-mono text-[#7A7568] uppercase tracking-wider">
                    • ONLINE • HIGH CAPACITY
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <div className="text-[10px] text-[#7A7568] uppercase tracking-wider">REPUTATION SCORE</div>
                <div className="text-2xl font-extrabold text-[#1A1915]">99.9</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-[#E8E4DA] pt-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#7A7568] uppercase">TOTAL VALUE LOCKED</div>
                <div className="text-base font-bold text-[#1A1915]">$142.5M</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A7568] uppercase">SUCCESS RATE</div>
                <div className="text-base font-bold text-[#1A1915]">99.8%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#7A7568] uppercase">ACTIVE BIDS</div>
                <div className="text-base font-bold text-[#1A1915]">1,204</div>
              </div>
            </div>
          </div>

          {/* Grid of Other Solvers (Matching Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDirectorySolvers.slice(1).map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSolverDetail(s.id)}
                className="ix-card p-5 space-y-4 hover:border-[#C69214] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E8E4DA] flex items-center justify-center text-[#7A7568] group-hover:text-[#C69214] transition-colors">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#1A1915] font-sans group-hover:text-[#C69214] transition-colors">
                        {s.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#7A7568] uppercase">
                        {s.specialized}
                      </span>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${s.isOffline ? 'bg-slate-300' : 'bg-[#C69214]'}`} />
                </div>

                <div className="space-y-2 font-mono text-xs border-t border-[#E8E4DA] pt-3">
                  <div className="flex justify-between text-[#7A7568]">
                    <span>TVL</span>
                    <span className="font-bold text-[#1A1915]">{s.tvl}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7568]">
                    <span>SUCCESS RATE</span>
                    <span className="font-bold text-[#1A1915]">{s.successRate}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7568]">
                    <span>ACTIVE BIDS</span>
                    <span className="font-bold text-[#1A1915]">{s.activeBids}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
