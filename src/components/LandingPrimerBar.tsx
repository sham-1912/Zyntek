import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Send, FileCheck, CheckCircle2 } from 'lucide-react';

interface LandingPrimerBarProps {
  contractState: {
    escrowLockedUsd: number;
    solverBondLockedUsd: number;
    slashedTotalUsd: number;
    settledTotalUsd: number;
  };
}

export const LandingPrimerBar: React.FC<LandingPrimerBarProps> = ({ contractState }) => {
  const [showPrimer, setShowPrimer] = useState<boolean>(true);

  return (
    <div className="space-y-4">
      {/* Live System Network Stats Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cost animate-ping" />
          <div className="text-metadata">
            <span className="text-slate-400">Network Status: </span>
            <span className="text-cost font-bold">3 Solvers Online</span>
            <span className="text-slate-600 mx-2">|</span>
            <span className="text-slate-400">Avg Latency: </span>
            <span className="text-speed font-bold">~1.8s</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-metadata">
          <div>
            <span className="text-slate-400">Total Escrow TVL: </span>
            <span className="text-cost font-bold">${(125400 + contractState.escrowLockedUsd).toLocaleString()} USDC</span>
          </div>
          <div>
            <span className="text-slate-400">Solver Collateral Bonds: </span>
            <span className="text-safety font-bold">${(188100 + contractState.solverBondLockedUsd).toLocaleString()} USDC</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPrimer(!showPrimer)}
          className="text-metadata text-indigo-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
        >
          <span>{showPrimer ? 'Hide Primer' : 'How Zyntek Works'}</span>
          {showPrimer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible 4-Step Primer Card */}
      {showPrimer && (
        <div className="bg-slate-950/70 rounded-2xl p-5 space-y-4 border border-slate-800/80 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-body font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-safety" />
              <span>How Zyntek Works — Trust-Minimized Intent Execution</span>
            </h3>
            <span className="text-metadata">4-Step Protocol Lifecycle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-3.5 rounded-xl space-y-1.5 border-l-2 border-cost">
              <div className="flex items-center gap-2 text-cost text-xs font-mono font-bold">
                <Send className="w-3.5 h-3.5" />
                <span>1. User Expresses Intent</span>
              </div>
              <p className="text-metadata text-slate-300">
                You specify input assets, target output, and priority weights (Cost vs. Speed vs. Safety).
              </p>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl space-y-1.5 border-l-2 border-speed">
              <div className="flex items-center gap-2 text-speed text-xs font-mono font-bold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>2. Solvers Compete</span>
              </div>
              <p className="text-metadata text-slate-300">
                Independent solvers submit routes & collateral bonds. Scoring engine ranks bids against your preferences.
              </p>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl space-y-1.5 border-l-2 border-safety">
              <div className="flex items-center gap-2 text-safety text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Off-Chain Execution</span>
              </div>
              <p className="text-metadata text-slate-300">
                Winning solver fulfills destination leg on Solana using private flashbots or aggregated liquidity.
              </p>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl space-y-1.5 border-l-2 border-cost">
              <div className="flex items-center gap-2 text-cost text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>4. Hybrid Verify & Settle</span>
              </div>
              <p className="text-metadata text-slate-300">
                ZK-Oracle proof or optimistic window validates delivery before EVM escrow is released to the solver.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
