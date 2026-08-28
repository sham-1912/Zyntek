import React, { useState } from 'react';
import type { IntentHistoryItem } from '../services/types';
import { Award, Cpu, TrendingUp, UserCheck } from 'lucide-react';

interface SolverDashboardProps {
  history: IntentHistoryItem[];
}

export const SolverDashboard: React.FC<SolverDashboardProps> = ({ history }) => {
  const [activeSolver, setActiveSolver] = useState<'alpha' | 'flash' | 'shield'>('alpha');

  const solverProfiles = {
    alpha: {
      name: 'Solver Alpha (Cost Optimizer)',
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      reputation: 94,
      totalBondStaked: 12500,
      totalEarnedFees: 48.50,
      totalFulfilled: 14,
      tagline: 'Lowest fee ($1.50) & highest output routing',
    },
    flash: {
      name: 'Solver Flash (Speed Specialist)',
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      reputation: 92,
      totalBondStaked: 18200,
      totalEarnedFees: 84.20,
      totalFulfilled: 22,
      tagline: 'Ultra-fast execution (1.8s) & low slippage',
    },
    shield: {
      name: 'Solver Shield (Safety Vault)',
      address: '0x15d34AA54267DB7D7c367839AAf71A00a2C6A65E',
      reputation: 99,
      totalBondStaked: 45000,
      totalEarnedFees: 112.80,
      totalFulfilled: 31,
      tagline: 'Maximum collateral bond (150%) & zero slashing history',
    },
  };

  const current = solverProfiles[activeSolver];

  const solverIntents = history.filter(
    (h) => h.winningBid?.solverProfile === activeSolver || h.status === 'broadcasting_solvers' || h.status === 'bidding_window'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Solver Profile Selector Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-cyan-900/50">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-mono">Two-Sided Marketplace — Solver Agent Perspective</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch between Ganache solver wallets to view active bonds, reputation, and earned fee ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveSolver('alpha')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              activeSolver === 'alpha'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Solver Alpha
          </button>

          <button
            type="button"
            onClick={() => setActiveSolver('flash')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              activeSolver === 'flash'
                ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Solver Flash
          </button>

          <button
            type="button"
            onClick={() => setActiveSolver('shield')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              activeSolver === 'shield'
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Solver Shield
          </button>
        </div>
      </div>

      {/* Solver Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Solver Account Address</span>
          <div className="text-white font-bold text-xs truncate">{current.address}</div>
          <span className="text-slate-500 text-[10px]">{current.tagline}</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Reputation Score
          </span>
          <div className="text-xl font-bold text-amber-400">{current.reputation}/100</div>
          <span className="text-emerald-400 text-[10px]">Top 5% Solver Rank</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Active Bond Staked
          </span>
          <div className="text-xl font-bold text-cyan-400">${current.totalBondStaked.toLocaleString()} USDC</div>
          <span className="text-slate-500 text-[10px]">Staked in SolverBonding.sol</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Total Earned Fees
          </span>
          <div className="text-xl font-bold text-emerald-400">${current.totalEarnedFees.toFixed(2)} USDC</div>
          <span className="text-slate-500 text-[10px]">{current.totalFulfilled} Intents Settled</span>
        </div>
      </div>

      {/* Solver Active Intents Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-mono">Solver Positions & Active Intent Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">Showing {solverIntents.length} Intent Positions</span>
        </div>

        {solverIntents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No active intent bids for this solver profile yet. Broadcast a new intent from the User View!
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {solverIntents.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Intent #{item.intent.intentId}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Route: ${item.intent.sourceAmount} USDC (Sepolia) &rarr; ${item.winningBid?.proposedOutput || item.intent.minAcceptableOutput} USDC (Solana)
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-emerald-400 font-bold">
                    Fee Earned: +${item.winningBid?.feeUsd || 1.50} USDC
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Bond Locked: ${item.winningBid?.collateralOfferedUsd || 525} USDC
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
