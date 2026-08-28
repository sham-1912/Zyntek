import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Layers, Send, FileCheck, CheckCircle2 } from 'lucide-react';

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
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 border-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs font-mono">
            <span className="text-slate-400">Network Status: </span>
            <span className="text-emerald-400 font-bold">3 Solvers Online</span>
            <span className="text-slate-500 mx-2">|</span>
            <span className="text-slate-400">Avg Response: </span>
            <span className="text-cyan-400 font-bold">~1.8s</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-400">Total Escrow TVL: </span>
            <span className="text-white font-bold">${(125400 + contractState.escrowLockedUsd).toLocaleString()} USDC</span>
          </div>
          <div>
            <span className="text-slate-400">Solver Collateral Bonds: </span>
            <span className="text-indigo-400 font-bold">${(188100 + contractState.solverBondLockedUsd).toLocaleString()} USDC</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPrimer(!showPrimer)}
          className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-mono"
        >
          <span>{showPrimer ? 'Hide Primer' : 'How Zyntek Works'}</span>
          {showPrimer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible 4-Step Primer Card */}
      {showPrimer && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>How Zyntek Works — Trust-Minimized Intent Execution</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">4-Step Protocol Lifecycle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            {/* Step 1 */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span>1. State Intent</span>
                <Send className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-tight">
                State what asset & chain you want, with priority sliders (Cost/Speed/Safety).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>2. Competitive Bids</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-tight">
                Independent solver agents compete in an auction to offer the best route.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>3. Hybrid Verify</span>
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-tight">
                Solver stakes 100% bond. Proof is verified optimistically or via ZK/Oracle.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>4. Auto Settle</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-tight">
                Verified delivery releases escrow. Failure automatically slashes bond & refunds user.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
