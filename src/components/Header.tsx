import React from 'react';
import { Layers, ShieldCheck, Cpu, Wallet, History } from 'lucide-react';

interface HeaderProps {
  contractState: {
    escrowLockedUsd: number;
    solverBondLockedUsd: number;
    slashedTotalUsd: number;
    settledTotalUsd: number;
  };
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ contractState, onOpenHistory, historyCount }) => {
  return (
    <header className="border-b border-indigo-900/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">ZYNTEK</h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                Intent Protocol v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Decentralized Cross-Chain Intent Solver Network</p>
          </div>
        </div>

        {/* Live EVM & Solana Network Metrics */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">EVM Escrow TVL:</span>
            <span className="text-emerald-400 font-bold">${contractState.escrowLockedUsd.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Solver Bonds:</span>
            <span className="text-cyan-400 font-bold">${contractState.solverBondLockedUsd.toLocaleString()}</span>
          </div>

          {contractState.slashedTotalUsd > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-400">Slashed:</span>
              <span className="text-rose-400 font-bold">${contractState.slashedTotalUsd.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* My Intents & Wallet Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 transition-all"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>My Intents</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30">
            <Wallet className="w-3.5 h-3.5" />
            <span>0x71C...4A92</span>
          </button>
        </div>
      </div>
    </header>
  );
};
